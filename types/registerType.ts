export interface RegisterFormData {
  username: string
  password: string
  confirmPassword: string
  region: string
  discord: string
}

export interface FormErrors {
  username?: string
  password?: string
  confirmPassword?: string
  region?: string
  discord?: string
}