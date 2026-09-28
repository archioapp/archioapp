"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useConfluenceStore } from "@/stores/confluence-store"
import { ULTRA_CONFLUENCES, type UltraConfluenceId } from "@/components/ultra-confluence/types"
import { X } from "lucide-react"

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

const TOTAL = ULTRA_CONFLUENCES.length

export function ConfluenceConfigModal({ open, onOpenChange }: Props) {
  const { pinnedConfluences, setPinnedConfluences } = useConfluenceStore()

  const ultraIds = useMemo(() => ULTRA_CONFLUENCES.map((c) => c.id), [])
  const validSet = useMemo(() => new Set(ultraIds), [ultraIds])

  const initialSelected = useMemo<UltraConfluenceId[]>(() => {
    const fromStore = (pinnedConfluences || []) as string[]
    const filtered = fromStore.filter((id) => validSet.has(id as UltraConfluenceId)) as UltraConfluenceId[]
    // If store empty or contains non-ultra, default to all ultra ids so the panel is fully populated
    return filtered.length ? filtered : (ultraIds as UltraConfluenceId[])
  }, [pinnedConfluences, ultraIds, validSet])

  const [temp, setTemp] = useState<UltraConfluenceId[]>(initialSelected)
  useEffect(() => setTemp(initialSelected), [initialSelected])

  // Shine animation restart key (increments to restart the CSS animation each hover)
  const [shineKey, setShineKey] = useState(0)

  const toggle = (id: UltraConfluenceId) =>
    setTemp((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const save = () => {
    setPinnedConfluences(temp)
    onOpenChange(false)
  }
  const cancel = () => {
    setTemp(initialSelected)
    onOpenChange(false)
  }

  const selectedCount = temp.length

  const handleMouseEnter = () => {
    // trigger the premium glass sweep on every hover over the panel
    setShineKey((k) => k + 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onMouseEnter={handleMouseEnter}
        className={cn(
          // Sizing and viewport safety
          "max-w-[1000px] w-[min(100vw-32px,1000px)] max-h-[88vh] overflow-y-auto rounded-2xl border p-0 text-zinc-100 relative",
          // Box shadow glow
          "shadow-[0_0_60px_rgba(147,51,234,0.25)]",
          // Hard center in viewport (prevents being cut off at bottom)
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        )}
        style={{
          // Premium GLASS background
          background: "rgba(10, 10, 20, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(147, 51, 234, 0.3)",
          // Absolute centering safeguards
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Purple gradient mesh overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background: "radial-gradient(60% 50% at 20% 10%, rgba(147, 51, 234, 0.15), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[80%] w-[60%] opacity-50 blur-3xl"
          aria-hidden
          style={{
            background: "radial-gradient(45% 45% at 60% 60%, rgba(168,85,247,0.15), transparent 60%)",
          }}
        />

        {/* Diagonal GLASS shine sweep across the entire panel surface.
            Triggers on every hover via shineKey re-mount. */}
        <div
          key={shineKey}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[35%] rotate-[18deg] z-[1]"
          style={{
            background:
              "linear-gradient(130deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.18) 12%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0) 60%)",
            animation: open ? "glassSweep 900ms ease-in-out 1 forwards" : "none",
            opacity: 0,
          }}
        />

        {/* Foreground content is above background meshes, below the sweep (z-10) */}
        <div className="relative z-10">
          <DialogHeader className="flex items-start justify-between gap-4 p-6 pb-3">
            <div className="space-y-1.5">
              <DialogTitle className="text-xl font-semibold tracking-tight text-white">
                Customize Confluence Panel
              </DialogTitle>
              <p className="text-sm text-zinc-400">Select confluences to display on your panel.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className={cn(
                "h-8 w-8 rounded-lg text-zinc-300",
                "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
              )}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {/* Options grid */}
          <div className="grid grid-cols-1 gap-3 px-6 pb-3 pt-2 sm:grid-cols-2 md:grid-cols-3">
            {ULTRA_CONFLUENCES.map((c) => {
              const Icon = c.icon
              const isSelected = temp.includes(c.id)

              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={cn(
                    // Glass morphism card
                    "premium-glass-segment group relative flex min-h-[120px] items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200",
                    "bg-white/5 hover:bg-white/[0.08] backdrop-blur-xl",
                    "border-white/10 hover:border-purple-400/40",
                    // Hover animation + glow
                    "hover:scale-[1.03] hover:shadow-[0_0_0_1px_rgba(168,85,247,0.25),0_10px_30px_-10px_rgba(147,51,234,0.35)]",
                    // Selection purple glow
                    isSelected &&
                      "shadow-[0_0_30px_rgba(147,51,234,0.5)] ring-2 ring-purple-500/40 border-purple-400/40",
                  )}
                >
                  {/* Subtle glow layer */}
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -inset-12 rounded-[28px] opacity-0 blur-3xl transition-opacity duration-200",
                      "bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-transparent",
                      "group-hover:opacity-70",
                      isSelected && "opacity-100",
                    )}
                  />
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/30 bg-gradient-to-br from-purple-500/25 to-fuchsia-500/25 shadow-[inset_0_0_20px_rgba(147,51,234,0.35),0_0_30px_rgba(168,85,247,0.25)]">
                    <Icon className="h-5 w-5 text-purple-300" />
                  </div>
                  <div className="relative min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-white">{c.name}</span>
                      {/* Technical badge */}
                      <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-200 ring-1 ring-inset ring-purple-500/30">
                        Technical
                      </span>
                      {isSelected && (
                        <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-100 ring-1 ring-inset ring-purple-500/40">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{c.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 p-6 pt-4">
            <span className="text-sm text-zinc-300">
              <span className="font-medium text-purple-300">{selectedCount}</span> / {TOTAL} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={cancel}
                className={cn(
                  "rounded-lg px-4 text-zinc-200",
                  "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                )}
              >
                Cancel
              </Button>
              <Button
                onClick={save}
                disabled={selectedCount === 0}
                className={cn(
                  "rounded-lg px-5 font-medium text-black",
                  // Purple/amber gradient glow like ultra cards
                  "bg-gradient-to-br from-[#a855f7] via-[#9333ea] to-[#f59e0b]",
                  "hover:brightness-110 active:brightness-95",
                  "shadow-[0_10px_30px_-10px_rgba(147,51,234,0.65),0_0_20px_rgba(245,158,11,0.45)]",
                )}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Keyframes for the global GLASS sweep effect */}
        <style jsx>{`
          @keyframes glassSweep {
            0% {
              transform: translateX(-65%) translateY(-10%) rotate(18deg);
              opacity: 0.0;
            }
            12% {
              opacity: 0.55;
            }
            50% {
              opacity: 0.32;
            }
            100% {
              transform: translateX(65%) translateY(10%) rotate(18deg);
              opacity: 0.0;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
