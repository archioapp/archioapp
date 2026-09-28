import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Header from "./_components/header"
import Footer from "./_components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "GoPilot",
  description: "GoPilot — modern app with marketing, auth, app, account, and admin sections.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-white text-slate-900 antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-8rem)] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
