"use client"

import { type ReactNode } from "react"
import { AuthBackground } from "./AuthBackground"
import { cn } from "@/lib/utils"
import "@/styles/auth-animations.css"

interface AuthLayoutProps {
  children: ReactNode
  isFormActive?: boolean
  isSubmitting?: boolean
  isSuccess?: boolean
}

export function AuthLayout({ 
  children, 
  isFormActive = false,
  isSubmitting = false,
  isSuccess = false
}: AuthLayoutProps) {
  return (
    <>
      {/* Ambient background system */}
      <AuthBackground 
        isActive={isFormActive}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
      />

      {/* Main content area */}
      <main className={cn("relative z-10 w-full")}>
        <div className="w-full">
          {children}
        </div>
      </main>
    </>
  )
}
