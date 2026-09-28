"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FullProfile, ProfileCard, Badge, ActivityItem } from "@/types/profile"

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA - Replace with Supabase queries in production
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_BADGES: Badge[] = [
  { id: "1", name: "5-Win Streak", description: "Won 5 trades in a row", icon: "flame", category: "streak", earnedAt: "2026-03-15", rarity: "rare" },
  { id: "2", name: "Century Club", description: "Completed 100 trades", icon: "target", category: "milestone", earnedAt: "2026-02-20", rarity: "common" },
  { id: "3", name: "Top Forecaster", description: "Top 10% forecast accuracy", icon: "star", category: "community", earnedAt: "2026-03-01", rarity: "epic" },
  { id: "4", name: "Early Adopter", description: "Joined during beta", icon: "shield", category: "special", earnedAt: "2025-12-01", rarity: "legendary" },
  { id: "5", name: "Mentor Pick", description: "Recognized by mentor", icon: "award", category: "mentor", earnedAt: "2026-03-10", rarity: "rare" },
]

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "1", type: "trade", title: "EUR/USD Long", description: "+2.3R profit on NY session reversal", timestamp: "2026-04-04T08:30:00Z" },
  { id: "2", type: "forecast", title: "Gold Bearish Bias", description: "Published forecast for XAU/USD", timestamp: "2026-04-03T14:00:00Z" },
  { id: "3", type: "war-room", title: "Joined Gold Masters Room", description: "Active in XAUUSD analysis session", timestamp: "2026-04-03T09:00:00Z" },
  { id: "4", type: "badge", title: "Earned 5-Win Streak", description: "Consecutive winning trades", timestamp: "2026-04-02T16:00:00Z" },
  { id: "5", type: "journal", title: "Weekly Review", description: "Completed session analysis", timestamp: "2026-04-01T20:00:00Z" },
]

const MOCK_PROFILE: FullProfile = {
  id: "user-001",
  handle: "alexchen",
  displayName: "Alex Chen",
  avatar: "AC",
  bannerUrl: undefined,
  role: "STUDENT",
  verified: true,
  verifiedAt: "2026-01-15",
  joinedAt: "2025-12-01",
  lastActive: "2026-04-04T09:00:00Z",
  
  identity: {
    style: "day",
    methodology: "ICT + Smart Money Concepts",
    primaryMarkets: ["Forex", "Gold", "Indices"],
    primaryInstruments: ["EUR/USD", "GBP/USD", "XAU/USD", "NAS100"],
    preferredSessions: ["London", "New York"],
    experienceYears: 2,
    experienceLevel: "advanced",
    bio: "ICT methodology trader focusing on FX and Gold. Swing + intraday hybrid approach. Learning to trade with patience and discipline.",
    tradingPhilosophy: "Wait for the setup, not the trade. Protect capital above all else.",
  },
  
  stats: {
    totalTrades: 342,
    wins: 260,
    losses: 82,
    winRate: 76,
    avgRR: 1.9,
    totalR: 124.6,
    bestMonth: { month: "January 2026", r: 31.2 },
    currentStreak: 4,
    longestStreak: 9,
    sharpeRatio: 1.8,
    profitFactor: 2.4,
    last7Days: { r: 8.4, trades: 12, winRate: 83 },
    last30Days: { r: 28.6, trades: 48, winRate: 77 },
    allTime: { r: 124.6, trades: 342, winRate: 76 },
    trustLevel: "verified",
  },
  
  social: {
    followers: 847,
    following: 124,
    forecasts: 89,
    forecastAccuracy: 72,
    warRoomsJoined: 156,
    warRoomsHosted: 12,
    helpfulVotes: 234,
    communityRank: 2,
  },
  
  badges: MOCK_BADGES,
  
  connectedAccounts: [
    { platform: "tradingview", username: "alexchen_tv", linkedAt: "2025-12-15", verified: true, profileUrl: "https://tradingview.com/u/alexchen_tv" },
    { platform: "discord", username: "alex#1234", linkedAt: "2025-12-01", verified: true },
  ],
  
  recentActivity: MOCK_ACTIVITY,
  
  studentProfile: {
    assignedMentor: { id: "mentor-001", name: "JadeCap", avatar: "JC" },
    enrolledCourses: ["ICT NY Session Mastery", "Risk Management Fundamentals"],
    completedLessons: 42,
    totalLessons: 56,
    currentPhase: "Phase 3: Live Execution",
    learningGoals: ["Consistent 2R/week", "Master OB entries", "Reduce revenge trading"],
    weeklyCommitment: 15,
    nextSession: { date: "2026-04-05T14:00:00Z", topic: "Trade Review + Psychology Check" },
  },
  
  privacy: {
    stats: "community",
    activity: "community",
    connections: "private",
  },
}

const MOCK_MENTOR_PROFILE: FullProfile = {
  ...MOCK_PROFILE,
  id: "mentor-001",
  handle: "jadecap",
  displayName: "JadeCap",
  avatar: "JC",
  role: "MENTOR",
  verified: true,
  identity: {
    ...MOCK_PROFILE.identity,
    style: "day",
    methodology: "ICT + Order Flow",
    experienceYears: 8,
    experienceLevel: "elite",
    bio: "Professional trader and mentor. Specializing in ICT methodology and institutional order flow. Helping traders build discipline and consistency.",
  },
  stats: {
    ...MOCK_PROFILE.stats,
    totalTrades: 2847,
    wins: 2163,
    losses: 684,
    winRate: 76,
    avgRR: 2.1,
    totalR: 892.4,
    bestMonth: { month: "March 2026", r: 48.6 },
    longestStreak: 14,
  },
  social: {
    ...MOCK_PROFILE.social,
    followers: 12400,
    following: 89,
    forecasts: 456,
    forecastAccuracy: 78,
    warRoomsHosted: 234,
    communityRank: 1,
  },
  mentorProfile: {
    mentorSince: "2022-06-01",
    totalMentees: 234,
    activeMentees: 42,
    menteeSuccessRate: 68,
    sessionCount: 1240,
    avgMenteeImprovement: 34,
    methodology: "ICT NY Session + Psychology Framework",
    specializations: ["NY Session", "Gold Trading", "Risk Management", "Trading Psychology"],
    availability: {
      timezone: "America/New_York",
      slots: [
        { day: "Monday", times: ["09:00", "14:00"] },
        { day: "Wednesday", times: ["09:00", "14:00"] },
        { day: "Friday", times: ["09:00"] },
      ],
    },
    testimonials: [
      { from: "Alex Chen", avatar: "AC", text: "JadeCap completely transformed my trading. Finally consistent after 2 years of struggle.", rating: 5, date: "2026-03-15" },
      { from: "Sarah M.", avatar: "SM", text: "The psychology sessions were game-changing. Best investment I've made.", rating: 5, date: "2026-02-20" },
    ],
  },
  studentProfile: undefined,
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface ProfileState {
  // Current user's profile
  myProfile: FullProfile | null
  isLoading: boolean
  
  // Viewed profiles cache
  viewedProfiles: Record<string, FullProfile>
  
  // Actions
  loadMyProfile: () => Promise<void>
  updateMyProfile: (updates: Partial<FullProfile>) => void
  loadProfile: (userId: string) => Promise<FullProfile | null>
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  
  // Demo mode toggle
  isDemoMentor: boolean
  toggleDemoRole: () => void
}

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      myProfile: null,
      isLoading: false,
      viewedProfiles: {},
      isDemoMentor: false,
      
      loadMyProfile: async () => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise(r => setTimeout(r, 300))
        const profile = get().isDemoMentor ? MOCK_MENTOR_PROFILE : MOCK_PROFILE
        set({ myProfile: profile, isLoading: false })
      },
      
      updateMyProfile: (updates) => {
        set((s) => ({
          myProfile: s.myProfile ? { ...s.myProfile, ...updates } : null,
        }))
      },
      
      loadProfile: async (userId) => {
        // Check cache first
        const cached = get().viewedProfiles[userId]
        if (cached) return cached
        
        // Simulate API call
        await new Promise(r => setTimeout(r, 200))
        
        // Return mock based on ID
        const profile = userId.includes("mentor") ? MOCK_MENTOR_PROFILE : MOCK_PROFILE
        set((s) => ({
          viewedProfiles: { ...s.viewedProfiles, [userId]: profile },
        }))
        return profile
      },
      
      followUser: (userId) => {
        // Update social stats
        set((s) => ({
          myProfile: s.myProfile
            ? { ...s.myProfile, social: { ...s.myProfile.social, following: s.myProfile.social.following + 1 } }
            : null,
        }))
      },
      
      unfollowUser: (userId) => {
        set((s) => ({
          myProfile: s.myProfile
            ? { ...s.myProfile, social: { ...s.myProfile.social, following: Math.max(0, s.myProfile.social.following - 1) } }
            : null,
        }))
      },
      
      toggleDemoRole: () => {
        const isDemoMentor = !get().isDemoMentor
        const profile = isDemoMentor ? MOCK_MENTOR_PROFILE : MOCK_PROFILE
        set({ isDemoMentor, myProfile: profile })
      },
    }),
    { name: "archio.profile.v1" }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Convert full profile to card
// ═══════════════════════════════════════════════════════════════════════════════
export function profileToCard(profile: FullProfile): ProfileCard {
  return {
    id: profile.id,
    handle: profile.handle,
    displayName: profile.displayName,
    avatar: profile.avatar,
    role: profile.role,
    verified: profile.verified,
    level: profile.identity.experienceLevel,
    winRate: profile.stats.winRate,
    totalR: profile.stats.totalR,
    streak: profile.stats.currentStreak,
    badges: profile.badges.slice(0, 3),
    isFollowing: false,
    isOnline: new Date(profile.lastActive).getTime() > Date.now() - 5 * 60 * 1000,
  }
}
