import { create } from "zustand"

type Account = {
  id: string
  label: string
  currency: "USD" | "EUR"
  balance: number
  riskPct: number
  active?: boolean
}

type S = {
  list: Account[]
  activeId?: string
  add: (a: Account) => void
  activate: (id: string) => void
  updateBalance: (id: string, delta: number) => void
  setRisk: (id: string, pct: number) => void
}

export const useAccounts = create<S>((set) => ({
  list: [{ id: "acc-10k", label: "10k Private", currency: "USD", balance: 10000, riskPct: 0.5, active: true }],
  activeId: "acc-10k",
  add: (a) => set((s) => ({ list: [...s.list, a] })),
  activate: (id) => set((s) => ({ activeId: id, list: s.list.map((x) => ({ ...x, active: x.id === id })) })),
  updateBalance: (id, delta) =>
    set((s) => ({ list: s.list.map((x) => (x.id === id ? { ...x, balance: x.balance + delta } : x)) })),
  setRisk: (id, pct) => set((s) => ({ list: s.list.map((x) => (x.id === id ? { ...x, riskPct: pct } : x)) })),
}))
