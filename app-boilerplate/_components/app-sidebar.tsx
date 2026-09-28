"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/usage", label: "Usage" },
  {
    label: "Billing",
    children: [
      { href: "/billing", label: "Overview" },
      { href: "/billing/upgrade", label: "Upgrade" },
      { href: "/billing/downgrade", label: "Downgrade" },
      { href: "/billing/history", label: "History" },
      { href: "/billing/payment-method", label: "Payment Method" },
      { href: "/billing/cancel", label: "Cancel" },
    ],
  },
  {
    label: "Settings",
    children: [
      { href: "/settings", label: "Account" },
      { href: "/settings/notifications", label: "Notifications" },
      { href: "/settings/security", label: "Security" },
    ],
  },
  { href: "/support", label: "Support" },
  { href: "/integrations", label: "Integrations" },
]

export default function AppSidebar() {
  const pathname = usePathname()
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-white/40 p-4 text-sm">
      <div className="space-y-4">
        {nav.map((item, idx) =>
          "href" in item ? (
            <div key={idx}>
              <Link
                href={item.href}
                className={`block rounded px-3 py-2 hover:bg-slate-100 ${
                  pathname === item.href ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            </div>
          ) : (
            <div key={idx}>
              <div className="px-3 pb-1 pt-3 text-xs font-semibold uppercase text-slate-500">{item.label}</div>
              <div className="space-y-1">
                {item.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className={`block rounded px-3 py-2 hover:bg-slate-100 ${
                      pathname === c.href ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </aside>
  )
}
