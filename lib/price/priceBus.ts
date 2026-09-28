import { emit } from "@/lib/bus"

let ws: WebSocket | null = null
let timer: any
let lastSub: string | null = null

function closeWs() {
  try {
    ws && ws.close()
  } catch {}
  ws = null
  lastSub = null
}

export function connectPriceBus(symbol: string) {
  clearInterval(timer)

  // Always use mock data - no live WebSocket connections
  console.log("[BUS] price:provider", "mock")
  let p = 1.1 + Math.random() * 0.02
  timer = setInterval(() => {
    const d = (Math.random() - 0.5) * 0.0004
    p = +(p + d).toFixed(5)
    emit("price:tick", { symbol, price: p, ts: Date.now() })
  }, 800)
}

export function disconnectPriceBus() {
  clearInterval(timer)
  closeWs()
}
