"use client"

import { useEffect } from "react"
import { useProfile } from "@/lib/stores/useProfile"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStats } from "@/components/profile/ProfileStats"
import { ProfileIdentity } from "@/components/profile/ProfileIdentity"
import { ProfileBadges } from "@/components/profile/ProfileBadges"
import { ProfileActivity } from "@/components/profile/ProfileActivity"
import { ProfileMentorModule } from "@/components/profile/ProfileMentorModule"
import { ProfileStudentModule } from "@/components/profile/ProfileStudentModule"
import { ProfileConnections } from "@/components/profile/ProfileConnections"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { myProfile, isLoading, loadMyProfile, isDemoMentor, toggleDemoRole } = useProfile()

  useEffect(() => {
    loadMyProfile()
  }, [loadMyProfile])

  if (isLoading || !myProfile) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      {/* Demo Role Toggle - Development Only */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={toggleDemoRole}
          className="px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-[10px] font-mono text-violet-400 hover:bg-violet-500/30 transition-all"
        >
          Demo: {isDemoMentor ? "MENTOR" : "STUDENT"}
        </button>
      </div>

      {/* Profile Header - Banner + Avatar + Core Info */}
      <ProfileHeader profile={myProfile} isOwnProfile={true} />

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stats + Identity */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProfileStats stats={myProfile.stats} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProfileIdentity identity={myProfile.identity} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProfileConnections accounts={myProfile.connectedAccounts} />
            </motion.div>
          </div>

          {/* Right Column - Role Module + Activity + Badges */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Role-Specific Module */}
            {myProfile.role === "MENTOR" && myProfile.mentorProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <ProfileMentorModule mentorProfile={myProfile.mentorProfile} />
              </motion.div>
            )}

            {myProfile.role === "STUDENT" && myProfile.studentProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <ProfileStudentModule studentProfile={myProfile.studentProfile} />
              </motion.div>
            )}

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <ProfileBadges badges={myProfile.badges} />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <ProfileActivity activity={myProfile.recentActivity} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
