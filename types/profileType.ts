export interface Profile {
    id: string
    username: string
    region : string
    discord: string
    tracks: number
    likes: number
}

export interface BeatByProfile {
    created_at: string,
    description: string,
    file_size: number,
    file_url: string,
    genre: string,
    id: string,
    tags: string,
    title: string,
}

export interface EditProfileFormData {
  id?: string;
  username?: string;
  region?: string;
  discord?: string;
}

export interface EditProfileFormErrors {
  id?: string;
  username?: string;
  region?: string;
  discord?: string;
}