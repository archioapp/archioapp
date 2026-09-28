"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Users,
  Calendar,
  Bell,
  Settings,
  Award,
  Target,
  Clock,
  ArrowRight,
  Star,
  BarChart3,
} from "lucide-react"

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const mockData = {
    user: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "Advanced",
      points: 2840,
      streak: 12,
    },
    stats: {
      coursesCompleted: 8,
      totalCourses: 12,
      studyHours: 156,
      communityRank: 23,
    },
    recentActivity: [
      { type: "course", title: "Sustainable Design Principles", progress: 85, time: "2 hours ago" },
      { type: "community", title: "Joined AI Architecture Hub", time: "1 day ago" },
      { type: "achievement", title: "Earned 'Design Innovator' badge", time: "3 days ago" },
      { type: "forecast", title: "Submitted market forecast", time: "5 days ago" },
    ],
    upcomingEvents: [
      { title: "Weekly Design Review", date: "Today, 3:00 PM", type: "meeting" },
      { title: "BIM Workshop", date: "Tomorrow, 10:00 AM", type: "workshop" },
      { title: "Community Showcase", date: "Friday, 2:00 PM", type: "event" },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-purple-500/50">
            <img
              src={mockData.user.avatar || "/placeholder.svg"}
              alt={mockData.user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {mockData.user.name}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {mockData.user.level}
              </Badge>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                <span>{mockData.user.points} points</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-emerald-400" />
                <span>{mockData.user.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800/50">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800/50">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Course Progress</p>
              <p className="text-2xl font-bold text-white">
                {mockData.stats.coursesCompleted}/{mockData.stats.totalCourses}
              </p>
            </div>
          </div>
          <Progress
            value={(mockData.stats.coursesCompleted / mockData.stats.totalCourses) * 100}
            className="mt-3 h-2"
          />
        </Card>

        <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/20 p-2">
              <Clock className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Study Hours</p>
              <p className="text-2xl font-bold text-white">{mockData.stats.studyHours}</p>
            </div>
          </div>
        </Card>

        <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Community Rank</p>
              <p className="text-2xl font-bold text-white">#{mockData.stats.communityRank}</p>
            </div>
          </div>
        </Card>

        <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Achievements</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-800/30 p-3"
                >
                  <div
                    className={`rounded-lg p-2 ${
                      activity.type === "course"
                        ? "bg-blue-500/20"
                        : activity.type === "community"
                          ? "bg-purple-500/20"
                          : activity.type === "achievement"
                            ? "bg-amber-500/20"
                            : "bg-emerald-500/20"
                    }`}
                  >
                    {activity.type === "course" && <BookOpen className="h-4 w-4 text-blue-400" />}
                    {activity.type === "community" && <Users className="h-4 w-4 text-purple-400" />}
                    {activity.type === "achievement" && <Award className="h-4 w-4 text-amber-400" />}
                    {activity.type === "forecast" && <BarChart3 className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <p className="text-xs text-zinc-400">{activity.time}</p>
                  </div>
                  {activity.progress && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{activity.progress}%</p>
                      <Progress value={activity.progress} className="mt-1 h-1 w-16" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Upcoming</h2>
              <Calendar className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="space-y-3">
              {mockData.upcomingEvents.map((event, index) => (
                <div key={index} className="rounded-lg border border-zinc-800/50 bg-zinc-800/30 p-3">
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        event.type === "meeting"
                          ? "bg-blue-400"
                          : event.type === "workshop"
                            ? "bg-emerald-400"
                            : "bg-purple-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{event.title}</p>
                      <p className="text-xs text-zinc-400">{event.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
