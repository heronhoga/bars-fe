"use client"

import { CheckCircle, X, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type AlertType = "success" | "error" | "warning" | "info"

interface CustomConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: AlertType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  showCloseButton?: boolean
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
    buttonColor: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    buttonColor: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/20",
    buttonColor: "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    buttonColor: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
  },
}

export function CustomConfirm({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCloseButton = true,
}: CustomConfirmProps) {
  if (!isOpen) return null

  const config = alertConfig[type]
  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${config.iconBg} rounded-full p-2`}>
                <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            {showCloseButton && (
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="border-white/30 text-slate-800 hover:bg-white/10">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} className={config.buttonColor}>
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
