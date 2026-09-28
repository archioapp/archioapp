"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SCREENS } from "./owen-data"
import { ScreenView } from "./owen-screens"
import { EASE, Kbd, OW, openPresenter, useDeckKeys, useDeckSync } from "./owen-ui"

/** What Owen sees. Four screens, arrows to move, nothing else on the glass. */
export function OwenDeck() {
  const [state, update, ready] = useDeckSync()
  const [hints, setHints] = useState(true)
  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }, [])
  useDeckKeys(state, update, { onPresenter: openPresenter, onFullscreen: fullscreen })
  useEffect(() => {
    const id = setTimeout(() => setHints(false), 7000)
    return () => clearTimeout(id)
  }, [])

  const screen = SCREENS[state.i] ?? SCREENS[0]
  const last = SCREENS.length - 1
  const go = (i: number) => update({ i: Math.max(0, Math.min(last, i)) })

  return (
    <div className="owen-scope fixed inset-0 flex flex-col overflow-hidden font-sans" style={{ background: OW.ink, color: OW.paper }}>
      <header className="flex items-center justify-between shrink-0" style={{ padding: "18px 24px 0" }}>
        <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: OW.ash, fontWeight: 600 }}>
          ARCHIO
        </span>
        <div role="tablist" aria-label="Screens" className="flex items-center" style={{ gap: 10 }}>
          {SCREENS.map((s, i) => {
            const cur = i === state.i
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={cur}
                aria-label={`${i + 1}. ${s.title}`}
                title={`${i + 1}. ${s.title}`}
                onClick={() => go(i)}
                className="rounded-full focus:outline-none focus-visible:ring-1"
                style={{ width: cur ? 22 : 7, height: 7, background: cur ? OW.teal : i < state.i ? OW.tealDim : OW.hairStrong, border: "none", padding: 0, cursor: "pointer", transition: "width 320ms cubic-bezier(.22,1,.36,1), background 320ms" }}
              />
            )
          })}
        </div>
      </header>

      <main className="flex-1 min-h-0 flex overflow-y-auto" style={{ padding: "4vh 7vw" }}>
        <div className="w-full mx-auto my-auto" style={{ maxWidth: 1040 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={screen.id}
              aria-label={screen.title}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.34, ease: EASE }}
            >
              {ready && <ScreenView id={screen.id} />}
            </motion.section>
          </AnimatePresence>
        </div>
      </main>

      <footer className="flex items-center justify-between shrink-0" style={{ padding: "0 24px 18px", minHeight: 40 }}>
        <motion.div className="flex items-center gap-3 font-mono" animate={{ opacity: hints ? 1 : 0 }} transition={{ duration: 0.6 }} style={{ fontSize: 10, color: OW.ashSoft, pointerEvents: hints ? "auto" : "none" }}>
          <span><Kbd>←</Kbd> <Kbd>→</Kbd> move</span>
          <span><Kbd>1</Kbd>–<Kbd>4</Kbd> jump</span>
          <span><Kbd>N</Kbd> presenter</span>
          <span><Kbd>F</Kbd> fullscreen</span>
        </motion.div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <NavButton dir={-1} disabled={state.i === 0} onClick={() => go(state.i - 1)} />
          <NavButton dir={1} disabled={state.i === last} onClick={() => go(state.i + 1)} />
        </div>
      </footer>
    </div>
  )
}

function NavButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === 1 ? "Next screen" : "Previous screen"}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full font-sans focus:outline-none focus-visible:ring-1"
      style={{ width: 36, height: 36, border: `1px solid ${OW.hair}`, background: "transparent", color: OW.ash, fontSize: 18, lineHeight: 1, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.25 : 0.7, transition: "opacity 200ms" }}
    >
      {dir === 1 ? "→" : "←"}
    </button>
  )
}
