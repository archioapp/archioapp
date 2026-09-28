"use client"
import { useState } from "react"
import { useCoachProfile } from "@/lib/stores/coachProfile"
import { Button } from "@/components/ui/button"

export function PsychologyCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { psych, setPsych, stats, startCooldown, clearCooldown } = useCoachProfile()
  const [mood, setMood] = useState(3)
  const [sleep, setSleep] = useState(3)
  const [stress, setStress] = useState(2)
  const [note, setNote] = useState("")

  if (!open) return null

  const cooldownActive = psych.cooldownUntil && psych.cooldownUntil > Date.now()

  function submitCheckIn() {
    setPsych({ lastCheckIn: { mood, sleep, stress, note, ts: Date.now() } })
    onClose()
    window.dispatchEvent(
      new CustomEvent("copilot:chat:seed", {
        detail: { text: `🧠 Psychology check‑in saved (mood ${mood}/5, sleep ${sleep}/5, stress ${stress}/5).` },
      }),
    )
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 backdrop-blur">
      <div className="w-[560px] max-w-[95vw] rounded-xl border border-white/10 bg-neutral-900 p-4">
        <div className="text-sm font-semibold mb-3">Psychology Center</div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <label className="block">
              <div className="text-xs text-white/70 mb-1">Daily risk cap (%)</div>
              <input
                type="number"
                step="0.1"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1"
                value={psych.riskCapDaily}
                onChange={(e) => setPsych({ riskCapDaily: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <div className="text-xs text-white/70 mb-1">Max trades per session</div>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1"
                value={psych.maxTradesPerSession}
                onChange={(e) => setPsych({ maxTradesPerSession: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <div className="text-xs text-white/70 mb-1">Cooldown after loss (min)</div>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1"
                value={psych.cooldownAfterLossMins}
                onChange={(e) => setPsych({ cooldownAfterLossMins: Number(e.target.value) })}
              />
            </label>

            <div className="flex items-center gap-2">
              <input
                id="focus"
                type="checkbox"
                checked={psych.focusMode}
                onChange={(e) => setPsych({ focusMode: e.target.checked })}
              />
              <label htmlFor="focus" className="text-xs text-white/70">
                Focus mode (mute non‑critical alerts)
              </label>
            </div>

            <div className="flex gap-2">
              {!cooldownActive ? (
                <Button variant="secondary" onClick={() => startCooldown(psych.cooldownAfterLossMins)}>
                  Start cooldown
                </Button>
              ) : (
                <Button variant="destructive" onClick={clearCooldown}>
                  Clear cooldown
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-white/70">Quick check‑in</div>
            <div className="grid grid-cols-3 gap-2">
              <Score label="Mood" value={mood} setValue={setMood} />
              <Score label="Sleep" value={sleep} setValue={setSleep} />
              <Score label="Stress" value={stress} setValue={setStress} />
            </div>
            <textarea
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-2"
              placeholder="Anything to note?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button onClick={submitCheckIn}>Save check‑in</Button>

            <div className="mt-4 text-xs text-white/70">
              <div className="font-medium text-white/80 mb-1">Stats</div>
              <div>
                Total trades: {stats.total} · Wins: {stats.wins} · Losses: {stats.losses}
              </div>
              <div>
                Avg R: {stats.avgR.toFixed(2)} · Last 7: {stats.last7R.map((n) => n.toFixed(1)).join(", ") || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

function Score({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) {
  return (
    <div>
      <div className="text-[11px] text-white/70">{label}</div>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setValue(n)}
            className={`w-6 h-6 rounded border text-[11px]
                        ${value >= n ? "bg-emerald-500/30 border-emerald-400" : "bg-white/5 border-white/10"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
