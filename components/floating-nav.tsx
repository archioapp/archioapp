"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Activity, BarChart3, ChevronDown, Globe, TrendingUp, LayoutDashboard } from "lucide-react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, subtitle: "Private command center" },
  { name: "Signal Terminal", href: "/", icon: Activity, subtitle: "Real-time market analysis" },
  { name: "Macro Economic", href: "/intelligence", icon: BarChart3, subtitle: "Macro event analysis" },
  { name: "Forecast Hub", href: "/forecast", icon: TrendingUp, subtitle: "Prediction record system" },
  { name: "Community", href: "/communities", icon: Globe, subtitle: "Groups & Social Meetings" },
]

function LiveClock() {
  const [time, setTime] = useState("--:--:--")
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const utcTime = now.toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false })
      setTime(utcTime)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="text-center select-none">
      <div className="text-2xl font-extrabold text-white tabular-nums">{time}</div>
      <div className="text-xs text-zinc-400 tracking-wider">UTC</div>
    </div>
  )
}

type MenuLinkProps = {
  href: string
  title: string
  subtitle: string
  icon: any
  active?: boolean
}

function MenuLink({ href, title, subtitle, icon: Icon, active }: MenuLinkProps) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(0, { stiffness: 500, damping: 15 })
  const rotY = useSpring(0, { stiffness: 500, damping: 15 })
  const scale = useSpring(1, { stiffness: 500, damping: 15 })

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mx.set(x)
    my.set(y)
    setMousePosition({ x, y })

    const rx = (y / rect.height - 0.5) * -6
    const ry = (x / rect.width - 0.5) * 6
    rotX.set(rx)
    rotY.set(ry)
  }

  function onEnter() {
    scale.set(1.05)
    setIsHovered(true)
    try {
      // @ts-expect-error next/navigation router may not expose prefetch in some versions; optional call.
      router.prefetch?.(href)
    } catch {}
  }
  function onLeave() {
    rotX.set(0)
    rotY.set(0)
    scale.set(1)
    setIsHovered(false)
  }

  return (
    <Link href={href} prefetch className="block">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={
          {
            "--mx": `${mx.get()}px`,
            "--my": `${my.get()}px`,
            rotateX: rotX,
            rotateY: rotY,
            scale,
            transformStyle: "preserve-3d",
          } as React.CSSProperties
        }
        className={cn(
          "group relative select-none rounded-xl p-2.5 mx-1 overflow-hidden",
          "transition-all duration-150 will-change-transform",
          "backdrop-blur-xl",
          "bg-gradient-to-br from-black/20 via-black/10 to-transparent",
          !active && "hover:border hover:border-white/10",
          active && "border border-purple-400/30 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent",
        )}
      >
        {active && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-gradient-to-b from-purple-400/80 to-purple-600/80"
          />
        )}

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.04), rgba(147, 51, 234, 0.01) 40%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.02), transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl border border-purple-400/20 opacity-0 transition-opacity duration-200"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered ? "0 0 20px rgba(147,51,234,0.05), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
          }}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
          style={{
            background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
            transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
            transition: "transform 0.6s ease-in-out, opacity 0.2s ease",
          }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <motion.div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
              "backdrop-blur-sm border border-white/10",
              "bg-gradient-to-br from-white/5 via-transparent to-white/5",
              isHovered && "border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-transparent",
              "shadow-lg shadow-black/20",
            )}
            whileHover={{
              scale: 1.08,
              rotateY: 4,
              transition: { duration: 0.15 },
            }}
          >
            <Icon
              className={cn(
                "w-4 h-4 transition-all duration-150",
                active ? "text-purple-300" : "text-white/80",
                isHovered && "text-purple-300 drop-shadow-[0_0_8px_rgba(147,51,234,0.15)]",
              )}
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.p
              className={cn(
                "font-semibold text-xs whitespace-nowrap truncate transition-all duration-150",
                active ? "text-white" : "text-white/90",
                isHovered && "text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.075)]",
              )}
              whileHover={{ x: 1 }}
            >
              {title}
            </motion.p>
            <motion.p
              className={cn(
                "text-[10px] transition-colors duration-150 truncate",
                active ? "text-purple-300/80" : "text-purple-300/60",
                isHovered && "text-purple-300/90",
              )}
              whileHover={{ x: 1 }}
            >
              {subtitle}
            </motion.p>
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.1)`,
          }}
        />
      </motion.div>
    </Link>
  )
}

/* Presentation surfaces own the whole viewport — the left-edge chevron
   sat over their headlines on every slide. */
const HIDDEN_ON = ["/pitch", "/owen", "/live-room"]

export function FloatingNav() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  if (HIDDEN_ON.some((p) => pathname === p || pathname?.startsWith(p + "/"))) return null

  return (
    <div
      aria-label="Global navigation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-4 left-0 z-[48] h-[45%] w-5"
    >
      {/* Left edge trigger -- thin invisible strip + chevron hint */}
      <motion.div
        className="absolute top-1/2 left-1 -translate-y-1/2"
        animate={{ opacity: isHovered ? 0 : 0.6, scale: isHovered ? 0.5 : 1, x: isHovered ? -20 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="p-1.5 rounded-full">
          <ChevronDown className="w-4 h-4 text-purple-300/70 -rotate-90" />
        </div>
      </motion.div>

      {/* All nav cards shown at once on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.nav
            key="nav-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute top-1/2 -translate-y-1/2 left-0 flex flex-col gap-1.5 w-[220px] pl-1"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 28 }}
              >
                <MenuLink
                  href={item.href}
                  title={item.name}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  active={pathname === item.href}
                />
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
