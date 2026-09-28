"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  Flame,
  Target,
  Star,
  Shield,
  Trophy,
  Users,
  Zap,
  ChevronRight,
} from "lucide-react"
import type { Badge } from "@/types/profile"

interface ProfileBadgesProps {
  badges: Badge[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  target: Target,
  star: Star,
  shield: Shield,
  trophy: Trophy,
  users: Users,
  zap: Zap,
  award: Award,
}

const rarityColors = {
  common: { bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-400", glow: "" },
  rare: { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400", glow: "shadow-sky-500/20" },
  epic: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", glow: "shadow-violet-500/20" },
  legendary: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", glow: "shadow-amber-500/30" },
}

const categoryLabels = {
  streak: "Consistency",
  milestone: "Milestone",
  community: "Community",
  special: "Special",
  mentor: "Mentor",
}

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [showAll, setShowAll] = useState(false)

  const displayBadges = showAll ? badges : badges.slice(0, 6)

  return (
    <div className="rounded-2xl bg-[#111318] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Badges</h3>
          <span className="text-xs text-slate-500">({badges.length})</span>
        </div>
        {badges.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
          >
            {showAll ? "Show Less" : "View All"}
            <ChevronRight className={`w-3 h-3 transition-transform ${showAll ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      {/* Badge Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {displayBadges.map((badge) => {
            const Icon = iconMap[badge.icon] || Award
            const colors = rarityColors[badge.rarity]

            return (
              <motion.button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 rounded-xl ${colors.bg} border ${colors.border} text-center transition-all hover:shadow-lg ${colors.glow} group`}
              >
                {/* Legendary glow effect */}
                {badge.rarity === "legendary" && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 animate-pulse" />
                )}

                <Icon className={`w-6 h-6 mx-auto mb-1.5 ${colors.text} relative z-10`} />
                <p className={`text-[10px] font-medium ${colors.text} truncate relative z-10`}>{badge.name}</p>

                {/* Rarity indicator */}
                <div className="absolute top-1.5 right-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    badge.rarity === "common" ? "bg-slate-500" :
                    badge.rarity === "rare" ? "bg-sky-500" :
                    badge.rarity === "epic" ? "bg-violet-500" : "bg-amber-500"
                  }`} />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] z-50"
            >
              <div className={`rounded-2xl ${rarityColors[selectedBadge.rarity].bg} border ${rarityColors[selectedBadge.rarity].border} overflow-hidden shadow-2xl`}>
                {/* Badge Display */}
                <div className="p-6 text-center relative">
                  {selectedBadge.rarity === "legendary" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/10" />
                  )}
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${rarityColors[selectedBadge.rarity].bg} border-2 ${rarityColors[selectedBadge.rarity].border} flex items-center justify-center mb-3 relative z-10`}>
                    {(() => {
                      const Icon = iconMap[selectedBadge.icon] || Award
                      return <Icon className={`w-8 h-8 ${rarityColors[selectedBadge.rarity].text}`} />
                    })()}
                  </div>
                  <h4 className={`text-lg font-bold ${rarityColors[selectedBadge.rarity].text} mb-1 relative z-10`}>
                    {selectedBadge.name}
                  </h4>
                  <p className="text-xs text-slate-400 mb-3 relative z-10">{selectedBadge.description}</p>
                  <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 relative z-10">
                    <span className={`px-2 py-0.5 rounded ${rarityColors[selectedBadge.rarity].bg} ${rarityColors[selectedBadge.rarity].text} uppercase font-bold`}>
                      {selectedBadge.rarity}
                    </span>
                    <span>{categoryLabels[selectedBadge.category]}</span>
                    <span>Earned {new Date(selectedBadge.earnedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-3 border-t border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
