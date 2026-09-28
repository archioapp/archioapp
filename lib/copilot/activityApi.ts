"use client"
import { pushSuggestion } from "@/lib/copilot/suggest"

// Call when scenario is saved or edited
export function activityScenarioSaved(params: {
  instrument: string
  orderType: "market" | "buy_limit" | "sell_limit" | "buy_stop" | "sell_stop"
  entry?: number
  sl?: number
  tp?: number
  rr?: number
}) {
  const isPending = params.orderType !== "market"
  if (isPending) {
    pushSuggestion({
      title: `Pending plan: ${params.orderType.replace("_", " ").toUpperCase()}`,
      detail: `Entry ${params.entry ?? "—"} on ${params.instrument}. I can set a price alert and watch news.`,
      tag: "progress",
      chatSeed: `I set a ${params.orderType} on ${params.instrument}. Help me monitor liquidity and news.`,
      actions: [
        {
          id: "alert",
          label: "Set Alert",
          run: () =>
            window.dispatchEvent(
              new CustomEvent("copilot:chat:ask", { detail: { text: "Create a price alert at my entry." } }),
            ),
        },
        {
          id: "broker",
          label: "Broker Check",
          run: () =>
            window.dispatchEvent(
              new CustomEvent("copilot:chat:ask", { detail: { text: "Confirm the broker order is placed." } }),
            ),
        },
      ],
      hover: {
        title: "What happens next?",
        body: "I'll watch the session window and upcoming news; I can DM you when price approaches the level.",
      },
    })
  } else {
    const missingSL = typeof params.sl !== "number"
    pushSuggestion({
      title: "Market execution armed",
      detail: `${params.instrument} — ${missingSL ? "No SL detected." : `RR ≈ ${params.rr?.toFixed?.(2) ?? "—"}`}`,
      tag: "risk",
      chatSeed: "Help me confirm SL/TP and size the trade correctly.",
      actions: [
        {
          id: "size",
          label: "Size 0.5%",
          run: () =>
            window.dispatchEvent(
              new CustomEvent("copilot:chat:ask", { detail: { text: "Size position 0.5% of balance." } }),
            ),
        },
        {
          id: "rr",
          label: "Optimize RR",
          run: () =>
            window.dispatchEvent(
              new CustomEvent("copilot:chat:ask", { detail: { text: "Optimize my risk‑reward for this setup." } }),
            ),
        },
      ],
      hover: { title: "Tip", body: "Confirm SL distance fits your risk cap. I can show a quick RR ladder." },
      sticky: missingSL,
    })
  }
}

// Call when forecast is created from scenario
export function activityForecastCreated(params: { instrument: string; link?: string }) {
  pushSuggestion({
    title: "Forecast created",
    detail: `Prefilled from your scenario on ${params.instrument}.`,
    tag: "progress",
    chatSeed: "Review my forecast and suggest any improvements before publishing.",
    actions: params.link
      ? [{ id: "open", label: "Open Forecast", run: () => window.open(params.link!, "_blank") }]
      : undefined,
  })
}

// Call when user copies a mentor trade
export function activityMentorCopied(params: { instrument: string; mentor: string }) {
  pushSuggestion({
    title: `Copied ${params.mentor}`,
    detail: `Mirror trade set on ${params.instrument}. Want a risk cap or notification to mentor?`,
    tag: "copy",
    chatSeed: `I copied ${params.mentor} on ${params.instrument}. Help me apply risk caps and notify them.`,
    actions: [
      {
        id: "cap",
        label: "Set Risk Cap",
        run: () =>
          window.dispatchEvent(
            new CustomEvent("copilot:chat:ask", { detail: { text: "Set a 1% risk cap for mirrored trades." } }),
          ),
      },
      {
        id: "notify",
        label: "Notify Mentor",
        run: () =>
          window.dispatchEvent(
            new CustomEvent("copilot:chat:ask", {
              detail: { text: "Send a short note to mentor about my mirrored entry." },
            }),
          ),
      },
    ],
    hover: { title: "Safety", body: "Copilot can cap size per mirrored strategy and pause copying after drawdown." },
  })
}

// Call when user runs Analyze Charts
export function activityAnalyzeRun(params: {
  instrument: string
  timeframe?: string
  prevDay?: { high?: number; low?: number } // pass if you have it
  structure?: "bullish" | "bearish" | "range" | "neutral" // if you infer it
  mode?: "scalp" | "day" | "swing" // optional, or infer from timeframe
}) {
  let inferredMode = params.mode
  if (!inferredMode && params.timeframe) {
    const tf = params.timeframe.toLowerCase()
    if (tf.includes("1m") || tf.includes("5m") || tf.includes("15m")) {
      inferredMode = "scalp"
    } else if (tf.includes("30m") || tf.includes("1h") || tf.includes("4h")) {
      inferredMode = "day"
    } else if (tf.includes("1d") || tf.includes("1w")) {
      inferredMode = "swing"
    }
  }

  pushSuggestion({
    title: "Chart analysis started",
    detail: `Running analysis on ${params.instrument}. I'll summarize key confluences.`,
    tag: "analysis",
    chatSeed: `Summarize confluences and risks for ${params.instrument}.`,
    actions: [
      {
        id: "sum",
        label: "Summarize",
        run: () =>
          window.dispatchEvent(
            new CustomEvent("copilot:chat:ask", {
              detail: {
                threadType: "activity",
                text: `Recap for ${params.instrument}.`,
                context: {
                  instrument: params.instrument,
                  timeframe: params.timeframe,
                  prevDay: params.prevDay, // { high, low } if available
                  structure: params.structure, // "bullish" | "bearish" | "range"
                  mode: inferredMode, // "scalp" | "day" | "swing"
                  now: Date.now(),
                },
              },
            }),
          ),
      },
    ],
    hover: { title: "What you get", body: "Session bias, previous-day levels, liquidity focus, and RR ideas." },
  })
}
