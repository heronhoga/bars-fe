export interface Beat {
  id: string;
  title: string;
  username: string;
  file_url: string;
  likes: number;
}

export interface BeatFull {
  id: string;
  title: string;
  username: string;
  description: string;
  genre: string;
  tags: string;
  file_url: string;
  file_size: number;
  created_at: string;
  likes: number;
  is_liked: string;
}
