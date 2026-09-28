"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Brain, Users, MessageSquare, Zap, Activity, TrendingUp, Shield, Globe, Presentation } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigationItems = [
  { title: "Neural Matrix", icon: Brain, url: "/", isActive: true },
  { title: "Live Markets", icon: Activity, url: "/intelligence" },
  { title: "Forecast Hub", icon: TrendingUp, url: "/forecast" },
  { title: "Student Hub", icon: Users, url: "/hub", isActive: false },
  { title: "Community", icon: Globe, url: "/communities", isActive: false },
  { title: "Quantum Chat", icon: MessageSquare, url: "/nexus" },
  { title: "Risk Shield", icon: Shield, url: "/history" },
  { title: "Investor Deck", icon: Presentation, url: "/pitch" },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-slate-grey bg-matte-black">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-grey flex items-center justify-center border border-zinc-800">
            <Brain className="w-7 h-7 text-luxury-gold" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wider text-white">ArchioAI</h1>
            <p className="text-xs text-zinc-500">Institutional Terminal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className={`text-zinc-400 hover:text-white hover:bg-slate-grey group relative ${item.isActive ? "bg-slate-grey text-white" : ""}`}
                  >
                    <a href={item.url} className="flex items-center gap-3 relative z-10">
                      <item.icon className={`w-4 h-4 ${item.isActive ? "text-luxury-gold" : "text-zinc-500"}`} />
                      <span className="font-medium">{item.title}</span>
                      {item.isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-gold" />}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-3 bg-slate-grey rounded-lg border border-zinc-800">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-metallic-bronze text-white">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">John Doe</p>
            <p className="text-xs text-muted-emerald flex items-center gap-1.5">
              <span className="w-2 h-2 bg-muted-emerald rounded-full" />
              Online
            </p>
          </div>
          <Zap className="w-5 h-5 text-luxury-gold" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
