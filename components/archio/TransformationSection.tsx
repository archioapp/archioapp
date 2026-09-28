"use client"

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { useRef } from "react"
import { DeviceFrame } from "./DeviceFrame"

/**
 * TransformationSection — pinned scroll corridor.
 *
 * Six real product screenshots start scattered across the viewport at
 * mismatched angles, desaturated, disconnected. As the user scrolls, they
 * physically converge toward the center where the Cortex frame resolves
 * into a single luminous core. Headline crossfades from problem to
 * resolution.
 *
 * Graceful degradation:
 *   - prefers-reduced-motion → static final state
 *   - <lg viewport         → static collage layout via CSS grid
 */

type Fragment = {
  src: string
  alt: string
  /** scattered position % (left, top) at scrollProgress = 0 */
  start: [number, number]
  /** rotation at scatter, degrees */
  rot: number
  /** fragment width as % of stage */
  w: number
}

const FRAGMENTS: Fragment[] = [
  { src: "/archio/screens/02-dashboard.png",          alt: "Dashboard",     start: [3,  6],  rot: -5, w: 22 },
  { src: "/archio/screens/05-forecast.png",           alt: "Forecast",      start: [72, 3],  rot:  4, w: 22 },
  { src: "/archio/screens/06-intelligence.png",       alt: "Intelligence",  start: [78, 44], rot: -3, w: 22 },
  { src: "/archio/screens/08-hub.png",                alt: "Hub",           start: [2,  52], rot:  3, w: 22 },
  { src: "/archio/screens/09-communities.png",        alt: "Communities",   start: [66, 72], rot: -4, w: 22 },
  { src: "/archio/screens/12-execution-chart.png",    alt: "Execution",     start: [7,  76], rot:  5, w: 22 },
]

export function TransformationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })

  const coreOpacity   = useTransform(scrollYProgress, [0.25, 0.55, 0.9], [0, 0.7, 1])
  const coreScale     = useTransform(scrollYProgress, [0.2, 0.85], [0.85, 1])
  const fragOpacity   = useTransform(scrollYProgress, [0.35, 0.8], [1, 0.15])
  const fragDesat     = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]) // 0 saturated, 1 grey
  const titleA        = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 1, 0])
  const titleB        = useTransform(scrollYProgress, [0.45, 0.7, 0.95], [0, 0.9, 1])
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={ref}
      id="transformation"
      aria-labelledby="transformation-title"
      className="relative h-[220vh]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,211,238,0.08), transparent 65%), linear-gradient(180deg, #07080b 0%, #050710 100%)",
          }}
        />

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          {/* progress chrome */}
          <div className="mb-6 flex items-center justify-between">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
              02 · Convergence
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>Status</span>
              <div className="relative h-[2px] w-28 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="absolute inset-y-0 left-0 w-full bg-cyan-400"
                  style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
                />
              </div>
              <span className="text-cyan-300/80">merging</span>
            </div>
          </div>

          {/* crossfading headline */}
          <div
            id="transformation-title"
            className="relative mb-8 h-[100px] md:h-[120px]"
            aria-label="Archio converges scattered tools into one system"
          >
            <motion.h2
              style={{ opacity: reduce ? 0 : titleA }}
              className="absolute inset-0 max-w-3xl text-balance text-[28px] font-semibold leading-[1.08] tracking-tight text-white/90 md:text-[40px]"
            >
              They sold you tools —<br />
              scattered, disconnected, loud.
            </motion.h2>
            <motion.h2
              style={{ opacity: reduce ? 1 : titleB }}
              className="absolute inset-0 max-w-3xl text-balance text-[28px] font-semibold leading-[1.08] tracking-tight text-white md:text-[40px]"
            >
              We built a system —<br />
              <span className="text-cyan-300">one surface, one mind, one workflow.</span>
            </motion.h2>
          </div>

          {/* Stage — real screenshots converge into the core */}
          <div
            className="relative aspect-[16/9] w-full rounded-2xl border border-white/[0.06]"
            style={{ background: "linear-gradient(180deg, rgba(10,13,24,0.65), rgba(5,7,14,0.65))" }}
          >
            {/* Static collage fallback for reduced motion / small screens */}
            {/* On lg+, replaced by the animated converging fragments */}
            <div className="absolute inset-0 hidden lg:block">
              {FRAGMENTS.map((f, i) => (
                <ConvergingFragment
                  key={f.src}
                  f={f}
                  scrollYProgress={scrollYProgress}
                  reduce={!!reduce}
                  fragOpacity={fragOpacity}
                  fragDesat={fragDesat}
                  i={i}
                />
              ))}
            </div>

            {/* Mobile / <lg static collage */}
            <div className="relative grid h-full grid-cols-2 gap-2 p-3 lg:hidden">
              {FRAGMENTS.map((f) => (
                <div key={f.src} className="relative">
                  <DeviceFrame
                    src={f.src}
                    alt={f.alt}
                    variant="bare"
                    aspect="aspect-[16/10]"
                    sheen={false}
                    sizes="40vw"
                    imageClassName="opacity-70"
                  />
                </div>
              ))}
            </div>

            {/* The resolved core */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-10 hidden w-[36%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 lg:block"
              style={{ opacity: reduce ? 1 : coreOpacity, scale: reduce ? 1 : coreScale }}
            >
              <div
                aria-hidden
                className="absolute -inset-8 -z-10 rounded-[32px]"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(34,211,238,0.26), transparent 65%)",
                  filter: "blur(22px)",
                }}
              />
              <DeviceFrame
                src="/archio/screens/11-copilot-right-rail.png"
                alt="Archio Cortex — all modules unified"
                variant="rail"
                aspect="aspect-[3/4]"
                label="CORTEX"
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="border-cyan-400/30 shadow-[0_30px_80px_-20px_rgba(34,211,238,0.28)]"
              />
            </motion.div>

            {/* chrome corners */}
            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              <span className="h-1 w-1 rounded-full bg-cyan-400" />
              ARCHIO · stage
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              rendering unified surface
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * ConvergingFragment — extracted to a child so useTransform is not
 * called inside a .map() (which would violate Rules of Hooks).
 */
function ConvergingFragment({
  f,
  scrollYProgress,
  reduce,
  fragOpacity,
  fragDesat,
  i,
}: {
  f: Fragment
  scrollYProgress: MotionValue<number>
  reduce: boolean
  fragOpacity: MotionValue<number>
  fragDesat: MotionValue<number>
  i: number
}) {
  // Converge toward center (50%, 50%)
  const [sx, sy] = f.start
  const x        = useTransform(scrollYProgress, [0, 0.8], [`${sx}%`, "39%"])
  const y        = useTransform(scrollYProgress, [0, 0.8], [`${sy}%`, "33%"])
  const rot      = useTransform(scrollYProgress, [0, 0.8], [f.rot, 0])
  const scale    = useTransform(scrollYProgress, [0, 0.8], [1, 0.55])
  // Drive saturation via a transform string bound to the grey value.
  // Using a pre-built string because MotionValue can't interpolate strings
  // with units directly — pass the scalar into useTransform output.
  const filter   = useTransform(fragDesat, (g) => `saturate(${1 - g * 0.8}) brightness(${1 - g * 0.2})`)

  return (
    <motion.div
      className="absolute"
      style={{
        left: reduce ? "39%" : x,
        top: reduce ? "33%" : y,
        rotate: reduce ? 0 : rot,
        scale: reduce ? 0.6 : scale,
        opacity: reduce ? 0.2 : fragOpacity,
        filter: reduce ? "saturate(0.3)" : filter,
        width: `${f.w}%`,
        zIndex: 2,
      }}
      initial={false}
    >
      <DeviceFrame
        src={f.src}
        alt={f.alt}
        variant="bare"
        aspect="aspect-[16/10]"
        sheen={false}
        sizes="20vw"
      />
      <div
        className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-white/35"
        style={{ opacity: i === 0 ? 1 : 0.8 }}
      >
        {f.alt}
      </div>
    </motion.div>
  )
}
