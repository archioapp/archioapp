"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface CopilotSplitProps {
  top: ReactNode
  bottom: ReactNode
  defaultTopPx?: number
  minTop?: number
  maxTop?: number
  storageKey?: string
}

export function CopilotSplit({
  top,
  bottom,
  defaultTopPx = 300,
  minTop = 200,
  maxTop = 500,
  storageKey,
}: CopilotSplitProps) {
  const [topHeight, setTopHeight] = useState(defaultTopPx)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const height = Number.parseInt(saved, 10)
        if (height >= minTop && height <= maxTop) {
          setTopHeight(height)
        }
      }
    }
  }, [storageKey, minTop, maxTop])

  // Save to localStorage when height changes
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(storageKey, topHeight.toString())
    }
  }, [topHeight, storageKey])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const newHeight = e.clientY - rect.top
      const clampedHeight = Math.max(minTop, Math.min(maxTop, newHeight))
      setTopHeight(clampedHeight)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, minTop, maxTop])

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      <div style={{ height: topHeight }} className="flex-shrink-0">
        {top}
      </div>

      <div
        className="h-1 bg-white/5 hover:bg-white/10 cursor-row-resize flex-shrink-0 relative group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-white/20 group-hover:bg-white/40 rounded-full" />
        </div>
      </div>

      <div className="flex-1 min-h-0">{bottom}</div>
    </div>
  )
}
