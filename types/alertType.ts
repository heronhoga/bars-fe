import { type AlertType } from "@/components/custom-alert"

export interface AlertState {
  isOpen: boolean
  type: AlertType
  title: string
  message: string
  confirmText?: string
}

export interface ConfirmState  {
  isOpen: boolean
  type: AlertType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onClose?: () => void
}