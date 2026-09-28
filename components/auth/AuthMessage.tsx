"use client"

import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface AuthMessageProps {
  type: 'error' | 'success' | 'info'
  message: string
  className?: string
}

export function AuthMessage({ type, message, className }: AuthMessageProps) {
  if (!message) return null

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  }
  
  const Icon = icons[type]

  return (
    <div 
      className={cn(
        "py-2.5 px-3",
        "font-mono text-[11px] tracking-wide",
        "transition-all duration-200",
        "flex items-start gap-2",
        // Error styling - NO border radius
        type === 'error' && [
          "bg-red-500/5",
          "border border-red-500/15",
          "text-red-400/90"
        ],
        // Success styling - NO border radius
        type === 'success' && [
          "bg-emerald-500/5",
          "border border-emerald-500/15",
          "text-emerald-400/90"
        ],
        // Info styling - NO border radius
        type === 'info' && [
          "bg-blue-500/5",
          "border border-blue-500/15",
          "text-blue-400/90"
        ],
        className
      )}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-80" />
      <span>{message}</span>
    </div>
  )
}
