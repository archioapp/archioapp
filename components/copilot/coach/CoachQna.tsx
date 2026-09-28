"use client"
import { useEffect, useState } from "react"
import { useCoach, type SessionName } from "@/lib/stores/coach"
import { Button } from "@/components/ui/button"
import { ModalPortal } from "@/components/core/ModalPortal"

type Flow = "strategy" | "psychology"
type Choice = { key: string; label: string; value?: any }
type Question = {
  id: string
  title: string
  hint?: string
  multi?: boolean
  choices: Choice[]
  required?: boolean
}

const STRATEGY_QUESTIONS: Question[] = [
  {
    id: "style",
    title: "Your trading style",
    choices: [
      { key: "scalp", label: "Scalp" },
      { key: "day", label: "Day" },
      { key: "swing", label: "Swing" },
      { key: "hybrid", label: "Hybrid" },
    ],
    required: true,
  },
  {
    id: "sessions",
    title: "Preferred sessions",
    hint: "Pick 1–3",
    multi: true,
    choices: [
      { key: "Asia", label: "Asia" },
      { key: "London", label: "London" },
      { key: "New York", label: "New York" },
    ],
    required: true,
  },
  {
    id: "riskPct",
    title: "Risk per trade",
    choices: [
      { key: "0.25", label: "0.25%" },
      { key: "0.5", label: "0.5%" },
      { key: "0.75", label: "0.75%" },
      { key: "1", label: "1%" },
      { key: "1.5", label: "1.5%" },
    ],
    required: true,
  },
  {
    id: "minRR",
    title: "Minimum RR",
    choices: [
      { key: "1.2", label: "≥1.2" },
      { key: "1.5", label: "≥1.5" },
      { key: "2.0", label: "≥2.0" },
      { key: "2.5", label: "≥2.5" },
    ],
    required: true,
  },
  {
    id: "slPolicy",
    title: "Stop-loss policy",
    choices: [
      { key: "structure", label: "Structure" },
      { key: "atr", label: "ATR" },
      { key: "swing", label: "Last swing" },
    ],
    required: true,
  },
  {
    id: "entries",
    title: "Entry types you'll use",
    multi: true,
    choices: [
      { key: "market", label: "Market" },
      { key: "limit", label: "Limit" },
      { key: "stop", label: "Stop" },
    ],
    required: true,
  },
  {
    id: "confluences",
    title: "Favorite confluences",
    multi: true,
    choices: [
      { key: "OB", label: "Order Block" },
      { key: "FVG", label: "FVG" },
      { key: "BOS", label: "BOS" },
      { key: "Sweep", label: "Liquidity Sweep" },
      { key: "PDH/PDL", label: "PDH/PDL" },
      { key: "WeeklyOpen", label: "Weekly Open" },
    ],
  },
]

const PSY_QUESTIONS: Question[] = [
  {
    id: "maxTradesPerSession",
    title: "Max trades per session",
    choices: [
      { key: "1", label: "1" },
      { key: "2", label: "2" },
      { key: "3", label: "3" },
      { key: "4", label: "4" },
      { key: "5", label: "5+" },
    ],
    required: true,
  },
  {
    id: "dailyRiskCapPct",
    title: "Daily risk cap",
    choices: [
      { key: "1", label: "1%" },
      { key: "1.5", label: "1.5%" },
      { key: "2", label: "2%" },
      { key: "3", label: "3%" },
    ],
    required: true,
  },
  {
    id: "cooldownMins",
    title: "Cooldown after a loss",
    choices: [
      { key: "5", label: "5m" },
      { key: "10", label: "10m" },
      { key: "15", label: "15m" },
      { key: "20", label: "20m" },
      { key: "30", label: "30m" },
    ],
    required: true,
  },
  {
    id: "focusMode",
    title: "Focus mode by default?",
    choices: [
      { key: "true", label: "On" },
      { key: "false", label: "Off" },
    ],
    required: true,
  },
  {
    id: "accountability",
    title: "Notify me if I break my rules",
    choices: [
      { key: "true", label: "Yes" },
      { key: "false", label: "No" },
    ],
    required: true,
  },
  {
    id: "autoJournal",
    title: "Auto‑journal trades",
    choices: [
      { key: "true", label: "On" },
      { key: "false", label: "Off" },
    ],
    required: true,
  },
]

function Chips({
  multi,
  value,
  onChange,
  choices,
}: { multi?: boolean; value: string[]; onChange: (v: string[]) => void; choices: Choice[] }) {
  function toggle(k: string) {
    if (multi) {
      onChange(value.includes(k) ? value.filter((x) => x !== k) : [...value, k])
    } else {
      onChange([k])
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((c) => (
        <button
          key={c.key}
          onClick={() => toggle(c.key)}
          className={`px-2 py-1 rounded border text-sm
            ${
              value.includes(c.key)
                ? "border-violet-400 text-violet-300 bg-violet-400/10"
                : "border-white/10 text-white/70 hover:text-white hover:border-white/20"
            }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

export function CoachQna({ flow, open, onClose }: { flow: Flow; open: boolean; onClose: () => void }) {
  const { setStrategy, setPsychology } = useCoach()
  const QUESTIONS = flow === "strategy" ? STRATEGY_QUESTIONS : PSY_QUESTIONS

  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})

  // reset when closed
  useEffect(() => {
    if (!open) {
      setI(0)
      setAnswers({})
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open) return null
  const q = QUESTIONS[i]
  const total = QUESTIONS.length
  const val = answers[q.id] || []
  const canNext = q.required ? val.length > 0 : true

  function setVal(v: string[]) {
    setAnswers((a) => ({ ...a, [q.id]: v }))
  }
  function next() {
    if (i < total - 1 && canNext) setI(i + 1)
  }
  function back() {
    if (i > 0) setI(i - 1)
  }

  function finish() {
    if (flow === "strategy") {
      const s = {
        style: (answers.style?.[0] ?? "day") as any,
        sessions: (answers.sessions ?? ["London", "New York"]) as SessionName[],
        riskPct: Number(answers.riskPct?.[0] ?? "0.5"),
        minRR: Number(answers.minRR?.[0] ?? "1.5"),
        slPolicy: (answers.slPolicy?.[0] ?? "structure") as any,
        entries: (answers.entries ?? ["market", "limit", "stop"]) as any,
        confluences: answers.confluences ?? [],
      }
      setStrategy(s)
      window.dispatchEvent(
        new CustomEvent("copilot:chat:seed", {
          detail: {
            text: `✅ Strategy set: ${s.style}, RR≥${s.minRR}, risk ${s.riskPct}%, sessions ${s.sessions.join("/")}, entries ${s.entries.join(", ")}.`,
          },
        }),
      )
    } else {
      const p = {
        maxTradesPerSession: Number(answers.maxTradesPerSession?.[0] ?? "3"),
        dailyRiskCapPct: Number(answers.dailyRiskCapPct?.[0] ?? "2"),
        cooldownMins: Number(answers.cooldownMins?.[0] ?? "15"),
        focusMode: answers.focusMode?.[0] === "true",
        accountability: answers.accountability?.[0] === "true",
        autoJournal: answers.autoJournal?.[0] === "true",
      }
      setPsychology(p)
      window.dispatchEvent(
        new CustomEvent("copilot:chat:seed", {
          detail: {
            text: `✅ Psychology set: cap ${p.dailyRiskCapPct}%, max ${p.maxTradesPerSession}/session, cooldown ${p.cooldownMins}m, focus ${p.focusMode ? "on" : "off"}.`,
          },
        }),
      )
    }
    onClose()
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 backdrop-blur">
        <div
          role="dialog"
          aria-modal="true"
          className="w-[540px] max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 p-4 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">
              {flow === "strategy" ? "Set your trading strategy" : "Set your psychology guardrails"}
            </div>
            <div className="text-xs text-white/60">
              {i + 1}/{total}
            </div>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-white/5 rounded mb-4 overflow-hidden">
            <div className="h-full bg-violet-500/60" style={{ width: `${((i + 1) / total) * 100}%` }} />
          </div>

          {/* Question */}
          <div className="space-y-2 mb-4">
            <div className="text-base font-medium">{q.title}</div>
            {q.hint && <div className="text-xs text-white/60">{q.hint}</div>}
            <Chips multi={q.multi} value={val} onChange={setVal} choices={q.choices} />
          </div>

          {/* Nav */}
          <div className="flex justify-between">
            <Button variant="ghost" onClick={i === 0 ? onClose : back}>
              {i === 0 ? "Cancel" : "Back"}
            </Button>
            {i === total - 1 ? (
              <Button onClick={finish} disabled={!canNext}>
                Finish
              </Button>
            ) : (
              <Button onClick={next} disabled={!canNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
