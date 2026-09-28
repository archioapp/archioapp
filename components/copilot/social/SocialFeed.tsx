"use client"

import { useState, useMemo, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, MessageCircle, Share2, Bookmark, TrendingUp, TrendingDown,
  Image, BarChart3, Send, Flame, Award, Shield, ChevronRight,
  Star, ArrowUpRight, Globe, Users, Clock, Zap, Eye,
  ChevronDown, Sparkles, Crown, CircleDot, Filter,
  ArrowDownRight, Repeat2
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════ */
interface Post {
  id: string
  author: { name: string; handle: string; avatar: string; tier: "whale" | "shark" | "bull" | "trader"; verified: boolean; winRate: number; totalTrades: number }
  content: string
  trade?: { instrument: string; side: "buy" | "sell"; pnl: number; pips: number; rr: number; setup: string; confluences: number }
  timestamp: string
  likes: number; comments: number; reposts: number; views: number
  liked: boolean; bookmarked: boolean
  tags: string[]
  replies?: Reply[]
}

interface Reply {
  id: string; author: string; handle: string; avatar: string; content: string; timestamp: string; likes: number
}

const POSTS: Post[] = [
  {
    id: "p1",
    author: { name: "Marcus Wei", handle: "@marcuswei", avatar: "MW", tier: "whale", verified: true, winRate: 68, totalTrades: 1247 },
    content: "London session delivered exactly what we mapped in the pre-market analysis. Order block at 1.0842 held clean, displacement confirmed on the 5m. Textbook ICT execution.\n\nThe patience to wait for the killzone is what separates consistent traders from gamblers. Mark this setup.",
    trade: { instrument: "EUR/USD", side: "buy", pnl: 234, pips: 23.4, rr: 3.2, setup: "Order Block + FVG", confluences: 4 },
    timestamp: "2h",
    likes: 147, comments: 23, reposts: 12, views: 2840,
    liked: false, bookmarked: false,
    tags: ["ICT", "LondonSession", "EURUSD"],
    replies: [
      { id: "r1", author: "Sarah K.", handle: "@sarahk_fx", avatar: "SK", content: "Beautiful execution. That displacement candle was clean.", timestamp: "1h", likes: 8 },
      { id: "r2", author: "Dev Patel", handle: "@devtrades", avatar: "DP", content: "Were you looking at the 15m OB or the 1H? I had the zone slightly higher.", timestamp: "45m", likes: 3 },
    ]
  },
  {
    id: "p2",
    author: { name: "Aisha Tanaka", handle: "@aisha_macro", avatar: "AT", tier: "shark", verified: true, winRate: 72, totalTrades: 834 },
    content: "Gold breaking above 2350 with conviction. The DXY inverse correlation is playing out perfectly. If we get a weekly close above this level, we are looking at ATH territory.\n\nMy swing position from 2312 is now +380 pips. Letting it breathe with trailing stop.",
    trade: { instrument: "XAU/USD", side: "buy", pnl: 1520, pips: 380, rr: 5.4, setup: "Macro Swing", confluences: 5 },
    timestamp: "4h",
    likes: 312, comments: 45, reposts: 67, views: 8920,
    liked: true, bookmarked: true,
    tags: ["Gold", "Macro", "SwingTrading"],
    replies: [
      { id: "r3", author: "Mike D.", handle: "@miked_gold", avatar: "MD", content: "Massive move. What is your target for the weekly close?", timestamp: "3h", likes: 12 },
    ]
  },
  {
    id: "p3",
    author: { name: "Jake Rivers", handle: "@jake_scalps", avatar: "JR", tier: "bull", verified: false, winRate: 54, totalTrades: 312 },
    content: "Took an L on NAS100 today. Got caught in the chop before the news release. Lesson learned: no trading 30 minutes before NFP.\n\nAdding this to my rules. Accountability is everything.",
    trade: { instrument: "NAS100", side: "buy", pnl: -156, pips: -15.6, rr: -0.8, setup: "Breakout (Failed)", confluences: 1 },
    timestamp: "6h",
    likes: 89, comments: 34, reposts: 5, views: 1560,
    liked: false, bookmarked: false,
    tags: ["Accountability", "NAS100", "Lesson"],
    replies: []
  },
  {
    id: "p4",
    author: { name: "Elena Volkov", handle: "@elena_sniper", avatar: "EV", tier: "shark", verified: true, winRate: 74, totalTrades: 621 },
    content: "3 for 3 today. All London killzone entries. The key is having your levels mapped BEFORE the session opens.\n\nIf you are drawing levels during the killzone, you already lost. Pre-market preparation is 80% of the edge.",
    timestamp: "8h",
    likes: 256, comments: 18, reposts: 31, views: 4200,
    liked: false, bookmarked: false,
    tags: ["Preparation", "Killzone", "Discipline"],
    replies: []
  },
]

const TRENDING = [
  { tag: "#EURUSD", posts: 234, delta: "+18%" }, { tag: "#Gold", posts: 189, delta: "+12%" },
  { tag: "#NFP", posts: 156, delta: "+45%" }, { tag: "#ICT", posts: 145, delta: "+8%" },
  { tag: "#LondonKZ", posts: 98, delta: "+22%" }, { tag: "#NAS100", posts: 87, delta: "+5%" },
]

/* ═══════════════════════════════════════════════════════════
   TIER SYSTEM
   ═══════════════════════════════════════════════════════════ */
const TIER_CONFIG = {
  whale: { label: "WHALE", color: "#06b6d4", icon: Crown },
  shark: { label: "SHARK", color: "#8b5cf6", icon: Zap },
  bull: { label: "BULL", color: "#10b981", icon: TrendingUp },
  trader: { label: "TRADER", color: "#6b7280", icon: CircleDot },
}

function TierBadge({ tier }: { tier: keyof typeof TIER_CONFIG }) {
  const c = TIER_CONFIG[tier]
  return (
    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-md text-[6px] font-mono font-bold tracking-[0.15em]"
      style={{ backgroundColor: `${c.color}08`, border: `1px solid ${c.color}15`, color: `${c.color}80` }}>
      {c.label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════
   AUTHOR AVATAR -- Ring color = tier
   ═══════════════════════════════════════════════════════════ */
function AuthorAvatar({ author, size = 36 }: { author: Post["author"]; size?: number }) {
  const c = TIER_CONFIG[author.tier]
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full"
        style={{ border: `1.5px solid ${c.color}30`, boxShadow: `0 0 8px ${c.color}10` }} />
      <div className="absolute inset-[2px] rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{ backgroundColor: `${c.color}10`, color: `${c.color}80` }}>
        {author.avatar}
      </div>
      {author.verified && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#06b6d4", boxShadow: "0 0 4px rgba(6,182,212,0.3)" }}>
          <svg className="w-2 h-2 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TRADE CARD -- Inline in post
   ═══════════════════════════════════════════════════════════ */
function TradeCard({ trade }: { trade: NonNullable<Post["trade"]> }) {
  const isWin = trade.pnl > 0
  const edgeColor = isWin ? "#10b981" : "#ef4444"

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 rounded-xl p-3 relative overflow-hidden"
      style={{ backgroundColor: `${edgeColor}03`, border: `1px solid ${edgeColor}10` }}>

      {/* Ambient shimmer */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.03, 0] }}
        transition={{ duration: 3, repeat: Infinity }}>
        <div className="absolute right-0 top-0 w-20 h-20 rounded-full"
          style={{ backgroundColor: edgeColor, filter: "blur(25px)" }} />
      </motion.div>

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${edgeColor}08`, border: `1px solid ${edgeColor}15` }}>
              {trade.side === "buy"
                ? <ArrowUpRight className="w-3 h-3" style={{ color: `${edgeColor}70` }} />
                : <ArrowDownRight className="w-3 h-3" style={{ color: `${edgeColor}70` }} />
              }
            </div>
            <span className="text-[11px] font-mono font-bold text-white/65">{trade.instrument}</span>
            <span className="text-[7px] font-mono font-bold px-1 py-0.5 rounded"
              style={{ backgroundColor: `${edgeColor}08`, color: `${edgeColor}60`, border: `1px solid ${edgeColor}12` }}>
              {trade.side === "buy" ? "LONG" : "SHORT"}
            </span>
          </div>
          <div className={`text-[15px] font-mono font-black ${isWin ? "text-emerald-400" : "text-red-400"}`}
            style={{ textShadow: `0 0 12px ${edgeColor}30` }}>
            {isWin ? "+" : ""}{trade.pnl.toFixed(0)}$
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          {[
            { label: "Pips", value: `${trade.pips > 0 ? "+" : ""}${trade.pips}` },
            { label: "R:R", value: `1:${Math.abs(trade.rr).toFixed(1)}` },
            { label: "Setup", value: trade.setup },
            { label: "Confluence", value: `${trade.confluences}/5` },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1">
              <span className="text-[7px] font-mono text-white/15">{item.label}</span>
              <span className="text-[8px] font-mono font-bold" style={{ color: `${edgeColor}50` }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   POST CARD
   ═══════════════════════════════════════════════════════════ */
function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked)
  const [saved, setSaved] = useState(post.bookmarked)
  const [showReplies, setShowReplies] = useState(false)
  const likeCount = liked ? post.likes + (post.liked ? 0 : 1) : post.likes - (post.liked ? 1 : 0)
  const c = TIER_CONFIG[post.author.tier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl relative overflow-hidden transition-all group"
      style={{ backgroundColor: "rgba(255,255,255,0.008)", border: "1px solid rgba(255,255,255,0.03)" }}>

      {/* Tier accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${c.color}15, transparent)` }} />

      <div className="p-4">
        {/* Author Row */}
        <div className="flex items-start gap-3">
          <AuthorAvatar author={post.author} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-white/80">{post.author.name}</span>
              <TierBadge tier={post.author.tier} />
              <span className="text-[8px] font-mono text-white/15">{post.author.handle}</span>
              <span className="text-[7px] font-mono text-white/10">{post.timestamp}</span>
            </div>
            {/* Author stats */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[7px] font-mono text-white/15">{post.author.winRate}% WR</span>
              <span className="text-[7px] font-mono text-white/10">{post.author.totalTrades} trades</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 ml-[48px]">
          <p className="text-[11px] text-white/50 leading-relaxed whitespace-pre-line">{post.content}</p>

          {/* Trade Card */}
          {post.trade && <TradeCard trade={post.trade} />}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded-md cursor-pointer transition-all hover:bg-white/[0.03]"
                  style={{ color: `${c.color}40`, backgroundColor: `${c.color}03`, border: `1px solid ${c.color}06` }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions Row */}
          <div className="flex items-center gap-1 mt-3 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            {/* Like */}
            <button onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${liked ? "" : "hover:bg-white/[0.02]"}`}
              style={liked ? { backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)" } : { border: "1px solid transparent" }}>
              <Heart className={`w-3.5 h-3.5 transition-all ${liked ? "text-red-400 fill-current" : "text-white/15"}`} />
              <span className={`text-[9px] font-mono ${liked ? "text-red-400/70" : "text-white/15"}`}>{likeCount}</span>
            </button>

            {/* Comments */}
            <button onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.02] transition-all border border-transparent">
              <MessageCircle className={`w-3.5 h-3.5 ${showReplies ? "text-cyan-400/60" : "text-white/15"}`} />
              <span className={`text-[9px] font-mono ${showReplies ? "text-cyan-400/50" : "text-white/15"}`}>{post.comments}</span>
            </button>

            {/* Repost */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.02] transition-all border border-transparent">
              <Repeat2 className="w-3.5 h-3.5 text-white/15" />
              <span className="text-[9px] font-mono text-white/15">{post.reposts}</span>
            </button>

            {/* Bookmark */}
            <button onClick={() => setSaved(!saved)}
              className={`p-1.5 rounded-lg transition-all ${saved ? "" : "hover:bg-white/[0.02]"}`}
              style={saved ? { backgroundColor: "rgba(245,158,11,0.06)" } : {}}>
              <Bookmark className={`w-3.5 h-3.5 transition-all ${saved ? "text-amber-400 fill-current" : "text-white/15"}`} />
            </button>

            <div className="flex-1" />

            {/* Views */}
            <div className="flex items-center gap-1 text-white/[0.06]">
              <Eye className="w-3 h-3" />
              <span className="text-[8px] font-mono">{(post.views / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Replies */}
          <AnimatePresence>
            {showReplies && post.replies && post.replies.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3 space-y-0.5">
                  {post.replies.map(r => (
                    <div key={r.id} className="rounded-xl p-2.5 transition-all hover:bg-white/[0.01]"
                      style={{ backgroundColor: "rgba(255,255,255,0.005)", border: "1px solid rgba(255,255,255,0.02)" }}>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white/30 shrink-0"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          {r.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-white/45">{r.author}</span>
                            <span className="text-[7px] font-mono text-white/12">{r.handle}</span>
                            <span className="text-[7px] font-mono text-white/8">{r.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-white/30 mt-0.5 leading-relaxed">{r.content}</p>
                          <button className="flex items-center gap-1 mt-1 text-white/10 hover:text-red-400/40 transition-all">
                            <Heart className="w-2.5 h-2.5" />
                            <span className="text-[7px] font-mono">{r.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Reply input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input placeholder="Write a reply..."
                      className="flex-1 bg-white/[0.015] border border-white/[0.04] rounded-lg px-3 py-1.5 text-[9px] text-white/40 placeholder:text-white/10 outline-none focus:border-white/[0.08] transition-all" />
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                      <Send className="w-3 h-3 text-white/15" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   POST COMPOSER
   ═══════════════════════════════════════════════════════════ */
function PostComposer() {
  const [text, setText] = useState("")
  const [focused, setFocused] = useState(false)

  return (
    <div className={`rounded-2xl transition-all ${focused ? "bg-white/[0.015]" : "bg-white/[0.008]"}`}
      style={{ border: focused ? "1px solid rgba(16,185,129,0.12)" : "1px solid rgba(255,255,255,0.03)" }}>
      <div className="p-4 flex gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-400/60 shrink-0"
          style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
          YOU
        </div>
        <div className="flex-1">
          <textarea value={text} onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Share your analysis, trade setup, or market insight..."
            className="w-full bg-transparent text-[11px] text-white/50 placeholder:text-white/12 resize-none outline-none min-h-[36px] leading-relaxed"
            rows={focused ? 3 : 1} />
          <AnimatePresence>
            {focused && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-1">
                    {[Image, BarChart3, TrendingUp].map((Icon, i) => (
                      <button key={i} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.03] text-white/12 hover:text-white/25 transition-all">
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                  <button disabled={!text.trim()}
                    className={`px-4 py-1.5 rounded-xl text-[8px] font-mono font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 transition-all ${
                      text.trim()
                        ? "bg-emerald-500/15 text-emerald-400/80 border border-emerald-500/20 hover:bg-emerald-500/25"
                        : "bg-white/[0.02] text-white/10 border border-white/[0.03] cursor-not-allowed"
                    }`}>
                    <Send className="w-3 h-3" /> Post
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TRENDING PANEL
   ═══════════════════════════════════════════════════════════ */
function TrendingPanel() {
  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ backgroundColor: "rgba(255,255,255,0.008)", border: "1px solid rgba(255,255,255,0.03)" }}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <Flame className="w-3 h-3 text-amber-400/50" />
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-white/25 font-bold">Trending</span>
      </div>
      <div className="space-y-1">
        {TRENDING.map((t, i) => (
          <motion.button key={t.tag}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-white/[0.015] transition-all group">
            <span className="text-[8px] font-mono text-white/8 w-3">{i + 1}</span>
            <div className="flex-1 text-left">
              <span className="text-[10px] font-mono text-cyan-400/40 group-hover:text-cyan-400/60 transition-colors">{t.tag}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[7px] font-mono text-white/10">{t.posts} posts</span>
                <span className="text-[7px] font-mono text-emerald-400/30">{t.delta}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TOP TRADERS PANEL
   ═══════════════════════════════════════════════════════════ */
function TopTraders() {
  const traders = [
    { name: "Marcus Wei", handle: "@marcuswei", avatar: "MW", tier: "whale" as const, winRate: 68, pnl: "+$12.4k" },
    { name: "Elena Volkov", handle: "@elena_sniper", avatar: "EV", tier: "shark" as const, winRate: 74, pnl: "+$8.9k" },
    { name: "Aisha Tanaka", handle: "@aisha_macro", avatar: "AT", tier: "shark" as const, winRate: 72, pnl: "+$7.2k" },
  ]

  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ backgroundColor: "rgba(255,255,255,0.008)", border: "1px solid rgba(255,255,255,0.03)" }}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <Award className="w-3 h-3 text-violet-400/50" />
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-white/25 font-bold">Top Traders</span>
      </div>
      <div className="space-y-1.5">
        {traders.map((t, i) => {
          const tc = TIER_CONFIG[t.tier]
          return (
            <motion.button key={t.handle}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.015] transition-all group">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                style={{ backgroundColor: `${tc.color}08`, border: `1px solid ${tc.color}15`, color: `${tc.color}60` }}>
                {t.avatar}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-white/50 group-hover:text-white/70 transition-colors truncate">{t.name}</span>
                  <TierBadge tier={t.tier} />
                </div>
                <span className="text-[7px] font-mono text-white/12">{t.winRate}% WR</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400/50">{t.pnl}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   FEED HEADER -- Nerve Center style
   ═══════════════════════════════════════════════════════════ */
function FeedHeader() {
  return (
    <div className="border-b border-white/[0.04] relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.01, 0.025, 0.01] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
          style={{ backgroundColor: "#06b6d4", filter: "blur(45px)" }} />
      </motion.div>

      <div className="relative px-5 py-3 flex items-center gap-3">
        <div className="relative shrink-0">
          <svg width="46" height="46" viewBox="0 0 46 46">
            <circle cx="23" cy="23" r="19" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            <motion.circle cx="23" cy="23" r="19" fill="none" stroke="#06b6d4" strokeWidth="2"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 19}
              animate={{
                strokeDashoffset: [2 * Math.PI * 19, 2 * Math.PI * 19 * 0.25, 2 * Math.PI * 19],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              transform="rotate(-90 23 23)"
              style={{ filter: "drop-shadow(0 0 3px rgba(6,182,212,0.25))" }} />
            <circle cx="23" cy="23" r="19" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.1">
              <animate attributeName="r" values="19;23;19" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.1;0;0.1" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-4 h-4 text-cyan-400/50" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-white/60 tracking-wide">SIGNAL FEED</span>
            <motion.div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.12)" }}
              animate={{ borderColor: ["rgba(6,182,212,0.12)", "rgba(6,182,212,0.25)", "rgba(6,182,212,0.12)"] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-cyan-400/70">LIVE</span>
            </motion.div>
          </div>
          <p className="text-[10px] text-white/15 mt-0.5 font-mono">Real-time analysis and trade signals from verified traders</p>
        </div>

        <div className="flex items-center gap-2 text-white/10">
          <Users className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono">2.4k online</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════ */
export function SocialFeed() {
  const [feedFilter, setFeedFilter] = useState<"all" | "trades" | "analysis" | "following">("all")
  const filters = [
    { key: "all" as const, label: "All", icon: Globe },
    { key: "trades" as const, label: "Trades", icon: TrendingUp },
    { key: "analysis" as const, label: "Analysis", icon: BarChart3 },
    { key: "following" as const, label: "Following", icon: Users },
  ]

  return (
    <div className="bg-[#060810]">
      <div className="max-w-[1400px] mx-auto space-y-3">

        {/* Header */}
        <FeedHeader />

        {/* Content */}
        <div className="grid grid-cols-[1fr_280px] gap-4 px-4">

          {/* Main feed column */}
          <div className="space-y-3">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.008)", border: "1px solid rgba(255,255,255,0.03)" }}>
              {filters.map(f => {
                const isActive = feedFilter === f.key
                const Icon = f.icon
                return (
                  <button key={f.key} onClick={() => setFeedFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-[0.1em] transition-all ${
                      isActive
                        ? "bg-white/[0.06] text-white/50 border border-white/[0.08]"
                        : "text-white/15 hover:text-white/30 hover:bg-white/[0.02] border border-transparent"
                    }`}>
                    <Icon className="w-3 h-3" />
                    {f.label}
                  </button>
                )
              })}
            </div>

            {/* Composer */}
            <PostComposer />

            {/* Posts */}
            {POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Right sidebar */}
          <div className="space-y-3">
            <TrendingPanel />
            <TopTraders />
          </div>
        </div>

      </div>
    </div>
  )
}
