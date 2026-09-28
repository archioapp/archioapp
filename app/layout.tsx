import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { FloatingNav } from "@/components/floating-nav"

import AppInit from "@/components/system/AppInit"
import UserButton from "@/components/auth/UserButton"
import { AuthProvider } from "@/lib/auth/AuthProvider"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

// Monospace for the cockpit's instrument readouts, mono-caps eyebrows,
// tabular numerals, and source-path codes. The Visual DNA tokens
// reference `var(--font-mono)` — defining it here makes every mono-cap
// across the platform render intentionally instead of falling back.
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "ArchioAI Trading Terminal",
  description: "Professional-grade AI-powered trading terminal",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontMono.variable)}>
        <AuthProvider>
          <AppInit />
          <FloatingNav />
          {children}

          <UserButton />
        </AuthProvider>
      </body>
    </html>
  )
}
