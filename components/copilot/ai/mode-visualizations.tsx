"use client"
import { useState } from "react"
import { motion } from "framer-motion"

/* =================================================================
   INTELLIGENCE MODE VISUALIZATIONS
   Each mode gets a unique, highly detailed SVG that explains
   the actual functionality and analytical process of that mode.
   
   These are NOT decorative -- they are instructional diagrams
   showing the real mechanics of how each AI mode processes,
   analyzes, and delivers results to the trader.
   =================================================================*/

/* Helper: color with alpha */
const ca = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* =================================================================
   1. MARKET THINKING -- #3b82f6
   The analyst that reads market structure, identifies directional
   bias, maps key levels, tracks smart money flow, and synthesizes
   a complete market picture for your trading session.
   
   SVG Journey:
   YOUR PAIR → Price Action Scan → Structure Analysis Engine →
   Multi-Timeframe Alignment → Key Level Mapping → Smart Money
   Flow Detection → Directional Bias Output → Session Synthesis
   ================================================================= */
export function MarketThinkingSVG() {
  const c = "#3b82f6"
  
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: `linear-gradient(180deg, ${ca(c, 0.03)}, transparent)` }}>
      <svg viewBox="0 0 480 680" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* ═══════════════════════════════════════════════════════════════
            LAYER 0: BACKGROUND GRID + AMBIENT
            ═══════════════════════════════════════════════════════════════ */}
        <defs>
          <pattern id="mt-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={ca(c, 0.025)} strokeWidth="0.3" />
          </pattern>
          <linearGradient id="mt-fade-down" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ca(c, 0.06)} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="mt-flow-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="50%" stopColor={ca(c, 0.4)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
          <filter id="mt-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="mt-glow-lg">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="480" height="680" fill="url(#mt-grid)" />
        <rect width="480" height="80" fill="url(#mt-fade-down)" />

        {/* ═══════════════════════════════════════════════════════════════
            SECTION TITLE: "HOW MARKET THINKING WORKS"
            ═══════════════════════════════════════════════════════════════ */}
        <text x="240" y="22" textAnchor="middle" fill={ca(c, 0.5)} fontSize="7" fontFamily="monospace" fontWeight="900" letterSpacing="3">HOW MARKET THINKING WORKS</text>
        <line x1="120" y1="28" x2="360" y2="28" stroke={ca(c, 0.08)} strokeWidth="0.5" />
        <text x="240" y="38" textAnchor="middle" fill={ca(c, 0.25)} fontSize="5" fontFamily="monospace" letterSpacing="1">COMPLETE ANALYTICAL PIPELINE</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 1: YOUR TRADING PAIR -- The Input
            What the user brings to the table
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          {/* Stage label */}
          <rect x="16" y="50" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="60" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 1</text>
          <text x="68" y="60" fill={ca(c, 0.35)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Your Trading Context</text>

          {/* Main input card */}
          <rect x="24" y="70" width="432" height="70" rx="8" fill={ca(c, 0.025)} stroke={ca(c, 0.12)} strokeWidth="0.8" />
          
          {/* Pair selector */}
          <rect x="36" y="80" width="70" height="50" rx="6" fill={ca(c, 0.04)} stroke={ca(c, 0.15)} strokeWidth="0.7">
            <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
          </rect>
          <text x="71" y="96" textAnchor="middle" fill={ca(c, 0.8)} fontSize="11" fontFamily="monospace" fontWeight="900">EUR/USD</text>
          <text x="71" y="108" textAnchor="middle" fill={ca(c, 0.35)} fontSize="5" fontFamily="monospace">YOUR PAIR</text>
          {/* Mini price bars */}
          {[0,1,2,3,4].map(i => (
            <rect key={`mpb-${i}`} x={44 + i * 10} y={114} width="2" height={6 + Math.sin(i * 1.2) * 4} rx="1" fill={ca(c, 0.15 + i * 0.04)}>
              <animate attributeName="height" values={`${5 + i * 2};${9 + i * 2};${5 + i * 2}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </rect>
          ))}

          {/* Timeframe inputs */}
          <rect x="120" y="80" width="90" height="50" rx="6" fill={ca(c, 0.03)} stroke={ca(c, 0.1)} strokeWidth="0.6" />
          <text x="165" y="92" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">TIMEFRAMES</text>
          {["M15", "H1", "H4", "D1"].map((tf, i) => (
            <g key={`tf-${i}`}>
              <rect x={127 + i * 20} y={98} width="16" height="12" rx="2" fill={i === 1 ? ca(c, 0.12) : ca(c, 0.04)} stroke={i === 1 ? ca(c, 0.3) : ca(c, 0.08)} strokeWidth="0.5" />
              <text x={135 + i * 20} y={107} textAnchor="middle" fill={i === 1 ? ca(c, 0.8) : ca(c, 0.35)} fontSize="5" fontFamily="monospace" fontWeight="700">{tf}</text>
            </g>
          ))}
          <text x="165" y="122" textAnchor="middle" fill={ca(c, 0.25)} fontSize="4.5" fontFamily="monospace">H1 primary focus</text>

          {/* Session context */}
          <rect x="224" y="80" width="90" height="50" rx="6" fill={ca(c, 0.03)} stroke={ca(c, 0.1)} strokeWidth="0.6" />
          <text x="269" y="92" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">SESSION</text>
          <rect x="234" y="98" width="68" height="12" rx="2" fill={ca(c, 0.06)} stroke={ca(c, 0.12)} strokeWidth="0.5" />
          <text x="268" y="107" textAnchor="middle" fill={ca(c, 0.6)} fontSize="5.5" fontFamily="monospace" fontWeight="700">London Open</text>
          <text x="269" y="122" textAnchor="middle" fill={ca(c, 0.25)} fontSize="4.5" fontFamily="monospace">08:00 GMT active</text>

          {/* Recent history */}
          <rect x="328" y="80" width="116" height="50" rx="6" fill={ca(c, 0.03)} stroke={ca(c, 0.1)} strokeWidth="0.6" />
          <text x="386" y="92" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">YOUR RECENT TRADES</text>
          {/* Mini trade history dots */}
          {[0,1,2,3,4,5,6].map(i => {
            const isWin = [0,2,3,5,6].includes(i)
            return (
              <g key={`th-${i}`}>
                <circle cx={342 + i * 14} cy={106} r="4" fill={isWin ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"} stroke={isWin ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"} strokeWidth="0.5" />
                <text x={342 + i * 14} y={109} textAnchor="middle" fill={isWin ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"} fontSize="4" fontFamily="monospace" fontWeight="700">{isWin ? "W" : "L"}</text>
              </g>
            )
          })}
          <text x="386" y="122" textAnchor="middle" fill={ca(c, 0.25)} fontSize="4.5" fontFamily="monospace">71% win rate this week</text>
        </g>

        {/* ═══ CONNECTOR: Stage 1 → Stage 2 ═══ */}
        <line x1="240" y1="142" x2="240" y2="164" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <rect x="236" y="142" width="8" height="22" rx="4" fill="url(#mt-flow-grad)" opacity="0">
          <animate attributeName="y" values="142;164;142" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite" />
        </rect>
        <polygon points="236,162 240,168 244,162" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 2: PRICE ACTION SCAN ENGINE
            The AI reads raw price data and extracts meaningful patterns
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="172" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="182" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 2</text>
          <text x="68" y="182" fill={ca(c, 0.35)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Price Action Scan Engine</text>

          <rect x="24" y="192" width="432" height="100" rx="8" fill={ca(c, 0.02)} stroke={ca(c, 0.1)} strokeWidth="0.8" />

          {/* Left: Candlestick chart representation */}
          <rect x="36" y="200" width="130" height="80" rx="5" fill={ca(c, 0.03)} stroke={ca(c, 0.08)} strokeWidth="0.6" />
          <text x="101" y="212" textAnchor="middle" fill={ca(c, 0.4)} fontSize="5" fontFamily="monospace" fontWeight="700">RAW PRICE DATA</text>
          
          {/* Candlesticks */}
          {[
            {x: 48, o: 50, h: 38, l: 58, c: 42, bull: true},
            {x: 58, o: 42, h: 34, l: 48, c: 36, bull: true},
            {x: 68, o: 36, h: 30, l: 44, c: 40, bull: false},
            {x: 78, o: 40, h: 32, l: 46, c: 34, bull: true},
            {x: 88, o: 34, h: 28, l: 42, c: 30, bull: true},
            {x: 98, o: 30, h: 24, l: 38, c: 32, bull: false},
            {x: 108, o: 32, h: 26, l: 40, c: 28, bull: true},
            {x: 118, o: 28, h: 22, l: 36, c: 26, bull: true},
            {x: 128, o: 26, h: 20, l: 34, c: 30, bull: false},
            {x: 138, o: 30, h: 24, l: 38, c: 24, bull: true},
            {x: 148, o: 24, h: 18, l: 32, c: 22, bull: true},
          ].map((candle, i) => (
            <g key={`candle-${i}`}>
              {/* Wick */}
              <line x1={candle.x} y1={candle.h + 218} x2={candle.x} y2={candle.l + 218} stroke={candle.bull ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"} strokeWidth="0.6" />
              {/* Body */}
              <rect x={candle.x - 2.5} y={Math.min(candle.o, candle.c) + 218} width="5" height={Math.abs(candle.o - candle.c) || 1} rx="0.5" 
                fill={candle.bull ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"} 
                stroke={candle.bull ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"} strokeWidth="0.4" />
            </g>
          ))}
          
          {/* Trend line overlay */}
          <line x1="48" y1="268" x2="148" y2="240" stroke={ca(c, 0.2)} strokeWidth="0.8" strokeDasharray="3 2">
            <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
          </line>

          {/* Center: Scan operations */}
          <rect x="180" y="200" width="130" height="80" rx="5" fill={ca(c, 0.03)} stroke={ca(c, 0.08)} strokeWidth="0.6" />
          <text x="245" y="212" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="700">PATTERN RECOGNITION</text>
          
          {/* Scan operations list */}
          {[
            { label: "Swing Point Detection", status: "active", pct: 94 },
            { label: "Order Block Scan", status: "active", pct: 87 },
            { label: "FVG Identification", status: "active", pct: 91 },
            { label: "Liquidity Pool Map", status: "active", pct: 78 },
            { label: "Break of Structure", status: "scanning", pct: 65 },
          ].map((op, i) => (
            <g key={`op-${i}`}>
              <text x="190" y={226 + i * 13} fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace" fontWeight="600">{op.label}</text>
              {/* Progress bar */}
              <rect x="190" y={228 + i * 13} width="108" height="3" rx="1.5" fill={ca(c, 0.06)} />
              <rect x="190" y={228 + i * 13} width={op.pct * 1.08} height="3" rx="1.5" fill={ca(c, op.status === "scanning" ? 0.2 : 0.3)}>
                {op.status === "scanning" && <animate attributeName="width" values={`${op.pct * 0.8};${op.pct * 1.1};${op.pct * 0.8}`} dur="2s" repeatCount="indefinite" />}
              </rect>
              <text x="302" y={226 + i * 13} textAnchor="end" fill={ca(c, 0.3)} fontSize="4" fontFamily="monospace">{op.pct}%</text>
            </g>
          ))}

          {/* Right: Extracted structures */}
          <rect x="324" y="200" width="120" height="80" rx="5" fill={ca(c, 0.03)} stroke={ca(c, 0.08)} strokeWidth="0.6" />
          <text x="384" y="212" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="700">EXTRACTED STRUCTURES</text>
          
          {/* Structure nodes */}
          {[
            { label: "Higher High", y: 222, conf: "92%" },
            { label: "Higher Low", y: 236, conf: "88%" },
            { label: "Order Block", y: 250, conf: "85%" },
            { label: "FVG Zone", y: 264, conf: "79%" },
          ].map((node, i) => (
            <g key={`struct-${i}`}>
              <rect x="334" y={node.y} width="100" height="12" rx="2.5" fill={ca(c, 0.04 + i * 0.01)} stroke={ca(c, 0.12)} strokeWidth="0.5" />
              <circle cx="342" cy={node.y + 6} r="2.5" fill={ca(c, 0.3 + i * 0.05)}>
                <animate attributeName="r" values="2;3;2" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <text x="350" y={node.y + 9} fill={ca(c, 0.55)} fontSize="5" fontFamily="monospace" fontWeight="600">{node.label}</text>
              <text x="428" y={node.y + 9} textAnchor="end" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">{node.conf}</text>
            </g>
          ))}

          {/* Flow arrows between sections */}
          <line x1="168" y1="240" x2="178" y2="240" stroke={ca(c, 0.15)} strokeWidth="1" strokeDasharray="2 2">
            <animate attributeName="stroke-dashoffset" values="0;-8" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="312" y1="240" x2="322" y2="240" stroke={ca(c, 0.15)} strokeWidth="1" strokeDasharray="2 2">
            <animate attributeName="stroke-dashoffset" values="0;-8" dur="1.5s" repeatCount="indefinite" />
          </line>
        </g>

        {/* ═══ CONNECTOR: Stage 2 → Stage 3 ═══ */}
        <line x1="240" y1="294" x2="240" y2="316" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <rect x="236" y="294" width="8" height="22" rx="4" fill="url(#mt-flow-grad)" opacity="0">
          <animate attributeName="y" values="294;316;294" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite" />
        </rect>
        <polygon points="236,314 240,320 244,314" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 3: MULTI-TIMEFRAME ALIGNMENT ENGINE
            Cross-referencing structure across multiple timeframes
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="322" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="332" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 3</text>
          <text x="68" y="332" fill={ca(c, 0.35)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Multi-Timeframe Alignment</text>

          <rect x="24" y="342" width="432" height="90" rx="8" fill={ca(c, 0.02)} stroke={ca(c, 0.1)} strokeWidth="0.8" />

          {/* Four timeframe columns */}
          {[
            { tf: "D1", bias: "BULLISH", strength: 85, bars: [30, 24, 28, 22, 20, 26, 18, 16], color: "rgba(16,185,129," },
            { tf: "H4", bias: "BULLISH", strength: 78, bars: [26, 22, 28, 20, 24, 18, 22, 16], color: "rgba(16,185,129," },
            { tf: "H1", bias: "NEUTRAL", strength: 52, bars: [22, 26, 20, 28, 24, 22, 26, 24], color: `${ca(c, 0).slice(0, -2)}` },
            { tf: "M15", bias: "BEARISH", strength: 35, bars: [18, 22, 26, 24, 28, 30, 26, 32], color: "rgba(239,68,68," },
          ].map((tf, i) => {
            const bx = 38 + i * 108
            return (
              <g key={`mtf-${i}`}>
                <rect x={bx} y="352" width="96" height="70" rx="5" fill={ca(c, 0.025)} stroke={ca(c, 0.08)} strokeWidth="0.5" />
                
                {/* TF header */}
                <rect x={bx + 4} y="356" width="24" height="12" rx="2" fill={ca(c, 0.08)} />
                <text x={bx + 16} y="365" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">{tf.tf}</text>
                
                {/* Bias label */}
                <text x={bx + 48} y="365" textAnchor="middle" fill={tf.bias === "BULLISH" ? "rgba(16,185,129,0.7)" : tf.bias === "BEARISH" ? "rgba(239,68,68,0.7)" : ca(c, 0.4)} fontSize="5" fontFamily="monospace" fontWeight="800">{tf.bias}</text>
                
                {/* Strength bar */}
                <rect x={bx + 68} y="358" width="24" height="6" rx="3" fill={ca(c, 0.06)} />
                <rect x={bx + 68} y="358" width={tf.strength * 0.24} height="6" rx="3" fill={tf.bias === "BULLISH" ? "rgba(16,185,129,0.35)" : tf.bias === "BEARISH" ? "rgba(239,68,68,0.35)" : ca(c, 0.2)} />
                
                {/* Mini chart bars */}
                {tf.bars.map((h, bi) => (
                  <rect key={`bar-${i}-${bi}`} x={bx + 8 + bi * 11} y={400 - h * 0.6} width="6" height={h * 0.6} rx="1" 
                    fill={tf.bias === "BULLISH" ? `rgba(16,185,129,${0.1 + bi * 0.02})` : tf.bias === "BEARISH" ? `rgba(239,68,68,${0.1 + bi * 0.02})` : ca(c, 0.08 + bi * 0.02)} />
                ))}

                {/* Alignment indicator */}
                <text x={bx + 48} y="416" textAnchor="middle" fill={ca(c, 0.25)} fontSize="4" fontFamily="monospace">{tf.strength}% strength</text>
              </g>
            )
          })}

          {/* Alignment score overlay */}
          <rect x="190" y="424" width="100" height="4" rx="2" fill={ca(c, 0.05)} />
          <rect x="190" y="424" width="72" height="4" rx="2" fill={ca(c, 0.25)}>
            <animate attributeName="width" values="68;76;68" dur="3s" repeatCount="indefinite" />
          </rect>
          <text x="240" y="420" textAnchor="middle" fill={ca(c, 0.4)} fontSize="4.5" fontFamily="monospace" fontWeight="700">ALIGNMENT: 72% (3 of 4 timeframes agree)</text>
        </g>

        {/* ═══ CONNECTOR: Stage 3 → Stage 4 ═══ */}
        <line x1="240" y1="434" x2="240" y2="452" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="236,450 240,456 244,450" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 4: DIRECTIONAL BIAS + KEY LEVELS + SMART MONEY
            The synthesis of all analysis into actionable output
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="458" width="38" height="14" rx="3" fill={ca(c, 0.1)} />
          <text x="35" y="468" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 4</text>
          <text x="68" y="468" fill={ca(c, 0.4)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Directional Synthesis + Smart Money Flow</text>

          <rect x="24" y="478" width="432" height="110" rx="8" fill={ca(c, 0.025)} stroke={ca(c, 0.12)} strokeWidth="0.8">
            <animate attributeName="stroke-opacity" values="0.08;0.18;0.08" dur="3s" repeatCount="indefinite" />
          </rect>

          {/* Left: Key Levels Map */}
          <rect x="36" y="486" width="140" height="94" rx="5" fill={ca(c, 0.03)} stroke={ca(c, 0.08)} strokeWidth="0.6" />
          <text x="106" y="498" textAnchor="middle" fill={ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">KEY LEVELS MAP</text>
          
          {/* Level lines with labels */}
          {[
            { y: 510, label: "Weekly High", price: "1.0920", type: "resistance", strength: 95 },
            { y: 522, label: "Order Block", price: "1.0895", type: "ob", strength: 88 },
            { y: 534, label: "Current Price", price: "1.0872", type: "current", strength: 100 },
            { y: 546, label: "FVG Zone", price: "1.0845", type: "fvg", strength: 82 },
            { y: 558, label: "Daily Low", price: "1.0810", type: "support", strength: 90 },
            { y: 570, label: "Liquidity Pool", price: "1.0780", type: "liquidity", strength: 76 },
          ].map((level, i) => {
            const isRes = level.type === "resistance" || level.type === "ob"
            const isCurrent = level.type === "current"
            return (
              <g key={`lvl-${i}`}>
                <line x1="42" y1={level.y} x2="168" y2={level.y} 
                  stroke={isCurrent ? ca(c, 0.5) : isRes ? "rgba(239,68,68,0.2)" : level.type === "liquidity" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"} 
                  strokeWidth={isCurrent ? "1.2" : "0.6"} 
                  strokeDasharray={isCurrent ? "none" : "3 2"}>
                  {isCurrent && <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />}
                </line>
                <text x="44" y={level.y - 2} fill={isCurrent ? ca(c, 0.7) : ca(c, 0.35)} fontSize="4" fontFamily="monospace" fontWeight={isCurrent ? "900" : "600"}>{level.label}</text>
                <text x="166" y={level.y - 2} textAnchor="end" fill={isCurrent ? ca(c, 0.6) : ca(c, 0.3)} fontSize="4.5" fontFamily="monospace" fontWeight="700">{level.price}</text>
                {/* Strength dot */}
                <circle cx="170" cy={level.y} r="2" fill={ca(c, level.strength / 300)} stroke={ca(c, level.strength / 200)} strokeWidth="0.4" />
              </g>
            )
          })}

          {/* Center: Smart Money Flow */}
          <rect x="188" y="486" width="120" height="94" rx="5" fill={ca(c, 0.03)} stroke={ca(c, 0.08)} strokeWidth="0.6" />
          <text x="248" y="498" textAnchor="middle" fill={ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">SMART MONEY FLOW</text>

          {/* Flow visualization */}
          <rect x="198" y="506" width="100" height="30" rx="4" fill={ca(c, 0.02)} />
          <text x="248" y="516" textAnchor="middle" fill="rgba(16,185,129,0.5)" fontSize="5" fontFamily="monospace" fontWeight="700">INSTITUTIONAL BUY</text>
          {/* Buy flow bars */}
          {[0,1,2,3,4].map(i => (
            <rect key={`bf-${i}`} x={205 + i * 18} y={520} width="12" height={8 + i * 3} rx="1.5" fill={`rgba(16,185,129,${0.08 + i * 0.04})`}>
              <animate attributeName="height" values={`${6 + i * 2};${12 + i * 3};${6 + i * 2}`} dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
            </rect>
          ))}

          <rect x="198" y="542" width="100" height="30" rx="4" fill={ca(c, 0.02)} />
          <text x="248" y="552" textAnchor="middle" fill="rgba(239,68,68,0.45)" fontSize="5" fontFamily="monospace" fontWeight="700">RETAIL SELL</text>
          {/* Sell flow bars (smaller = weak) */}
          {[0,1,2,3,4].map(i => (
            <rect key={`sf-${i}`} x={205 + i * 18} y={556} width="12" height={4 + i * 1.5} rx="1.5" fill={`rgba(239,68,68,${0.06 + i * 0.025})`}>
              <animate attributeName="height" values={`${3 + i};${6 + i * 1.5};${3 + i}`} dur={`${3 + i * 0.2}s`} repeatCount="indefinite" />
            </rect>
          ))}

          {/* Right: Directional Bias Output */}
          <rect x="320" y="486" width="124" height="94" rx="5" fill={ca(c, 0.04)} stroke={ca(c, 0.15)} strokeWidth="0.8">
            <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur="2.5s" repeatCount="indefinite" />
          </rect>
          <text x="382" y="498" textAnchor="middle" fill={ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">DIRECTIONAL BIAS</text>

          {/* Big arrow showing bias */}
          <line x1="382" y1="540" x2="382" y2="510" stroke="rgba(16,185,129,0.4)" strokeWidth="3" strokeLinecap="round" filter="url(#mt-glow)">
            <animate attributeName="y2" values="514;506;514" dur="2s" repeatCount="indefinite" />
          </line>
          <polygon points="376,514 382,504 388,514" fill="rgba(16,185,129,0.35)" filter="url(#mt-glow)">
            <animate attributeName="points" values="376,514 382,504 388,514;376,510 382,500 388,510;376,514 382,504 388,514" dur="2s" repeatCount="indefinite" />
          </polygon>
          <text x="382" y="550" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="9" fontFamily="monospace" fontWeight="900">BULLISH</text>
          <text x="382" y="560" textAnchor="middle" fill="rgba(16,185,129,0.4)" fontSize="5" fontFamily="monospace">78% conviction</text>

          {/* Confidence meter */}
          <rect x="340" y="568" width="84" height="5" rx="2.5" fill={ca(c, 0.06)} />
          <rect x="340" y="568" width="66" height="5" rx="2.5" fill="rgba(16,185,129,0.3)">
            <animate attributeName="width" values="62;70;62" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* ═══ CONNECTOR: Stage 4 → Output ═══ */}
        <line x1="240" y1="590" x2="240" y2="608" stroke={ca(c, 0.12)} strokeWidth="1.5" />
        <polygon points="236,606 240,612 244,606" fill={ca(c, 0.25)} />

        {/* ═══════════════════════════════════════════════════════════════
            OUTPUT: SESSION SYNTHESIS -- What you receive
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="24" y="614" width="432" height="56" rx="8" fill={ca(c, 0.04)} stroke={ca(c, 0.18)} strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.12;0.28;0.12" dur="2s" repeatCount="indefinite" />
          </rect>
          
          <text x="240" y="628" textAnchor="middle" fill={ca(c, 0.6)} fontSize="6" fontFamily="monospace" fontWeight="900" letterSpacing="1">YOUR SESSION OUTPUT</text>
          
          {/* Output cards */}
          {[
            { label: "Structure Map", x: 40 },
            { label: "Key Levels", x: 120 },
            { label: "Bias Rating", x: 200 },
            { label: "Smart Money", x: 280 },
            { label: "Trade Plan", x: 360 },
          ].map((out, i) => (
            <g key={`out-${i}`}>
              <rect x={out.x} y="636" width="70" height="26" rx="4" fill={ca(c, 0.05 + i * 0.01)} stroke={ca(c, 0.12)} strokeWidth="0.5" />
              <circle cx={out.x + 10} cy="649" r="3" fill={ca(c, 0.2 + i * 0.05)}>
                <animate attributeName="r" values="2.5;3.5;2.5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <text x={out.x + 20} y="652" fill={ca(c, 0.55)} fontSize="5" fontFamily="monospace" fontWeight="700">{out.label}</text>
            </g>
          ))}

          {/* Animated particle flow across the entire pipeline */}
          <circle r="2" fill={ca(c, 0.6)} filter="url(#mt-glow)" opacity="0">
            <animateMotion dur="8s" repeatCount="indefinite" path="M240,50 L240,168 L240,320 L240,456 L240,612 L240,670" />
            <animate attributeName="opacity" values="0;0.5;0.4;0.6;0.3;0.7;0" dur="8s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  )
}


/* =================================================================
   2. SCENARIO LAB -- #8b5cf6
   The strategist that builds if-then scenario trees, stress-tests
   trade ideas across best/worst/likely cases, calculates risk/reward
   profiles, maps outcome probabilities, and delivers a clear
   decision matrix before you commit capital.
   
   SVG Journey:
   YOUR TRADE IDEA → Scenario Branching Engine (if-then decision tree)
   → Stress Test Matrix (3 scenarios: best/worst/likely) →
   Risk-Reward Calculator → Outcome Probability Distribution →
   Decision Output Card
   
   Every element is hoverable -- shows tooltip detail on cursor.
   Key nodes scale up, glow, and reveal hidden detail on hover.
   ================================================================= */
export function ScenarioLabSVG() {
  const c = "#8b5cf6"
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const isH = (id: string) => hoveredNode === id

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: `linear-gradient(180deg, ${ca(c, 0.03)}, transparent)` }}>
      <svg viewBox="0 0 480 920" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 0: BACKGROUND -- Strategic grid with branching motif
            ═══════════════════════════════════════════════════════════════ */}
        <defs>
          <pattern id="sl-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={ca(c, 0.02)} strokeWidth="0.3" />
          </pattern>
          <linearGradient id="sl-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ca(c, 0.05)} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="sl-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="50%" stopColor={ca(c, 0.45)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
          <linearGradient id="sl-flow-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="50%" stopColor={ca(c, 0.4)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
          <filter id="sl-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sl-glow-lg">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sl-glow-xl">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Radial glow for hover states */}
          <radialGradient id="sl-hover-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ca(c, 0.15)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </radialGradient>
        </defs>
        <rect width="480" height="920" fill="url(#sl-grid)" />
        <rect width="480" height="80" fill="url(#sl-fade)" />

        {/* Ambient branching lines in background */}
        <line x1="240" y1="0" x2="80" y2="920" stroke={ca(c, 0.012)} strokeWidth="0.5" />
        <line x1="240" y1="0" x2="400" y2="920" stroke={ca(c, 0.012)} strokeWidth="0.5" />
        <line x1="240" y1="0" x2="240" y2="920" stroke={ca(c, 0.015)} strokeWidth="0.3" strokeDasharray="4 8" />

        {/* ═══════════════════════════════════════════════════════════════
            TITLE: "HOW SCENARIO LAB WORKS"
            ═══════════════════════════════════════════════════════════════ */}
        <text x="240" y="22" textAnchor="middle" fill={ca(c, 0.55)} fontSize="7" fontFamily="monospace" fontWeight="900" letterSpacing="3">HOW SCENARIO LAB WORKS</text>
        <line x1="130" y1="28" x2="350" y2="28" stroke={ca(c, 0.08)} strokeWidth="0.5" />
        <text x="240" y="38" textAnchor="middle" fill={ca(c, 0.25)} fontSize="5" fontFamily="monospace" letterSpacing="1">IF-THEN STRATEGIC SIMULATION ENGINE</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 1: YOUR TRADE IDEA -- The Hypothesis Input
            What you bring: a trade idea, a bias, a setup
            ═══════════════════════════════════════════════════════════════ */}
        <g onMouseEnter={() => setHoveredNode("stage1")} onMouseLeave={() => setHoveredNode(null)}>
          <rect x="16" y="50" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="60" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 1</text>
          <text x="68" y="60" fill={ca(c, 0.35)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Your Trade Hypothesis</text>

          {/* Main idea card */}
          <rect x="24" y="70" width="432" height="82" rx="8" fill={ca(c, 0.025)} stroke={isH("stage1") ? ca(c, 0.25) : ca(c, 0.1)} strokeWidth={isH("stage1") ? 1.2 : 0.8}
            style={{ transition: "all 0.3s ease" }} />
          {isH("stage1") && <rect x="24" y="70" width="432" height="82" rx="8" fill="url(#sl-hover-glow)" />}

          {/* Trade idea input card */}
          <g onMouseEnter={() => setHoveredNode("idea")} onMouseLeave={() => setHoveredNode("stage1")}>
            <rect x="36" y="80" width="120" height="62" rx="6" fill={isH("idea") ? ca(c, 0.07) : ca(c, 0.04)} stroke={isH("idea") ? ca(c, 0.3) : ca(c, 0.14)} strokeWidth={isH("idea") ? 1 : 0.7}
              style={{ transition: "all 0.25s ease", cursor: "pointer" }}>
              <animate attributeName="stroke-opacity" values="0.1;0.22;0.1" dur="3s" repeatCount="indefinite" />
            </rect>
            <text x="96" y="95" textAnchor="middle" fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">TRADE IDEA</text>
            {/* The idea itself */}
            <text x="96" y="109" textAnchor="middle" fill={ca(c, 0.85)} fontSize="7" fontFamily="monospace" fontWeight="900">{'"'}Long EUR/USD{'"'}</text>
            <text x="96" y="119" textAnchor="middle" fill={ca(c, 0.4)} fontSize="5" fontFamily="monospace">from 1.0872 support</text>
            {/* Idea type badge */}
            <rect x="64" y="124" width="64" height="10" rx="5" fill={ca(c, 0.08)} />
            <text x="96" y="132" textAnchor="middle" fill={ca(c, 0.5)} fontSize="4.5" fontFamily="monospace" fontWeight="700">DIRECTIONAL BIAS</text>
            {isH("idea") && (
              <text x="96" y="148" textAnchor="middle" fill={ca(c, 0.35)} fontSize="3.8" fontFamily="monospace">Your starting hypothesis to stress-test</text>
            )}
          </g>

          {/* Setup parameters */}
          <g onMouseEnter={() => setHoveredNode("params")} onMouseLeave={() => setHoveredNode("stage1")}>
            <rect x="170" y="80" width="130" height="62" rx="6" fill={isH("params") ? ca(c, 0.06) : ca(c, 0.03)} stroke={isH("params") ? ca(c, 0.25) : ca(c, 0.1)} strokeWidth={isH("params") ? 1 : 0.6}
              style={{ transition: "all 0.25s ease", cursor: "pointer" }} />
            <text x="235" y="93" textAnchor="middle" fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">SETUP PARAMETERS</text>
            
            {/* Parameter rows */}
            {[
              { label: "Entry Zone", value: "1.0870-1.0880", y: 102 },
              { label: "Stop Loss", value: "1.0835", y: 114 },
              { label: "Target 1", value: "1.0920", y: 126 },
              { label: "Target 2", value: "1.0960", y: 138 },
            ].map((p, i) => (
              <g key={`param-${i}`}>
                <text x="180" y={p.y} fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="600">{p.label}</text>
                <text x="290" y={p.y} textAnchor="end" fill={ca(c, 0.6)} fontSize="5" fontFamily="monospace" fontWeight="700">{p.value}</text>
                <line x1="180" y1={p.y + 3} x2="290" y2={p.y + 3} stroke={ca(c, 0.04)} strokeWidth="0.4" />
              </g>
            ))}
          </g>

          {/* Context panel */}
          <g onMouseEnter={() => setHoveredNode("context")} onMouseLeave={() => setHoveredNode("stage1")}>
            <rect x="314" y="80" width="130" height="62" rx="6" fill={isH("context") ? ca(c, 0.06) : ca(c, 0.03)} stroke={isH("context") ? ca(c, 0.25) : ca(c, 0.1)} strokeWidth={isH("context") ? 1 : 0.6}
              style={{ transition: "all 0.25s ease", cursor: "pointer" }} />
            <text x="379" y="93" textAnchor="middle" fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">MARKET CONTEXT</text>
            
            {/* Context items with status dots */}
            {[
              { label: "Trend", value: "Uptrend (H4)", status: "green", y: 104 },
              { label: "Volatility", value: "Medium", status: "amber", y: 116 },
              { label: "News Risk", value: "CPI in 6h", status: "red", y: 128 },
              { label: "Session", value: "London Active", status: "green", y: 140 },
            ].map((ctx, i) => (
              <g key={`ctx-${i}`}>
                <circle cx="324" cy={ctx.y - 2} r="2" fill={ctx.status === "green" ? "rgba(16,185,129,0.5)" : ctx.status === "amber" ? "rgba(245,158,11,0.5)" : "rgba(239,68,68,0.5)"} />
                <text x="332" y={ctx.y} fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="600">{ctx.label}</text>
                <text x="434" y={ctx.y} textAnchor="end" fill={ca(c, 0.55)} fontSize="4.5" fontFamily="monospace" fontWeight="700">{ctx.value}</text>
              </g>
            ))}
          </g>
        </g>

        {/* ═══ CONNECTOR: Stage 1 → Stage 2 ═══ */}
        <line x1="240" y1="154" x2="240" y2="178" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <rect x="236" y="154" width="8" height="24" rx="4" fill="url(#sl-flow-v)" opacity="0">
          <animate attributeName="y" values="154;178;154" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite" />
        </rect>
        <polygon points="236,176 240,182 244,176" fill={ca(c, 0.2)} />
        <text x="254" y="168" fill={ca(c, 0.2)} fontSize="4" fontFamily="monospace">hypothesis enters engine</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 2: SCENARIO BRANCHING ENGINE
            The if-then decision tree -- the core of the mode
            Builds 3 branching paths from your trade idea
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="186" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="196" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 2</text>
          <text x="68" y="196" fill={ca(c, 0.35)} fontSize="5.5" fontFamily="monospace" fontWeight="600">If-Then Branching Engine</text>
          <text x="260" y="196" fill={ca(c, 0.2)} fontSize="4.5" fontFamily="monospace">hover each branch for deep breakdown</text>

          <rect x="24" y="206" width="432" height="200" rx="8" fill={ca(c, 0.018)} stroke={ca(c, 0.08)} strokeWidth="0.8" />

          {/* ── DECISION TREE ROOT NODE ── */}
          <g onMouseEnter={() => setHoveredNode("root")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="190" y="216" width="100" height="28" rx="6" fill={isH("root") ? ca(c, 0.12) : ca(c, 0.06)} stroke={isH("root") ? ca(c, 0.4) : ca(c, 0.2)} strokeWidth={isH("root") ? 1.2 : 0.8}
              style={{ transition: "all 0.25s ease", cursor: "pointer" }}>
              <animate attributeName="stroke-opacity" values="0.15;0.3;0.15" dur="2.5s" repeatCount="indefinite" />
            </rect>
            {isH("root") && <rect x="186" y="212" width="108" height="36" rx="8" fill="none" stroke={ca(c, 0.15)} strokeWidth="0.5" strokeDasharray="3 2" />}
            <text x="240" y="228" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">IF price reaches</text>
            <text x="240" y="238" textAnchor="middle" fill={ca(c, 0.55)} fontSize="5.5" fontFamily="monospace" fontWeight="700">entry zone 1.0870</text>
          </g>

          {/* ── THREE BRANCHING LINES FROM ROOT ── */}
          {/* Left branch: BULLISH */}
          <line x1="210" y1="244" x2="100" y2="270" stroke={isH("bull") ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.15)"} strokeWidth={isH("bull") ? 1.5 : 1}>
            <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
          </line>
          <circle r="2" fill="rgba(16,185,129,0.6)" opacity="0">
            <animateMotion dur="2s" repeatCount="indefinite" path="M210,244 L100,270" />
            <animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Center branch: NEUTRAL */}
          <line x1="240" y1="244" x2="240" y2="270" stroke={isH("neutral") ? ca(c, 0.35) : ca(c, 0.12)} strokeWidth={isH("neutral") ? 1.5 : 1} />
          <circle r="2" fill={ca(c, 0.5)} opacity="0">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M240,244 L240,270" />
            <animate attributeName="opacity" values="0;0.6;0" dur="2.2s" repeatCount="indefinite" />
          </circle>

          {/* Right branch: BEARISH */}
          <line x1="270" y1="244" x2="380" y2="270" stroke={isH("bear") ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.15)"} strokeWidth={isH("bear") ? 1.5 : 1}>
            <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
          </line>
          <circle r="2" fill="rgba(239,68,68,0.6)" opacity="0">
            <animateMotion dur="2s" repeatCount="indefinite" path="M270,244 L380,270" />
            <animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* ═══ BRANCH A: BULLISH SCENARIO (Best Case) ═══ */}
          <g onMouseEnter={() => setHoveredNode("bull")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="34" y="272" width="132" height={isH("bull") ? 128 : 120} rx="7" fill={isH("bull") ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.02)"} stroke={isH("bull") ? "rgba(16,185,129,0.35)" : "rgba(16,185,129,0.1)"} strokeWidth={isH("bull") ? 1.2 : 0.7}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            {isH("bull") && <rect x="30" y="268" width="140" height={isH("bull") ? 136 : 128} rx="9" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="0.5" strokeDasharray="3 2" />}

            {/* Header */}
            <rect x="42" y="278" width="52" height="12" rx="6" fill="rgba(16,185,129,0.12)" />
            <text x="68" y="287" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="5" fontFamily="monospace" fontWeight="900">BEST CASE</text>
            <circle cx="106" cy="284" r="3" fill="rgba(16,185,129,0.35)">
              <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="116" y="287" fill="rgba(16,185,129,0.5)" fontSize="4.5" fontFamily="monospace" fontWeight="700">35%</text>

            {/* Scenario description */}
            <text x="44" y="302" fill="rgba(16,185,129,0.6)" fontSize="5" fontFamily="monospace" fontWeight="700">IF support holds</text>
            <text x="44" y="312" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">THEN price pushes to 1.0920</text>
            <text x="44" y="322" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">AND breaks above daily high</text>
            <text x="44" y="332" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">THEN targets 1.0960 zone</text>

            {/* Outcome metrics */}
            <line x1="44" y1="340" x2="156" y2="340" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
            <text x="44" y="350" fill="rgba(16,185,129,0.45)" fontSize="4" fontFamily="monospace" fontWeight="700">Reward: +48 pips</text>
            <text x="44" y="360" fill="rgba(16,185,129,0.45)" fontSize="4" fontFamily="monospace" fontWeight="700">R:R Ratio: 1:2.7</text>
            <text x="44" y="370" fill="rgba(16,185,129,0.4)" fontSize="4" fontFamily="monospace">Hold time: 4-8 hours</text>

            {/* Mini price path chart -- bullish trajectory */}
            <polyline points="44,388 56,386 68,383 80,380 92,375 104,370 116,364 128,360 140,354 152,350"
              stroke="rgba(16,185,129,0.35)" strokeWidth="1" fill="none" strokeLinecap="round">
              <animate attributeName="stroke-opacity" values="0.2;0.45;0.2" dur="3s" repeatCount="indefinite" />
            </polyline>
            {/* Area under the curve */}
            <polygon points="44,388 56,386 68,383 80,380 92,375 104,370 116,364 128,360 140,354 152,350 152,392 44,392"
              fill="rgba(16,185,129,0.04)" />
            {/* Moving dot on path */}
            <circle r="2.5" fill="rgba(16,185,129,0.6)" filter="url(#sl-glow)" opacity="0">
              <animateMotion dur="3s" repeatCount="indefinite" path="M44,388 L68,383 L92,375 L116,364 L152,350" />
              <animate attributeName="opacity" values="0;0.7;0.5;0.8;0" dur="3s" repeatCount="indefinite" />
            </circle>

            {isH("bull") && (
              <g>
                <text x="44" y="400" fill="rgba(16,185,129,0.35)" fontSize="3.8" fontFamily="monospace">Key triggers: H4 close above 1.0895,</text>
                <text x="44" y="408" fill="rgba(16,185,129,0.3)" fontSize="3.8" fontFamily="monospace">volume spike on London open</text>
              </g>
            )}
          </g>

          {/* ═══ BRANCH B: NEUTRAL SCENARIO (Base Case) ═══ */}
          <g onMouseEnter={() => setHoveredNode("neutral")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="174" y="272" width="132" height={isH("neutral") ? 128 : 120} rx="7" fill={isH("neutral") ? ca(c, 0.06) : ca(c, 0.025)} stroke={isH("neutral") ? ca(c, 0.3) : ca(c, 0.1)} strokeWidth={isH("neutral") ? 1.2 : 0.7}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            {isH("neutral") && <rect x="170" y="268" width="140" height={isH("neutral") ? 136 : 128} rx="9" fill="none" stroke={ca(c, 0.1)} strokeWidth="0.5" strokeDasharray="3 2" />}

            <rect x="182" y="278" width="54" height="12" rx="6" fill={ca(c, 0.1)} />
            <text x="209" y="287" textAnchor="middle" fill={ca(c, 0.75)} fontSize="5" fontFamily="monospace" fontWeight="900">BASE CASE</text>
            <circle cx="248" cy="284" r="3" fill={ca(c, 0.3)}>
              <animate attributeName="r" values="2.5;3.5;2.5" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <text x="258" y="287" fill={ca(c, 0.5)} fontSize="4.5" fontFamily="monospace" fontWeight="700">45%</text>

            <text x="184" y="302" fill={ca(c, 0.55)} fontSize="5" fontFamily="monospace" fontWeight="700">IF range consolidates</text>
            <text x="184" y="312" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">THEN price chops 1.0850-1.0895</text>
            <text x="184" y="322" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">AND no clear breakout occurs</text>
            <text x="184" y="332" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">THEN wait for catalyst</text>

            <line x1="184" y1="340" x2="296" y2="340" stroke={ca(c, 0.06)} strokeWidth="0.5" />
            <text x="184" y="350" fill={ca(c, 0.4)} fontSize="4" fontFamily="monospace" fontWeight="700">Reward: +8 to -12 pips</text>
            <text x="184" y="360" fill={ca(c, 0.4)} fontSize="4" fontFamily="monospace" fontWeight="700">R:R Ratio: n/a (range)</text>
            <text x="184" y="370" fill={ca(c, 0.35)} fontSize="4" fontFamily="monospace">Hold time: watch & wait</text>

            {/* Sideways choppy price path */}
            <polyline points="184,378 196,376 208,380 220,374 232,378 244,372 256,380 268,376 280,374 292,378"
              stroke={ca(c, 0.25)} strokeWidth="1" fill="none" strokeLinecap="round">
              <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="3.5s" repeatCount="indefinite" />
            </polyline>
            <polygon points="184,378 196,376 208,380 220,374 232,378 244,372 256,380 268,376 280,374 292,378 292,392 184,392"
              fill={ca(c, 0.025)} />
            <circle r="2.5" fill={ca(c, 0.5)} filter="url(#sl-glow)" opacity="0">
              <animateMotion dur="3.5s" repeatCount="indefinite" path="M184,378 L208,380 L232,378 L256,380 L292,378" />
              <animate attributeName="opacity" values="0;0.5;0.4;0.6;0" dur="3.5s" repeatCount="indefinite" />
            </circle>

            {isH("neutral") && (
              <g>
                <text x="184" y="400" fill={ca(c, 0.3)} fontSize="3.8" fontFamily="monospace">Action: reduce size or sit out until</text>
                <text x="184" y="408" fill={ca(c, 0.25)} fontSize="3.8" fontFamily="monospace">clear directional trigger appears</text>
              </g>
            )}
          </g>

          {/* ���══ BRANCH C: BEARISH SCENARIO (Worst Case) ═══ */}
          <g onMouseEnter={() => setHoveredNode("bear")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="314" y="272" width="132" height={isH("bear") ? 128 : 120} rx="7" fill={isH("bear") ? "rgba(239,68,68,0.06)" : "rgba(239,68,68,0.02)"} stroke={isH("bear") ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.1)"} strokeWidth={isH("bear") ? 1.2 : 0.7}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            {isH("bear") && <rect x="310" y="268" width="140" height={isH("bear") ? 136 : 128} rx="9" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="0.5" strokeDasharray="3 2" />}

            <rect x="322" y="278" width="58" height="12" rx="6" fill="rgba(239,68,68,0.1)" />
            <text x="351" y="287" textAnchor="middle" fill="rgba(239,68,68,0.75)" fontSize="5" fontFamily="monospace" fontWeight="900">WORST CASE</text>
            <circle cx="392" cy="284" r="3" fill="rgba(239,68,68,0.35)">
              <animate attributeName="r" values="2.5;3.5;2.5" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <text x="402" y="287" fill="rgba(239,68,68,0.5)" fontSize="4.5" fontFamily="monospace" fontWeight="700">20%</text>

            <text x="324" y="302" fill="rgba(239,68,68,0.55)" fontSize="5" fontFamily="monospace" fontWeight="700">IF support breaks</text>
            <text x="324" y="312" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">THEN stops hit at 1.0835</text>
            <text x="324" y="322" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">AND cascading sell pressure</text>
            <text x="324" y="332" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace">THEN drops toward 1.0780</text>

            <line x1="324" y1="340" x2="436" y2="340" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
            <text x="324" y="350" fill="rgba(239,68,68,0.45)" fontSize="4" fontFamily="monospace" fontWeight="700">Loss: -37 pips (stop)</text>
            <text x="324" y="360" fill="rgba(239,68,68,0.45)" fontSize="4" fontFamily="monospace" fontWeight="700">Max drawdown: -55 pips</text>
            <text x="324" y="370" fill="rgba(239,68,68,0.4)" fontSize="4" fontFamily="monospace">Impact: -1.8% account</text>

            {/* Bearish price path */}
            <polyline points="324,370 336,374 348,378 360,384 372,390 384,393 396,395 408,398 420,400 432,404"
              stroke="rgba(239,68,68,0.35)" strokeWidth="1" fill="none" strokeLinecap="round">
              <animate attributeName="stroke-opacity" values="0.2;0.45;0.2" dur="3s" repeatCount="indefinite" />
            </polyline>
            <polygon points="324,370 336,374 348,378 360,384 372,390 384,393 396,395 408,398 420,400 432,404 432,410 324,410"
              fill="rgba(239,68,68,0.04)" />
            <circle r="2.5" fill="rgba(239,68,68,0.6)" filter="url(#sl-glow)" opacity="0">
              <animateMotion dur="3s" repeatCount="indefinite" path="M324,370 L360,384 L396,395 L432,404" />
              <animate attributeName="opacity" values="0;0.7;0.5;0.8;0" dur="3s" repeatCount="indefinite" />
            </circle>

            {isH("bear") && (
              <g>
                <text x="324" y="416" fill="rgba(239,68,68,0.3)" fontSize="3.8" fontFamily="monospace">Warning signs: H4 bear engulfing,</text>
                <text x="324" y="424" fill="rgba(239,68,68,0.25)" fontSize="3.8" fontFamily="monospace">volume on breakdown, news catalyst</text>
              </g>
            )}
          </g>
        </g>

        {/* ═══ CONNECTOR: Stage 2 → Stage 3 ═══ */}
        {/* Three branches merge back to center */}
        <line x1="100" y1="398" x2="240" y2="428" stroke="rgba(16,185,129,0.1)" strokeWidth="0.8" />
        <line x1="240" y1="398" x2="240" y2="428" stroke={ca(c, 0.1)} strokeWidth="0.8" />
        <line x1="380" y1="398" x2="240" y2="428" stroke="rgba(239,68,68,0.1)" strokeWidth="0.8" />
        <polygon points="236,426 240,432 244,426" fill={ca(c, 0.2)} />
        <text x="258" y="422" fill={ca(c, 0.18)} fontSize="4" fontFamily="monospace">scenarios merge into risk analysis</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 3: RISK-REWARD STRESS TEST MATRIX
            Quantitative comparison of all three scenarios
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="436" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="446" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 3</text>
          <text x="68" y="446" fill={ca(c, 0.35)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Risk-Reward Stress Test Matrix</text>

          <rect x="24" y="456" width="432" height="140" rx="8" fill={ca(c, 0.02)} stroke={ca(c, 0.08)} strokeWidth="0.8" />

          {/* ── COMPARISON TABLE ── */}
          {/* Header row */}
          <g>
            <rect x="36" y="464" width="408" height="16" rx="3" fill={ca(c, 0.04)} />
            {[
              { label: "METRIC", x: 60, w: 84 },
              { label: "BEST CASE", x: 172, w: 84, color: "rgba(16,185,129,0.6)" },
              { label: "BASE CASE", x: 264, w: 84, color: ca(c, 0.5) },
              { label: "WORST CASE", x: 356, w: 84, color: "rgba(239,68,68,0.6)" },
            ].map((col, i) => (
              <text key={`th-${i}`} x={col.x} y="475" textAnchor="middle" fill={col.color || ca(c, 0.4)} fontSize="4.5" fontFamily="monospace" fontWeight="900" letterSpacing="0.3">{col.label}</text>
            ))}
          </g>

          {/* Data rows with hover */}
          {[
            { metric: "Probability", best: "35%", base: "45%", worst: "20%", y: 490 },
            { metric: "Pip P/L", best: "+48", base: "+8 / -12", worst: "-37", y: 504 },
            { metric: "R:R Ratio", best: "1 : 2.7", base: "n/a", worst: "n/a", y: 518 },
            { metric: "Account Impact", best: "+2.4%", base: "~0%", worst: "-1.8%", y: 532 },
            { metric: "Hold Duration", best: "4-8h", base: "wait", worst: "stop out", y: 546 },
            { metric: "Confidence", best: "HIGH", base: "MEDIUM", worst: "LOW", y: 560 },
          ].map((row, i) => {
            const rId = `row-${i}`
            return (
              <g key={rId} onMouseEnter={() => setHoveredNode(rId)} onMouseLeave={() => setHoveredNode(null)}>
                <rect x="36" y={row.y - 8} width="408" height="14" rx="2" fill={isH(rId) ? ca(c, 0.04) : (i % 2 === 0 ? ca(c, 0.015) : "transparent")}
                  style={{ transition: "fill 0.2s ease", cursor: "pointer" }} />
                {isH(rId) && <rect x="34" y={row.y - 9} width="412" height="16" rx="3" fill="none" stroke={ca(c, 0.12)} strokeWidth="0.5" />}
                <text x="60" y={row.y} textAnchor="middle" fill={isH(rId) ? ca(c, 0.6) : ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700">{row.metric}</text>
                <text x="172" y={row.y} textAnchor="middle" fill={isH(rId) ? "rgba(16,185,129,0.75)" : "rgba(16,185,129,0.45)"} fontSize="5" fontFamily="monospace" fontWeight="700">{row.best}</text>
                <text x="264" y={row.y} textAnchor="middle" fill={isH(rId) ? ca(c, 0.65) : ca(c, 0.4)} fontSize="5" fontFamily="monospace" fontWeight="700">{row.base}</text>
                <text x="356" y={row.y} textAnchor="middle" fill={isH(rId) ? "rgba(239,68,68,0.75)" : "rgba(239,68,68,0.45)"} fontSize="5" fontFamily="monospace" fontWeight="700">{row.worst}</text>
              </g>
            )
          })}

          {/* ── EXPECTED VALUE CALCULATION ── */}
          <g onMouseEnter={() => setHoveredNode("ev")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="36" y="572" width="408" height="18" rx="4" fill={isH("ev") ? ca(c, 0.06) : ca(c, 0.035)} stroke={isH("ev") ? ca(c, 0.2) : ca(c, 0.1)} strokeWidth={isH("ev") ? 1 : 0.6}
              style={{ transition: "all 0.25s ease", cursor: "pointer" }} />
            <text x="60" y="584" textAnchor="middle" fill={ca(c, 0.55)} fontSize="5" fontFamily="monospace" fontWeight="900">EV CALC</text>
            {/* Expected Value formula */}
            <text x="160" y="584" textAnchor="middle" fill={ca(c, 0.35)} fontSize="4" fontFamily="monospace">(35%*48) + (45%*-2) + (20%*-37)</text>
            <text x="290" y="584" textAnchor="middle" fill={ca(c, 0.5)} fontSize="4" fontFamily="monospace" fontWeight="700">=</text>
            <text x="340" y="584" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="7" fontFamily="monospace" fontWeight="900" filter="url(#sl-glow)">+8.7 pips EV</text>
            <text x="420" y="584" textAnchor="middle" fill="rgba(16,185,129,0.5)" fontSize="4.5" fontFamily="monospace" fontWeight="700">POSITIVE</text>
            {isH("ev") && (
              <text x="240" y="596" textAnchor="middle" fill={ca(c, 0.3)} fontSize="3.8" fontFamily="monospace">Expected value = probability-weighted average outcome across all scenarios</text>
            )}
          </g>
        </g>

        {/* ═══ CONNECTOR: Stage 3 → Stage 4 ═══ */}
        <line x1="240" y1="598" x2="240" y2="618" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="236,616 240,622 244,616" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 4: OUTCOME PROBABILITY DISTRIBUTION
            Visual histogram / bell curve showing where outcomes cluster
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="624" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="634" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 4</text>
          <text x="68" y="634" fill={ca(c, 0.35)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Outcome Probability Distribution</text>

          <rect x="24" y="644" width="432" height="120" rx="8" fill={ca(c, 0.02)} stroke={ca(c, 0.08)} strokeWidth="0.8" />

          {/* ── PROBABILITY HISTOGRAM ── */}
          <text x="240" y="658" textAnchor="middle" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">OUTCOME DISTRIBUTION MAP</text>

          {/* X-axis labels */}
          <text x="60" y="752" textAnchor="middle" fill="rgba(239,68,68,0.4)" fontSize="4" fontFamily="monospace">-55 pips</text>
          <text x="130" y="752" textAnchor="middle" fill="rgba(239,68,68,0.3)" fontSize="4" fontFamily="monospace">-37 pips</text>
          <text x="200" y="752" textAnchor="middle" fill={ca(c, 0.25)} fontSize="4" fontFamily="monospace">-12 pips</text>
          <text x="260" y="752" textAnchor="middle" fill={ca(c, 0.3)} fontSize="4" fontFamily="monospace">+8 pips</text>
          <text x="330" y="752" textAnchor="middle" fill="rgba(16,185,129,0.3)" fontSize="4" fontFamily="monospace">+28 pips</text>
          <text x="400" y="752" textAnchor="middle" fill="rgba(16,185,129,0.4)" fontSize="4" fontFamily="monospace">+48 pips</text>

          {/* X-axis line */}
          <line x1="40" y1="742" x2="440" y2="742" stroke={ca(c, 0.08)} strokeWidth="0.5" />

          {/* Histogram bars with hover */}
          {[
            { x: 48, h: 14, pct: 3, color: "rgba(239,68,68," },
            { x: 72, h: 22, pct: 5, color: "rgba(239,68,68," },
            { x: 96, h: 38, pct: 8, color: "rgba(239,68,68," },
            { x: 120, h: 52, pct: 12, color: "rgba(239,68,68," },
            { x: 144, h: 34, pct: 7, color: "rgba(245,158,11," },
            { x: 168, h: 28, pct: 6, color: ca(c, 0).slice(0, -2) },
            { x: 192, h: 44, pct: 10, color: ca(c, 0).slice(0, -2) },
            { x: 216, h: 68, pct: 16, color: ca(c, 0).slice(0, -2) },
            { x: 240, h: 58, pct: 13, color: ca(c, 0).slice(0, -2) },
            { x: 264, h: 42, pct: 9, color: "rgba(16,185,129," },
            { x: 288, h: 36, pct: 8, color: "rgba(16,185,129," },
            { x: 312, h: 48, pct: 11, color: "rgba(16,185,129," },
            { x: 336, h: 56, pct: 14, color: "rgba(16,185,129," },
            { x: 360, h: 44, pct: 10, color: "rgba(16,185,129," },
            { x: 384, h: 32, pct: 7, color: "rgba(16,185,129," },
            { x: 408, h: 18, pct: 4, color: "rgba(16,185,129," },
          ].map((bar, i) => {
            const bId = `bar-${i}`
            const isBarColor = bar.color.startsWith("rgba")
            return (
              <g key={bId} onMouseEnter={() => setHoveredNode(bId)} onMouseLeave={() => setHoveredNode(null)}>
                <rect x={bar.x} y={742 - (isH(bId) ? bar.h * 1.15 : bar.h)} width="20" height={isH(bId) ? bar.h * 1.15 : bar.h} rx="2"
                  fill={isBarColor ? `${bar.color}${isH(bId) ? "0.25)" : "0.12)"}` : `${bar.color.replace(/0\)$/, '')}${isH(bId) ? "0.25)" : "0.12)"}`}
                  stroke={isBarColor ? `${bar.color}${isH(bId) ? "0.45)" : "0.2)"}` : `${bar.color.replace(/0\)$/, '')}${isH(bId) ? "0.45)" : "0.2)"}`}
                  strokeWidth={isH(bId) ? 0.8 : 0.4}
                  style={{ transition: "all 0.2s ease", cursor: "pointer" }}>
                  <animate attributeName="height" values={`${bar.h - 2};${bar.h + 3};${bar.h - 2}`} dur={`${3 + i * 0.15}s`} repeatCount="indefinite" />
                </rect>
                {isH(bId) && (
                  <text x={bar.x + 10} y={742 - bar.h * 1.15 - 5} textAnchor="middle" fill={ca(c, 0.6)} fontSize="5" fontFamily="monospace" fontWeight="700">{bar.pct}%</text>
                )}
              </g>
            )
          })}

          {/* Bell curve overlay */}
          <path d="M48,740 Q90,730 130,700 Q170,670 200,690 Q220,670 240,665 Q260,670 280,686 Q310,692 340,680 Q370,690 400,720 Q420,735 432,740"
            stroke={ca(c, 0.2)} strokeWidth="1" fill="none" strokeLinecap="round">
            <animate attributeName="stroke-opacity" values="0.12;0.28;0.12" dur="4s" repeatCount="indefinite" />
          </path>

          {/* EV marker line */}
          <line x1="260" y1="662" x2="260" y2="742" stroke={ca(c, 0.25)} strokeWidth="1" strokeDasharray="3 2">
            <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="2.5s" repeatCount="indefinite" />
          </line>
          <text x="260" y="660" textAnchor="middle" fill={ca(c, 0.55)} fontSize="4.5" fontFamily="monospace" fontWeight="900">EV: +8.7</text>
        </g>

        {/* ═══ CONNECTOR: Stage 4 → Stage 5 ═══ */}
        <line x1="240" y1="766" x2="240" y2="786" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="236,784 240,790 244,784" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 5: DECISION OUTPUT -- The strategic verdict
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="792" width="38" height="14" rx="3" fill={ca(c, 0.1)} />
          <text x="35" y="802" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 5</text>
          <text x="68" y="802" fill={ca(c, 0.4)} fontSize="5.5" fontFamily="monospace" fontWeight="600">Strategic Decision Output</text>

          <g onMouseEnter={() => setHoveredNode("decision")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="24" y="812" width="432" height="100" rx="8" fill={isH("decision") ? ca(c, 0.05) : ca(c, 0.03)} stroke={isH("decision") ? ca(c, 0.25) : ca(c, 0.15)} strokeWidth={isH("decision") ? 1.2 : 1}
              style={{ transition: "all 0.3s ease" }}>
              <animate attributeName="stroke-opacity" values="0.1;0.22;0.1" dur="2s" repeatCount="indefinite" />
            </rect>
            {isH("decision") && <rect x="20" y="808" width="440" height="108" rx="10" fill="none" stroke={ca(c, 0.1)} strokeWidth="0.5" strokeDasharray="4 3" />}

            {/* Decision verdict */}
            <text x="240" y="830" textAnchor="middle" fill={ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="1">STRATEGIC VERDICT</text>

            {/* Big verdict badge */}
            <rect x="160" y="838" width="160" height="24" rx="12" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.8">
              <animate attributeName="stroke-opacity" values="0.15;0.4;0.15" dur="2s" repeatCount="indefinite" />
            </rect>
            <text x="240" y="854" textAnchor="middle" fill="rgba(16,185,129,0.85)" fontSize="9" fontFamily="monospace" fontWeight="900" filter="url(#sl-glow)">PROCEED WITH TRADE</text>

            {/* Supporting metrics row */}
            <text x="240" y="872" textAnchor="middle" fill={ca(c, 0.4)} fontSize="4.5" fontFamily="monospace" fontWeight="600">Positive EV (+8.7 pips) | Favorable R:R (1:2.7) | Manageable downside (-1.8%)</text>

            {/* Condition tags */}
            {[
              { label: "Reduce size pre-CPI", x: 72 },
              { label: "Hard stop at 1.0835", x: 192 },
              { label: "Scale at 1.0920", x: 310 },
              { label: "Trail at breakeven", x: 420 },
            ].map((tag, i) => (
              <g key={`tag-${i}`}>
                <rect x={tag.x - 38} y="880" width="76" height="16" rx="8" fill={ca(c, 0.04)} stroke={ca(c, 0.1)} strokeWidth="0.4" />
                <circle cx={tag.x - 30} cy="888" r="2" fill={i === 0 ? "rgba(245,158,11,0.5)" : ca(c, 0.3)} />
                <text x={tag.x} y="891" textAnchor="middle" fill={ca(c, 0.5)} fontSize="4" fontFamily="monospace" fontWeight="600">{tag.label}</text>
              </g>
            ))}

            {isH("decision") && (
              <text x="240" y="904" textAnchor="middle" fill={ca(c, 0.25)} fontSize="3.8" fontFamily="monospace">All conditions met for entry with modified position size ahead of high-impact news</text>
            )}
          </g>
        </g>

        {/* ═══ FULL-PIPELINE PARTICLE ═══ */}
        <circle r="2.5" fill={ca(c, 0.65)} filter="url(#sl-glow)" opacity="0">
          <animateMotion dur="10s" repeatCount="indefinite" path="M240,60 L240,182 L100,290 L240,428 L240,622 L240,790 L240,912" />
          <animate attributeName="opacity" values="0;0.4;0.6;0.3;0.5;0.7;0.4;0" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="rgba(16,185,129,0.5)" filter="url(#sl-glow)" opacity="0">
          <animateMotion dur="12s" repeatCount="indefinite" path="M240,60 L240,182 L380,290 L240,428 L240,622 L240,790 L240,912" />
          <animate attributeName="opacity" values="0;0.3;0.5;0.2;0.4;0.6;0.3;0" dur="12s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}


/* =================================================================
   3. JOURNAL / REFLECT -- #06b6d4 (cyan)
   The Mirror. Looks back at your trading with you. Not a log.
   A living reflection engine that ingests your trades, maps
   your emotional + decisional patterns over time, detects
   behavioral fingerprints, highlights blind spots, and
   synthesizes growth insights you can't see yourself.
   
   Unique visual language: MIRROR / REFLECTION metaphor.
   - Vertical timeline spine (your trading history)
   - Emotion + decision heatmap (what you felt vs what you did)
   - Behavioral fingerprint radar (your unique pattern)
   - Pattern recurrence detector (what keeps happening)
   - Growth trajectory arc (where you're heading)
   - Mirror output (what the AI sees that you don't)
   
   This SVG is introspective, layered, and personal.
   Not analytical grids -- organic, human, reflective.
   ================================================================= */
export function JournalReflectSVG() {
  const c = "#06b6d4"
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const isH = (id: string) => hoveredNode === id

  /* Sub-colors for emotional spectrum */
  const emo = {
    calm: "#06b6d4",
    focused: "#3b82f6",
    anxious: "#f59e0b",
    fearful: "#ef4444",
    greedy: "#ec4899",
    disciplined: "#10b981",
    impulsive: "#f97316",
    neutral: "#8b5cf6",
  }

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: `linear-gradient(180deg, ${ca(c, 0.025)}, transparent)` }}>
      <svg viewBox="0 0 480 1080" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 0: BACKGROUND -- Mirror / reflection motif
            Radial rings emanating from center like looking into water
            ═══════════════════════════════════════════════════════════════ */}
        <defs>
          <radialGradient id="jr-mirror" cx="50%" cy="15%" r="85%">
            <stop offset="0%" stopColor={ca(c, 0.04)} />
            <stop offset="50%" stopColor={ca(c, 0.01)} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="jr-spine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ca(c, 0.35)} />
            <stop offset="50%" stopColor={ca(c, 0.15)} />
            <stop offset="100%" stopColor={ca(c, 0.05)} />
          </linearGradient>
          <linearGradient id="jr-flow-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="50%" stopColor={ca(c, 0.5)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
          <filter id="jr-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="jr-glow-lg">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="jr-soft">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="jr-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ca(c, 0.12)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </radialGradient>
        </defs>
        <rect width="480" height="1080" fill="url(#jr-mirror)" />

        {/* Concentric mirror rings -- like looking into still water */}
        {[60, 100, 150, 210, 280].map((r, i) => (
          <circle key={`ring-${i}`} cx="240" cy="120" r={r} fill="none" stroke={ca(c, 0.025 - i * 0.003)} strokeWidth="0.5">
            <animate attributeName="r" values={`${r - 2};${r + 2};${r - 2}`} dur={`${6 + i * 1.5}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ═════════════���═════════════════════════════════════════════════
            TITLE: INTROSPECTIVE HEADER
            ═══════════════════════════════════════════════════════════════ */}
        <text x="240" y="24" textAnchor="middle" fill={ca(c, 0.6)} fontSize="7.5" fontFamily="monospace" fontWeight="900" letterSpacing="3">HOW THE MIRROR WORKS</text>
        <line x1="120" y1="30" x2="360" y2="30" stroke={ca(c, 0.08)} strokeWidth="0.5" />
        <text x="240" y="42" textAnchor="middle" fill={ca(c, 0.28)} fontSize="5" fontFamily="monospace" letterSpacing="1.5">BEHAVIORAL REFLECTION ENGINE</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 1: YOUR TRADE HISTORY INTAKE
            The mirror ingests your recent trades -- not just numbers
            but the full context: timing, emotion, decision quality
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="54" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="64" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 1</text>
          <text x="68" y="64" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Trade Memory Intake</text>

          <rect x="24" y="74" width="432" height="142" rx="8" fill={ca(c, 0.018)} stroke={ca(c, 0.08)} strokeWidth="0.8" />

          {/* ── VERTICAL TIMELINE SPINE ── */}
          <line x1="68" y1="88" x2="68" y2="206" stroke="url(#jr-spine)" strokeWidth="1.5" />

          {/* ── TRADE ENTRIES ON TIMELINE ── */}
          {[
            { y: 94, pair: "EUR/USD", dir: "LONG", pips: "+32", emo: "Focused", emoColor: emo.focused, time: "Mon 09:14", grade: "A", gradeColor: emo.disciplined },
            { y: 118, pair: "GBP/JPY", dir: "SHORT", pips: "-18", emo: "Anxious", emoColor: emo.anxious, time: "Mon 14:42", grade: "C", gradeColor: emo.anxious },
            { y: 142, pair: "EUR/USD", dir: "LONG", pips: "+12", emo: "Calm", emoColor: emo.calm, time: "Tue 10:08", grade: "B+", gradeColor: emo.disciplined },
            { y: 166, pair: "USD/JPY", dir: "SHORT", pips: "-28", emo: "Impulsive", emoColor: emo.impulsive, time: "Tue 15:55", grade: "D", gradeColor: emo.fearful },
            { y: 190, pair: "GBP/USD", dir: "LONG", pips: "+44", emo: "Disciplined", emoColor: emo.disciplined, time: "Wed 09:30", grade: "A+", gradeColor: emo.disciplined },
          ].map((trade, i) => {
            const tId = `trade-${i}`
            return (
              <g key={tId} onMouseEnter={() => setHoveredNode(tId)} onMouseLeave={() => setHoveredNode(null)}>
                {/* Timeline dot */}
                <circle cx="68" cy={trade.y + 4} r={isH(tId) ? 5 : 3.5} fill={isH(tId) ? trade.emoColor : ca(c, 0.2)} stroke={trade.emoColor} strokeWidth={isH(tId) ? 1.2 : 0.6}
                  style={{ transition: "all 0.25s ease", cursor: "pointer" }}>
                  <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                {isH(tId) && <circle cx="68" cy={trade.y + 4} r="10" fill="none" stroke={ca(trade.emoColor, 0.2)} strokeWidth="0.5">
                  <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>}

                {/* Horizontal connector */}
                <line x1="76" y1={trade.y + 4} x2="92" y2={trade.y + 4} stroke={isH(tId) ? ca(c, 0.25) : ca(c, 0.08)} strokeWidth="0.6" />

                {/* Trade card */}
                <rect x="94" y={trade.y - 6} width={isH(tId) ? 348 : 340} height={isH(tId) ? 22 : 18} rx="4" fill={isH(tId) ? ca(c, 0.05) : ca(c, 0.02)} stroke={isH(tId) ? ca(c, 0.2) : ca(c, 0.06)} strokeWidth={isH(tId) ? 0.8 : 0.5}
                  style={{ transition: "all 0.25s ease", cursor: "pointer" }} />

                {/* Time */}
                <text x="102" y={trade.y + 6} fill={ca(c, 0.35)} fontSize="5" fontFamily="monospace" fontWeight="600">{trade.time}</text>

                {/* Pair + Direction */}
                <text x="160" y={trade.y + 6} fill={isH(tId) ? ca(c, 0.85) : ca(c, 0.55)} fontSize="6" fontFamily="monospace" fontWeight="900">{trade.pair}</text>
                <rect x="210" y={trade.y - 2} width="30" height="12" rx="6" fill={trade.dir === "LONG" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"} />
                <text x="225" y={trade.y + 7} textAnchor="middle" fill={trade.dir === "LONG" ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)"} fontSize="4.5" fontFamily="monospace" fontWeight="800">{trade.dir}</text>

                {/* P/L */}
                <text x="260" y={trade.y + 6} fill={trade.pips.startsWith("+") ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)"} fontSize="6.5" fontFamily="monospace" fontWeight="900">{trade.pips}</text>

                {/* Emotion badge */}
                <rect x="295" y={trade.y - 2} width={trade.emo.length * 5 + 12} height="12" rx="6" fill={ca(trade.emoColor, 0.1)} stroke={ca(trade.emoColor, 0.2)} strokeWidth="0.4" />
                <circle cx="302" cy={trade.y + 4} r="2" fill={trade.emoColor} opacity="0.6" />
                <text x="310" y={trade.y + 7} fill={ca(trade.emoColor, 0.75)} fontSize="4.5" fontFamily="monospace" fontWeight="700">{trade.emo}</text>

                {/* Grade */}
                <rect x={isH(tId) ? 400 : 396} y={trade.y - 2} width="22" height="12" rx="3" fill={ca(trade.gradeColor, 0.12)} />
                <text x={isH(tId) ? 411 : 407} y={trade.y + 7} textAnchor="middle" fill={ca(trade.gradeColor, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">{trade.grade}</text>
              </g>
            )
          })}

          {/* Timeline label */}
          <text x="68" y="216" textAnchor="middle" fill={ca(c, 0.2)} fontSize="4" fontFamily="monospace" letterSpacing="0.5">THIS WEEK</text>
        </g>

        {/* ═══ CONNECTOR: Stage 1 -> Stage 2 ═══ */}
        <line x1="240" y1="220" x2="240" y2="246" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <rect x="237" y="220" width="6" height="26" rx="3" fill="url(#jr-flow-v)" opacity="0">
          <animate attributeName="y" values="220;246;220" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" />
        </rect>
        <polygon points="237,244 240,250 243,244" fill={ca(c, 0.2)} />
        <text x="258" y="238" fill={ca(c, 0.18)} fontSize="4" fontFamily="monospace">trades flow into emotional analysis</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 2: EMOTION-DECISION HEATMAP
            Maps what you FELT against what you DID
            This is unique to Journal -- no other mode has this
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="254" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="264" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 2</text>
          <text x="68" y="264" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Emotion-Decision Heatmap</text>

          <rect x="24" y="274" width="432" height="195" rx="8" fill={ca(c, 0.018)} stroke={ca(c, 0.08)} strokeWidth="0.8" />

          {/* ── HEATMAP GRID ── */}
          {/* Y-axis: Emotions */}
          <text x="36" y="294" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">EMOTIONAL STATE</text>
          
          {/* X-axis: Decision Quality */}
          <text x="260" y="294" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">DECISION QUALITY</text>

          {/* Column headers */}
          {["Followed Plan", "Improvised", "Revenge", "Early Exit", "Perfect Entry"].map((col, i) => (
            <g key={`col-${i}`}>
              <text x={130 + i * 70} y={310} textAnchor="middle" fill={ca(c, 0.3)} fontSize="4" fontFamily="monospace" fontWeight="600" transform={`rotate(-15, ${130 + i * 70}, 310)`}>{col}</text>
            </g>
          ))}

          {/* Row labels + heatmap cells */}
          {[
            { label: "Calm", color: emo.calm, y: 325, cells: [0.8, 0.1, 0, 0.05, 0.7] },
            { label: "Focused", color: emo.focused, y: 345, cells: [0.9, 0.15, 0, 0.1, 0.85] },
            { label: "Anxious", color: emo.anxious, y: 365, cells: [0.2, 0.5, 0.3, 0.6, 0.1] },
            { label: "Fearful", color: emo.fearful, y: 385, cells: [0.1, 0.3, 0.15, 0.8, 0.05] },
            { label: "Impulsive", color: emo.impulsive, y: 405, cells: [0.05, 0.7, 0.8, 0.2, 0.02] },
            { label: "Greedy", color: emo.greedy, y: 425, cells: [0.1, 0.6, 0.5, 0.1, 0.08] },
          ].map((row, ri) => (
            <g key={`row-${ri}`}>
              {/* Row label */}
              <circle cx="42" cy={row.y} r="3" fill={ca(row.color, 0.4)} />
              <text x="52" y={row.y + 3} fill={ca(row.color, 0.6)} fontSize="5" fontFamily="monospace" fontWeight="700">{row.label}</text>

              {/* Heat cells */}
              {row.cells.map((intensity, ci) => {
                const cellId = `cell-${ri}-${ci}`
                const cellColor = intensity > 0.5 ? (ri >= 2 ? emo.fearful : emo.disciplined) : ca(c, 0.5)
                return (
                  <g key={cellId} onMouseEnter={() => setHoveredNode(cellId)} onMouseLeave={() => setHoveredNode(null)}>
                    <rect x={105 + ci * 70} y={row.y - 8} width="50" height="16" rx="3"
                      fill={ca(cellColor, intensity * (isH(cellId) ? 0.3 : 0.18))}
                      stroke={isH(cellId) ? ca(cellColor, 0.4) : ca(cellColor, intensity * 0.15)}
                      strokeWidth={isH(cellId) ? 0.8 : 0.4}
                      style={{ transition: "all 0.2s ease", cursor: "pointer" }} />
                    {/* Intensity indicator */}
                    {intensity > 0 && (
                      <rect x={107 + ci * 70} y={row.y + 3} width={intensity * 46} height="2" rx="1"
                        fill={ca(cellColor, intensity * 0.5)}>
                        {isH(cellId) && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />}
                      </rect>
                    )}
                    {isH(cellId) && intensity > 0 && (
                      <text x={130 + ci * 70} y={row.y} textAnchor="middle" fill={ca(cellColor, 0.9)} fontSize="5.5" fontFamily="monospace" fontWeight="900">{Math.round(intensity * 100)}%</text>
                    )}
                    {!isH(cellId) && intensity >= 0.5 && (
                      <text x={130 + ci * 70} y={row.y + 1} textAnchor="middle" fill={ca(cellColor, 0.55)} fontSize="4.5" fontFamily="monospace" fontWeight="700">{Math.round(intensity * 100)}%</text>
                    )}
                  </g>
                )
              })}
            </g>
          ))}

          {/* ── KEY INSIGHT from heatmap ── */}
          <g onMouseEnter={() => setHoveredNode("heatInsight")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="36" y="442" width="408" height={isH("heatInsight") ? 22 : 18} rx="4" fill={isH("heatInsight") ? ca(c, 0.06) : ca(c, 0.03)} stroke={isH("heatInsight") ? ca(c, 0.2) : ca(c, 0.1)} strokeWidth={isH("heatInsight") ? 0.8 : 0.5}
              style={{ transition: "all 0.25s ease", cursor: "pointer" }} />
            <circle cx="48" cy={isH("heatInsight") ? 453 : 451} r="3" fill={ca(emo.impulsive, 0.5)}>
              <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="58" y={isH("heatInsight") ? 456 : 454} fill={ca(c, 0.65)} fontSize="5.5" fontFamily="monospace" fontWeight="800">PATTERN DETECTED:</text>
            <text x="175" y={isH("heatInsight") ? 456 : 454} fill={ca(emo.impulsive, 0.8)} fontSize="5.5" fontFamily="monospace" fontWeight="800">80% of revenge trades occur when Impulsive</text>
            {isH("heatInsight") && (
              <text x="58" y="466" fill={ca(c, 0.35)} fontSize="4" fontFamily="monospace">The mirror sees: your biggest leaks correlate with emotional state, not market conditions</text>
            )}
          </g>
        </g>

        {/* ═══ CONNECTOR: Stage 2 -> Stage 3 ═══ */}
        <line x1="240" y1="472" x2="240" y2="498" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,496 240,502 243,496" fill={ca(c, 0.2)} />
        <text x="258" y="488" fill={ca(c, 0.18)} fontSize="4" fontFamily="monospace">patterns feed fingerprint engine</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 3: BEHAVIORAL FINGERPRINT RADAR
            A unique radar/spider chart showing YOUR specific pattern
            across 8 behavioral dimensions -- like a psychological
            fingerprint that evolves over time
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="504" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="514" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 3</text>
          <text x="68" y="514" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Behavioral Fingerprint</text>
          <text x="240" y="514" fill={ca(c, 0.2)} fontSize="4.5" fontFamily="monospace">hover each axis for deep breakdown</text>

          <rect x="24" y="524" width="432" height="220" rx="8" fill={ca(c, 0.018)} stroke={ca(c, 0.08)} strokeWidth="0.8" />

          {/* ── SPIDER/RADAR CHART ── */}
          {(() => {
            const cx = 178, cy = 640, maxR = 72
            const axes = [
              { label: "Discipline", angle: 0, value: 0.85, color: emo.disciplined, detail: "You follow your plan 85% of the time" },
              { label: "Patience", angle: 45, value: 0.6, color: emo.calm, detail: "You exit early on 40% of winners" },
              { label: "Risk Mgmt", angle: 90, value: 0.78, color: emo.focused, detail: "Position sizing correct 78% of trades" },
              { label: "Emotional\nControl", angle: 135, value: 0.45, color: emo.anxious, detail: "Emotional decisions in 55% of losses" },
              { label: "Timing", angle: 180, value: 0.72, color: emo.calm, detail: "Entry timing within optimal zone 72%" },
              { label: "Adaptability", angle: 225, value: 0.55, color: emo.neutral, detail: "Slow to adapt when conditions change" },
              { label: "Consistency", angle: 270, value: 0.68, color: emo.focused, detail: "Process consistency at 68% this month" },
              { label: "Objectivity", angle: 315, value: 0.5, color: emo.anxious, detail: "Confirmation bias detected in 50% of analysis" },
            ]

            const toXY = (angle: number, r: number) => {
              const rad = (angle - 90) * Math.PI / 180
              return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
            }

            return (
              <g>
                {/* Concentric rings */}
                {[0.25, 0.5, 0.75, 1].map((ring, i) => {
                  const pts = axes.map(a => toXY(a.angle, maxR * ring))
                  return (
                    <polygon key={`ring-${i}`} points={pts.map(p => `${p.x},${p.y}`).join(" ")}
                      fill="none" stroke={ca(c, 0.06 + i * 0.02)} strokeWidth="0.4" strokeDasharray={i < 3 ? "2 2" : "none"} />
                  )
                })}

                {/* Ring labels */}
                <text x={cx + 4} y={cy - maxR * 0.25 - 2} fill={ca(c, 0.15)} fontSize="3.5" fontFamily="monospace">25%</text>
                <text x={cx + 4} y={cy - maxR * 0.5 - 2} fill={ca(c, 0.15)} fontSize="3.5" fontFamily="monospace">50%</text>
                <text x={cx + 4} y={cy - maxR * 0.75 - 2} fill={ca(c, 0.15)} fontSize="3.5" fontFamily="monospace">75%</text>
                <text x={cx + 4} y={cy - maxR - 2} fill={ca(c, 0.2)} fontSize="3.5" fontFamily="monospace">100%</text>

                {/* Axis lines */}
                {axes.map((a, i) => {
                  const end = toXY(a.angle, maxR)
                  return <line key={`axis-${i}`} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={ca(c, 0.06)} strokeWidth="0.4" />
                })}

                {/* VALUE POLYGON -- your fingerprint shape */}
                <polygon
                  points={axes.map(a => { const p = toXY(a.angle, maxR * a.value); return `${p.x},${p.y}` }).join(" ")}
                  fill={ca(c, 0.06)} stroke={ca(c, 0.35)} strokeWidth="1" strokeLinejoin="round">
                  <animate attributeName="fill-opacity" values="0.04;0.08;0.04" dur="4s" repeatCount="indefinite" />
                </polygon>

                {/* Value dots on each axis + labels */}
                {axes.map((a, i) => {
                  const p = toXY(a.angle, maxR * a.value)
                  const labelP = toXY(a.angle, maxR + 18)
                  const aId = `axis-${i}`
                  return (
                    <g key={aId} onMouseEnter={() => setHoveredNode(aId)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
                      {/* Value dot */}
                      <circle cx={p.x} cy={p.y} r={isH(aId) ? 5 : 3} fill={isH(aId) ? a.color : ca(a.color, 0.5)} stroke={a.color} strokeWidth={isH(aId) ? 1 : 0.5}
                        style={{ transition: "all 0.25s ease" }}>
                        <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                      </circle>
                      {isH(aId) && <circle cx={p.x} cy={p.y} r="10" fill="none" stroke={ca(a.color, 0.2)} strokeWidth="0.5">
                        <animate attributeName="r" values="8;15;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>}

                      {/* Axis label */}
                      <text x={labelP.x} y={labelP.y} textAnchor="middle" fill={isH(aId) ? ca(a.color, 0.9) : ca(c, 0.35)} fontSize={isH(aId) ? "5.5" : "5"} fontFamily="monospace" fontWeight={isH(aId) ? "900" : "700"}
                        style={{ transition: "all 0.2s ease" }}>
                        {a.label.split("\n").map((line, li) => (
                          <tspan key={li} x={labelP.x} dy={li === 0 ? 0 : 10}>{line}</tspan>
                        ))}
                      </text>

                      {/* Value percentage near dot */}
                      {isH(aId) && <text x={p.x + 8} y={p.y - 6} fill={ca(a.color, 0.85)} fontSize="6" fontFamily="monospace" fontWeight="900">{Math.round(a.value * 100)}%</text>}
                    </g>
                  )
                })}

                {/* Center label */}
                <text x={cx} y={cy - 3} textAnchor="middle" fill={ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="800">YOUR</text>
                <text x={cx} y={cy + 5} textAnchor="middle" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700">PROFILE</text>
              </g>
            )
          })()}

          {/* ── RIGHT PANEL: Hover Detail + Overall Scores ── */}
          <g>
            <rect x="280" y="540" width="166" height="195" rx="6" fill={ca(c, 0.025)} stroke={ca(c, 0.06)} strokeWidth="0.6" />
            <text x="363" y="555" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800" letterSpacing="0.5">FINGERPRINT ANALYSIS</text>
            <line x1="290" y1="560" x2="436" y2="560" stroke={ca(c, 0.06)} strokeWidth="0.4" />

            {/* Dynamic hover detail */}
            {hoveredNode && hoveredNode.startsWith("axis-") ? (
              <g>
                {(() => {
                  const axes = [
                    { label: "Discipline", value: 0.85, color: emo.disciplined, detail: "You follow your plan 85% of the time. Your best days are Mondays." },
                    { label: "Patience", value: 0.6, color: emo.calm, detail: "You exit early on 40% of winners. Avg hold: 2.3h vs optimal 4.1h." },
                    { label: "Risk Management", value: 0.78, color: emo.focused, detail: "Position sizing correct on 78% of trades. 22% are oversized." },
                    { label: "Emotional Control", value: 0.45, color: emo.anxious, detail: "Emotional decisions drive 55% of your losses. Key trigger: consecutive losses." },
                    { label: "Timing", value: 0.72, color: emo.calm, detail: "Entry timing within optimal zone 72%. Worst during afternoon session." },
                    { label: "Adaptability", value: 0.55, color: emo.neutral, detail: "Slow to adapt when market regime shifts. 3-day lag on average." },
                    { label: "Consistency", value: 0.68, color: emo.focused, detail: "Process consistency at 68%. Drops to 42% after a losing streak." },
                    { label: "Objectivity", value: 0.5, color: emo.anxious, detail: "Confirmation bias in 50% of analysis. You seek data that agrees." },
                  ]
                  const idx = parseInt(hoveredNode.split("-")[1])
                  const a = axes[idx]
                  return (
                    <g>
                      <text x="363" y="576" textAnchor="middle" fill={ca(a.color, 0.85)} fontSize="7" fontFamily="monospace" fontWeight="900">{a.label}</text>

                      {/* Score bar */}
                      <rect x="296" y="584" width="134" height="8" rx="4" fill={ca(c, 0.04)} />
                      <rect x="296" y="584" width={134 * a.value} height="8" rx="4" fill={ca(a.color, 0.35)}>
                        <animate attributeName="width" values={`${134 * a.value - 5};${134 * a.value + 3};${134 * a.value - 5}`} dur="2s" repeatCount="indefinite" />
                      </rect>
                      <text x="436" y="591" textAnchor="end" fill={ca(a.color, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">{Math.round(a.value * 100)}%</text>

                      {/* Detail text wrapping */}
                      {a.detail.match(/.{1,40}(\s|$)/g)?.map((line, li) => (
                        <text key={li} x="296" y={606 + li * 12} fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="600">{line.trim()}</text>
                      ))}

                      {/* Trend indicator */}
                      <text x="296" y="650" fill={ca(c, 0.3)} fontSize="4.5" fontFamily="monospace" fontWeight="700">TREND vs LAST MONTH:</text>
                      <text x="410" y="650" fill={a.value > 0.6 ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)"} fontSize="5.5" fontFamily="monospace" fontWeight="900">{a.value > 0.6 ? "+5%" : "-3%"}</text>
                    </g>
                  )
                })()}
              </g>
            ) : (
              <g>
                {/* Default: overall summary */}
                <text x="363" y="578" textAnchor="middle" fill={ca(c, 0.55)} fontSize="6" fontFamily="monospace" fontWeight="800">Overall Profile Score</text>

                {/* Big score */}
                <text x="363" y="610" textAnchor="middle" fill={ca(c, 0.9)} fontSize="20" fontFamily="monospace" fontWeight="900" filter="url(#jr-glow)">64</text>
                <text x="363" y="622" textAnchor="middle" fill={ca(c, 0.35)} fontSize="5" fontFamily="monospace">/100</text>

                {/* Strengths + weaknesses */}
                <text x="296" y="640" fill={ca(emo.disciplined, 0.6)} fontSize="4.5" fontFamily="monospace" fontWeight="700">STRENGTH: Discipline (85%)</text>
                <text x="296" y="652" fill={ca(emo.disciplined, 0.5)} fontSize="4.5" fontFamily="monospace" fontWeight="700">STRENGTH: Risk Mgmt (78%)</text>
                <text x="296" y="668" fill={ca(emo.fearful, 0.6)} fontSize="4.5" fontFamily="monospace" fontWeight="700">WEAKNESS: Emotional Ctrl (45%)</text>
                <text x="296" y="680" fill={ca(emo.fearful, 0.5)} fontSize="4.5" fontFamily="monospace" fontWeight="700">WEAKNESS: Objectivity (50%)</text>

                <text x="363" y="700" textAnchor="middle" fill={ca(c, 0.2)} fontSize="4" fontFamily="monospace">Hover any axis for deep breakdown</text>
              </g>
            )}
          </g>
        </g>

        {/* ═══ CONNECTOR: Stage 3 -> Stage 4 ═══ */}
        <line x1="240" y1="748" x2="240" y2="772" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,770 240,776 243,770" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 4: PATTERN RECURRENCE DETECTOR
            Shows what keeps happening -- the loops, the cycles,
            the repeated behaviors the trader can't see themselves
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="778" width="38" height="14" rx="3" fill={ca(c, 0.08)} />
          <text x="35" y="788" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 4</text>
          <text x="68" y="788" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Recurring Pattern Detector</text>

          <rect x="24" y="798" width="432" height="118" rx="8" fill={ca(c, 0.018)} stroke={ca(c, 0.08)} strokeWidth="0.8" />

          {/* ── PATTERN CARDS -- Each is a detected behavioral loop ── */}
          {[
            {
              id: "pat-0", icon: "LOOP", severity: "HIGH", color: emo.fearful, occurrences: 7,
              title: "Revenge Trading After Losses",
              desc: "After a loss > 20 pips, you enter another trade within 8 minutes 70% of the time.",
              suggestion: "Add a 30-minute cooldown rule after any loss exceeding 15 pips.",
            },
            {
              id: "pat-1", icon: "CYCLE", severity: "MED", color: emo.anxious, occurrences: 5,
              title: "Early Exit on Winners",
              desc: "You close winning trades at 40% of target on average. Fear of giving back profit.",
              suggestion: "Use partial close: 50% at TP1, trail the rest to TP2.",
            },
            {
              id: "pat-2", icon: "DRIFT", severity: "LOW", color: emo.neutral, occurrences: 3,
              title: "Afternoon Discipline Drop",
              desc: "Win rate drops from 68% to 41% after 14:00. Fatigue-related pattern.",
              suggestion: "Consider ending your session by 14:00 or taking a 30min break.",
            },
          ].map((pat, i) => (
            <g key={pat.id} onMouseEnter={() => setHoveredNode(pat.id)} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="36" y={808 + i * 35} width={isH(pat.id) ? 412 : 408} height={isH(pat.id) ? 32 : 28} rx="5"
                fill={isH(pat.id) ? ca(pat.color, 0.06) : ca(c, 0.025)}
                stroke={isH(pat.id) ? ca(pat.color, 0.3) : ca(c, 0.06)}
                strokeWidth={isH(pat.id) ? 1 : 0.5}
                style={{ transition: "all 0.25s ease", cursor: "pointer" }} />

              {/* Severity badge */}
              <rect x="42" y={812 + i * 35} width="28" height="11" rx="5.5" fill={ca(pat.color, 0.15)} />
              <text x="56" y={820 + i * 35} textAnchor="middle" fill={ca(pat.color, 0.8)} fontSize="4.5" fontFamily="monospace" fontWeight="900">{pat.severity}</text>

              {/* Occurrence count */}
              <text x="78" y={820 + i * 35} fill={ca(c, 0.4)} fontSize="4" fontFamily="monospace" fontWeight="700">{pat.occurrences}x</text>

              {/* Title */}
              <text x="100" y={isH(pat.id) ? 820 + i * 35 : 820 + i * 35} fill={isH(pat.id) ? ca(pat.color, 0.85) : ca(c, 0.6)} fontSize={isH(pat.id) ? "6" : "5.5"} fontFamily="monospace" fontWeight="900"
                style={{ transition: "all 0.2s ease" }}>{pat.title}</text>

              {/* Description on hover */}
              {isH(pat.id) && (
                <text x="100" y={832 + i * 35} fill={ca(c, 0.4)} fontSize="4.5" fontFamily="monospace" fontWeight="600">{pat.desc}</text>
              )}

              {/* Recurring loop icon */}
              <g>
                <circle cx={430} cy={818 + i * 35} r="6" fill="none" stroke={isH(pat.id) ? ca(pat.color, 0.35) : ca(c, 0.1)} strokeWidth="0.8" strokeDasharray="3 2">
                  {isH(pat.id) && <animateTransform attributeName="transform" type="rotate" values={`0 430 ${818 + i * 35};360 430 ${818 + i * 35}`} dur="3s" repeatCount="indefinite" />}
                </circle>
                <polygon points={`428,${812 + i * 35} 430,${810 + i * 35} 432,${812 + i * 35}`} fill={isH(pat.id) ? ca(pat.color, 0.4) : ca(c, 0.1)} />
              </g>
            </g>
          ))}
        </g>

        {/* ═══ CONNECTOR: Stage 4 -> Stage 5 ═══ */}
        <line x1="240" y1="920" x2="240" y2="944" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,942 240,948 243,942" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 5: MIRROR OUTPUT -- What the AI Sees That You Don't
            The final reflection. Personalized, cumulative, honest.
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="950" width="38" height="14" rx="3" fill={ca(c, 0.1)} />
          <text x="35" y="960" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 5</text>
          <text x="68" y="960" fill={ca(c, 0.45)} fontSize="6" fontFamily="monospace" fontWeight="700">Mirror Reflection Output</text>

          <g onMouseEnter={() => setHoveredNode("mirror")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="24" y="970" width="432" height="102" rx="8" fill={isH("mirror") ? ca(c, 0.05) : ca(c, 0.03)} stroke={isH("mirror") ? ca(c, 0.25) : ca(c, 0.15)} strokeWidth={isH("mirror") ? 1.2 : 1}
              style={{ transition: "all 0.3s ease" }}>
              <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
            </rect>
            {isH("mirror") && <rect x="20" y="966" width="440" height="110" rx="10" fill="none" stroke={ca(c, 0.1)} strokeWidth="0.5" strokeDasharray="4 3" />}

            {/* Mirror header */}
            <text x="240" y="988" textAnchor="middle" fill={ca(c, 0.5)} fontSize="5.5" fontFamily="monospace" fontWeight="700" letterSpacing="1">WHAT THE MIRROR SEES</text>

            {/* Three reflection cards */}
            {[
              { label: "BLIND SPOT", text: "You overtrade after 14:00", icon: "eye", color: emo.fearful, x: 80 },
              { label: "STRENGTH", text: "Morning discipline is elite", icon: "shield", color: emo.disciplined, x: 240 },
              { label: "NEXT STEP", text: "Add a cooldown rule post-loss", icon: "arrow", color: emo.calm, x: 400 },
            ].map((ref, i) => (
              <g key={`ref-${i}`}>
                <rect x={ref.x - 64} y="996" width="128" height="32" rx="6" fill={ca(ref.color, 0.06)} stroke={ca(ref.color, 0.15)} strokeWidth="0.6">
                  <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </rect>
                <text x={ref.x} y="1008" textAnchor="middle" fill={ca(ref.color, 0.55)} fontSize="4.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.3">{ref.label}</text>
                <text x={ref.x} y="1022" textAnchor="middle" fill={ca(ref.color, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">{ref.text}</text>
              </g>
            ))}

            {/* Growth trajectory line */}
            <line x1="60" y1="1042" x2="420" y2="1042" stroke={ca(c, 0.06)} strokeWidth="0.5" />
            <text x="240" y="1052" textAnchor="middle" fill={ca(c, 0.3)} fontSize="4.5" fontFamily="monospace" fontWeight="700">Growth trajectory: +12% behavioral improvement this month</text>

            {/* Animated growth spark */}
            <circle r="2" fill={ca(emo.disciplined, 0.6)} filter="url(#jr-glow)" opacity="0">
              <animateMotion dur="3s" repeatCount="indefinite" path="M60,1042 L240,1040 L420,1036" />
              <animate attributeName="opacity" values="0;0.6;0.8;0" dur="3s" repeatCount="indefinite" />
            </circle>

            {isH("mirror") && (
              <text x="240" y="1064" textAnchor="middle" fill={ca(c, 0.25)} fontSize="4" fontFamily="monospace">The mirror reflects what you can not see about yourself. Every session adds depth.</text>
            )}
          </g>
        </g>

        {/* ═══ FULL-PIPELINE PARTICLE -- the consciousness thread ═══ */}
        <circle r="2" fill={ca(c, 0.6)} filter="url(#jr-glow)" opacity="0">
          <animateMotion dur="12s" repeatCount="indefinite" path="M240,54 L68,120 L240,250 L240,500 L178,640 L240,776 L240,948 L240,1072" />
          <animate attributeName="opacity" values="0;0.3;0.5;0.7;0.4;0.6;0.3;0" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle r="1.5" fill={ca(emo.disciplined, 0.5)} filter="url(#jr-soft)" opacity="0">
          <animateMotion dur="15s" repeatCount="indefinite" path="M68,94 L240,250 L178,640 L240,780 L240,1060" />
          <animate attributeName="opacity" values="0;0.2;0.4;0.5;0.3;0.1;0" dur="15s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}


/* =================================================================
   4. STRATEGY REFINE -- #10b981 (green)
   The Architect. Deconstructs your trading strategy like a blueprint,
   examines every rule, stress-tests your edge, identifies structural
   weaknesses, and rebuilds your plan with precision engineering.
   
   Unique visual language: BLUEPRINT / SCHEMATIC metaphor.
   - Strategy blueprint decomposition (entry/exit/risk rules)
   - Rule circuit board (interconnected rule nodes)
   - Edge leak detector (where your edge erodes)
   - Rule stress-test bench (each rule under pressure)
   - Refined strategy output (the rebuilt plan)
   
   Design: Engineering precision. Grid-heavy, schematic lines,
   measurement annotations, structural load indicators.
   Totally different from mirror (organic), tree (branching),
   and pipeline (linear flow).
   ================================================================= */
export function StrategyRefineSVG() {
  const c = "#10b981"
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const isH = (id: string) => hoveredNode === id

  /* Secondary palette */
  const pass = "#10b981"
  const warn = "#f59e0b"
  const fail = "#ef4444"
  const info = "#3b82f6"
  const dim = "#6b7280"

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: `linear-gradient(180deg, ${ca(c, 0.02)}, transparent)` }}>
      <svg viewBox="0 0 480 1100" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 0: BLUEPRINT BACKGROUND -- Engineering grid
            ═══════════════════════════════════════════════════════════════ */}
        <defs>
          <pattern id="sr-grid-sm" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={ca(c, 0.015)} strokeWidth="0.3" />
          </pattern>
          <pattern id="sr-grid-lg" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={ca(c, 0.03)} strokeWidth="0.5" />
          </pattern>
          <linearGradient id="sr-flow-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="50%" stopColor={ca(c, 0.45)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
          <linearGradient id="sr-flow-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="50%" stopColor={ca(c, 0.4)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
          <filter id="sr-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sr-glow-lg">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Crosshair marker for measurement points */}
          <marker id="sr-crosshair" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6">
            <circle cx="3" cy="3" r="2" fill="none" stroke={ca(c, 0.3)} strokeWidth="0.5" />
            <line x1="0" y1="3" x2="6" y2="3" stroke={ca(c, 0.2)} strokeWidth="0.3" />
            <line x1="3" y1="0" x2="3" y2="6" stroke={ca(c, 0.2)} strokeWidth="0.3" />
          </marker>
        </defs>
        <rect width="480" height="1100" fill="url(#sr-grid-sm)" />
        <rect width="480" height="1100" fill="url(#sr-grid-lg)" />

        {/* Blueprint corner markers */}
        {[[8, 8], [472, 8], [8, 1092], [472, 1092]].map(([x, y], i) => (
          <g key={`corner-${i}`}>
            <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={ca(c, 0.12)} strokeWidth="0.5" />
            <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke={ca(c, 0.12)} strokeWidth="0.5" />
          </g>
        ))}

        {/* ═══════════════════════════════════════════════════════════════
            TITLE BLOCK -- Blueprint title cartouche
            ═══════════════════════════════════════════════════════════════ */}
        <rect x="110" y="10" width="260" height="36" rx="2" fill={ca(c, 0.025)} stroke={ca(c, 0.12)} strokeWidth="0.6" />
        <line x1="110" y1="24" x2="370" y2="24" stroke={ca(c, 0.06)} strokeWidth="0.4" />
        <text x="240" y="22" textAnchor="middle" fill={ca(c, 0.65)} fontSize="8" fontFamily="monospace" fontWeight="900" letterSpacing="3">STRATEGY ARCHITECT</text>
        <text x="240" y="40" textAnchor="middle" fill={ca(c, 0.3)} fontSize="5" fontFamily="monospace" letterSpacing="1.5">TRADING PLAN BLUEPRINT ANALYSIS ENGINE</text>
        {/* Blueprint revision number */}
        <text x="365" y="40" textAnchor="end" fill={ca(c, 0.15)} fontSize="4" fontFamily="monospace">REV 3.2</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 1: STRATEGY DECOMPOSITION
            Breaks your strategy into its fundamental rule components
            Displayed as a schematic exploded view
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="56" width="38" height="14" rx="2" fill={ca(c, 0.08)} stroke={ca(c, 0.15)} strokeWidth="0.4" />
          <text x="35" y="66" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 1</text>
          <text x="68" y="66" fill={ca(c, 0.45)} fontSize="6" fontFamily="monospace" fontWeight="700">Strategy Decomposition</text>
          <text x="240" y="66" fill={ca(c, 0.2)} fontSize="4.5" fontFamily="monospace">hover each module to inspect</text>

          <rect x="24" y="76" width="432" height="175" rx="4" fill={ca(c, 0.012)} stroke={ca(c, 0.06)} strokeWidth="0.6" />

          {/* ── CENTRAL STRATEGY CORE ── */}
          <g onMouseEnter={() => setHoveredNode("core")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="180" y="86" width="120" height="34" rx="4" fill={isH("core") ? ca(c, 0.1) : ca(c, 0.04)} stroke={isH("core") ? ca(c, 0.4) : ca(c, 0.2)} strokeWidth={isH("core") ? 1.2 : 0.8}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }}>
              <animate attributeName="stroke-opacity" values="0.15;0.3;0.15" dur="3s" repeatCount="indefinite" />
            </rect>
            {isH("core") && <rect x="176" y="82" width="128" height="42" rx="6" fill="none" stroke={ca(c, 0.15)} strokeWidth="0.5" strokeDasharray="3 2" />}
            <text x="240" y="100" textAnchor="middle" fill={ca(c, 0.85)} fontSize="7" fontFamily="monospace" fontWeight="900">YOUR STRATEGY</text>
            <text x="240" y="112" textAnchor="middle" fill={ca(c, 0.4)} fontSize="5" fontFamily="monospace">EUR/USD Breakout System</text>
          </g>

          {/* ── DECOMPOSED MODULES radiating out ── */}
          {/* Connection lines from core to modules */}
          <line x1="180" y1="103" x2="130" y2="103" stroke={ca(c, 0.1)} strokeWidth="0.8" strokeDasharray="3 2" />
          <line x1="300" y1="103" x2="350" y2="103" stroke={ca(c, 0.1)} strokeWidth="0.8" strokeDasharray="3 2" />
          <line x1="210" y1="120" x2="80" y2="150" stroke={ca(c, 0.08)} strokeWidth="0.6" strokeDasharray="2 2" />
          <line x1="240" y1="120" x2="240" y2="150" stroke={ca(c, 0.08)} strokeWidth="0.6" strokeDasharray="2 2" />
          <line x1="270" y1="120" x2="400" y2="150" stroke={ca(c, 0.08)} strokeWidth="0.6" strokeDasharray="2 2" />

          {/* MODULE: Entry Rules */}
          <g onMouseEnter={() => setHoveredNode("entry")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="32" y="88" width="95" height={isH("entry") ? 54 : 44} rx="3" fill={isH("entry") ? ca(info, 0.06) : ca(c, 0.02)} stroke={isH("entry") ? ca(info, 0.35) : ca(c, 0.08)} strokeWidth={isH("entry") ? 1 : 0.6}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            <rect x="36" y="92" width="46" height="10" rx="2" fill={ca(info, 0.1)} />
            <text x="59" y="100" textAnchor="middle" fill={ca(info, 0.7)} fontSize="5" fontFamily="monospace" fontWeight="900">ENTRY</text>
            <text x="40" y="114" fill={isH("entry") ? ca(c, 0.6) : ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="600">Break of structure</text>
            <text x="40" y="124" fill={isH("entry") ? ca(c, 0.55) : ca(c, 0.3)} fontSize="4.5" fontFamily="monospace" fontWeight="600">+ OB retest</text>
            {isH("entry") && (
              <g>
                <text x="40" y="134" fill={ca(c, 0.45)} fontSize="4" fontFamily="monospace">+ London session only</text>
                <rect x="86" y="92" width="32" height="10" rx="5" fill={ca(pass, 0.1)} />
                <text x="102" y="100" textAnchor="middle" fill={ca(pass, 0.7)} fontSize="4" fontFamily="monospace" fontWeight="800">4 rules</text>
              </g>
            )}
          </g>

          {/* MODULE: Exit Rules */}
          <g onMouseEnter={() => setHoveredNode("exit")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="353" y="88" width="95" height={isH("exit") ? 54 : 44} rx="3" fill={isH("exit") ? ca(warn, 0.06) : ca(c, 0.02)} stroke={isH("exit") ? ca(warn, 0.35) : ca(c, 0.08)} strokeWidth={isH("exit") ? 1 : 0.6}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            <rect x="357" y="92" width="40" height="10" rx="2" fill={ca(warn, 0.1)} />
            <text x="377" y="100" textAnchor="middle" fill={ca(warn, 0.7)} fontSize="5" fontFamily="monospace" fontWeight="900">EXIT</text>
            <text x="361" y="114" fill={isH("exit") ? ca(c, 0.6) : ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="600">TP1: 1:1.5 R:R</text>
            <text x="361" y="124" fill={isH("exit") ? ca(c, 0.55) : ca(c, 0.3)} fontSize="4.5" fontFamily="monospace" fontWeight="600">TP2: 1:3 (trail)</text>
            {isH("exit") && (
              <g>
                <text x="361" y="134" fill={ca(c, 0.45)} fontSize="4" fontFamily="monospace">Time-based: close by NY close</text>
                <rect x="407" y="92" width="32" height="10" rx="5" fill={ca(warn, 0.1)} />
                <text x="423" y="100" textAnchor="middle" fill={ca(warn, 0.7)} fontSize="4" fontFamily="monospace" fontWeight="800">3 rules</text>
              </g>
            )}
          </g>

          {/* MODULE: Risk Management */}
          <g onMouseEnter={() => setHoveredNode("risk")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="32" y="148" width="120" height={isH("risk") ? 48 : 38} rx="3" fill={isH("risk") ? ca(fail, 0.06) : ca(c, 0.02)} stroke={isH("risk") ? ca(fail, 0.3) : ca(c, 0.08)} strokeWidth={isH("risk") ? 1 : 0.6}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            <rect x="36" y="152" width="78" height="10" rx="2" fill={ca(fail, 0.08)} />
            <text x="75" y="160" textAnchor="middle" fill={ca(fail, 0.65)} fontSize="5" fontFamily="monospace" fontWeight="900">RISK MANAGEMENT</text>
            <text x="40" y="175" fill={isH("risk") ? ca(c, 0.6) : ca(c, 0.35)} fontSize="5" fontFamily="monospace" fontWeight="700">1% per trade | 3% daily max</text>
            {isH("risk") && (
              <text x="40" y="187" fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace">Max 2 concurrent positions, SL mandatory</text>
            )}
          </g>

          {/* MODULE: Filters / Conditions */}
          <g onMouseEnter={() => setHoveredNode("filters")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="178" y="148" width="124" height={isH("filters") ? 48 : 38} rx="3" fill={isH("filters") ? ca(c, 0.06) : ca(c, 0.02)} stroke={isH("filters") ? ca(c, 0.25) : ca(c, 0.08)} strokeWidth={isH("filters") ? 1 : 0.6}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            <rect x="182" y="152" width="50" height="10" rx="2" fill={ca(c, 0.08)} />
            <text x="207" y="160" textAnchor="middle" fill={ca(c, 0.6)} fontSize="5" fontFamily="monospace" fontWeight="900">FILTERS</text>
            <text x="186" y="175" fill={isH("filters") ? ca(c, 0.6) : ca(c, 0.35)} fontSize="5" fontFamily="monospace" fontWeight="700">No news 30m | Trend aligned</text>
            {isH("filters") && (
              <text x="186" y="187" fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace">ADR above 60 pips, no Friday entries</text>
            )}
          </g>

          {/* MODULE: Timeframe */}
          <g onMouseEnter={() => setHoveredNode("tf")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="328" y="148" width="120" height={isH("tf") ? 48 : 38} rx="3" fill={isH("tf") ? ca(info, 0.06) : ca(c, 0.02)} stroke={isH("tf") ? ca(info, 0.3) : ca(c, 0.08)} strokeWidth={isH("tf") ? 1 : 0.6}
              style={{ transition: "all 0.3s ease", cursor: "pointer" }} />
            <rect x="332" y="152" width="56" height="10" rx="2" fill={ca(info, 0.08)} />
            <text x="360" y="160" textAnchor="middle" fill={ca(info, 0.6)} fontSize="5" fontFamily="monospace" fontWeight="900">TIMEFRAME</text>
            <text x="336" y="175" fill={isH("tf") ? ca(c, 0.6) : ca(c, 0.35)} fontSize="5" fontFamily="monospace" fontWeight="700">H4 bias | M15 entry</text>
            {isH("tf") && (
              <text x="336" y="187" fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace">D1 trend context | H1 structure</text>
            )}
          </g>

          {/* Blueprint measurement annotations */}
          <line x1="32" y1="200" x2="448" y2="200" stroke={ca(c, 0.06)} strokeWidth="0.3" strokeDasharray="1 3" />
          <text x="240" y="210" textAnchor="middle" fill={ca(c, 0.15)} fontSize="3.5" fontFamily="monospace">14 total rules decomposed across 5 modules</text>

          {/* Animated scan line */}
          <line x1="24" y1="86" x2="456" y2="86" stroke={ca(c, 0.15)} strokeWidth="0.5" opacity="0">
            <animate attributeName="y1" values="86;240;86" dur="5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="86;240;86" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.3;0" dur="5s" repeatCount="indefinite" />
          </line>
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="254" x2="240" y2="278" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,276 240,282 243,276" fill={ca(c, 0.2)} />
        <text x="258" y="270" fill={ca(c, 0.18)} fontSize="4" fontFamily="monospace">rules enter stress-test bench</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 2: RULE STRESS-TEST BENCH
            Each rule is tested against your actual trading data.
            Shows pass/fail/weak with evidence. Displayed as a
            circuit-board test bench with LED-style indicators.
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="286" width="38" height="14" rx="2" fill={ca(c, 0.08)} stroke={ca(c, 0.15)} strokeWidth="0.4" />
          <text x="35" y="296" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 2</text>
          <text x="68" y="296" fill={ca(c, 0.45)} fontSize="6" fontFamily="monospace" fontWeight="700">Rule Stress-Test Bench</text>

          <rect x="24" y="306" width="432" height="220" rx="4" fill={ca(c, 0.012)} stroke={ca(c, 0.06)} strokeWidth="0.6" />

          {/* Column headers */}
          <rect x="32" y="312" width="416" height="16" rx="2" fill={ca(c, 0.03)} />
          <text x="52" y="323" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800">RULE</text>
          <text x="180" y="323" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800">ADHERENCE</text>
          <text x="260" y="323" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800">WIN RATE</text>
          <text x="330" y="323" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800">IMPACT</text>
          <text x="410" y="323" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800">STATUS</text>

          {/* ── RULE ROWS -- Each is a testable component ── */}
          {[
            { id: "r1", rule: "BOS + OB Retest Entry", adhere: 92, winWhen: 71, winWithout: 38, impact: "+33% edge", status: "PASS", color: pass, detail: "Your strongest rule. 92% adherence drives 71% win rate. Without OB retest, win rate drops to 38%." },
            { id: "r2", rule: "London Session Only", adhere: 78, winWhen: 68, winWithout: 52, impact: "+16% edge", status: "PASS", color: pass, detail: "Solid filter. 22% of trades violate this rule, and those trades perform significantly worse." },
            { id: "r3", rule: "1% Risk Per Trade", adhere: 65, winWhen: 64, winWithout: 61, impact: "+3% edge", status: "WEAK", color: warn, detail: "Frequently violated. 35% of trades exceed 1% risk. Sizing inconsistency is your biggest leak." },
            { id: "r4", rule: "H4 Trend Alignment", adhere: 84, winWhen: 72, winWithout: 44, impact: "+28% edge", status: "PASS", color: pass, detail: "Critical rule. Counter-trend trades have 44% win rate vs 72% with trend. Keep this rule strict." },
            { id: "r5", rule: "No News Within 30m", adhere: 56, winWhen: 66, winWithout: 59, impact: "+7% edge", status: "WEAK", color: warn, detail: "Your most violated rule. 44% of trades ignore this. Marginal edge impact but increases volatility exposure." },
            { id: "r6", rule: "Max 2 Concurrent", adhere: 88, winWhen: 67, winWithout: 41, impact: "+26% edge", status: "PASS", color: pass, detail: "When you run 3+ positions, drawdowns increase 3x. Correlation risk is the hidden danger." },
            { id: "r7", rule: "SL Placed Before Entry", adhere: 95, winWhen: 65, winWithout: 22, impact: "+43% edge", status: "PASS", color: pass, detail: "Non-negotiable. The 5% without SL have catastrophic outcomes. This rule protects everything." },
            { id: "r8", rule: "TP2 Trailing System", adhere: 42, winWhen: 74, winWithout: 58, impact: "+16% edge", status: "FAIL", color: fail, detail: "Your worst adherence. 58% of trades close manually before TP2 trail activates. Leaving profit on the table." },
          ].map((r, i) => {
            const rowY = 336 + i * 23
            return (
              <g key={r.id} onMouseEnter={() => setHoveredNode(r.id)} onMouseLeave={() => setHoveredNode(null)}>
                <rect x="32" y={rowY - 2} width="416" height={isH(r.id) ? 22 : 19} rx="2"
                  fill={isH(r.id) ? ca(r.color, 0.06) : (i % 2 === 0 ? ca(c, 0.01) : "transparent")}
                  stroke={isH(r.id) ? ca(r.color, 0.25) : "transparent"} strokeWidth={isH(r.id) ? 0.6 : 0}
                  style={{ transition: "all 0.2s ease", cursor: "pointer" }} />

                {/* Rule name */}
                <text x="40" y={rowY + 10} fill={isH(r.id) ? ca(c, 0.85) : ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight={isH(r.id) ? "900" : "700"}
                  style={{ transition: "all 0.2s ease" }}>{r.rule}</text>

                {/* Adherence bar */}
                <rect x="174" y={rowY + 3} width="60" height="6" rx="3" fill={ca(c, 0.04)} />
                <rect x="174" y={rowY + 3} width={r.adhere * 0.6} height="6" rx="3" fill={ca(r.adhere > 80 ? pass : r.adhere > 60 ? warn : fail, 0.4)}>
                  {isH(r.id) && <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />}
                </rect>
                <text x="238" y={rowY + 10} fill={ca(c, 0.5)} fontSize="4.5" fontFamily="monospace" fontWeight="700">{r.adhere}%</text>

                {/* Win rate comparison */}
                <text x="260" y={rowY + 10} fill={ca(pass, 0.6)} fontSize="5" fontFamily="monospace" fontWeight="700">{r.winWhen}%</text>
                <text x="278" y={rowY + 10} fill={ca(c, 0.2)} fontSize="4" fontFamily="monospace">vs</text>
                <text x="292" y={rowY + 10} fill={ca(fail, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="700">{r.winWithout}%</text>

                {/* Impact */}
                <text x="330" y={rowY + 10} fill={ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="700">{r.impact}</text>

                {/* Status LED */}
                <circle cx="410" cy={rowY + 7} r={isH(r.id) ? 4.5 : 3.5} fill={ca(r.color, isH(r.id) ? 0.5 : 0.3)} stroke={ca(r.color, 0.6)} strokeWidth="0.5"
                  style={{ transition: "all 0.2s ease" }}>
                  <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
                </circle>
                <text x="422" y={rowY + 10} fill={ca(r.color, 0.7)} fontSize="4.5" fontFamily="monospace" fontWeight="900">{r.status}</text>
              </g>
            )
          })}

          {/* ── HOVER DETAIL PANEL (appears below the table) ── */}
          {hoveredNode && ["r1","r2","r3","r4","r5","r6","r7","r8"].includes(hoveredNode) && (() => {
            const rules = [
              { rule: "BOS + OB Retest Entry", detail: "Your strongest rule. 92% adherence drives 71% win rate. Without OB retest, win rate drops to 38%.", color: pass },
              { rule: "London Session Only", detail: "Solid filter. 22% of trades violate this rule, and those trades perform significantly worse.", color: pass },
              { rule: "1% Risk Per Trade", detail: "Frequently violated. 35% of trades exceed 1% risk. Sizing inconsistency is your biggest leak.", color: warn },
              { rule: "H4 Trend Alignment", detail: "Critical rule. Counter-trend trades have 44% win rate vs 72% with trend.", color: pass },
              { rule: "No News Within 30m", detail: "Your most violated rule. 44% of trades ignore this. Marginal edge impact but increases vol.", color: warn },
              { rule: "Max 2 Concurrent", detail: "When you run 3+ positions, drawdowns increase 3x. Correlation risk is hidden danger.", color: pass },
              { rule: "SL Before Entry", detail: "Non-negotiable. The 5% without SL have catastrophic outcomes.", color: pass },
              { rule: "TP2 Trailing System", detail: "Your worst adherence. 58% close manually before trail activates. Profit left on table.", color: fail },
            ]
            const idx = parseInt(hoveredNode.slice(1)) - 1
            const r = rules[idx]
            return (
              <g>
                <rect x="32" y="504" width="416" height="16" rx="3" fill={ca(r.color, 0.04)} stroke={ca(r.color, 0.15)} strokeWidth="0.5" />
                <circle cx="42" cy="512" r="2.5" fill={ca(r.color, 0.5)} />
                <text x="52" y="515" fill={ca(c, 0.55)} fontSize="4.5" fontFamily="monospace" fontWeight="700">{r.detail}</text>
              </g>
            )
          })()}
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="530" x2="240" y2="554" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,552 240,558 243,552" fill={ca(c, 0.2)} />
        <text x="258" y="546" fill={ca(c, 0.18)} fontSize="4" fontFamily="monospace">test results flow to edge analysis</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 3: EDGE LEAK DETECTOR
            Shows where your strategy's edge is eroding.
            Visualized as a funnel/pipeline with pressure gauges.
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="562" width="38" height="14" rx="2" fill={ca(c, 0.08)} stroke={ca(c, 0.15)} strokeWidth="0.4" />
          <text x="35" y="572" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 3</text>
          <text x="68" y="572" fill={ca(c, 0.45)} fontSize="6" fontFamily="monospace" fontWeight="700">Edge Leak Detector</text>

          <rect x="24" y="582" width="432" height="185" rx="4" fill={ca(c, 0.012)} stroke={ca(c, 0.06)} strokeWidth="0.6" />

          {/* ── EDGE FUNNEL -- starts wide (theoretical) narrows (actual) ── */}
          <text x="240" y="598" textAnchor="middle" fill={ca(c, 0.35)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">EDGE EROSION PIPELINE</text>

          {/* Funnel stages */}
          {[
            { label: "THEORETICAL EDGE", value: "+18.4 pips/trade", width: 380, y: 610, color: pass, desc: "If you followed every rule perfectly" },
            { label: "After Risk Violations", value: "+14.1 pips/trade", width: 320, y: 640, color: pass, leak: "-4.3 pips", leakPct: "23%", desc: "Oversizing bleeds edge through larger losses" },
            { label: "After Timing Errors", value: "+11.8 pips/trade", width: 270, y: 670, color: warn, leak: "-2.3 pips", leakPct: "13%", desc: "Off-session and news trades reduce quality" },
            { label: "After Early Exits", value: "+8.2 pips/trade", width: 220, y: 700, color: warn, leak: "-3.6 pips", leakPct: "20%", desc: "Closing winners too early leaves 3.6 pips" },
            { label: "ACTUAL REALIZED", value: "+8.2 pips/trade", width: 170, y: 730, color: c, desc: "Your real captured edge after all leaks" },
          ].map((f, i) => {
            const fId = `funnel-${i}`
            const fX = 240 - f.width / 2
            return (
              <g key={fId} onMouseEnter={() => setHoveredNode(fId)} onMouseLeave={() => setHoveredNode(null)}>
                <rect x={fX} y={f.y} width={f.width} height="22" rx="3" fill={isH(fId) ? ca(f.color, 0.08) : ca(f.color, 0.03)} stroke={isH(fId) ? ca(f.color, 0.35) : ca(f.color, 0.12)} strokeWidth={isH(fId) ? 0.8 : 0.5}
                  style={{ transition: "all 0.25s ease", cursor: "pointer" }} />

                <text x={fX + 8} y={f.y + 14} fill={isH(fId) ? ca(c, 0.75) : ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800">{f.label}</text>
                <text x={fX + f.width - 8} y={f.y + 14} textAnchor="end" fill={ca(f.color, isH(fId) ? 0.9 : 0.6)} fontSize="6" fontFamily="monospace" fontWeight="900">{f.value}</text>

                {/* Leak indicator on right side */}
                {f.leak && (
                  <g>
                    <line x1={fX + f.width + 4} y1={f.y + 11} x2={fX + f.width + 24} y2={f.y + 11} stroke={ca(fail, 0.2)} strokeWidth="0.6" />
                    <text x={fX + f.width + 28} y={f.y + 14} fill={ca(fail, isH(fId) ? 0.7 : 0.4)} fontSize="5" fontFamily="monospace" fontWeight="800">{f.leak}</text>
                    <text x={fX + f.width + 28} y={f.y + 22} fill={ca(fail, 0.3)} fontSize="3.5" fontFamily="monospace">{f.leakPct} of total</text>
                  </g>
                )}

                {/* Hover description */}
                {isH(fId) && (
                  <text x={fX + 8} y={f.y + 32} fill={ca(c, 0.35)} fontSize="4" fontFamily="monospace">{f.desc}</text>
                )}

                {/* Connecting tapered lines to next level */}
                {i < 4 && (
                  <g>
                    <line x1={fX} y1={f.y + 22} x2={240 - ([320, 270, 220, 170, 120][i + 1] || 120) / 2} y2={f.y + 30} stroke={ca(c, 0.06)} strokeWidth="0.4" />
                    <line x1={fX + f.width} y1={f.y + 22} x2={240 + ([320, 270, 220, 170, 120][i + 1] || 120) / 2} y2={f.y + 30} stroke={ca(c, 0.06)} strokeWidth="0.4" />
                  </g>
                )}
              </g>
            )
          })}

          {/* ── EDGE RECOVERY POTENTIAL ── */}
          <g onMouseEnter={() => setHoveredNode("recovery")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="80" y="752" width="320" height="10" rx="2" fill={isH("recovery") ? ca(c, 0.06) : ca(c, 0.025)} stroke={isH("recovery") ? ca(c, 0.2) : ca(c, 0.08)} strokeWidth="0.5"
              style={{ transition: "all 0.2s ease", cursor: "pointer" }} />
            <text x="240" y="760" textAnchor="middle" fill={isH("recovery") ? ca(pass, 0.8) : ca(c, 0.4)} fontSize="5" fontFamily="monospace" fontWeight="900">RECOVERABLE EDGE: +10.2 pips/trade (55% more profit potential)</text>
          </g>
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="770" x2="240" y2="794" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,792 240,798 243,792" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 4: PRIORITY REPAIR QUEUE
            Ranked list of which rules to fix first for maximum
            edge recovery, with specific actionable recommendations
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="800" width="38" height="14" rx="2" fill={ca(c, 0.08)} stroke={ca(c, 0.15)} strokeWidth="0.4" />
          <text x="35" y="810" textAnchor="middle" fill={ca(c, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 4</text>
          <text x="68" y="810" fill={ca(c, 0.45)} fontSize="6" fontFamily="monospace" fontWeight="700">Priority Repair Queue</text>

          <rect x="24" y="820" width="432" height="130" rx="4" fill={ca(c, 0.012)} stroke={ca(c, 0.06)} strokeWidth="0.6" />

          {/* ── RANKED REPAIRS ── */}
          {[
            { id: "fix1", priority: "P1", rule: "Fix TP2 Trailing System", impact: "+3.6 pips", effort: "Medium", action: "Automate trailing via platform. Remove manual override option.", color: fail },
            { id: "fix2", priority: "P2", rule: "Enforce 1% Risk Sizing", impact: "+2.8 pips", effort: "Easy", action: "Add position size calculator to pre-trade checklist. Hard stop at 1%.", color: warn },
            { id: "fix3", priority: "P3", rule: "Session Discipline", impact: "+2.3 pips", effort: "Hard", action: "Set platform auto-lock outside London session. Review off-hours trades weekly.", color: warn },
            { id: "fix4", priority: "P4", rule: "News Filter Compliance", impact: "+1.5 pips", effort: "Easy", action: "Integrate economic calendar alert 30m before events. Auto-pause entries.", color: info },
          ].map((fix, i) => {
            const fixY = 830 + i * 28
            return (
              <g key={fix.id} onMouseEnter={() => setHoveredNode(fix.id)} onMouseLeave={() => setHoveredNode(null)}>
                <rect x="32" y={fixY} width="416" height={isH(fix.id) ? 26 : 22} rx="3"
                  fill={isH(fix.id) ? ca(fix.color, 0.06) : ca(c, 0.015)}
                  stroke={isH(fix.id) ? ca(fix.color, 0.3) : ca(c, 0.05)}
                  strokeWidth={isH(fix.id) ? 0.8 : 0.4}
                  style={{ transition: "all 0.25s ease", cursor: "pointer" }} />

                {/* Priority badge */}
                <rect x="38" y={fixY + 3} width="20" height="12" rx="6" fill={ca(fix.color, 0.15)} />
                <text x="48" y={fixY + 12} textAnchor="middle" fill={ca(fix.color, 0.8)} fontSize="5" fontFamily="monospace" fontWeight="900">{fix.priority}</text>

                {/* Rule name */}
                <text x="68" y={fixY + 12} fill={isH(fix.id) ? ca(c, 0.85) : ca(c, 0.55)} fontSize="5.5" fontFamily="monospace" fontWeight="800"
                  style={{ transition: "all 0.2s ease" }}>{fix.rule}</text>

                {/* Impact */}
                <text x="290" y={fixY + 12} fill={ca(pass, 0.65)} fontSize="5.5" fontFamily="monospace" fontWeight="800">{fix.impact}</text>

                {/* Effort */}
                <rect x="340" y={fixY + 3} width="34" height="12" rx="6" fill={ca(fix.effort === "Easy" ? pass : fix.effort === "Medium" ? warn : fail, 0.08)} />
                <text x="357" y={fixY + 12} textAnchor="middle" fill={ca(c, 0.5)} fontSize="4" fontFamily="monospace" fontWeight="700">{fix.effort}</text>

                {/* Expand arrow */}
                <text x="420" y={fixY + 12} fill={ca(c, isH(fix.id) ? 0.5 : 0.2)} fontSize="6" fontFamily="monospace">{isH(fix.id) ? "v" : ">"}</text>

                {/* Hover: action detail */}
                {isH(fix.id) && (
                  <text x="68" y={fixY + 23} fill={ca(c, 0.4)} fontSize="4" fontFamily="monospace">{fix.action}</text>
                )}
              </g>
            )
          })}
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="954" x2="240" y2="974" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,972 240,978 243,972" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 5: REFINED STRATEGY OUTPUT
            The rebuilt, optimized strategy blueprint
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="980" width="38" height="14" rx="2" fill={ca(c, 0.1)} stroke={ca(c, 0.2)} strokeWidth="0.4" />
          <text x="35" y="990" textAnchor="middle" fill={ca(c, 0.85)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 5</text>
          <text x="68" y="990" fill={ca(c, 0.5)} fontSize="6" fontFamily="monospace" fontWeight="700">Refined Strategy Output</text>

          <g onMouseEnter={() => setHoveredNode("output")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="24" y="1000" width="432" height="88" rx="4" fill={isH("output") ? ca(c, 0.04) : ca(c, 0.025)} stroke={isH("output") ? ca(c, 0.25) : ca(c, 0.15)} strokeWidth={isH("output") ? 1.2 : 0.8}
              style={{ transition: "all 0.3s ease" }}>
              <animate attributeName="stroke-opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite" />
            </rect>

            {/* Verdict */}
            <text x="240" y="1018" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="700" letterSpacing="1">OPTIMIZED STRATEGY PROJECTION</text>

            {/* Before vs After comparison */}
            <g>
              {/* Current */}
              <rect x="48" y="1026" width="160" height="28" rx="4" fill={ca(c, 0.03)} stroke={ca(c, 0.08)} strokeWidth="0.5" />
              <text x="128" y="1038" textAnchor="middle" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700">CURRENT PERFORMANCE</text>
              <text x="128" y="1050" textAnchor="middle" fill={ca(c, 0.65)} fontSize="8" fontFamily="monospace" fontWeight="900">+8.2 pips/trade</text>

              {/* Arrow */}
              <line x1="218" y1="1040" x2="258" y2="1040" stroke={ca(c, 0.2)} strokeWidth="1.5" />
              <polygon points="256,1037 262,1040 256,1043" fill={ca(c, 0.3)} />

              {/* Projected */}
              <rect x="270" y="1026" width="170" height="28" rx="4" fill={ca(pass, 0.05)} stroke={ca(pass, 0.2)} strokeWidth="0.8">
                <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="2s" repeatCount="indefinite" />
              </rect>
              <text x="355" y="1038" textAnchor="middle" fill={ca(pass, 0.5)} fontSize="4.5" fontFamily="monospace" fontWeight="700">PROJECTED AFTER FIXES</text>
              <text x="355" y="1050" textAnchor="middle" fill={ca(pass, 0.9)} fontSize="8" fontFamily="monospace" fontWeight="900" filter="url(#sr-glow)">+18.4 pips/trade</text>
            </g>

            {/* Improvement metric */}
            <rect x="140" y="1062" width="200" height="18" rx="9" fill={ca(pass, 0.06)} stroke={ca(pass, 0.2)} strokeWidth="0.6">
              <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <text x="240" y="1074" textAnchor="middle" fill={ca(pass, 0.85)} fontSize="7" fontFamily="monospace" fontWeight="900">+124% EDGE IMPROVEMENT</text>

            {isH("output") && (
              <text x="240" y="1090" textAnchor="middle" fill={ca(c, 0.3)} fontSize="4" fontFamily="monospace">Following all 4 priority repairs recovers 10.2 pips/trade of leaked edge</text>
            )}
          </g>
        </g>

        {/* ═══ FULL-PIPELINE PARTICLE ═══ */}
        <circle r="2" fill={ca(c, 0.6)} filter="url(#sr-glow)" opacity="0">
          <animateMotion dur="10s" repeatCount="indefinite" path="M240,56 L240,282 L240,558 L240,798 L240,978 L240,1088" />
          <animate attributeName="opacity" values="0;0.3;0.5;0.7;0.4;0.6;0" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle r="1.5" fill={ca(pass, 0.5)} filter="url(#sr-glow)" opacity="0">
          <animateMotion dur="13s" repeatCount="indefinite" path="M80,103 L240,282 L240,558 L240,798 L355,1050" />
          <animate attributeName="opacity" values="0;0.2;0.4;0.5;0.3;0" dur="13s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}


/* =================================================================
   5. COACH MODE -- #f43f5e (rose)
   The Heart. Your personal trading coach that monitors your
   psychological vitals in real-time, guides you through emotional
   turbulence, holds you accountable to discipline, and
   intervenes before destructive patterns take hold.
   
   Unique visual language: HEARTBEAT / VITAL SIGNS metaphor.
   - Psychology vital signs monitor (heartbeat-style readouts)
   - Emotional state compass (where you are right now)
   - Coaching dialogue timeline (the conversation itself)
   - Discipline accountability tracker (streaks + violations)
   - Intervention engine (when coach steps in and why)
   
   Design: Warm, organic, pulsing with life. Curved lines,
   heartbeat rhythms, breathing animations. The OPPOSITE of
   the cold blueprint (Strategy) or analytical grid (Market).
   This one FEELS alive because it's about the human.
   ================================================================= */
export function CoachModeSVG() {
  const c = "#f43f5e"
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const isH = (id: string) => hoveredNode === id

  const calm = "#10b981"
  const focused = "#3b82f6"
  const tense = "#f59e0b"
  const danger = "#ef4444"
  const warm = "#f43f5e"
  const soft = "#ec4899"

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: `linear-gradient(180deg, ${ca(c, 0.025)}, transparent)` }}>
      <svg viewBox="0 0 480 1120" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 0: LIVING BACKGROUND
            Soft radial warmth, subtle organic breathing
            ═══════════════════════════════════════════════════════════════ */}
        <defs>
          <radialGradient id="cm-warmth" cx="50%" cy="20%" r="70%">
            <stop offset="0%" stopColor={ca(c, 0.04)} />
            <stop offset="60%" stopColor={ca(c, 0.01)} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="cm-flow-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="50%" stopColor={ca(c, 0.4)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
          <filter id="cm-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cm-glow-lg">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cm-soft">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Heartbeat pulse gradient */}
          <linearGradient id="cm-pulse" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ca(c, 0)} />
            <stop offset="40%" stopColor={ca(c, 0.6)} />
            <stop offset="60%" stopColor={ca(c, 0.6)} />
            <stop offset="100%" stopColor={ca(c, 0)} />
          </linearGradient>
        </defs>
        <rect width="480" height="1120" fill="url(#cm-warmth)" />

        {/* Subtle organic circles -- like breathing */}
        {[80, 140, 210].map((r, i) => (
          <circle key={`breath-${i}`} cx="240" cy="90" r={r} fill="none" stroke={ca(c, 0.015 - i * 0.003)} strokeWidth="0.5">
            <animate attributeName="r" values={`${r - 4};${r + 6};${r - 4}`} dur={`${5 + i * 2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur={`${5 + i * 2}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ═══════════════════════════════════════════════════════════════
            TITLE: THE COACH
            ═══════════════════════════════════════════════════════════════ */}
        <text x="240" y="24" textAnchor="middle" fill={ca(c, 0.6)} fontSize="8" fontFamily="monospace" fontWeight="900" letterSpacing="3">YOUR TRADING COACH</text>
        <line x1="140" y1="30" x2="340" y2="30" stroke={ca(c, 0.08)} strokeWidth="0.5" />
        <text x="240" y="42" textAnchor="middle" fill={ca(c, 0.28)} fontSize="5" fontFamily="monospace" letterSpacing="1.5">REAL-TIME PSYCHOLOGICAL GUIDANCE ENGINE</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 1: PSYCHOLOGY VITAL SIGNS MONITOR
            Real-time heartbeat-style readouts of your trading
            psychology -- stress, focus, confidence, discipline
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="54" width="38" height="14" rx="7" fill={ca(c, 0.08)} />
          <text x="35" y="64" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 1</text>
          <text x="68" y="64" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Psychology Vital Signs</text>

          <rect x="24" y="74" width="432" height="170" rx="10" fill={ca(c, 0.015)} stroke={ca(c, 0.07)} strokeWidth="0.8" />

          {/* ── FOUR VITAL SIGN CHANNELS ── */}
          {[
            {
              id: "v-stress", label: "STRESS LEVEL", value: "42%", status: "ELEVATED", color: tense, y: 84,
              path: "M32,108 L52,108 L56,108 L60,98 L64,118 L68,96 L72,120 L76,108 L80,108 L100,108 L104,108 L108,96 L112,120 L116,108 L120,108 L140,108 L144,98 L148,118 L152,96 L156,120 L160,108 L180,108 L184,108 L188,100 L192,116 L196,108 L216,108",
              detail: "Your stress spiked 20 minutes ago after the EUR/USD rejection. Currently trending down as you haven't taken revenge action.",
              advice: "Take 3 deep breaths. The spike is natural. Your response is what matters."
            },
            {
              id: "v-focus", label: "FOCUS INDEX", value: "78%", status: "STRONG", color: focused, y: 130,
              path: "M32,154 L52,154 L60,148 L68,160 L76,146 L84,162 L92,154 L110,154 L118,150 L126,158 L134,148 L142,160 L150,154 L168,154 L176,150 L184,158 L192,148 L200,160 L208,154 L216,154",
              detail: "Focus has been above 70% for 47 minutes -- your optimal zone. Screen time is clean, no social media switches detected.",
              advice: "You're in the zone. Protect this state. No unnecessary chart switching."
            },
            {
              id: "v-confidence", label: "CONFIDENCE", value: "55%", status: "MODERATE", color: calm, y: 176,
              path: "M32,200 L52,200 L64,196 L76,204 L88,198 L100,202 L112,200 L130,200 L142,198 L154,202 L166,196 L178,204 L190,200 L216,200",
              detail: "Confidence dipped after the morning loss but is recovering. You've been making good analytical decisions despite the P&L.",
              advice: "Separate confidence from P&L. Your process today is solid."
            },
            {
              id: "v-discipline", label: "DISCIPLINE", value: "91%", status: "ELITE", color: calm, y: 222,
              path: "M32,236 L52,236 L60,232 L68,240 L76,234 L84,238 L92,236 L110,236 L118,232 L126,240 L134,234 L142,238 L150,236 L168,236 L176,234 L184,238 L192,234 L200,238 L208,236 L216,236",
              detail: "You've followed your plan on 10 of 11 decisions today. Only violation: checking charts during your break at 11:30.",
              advice: "Outstanding. This is what separates professionals. Keep it up."
            },
          ].map((vital, i) => (
            <g key={vital.id} onMouseEnter={() => setHoveredNode(vital.id)} onMouseLeave={() => setHoveredNode(null)}>
              {/* Background row */}
              <rect x="28" y={vital.y} width="424" height={isH(vital.id) ? 44 : 40} rx="6"
                fill={isH(vital.id) ? ca(vital.color, 0.04) : "transparent"}
                stroke={isH(vital.id) ? ca(vital.color, 0.15) : "transparent"} strokeWidth="0.5"
                style={{ transition: "all 0.3s ease", cursor: "pointer" }} />

              {/* Label */}
              <text x="36" y={vital.y + 12} fill={isH(vital.id) ? ca(vital.color, 0.8) : ca(c, 0.4)} fontSize="5" fontFamily="monospace" fontWeight="800" letterSpacing="0.5"
                style={{ transition: "all 0.2s ease" }}>{vital.label}</text>

              {/* Heartbeat / vital line -- THE SIGNATURE ELEMENT */}
              <path d={vital.path} stroke={isH(vital.id) ? ca(vital.color, 0.7) : ca(vital.color, 0.3)} strokeWidth={isH(vital.id) ? 1.8 : 1.2} fill="none" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}>
                <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
              </path>

              {/* Scanning dot that rides the waveform */}
              <circle r={isH(vital.id) ? 3 : 2} fill={ca(vital.color, 0.8)} filter="url(#cm-glow)" opacity="0">
                <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" path={vital.path} />
                <animate attributeName="opacity" values="0;0.6;0.8;0.5;0.7;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
              </circle>

              {/* Value readout */}
              <text x="240" y={vital.y + 12} fill={ca(vital.color, isH(vital.id) ? 0.95 : 0.7)} fontSize={isH(vital.id) ? "10" : "8"} fontFamily="monospace" fontWeight="900" filter={isH(vital.id) ? "url(#cm-glow)" : undefined}
                style={{ transition: "all 0.2s ease" }}>{vital.value}</text>

              {/* Status badge */}
              <rect x="296" y={vital.y + 3} width={vital.status.length * 6 + 14} height="14" rx="7" fill={ca(vital.color, 0.1)} stroke={ca(vital.color, 0.2)} strokeWidth="0.4" />
              <circle cx="304" cy={vital.y + 10} r="2.5" fill={ca(vital.color, 0.5)}>
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="312" y={vital.y + 13} fill={ca(vital.color, 0.7)} fontSize="5" fontFamily="monospace" fontWeight="800">{vital.status}</text>

              {/* Hover detail */}
              {isH(vital.id) && (
                <g>
                  <text x="36" y={vital.y + 28} fill={ca(c, 0.45)} fontSize="4.5" fontFamily="monospace" fontWeight="600">{vital.detail}</text>
                  <text x="36" y={vital.y + 38} fill={ca(vital.color, 0.55)} fontSize="4.5" fontFamily="monospace" fontWeight="700">COACH: {vital.advice}</text>
                </g>
              )}
            </g>
          ))}
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="248" x2="240" y2="274" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        {/* Pulsing heartbeat on connector */}
        <circle r="3" fill={ca(c, 0.4)} filter="url(#cm-glow)" opacity="0">
          <animate attributeName="cy" values="248;274;248" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <polygon points="237,272 240,278 243,272" fill={ca(c, 0.2)} />
        <text x="258" y="264" fill={ca(c, 0.18)} fontSize="4" fontFamily="monospace">vitals feed emotional compass</text>

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 2: EMOTIONAL STATE COMPASS
            A radial compass showing where you are emotionally --
            not just a label, but a precise position in emotional
            space with trajectory and danger zones
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="282" width="38" height="14" rx="7" fill={ca(c, 0.08)} />
          <text x="35" y="292" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 2</text>
          <text x="68" y="292" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Emotional State Compass</text>

          <rect x="24" y="302" width="432" height="208" rx="10" fill={ca(c, 0.015)} stroke={ca(c, 0.07)} strokeWidth="0.8" />

          {/* ── COMPASS VISUALIZATION ── */}
          {(() => {
            const cx = 170, cy = 410, outerR = 68
            /* Emotional zones as compass quadrants */
            const zones = [
              { label: "CALM", sublabel: "Optimal", angle: -45, color: calm, desc: "Clear thinking, patient, executing plan" },
              { label: "FOCUSED", sublabel: "Peak", angle: -135, color: focused, desc: "Deep concentration, fully present" },
              { label: "ANXIOUS", sublabel: "Caution", angle: 135, color: tense, desc: "Overthinking, second-guessing, tight grip" },
              { label: "TILTED", sublabel: "Danger", angle: 45, color: danger, desc: "Reactive, impulsive, ego-driven" },
            ]

            return (
              <g>
                {/* Concentric rings */}
                {[1, 0.7, 0.4].map((scale, i) => (
                  <circle key={`cr-${i}`} cx={cx} cy={cy} r={outerR * scale} fill="none" stroke={ca(c, 0.04 + i * 0.01)} strokeWidth="0.5" strokeDasharray={i > 0 ? "3 3" : "none"} />
                ))}

                {/* Quadrant dividers */}
                <line x1={cx - outerR} y1={cy} x2={cx + outerR} y2={cy} stroke={ca(c, 0.04)} strokeWidth="0.4" />
                <line x1={cx} y1={cy - outerR} x2={cx} y2={cy + outerR} stroke={ca(c, 0.04)} strokeWidth="0.4" />

                {/* Zone labels at compass points */}
                {zones.map((z, i) => {
                  const rad = (z.angle) * Math.PI / 180
                  const lx = cx + (outerR + 22) * Math.cos(rad)
                  const ly = cy + (outerR + 22) * Math.sin(rad)
                  const zId = `zone-${i}`
                  return (
                    <g key={zId} onMouseEnter={() => setHoveredNode(zId)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
                      {/* Zone arc fill */}
                      <path d={`M${cx},${cy} L${cx + outerR * Math.cos((z.angle - 45) * Math.PI / 180)},${cy + outerR * Math.sin((z.angle - 45) * Math.PI / 180)} A${outerR},${outerR} 0 0,1 ${cx + outerR * Math.cos((z.angle + 45) * Math.PI / 180)},${cy + outerR * Math.sin((z.angle + 45) * Math.PI / 180)} Z`}
                        fill={isH(zId) ? ca(z.color, 0.08) : ca(z.color, 0.02)}
                        style={{ transition: "all 0.3s ease" }} />

                      {/* Zone label */}
                      <text x={lx} y={ly - 3} textAnchor="middle" fill={isH(zId) ? ca(z.color, 0.9) : ca(z.color, 0.5)} fontSize={isH(zId) ? "7" : "6"} fontFamily="monospace" fontWeight="900"
                        style={{ transition: "all 0.2s ease" }}>{z.label}</text>
                      <text x={lx} y={ly + 7} textAnchor="middle" fill={ca(z.color, 0.35)} fontSize="4" fontFamily="monospace" fontWeight="600">{z.sublabel}</text>

                      {isH(zId) && (
                        <text x={lx} y={ly + 17} textAnchor="middle" fill={ca(z.color, 0.4)} fontSize="3.8" fontFamily="monospace">{z.desc}</text>
                      )}
                    </g>
                  )
                })}

                {/* ── YOUR CURRENT POSITION ── the needle */}
                {/* Position: slightly into CALM quadrant, near FOCUSED border */}
                {(() => {
                  const posAngle = -75 // Between CALM and FOCUSED -- good position
                  const posR = outerR * 0.55
                  const posRad = posAngle * Math.PI / 180
                  const px = cx + posR * Math.cos(posRad)
                  const py = cy + posR * Math.sin(posRad)
                  return (
                    <g onMouseEnter={() => setHoveredNode("position")} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
                      {/* Position dot -- the "YOU ARE HERE" */}
                      <circle cx={px} cy={py} r={isH("position") ? 8 : 5} fill={ca(c, isH("position") ? 0.2 : 0.1)} stroke={ca(c, 0.6)} strokeWidth={isH("position") ? 1.5 : 1}
                        style={{ transition: "all 0.3s ease" }}>
                        <animate attributeName="r" values={isH("position") ? "7;9;7" : "4.5;5.5;4.5"} dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={px} cy={py} r="2.5" fill={ca(c, 0.8)} filter="url(#cm-glow)">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
                      </circle>

                      {/* Ripple effect */}
                      <circle cx={px} cy={py} r="6" fill="none" stroke={ca(c, 0.15)} strokeWidth="0.5" opacity="0">
                        <animate attributeName="r" values="6;18;6" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                      </circle>

                      {/* Label */}
                      <text x={px + 12} y={py - 5} fill={ca(c, 0.7)} fontSize="5.5" fontFamily="monospace" fontWeight="900">YOU ARE HERE</text>
                      <text x={px + 12} y={py + 4} fill={ca(c, 0.4)} fontSize="4.5" fontFamily="monospace" fontWeight="600">Calm-Focused Zone</text>

                      {isH("position") && (
                        <g>
                          <text x={px + 12} y={py + 14} fill={ca(c, 0.35)} fontSize="4" fontFamily="monospace">Optimal trading state. Coach recommends</text>
                          <text x={px + 12} y={py + 23} fill={ca(calm, 0.55)} fontSize="4" fontFamily="monospace" fontWeight="700">maintaining current rhythm and focus.</text>
                        </g>
                      )}

                      {/* Trajectory arrow -- where you're trending */}
                      <line x1={px} y1={py} x2={px - 8} y2={py - 12} stroke={ca(calm, 0.3)} strokeWidth="0.8" strokeDasharray="2 2">
                        <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
                      </line>
                      <text x={px - 14} y={py - 16} fill={ca(calm, 0.3)} fontSize="3.5" fontFamily="monospace">trending</text>
                    </g>
                  )
                })()}

                {/* Center label */}
                <circle cx={cx} cy={cy} r="12" fill={ca(c, 0.04)} stroke={ca(c, 0.1)} strokeWidth="0.5" />
                <text x={cx} y={cy + 2} textAnchor="middle" fill={ca(c, 0.4)} fontSize="4.5" fontFamily="monospace" fontWeight="800">STATE</text>
              </g>
            )
          })()}

          {/* ── RIGHT PANEL: STATE HISTORY TIMELINE ── */}
          <g>
            <rect x="280" y="312" width="166" height="190" rx="6" fill={ca(c, 0.02)} stroke={ca(c, 0.05)} strokeWidth="0.5" />
            <text x="363" y="328" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight="800" letterSpacing="0.5">SESSION STATE LOG</text>
            <line x1="290" y1="334" x2="436" y2="334" stroke={ca(c, 0.05)} strokeWidth="0.4" />

            {/* Vertical timeline */}
            <line x1="300" y1="344" x2="300" y2="494" stroke={ca(c, 0.06)} strokeWidth="1" />

            {[
              { time: "09:00", state: "Calm", color: calm, event: "Session started. Plan reviewed.", y: 350 },
              { time: "09:14", state: "Focused", color: focused, event: "First trade entered (EUR/USD Long)", y: 370 },
              { time: "09:42", state: "Tense", color: tense, event: "Trade hit -15 pips drawdown", y: 390 },
              { time: "10:05", state: "Anxious", color: tense, event: "Stopped out -18 pips", y: 410 },
              { time: "10:08", state: "Tense", color: tense, event: "Coach intervened: breathing exercise", y: 430 },
              { time: "10:20", state: "Calm", color: calm, event: "Recovered composure, reviewed plan", y: 450 },
              { time: "10:35", state: "Focused", color: focused, event: "Second trade: clean setup taken", y: 470 },
              { time: "NOW", state: "Calm", color: calm, event: "Holding position, plan followed", y: 490 },
            ].map((entry, i) => {
              const eId = `log-${i}`
              return (
                <g key={eId} onMouseEnter={() => setHoveredNode(eId)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
                  {/* Timeline dot */}
                  <circle cx="300" cy={entry.y} r={isH(eId) ? 4 : 2.5} fill={isH(eId) ? entry.color : ca(entry.color, 0.4)} stroke={entry.color} strokeWidth="0.5"
                    style={{ transition: "all 0.2s ease" }}>
                    {entry.time === "NOW" && <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />}
                  </circle>

                  {/* Time */}
                  <text x="310" y={entry.y + 2} fill={isH(eId) ? ca(c, 0.7) : ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="800">{entry.time}</text>

                  {/* State badge */}
                  <rect x="336" y={entry.y - 5} width={entry.state.length * 5 + 8} height="10" rx="5" fill={ca(entry.color, isH(eId) ? 0.15 : 0.06)} />
                  <text x={340 + entry.state.length * 2.5} y={entry.y + 2} textAnchor="middle" fill={ca(entry.color, isH(eId) ? 0.8 : 0.5)} fontSize="4" fontFamily="monospace" fontWeight="700">{entry.state}</text>

                  {/* Event text on hover */}
                  {isH(eId) && (
                    <text x="310" y={entry.y + 12} fill={ca(c, 0.4)} fontSize="3.5" fontFamily="monospace">{entry.event}</text>
                  )}
                </g>
              )
            })}
          </g>
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="514" x2="240" y2="538" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,536 240,542 243,536" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 3: COACHING DIALOGUE -- The Conversation
            Not a cold readout -- a warm, human conversation.
            Shows the actual dialogue style between coach and trader.
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="546" width="38" height="14" rx="7" fill={ca(c, 0.08)} />
          <text x="35" y="556" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 3</text>
          <text x="68" y="556" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Coaching Dialogue Engine</text>

          <rect x="24" y="566" width="432" height="192" rx="10" fill={ca(c, 0.015)} stroke={ca(c, 0.07)} strokeWidth="0.8" />

          <text x="240" y="582" textAnchor="middle" fill={ca(c, 0.3)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">LIVE SESSION COACHING THREAD</text>

          {/* ── CHAT BUBBLES -- Coach and Trader ── */}
          {[
            { from: "trader", text: "I just got stopped out. Feeling like I should get back in immediately.", y: 592, color: ca(c, 0.5) },
            { from: "coach", text: "I see the loss. Let me check something -- did the setup follow your plan?", y: 618, color: calm },
            { from: "trader", text: "Yes, the setup was clean. The market just went against me.", y: 644, color: ca(c, 0.5) },
            { from: "coach", text: "Good. Then this loss is process-correct. Your stress spiked to 67% -- that's expected. But notice: you're wanting to re-enter not because of a new setup, but because of the loss. That's revenge instinct.", y: 670, color: calm },
            { from: "trader", text: "You're right. I don't have a new setup.", y: 712, color: ca(c, 0.5) },
            { from: "coach", text: "Let's do a 5-minute cooldown. Step away from the screen. When you come back, check for a FRESH setup that meets ALL your rules. The market will still be there.", y: 732, color: calm },
          ].map((msg, i) => {
            const mId = `msg-${i}`
            const isCoach = msg.from === "coach"
            const bubbleX = isCoach ? 44 : 200
            const bubbleW = isCoach ? 380 : 240
            const lines = msg.text.match(/.{1,55}(\s|$)/g) || [msg.text]
            const bubbleH = lines.length * 12 + 10

            return (
              <g key={mId} onMouseEnter={() => setHoveredNode(mId)} onMouseLeave={() => setHoveredNode(null)}>
                {/* Sender label */}
                <text x={isCoach ? 36 : 440} y={msg.y + 7} textAnchor={isCoach ? "start" : "end"} fill={ca(isCoach ? calm : c, 0.4)} fontSize="4" fontFamily="monospace" fontWeight="700">{isCoach ? "COACH" : "YOU"}</text>

                {/* Bubble */}
                <rect x={bubbleX} y={msg.y} width={isH(mId) ? bubbleW + 8 : bubbleW} height={bubbleH} rx="8"
                  fill={isH(mId) ? ca(isCoach ? calm : c, 0.06) : ca(isCoach ? calm : c, 0.025)}
                  stroke={isH(mId) ? ca(isCoach ? calm : c, 0.25) : ca(isCoach ? calm : c, 0.08)}
                  strokeWidth={isH(mId) ? 0.8 : 0.5}
                  style={{ transition: "all 0.25s ease", cursor: "pointer" }} />

                {/* Text */}
                {lines.map((line, li) => (
                  <text key={li} x={bubbleX + 10} y={msg.y + 12 + li * 12} fill={isH(mId) ? ca(c, 0.7) : ca(c, 0.45)} fontSize="5" fontFamily="monospace" fontWeight={isCoach ? "700" : "600"}
                    style={{ transition: "fill 0.2s ease" }}>{line.trim()}</text>
                ))}
              </g>
            )
          })}
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="762" x2="240" y2="786" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,784 240,790 243,784" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 4: DISCIPLINE ACCOUNTABILITY TRACKER
            Shows your discipline streaks, violations, and growth.
            Uses a calendar-heat-map style with streak counters.
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="794" width="38" height="14" rx="7" fill={ca(c, 0.08)} />
          <text x="35" y="804" textAnchor="middle" fill={ca(c, 0.75)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 4</text>
          <text x="68" y="804" fill={ca(c, 0.4)} fontSize="6" fontFamily="monospace" fontWeight="700">Discipline Accountability</text>

          <rect x="24" y="814" width="432" height="140" rx="10" fill={ca(c, 0.015)} stroke={ca(c, 0.07)} strokeWidth="0.8" />

          {/* ── STREAK COUNTER ── */}
          <g onMouseEnter={() => setHoveredNode("streak")} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
            <rect x="36" y="824" width="130" height="48" rx="8" fill={isH("streak") ? ca(calm, 0.06) : ca(c, 0.025)} stroke={isH("streak") ? ca(calm, 0.2) : ca(c, 0.06)} strokeWidth="0.6"
              style={{ transition: "all 0.25s ease" }} />
            <text x="101" y="840" textAnchor="middle" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700">CURRENT STREAK</text>
            <text x="101" y="862" textAnchor="middle" fill={ca(calm, 0.9)} fontSize="18" fontFamily="monospace" fontWeight="900" filter="url(#cm-glow)">7</text>
            <text x="120" y="862" fill={ca(calm, 0.5)} fontSize="6" fontFamily="monospace" fontWeight="700">DAYS</text>
            {isH("streak") && <text x="101" y="876" textAnchor="middle" fill={ca(c, 0.3)} fontSize="3.8" fontFamily="monospace">7 consecutive sessions with no major violations</text>}
          </g>

          {/* ── BEST STREAK ── */}
          <g onMouseEnter={() => setHoveredNode("best")} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
            <rect x="176" y="824" width="100" height="48" rx="8" fill={isH("best") ? ca(c, 0.05) : ca(c, 0.02)} stroke={isH("best") ? ca(c, 0.2) : ca(c, 0.06)} strokeWidth="0.6"
              style={{ transition: "all 0.25s ease" }} />
            <text x="226" y="840" textAnchor="middle" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700">PERSONAL BEST</text>
            <text x="226" y="862" textAnchor="middle" fill={ca(c, 0.7)} fontSize="14" fontFamily="monospace" fontWeight="900">12</text>
            <text x="244" y="862" fill={ca(c, 0.4)} fontSize="5" fontFamily="monospace" fontWeight="700">DAYS</text>
          </g>

          {/* ── TODAY'S SCORECARD ── */}
          <g onMouseEnter={() => setHoveredNode("score")} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
            <rect x="286" y="824" width="162" height="48" rx="8" fill={isH("score") ? ca(calm, 0.05) : ca(c, 0.02)} stroke={isH("score") ? ca(calm, 0.2) : ca(c, 0.06)} strokeWidth="0.6"
              style={{ transition: "all 0.25s ease" }} />
            <text x="367" y="840" textAnchor="middle" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700">TODAY{"'"}S SCORE</text>
            <text x="330" y="862" fill={ca(calm, 0.8)} fontSize="14" fontFamily="monospace" fontWeight="900">91%</text>
            <text x="360" y="856" fill={ca(calm, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="700">10/11</text>
            <text x="360" y="866" fill={ca(c, 0.3)} fontSize="4" fontFamily="monospace">decisions on-plan</text>
          </g>

          {/* ── WEEKLY HEAT CALENDAR ── */}
          <text x="36" y="888" fill={ca(c, 0.35)} fontSize="4.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">THIS WEEK</text>
          {[
            { day: "MON", score: 95, color: calm },
            { day: "TUE", score: 82, color: calm },
            { day: "WED", score: 68, color: tense },
            { day: "THU", score: 88, color: calm },
            { day: "FRI", score: 91, color: calm },
            { day: "SAT", score: 0, color: "#6b7280" },
            { day: "SUN", score: 0, color: "#6b7280" },
          ].map((day, i) => {
            const dId = `day-${i}`
            const dx = 36 + i * 60
            return (
              <g key={dId} onMouseEnter={() => setHoveredNode(dId)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
                <rect x={dx} y="894" width="52" height="24" rx="4"
                  fill={day.score > 0 ? ca(day.color, (day.score / 100) * (isH(dId) ? 0.18 : 0.1)) : ca("#6b7280", 0.03)}
                  stroke={isH(dId) && day.score > 0 ? ca(day.color, 0.3) : ca(c, 0.04)} strokeWidth={isH(dId) ? 0.8 : 0.4}
                  style={{ transition: "all 0.2s ease" }} />
                <text x={dx + 26} y={904} textAnchor="middle" fill={ca(c, 0.3)} fontSize="4" fontFamily="monospace" fontWeight="700">{day.day}</text>
                {day.score > 0 && (
                  <text x={dx + 26} y={914} textAnchor="middle" fill={ca(day.color, isH(dId) ? 0.85 : 0.55)} fontSize={isH(dId) ? "6" : "5"} fontFamily="monospace" fontWeight="900"
                    style={{ transition: "all 0.2s ease" }}>{day.score}%</text>
                )}
                {day.score === 0 && (
                  <text x={dx + 26} y={912} textAnchor="middle" fill={ca("#6b7280", 0.3)} fontSize="4" fontFamily="monospace">REST</text>
                )}
              </g>
            )
          })}

          {/* Weekly average */}
          <g onMouseEnter={() => setHoveredNode("avg")} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
            <rect x="36" y="924" width="408" height="18" rx="4" fill={isH("avg") ? ca(c, 0.04) : ca(c, 0.02)} stroke={isH("avg") ? ca(c, 0.15) : ca(c, 0.05)} strokeWidth="0.5"
              style={{ transition: "all 0.2s ease" }} />
            <text x="48" y="936" fill={ca(c, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="800">WEEKLY AVERAGE:</text>
            <text x="155" y="936" fill={ca(calm, 0.8)} fontSize="6" fontFamily="monospace" fontWeight="900">84.8%</text>
            <text x="200" y="936" fill={ca(c, 0.3)} fontSize="4.5" fontFamily="monospace" fontWeight="600">discipline score</text>
            <text x="340" y="936" fill={ca(calm, 0.5)} fontSize="5" fontFamily="monospace" fontWeight="800">+6.2% vs last week</text>
          </g>
        </g>

        {/* ═══ CONNECTOR ═══ */}
        <line x1="240" y1="958" x2="240" y2="978" stroke={ca(c, 0.1)} strokeWidth="1.5" />
        <polygon points="237,976 240,982 243,976" fill={ca(c, 0.2)} />

        {/* ═══════════════════════════════════════════════════════════════
            STAGE 5: COACH INTERVENTION ENGINE + SESSION SUMMARY
            When and how the coach steps in, plus the final
            guidance output for this session
            ═══════════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="986" width="38" height="14" rx="7" fill={ca(c, 0.1)} />
          <text x="35" y="996" textAnchor="middle" fill={ca(c, 0.85)} fontSize="6" fontFamily="monospace" fontWeight="900">STAGE 5</text>
          <text x="68" y="996" fill={ca(c, 0.5)} fontSize="6" fontFamily="monospace" fontWeight="700">Session Guidance Output</text>

          <g onMouseEnter={() => setHoveredNode("guidance")} onMouseLeave={() => setHoveredNode(null)}>
            <rect x="24" y="1006" width="432" height="104" rx="10" fill={isH("guidance") ? ca(c, 0.04) : ca(c, 0.025)} stroke={isH("guidance") ? ca(c, 0.2) : ca(c, 0.12)} strokeWidth={isH("guidance") ? 1.2 : 0.8}
              style={{ transition: "all 0.3s ease" }}>
              <animate attributeName="stroke-opacity" values="0.08;0.18;0.08" dur="3s" repeatCount="indefinite" />
            </rect>

            <text x="240" y="1024" textAnchor="middle" fill={ca(c, 0.45)} fontSize="5.5" fontFamily="monospace" fontWeight="700" letterSpacing="1">COACH{"'"}S SESSION ASSESSMENT</text>

            {/* Three guidance cards */}
            {[
              { label: "WHAT WENT WELL", text: "Handled loss with discipline. No revenge trades taken.", icon: "check", color: calm, x: 90 },
              { label: "WATCH OUT FOR", text: "Stress recovery took 18 min. Target under 10 min.", icon: "alert", color: tense, x: 240 },
              { label: "NEXT SESSION", text: "Pre-load breathing exercise. Start with plan review.", icon: "arrow", color: focused, x: 390 },
            ].map((card, i) => (
              <g key={`guide-${i}`}>
                <rect x={card.x - 68} y="1032" width="136" height="36" rx="8" fill={ca(card.color, 0.04)} stroke={ca(card.color, 0.12)} strokeWidth="0.6">
                  <animate attributeName="stroke-opacity" values="0.08;0.2;0.08" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </rect>
                <text x={card.x} y="1044" textAnchor="middle" fill={ca(card.color, 0.5)} fontSize="4.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.3">{card.label}</text>
                {card.text.match(/.{1,25}(\s|$)/g)?.map((line, li) => (
                  <text key={li} x={card.x} y={1056 + li * 10} textAnchor="middle" fill={ca(card.color, 0.75)} fontSize="5" fontFamily="monospace" fontWeight="700">{line.trim()}</text>
                ))}
              </g>
            ))}

            {/* Motivational closer */}
            <rect x="100" y="1076" width="280" height="22" rx="11" fill={ca(c, 0.04)} stroke={ca(c, 0.12)} strokeWidth="0.6">
              <animate attributeName="stroke-opacity" values="0.08;0.2;0.08" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <text x="240" y="1090" textAnchor="middle" fill={ca(c, 0.7)} fontSize="6" fontFamily="monospace" fontWeight="900" filter="url(#cm-soft)">{"\""}You showed real composure today. That is growth.{"\""}
            </text>

            {isH("guidance") && (
              <text x="240" y="1106" textAnchor="middle" fill={ca(c, 0.25)} fontSize="4" fontFamily="monospace">Your coach learns your patterns and adapts guidance to your psychological profile over time.</text>
            )}
          </g>
        </g>

        {/* ═══ HEARTBEAT PARTICLES -- the living pulse of the coach ═══ */}
        <circle r="2.5" fill={ca(c, 0.5)} filter="url(#cm-glow)" opacity="0">
          <animateMotion dur="11s" repeatCount="indefinite" path="M240,54 L240,278 L170,410 L240,542 L240,790 L240,982 L240,1110" />
          <animate attributeName="opacity" values="0;0.3;0.6;0.4;0.7;0.3;0.5;0" dur="11s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill={ca(calm, 0.5)} filter="url(#cm-soft)" opacity="0">
          <animateMotion dur="14s" repeatCount="indefinite" path="M240,74 L240,278 L240,542 L240,790 L240,1090" />
          <animate attributeName="opacity" values="0;0.2;0.4;0.3;0.5;0.2;0" dur="14s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}


/* =================================================================
   MODE VISUALIZATION REGISTRY
   Maps mode IDs to their visualization component
   ================================================================= */
export const MODE_VISUALIZATIONS: Record<string, React.FC> = {
  "market-thinking": MarketThinkingSVG,
  "scenario-lab": ScenarioLabSVG,
  "journal-reflect": JournalReflectSVG,
  "strategy-refine": StrategyRefineSVG,
  "coach-mode": CoachModeSVG,
}

export function getModeVisualization(modeId: string): React.FC | null {
  return MODE_VISUALIZATIONS[modeId] || null
}
