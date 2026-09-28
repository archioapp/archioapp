"use client"

import type React from "react"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface InteractiveBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function InteractiveBorderCard({ children, className, ...props }: InteractiveBorderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      cardRef.current.style.setProperty("--mouse-x", `${x}px`)
      cardRef.current.style.setProperty("--mouse-y", `${y}px`)
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn("interactive-border rounded-2xl p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}
