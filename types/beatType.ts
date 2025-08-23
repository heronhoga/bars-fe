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
  discord: string;
  genre: string;
  tags: string;
  file_url: string;
  file_size: number;
  created_at: string;
  likes: number;
  is_liked: string;
}

export interface BeatSearch {
  message: string;
  data: BeatFull[];
  totalPages: number;
}

export interface BeatByUser {
  id: string;
  title: string;
  description: string;
  genre: string;
  tags: string;
  file_url: string;
  file_size: number;
  created_at: string;
  likes: number;
  is_liked: string;
}

export interface BeatByUserResponse {
  data: BeatByUser[];
  totalPages: number;
}

export interface BeatUpdate {
  title: string;
  description: string;
  genre: string;
  tags: string;
}

export interface BeatUpdateFormErrors {
  title?: string;
  description?: string;
  genre?: string;
  tags?: string;
}
