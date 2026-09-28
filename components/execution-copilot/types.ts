export type CopilotStatus = "idle" | "analyzing" | "validated" | "live"

export interface TradeState {
  pair: string
  bias: "long" | "short"
  entry: number
  stopLoss: number
  takeProfit: number
  checklistCompleted: boolean
  setupScore: number
  pnl: number
  riskReward: number
}

export interface Message {
  id: number
  sender: "user" | "ai"
  text: string
}
