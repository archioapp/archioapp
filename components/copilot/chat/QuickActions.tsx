"use client"

export function QuickActions({ threadType }: { threadType: "activity" | "strategy" | "psych" }) {
  const ask = (text: string, context: any = {}) =>
    window.dispatchEvent(new CustomEvent("copilot:chat:ask", { detail: { text, context, threadType } }))

  const seed = (text: string) =>
    window.dispatchEvent(new CustomEvent("copilot:chat:seed", { detail: { text, threadType } }))

  const remind = () => {
    seed("⏰ Reminder set locally for 15 minutes.")
    // lightweight local reminder
    setTimeout(
      () => {
        seed("⏰ Reminder: re‑check your plan.")
      },
      15 * 60 * 1000,
    )
  }

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        className="px-2 py-1 text-[11px] rounded border border-white/10 hover:border-white/20 transition"
        onClick={() => ask("Recap for current market.")}
      >
        Recap
      </button>
      <button
        className="px-2 py-1 text-[11px] rounded border border-white/10 hover:border-white/20 transition"
        onClick={() => ask("Checklist")}
      >
        Checklist
      </button>
      <button
        className="px-2 py-1 text-[11px] rounded border border-white/10 hover:border-white/20 transition"
        onClick={() => ask("Next session plan")}
      >
        Next Session
      </button>
      <button
        className="px-2 py-1 text-[11px] rounded border border-white/10 hover:border-white/20 transition"
        onClick={() => ask("Add note")}
      >
        Add Note
      </button>
      <button
        className="px-2 py-1 text-[11px] rounded border border-white/10 hover:border-white/20 transition"
        onClick={remind}
      >
        Remind Me
      </button>
    </div>
  )
}
