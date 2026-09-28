"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

export function ArchioNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl" : "backdrop-blur-0"
      }`}
      style={{
        background: scrolled
          ? "linear-gradient(180deg, rgba(5,7,16,0.85) 0%, rgba(5,7,16,0.7) 100%)"
          : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-cyan-400/20 to-violet-500/15 ring-1 ring-cyan-400/25">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <span className="absolute -inset-0.5 rounded-md bg-cyan-400/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">Archio</span>
        </a>

        {/* Center links */}
        <nav className="hidden items-center gap-7 md:flex">
          {[
            { href: "#system", label: "System" },
            { href: "#pathways", label: "Pathways" },
            { href: "#manifesto", label: "Manifesto" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-[13px] text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <a
            href="#join"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-[12.5px] text-white/75 transition-colors hover:bg-white/[0.04] hover:text-white sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href="#join"
            className="group relative inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#05070f] transition-all hover:bg-cyan-200"
          >
            Join early access
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  )
}
