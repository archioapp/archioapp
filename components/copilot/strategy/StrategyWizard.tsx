"use client"
import { useState } from "react"
import { useCoachProfile, type SessionName } from "@/lib/stores/coachProfile"
import { Button } from "@/components/ui/button"

export function StrategyWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { strategy, setStrategy } = useCoachProfile()
  const [style, setStyle] = useState(strategy.style)
  const [minRR, setMinRR] = useState(strategy.minRR)
  const [risk, setRisk] = useState(strategy.riskPerTrade)
  const [sessions, setSessions] = useState<SessionName[]>(strategy.preferredSessions)
  const [sl, setSL] = useState(strategy.slPolicy)
  const [news, setNews] = useState(strategy.newsFilterMins)
  const [conf, setConf] = useState(strategy.confluences.join(", "))
  const [inval, setInval] = useState(strategy.invalidationNote || "")

  if (!open) return null

  const toggleSession = (s: SessionName) =>
    setSessions((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  function save() {
    setStrategy({
      style,
      minRR: Number(minRR) || 1.5,
      riskPerTrade: Number(risk) || 0.5,
      preferredSessions: sessions,
      slPolicy: sl,
      newsFilterMins: Number(news) || 15,
      confluences: conf
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      invalidationNote: inval || undefined,
    })
    onClose()
    // seed a confirmation into Chat
    window.dispatchEvent(
      new CustomEvent("copilot:chat:seed", {
        detail: { text: `✅ Strategy saved: ${style}, RR≥${minRR}, risk ${risk}%, sessions ${sessions.join("/")} .` },
      }),
    )
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 backdrop-blur">
      <div className="w-[520px] max-w-[95vw] rounded-xl border border-white/10 bg-neutral-900 p-4">
        <div className="text-sm font-semibold mb-3">Set your trading strategy</div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-xs text-white/70 mb-1">Style</div>
            <div className="flex gap-2">
              {(["scalp", "day", "swing", "hybrid"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-2 py-1 rounded border ${style === s ? "border-violet-400 text-violet-300 bg-violet-400/10" : "border-white/10 text-white/70 hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <div className="text-xs text-white/70 mb-1">RR floor</div>
              <input
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1"
                type="number"
                step="0.1"
                value={minRR}
                onChange={(e) => setMinRR(Number(e.target.value))}
              />
            </label>
            <label className="block">
              <div className="text-xs text-white/70 mb-1">Risk per trade (%)</div>
              <input
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1"
                type="number"
                step="0.1"
                value={risk}
                onChange={(e) => setRisk(Number(e.target.value))}
              />
            </label>
            <label className="block">
              <div className="text-xs text-white/70 mb-1">News filter (min)</div>
              <input
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1"
                type="number"
                step="5"
                value={news}
                onChange={(e) => setNews(Number(e.target.value))}
              />
            </label>
          </div>

          <div>
            <div className="text-xs text-white/70 mb-1">Preferred sessions</div>
            <div className="flex gap-2">
              {(["Asia", "London", "New York"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSession(s)}
                  className={`px-2 py-1 rounded border ${sessions.includes(s) ? "border-emerald-400 text-emerald-300 bg-emerald-400/10" : "border-white/10 text-white/70 hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-white/70 mb-1">Stop‑loss policy</div>
            <div className="flex gap-2">
              {(["structure", "swing", "atr"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSL(s)}
                  className={`px-2 py-1 rounded border ${sl === s ? "border-fuchsia-400 text-fuchsia-300 bg-fuchsia-400/10" : "border-white/10 text-white/70 hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <div className="text-xs text-white/70 mb-1">Favorite confluences (comma list)</div>
            <input
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1"
              value={conf}
              onChange={(e) => setConf(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/70 mb-1">Invalidation rule (optional)</div>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-2"
              rows={2}
              value={inval}
              onChange={(e) => setInval(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  )
}
