import { type AlertType } from "@/components/custom-alert"

export interface AlertState {
  isOpen: boolean
  type: AlertType
  title: string
  message: string
  confirmText?: string
}