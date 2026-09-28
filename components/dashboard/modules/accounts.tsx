"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW } from "@/components/mtf/mtf-theme"
import type { TradingAccount } from "../dashboard-types"
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, ChevronRight } from "lucide-react"

interface Props {
  accounts: TradingAccount[]
}

export function AccountsModule({ accounts }: Props) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  const totalEquity = accounts.reduce((sum, a) => a.type !== "demo" ? sum + a.equity : sum, 0)
  const totalPnl = accounts.reduce((sum, a) => a.type !== "demo" ? sum + a.floatingPnl : sum, 0)

  return (
    <div
      className="h-full"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${ACCENT.blue.rgb},0.08)`,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Wallet className="w-4 h-4" style={{ color: `rgba(${ACCENT.blue.rgb},0.6)` }} />
            <span className={`${TYPE.label}`} style={{ color: `rgba(${ACCENT.slate.rgb},0.5)` }}>Accounts & Risk</span>
          </div>
          <div className="text-right">
            <div className="text-white font-mono text-lg font-bold">${totalEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-1 justify-end">
              {totalPnl >= 0 ? (
                <TrendingUp className="w-3 h-3" style={{ color: ACCENT.emerald.hex }} />
              ) : (
                <TrendingDown className="w-3 h-3" style={{ color: ACCENT.rose.hex }} />
              )}
              <span
                className="text-[10px] font-mono font-semibold"
                style={{ color: totalPnl >= 0 ? ACCENT.emerald.hex : ACCENT.rose.hex }}
              >
                {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Account cards */}
        <div className="space-y-2.5">
          {accounts.map((account) => {
            const drawdownPct = (account.drawdownCurrent / account.drawdownMax) * 100
            const isWarning = drawdownPct > 50
            const isDanger = drawdownPct > 80

            return (
              <div
                key={account.id}
                className="p-3.5 rounded-xl transition-all duration-150 cursor-pointer hover:scale-[1.01]"
                style={{
                  background: SURFACE.recess,
                  border: `1px solid rgba(${isDanger ? ACCENT.rose.rgb : isWarning ? ACCENT.amber.rgb : ACCENT.blue.rgb},0.06)`,
                }}
                onClick={() => setSelectedAccount(selectedAccount === account.id ? null : account.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-semibold">{account.name}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-bold"
                      style={{
                        background: account.type === "live" ? `rgba(${ACCENT.emerald.rgb},0.1)` :
                          account.type === "prop_firm" ? `rgba(${ACCENT.amber.rgb},0.1)` :
                          `rgba(${ACCENT.slate.rgb},0.1)`,
                        color: account.type === "live" ? ACCENT.emerald.hex :
                          account.type === "prop_firm" ? ACCENT.amber.hex :
                          ACCENT.slate.hex,
                      }}
                    >
                      {account.type === "prop_firm" ? "PROP" : account.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-mono text-sm font-semibold">
                    ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Drawdown bar */}
                <div className="flex items-center gap-2">
                  <span className={TYPE.caption}>DD</span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: `rgba(${ACCENT.slate.rgb},0.1)` }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${drawdownPct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{
                        background: isDanger ? ACCENT.rose.hex : isWarning ? ACCENT.amber.hex : ACCENT.emerald.hex,
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-mono font-semibold"
                    style={{ color: isDanger ? ACCENT.rose.hex : isWarning ? ACCENT.amber.hex : `rgba(${ACCENT.slate.rgb},0.6)` }}
                  >
                    {account.drawdownCurrent.toFixed(1)}%
                  </span>
                </div>

                {/* Prop firm challenge progress */}
                {account.propFirm && (
                  <div className="mt-2 pt-2" style={{ borderTop: `1px solid rgba(${ACCENT.amber.rgb},0.06)` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={TYPE.caption}>{account.propFirm.firm} {account.propFirm.phase}</span>
                      <span className="text-[10px] font-mono" style={{ color: ACCENT.amber.hex }}>
                        {account.propFirm.profitCurrent.toFixed(1)}% / {account.propFirm.profitTarget}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `rgba(${ACCENT.amber.rgb},0.08)` }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(account.propFirm.profitCurrent / account.propFirm.profitTarget) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ background: `linear-gradient(90deg, ${ACCENT.amber.hex}, ${ACCENT.emerald.hex})` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={TYPE.caption}>{account.propFirm.daysTraded} / {account.propFirm.daysRequired} min days</span>
                      <span className={TYPE.caption}>Daily loss: {account.propFirm.dailyLossUsed.toFixed(1)}% / {account.propFirm.dailyLossLimit}%</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
