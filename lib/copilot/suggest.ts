"use client"
import { useEffect, useState } from "react"

export type SuggestionAction = { id: string; label: string; payload?: any; run?: (payload?: any) => void }
export type Suggestion = {
  id?: string
  title: string
  detail?: string
  tag?: "risk" | "progress" | "copy" | "news" | "analysis" | "system"
  severity?: "info" | "warning" | "critical"
  hover?: { title: string; body: string }
  chatSeed?: string
  actions?: SuggestionAction[]
  sticky?: boolean
  ts?: number
}

let _items: Required<Suggestion & { id: string; ts: number }>[] = []
const _listeners = new Set<(items: typeof _items) => void>()
const notify = () => _listeners.forEach((l) => l(_items))

export function pushSuggestion(s: Suggestion) {
  const item = { ...s, id: s.id ?? crypto.randomUUID(), ts: Date.now() } as Required<
    Suggestion & { id: string; ts: number }
  >
  _items = [item, ..._items]
  notify()
  // optional: sound or toast could be added here
}

export function useSuggestions() {
  const [items, setItems] = useState(_items)
  useEffect(() => {
    const h = (list: typeof _items) => setItems(list)
    _listeners.add(h)
    return () => _listeners.delete(h)
  }, [])
  return {
    items,
    dismiss: (id: string) => {
      _items = _items.filter((x) => x.id !== id)
      notify()
    },
    clear: () => {
      _items = []
      notify()
    },
  }
}
