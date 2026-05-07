export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  images?: string[];
  startDate?: string;
  writeup?: string;
  technologies?: Technology[];
}

export interface Technology {
  class: string;
  name: string;
}
