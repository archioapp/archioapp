"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Flame,
} from "lucide-react"
import type { StudentProfile } from "@/types/profile"

interface ProfileStudentModuleProps {
  studentProfile: StudentProfile
}

export function ProfileStudentModule({ studentProfile }: ProfileStudentModuleProps) {
  const progressPercent = (studentProfile.completedLessons / studentProfile.totalLessons) * 100

  const nextSessionDate = studentProfile.nextSession
    ? new Date(studentProfile.nextSession.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null

  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 border border-violet-500/20 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-violet-500/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-violet-400">Learning Journey</h3>
            <p className="text-[10px] text-violet-400/60">{studentProfile.currentPhase}</p>
          </div>
        </div>
        
        {/* Assigned Mentor */}
        {studentProfile.assignedMentor && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
              {studentProfile.assignedMentor.avatar}
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Mentor</p>
              <p className="text-xs text-white font-medium">{studentProfile.assignedMentor.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Course Progress</span>
            <span className="text-xs text-violet-400 font-mono font-bold">
              {studentProfile.completedLessons}/{studentProfile.totalLessons} lessons
            </span>
          </div>
          <div className="h-3 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{Math.round(progressPercent)}% complete</p>
        </div>

        {/* Enrolled Courses */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3 h-3" />
            Enrolled Courses
          </p>
          <div className="space-y-2">
            {studentProfile.enrolledCourses.map((course, i) => (
              <div
                key={course}
                className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-black/30 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                </div>
                <span className="flex-1 text-sm text-white">{course}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-3 h-3" />
            Learning Goals
          </p>
          <div className="space-y-2">
            {studentProfile.learningGoals.map((goal, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-black/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400/50" />
                <span className="text-xs text-slate-300">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Session */}
        {studentProfile.nextSession && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-bold">Next Session</span>
            </div>
            <p className="text-sm text-white font-medium mb-1">{studentProfile.nextSession.topic}</p>
            <p className="text-xs text-emerald-400/70 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {nextSessionDate}
            </p>
          </div>
        )}

        {/* Weekly Commitment */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-400">Weekly Commitment</span>
          </div>
          <span className="text-sm text-white font-mono font-bold">{studentProfile.weeklyCommitment}h</span>
        </div>
      </div>
    </div>
  )
}
