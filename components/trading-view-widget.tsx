"use client"

import { useEffect, useRef, memo } from "react"

interface TradingViewWidgetProps {
  symbol: string
  width?: string | number
  height?: string | number
  interval?: string
  theme?: "light" | "dark"
  style?: string
  locale?: string
  toolbar_bg?: string
  enable_publishing?: boolean
  allow_symbol_change?: boolean
  container_id?: string
}

declare global {
  interface Window {
    TradingView: any
  }
}

function TradingViewWidgetComponent({
  symbol = "FX:EURUSD",
  width = "100%",
  height = "100%",
  interval = "15",
  theme = "dark",
  style = "1",
  locale = "en",
  toolbar_bg = "#f1f3f6",
  enable_publishing = false,
  allow_symbol_change = true,
  container_id,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true

    const widgetConfig = {
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "America/New_York",
      theme: theme,
      style: style,
      locale: locale,
      toolbar_bg: toolbar_bg,
      enable_publishing: enable_publishing,
      allow_symbol_change: allow_symbol_change,
      calendar: false,
      gridColor: "rgba(0,0,0,0)",
      overrides: {
        "paneProperties.vertGridProperties.color": "rgba(0,0,0,0)",
        "paneProperties.horzGridProperties.color": "rgba(0,0,0,0)",
      },
      support_host: "https://www.tradingview.com",
      container_id: container_id || `tradingview_${Math.random().toString(36).substr(2, 9)}`,
    }

    script.innerHTML = JSON.stringify(widgetConfig)

    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = ""
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [
    symbol,
    width,
    height,
    interval,
    theme,
    style,
    locale,
    toolbar_bg,
    enable_publishing,
    allow_symbol_change,
    container_id,
  ])

  return <div ref={containerRef} className="tradingview-widget-container w-full h-full" style={{ width, height }} />
}

export const TradingViewWidget = memo(TradingViewWidgetComponent)
