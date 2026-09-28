"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"

type Bar = { t: number; o: number; h: number; l: number; c: number }
type Theme = { bull: string; bear: string; wick: string; grid: string; bg?: string }

interface CandleMiniChartProps {
  bars: Bar[]
  width: number
  height: number
  pairSymbol: string
  showGrid?: boolean
  onHover?(i: number | null, bar?: Bar): void
  filter?: { showBull: boolean; showBear: boolean }
  className?: string
}

const defaultTheme: Theme = {
  bull: "#34d399",
  bear: "#f87171",
  wick: "rgba(240,242,255,.75)",
  grid: "rgba(255,255,255,.08)",
  bg: "transparent",
}

export function CandleMiniChart({
  bars,
  width,
  height,
  pairSymbol,
  showGrid = true,
  onHover,
  filter = { showBull: true, showBear: true },
  className = "",
}: CandleMiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const getPriceScale = useCallback(() => {
    if (!bars.length) return { minY: 0, maxY: 1, priceToY: (p: number) => height / 2 }

    const minL = Math.min(...bars.map((b) => b.l))
    const maxH = Math.max(...bars.map((b) => b.h))
    const pad = (maxH - minL) * 0.04
    const minY = minL - pad
    const maxY = maxH + pad

    const priceToY = (price: number) => {
      return height - ((price - minY) / (maxY - minY)) * height
    }

    return { minY, maxY, priceToY, minL, maxH }
  }, [bars, height])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !bars.length) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.max(1, window.devicePixelRatio || 1)

    // Set canvas buffer size for retina
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = true

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const { minY, maxY, priceToY, minL, maxH } = getPriceScale()
    const N = bars.length
    const slot = width / N
    const bodyWidth = Math.max(10, Math.min(slot * 0.6, 22))

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = defaultTheme.grid
      ctx.lineWidth = 1
      const gridLines = 4
      for (let i = 0; i <= gridLines; i++) {
        const y = (height / gridLines) * i
        ctx.beginPath()
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(width, y + 0.5)
        ctx.stroke()
      }
    }

    // Draw candlesticks
    bars.forEach((bar, i) => {
      const x = (i + 0.5) * slot
      const isBull = bar.c >= bar.o
      const isHovered = hoverIndex === i

      // Calculate positions
      const openY = priceToY(bar.o)
      const closeY = priceToY(bar.c)
      const highY = priceToY(bar.h)
      const lowY = priceToY(bar.l)

      const bodyTop = Math.min(openY, closeY)
      const bodyBottom = Math.max(openY, closeY)
      const bodyHeight = Math.max(1, bodyBottom - bodyTop)

      // Check if doji
      const isDoji = Math.abs(bar.o - bar.c) < (maxH - minL) * 0.00005

      // Apply filter alpha
      const showThis = isBull ? filter.showBull : filter.showBear
      const alpha = showThis ? 1 : 0.15

      ctx.globalAlpha = alpha

      // Draw wick
      ctx.strokeStyle = defaultTheme.wick
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + 0.5, highY)
      ctx.lineTo(x + 0.5, lowY)
      ctx.stroke()

      // Create gradient for body
      const gradient = ctx.createLinearGradient(0, bodyTop, 0, bodyBottom)
      if (isBull) {
        gradient.addColorStop(0, "#2FD07B")
        gradient.addColorStop(1, "#10B981")
      } else {
        gradient.addColorStop(0, "#F87171")
        gradient.addColorStop(1, "#EF4444")
      }

      // Hover highlight
      if (isHovered) {
        ctx.shadowColor = "rgba(0,0,0,0.25)"
        ctx.shadowBlur = 2
      }

      if (isDoji) {
        // Draw doji as thin line
        ctx.strokeStyle = defaultTheme.wick
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x - bodyWidth / 4, openY + 0.5)
        ctx.lineTo(x + bodyWidth / 4, openY + 0.5)
        ctx.stroke()
      } else {
        // Draw body
        ctx.fillStyle = gradient
        ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight)

        // Subtle outline
        ctx.strokeStyle = isBull ? "#059669" : "#DC2626"
        ctx.lineWidth = 1
        ctx.strokeRect(x - bodyWidth / 2 + 0.5, bodyTop + 0.5, bodyWidth - 1, bodyHeight - 1)
      }

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
    })

    ctx.globalAlpha = 1
  }, [bars, width, height, hoverIndex, filter, getPriceScale])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect || !bars.length) return

      const x = e.clientX - rect.left
      const slot = width / bars.length
      const index = Math.floor(x / slot)

      if (index >= 0 && index < bars.length) {
        setHoverIndex(index)
        onHover?.(index, bars[index])
      } else {
        setHoverIndex(null)
        onHover?.(null)
      }
    },
    [bars, width, onHover],
  )

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null)
    onHover?.(null)
  }, [onHover])

  // Redraw when dependencies change
  useEffect(() => {
    draw()
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "crosshair" }}
    />
  )
}
