"use client"

export function ArchioFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-cyan-400/20 to-violet-500/15 ring-1 ring-cyan-400/25">
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-white/80">Archio</span>
          <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
            © {new Date().getFullYear()}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-5 text-[12.5px] text-white/45">
          {[
            { href: "#system", label: "System" },
            { href: "#pathways", label: "Pathways" },
            { href: "#manifesto", label: "Manifesto" },
            { href: "#join", label: "Early access" },
            { href: "#", label: "Privacy" },
            { href: "#", label: "Terms" },
          ].map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
          Private beta · Q2
        </div>
      </div>
    </footer>
  )
}
