"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import {
  Menu,
  Brain,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  GraduationCap,
  BarChart3,
  Award,
  BookOpen,
  Terminal,
} from "lucide-react"
import { useCommandStore } from "@/lib/stores/commandStore"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/stores/useSession"
import { useProfile } from "@/lib/stores/useProfile"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Dashboard", link: "/" },
  { name: "AI Forecasts", link: "/intelligence" },
  { name: "Student Hub", link: "/hub" },
  { name: "Community", link: "/community" },
  { name: "Execution Co-Pilot", link: "/copilot" },
  { name: "Nexus", link: "/nexus" },
]

const levelGradients = {
  beginner: "from-slate-500 to-slate-600",
  intermediate: "from-sky-500 to-blue-600",
  advanced: "from-violet-500 to-indigo-600",
  elite: "from-amber-500 to-orange-600",
}

export function Header() {
  const pathname = usePathname()
  const { user, signOut } = useSession()
  const { myProfile, isDemoMentor, toggleDemoRole } = useProfile()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { toggleCommandBar, setRailOpen, setRailCollapsed } = useCommandStore()

  const isLoggedIn = !!user || !!myProfile
  const displayName = user?.handle || myProfile?.displayName || "Guest"
  const avatar = myProfile?.avatar || displayName.slice(0, 2).toUpperCase()
  const role = user?.role || myProfile?.role || "STUDENT"
  const level = myProfile?.identity?.experienceLevel || "intermediate"

  return (
    <header className="bg-matte-black/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-grey">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-luxury-gold" />
              <span className="text-xl font-bold uppercase tracking-widest text-white">ARCHIO AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Command Layer Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleCommandBar()}
              className="text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/10 relative group"
              aria-label="Open command bar"
            >
              <Terminal className="h-5 w-5" />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/0 group-hover:text-white/30 transition-all whitespace-nowrap">Cmd+K</span>
              <span className="sr-only">Open command bar</span>
            </Button>

            {/* Command Rail Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRailOpen(true)
                setRailCollapsed(false)
              }}
              className="text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10 relative"
              aria-label="Open command rail"
            >
              <Brain className="h-5 w-5" />
              <span className="sr-only">Open command rail</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-slate-grey relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              <span className="sr-only">Notifications</span>
            </Button>

            {isLoggedIn ? (
              /* Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${levelGradients[level]} flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {avatar}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-white">{displayName}</p>
                    <p className="text-[10px] text-slate-500">{role}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsProfileOpen(false)}
                        className="fixed inset-0 z-40"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-[#111318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        {/* Profile Header */}
                        <div className="p-4 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${levelGradients[level]} flex items-center justify-center text-lg font-bold text-white`}
                            >
                              {avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{displayName}</p>
                              <p className="text-[10px] text-slate-500">@{user?.handle || "user"}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                    role === "MENTOR"
                                      ? "bg-amber-500/20 text-amber-400"
                                      : "bg-violet-500/20 text-violet-400"
                                  }`}
                                >
                                  {role}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <User className="w-4 h-4" />
                            View Profile
                          </Link>
                          <Link
                            href="/profile/stats"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <BarChart3 className="w-4 h-4" />
                            My Stats
                          </Link>
                          <Link
                            href="/profile/badges"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <Award className="w-4 h-4" />
                            Badges & Achievements
                          </Link>

                          {role === "MENTOR" && (
                            <Link
                              href="/mentor/dashboard"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 transition-all"
                            >
                              <GraduationCap className="w-4 h-4" />
                              Mentor Dashboard
                            </Link>
                          )}

                          {role === "STUDENT" && (
                            <Link
                              href="/learning"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-violet-400 hover:bg-violet-500/10 transition-all"
                            >
                              <BookOpen className="w-4 h-4" />
                              My Learning
                            </Link>
                          )}

                          <div className="my-2 border-t border-white/5" />

                          <Link
                            href="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>

                          {/* Demo Toggle - Development Only */}
                          <button
                            onClick={() => {
                              toggleDemoRole()
                              setIsProfileOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sky-400 hover:bg-sky-500/10 transition-all"
                          >
                            <Brain className="w-4 h-4" />
                            Toggle Demo Role
                          </button>

                          <button
                            onClick={() => {
                              signOut()
                              setIsProfileOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button className="bg-luxury-gold text-matte-black hover:bg-amber-300 font-bold">Login</Button>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-white" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-matte-black border-slate-grey text-white w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 p-4">
                  {isLoggedIn ? (
                    <>
                      {/* Mobile Profile Header */}
                      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${levelGradients[level]} flex items-center justify-center text-lg font-bold text-white`}
                        >
                          {avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{displayName}</p>
                          <p className="text-[10px] text-slate-500">{role}</p>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Button className="bg-luxury-gold text-matte-black hover:bg-amber-300 font-bold w-full mt-4">
                      Login
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
