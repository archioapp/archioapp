"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ACCENT } from "@/components/mtf/mtf-theme"
import { ArchioLogoMark, LoaderIcon } from "./icons"

type PortalState = "idle" | "scanning" | "processing" | "verified" | "denied" | "fallback"
type DeviceMode = "desktop" | "phone" | null
interface AccessPortalProps { onAuthenticated?: () => void; onNavigateRegister?: () => void; error?: string; successMessage?: string; onSwitchToCredentials?: () => void }

const FACE: [number, number][] = [[112,225],[107,260],[103,295],[105,330],[112,364],[124,395],[142,422],[165,444],[250,455],[335,444],[358,422],[376,395],[388,364],[395,330],[397,295],[393,260],[388,225],[148,200],[168,182],[195,178],[222,182],[244,195],[256,195],[278,182],[305,178],[332,182],[352,200],[250,215],[250,245],[250,275],[250,302],[215,315],[232,322],[250,328],[268,322],[285,315],[163,228],[180,215],[202,215],[220,230],[202,238],[180,238],[280,230],[298,215],[320,215],[337,228],[320,238],[298,238],[195,375],[212,360],[230,352],[250,356],[270,352],[288,360],[305,375],[288,392],[270,400],[250,404],[230,400],[212,392],[205,375],[230,365],[250,368],[270,365],[295,375],[270,385],[250,390],[230,385]]
const MESH: [number, number][] = [...Array.from({length:16},(_,i)=>[i,i+1] as [number,number]),[17,18],[18,19],[19,20],[20,21],[22,23],[23,24],[24,25],[25,26],[27,28],[28,29],[29,30],[30,33],[31,32],[32,33],[33,34],[34,35],[27,21],[27,22],[36,37],[37,38],[38,39],[39,40],[40,41],[41,36],[42,43],[43,44],[44,45],[45,46],[46,47],[47,42],[37,40],[38,41],[43,46],[44,47],[17,36],[19,37],[20,38],[21,39],[22,42],[24,43],[25,44],[26,45],[48,49],[49,50],[50,51],[51,52],[52,53],[53,54],[54,55],[55,56],[56,57],[57,58],[58,59],[59,48],[60,61],[61,62],[62,63],[63,64],[64,65],[65,66],[66,67],[67,60],[36,27],[45,27],[0,36],[16,45],[39,42],[31,3],[35,13],[33,51],[30,48],[30,54],[5,48],[6,48],[10,54],[11,54],[2,41],[14,46],[3,31],[13,35],[4,48],[12,54],[17,27],[26,27],[0,17],[16,26],[39,28],[42,28],[7,59],[9,55]]

/* ─────────────────────────────────────────────────────────
   BREATHING ECOSYSTEM BACKGROUND — Enhanced
───────────────────────────────────────────────────────── */
function BreathingEcosystem({ accent, breath }: { accent: { r: number; g: number; b: number }; breath: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext("2d", { alpha: true }); if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio, 2)
    const resize = () => { c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    resize(); window.addEventListener("resize", resize)
    const pts = Array.from({ length: 90 }, () => ({ x: Math.random() * c.offsetWidth, y: Math.random() * c.offsetHeight, vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.09, r: 0.8 + Math.random() * 2.5, a: 0.03 + Math.random() * 0.08, p: Math.random() * Math.PI * 2 }))
    let alive = true
    const draw = () => {
      if (!alive) return
      const w = c.offsetWidth, h = c.offsetHeight; ctx.clearRect(0, 0, w, h)
      const { r, g, b } = accent
      for (const p of pts) { p.x += p.vx; p.y += p.vy; p.p += 0.008; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0 }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < 180) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / 180) * 0.07})`; ctx.lineWidth = 0.4; ctx.stroke() } }
      for (const p of pts) { const br = 1 + Math.sin(p.p) * 0.5; const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6 * br); grd.addColorStop(0, `rgba(${r},${g},${b},${p.a * br * 0.5})`); grd.addColorStop(1, `rgba(${r},${g},${b},0)`); ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6 * br, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(p.x, p.y, p.r * br, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${p.a * br * 1.6})`; ctx.fill() }
      requestAnimationFrame(draw)
    }
    draw(); return () => { alive = false; window.removeEventListener("resize", resize) }
  }, [accent])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />
}

/* ─────────────────────────────────────────────────────────
   DEVICE PANEL SVGs - Animated side panels
───────────────────────────────────────────────────────── */
function DesktopSVG({ hovered, breath, tick }: { hovered: boolean; breath: number; tick: number }) {
  const pulse = 0.5 + breath * 0.5
  const scanY = ((tick * 0.8) % 58) + 14
  return (
    <svg viewBox="0 0 160 130" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="dsk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`rgba(139,92,246,${0.18 + pulse * 0.12})`} />
          <stop offset="60%" stopColor={`rgba(139,92,246,${0.04 + pulse * 0.04})`} />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </radialGradient>
        <filter id="dsk-glow-f"><feGaussianBlur stdDeviation={hovered ? "4" : "2"}/></filter>
        <linearGradient id="dsk-chart-g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={`rgba(16,185,129,${hovered ? 0.9 : 0.4})`} />
          <stop offset="100%" stopColor={`rgba(139,92,246,${hovered ? 0.7 : 0.25})`} />
        </linearGradient>
        <clipPath id="dsk-screen-clip"><rect x="17" y="14" width="93" height="58" rx="1.5"/></clipPath>
      </defs>
      <ellipse cx="80" cy="65" rx={hovered ? 72 : 55} ry={hovered ? 50 : 38} fill="url(#dsk-glow)" style={{ transition: "all 0.6s ease", filter: "blur(8px)" }} />
      <rect x="6" y="8" width="115" height="76" rx="6" fill="rgba(18,16,36,0.95)" stroke={`rgba(139,92,246,${hovered ? 0.4 : 0.18})`} strokeWidth={hovered ? 0.8 : 0.5} style={{ transition: "all 0.5s ease" }} />
      <rect x="13" y="12" width="101" height="64" rx="3" fill="rgba(6,7,14,1)" />
      <rect x="17" y="14" width="93" height="58" rx="1.5" fill="rgba(10,12,24,1)" />
      <g clipPath="url(#dsk-screen-clip)">
        {[0,1,2,3,4,5].map(i => (<line key={i} x1="17" y1={14 + i * 10} x2="110" y2={14 + i * 10} stroke={`rgba(139,92,246,${hovered ? 0.08 : 0.05})`} strokeWidth="0.4" />))}
        {[{ x: 22, h: 14 },{ x: 30, h: 10 },{ x: 38, h: 18 },{ x: 46, h: 12 },{ x: 54, h: 20 },{ x: 62, h: 16 },{ x: 70, h: 22 },{ x: 78, h: 8 },{ x: 86, h: 24 },{ x: 94, h: 18 },{ x: 102, h: 26 }].map((c, i) => (
          <rect key={i} x={c.x} y={68 - c.h} width="5" height={c.h} rx="0.5" fill={`rgba(16,185,129,${hovered ? 0.8 : 0.55})`} style={{ transition: `all 0.4s ease ${i * 20}ms` }} />
        ))}
        <motion.path d="M19 62 L27 56 L35 52 L43 55 L51 48 L59 43 L67 38 L75 42 L83 34 L91 30 L99 26 L107 22" fill="none" stroke={`rgba(251,191,36,${hovered ? 0.8 : 0.5})`} strokeWidth={hovered ? 1.2 : 0.9} strokeLinecap="round" />
        {hovered && <line x1="17" y1={scanY} x2="110" y2={scanY} stroke="rgba(139,92,246,0.5)" strokeWidth="0.8" />}
      </g>
      <circle cx="63.5" cy="10.5" r={hovered ? 1.8 : 1.4} fill={`rgba(139,92,246,${hovered ? 0.9 : 0.55})`} style={{ transition: "all 0.4s ease" }}>
        {hovered && <animate attributeName="r" values="1.8;2.5;1.8" dur="1.5s" repeatCount="indefinite"/>}
      </circle>
      <path d="M55 84 L62 92 L75 92 L82 84" fill="rgba(18,16,36,0.95)" stroke={`rgba(139,92,246,${hovered ? 0.25 : 0.07})`} strokeWidth="0.5" />
      <rect x="46" y="92" width="35" height="5" rx="2.5" fill="rgba(18,16,36,0.9)" stroke={`rgba(139,92,246,${hovered ? 0.22 : 0.06})`} strokeWidth="0.5" />
      {hovered && <circle cx="63" cy="45" r="30" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="0.8"><animate attributeName="r" values="28;50;28" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/></circle>}
      <text x="63" y="117" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="1.5" fill={`rgba(255,255,255,${hovered ? 0.85 : 0.55})`} style={{ transition: "all 0.4s ease" }}>THIS DEVICE</text>
      {hovered && <text x="63" y="128" textAnchor="middle" fontSize="7" fontFamily="monospace" letterSpacing="0.8" fill="rgba(139,92,246,0.7)">Camera active</text>}
    </svg>
  )
}

function PhoneSVG({ hovered, breath, tick }: { hovered: boolean; breath: number; tick: number }) {
  const pulse = 0.5 + breath * 0.5
  const scanY = ((tick * 0.6) % 68) + 16
  return (
    <svg viewBox="0 0 90 150" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="phn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`rgba(59,130,246,${0.2 + pulse * 0.14})`} />
          <stop offset="60%" stopColor={`rgba(59,130,246,${0.05 + pulse * 0.04})`} />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
        <clipPath id="phn-screen-clip"><rect x="12" y="16" width="66" height="110" rx="5"/></clipPath>
      </defs>
      <ellipse cx="45" cy="75" rx={hovered ? 44 : 32} ry={hovered ? 68 : 52} fill="url(#phn-glow)" style={{ transition: "all 0.6s ease", filter: "blur(10px)" }} />
      <rect x="8" y="4" width="74" height="142" rx="12" fill="rgba(18,16,36,0.95)" stroke={`rgba(59,130,246,${hovered ? 0.35 : 0.16})`} strokeWidth={hovered ? 0.8 : 0.5} style={{ transition: "all 0.5s ease" }} />
      <rect x="6" y="38" width="2.5" height="14" rx="1.25" fill={`rgba(59,130,246,${hovered ? 0.4 : 0.18})`} />
      <rect x="6" y="58" width="2.5" height="20" rx="1.25" fill={`rgba(59,130,246,${hovered ? 0.35 : 0.16})`} />
      <rect x="81.5" y="50" width="2.5" height="26" rx="1.25" fill={`rgba(59,130,246,${hovered ? 0.35 : 0.16})`} />
      <rect x="12" y="16" width="66" height="110" rx="5" fill="rgba(5,6,12,1)" />
      <rect x="13" y="17" width="64" height="108" rx="4.5" fill="rgba(10,12,24,1)" />
      <rect x="31" y="18.5" width="28" height="7" rx="3.5" fill="rgba(6,6,14,1)" />
      <circle cx="52" cy="22" r="2" fill={`rgba(59,130,246,${hovered ? 0.7 : 0.45})`}>
        {hovered && <animate attributeName="r" values="2;2.8;2" dur="1.5s" repeatCount="indefinite"/>}
      </circle>
      {hovered && [0,1,2,3].map(i => (<circle key={i} cx={35 + i * 3} cy="22" r="0.8" fill={`rgba(59,130,246,${0.4 + i * 0.1})`}><animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.4s" begin={`${i * 0.2}s`} repeatCount="indefinite"/></circle>))}
      <g clipPath="url(#phn-screen-clip)">
        <text x="17" y="32" fontSize="5" fontFamily="monospace" fill={`rgba(255,255,255,${hovered ? 0.55 : 0.35})`}>9:41</text>
        <rect x="67" y="28" width="8" height="4.5" rx="1" fill="none" stroke={`rgba(255,255,255,${hovered ? 0.4 : 0.15})`} strokeWidth="0.6"/>
        <rect x="67.5" y="28.5" width={hovered ? 6.5 : 4} height="3.5" rx="0.5" fill={`rgba(16,185,129,${hovered ? 0.8 : 0.4})`} style={{ transition: "width 0.5s ease" }} />
        <rect x="14" y="46" width="62" height="22" rx="4" fill={`rgba(16,185,129,${hovered ? 0.08 : 0.04})`} stroke={`rgba(16,185,129,${hovered ? 0.25 : 0.12})`} strokeWidth="0.6" />
        <text x="18" y="54" fontSize="4.5" fontFamily="monospace" fill={`rgba(255,255,255,${hovered ? 0.5 : 0.35})`}>TODAY P&L</text>
        <text x="18" y="63" fontSize="8" fontFamily="monospace" fontWeight="bold" fill={`rgba(16,185,129,${hovered ? 0.9 : 0.6})`}>+2.4R</text>
        <polyline points="14,84 22,80 30,82 38,74 46,76 54,68 62,70 70,64 76,60" fill="none" stroke={`rgba(59,130,246,${hovered ? 0.8 : 0.5})`} strokeWidth={hovered ? 1.2 : 0.9} strokeLinecap="round" />
        {[{ y: 94, label: "EURUSD", c: "251,191,36" },{ y: 106, label: "SESSION", c: "139,92,246" },{ y: 118, label: "SIGNAL", c: "16,185,129" }].map((card, i) => (
          <g key={i}>
            <rect x="14" y={card.y} width="62" height="9" rx="2.5" fill={`rgba(${card.c},${hovered ? 0.08 : 0.035})`} stroke={`rgba(${card.c},${hovered ? 0.2 : 0.1})`} strokeWidth="0.5" />
            <circle cx="19" cy={card.y + 4.5} r="1.8" fill={`rgba(${card.c},${hovered ? 0.7 : 0.4})`} />
            <text x="24" y={card.y + 6} fontSize="4" fontFamily="monospace" fontWeight="bold" fill={`rgba(${card.c},${hovered ? 0.8 : 0.45})`}>{card.label}</text>
          </g>
        ))}
        {hovered && <line x1="13" y1={scanY} x2="77" y2={scanY} stroke="rgba(59,130,246,0.45)" strokeWidth="0.7" />}
      </g>
      <rect x="33" y="132" width="24" height="3.5" rx="1.75" fill={`rgba(255,255,255,${hovered ? 0.4 : 0.2})`} />
      {hovered && <circle cx="45" cy="75" r="38" fill="none" stroke="rgba(59,130,246,0.18)" strokeWidth="0.8"><animate attributeName="r" values="35;58;35" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite"/></circle>}
      <text x="45" y="146" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="1.5" fill={`rgba(255,255,255,${hovered ? 0.85 : 0.55})`} style={{ transition: "all 0.4s ease" }}>USE PHONE</text>
      {hovered && <text x="45" y="157" textAnchor="middle" fontSize="7" fontFamily="monospace" letterSpacing="0.8" fill="rgba(59,130,246,0.7)">Scan via mobile</text>}
    </svg>
  )
}

function DevicePanel({ type, hovered, onHover, onSelect, breath, tick }: { type: "desktop" | "phone"; hovered: boolean; onHover: (h: boolean) => void; onSelect: () => void; breath: number; tick: number }) {
  const isDesktop = type === "desktop"
  const accent = isDesktop ? "139,92,246" : "59,130,246"
  return (
    <motion.button onClick={onSelect} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)} className="relative flex items-center justify-center cursor-pointer select-none overflow-visible" style={{ width: 140, height: 180 }} animate={{ opacity: hovered ? 0.95 : 0.7, scale: hovered ? 1.06 : 0.98 }} transition={{ duration: 0.45, ease: "easeOut" }} whileTap={{ scale: 0.93 }}>
      <motion.div className="absolute -inset-4 rounded-3xl pointer-events-none" animate={{ background: hovered ? `radial-gradient(ellipse 100% 90% at 50% 50%, rgba(${accent},0.12) 0%, rgba(${accent},0.03) 60%, transparent 85%)` : `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(${accent},0.02) 0%, transparent 65%)`, filter: hovered ? "blur(12px)" : "blur(4px)" }} transition={{ duration: 0.5 }} />
      <div className={cn("relative z-10 transition-all duration-500", isDesktop ? "w-[130px] h-[130px]" : "w-[90px] h-[140px]")}>
        {isDesktop ? <DesktopSVG hovered={hovered} breath={breath} tick={tick} /> : <PhoneSVG hovered={hovered} breath={breath} tick={tick} />}
      </div>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────
   ULTRA DETAILED BIOMETRIC CORE SVG
   The centerpiece - massively enhanced face scanner
──�����������������────────────────────────────────────────────────────── */
function BiometricCoreSVG({ state, breath, tick, hovered = false }: { state: PortalState; breath: number; tick: number; hovered?: boolean }) {
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [beamY, setBeamY] = useState(160)
  const beamRef = useRef(0)
  const [activeRegion, setActiveRegion] = useState(-1)
  const [traceLine, setTraceLine] = useState(-1)
  
  const isIdle = state === "idle", isScanning = state === "scanning", isProcessing = state === "processing", isVerified = state === "verified", isDenied = state === "denied"
  const rgb = isVerified ? ACCENT.emerald.rgb : isDenied ? ACCENT.rose.rgb : isScanning || isProcessing ? ACCENT.blue.rgb : ACCENT.purple.rgb
  const regions = useMemo(() => [{ idx: Array.from({length:17},(_,i)=>i) }, { idx: [17,18,19,20,21] }, { idx: [22,23,24,25,26] }, { idx: [27,28,29,30,31,32,33,34,35] }, { idx: [36,37,38,39,40,41] }, { idx: [42,43,44,45,46,47] }, { idx: Array.from({length:20},(_,i)=>i+48) }], [])

  useEffect(() => { if (!isIdle) { setActiveRegion(-1); setTraceLine(-1); return }; let r = 0; const iv = setInterval(() => { setActiveRegion(r % regions.length); setTraceLine(Math.floor(Math.random() * MESH.length)); r++ }, 900); return () => clearInterval(iv) }, [isIdle, regions.length])
  useEffect(() => { let raf: number; const t = () => { beamRef.current += isScanning ? 1.2 : 0.3; const c = (beamRef.current % 200) / 200; setBeamY(isScanning ? 140 + c * 380 : 200 + Math.sin(beamRef.current * 0.015) * 30); raf = requestAnimationFrame(t) }; t(); return () => cancelAnimationFrame(raf) }, [isScanning])
  useEffect(() => { if (isVerified || isProcessing) { setRevealed(new Set(FACE.map((_,i)=>i))); setProgress(100); return }; if (!isScanning) { setRevealed(new Set(FACE.map((_,i)=>i))); setProgress(0); return }; setRevealed(new Set()); setProgress(0); const sorted = [...FACE.keys()].sort((a,b) => FACE[a][1] - FACE[b][1]); let idx2 = 0; const iv = setInterval(() => { if (idx2 >= sorted.length) { clearInterval(iv); return }; const batch = Math.min(2, sorted.length - idx2); setRevealed(prev => { const next = new Set(prev); for (let i = 0; i < batch; i++) next.add(sorted[idx2 + i]); return next }); idx2 += batch; setProgress(Math.min(100, Math.round((idx2 / sorted.length) * 100))) }, 55); return () => clearInterval(iv) }, [isScanning, isVerified, isProcessing])

  const inAR = useCallback((i: number) => activeRegion >= 0 && activeRegion < regions.length && regions[activeRegion].idx.includes(i), [activeRegion, regions])
  const ds = (i: number) => i >= 36 && i <= 47 ? 5 : i >= 17 && i <= 26 ? 4.5 : i >= 27 && i <= 35 ? 4 : i >= 48 && i <= 67 ? 3.8 : 3.2
  const dg = (i: number) => i >= 36 && i <= 47 ? 14 : i >= 17 && i <= 26 ? 12 : 8
  const bOp = isIdle ? 0.35 : isVerified ? 0.95 : isProcessing ? 0.7 : 0.8
  const lOp = isIdle ? 0.12 : isVerified ? 0.4 : isProcessing ? 0.28 : 0.22
  const orbitPhase = (tick * 0.02) % (Math.PI * 2)

  const hovScale = hovered ? 1.08 : 0.98
  const hovOpacity = hovered ? 1 : 0.75
  const hovGlowMult = hovered ? 2 : 0.8

  return (
    <motion.div className="relative flex items-center justify-center cursor-pointer" animate={{ scale: hovScale, opacity: hovOpacity }} transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {/* Multiple layered ambient glows - much stronger on hover */}
      <motion.div className="absolute pointer-events-none" animate={{ width: hovered ? 480 + breath * 30 : 360 + breath * 10, height: hovered ? 520 + breath * 30 : 400 + breath * 10, opacity: hovered ? 1 : 0.4 }} transition={{ duration: 0.6 }} style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(${rgb},${(0.06 + breath * 0.02) * hovGlowMult}) 0%, rgba(${rgb},${0.02 * hovGlowMult}) 40%, transparent 70%)`, borderRadius: "50%" }} />
      <motion.div className="absolute pointer-events-none" animate={{ width: hovered ? 380 + breath * 20 : 280 + breath * 8, height: hovered ? 420 + breath * 20 : 320 + breath * 8, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.6 }} style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(${rgb},${(0.04 + breath * 0.015) * hovGlowMult}) 0%, transparent 60%)`, borderRadius: "50%" }} />
      {/* Extra outer bloom on hover */}
      <motion.div className="absolute pointer-events-none" animate={{ width: hovered ? 600 : 300, height: hovered ? 640 : 340, opacity: hovered ? 0.5 : 0 }} transition={{ duration: 0.7 }} style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", background: `radial-gradient(ellipse 45% 45% at 50% 50%, rgba(${rgb},0.04) 0%, transparent 65%)`, borderRadius: "50%", filter: "blur(20px)" }} />
      
      {/* Scanner area - no background, pure transparent */}
      <motion.div className="relative overflow-visible" style={{ width: 340, height: 342 }}>
        
        {/* Corner brackets - SVG L-shaped with glowing dots, squeeze/expand on hover */}
        {(() => {
          const spring = { type: "spring" as const, stiffness: 200, damping: 24, mass: 0.7 }
          const lineOp = hovered ? 0.7 + breath * 0.12 : 0.35 + breath * 0.08
          const dotOp = hovered ? 0.85 : 0.5
          const dotR = hovered ? 2.5 : 1.8
          const glowR = hovered ? 6 : 3
          // Squeezed = closer to center, Expanded = at edges
          const eV = 6, eH = 6, sV = 55, sH = 65
          // Each corner: positioned absolutely, contains an SVG with L-path + dots
          const corners = [
            { vKey: "top", hKey: "left", path: "M2,28 L2,2 L28,2", dots: [[2,28],[2,2],[28,2]] },
            { vKey: "top", hKey: "right", path: "M2,2 L28,2 L28,28", dots: [[2,2],[28,2],[28,28]] },
            { vKey: "bottom", hKey: "left", path: "M2,2 L2,28 L28,28", dots: [[2,2],[2,28],[28,28]] },
            { vKey: "bottom", hKey: "right", path: "M28,2 L28,28 L2,28", dots: [[28,2],[28,28],[2,28]] },
          ]
          return corners.map((c, i) => (
            <motion.div key={i} className="absolute pointer-events-none" style={{ width: 30, height: 30 }} animate={{ [c.vKey]: hovered ? eV : sV, [c.hKey]: hovered ? eH : sH }} transition={spring}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" style={{ overflow: "visible" }}>
                <defs>
                  <filter id={`cornerGlow${i}`} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation={glowR} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path d={c.path} stroke={`rgba(${rgb},${lineOp})`} strokeWidth="1.5" strokeLinecap="round" fill="none" filter={`url(#cornerGlow${i})`} />
                {c.dots.map(([dx,dy], di) => (
                  <circle key={di} cx={dx} cy={dy} r={dotR} fill={`rgba(${rgb},${dotOp})`} filter={`url(#cornerGlow${i})`} style={{ transition: "r 0.4s ease, fill 0.4s ease" }} />
                ))}
              </svg>
            </motion.div>
          ))
        })()}

        {/* Orbiting particles around the scanner - more vivid on hover */}
        {isIdle && [0, 1, 2, 3, 4, 5].map(i => {
          const angle = orbitPhase + (i * Math.PI / 3)
          const rx = hovered ? 190 : 170, ry = hovered ? 210 : 190
          const x = 170 + Math.cos(angle) * rx
          const y = 190 + Math.sin(angle) * ry * 0.5
          const opacity = hovered ? 0.4 + Math.sin(angle) * 0.15 : 0.2 + Math.sin(angle) * 0.08
          const sz = hovered ? 2.5 : 2
          return (
            <div key={i} className="absolute rounded-full" style={{ width: sz, height: sz, left: x, top: y, background: `rgba(${rgb},${opacity})`, boxShadow: hovered ? `0 0 14px rgba(${rgb},${opacity * 0.6})` : `0 0 4px rgba(${rgb},${opacity * 0.3})`, transition: "all 0.5s ease" }} />
          )
        })}

        {/* Main face mesh SVG */}
        <svg viewBox="0 0 500 600" className="w-full h-full" style={{ filter: isVerified ? `drop-shadow(0 0 35px rgba(${ACCENT.emerald.rgb},0.15))` : hovered ? `drop-shadow(0 0 30px rgba(${rgb},0.2)) brightness(1.3)` : `drop-shadow(0 0 15px rgba(${rgb},0.08)) brightness(0.85)`, opacity: hovered ? 1 : 0.7, transition: "opacity 0.6s ease, filter 0.6s ease" }}>
          <defs>
            <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="beamGlow" x="-10%" y="-400%" width="120%" height="900%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <filter id="meshGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`rgba(${rgb},0)`} />
              <stop offset="30%" stopColor={`rgba(${rgb},0.6)`} />
              <stop offset="50%" stopColor={`rgba(${rgb},0.9)`} />
              <stop offset="70%" stopColor={`rgba(${rgb},0.6)`} />
              <stop offset="100%" stopColor={`rgba(${rgb},0)`} />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgba(${rgb},0.08)`} />
              <stop offset="100%" stopColor={`rgba(${rgb},0)`} />
            </radialGradient>
          </defs>

          {/* Background grid pattern */}
          {isIdle && (
            <g opacity="0.08">
              {Array.from({ length: 10 }, (_, i) => (
                <line key={`hg${i}`} x1="50" y1={100 + i * 45} x2="450" y2={100 + i * 45} stroke={`rgb(${rgb})`} strokeWidth="0.5" />
              ))}
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`vg${i}`} x1={95 + i * 45} y1="80" x2={95 + i * 45} y2="530" stroke={`rgb(${rgb})`} strokeWidth="0.5" />
              ))}
            </g>
          )}

          {/* Center ambient glow */}
          <ellipse cx="250" cy="300" rx="120" ry="140" fill="url(#centerGlow)" />

          {/* Mesh lines with enhanced glow */}
          {MESH.map(([a,b],i) => { 
            if (!revealed.has(a)||!revealed.has(b)) return null; 
            const [x1,y1]=FACE[a],[x2,y2]=FACE[b]; 
            const ta=isIdle&&(inAR(a)||inAR(b)); 
            const tr=isIdle&&i===traceLine; 
            const lo=ta?0.35:tr?0.5:lOp; 
            return (
              <g key={`m${i}`}>
                {/* Glow layer */}
                {(ta || tr) && (
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`rgba(${tr?ACCENT.blue.rgb:rgb},${lo * 0.3})`} strokeWidth={tr ? 4 : 3} filter="url(#meshGlow)" />
                )}
                {/* Main line */}
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`rgba(${tr?ACCENT.blue.rgb:rgb},${lo+breath*0.04})`} strokeWidth={tr?2:isVerified?1.5:ta?1.2:0.8} style={{transition:"all 0.5s ease"}} />
              </g>
            ) 
          })}

          {/* Enhanced scan beam */}
          {(isScanning || isIdle) && (
            <g>
              <rect x={60} y={beamY-35} width={380} height={70} fill={`rgba(${isScanning?ACCENT.blue.rgb:ACCENT.purple.rgb},${isScanning?0.03:0.008})`} />
              <line x1={70} y1={beamY} x2={430} y2={beamY} stroke="url(#beamGrad)" strokeWidth={isScanning?3:1} filter={isScanning?"url(#beamGlow)":undefined} />
              {isScanning && (
                <>
                  <line x1={100} y1={beamY} x2={400} y2={beamY} stroke={`rgba(${ACCENT.blue.rgb},0.5)`} strokeWidth={1.5} />
                  <line x1={130} y1={beamY-0.5} x2={370} y2={beamY-0.5} stroke={`rgba(${ACCENT.blue.rgb},0.3)`} strokeWidth={0.8} />
                  <line x1={130} y1={beamY+0.5} x2={370} y2={beamY+0.5} stroke={`rgba(${ACCENT.blue.rgb},0.3)`} strokeWidth={0.8} />
                </>
              )}
            </g>
          )}

          {/* Face points with enhanced effects */}
          {FACE.map(([cx,cy],i) => { 
            const show=revealed.has(i); 
            const inR=isIdle&&inAR(i); 
            const sz=ds(i)+breath*0.5; 
            const gl=dg(i); 
            const dOp=inR?0.75:bOp; 
            const sg=!isIdle||inR; 
            return (
              <g key={`d${i}`} style={{opacity:show?1:0,transition:"all 0.5s ease"}}>
                {/* Outer glow */}
                {show && sg && (
                  <circle cx={cx} cy={cy} r={gl + breath * 3} fill={`rgba(${rgb},${inR ? 0.09 : 0.05 + breath * 0.02})`} style={{transition:"all 0.5s ease"}} />
                )}
                {/* Main dot */}
                <circle cx={cx} cy={cy} r={inR ? sz * 1.4 : sz} fill={`rgba(${rgb},${dOp})`} filter={sg && show ? "url(#dotGlow)" : undefined} style={{transition:"all 0.5s ease"}} />
                {/* Inner highlight */}
                {show && sg && (
                  <circle cx={cx} cy={cy} r={sz * 0.4} fill={`rgba(255,255,255,${isVerified ? 0.6 : inR ? 0.35 : 0.18})`} style={{transition:"all 0.5s ease"}} />
                )}
                {/* Pulse ring for active region */}
                {inR && (
                  <circle cx={cx} cy={cy} r={sz * 2} fill="none" stroke={`rgba(${rgb},0.25)`} strokeWidth="0.8">
                    <animate attributeName="r" values={`${sz*1.5};${sz*3};${sz*1.5}`} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            ) 
          })}

          {/* Verified checkmark */}
          {isVerified && (
            <g style={{animation:"fadeIn 0.6s ease-out forwards"}}>
              <circle cx={250} cy={310} r={58} fill={`rgba(${ACCENT.emerald.rgb},0.08)`} stroke={`rgba(${ACCENT.emerald.rgb},0.4)`} strokeWidth={2.5} />
              <circle cx={250} cy={310} r={68} fill="none" stroke={`rgba(${ACCENT.emerald.rgb},0.15)`} strokeWidth={1}>
                <animate attributeName="r" values="58;78;58" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <polyline points="226,310 242,326 274,290" fill="none" stroke={`rgba(${ACCENT.emerald.rgb},0.95)`} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}

          {/* Denied X */}
          {isDenied && (
            <g>
              <circle cx={250} cy={310} r={54} fill={`rgba(${ACCENT.rose.rgb},0.06)`} stroke={`rgba(${ACCENT.rose.rgb},0.35)`} strokeWidth={2.5} />
              <line x1={230} y1={290} x2={270} y2={330} stroke={`rgba(${ACCENT.rose.rgb},0.9)`} strokeWidth={4} strokeLinecap="round" />
              <line x1={270} y1={290} x2={230} y2={330} stroke={`rgba(${ACCENT.rose.rgb},0.9)`} strokeWidth={4} strokeLinecap="round" />
            </g>
          )}

          {/* Processing spinner */}
          {isProcessing && (
            <g>
              <circle cx={250} cy={310} r={62} fill="none" stroke={`rgba(${ACCENT.blue.rgb},0.08)`} strokeWidth={2.5} />
              <circle cx={250} cy={310} r={62} fill="none" stroke={`rgba(${ACCENT.blue.rgb},0.7)`} strokeWidth={3} strokeDasharray="100 295" strokeLinecap="round" style={{transformOrigin:"250px 310px",animation:"spin 1.2s linear infinite"}} />
              <circle cx={250} cy={310} r={72} fill="none" stroke={`rgba(${ACCENT.blue.rgb},0.2)`} strokeWidth={1.5} strokeDasharray="50 180" strokeLinecap="round" style={{transformOrigin:"250px 310px",animation:"spin 2s linear infinite reverse"}} />
            </g>
          )}

          {/* Decorative circuit traces on sides */}
          {isIdle && (
            <g opacity="0.18">
              <path d="M40 150 L40 250 L60 270 L60 350 L40 370 L40 450" fill="none" stroke={`rgb(${rgb})`} strokeWidth="1" strokeDasharray="4 4" />
              <path d="M460 150 L460 250 L440 270 L440 350 L460 370 L460 450" fill="none" stroke={`rgb(${rgb})`} strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="40" cy="150" r="3" fill={`rgb(${rgb})`} />
              <circle cx="40" cy="450" r="3" fill={`rgb(${rgb})`} />
              <circle cx="460" cy="150" r="3" fill={`rgb(${rgb})`} />
              <circle cx="460" cy="450" r="3" fill={`rgb(${rgb})`} />
            </g>
          )}
        </svg>

        {/* Progress bar when scanning */}
        {isScanning && (
          <div className="absolute bottom-5 left-8 right-8">
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:`rgba(${ACCENT.blue.rgb},0.08)`}}>
              <div className="h-full rounded-full transition-all duration-200 ease-out" style={{width:`${progress}%`,background:`linear-gradient(90deg, rgba(${ACCENT.blue.rgb},0.5), rgba(${ACCENT.blue.rgb},0.9))`,boxShadow:`0 0 20px rgba(${ACCENT.blue.rgb},0.5)`}} />
            </div>
            <div className="flex justify-between mt-2.5 px-0.5">
              <span className="text-[10px] font-mono tracking-[0.14em] uppercase font-semibold" style={{color:`rgba(${ACCENT.blue.rgb},0.7)`}}>Mapping biometrics</span>
              <span className="text-[12px] font-mono tabular-nums font-bold" style={{color:`rgba(${ACCENT.blue.rgb},0.85)`}}>{progress}%</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Status label below scanner */}
      <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-3 h-10">
        {isIdle && (
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0.8 }} transition={{ duration: 0.5 }}>
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(${rgb},${hovered ? 0.7 : 0.5})` }} animate={hovered ? { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] } : { scale: [1, 1.2, 1], opacity: [0.4, 0.65, 0.4] }} transition={{ duration: 1.8, delay: i * 0.15, repeat: Infinity }} />
              ))}
            </div>
            <motion.span className="text-sm font-mono tracking-[0.18em] uppercase font-semibold" animate={{ color: hovered ? "rgba(148,163,184,0.95)" : "rgba(148,163,184,0.65)", textShadow: hovered ? `0 0 16px rgba(${rgb},0.25)` : `0 0 8px rgba(${rgb},0.08)` }} transition={{ duration: 0.4 }}>Ready to Scan</motion.span>
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(${rgb},${hovered ? 0.7 : 0.5})` }} animate={hovered ? { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] } : { scale: [1, 1.2, 1], opacity: [0.4, 0.65, 0.4] }} transition={{ duration: 1.8, delay: i * 0.15 + 0.3, repeat: Infinity }} />
              ))}
            </div>
          </motion.div>
        )}
        {isScanning && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{background:`rgba(${ACCENT.blue.rgb},0.85)`,boxShadow:`0 0 16px rgba(${ACCENT.blue.rgb},0.6)`}} />
            <span className="text-sm font-mono tracking-[0.18em] uppercase font-bold" style={{color:`rgba(${ACCENT.blue.rgb},0.9)`}}>Scanning Identity</span>
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center gap-3">
            <LoaderIcon size={16} />
            <span className="text-sm font-mono tracking-[0.18em] uppercase font-bold" style={{color:`rgba(${ACCENT.blue.rgb},0.9)`}}>Verifying Identity</span>
          </div>
        )}
        {isVerified && <span className="text-base font-mono tracking-[0.2em] uppercase font-bold" style={{color:`rgba(${ACCENT.emerald.rgb},0.95)`}}>Identity Verified</span>}
        {isDenied && <span className="text-sm font-mono tracking-[0.18em] uppercase font-bold" style={{color:`rgba(${ACCENT.rose.rgb},0.85)`}}>Verification Failed</span>}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   BOTTOM ACTION BLOCK - Credentials + Security badges
───────────────────────────────────────────────────────── */
function BottomActionBlock({ onCredentials, onSwitchToCredentials, accent }: { onCredentials: () => void; onSwitchToCredentials?: () => void; accent: string }) {
  const [hovCred, setHovCred] = useState(false)
  const [hovRecov, setHovRecov] = useState(false)
  const [hovHelp, setHovHelp] = useState(false)

  return (
    <motion.div className="relative flex flex-col items-center gap-5 w-full max-w-[420px]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
      {/* Divider */}
      <div className="w-full flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${accent},0.2), transparent)` }}/>
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: `rgba(${accent},0.5)` }}>OR</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${accent},0.2), transparent)` }}/>
      </div>

      {/* Use Credentials Instead button */}
      <motion.button onClick={onSwitchToCredentials || onCredentials} onMouseEnter={() => setHovCred(true)} onMouseLeave={() => setHovCred(false)} className="relative flex items-center justify-center gap-3 h-12 w-full cursor-pointer overflow-visible" style={{ borderRadius: 14, border: `1px solid rgba(${accent},0.1)` }} animate={{ background: hovCred ? `rgba(${accent},0.08)` : `rgba(${accent},0.035)` }} transition={{ duration: 0.3 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}>
        <motion.div className="absolute -inset-3 rounded-2xl pointer-events-none" style={{ background: `radial-gradient(ellipse 100% 130% at 50% 50%, rgba(${accent},${hovCred ? 0.07 : 0.025}) 0%, transparent 70%)`, filter: `blur(${hovCred ? 12 : 6}px)` }} />
        <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent},${hovCred ? 0.85 : 0.55})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.3s" }}>
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </motion.svg>
        <motion.span className="text-[13px] font-mono tracking-[0.12em] uppercase font-semibold" animate={{ color: hovCred ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)" }} transition={{ duration: 0.3 }}>Use credentials instead</motion.span>
      </motion.button>

      {/* Recovery + Help */}
      <div className="flex items-center gap-8">
        <motion.a href="/forgot-password" onMouseEnter={() => setHovRecov(true)} onMouseLeave={() => setHovRecov(false)} className="relative flex items-center gap-2.5 cursor-pointer" whileHover={{ y: -1 }}>
          <AnimatePresence>{hovRecov && <motion.div className="absolute inset-0 -mx-3 -my-1.5 rounded-lg pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: `radial-gradient(ellipse 120% 200% at 50% 50%, rgba(${accent},0.08) 0%, transparent 80%)` }} />}</AnimatePresence>
          <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hovRecov ? `rgba(${accent},0.8)` : "rgba(148,163,184,0.5)"} strokeWidth="1.5" animate={{ rotate: hovRecov ? 360 : 0 }} transition={{ duration: 0.6 }}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </motion.svg>
          <motion.span className="text-[12px] font-mono tracking-[0.16em] uppercase" animate={{ color: hovRecov ? `rgba(${accent},0.8)` : "rgba(148,163,184,0.55)" }}>Recovery</motion.span>
        </motion.a>
        <div className="w-px h-4" style={{ background: `rgba(${accent},0.1)` }} />
        <motion.a href="#" onMouseEnter={() => setHovHelp(true)} onMouseLeave={() => setHovHelp(false)} className="relative flex items-center gap-2.5 cursor-pointer" whileHover={{ y: -1 }}>
          <AnimatePresence>{hovHelp && <motion.div className="absolute inset-0 -mx-3 -my-1.5 rounded-lg pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: `radial-gradient(ellipse 120% 200% at 50% 50%, rgba(${accent},0.07) 0%, transparent 80%)` }} />}</AnimatePresence>
          <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hovHelp ? `rgba(${accent},0.8)` : "rgba(148,163,184,0.5)"} strokeWidth="1.5" animate={{ scale: hovHelp ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.4 }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
          </motion.svg>
          <motion.span className="text-[12px] font-mono tracking-[0.16em] uppercase" animate={{ color: hovHelp ? `rgba(${accent},0.8)` : "rgba(148,163,184,0.55)" }}>Help</motion.span>
        </motion.a>
      </div>
    </motion.div>
  )
}



/* ──────────────────────────────────────��───────���──────────
   MAIN EXPORT
───────────────────────────────────────────────────────── */
export function AccessPortal({ onAuthenticated, onNavigateRegister, error, onSwitchToCredentials }: AccessPortalProps) {
  const [state, setState] = useState<PortalState>("idle")
  const [mounted, setMounted] = useState(false)
  const [breathPhase, setBreathPhase] = useState(0)
  const [showFallback, setShowFallback] = useState(false)
  const [hoveredDevice, setHoveredDevice] = useState<DeviceMode>(null)
  const [hoveredCore, setHoveredCore] = useState(false)
  const [tick, setTick] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { const iv = setInterval(() => setBreathPhase(p => (p + 1) % 360), 32); return () => clearInterval(iv) }, [])
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 16); return () => clearInterval(iv) }, [])

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setMousePos({ x, y })
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  const breath = Math.sin((breathPhase * Math.PI) / 180)
  const accent = useMemo(() => {
    if (state === "verified") return { r:16,g:185,b:129 }
    if (state === "denied") return { r:244,g:63,b:94 }
    if (state === "scanning" || state === "processing") return { r:59,g:130,b:246 }
    return { r:139,g:92,b:246 }
  }, [state])
  const accentStr = `${accent.r},${accent.g},${accent.b}`

  const handleScan = useCallback(() => {
    setState("scanning")
    setTimeout(() => setState("processing"), 3400)
    setTimeout(() => { setState("verified"); setTimeout(() => onAuthenticated?.(), 1800) }, 5200)
  }, [onAuthenticated])

  const isActive = state === "scanning" || state === "processing"
  const isVerified = state === "verified"
  const isIdle = state === "idle"

  return (
    <div ref={containerRef} className={cn("relative w-full min-h-screen overflow-hidden transition-opacity duration-1000", mounted ? "opacity-100" : "opacity-0")} style={{ background: `radial-gradient(ellipse 55% 45% at 50% 35%, rgba(${accentStr},0.07) 0%, transparent 60%), radial-gradient(ellipse 35% 28% at 25% 70%, rgba(${ACCENT.blue.rgb},0.03) 0%, transparent 50%), linear-gradient(180deg, rgba(8,10,18,1) 0%, rgba(12,14,24,1) 40%, rgba(8,10,18,1) 100%)` }}>
      <BreathingEcosystem accent={accent} breath={breath} />

      {isVerified && (
        <div className="fixed inset-0 z-50 pointer-events-none" style={{ animation: "bloom 1.5s ease-out forwards" }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(${ACCENT.emerald.rgb},0.12) 0%, transparent 70%)` }} />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8">
        {/* Logo only - no "IDENTITY PORTAL" text */}
        <motion.div className="mb-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)` }}>
          <ArchioLogoMark size={40} className={cn("transition-all duration-1000", isVerified ? "text-emerald-400" : "text-purple-400/70")} />
        </motion.div>

        {/* Title - tighter to logo, no subtitle gap */}
        <motion.div className="flex flex-col items-center mb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} style={{ transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px)` }}>
          <motion.h1 className="text-4xl sm:text-5xl font-light tracking-[-0.03em] text-center mb-2" style={{ textShadow: `0 0 100px rgba(${accentStr},0.18)`, color: isVerified ? `rgba(${ACCENT.emerald.rgb},0.95)` : isActive ? `rgba(${ACCENT.blue.rgb},0.9)` : undefined, ...(!isVerified && !isActive ? { background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(${accentStr},0.85) 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : {}) }}>
            {isVerified ? "Welcome Back" : isActive ? "Scanning Identity" : "Enter Archio"}
          </motion.h1>
          <p className="text-sm text-slate-400 text-center leading-relaxed max-w-md text-pretty font-light">
            {isVerified ? "Your identity has been verified. Entering the platform." : isActive ? "Hold still. Mapping your biometric landmarks." : "Your face is your access key. Scan to verify your identity."}
          </p>
          {!isVerified && !isActive && (
            <p className="text-[11px] text-slate-600 text-center mt-1.5 font-mono tracking-[0.1em]">No passwords. No codes. One identity.</p>
          )}
        </motion.div>

        {/* Main composition: side panels + face core with parallax — equal-width side slots for centering */}
        {isIdle && !showFallback ? (
          <div className="relative w-full flex items-center justify-center mb-8">
            {/* Left device panel — fixed-width slot */}
            <motion.div className="flex items-center justify-center transition-transform duration-300 ease-out" style={{ width: 160, transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 5}px)` }}>
              <DevicePanel type="desktop" hovered={hoveredDevice === "desktop"} onHover={(h) => setHoveredDevice(h ? "desktop" : null)} onSelect={handleScan} breath={breath} tick={tick} />
            </motion.div>
            {/* Center face core — stable anchor, hover-reactive */}
            <motion.div className="relative z-10 flex-shrink-0 transition-transform duration-500 ease-out" style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 1.5}px)` }} onMouseEnter={() => setHoveredCore(true)} onMouseLeave={() => setHoveredCore(false)}>
              <BiometricCoreSVG state={state} breath={breath} tick={tick} hovered={hoveredCore} />
            </motion.div>
            {/* Right phone panel — same fixed-width slot as left */}
            <motion.div className="flex items-center justify-center transition-transform duration-300 ease-out" style={{ width: 160, transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 5}px)` }}>
              <DevicePanel type="phone" hovered={hoveredDevice === "phone"} onHover={(h) => setHoveredDevice(h ? "phone" : null)} onSelect={handleScan} breath={breath} tick={tick} />
            </motion.div>
          </div>
        ) : (
          <div className="relative mb-8" onMouseEnter={() => setHoveredCore(true)} onMouseLeave={() => setHoveredCore(false)}>
            <BiometricCoreSVG state={state} breath={breath} tick={tick} hovered={hoveredCore || isActive} />
          </div>
        )}

        {/* Bottom action block */}
        {isIdle && !showFallback && (
          <BottomActionBlock onCredentials={() => setShowFallback(true)} onSwitchToCredentials={onSwitchToCredentials} accent={accentStr} />
        )}

        {/* Fallback credentials form */}
        {showFallback && isIdle && (
          <motion.div className="w-full max-w-[440px]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <button onClick={() => setShowFallback(false)} className="text-[12px] font-mono tracking-[0.12em] text-slate-600 hover:text-slate-400 transition-colors mb-6 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M10 17l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back to face scan
            </button>
            <FallbackEmailLogin onAuthenticated={onAuthenticated} />
          </motion.div>
        )}

        {isActive && (
          <button onClick={() => setState("idle")} className="mt-6 text-[13px] font-mono tracking-[0.14em] text-slate-600 hover:text-slate-400 transition-colors uppercase font-medium">Cancel</button>
        )}
        {state === "denied" && (
          <button onClick={() => setState("idle")} className="mt-6 w-full max-w-[440px] h-[58px] flex items-center justify-center gap-3 text-[14px] font-mono tracking-[0.16em] uppercase font-semibold transition-all duration-300" style={{ borderRadius: 20, background: `rgba(${ACCENT.rose.rgb},0.05)`, color: `rgba(${ACCENT.rose.rgb},0.85)` }}>Try again</button>
        )}
        {error && (
          <div className="mt-4 w-full max-w-[440px] px-6 py-4 text-[13px] font-mono tracking-wide" style={{ borderRadius: 18, background: `rgba(${ACCENT.rose.rgb},0.05)`, color: `rgba(${ACCENT.rose.rgb},0.85)` }}>{error}</div>
        )}
      </div>

      <style jsx>{`
        @keyframes bloom { 0%{opacity:0;transform:scale(0.85)} 50%{opacity:1} 100%{opacity:0.6;transform:scale(1)} }
        @keyframes fadeIn { 0%{opacity:0;transform:scale(0.7)} 100%{opacity:1;transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

function FallbackEmailLogin({ onAuthenticated }: { onAuthenticated?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [err, setErr] = useState("")
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setErr("Email and password are required"); return }
    setIsSubmitting(true); setErr("")
    await new Promise(r => setTimeout(r, 1200))
    setIsSubmitting(false)
    onAuthenticated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="relative">
        <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-[56px] px-5 text-[14px] font-mono tracking-wide text-white placeholder:text-slate-600 transition-all duration-300 outline-none" style={{ borderRadius: 16, background: "rgba(15,17,28,0.9)", border: "1px solid rgba(139,92,246,0.08)" }} />
      </div>
      <div className="relative">
        <input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-[56px] px-5 pr-14 text-[14px] font-mono tracking-wide text-white placeholder:text-slate-600 transition-all duration-300 outline-none" style={{ borderRadius: 16, background: "rgba(15,17,28,0.9)", border: "1px solid rgba(139,92,246,0.08)" }} />
        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors p-1">
          {showPw ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
        </button>
      </div>
      {err && <p className="text-xs text-rose-400 font-mono tracking-wide">{err}</p>}
      <button type="submit" disabled={isSubmitting} className="relative w-full h-[56px] flex items-center justify-center gap-3 text-[14px] font-mono tracking-[0.16em] uppercase font-semibold text-white transition-all duration-300 disabled:opacity-60" style={{ borderRadius: 16, background: "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.2) 100%)" }}>
        {isSubmitting ? <LoaderIcon size={18} /> : "Sign In"}
      </button>
    </form>
  )
}
