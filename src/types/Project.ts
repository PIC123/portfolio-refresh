export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  images?: string[];
  tags?: string[];
  tools?: string[];
  year?: string;
  writeup?: string;
}
