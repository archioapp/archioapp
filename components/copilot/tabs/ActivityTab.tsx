"use client"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSuggestions } from "@/lib/copilot/suggest"

export function ActivityTab() {
  const { items, dismiss } = useSuggestions()
  const [hoverId, setHoverId] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-white/10 text-xs uppercase tracking-wide text-white/70">Activity</div>

      <ScrollArea className="flex-1 p-3">
        {!items.length && (
          <div className="text-xs text-white/60 rounded-lg border border-white/10 p-3">No suggestions yet.</div>
        )}

        <div className="space-y-3 relative">
          {items.map((s) => (
            <div
              key={s.id}
              className="relative rounded-lg border border-white/10 p-3 hover:border-white/20 cursor-pointer transition"
              onMouseEnter={() => setHoverId(s.id)}
              onMouseLeave={() => setHoverId((v) => (v === s.id ? null : v))}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("copilot:activity:ask", { detail: { text: s.chatSeed ?? s.title } }),
                )
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{s.title}</div>
                {s.tag && (
                  <span className="text-[10px] px-1.5 py-[2px] rounded bg-white/10 border border-white/15">
                    {s.tag}
                  </span>
                )}
              </div>

              {s.detail && <p className="text-xs text-white/70 mt-1">{s.detail}</p>}

              {s.actions?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.actions.map((a) => (
                    <button
                      key={a.id}
                      className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation() // prevent card click
                        a.run?.(a.payload)
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                  {!s.sticky && (
                    <button
                      className="text-[11px] px-2 py-1 rounded bg-transparent border border-transparent text-white/60 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        dismiss(s.id!)
                      }}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              ) : null}

              {hoverId === s.id && s.hover && (
                <div className="absolute left-0 top-full mt-2 w-[260px] rounded-md bg-black/85 border border-white/10 p-3 shadow-xl backdrop-blur z-50">
                  <div className="text-xs font-medium mb-1">{s.hover.title}</div>
                  <div className="text-[11px] text-white/70 whitespace-pre-wrap">{s.hover.body}</div>
                  {/* small arrow */}
                  <div className="absolute -top-2 left-4 w-3 h-3 rotate-45 bg-black/85 border-l border-t border-white/10" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
