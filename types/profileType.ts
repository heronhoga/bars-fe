export interface Profile {
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