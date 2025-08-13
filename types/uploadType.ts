export interface UploadFormData {
  title: string
  description: string
  genre: string
  tags: string
  file: File | null
}

export interface UploadFormErrors {
  title?: string
  description?: string
  genre?: string
  tags?: string
  file?: string
}