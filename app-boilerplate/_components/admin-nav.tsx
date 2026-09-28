"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/content", label: "Content" },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <div className="flex h-full">
      <aside className="w-60 shrink-0 border-r bg-white/40 p-4">
        <div className="text-xs font-semibold uppercase text-slate-500">Admin</div>
        <nav className="mt-3 space-y-1 text-sm">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`block rounded px-3 py-2 hover:bg-slate-100 ${
                pathname === i.href ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{/* children are rendered by layout */}</div>
    </div>
  )
}
