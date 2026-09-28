"use client"

import type { MentorTemplate, MentorStatus } from "@/lib/mentor/types"

const STATUS_CONFIG: Record<MentorStatus, { color: string; label: string; bg: string }> = {
  ACTIVE:  { color: "#10b981", label: "ACTIVE",  bg: "rgba(16,185,129,0.08)" },
  WAITING: { color: "#f59e0b", label: "WAITING", bg: "rgba(245,158,11,0.08)" },
  OFFLINE: { color: "#6b7280", label: "OFFLINE", bg: "rgba(107,114,128,0.08)" },
}

interface Props {
  template: MentorTemplate
  status: MentorStatus
}

export function MentorIdentityHeader({ template, status }: Props) {
  const s = STATUS_CONFIG[status]

  return (
    <div className="flex items-center gap-3 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {/* Avatar */}
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${template.accentColor}18, ${template.accentColor}08)`,
          border: `1.5px solid ${template.accentColor}25`,
        }}
      >
        <span className="text-[11px] font-black font-mono" style={{ color: template.accentColor }}>
          {template.mentorName.slice(0, 2).toUpperCase()}
        </span>
        {/* Live dot */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0e]"
          style={{ backgroundColor: s.color }}
        >
          {status === "ACTIVE" && (
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: s.color, opacity: 0.4 }}
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-white/90 truncate">{template.mentorName}</span>
          <span
            className="text-[7px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded"
            style={{ color: s.color, backgroundColor: s.bg, border: `1px solid ${s.color}20` }}
          >
            {s.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[9px] font-mono text-white/25 truncate">{template.name}</span>
          <span className="text-[9px] font-mono text-white/10">|</span>
          <span className="text-[9px] font-mono text-white/25">{template.session.label}</span>
        </div>
      </div>
    </div>
  )
}
