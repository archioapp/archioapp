"use client"
import { useEffect } from "react"
import { CopilotSDK } from "@/lib/copilot/sdk"

export function useTradingViewTelemetry(widget: any, currentSymbol: string) {
  useEffect(() => {
    if (!widget) return
    widget.onChartReady?.(() => {
      widget
        .onIntervalChanged()
        ?.subscribe(null, (tf: string) => CopilotSDK.chart.interval(tf, { instrument: currentSymbol }))
      widget
        .onSymbolChanged()
        ?.subscribe(null, (s: any) =>
          CopilotSDK.chart.symbol(s?.name ?? currentSymbol, { instrument: s?.name ?? currentSymbol }),
        )
    })
  }, [widget, currentSymbol])
}
