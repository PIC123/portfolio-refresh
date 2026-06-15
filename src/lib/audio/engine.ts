// A small Web Audio engine that actually plays music.
//
// Two kinds of tracks are supported:
//   - "synth": procedurally generated (no assets, no licensing). A tiny
//     step-sequencer schedules arp + bass + pad + kick voices.
//   - "file":  a real audio file or stream URL, played via an <audio>
//     element routed through the same graph (so the visualizer + EQ work
//     on it too). Drop files in /public/audio and add them to tracks.ts.
//
// Everything routes through: voices -> bus -> [10-band EQ] -> master gain
// -> analyser -> destination. The analyser is exposed so visualizers read
// REAL frequency data.

export type SynthTrack = {
  id: string;
  kind: "synth";
  title: string;
  subtitle: string;
  bpm: number;
  lengthSec: number;
  waveform: OscillatorType;
  scale: number[]; // MIDI notes for the arpeggio
  bass: number[]; // MIDI notes, one per beat
  chord: number[]; // MIDI notes for the sustained pad
  swing?: boolean;
};

export type FileTrack = {
  id: string;
  kind: "file";
  title: string;
  subtitle: string;
  src: string;
  lengthSec?: number;
};

export type Track = SynthTrack | FileTrack;

export type EngineState = {
  ready: boolean;
  playing: boolean;
  trackIndex: number;
  elapsed: number;
  duration: number;
  volume: number;
};

export const EQ_FREQUENCIES = [
  60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000,
];

type Listener = (state: EngineState) => void;

function midiToFreq(m: number): number {
  return 440 * Math.pow(2, (m - 69) / 12);
}

type WindowWithWebkit = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private bus: GainNode | null = null;
  private master: GainNode | null = null;
  private eqBands: BiquadFilterNode[] = [];
  analyser: AnalyserNode | null = null;

  private tracks: Track[];
  private listeners = new Set<Listener>();
  private eqGains: number[] = EQ_FREQUENCIES.map(() => 0);

  // synth scheduler
  private schedulerTimer: ReturnType<typeof setTimeout> | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private readonly lookaheadMs = 25;
  private readonly scheduleAhead = 0.12;

  // file playback
  private mediaEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;

  // elapsed bookkeeping
  private playStartCtxTime = 0;
  private elapsedAtStart = 0;
  private rafId = 0;
  private lastNotify = 0;

  private state: EngineState = {
    ready: false,
    playing: false,
    trackIndex: 0,
    elapsed: 0,
    duration: 0,
    volume: 0.7,
  };

  constructor(tracks: Track[]) {
    this.tracks = tracks;
    this.state.duration = this.currentTrackDuration();
  }

  // --- subscription ---------------------------------------------------------

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  private notify(force = false) {
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    if (!force && now - this.lastNotify < 120) return;
    this.lastNotify = now;
    const snapshot = { ...this.state };
    this.listeners.forEach((fn) => fn(snapshot));
  }

  getState(): EngineState {
    return this.state;
  }

  getEqGains(): number[] {
    return this.eqGains;
  }

  // --- graph setup ----------------------------------------------------------

  private ensureContext() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;

    this.bus = ctx.createGain();
    this.master = ctx.createGain();
    this.master.gain.value = this.state.volume;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.8;

    // Build the 10-band peaking EQ chain.
    let node: AudioNode = this.bus;
    this.eqBands = EQ_FREQUENCIES.map((freq, i) => {
      const band = ctx.createBiquadFilter();
      band.type = "peaking";
      band.frequency.value = freq;
      band.Q.value = 1.1;
      band.gain.value = this.eqGains[i];
      node.connect(band);
      node = band;
      return band;
    });

    node.connect(this.master);
    this.master.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    this.state.ready = true;
    this.notify(true);
  }

  // --- transport ------------------------------------------------------------

  async play() {
    this.ensureContext();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") await this.ctx.resume();

    const track = this.tracks[this.state.trackIndex];
    this.playStartCtxTime = this.ctx.currentTime;
    this.elapsedAtStart = this.state.elapsed;

    if (track.kind === "synth") {
      this.stopMedia();
      this.nextNoteTime = this.ctx.currentTime + 0.05;
      this.step = Math.floor(
        (this.state.elapsed / (60 / track.bpm / 4)) % 16,
      );
      this.runScheduler();
    } else {
      this.startMedia(track);
    }

    this.state.playing = true;
    this.notify(true);
    this.startElapsedLoop();
  }

  pause() {
    this.state.playing = false;
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.mediaEl) this.mediaEl.pause();
    if (this.ctx) this.ctx.suspend();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.notify(true);
  }

  toggle() {
    if (this.state.playing) this.pause();
    else this.play();
  }

  async next() {
    await this.changeTrack(
      (this.state.trackIndex + 1) % this.tracks.length,
    );
  }

  async prev() {
    await this.changeTrack(
      (this.state.trackIndex - 1 + this.tracks.length) % this.tracks.length,
    );
  }

  async changeTrack(index: number) {
    const wasPlaying = this.state.playing;
    this.pause();
    this.state.trackIndex = index;
    this.state.elapsed = 0;
    this.state.duration = this.currentTrackDuration();
    this.step = 0;
    this.notify(true);
    if (wasPlaying) await this.play();
  }

  seek(seconds: number) {
    const track = this.tracks[this.state.trackIndex];
    this.state.elapsed = Math.max(0, Math.min(seconds, this.state.duration));
    if (track.kind === "file" && this.mediaEl) {
      this.mediaEl.currentTime = this.state.elapsed;
    } else if (this.ctx) {
      this.elapsedAtStart = this.state.elapsed;
      this.playStartCtxTime = this.ctx.currentTime;
    }
    this.notify(true);
  }

  setVolume(v: number) {
    this.state.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        this.state.volume,
        this.ctx.currentTime,
        0.02,
      );
    }
    this.notify(true);
  }

  setEqBand(index: number, dB: number) {
    this.eqGains[index] = dB;
    const band = this.eqBands[index];
    if (band && this.ctx) {
      band.gain.setTargetAtTime(dB, this.ctx.currentTime, 0.02);
    }
    this.notify(true);
  }

  resetEq() {
    this.eqGains = this.eqGains.map(() => 0);
    if (this.ctx) {
      this.eqBands.forEach((b) =>
        b.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.02),
      );
    }
    this.notify(true);
  }

  getAnalyserData(target: Uint8Array): boolean {
    if (!this.analyser) return false;
    // Cast through a loose signature to stay compatible across TS DOM lib
    // versions (the param type was made generic in newer libs).
    (
      this.analyser.getByteFrequencyData as (a: Uint8Array) => void
    )(target);
    return true;
  }

  dispose() {
    this.pause();
    this.stopMedia();
    if (this.ctx) this.ctx.close();
    this.ctx = null;
  }

  // --- helpers --------------------------------------------------------------

  get trackList(): Track[] {
    return this.tracks;
  }

  private currentTrackDuration(): number {
    const t = this.tracks[this.state.trackIndex];
    if (t.kind === "synth") return t.lengthSec;
    return t.lengthSec ?? 0;
  }

  private startElapsedLoop() {
    const tick = () => {
      if (!this.state.playing || !this.ctx) return;
      const track = this.tracks[this.state.trackIndex];
      if (track.kind === "file" && this.mediaEl) {
        this.state.elapsed = this.mediaEl.currentTime;
        if (this.mediaEl.duration && !Number.isNaN(this.mediaEl.duration)) {
          this.state.duration = this.mediaEl.duration;
        }
      } else {
        const raw =
          this.elapsedAtStart +
          (this.ctx.currentTime - this.playStartCtxTime);
        this.state.elapsed = raw % this.state.duration;
      }
      this.notify();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  // --- synth scheduler ------------------------------------------------------

  private runScheduler() {
    if (!this.ctx) return;
    const track = this.tracks[this.state.trackIndex];
    if (track.kind !== "synth") return;
    const secondsPer16th = 60 / track.bpm / 4;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAhead) {
      this.scheduleStep(track, this.step, this.nextNoteTime);
      let dt = secondsPer16th;
      if (track.swing && this.step % 2 === 0) dt *= 1.18;
      else if (track.swing) dt *= 0.82;
      this.nextNoteTime += dt;
      this.step = (this.step + 1) % 16;
    }
    this.schedulerTimer = setTimeout(() => this.runScheduler(), this.lookaheadMs);
  }

  private scheduleStep(track: SynthTrack, step: number, time: number) {
    const secondsPer16th = 60 / track.bpm / 4;

    // Arpeggio (lead) — every 16th.
    const arpNote = track.scale[step % track.scale.length] + 12;
    this.playTone(midiToFreq(arpNote), time, secondsPer16th * 2.4, {
      type: track.waveform,
      peak: 0.16,
    });

    // Bass — every quarter note.
    if (step % 4 === 0) {
      const bassNote = track.bass[(step / 4) % track.bass.length] - 12;
      this.playTone(midiToFreq(bassNote), time, secondsPer16th * 3.6, {
        type: "triangle",
        peak: 0.32,
      });
      this.playKick(time);
    }

    // Pad chord — once per bar.
    if (step === 0) {
      track.chord.forEach((n) =>
        this.playTone(midiToFreq(n), time, secondsPer16th * 15, {
          type: "sine",
          peak: 0.06,
        }),
      );
    }
  }

  private playTone(
    freq: number,
    time: number,
    dur: number,
    opts: { type: OscillatorType; peak: number },
  ) {
    if (!this.ctx || !this.bus) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = opts.type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(opts.peak, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(gain).connect(this.bus);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  private playKick(time: number) {
    if (!this.ctx || !this.bus) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(48, time + 0.12);
    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    osc.connect(gain).connect(this.bus);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  // --- file playback --------------------------------------------------------

  private startMedia(track: FileTrack) {
    if (!this.ctx || !this.bus) return;
    if (!this.mediaEl) {
      this.mediaEl = new Audio();
      this.mediaEl.crossOrigin = "anonymous";
      this.mediaEl.loop = true;
      this.mediaSource = this.ctx.createMediaElementSource(this.mediaEl);
      this.mediaSource.connect(this.bus);
    }
    if (this.mediaEl.src !== new URL(track.src, location.href).href) {
      this.mediaEl.src = track.src;
    }
    this.mediaEl.currentTime = this.state.elapsed || 0;
    void this.mediaEl.play();
  }

  private stopMedia() {
    if (this.mediaEl) {
      this.mediaEl.pause();
    }
  }
}
