"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap,
  Users,
  TrendingUp,
  Calendar,
  Star,
  Clock,
  ChevronDown,
  MessageSquare,
  Video,
  CheckCircle2,
} from "lucide-react"
import type { MentorProfile } from "@/types/profile"

interface ProfileMentorModuleProps {
  mentorProfile: MentorProfile
}

export function ProfileMentorModule({ mentorProfile }: ProfileMentorModuleProps) {
  const [showTestimonials, setShowTestimonials] = useState(false)

  const mentorSinceDate = new Date(mentorProfile.mentorSince).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-amber-500/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-400">Mentor Profile</h3>
            <p className="text-[10px] text-amber-400/60">Teaching since {mentorSinceDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-400 hover:bg-amber-500/30 transition-all">
            <Video className="w-3 h-3" />
            Book Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-5">
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
            <Users className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white font-mono">{mentorProfile.totalMentees}</p>
            <p className="text-[9px] text-slate-500 uppercase">Total Mentees</p>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-400 font-mono">{mentorProfile.menteeSuccessRate}%</p>
            <p className="text-[9px] text-slate-500 uppercase">Success Rate</p>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
            <Calendar className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white font-mono">{mentorProfile.sessionCount}</p>
            <p className="text-[9px] text-slate-500 uppercase">Sessions</p>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
            <TrendingUp className="w-4 h-4 text-violet-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-violet-400 font-mono">+{mentorProfile.avgMenteeImprovement}%</p>
            <p className="text-[9px] text-slate-500 uppercase">Avg Improve</p>
          </div>
        </div>

        {/* Methodology & Specializations */}
        <div className="mb-5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Methodology</p>
          <p className="text-sm text-white font-medium mb-3">{mentorProfile.methodology}</p>

          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {mentorProfile.specializations.map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Availability ({mentorProfile.availability.timezone})
          </p>
          <div className="grid grid-cols-3 gap-2">
            {mentorProfile.availability.slots.map((slot) => (
              <div key={slot.day} className="p-2 rounded-lg bg-black/20 border border-white/5">
                <p className="text-[10px] text-white font-medium mb-1">{slot.day}</p>
                <div className="flex flex-wrap gap-1">
                  {slot.times.map((time) => (
                    <span key={time} className="text-[9px] text-slate-400 font-mono">{time}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Toggle */}
        <button
          onClick={() => setShowTestimonials(!showTestimonials)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-black/20 border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-black/30 transition-all"
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Testimonials ({mentorProfile.testimonials.length})
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showTestimonials ? "rotate-180" : ""}`} />
        </button>

        {/* Testimonials */}
        <AnimatePresence>
          {showTestimonials && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                {mentorProfile.testimonials.map((t, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                        {t.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white font-medium">{t.from}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3 h-3 ${j < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(t.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{t.text}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
