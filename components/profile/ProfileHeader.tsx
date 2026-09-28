"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  Calendar,
  Edit3,
  Settings,
  Share2,
  Users,
  MapPin,
  ExternalLink,
  Trophy,
  Flame,
  Clock,
} from "lucide-react"
import type { FullProfile } from "@/types/profile"

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

const roleGradients = {
  STUDENT: "from-violet-500 to-indigo-600",
  MENTOR: "from-amber-500 to-orange-500",
  ADMIN: "from-red-500 to-rose-600",
}

const roleLabels = {
  STUDENT: "Student",
  MENTOR: "Mentor",
  ADMIN: "Admin",
}

interface ProfileHeaderProps {
  profile: FullProfile
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const joinedDate = new Date(profile.joinedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  const lastActive = new Date(profile.lastActive)
  const isOnline = Date.now() - lastActive.getTime() < 5 * 60 * 1000
  const lastActiveText = isOnline
    ? "Online now"
    : `Active ${lastActive.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-40 md:h-52 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${roleGradients[profile.role]} opacity-20`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-transparent to-transparent" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Profile Info Container */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div
              className={`w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br ${levelGradients[profile.identity.experienceLevel]} flex items-center justify-center text-3xl md:text-4xl font-bold text-white ring-4 ring-[#0a0b0f] shadow-2xl`}
            >
              {profile.avatar}
            </div>
            {/* Online indicator */}
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-[#0a0b0f]" />
            )}
            {/* Verified badge */}
            {profile.verified && (
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center ring-2 ring-[#0a0b0f]">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>

          {/* Name + Meta */}
          <div className="flex-1 pb-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.displayName}</h1>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-gradient-to-r ${roleGradients[profile.role]} text-white`}
                  >
                    {roleLabels[profile.role]}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-gradient-to-r ${levelGradients[profile.identity.experienceLevel]} text-white`}
                  >
                    {levelLabels[profile.identity.experienceLevel]}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">@{profile.handle}</p>
                <p className="text-sm text-slate-300 max-w-xl leading-relaxed">{profile.identity.bio}</p>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {joinedDate}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {lastActiveText}
                  </span>
                  {profile.social.communityRank && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-400">
                      <Trophy className="w-3.5 h-3.5" />
                      Rank #{profile.social.communityRank}
                    </span>
                  )}
                  {profile.stats.currentStreak >= 3 && (
                    <span className="flex items-center gap-1.5 text-xs text-orange-400">
                      <Flame className="w-3.5 h-3.5" />
                      {profile.stats.currentStreak}-win streak
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-2">
                {isOwnProfile ? (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isFollowing
                          ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                          : "bg-violet-500/20 border border-violet-500/30 text-violet-400 hover:bg-violet-500/30"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Stats Bar */}
        <div className="flex items-center gap-6 mt-6 pb-6 border-b border-white/5">
          <button className="group">
            <span className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
              {profile.social.followers.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500 ml-1.5">Followers</span>
          </button>
          <button className="group">
            <span className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
              {profile.social.following.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500 ml-1.5">Following</span>
          </button>
          <div>
            <span className="text-lg font-bold text-white">{profile.social.forecasts}</span>
            <span className="text-sm text-slate-500 ml-1.5">Forecasts</span>
          </div>
          <div>
            <span className="text-lg font-bold text-emerald-400">{profile.social.forecastAccuracy}%</span>
            <span className="text-sm text-slate-500 ml-1.5">Accuracy</span>
          </div>
        </div>
      </div>
    </div>
  )
}
