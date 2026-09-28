"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BadgeCheck,
  Trophy,
  Flame,
  TrendingUp,
  MessageSquare,
  UserPlus,
  UserMinus,
  ExternalLink,
  Award,
  Target,
  Star,
  Shield,
} from "lucide-react"
import type { ProfileCard, Badge } from "@/types/profile"
import Link from "next/link"

interface ProfileHoverCardProps {
  profile: ProfileCard
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}

const levelGradients = {
  beginner: "from-slate-500 to-slate-600",
  intermediate: "from-sky-500 to-blue-600",
  advanced: "from-violet-500 to-indigo-600",
  elite: "from-amber-500 to-orange-600",
}

const levelLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  elite: "Elite",
}

const roleColors = {
  STUDENT: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  MENTOR: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
}

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  target: Target,
  star: Star,
  shield: Shield,
  award: Award,
  trophy: Trophy,
}

export function ProfileHoverCard({
  profile,
  children,
  side = "right",
  align = "start",
}: ProfileHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing)

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }

  const alignClasses = {
    start: side === "left" || side === "right" ? "top-0" : "left-0",
    center: side === "left" || side === "right" ? "top-1/2 -translate-y-1/2" : "left-1/2 -translate-x-1/2",
    end: side === "left" || side === "right" ? "bottom-0" : "right-0",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[side]} ${alignClasses[align]}`}
          >
            <div className="w-[280px] bg-[#111318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header Gradient */}
              <div className={`h-12 bg-gradient-to-r ${levelGradients[profile.level]} opacity-30`} />

              {/* Profile Info */}
              <div className="px-4 -mt-6 relative z-10">
                <div className="flex items-end gap-3 mb-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${levelGradients[profile.level]} flex items-center justify-center text-base font-bold text-white ring-2 ring-[#111318] shadow-lg`}
                    >
                      {profile.avatar}
                    </div>
                    {profile.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#111318]" />
                    )}
                    {profile.verified && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center ring-2 ring-[#111318]">
                        <BadgeCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name + Handle */}
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">{profile.displayName}</h4>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold border ${roleColors[profile.role]}`}>
                        {profile.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">@{profile.handle}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                    <p className="text-sm font-bold font-mono text-emerald-400">{profile.winRate}%</p>
                    <p className="text-[8px] text-slate-500 uppercase">Win Rate</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                    <p className={`text-sm font-bold font-mono ${profile.totalR >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {profile.totalR >= 0 ? "+" : ""}{profile.totalR.toFixed(1)}R
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase">Total R</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <p className="text-sm font-bold font-mono text-orange-400">{profile.streak}</p>
                    </div>
                    <p className="text-[8px] text-slate-500 uppercase">Streak</p>
                  </div>
                </div>

                {/* Badges Preview */}
                {profile.badges.length > 0 && (
                  <div className="flex gap-1.5 mb-3">
                    {profile.badges.slice(0, 3).map((badge) => {
                      const Icon = badgeIcons[badge.icon] || Award
                      return (
                        <div
                          key={badge.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20"
                          title={badge.name}
                        >
                          <Icon className="w-3 h-3 text-amber-400" />
                          <span className="text-[9px] text-amber-400 font-medium truncate max-w-[60px]">
                            {badge.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2 bg-black/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsFollowing(!isFollowing)
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                    isFollowing
                      ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                      : "bg-violet-500/20 border border-violet-500/30 text-violet-400 hover:bg-violet-500/30"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-3 h-3" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      Follow
                    </>
                  )}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                  <MessageSquare className="w-3 h-3" />
                  Message
                </button>
                <Link
                  href={`/profile/${profile.handle}`}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Simple wrapper for triggering hover card on any avatar
interface AvatarWithHoverCardProps {
  profile: ProfileCard
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AvatarWithHoverCard({ profile, size = "md", className = "" }: AvatarWithHoverCardProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  }

  return (
    <ProfileHoverCard profile={profile}>
      <button
        className={`relative rounded-lg bg-gradient-to-br ${levelGradients[profile.level]} flex items-center justify-center font-bold text-white cursor-pointer hover:ring-2 hover:ring-violet-500/50 transition-all ${sizeClasses[size]} ${className}`}
      >
        {profile.avatar}
        {profile.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#111318]" />
        )}
      </button>
    </ProfileHoverCard>
  )
}
