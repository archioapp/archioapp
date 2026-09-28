"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Link2,
  ExternalLink,
  CheckCircle2,
  Plus,
  ChevronRight,
} from "lucide-react"
import type { ConnectedAccount } from "@/types/profile"

interface ProfileConnectionsProps {
  accounts: ConnectedAccount[]
}

const platformConfig: Record<string, { name: string; color: string; icon: string }> = {
  tradingview: { name: "TradingView", color: "bg-blue-500/20 border-blue-500/30 text-blue-400", icon: "TV" },
  discord: { name: "Discord", color: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400", icon: "DC" },
  twitter: { name: "Twitter / X", color: "bg-slate-500/20 border-slate-500/30 text-slate-400", icon: "X" },
  telegram: { name: "Telegram", color: "bg-sky-500/20 border-sky-500/30 text-sky-400", icon: "TG" },
  myfxbook: { name: "Myfxbook", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400", icon: "MF" },
  broker: { name: "Broker", color: "bg-amber-500/20 border-amber-500/30 text-amber-400", icon: "BR" },
}

const availablePlatforms = ["tradingview", "discord", "twitter", "telegram", "myfxbook", "broker"]

export function ProfileConnections({ accounts }: ProfileConnectionsProps) {
  const [showAdd, setShowAdd] = useState(false)

  const connectedPlatforms = new Set(accounts.map((a) => a.platform))
  const unconnectedPlatforms = availablePlatforms.filter((p) => !connectedPlatforms.has(p as any))

  return (
    <div className="rounded-2xl bg-[#111318] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white">Connected Accounts</h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <Plus className={`w-3.5 h-3.5 transition-transform ${showAdd ? "rotate-45" : ""}`} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        {/* Connected Accounts */}
        {accounts.map((account) => {
          const config = platformConfig[account.platform] || platformConfig.broker
          return (
            <motion.div
              key={account.platform}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${config.color} group cursor-pointer hover:bg-white/5 transition-all`}
            >
              {/* Platform Icon */}
              <div className={`w-9 h-9 rounded-lg ${config.color} flex items-center justify-center text-[11px] font-bold`}>
                {config.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm text-white font-medium">{config.name}</p>
                  {account.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[10px] text-slate-500 truncate">@{account.username}</p>
              </div>

              {/* External Link */}
              {account.profileUrl && (
                <a
                  href={account.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </motion.div>
          )
        })}

        {/* Add New Section */}
        {showAdd && unconnectedPlatforms.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="pt-3 mt-3 border-t border-white/5"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Connect More</p>
            <div className="space-y-2">
              {unconnectedPlatforms.map((platform) => {
                const config = platformConfig[platform]
                return (
                  <button
                    key={platform}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-500`}>
                      {config.icon}
                    </div>
                    <span className="flex-1 text-left text-sm text-slate-400 group-hover:text-white transition-colors">
                      {config.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {accounts.length === 0 && !showAdd && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">No accounts connected</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Connect an account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
