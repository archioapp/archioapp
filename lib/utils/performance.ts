"use client"

import React from "react"

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Measure component render time
  measureRender(componentName: string, startTime: number) {
    const endTime = performance.now()
    const duration = endTime - startTime

    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, [])
    }

    const componentMetrics = this.metrics.get(componentName)!
    componentMetrics.push(duration)

    // Keep only last 100 measurements
    if (componentMetrics.length > 100) {
      componentMetrics.shift()
    }

    // Log slow renders
    if (duration > 16) {
      // More than one frame at 60fps
      console.warn(`[v0] Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`)
    }
  }

  // Get performance statistics
  getStats(componentName: string) {
    const metrics = this.metrics.get(componentName)
    if (!metrics || metrics.length === 0) return null

    const sorted = [...metrics].sort((a, b) => a - b)
    const avg = metrics.reduce((sum, val) => sum + val, 0) / metrics.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const p95 = sorted[Math.floor(sorted.length * 0.95)]

    return {
      count: metrics.length,
      average: avg,
      median,
      p95,
      min: sorted[0],
      max: sorted[sorted.length - 1],
    }
  }

  // Monitor memory usage
  startMemoryMonitoring() {
    if (!("memory" in performance)) return

    const checkMemory = () => {
      const memory = (performance as any).memory
      if (memory) {
        const used = memory.usedJSHeapSize / 1024 / 1024 // MB
        const total = memory.totalJSHeapSize / 1024 / 1024 // MB

        if (used > 100) {
          // More than 100MB
          console.warn(`[v0] High memory usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`)
        }
      }
    }

    setInterval(checkMemory, 10000) // Check every 10 seconds
  }

  // Monitor long tasks
  startLongTaskMonitoring() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Tasks longer than 50ms
            console.warn(`[v0] Long task detected: ${entry.duration.toFixed(2)}ms`)
          }
        }
      })

      try {
        observer.observe({ entryTypes: ["longtask"] })
        this.observers.set("longtask", observer)
      } catch (e) {
        console.log("[v0] Long task monitoring not supported")
      }
    }
  }

  // Clean up observers
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance()

  const startMeasure = () => performance.now()

  const endMeasure = (startTime: number) => {
    monitor.measureRender(componentName, startTime)
  }

  return { startMeasure, endMeasure, getStats: () => monitor.getStats(componentName) }
}

// Debounce utility for expensive operations
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null

  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

// Throttle utility for high-frequency events
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean

  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(ref: React.RefObject<Element>, options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

// Virtual scrolling utility for large lists
export function useVirtualScrolling<T>(items: T[], itemHeight: number, containerHeight: number, overscan = 5) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(visibleStart + Math.ceil(containerHeight / itemHeight), items.length - 1)

  const startIndex = Math.max(0, visibleStart - overscan)
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan)

  const visibleItems = items.slice(startIndex, endIndex + 1)

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  }
}

// Initialize performance monitoring
if (typeof window !== "undefined") {
  const monitor = PerformanceMonitor.getInstance()
  monitor.startMemoryMonitoring()
  monitor.startLongTaskMonitoring()
}
