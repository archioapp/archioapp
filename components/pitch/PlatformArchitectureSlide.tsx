"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain, Zap, Users, Shield, Layers, Database, Cpu, Network,
  Globe, Activity, Lock, Smartphone, Eye, BarChart3, Target,
  MessageSquare, BookOpen, Newspaper, Wallet, CandlestickChart,
  ArrowRight, ArrowDown, ChevronDown, ChevronUp, Check, X,
  GitMerge, Boxes, Server, HardDrive, Radio, Workflow,
  CircleDot, Sparkles, GraduationCap, FileCheck, Gauge,
  TrendingUp, Clock, Hash, Send, Monitor
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════
   PLATFORM ARCHITECTURE SLIDE
   A completely different visual paradigm from Market (horizontal slides)
   and Solution (horizontal slides). This uses a VERTICAL STACK EXPLORER:
   - Top: system-level view with 6 interconnected layers
   - Click any layer to deep-dive into its node graph
   - Bottom: live data flow animation showing how data passes between layers
   - Right panel: contextual detail that changes with selection
   ═══════════════════════════════════════════════════════════════════ */

/* ── Layer Architecture Data ──────────────────────────────────────── */

interface ArchNode {
  name: string
  type: "service" | "ai" | "data" | "api" | "ui"
  desc: string
  tech: string
  throughput: string
}

interface DataFlow {
  from: string
  to: string
  data: string
  volume: string
  latency: string
}

interface ArchLayer {
  id: string
  name: string
  shortName: string
  color: string
  icon: typeof Brain
  position: number
  tagline: string
  description: string
  techStack: string[]
  nodes: ArchNode[]
  metrics: { label: string; value: string; detail: string }[]
  upstreamFlows: DataFlow[]
  investorNote: string
  linesOfCode: string
  components: string
  aiModules: string
}

const ARCH_LAYERS: ArchLayer[] = [
  {
    id: "presentation",
    name: "What Traders See and Touch",
    shortName: "Interface",
    color: "#10b981",
    icon: Monitor,
    position: 0,
    tagline: "What the trader sees and touches",
    description: "The frontend rendering engine processes 15 distinct page layouts, 340+ unique components, and a custom glass-morphism design system built from scratch. Every UI element is reactive, accessible, and optimized for traders who need sub-100ms visual feedback during live market conditions. The design system enforces consistency across 6 product modules while maintaining each module's unique information architecture.",
    techStack: ["Next.js 15", "React 19", "Framer Motion", "TailwindCSS", "Custom Glass UI", "Radix Primitives"],
    nodes: [
      { name: "Neural Matrix View", type: "ui", desc: "Primary trading workspace with live chart, instrument selector, market state display, and 5-tab AI copilot sidebar", tech: "React + TradingView Widget", throughput: "60fps render @ 50+ instruments" },
      { name: "Execution Copilot View", type: "ui", desc: "Split-screen trade execution with signal header, chart panel, order builder, auto-journal, and social feed", tech: "React + WebSocket streams", throughput: "< 50ms order reflection" },
      { name: "Community Discovery", type: "ui", desc: "15-filter discovery engine with community cards, mentor profiles, inspector panels, and trust verification badges", tech: "React + Virtual Scroll", throughput: "10,000+ communities rendered" },
      { name: "MRKT Intelligence Hub", type: "ui", desc: "6-panel market intelligence dashboard: economic calendar, news feed, sentiment map, sector heat map, central bank tracker, correlation matrix", tech: "React + D3.js overlays", throughput: "6 panels real-time sync" },
      { name: "Journal & Analytics", type: "ui", desc: "Auto-captured trade journal with 18 data points per trade, performance charts, AI review sessions, and streak tracking", tech: "React + Recharts", throughput: "100% auto-capture rate" },
      { name: "Student Hub & Nexus", type: "ui", desc: "Educational workspace with leaderboard, knowledge graph, AI-scored submissions, mentor forecast engine, and share designer", tech: "React + Canvas API", throughput: "Real-time leaderboard" },
    ],
    metrics: [
      { label: "Total Components", value: "340+", detail: "Custom-built from scratch. No templates. Every component designed for trader-specific information density." },
      { label: "Design System Tokens", value: "180+", detail: "Color, spacing, typography, animation, glass-morphism, and shadow tokens ensuring visual consistency across all 6 modules." },
      { label: "Accessibility Score", value: "98/100", detail: "WCAG 2.1 AA compliant. Screen reader support, keyboard navigation, reduced motion support, and high contrast mode." },
      { label: "First Contentful Paint", value: "< 1.2s", detail: "Optimized with React Server Components, dynamic imports, and edge-cached static assets. ISR for data-heavy pages." },
    ],
    upstreamFlows: [
      { from: "AI Engine", to: "UI Layer", data: "Copilot responses, forecasts, sentiment scores", volume: "~2,000 events/min peak", latency: "< 200ms p95" },
      { from: "Data Pipeline", to: "UI Layer", data: "Price feeds, chart data, order status updates", volume: "~5,000 ticks/sec", latency: "< 50ms p95" },
    ],
    investorNote: "The UI layer is the moat's surface area. 340+ custom components represent 18+ months of design iteration that cannot be replicated by bolting a UI onto existing APIs. Every interaction is purpose-built for the trading workflow.",
    linesOfCode: "~120,000",
    components: "340+",
    aiModules: "12 client-side",
  },
  {
    id: "application",
    name: "Workflow Orchestrator",
    shortName: "Orchestrator",
    color: "#3b82f6",
    icon: Workflow,
    position: 1,
    tagline: "The brain that coordinates every action",
    description: "The application layer orchestrates all user actions into coherent workflows. When a trader opens Archio, this layer determines which data to fetch, which AI modules to activate, which community signals to surface, and how to sequence the entire experience. It manages 23 automated data handoffs between pillars, ensuring that a trade signal discovered in the Intelligence Engine flows seamlessly through Execution, into the Journal, and back into the AI model for learning -- without the trader lifting a finger.",
    techStack: ["Next.js API Routes", "Server Actions", "React Server Components", "Middleware Chain", "Event Bus", "State Machines"],
    nodes: [
      { name: "Workflow Orchestrator", type: "service", desc: "Coordinates the 23 automated data handoffs between 6 pillars. Manages state transitions from signal -> analysis -> execution -> journal -> review", tech: "XState + Event Emitters", throughput: "23 handoffs/trade cycle" },
      { name: "Session Manager", type: "service", desc: "Maintains trader context across all modules. Remembers open positions, active analyses, community interactions, and AI conversation history", tech: "Redis-backed sessions", throughput: "< 5ms context retrieval" },
      { name: "Permission Engine", type: "service", desc: "Row-level security enforcement across 9 database tables. Tier-based feature gating for Basic ($19), Pro ($49), Institutional ($99)", tech: "Supabase RLS + Middleware", throughput: "0 unauthorized access events" },
      { name: "Notification Router", type: "service", desc: "Routes alerts from price triggers, AI forecasts, community signals, journal reminders, and risk warnings to the right UI surface", tech: "Push + WebSocket + Email", throughput: "~500 notifications/user/day" },
      { name: "Analytics Collector", type: "data", desc: "Captures every user interaction for product analytics, A/B testing, and AI model training. Anonymized and GDPR-compliant", tech: "Custom event pipeline", throughput: "~2M events/day" },
    ],
    metrics: [
      { label: "API Routes", value: "34+", detail: "REST endpoints covering auth, trading, community, AI, journal, and administration. Rate-limited and authenticated." },
      { label: "Automated Handoffs", value: "23", detail: "Data flows automatically between pillars. Signal -> Chart -> Execute -> Journal -> Review -> AI Learning. Zero manual steps." },
      { label: "Middleware Layers", value: "8", detail: "Auth, RLS, rate limiting, logging, error handling, feature flags, A/B routing, and response compression." },
      { label: "Avg Response Time", value: "< 120ms", detail: "P95 across all API routes. Edge-cached where possible. Database queries optimized with indexes and connection pooling." },
    ],
    upstreamFlows: [
      { from: "UI Layer", to: "App Logic", data: "User actions, form submissions, navigation events", volume: "~200 actions/user/session", latency: "< 10ms" },
      { from: "App Logic", to: "AI Engine", data: "Context packets for AI processing (chart state, portfolio, history)", volume: "~50 AI calls/user/day", latency: "< 100ms context assembly" },
    ],
    investorNote: "The orchestration layer is where Archio's 'operating system' thesis becomes real. Individual tools can't build this because they don't own the full workflow context. This layer sees everything the trader does across all 6 categories simultaneously.",
    linesOfCode: "~45,000",
    components: "34 routes",
    aiModules: "5 orchestration",
  },
  {
    id: "ai-engine",
    name: "Intelligence Engine (AI/ML)",
    shortName: "AI Engine",
    color: "#8b5cf6",
    icon: Brain,
    position: 2,
    tagline: "48 AI modules processing everything",
    description: "The AI engine is Archio's deepest technical moat. It runs 48 distinct AI modules that process market data, news articles, community signals, trader behavior, and portfolio performance simultaneously. Unlike standalone AI trading tools that see only price data, Archio's AI sees the complete context: what the trader is analyzing, what their community is discussing, what macro events are unfolding, and what their historical performance patterns reveal. This multi-modal understanding produces intelligence that no single-category tool can replicate.",
    techStack: ["GPT-4o / Claude 3.5", "Custom Fine-tuned Models", "RAG Pipeline", "Vector DB (Pinecone)", "Sentiment NLP", "Time-Series ML"],
    nodes: [
      { name: "Copilot AI System", type: "ai", desc: "5-tab contextual assistant: Market Brief, Trade Advisor, Risk Scanner, Pattern Detector, Performance Coach. Sees full trader context", tech: "GPT-4o + RAG + Fine-tuned", throughput: "< 2s first token" },
      { name: "Forecast Engine", type: "ai", desc: "Multi-timeframe directional probability forecasts combining technical indicators, sentiment analysis, macro calendar, and historical patterns", tech: "Custom ensemble model", throughput: "50+ instruments updated hourly" },
      { name: "Sentiment Analyzer", type: "ai", desc: "Processes 10,000+ daily articles, 50,000+ social signals, and central bank communications into numerical sentiment scores per instrument", tech: "Fine-tuned NLP + VADER + Custom", throughput: "50,000+ signals/day" },
      { name: "Pattern Recognition", type: "ai", desc: "Computer vision model identifying chart patterns, support/resistance levels, and formation probabilities on live chart data", tech: "CNN + Transfer Learning", throughput: "Real-time on active chart" },
      { name: "Risk Intelligence", type: "ai", desc: "Monitors portfolio exposure, correlation risk, drawdown probability, and position sizing optimization across all connected accounts", tech: "Monte Carlo + VaR models", throughput: "Continuous monitoring" },
      { name: "Journal AI Reviewer", type: "ai", desc: "Analyzes completed trades for behavioral patterns, emotional indicators, strategy adherence, and improvement opportunities", tech: "GPT-4o + Custom scoring", throughput: "Instant post-trade review" },
    ],
    metrics: [
      { label: "AI Modules", value: "48", detail: "Across 6 categories: analysis (12), execution (8), community (6), journaling (10), risk (7), education (5). Each specialized for its domain." },
      { label: "Daily Processed Signals", value: "50,000+", detail: "News articles, social posts, economic data releases, central bank statements, community discussions, and price action events." },
      { label: "Forecast Accuracy", value: "62-68%", detail: "Directional accuracy on 4H+ timeframes. Validated against 24 months of backtested data. Transparent confidence intervals shown to users." },
      { label: "Inference Cost/User", value: "< $0.12/day", detail: "Optimized through response caching, RAG retrieval, batched processing, and tiered model routing (GPT-4o for complex, 3.5 for simple)." },
    ],
    upstreamFlows: [
      { from: "Data Pipeline", to: "AI Engine", data: "Raw market data, news feeds, social signals, economic calendars", volume: "~500GB/day ingested", latency: "< 30s news-to-insight" },
      { from: "App Logic", to: "AI Engine", data: "Trader context, portfolio state, conversation history, journal data", volume: "~50 context packets/user/day", latency: "< 100ms" },
    ],
    investorNote: "The AI engine improves with every user. 1.4M target users generate 700M+ annual trade data points that continuously refine every model. This is a compounding data moat that becomes exponentially harder to replicate over time.",
    linesOfCode: "~35,000",
    components: "48 modules",
    aiModules: "48",
  },
  {
    id: "data-pipeline",
    name: "Market Data Nervous System",
    shortName: "Data Layer",
    color: "#06b6d4",
    icon: Network,
    position: 3,
    tagline: "The nervous system connecting everything",
    description: "The data pipeline is the platform's nervous system -- it ingests, normalizes, routes, and delivers data from dozens of external sources into every layer of the architecture. It handles real-time price feeds from broker APIs, news streams from 200+ publishers, economic calendar data from central banks, social signals from trading communities, and on-chain crypto data from blockchain networks. Every data point is timestamped, validated, normalized, and routed to the correct consumer within milliseconds.",
    techStack: ["WebSocket Streams", "Supabase Realtime", "Redis Pub/Sub", "Webhook Ingestion", "REST Polling", "Event Sourcing"],
    nodes: [
      { name: "Price Feed Aggregator", type: "data", desc: "Aggregates real-time price data from 5+ broker APIs, normalizes into a unified format, and distributes to chart widgets and AI models", tech: "WebSocket multiplexer", throughput: "5,000+ ticks/second" },
      { name: "News Ingestion Engine", type: "data", desc: "Crawls 200+ financial news sources, deduplicates, categorizes by instrument/sector, and pushes to sentiment analyzer and UI", tech: "RSS + API + Webhooks", throughput: "10,000+ articles/day" },
      { name: "Social Signal Collector", type: "data", desc: "Monitors trading communities, forums, and social platforms for sentiment shifts, trending instruments, and community consensus", tech: "API polling + NLP filtering", throughput: "50,000+ signals/day" },
      { name: "Broker Integration Hub", type: "api", desc: "Unified API layer abstracting differences between MT5, cTrader, Interactive Brokers, and 10+ other broker APIs into a single interface", tech: "Adapter pattern + OAuth", throughput: "< 100ms order routing" },
      { name: "Economic Calendar Sync", type: "data", desc: "Real-time economic event data from central banks, BLS, ECB, BOJ. Impact scoring and historical deviation analysis for each release", tech: "REST + WebSocket hybrid", throughput: "200+ events/month tracked" },
    ],
    metrics: [
      { label: "External Integrations", value: "25+", detail: "Broker APIs, news feeds, economic calendars, social platforms, blockchain networks, and authentication providers." },
      { label: "Data Throughput", value: "500GB/day", detail: "Peak capacity for processing raw market data, news content, social signals, and user-generated content simultaneously." },
      { label: "Normalization Rules", value: "400+", detail: "Custom transformation rules that convert disparate data formats into Archio's unified schema. Handles timezone, currency, and unit conversions." },
      { label: "Uptime SLA", value: "99.95%", detail: "Redundant data sources, automatic failover, and circuit breakers ensure continuous data flow even during provider outages." },
    ],
    upstreamFlows: [
      { from: "External APIs", to: "Data Pipeline", data: "Raw price feeds, news articles, economic data, social signals", volume: "~500GB/day", latency: "< 100ms ingestion" },
      { from: "Data Pipeline", to: "Database", data: "Normalized, validated, timestamped data records", volume: "~50M records/day", latency: "< 10ms write" },
    ],
    investorNote: "The data pipeline is the second hardest layer to replicate. Building reliable, real-time integrations with 25+ external sources requires months of edge-case handling, failover logic, and normalization rules that only emerge through production usage.",
    linesOfCode: "~28,000",
    components: "25+ integrations",
    aiModules: "3 data-quality",
  },
  {
    id: "database",
    name: "Trader Data Vault",
    shortName: "Database",
    color: "#f59e0b",
    icon: Database,
    position: 4,
    tagline: "Every user's data is completely isolated -- even we cannot see another trader's records",
    description: "The persistence layer stores every piece of data the platform generates: user profiles, trade histories, AI-generated insights, community relationships, journal entries, account configurations, and analytics events. Built on Supabase (PostgreSQL), it enforces row-level security on every table, ensuring that no user can ever access another user's data -- even if the application layer has a bug. The schema is designed for the unique access patterns of trading software: time-series queries, aggregation pipelines, and real-time subscriptions.",
    techStack: ["Supabase PostgreSQL", "Row-Level Security", "Realtime Subscriptions", "Edge Functions", "PostgREST", "pgvector"],
    nodes: [
      { name: "User & Auth Store", type: "data", desc: "User profiles, authentication records, subscription tiers, preferences, and session data. RLS ensures complete isolation", tech: "Supabase Auth + RLS", throughput: "< 5ms auth check" },
      { name: "Trade & Journal Store", type: "data", desc: "Complete trade history with 18 data points per trade, journal entries, performance metrics, and streak data", tech: "PostgreSQL + Indexes", throughput: "< 10ms trade write" },
      { name: "Community & Social Store", type: "data", desc: "Community profiles, membership records, mentor verifications, signal histories, and trust scores", tech: "PostgreSQL + Full-text search", throughput: "< 15ms community query" },
      { name: "AI Knowledge Base", type: "data", desc: "Vector embeddings for RAG retrieval, AI conversation histories, forecast records, and model training datasets", tech: "pgvector + embeddings", throughput: "< 50ms vector search" },
      { name: "Analytics Event Store", type: "data", desc: "Append-only event log for product analytics, A/B test assignments, and usage pattern analysis", tech: "Partitioned tables + BRIN", throughput: "~2M events/day insert" },
    ],
    metrics: [
      { label: "Tables with RLS", value: "9/9", detail: "100% of tables have row-level security policies. No exceptions. Every query is filtered by the authenticated user's permissions." },
      { label: "Avg Query Time", value: "< 12ms", detail: "P95 across all read queries. Achieved through composite indexes, materialized views, and connection pooling via Supabase." },
      { label: "Backup Frequency", value: "Continuous", detail: "Point-in-time recovery with 30-day retention. WAL streaming ensures zero data loss even during infrastructure failures." },
      { label: "Data Retention", value: "Unlimited", detail: "Trade history and journal data stored indefinitely. Users own their data. Export available in CSV, JSON, and PDF formats." },
    ],
    upstreamFlows: [
      { from: "Data Pipeline", to: "Database", data: "Normalized market data, processed news, user events", volume: "~50M records/day", latency: "< 10ms" },
      { from: "Database", to: "App Logic", data: "Query results, subscription updates, RLS-filtered data", volume: "~1M queries/day", latency: "< 12ms p95" },
    ],
    investorNote: "The database layer represents the platform's institutional memory. Every trade, every AI insight, every community interaction is permanently recorded. This growing dataset is the foundation of the AI moat -- more data means better models means better product.",
    linesOfCode: "~8,000",
    components: "9 tables",
    aiModules: "0 (data layer)",
  },
  {
    id: "infrastructure",
    name: "Security and Deployment Foundation",
    shortName: "Foundation",
    color: "#ef4444",
    icon: Shield,
    position: 5,
    tagline: "The bedrock everything runs on",
    description: "The infrastructure layer provides the deployment, scaling, security, and observability foundation for the entire platform. Built on Vercel's edge network for the frontend and Supabase's managed infrastructure for the backend, it delivers global low-latency performance without the operational overhead of self-managed servers. Security is enforced at every level: TLS encryption in transit, AES-256 at rest, SOC 2-compliant infrastructure, and comprehensive audit logging for every data access.",
    techStack: ["Vercel Edge Network", "Supabase Cloud", "Cloudflare CDN", "GitHub CI/CD", "Sentry Monitoring", "Upstash Redis"],
    nodes: [
      { name: "Edge Deployment", type: "service", desc: "Frontend deployed to 30+ global edge locations. Automatic scaling, zero-downtime deployments, and instant rollbacks", tech: "Vercel Edge Runtime", throughput: "< 50ms TTFB globally" },
      { name: "Auth & Identity", type: "service", desc: "Email/password authentication, magic links, OAuth providers. JWT tokens with 1-hour expiry. Refresh token rotation", tech: "Supabase Auth + JWT", throughput: "< 200ms auth flow" },
      { name: "Rate Limiting & DDoS", type: "service", desc: "Intelligent rate limiting per user, per endpoint, per IP. DDoS protection at the edge with automatic mitigation", tech: "Upstash Redis + Vercel", throughput: "10M+ requests/day capacity" },
      { name: "Monitoring & Alerting", type: "service", desc: "Real-time error tracking, performance monitoring, uptime checks, and automated alerting for anomalies", tech: "Sentry + Custom dashboards", throughput: "< 30s alert latency" },
      { name: "CI/CD Pipeline", type: "service", desc: "Automated testing, linting, type checking, and deployment on every commit. Preview deployments for every PR", tech: "GitHub Actions + Vercel", throughput: "< 3min deploy time" },
    ],
    metrics: [
      { label: "Global Edge Nodes", value: "30+", detail: "Vercel's edge network ensures < 50ms Time-to-First-Byte for users in North America, Europe, and Asia-Pacific." },
      { label: "Security Compliance", value: "SOC 2 Type II", detail: "Infrastructure providers (Vercel, Supabase) maintain SOC 2 Type II certification. Archio inherits and extends these controls." },
      { label: "Deploy Frequency", value: "10+/day", detail: "Continuous deployment pipeline enables rapid iteration. Feature flags allow gradual rollouts and instant kill switches." },
      { label: "Error Rate", value: "< 0.01%", detail: "P99 error rate across all endpoints. Achieved through comprehensive error boundaries, retry logic, and graceful degradation." },
    ],
    upstreamFlows: [
      { from: "All Layers", to: "Infrastructure", data: "Logs, metrics, errors, deployment artifacts", volume: "Continuous", latency: "Real-time" },
      { from: "Infrastructure", to: "All Layers", data: "TLS, auth tokens, rate limit decisions, config", volume: "Every request", latency: "< 5ms overhead" },
    ],
    investorNote: "Infrastructure is a commodity -- deliberately. By building on Vercel + Supabase, Archio avoids the capital drain of managing servers and instead invests engineering hours into the product layers that create differentiation and defensibility.",
    linesOfCode: "~5,000",
    components: "CI/CD + Config",
    aiModules: "1 anomaly detection",
  },
]

/* ── Inter-layer flow connections ─────────────────────────────────── */

const LAYER_FLOWS = [
  { from: "presentation", to: "application", label: "User actions & events", color: "#10b981" },
  { from: "application", to: "ai-engine", label: "Context packets & prompts", color: "#3b82f6" },
  { from: "application", to: "data-pipeline", label: "Data requests & writes", color: "#3b82f6" },
  { from: "ai-engine", to: "data-pipeline", label: "Model queries & training data", color: "#8b5cf6" },
  { from: "data-pipeline", to: "database", label: "Normalized records", color: "#06b6d4" },
  { from: "database", to: "infrastructure", label: "Persistence & recovery", color: "#f59e0b" },
  { from: "ai-engine", to: "presentation", label: "AI responses & forecasts", color: "#8b5cf6" },
  { from: "data-pipeline", to: "presentation", label: "Real-time price feeds", color: "#06b6d4" },
]

/* ── Aggregate system stats ───────────────────────────────────────── */

const SYSTEM_STATS = [
  { label: "Total Lines of Code", value: "241,000+", color: "#10b981" },
  { label: "Custom Components", value: "340+", color: "#3b82f6" },
  { label: "AI Modules", value: "48", color: "#8b5cf6" },
  { label: "External Integrations", value: "25+", color: "#06b6d4" },
  { label: "Database Tables (RLS)", value: "9/9", color: "#f59e0b" },
  { label: "API Routes", value: "34+", color: "#ef4444" },
]

/* ═══════════════════════════════════════════════════════════════════
   NODE TYPE BADGE
   ═══════════════════════════════════════════════════════════════════ */

function NodeTypeBadge({ type }: { type: ArchNode["type"] }) {
  const config = {
    service: { label: "SVC", bg: "#3b82f610", border: "#3b82f625", color: "#3b82f690" },
    ai: { label: "AI", bg: "#8b5cf610", border: "#8b5cf625", color: "#8b5cf690" },
    data: { label: "DATA", bg: "#06b6d410", border: "#06b6d425", color: "#06b6d490" },
    api: { label: "API", bg: "#f59e0b10", border: "#f59e0b25", color: "#f59e0b90" },
    ui: { label: "UI", bg: "#10b98110", border: "#10b98125", color: "#10b98190" },
  }[type]
  return (
    <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded" style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color }}>
      {config.label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   LAYER STACK ITEM — the vertical stack card for each layer
   ═══════════════════════════════════════════════════════════════════ */

function LayerStackItem({ layer, isActive, onClick, index }: { layer: ArchLayer; isActive: boolean; onClick: () => void; index: number }) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const Icon = layer.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Layer header bar -- always visible */}
      <button
        onClick={onClick}
        className="w-full text-left rounded-xl px-4 py-3 transition-all duration-500 outline-none group/layer"
        style={{
          background: isActive ? `${layer.color}0a` : "rgba(255,255,255,0.02)",
          border: `1px solid ${isActive ? `${layer.color}25` : "rgba(255,255,255,0.06)"}`,
          boxShadow: isActive ? `0 0 30px ${layer.color}08, inset 0 1px 0 ${layer.color}10` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Layer index + icon */}
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300" style={{ background: `${layer.color}${isActive ? "12" : "06"}`, border: `1px solid ${layer.color}${isActive ? "25" : "10"}` }}>
            <Icon className="w-4 h-4" style={{ color: `${layer.color}${isActive ? "cc" : "60"}` }} />
          </div>

          {/* Name + tagline */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded" style={{ background: `${layer.color}08`, color: `${layer.color}60` }}>L{index}</span>
              <span className="text-xs font-black text-white">{layer.name}</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">{layer.tagline}</div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden md:block">
              <div className="text-[10px] font-bold font-mono text-white">{layer.linesOfCode}</div>
              <div className="text-[8px] text-zinc-500 uppercase">lines</div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-[10px] font-bold font-mono" style={{ color: layer.color }}>{layer.aiModules}</div>
              <div className="text-[8px] text-zinc-500 uppercase">ai modules</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ color: `${layer.color}40`, transform: isActive ? "rotate(180deg)" : "" }} />
          </div>
        </div>
      </button>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-3 pb-4">
              {/* Description */}
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">{layer.description}</p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {layer.techStack.map(t => (
                  <span key={t} className="text-[9px] font-bold px-2.5 py-1 rounded-md" style={{ background: `${layer.color}08`, border: `1px solid ${layer.color}15`, color: `${layer.color}80` }}>{t}</span>
                ))}
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {layer.metrics.map((m, mi) => (
                  <div key={mi} className="rounded-lg p-2.5 group/met cursor-default" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="text-sm font-black font-mono text-white">{m.value}</div>
                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">{m.label}</div>
                    <div className="text-[8px] text-zinc-500 leading-relaxed mt-1 opacity-0 group-hover/met:opacity-100 transition-opacity duration-300">{m.detail}</div>
                  </div>
                ))}
              </div>

              {/* Node graph */}
              <div className="mb-3">
                <div className="text-[8px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: `${layer.color}25` }}>Internal Components</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  {layer.nodes.map((node, ni) => (
                    <motion.div
                      key={ni}
                      className="rounded-lg px-3 py-2.5 cursor-default transition-all duration-300"
                      style={{
                        background: hoveredNode === ni ? `${layer.color}04` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${hoveredNode === ni ? `${layer.color}15` : "rgba(255,255,255,0.05)"}`,
                      }}
                      onMouseEnter={() => setHoveredNode(ni)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <NodeTypeBadge type={node.type} />
                        <span className="text-[9px] font-bold text-zinc-300">{node.name}</span>
                      </div>
                      <p className="text-[8px] text-zinc-500 leading-relaxed mb-1">{node.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[7px] font-mono" style={{ color: `${layer.color}40` }}>{node.tech}</span>
                        <span className="text-[7px] font-mono text-zinc-600">{node.throughput}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Data flows */}
              <div className="mb-3">
                <div className="text-[8px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: `${layer.color}25` }}>Data Flows</div>
                <div className="flex flex-col gap-1">
                  {layer.upstreamFlows.map((flow, fi) => (
                    <div key={fi} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-[8px] font-bold text-zinc-500 w-20 flex-shrink-0">{flow.from}</span>
                      <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: `${layer.color}30` }} />
                      <span className="text-[8px] font-bold text-zinc-500 w-20 flex-shrink-0">{flow.to}</span>
                      <span className="text-[8px] text-zinc-600 flex-1">{flow.data}</span>
                      <span className="text-[7px] font-mono" style={{ color: `${layer.color}40` }}>{flow.volume}</span>
                      <span className="text-[7px] font-mono text-zinc-700">{flow.latency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investor note */}
              <div className="rounded-lg p-3" style={{ background: `${layer.color}03`, border: `1px solid ${layer.color}08` }}>
                <div className="text-[7px] uppercase tracking-[0.15em] font-bold mb-1" style={{ color: `${layer.color}25` }}>Investor Note</div>
                <p className="text-[9px] leading-relaxed" style={{ color: `${layer.color}60` }}>{layer.investorNote}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FLOW ANIMATION — animated data flow between layers
   ═══════════════════════════════════════════════════════════════════ */

function FlowAnimation({ activeLayer }: { activeLayer: string | null }) {
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % LAYER_FLOWS.length), 1800)
    return () => clearInterval(t)
  }, [])

  const relevantFlows = activeLayer
    ? LAYER_FLOWS.filter(f => f.from === activeLayer || f.to === activeLayer)
    : LAYER_FLOWS

  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.008)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-[8px] uppercase tracking-[0.15em] font-bold mb-2.5" style={{ color: "rgba(148,163,184,0.2)" }}>
        {activeLayer ? `Data Flows: ${ARCH_LAYERS.find(l => l.id === activeLayer)?.shortName}` : "Inter-Layer Data Flow Map"}
      </div>
      <div className="flex flex-col gap-1">
        {relevantFlows.map((flow, fi) => {
          const isActive = pulse === fi % LAYER_FLOWS.length
          const fromLayer = ARCH_LAYERS.find(l => l.id === flow.from)
          const toLayer = ARCH_LAYERS.find(l => l.id === flow.to)
          return (
            <motion.div
              key={fi}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-500"
              style={{
                background: isActive ? `${flow.color}06` : "transparent",
                border: `1px solid ${isActive ? `${flow.color}15` : "rgba(255,255,255,0.035)"}`,
              }}
            >
              <span className="text-[8px] font-bold w-16 flex-shrink-0" style={{ color: fromLayer?.color || flow.color }}>{fromLayer?.shortName || flow.from}</span>
              <motion.div className="flex items-center gap-1 flex-shrink-0" animate={{ opacity: isActive ? [0.3, 1, 0.3] : 0.2 }} transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}>
                <div className="w-4 h-px" style={{ background: `${flow.color}30` }} />
                <ArrowRight className="w-2.5 h-2.5" style={{ color: `${flow.color}50` }} />
                <div className="w-4 h-px" style={{ background: `${flow.color}30` }} />
              </motion.div>
              <span className="text-[8px] font-bold w-16 flex-shrink-0" style={{ color: toLayer?.color || flow.color }}>{toLayer?.shortName || flow.to}</span>
              <span className="text-[8px] text-zinc-500 flex-1 truncate">{flow.label}</span>
              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: flow.color, boxShadow: `0 0 6px ${flow.color}60` }} />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT — PLATFORM ARCHITECTURE SLIDE
   ═══════════════════════════════════════════════════════════════════ */

export function PlatformArchitectureSlide({ accent }: { accent: string }) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [showFlows, setShowFlows] = useState(false)

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1220 0%, #080e1a 50%, #0a0f18 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "-15%", right: "5%", background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)" }} animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-10%", left: "10%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }} animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ARCH_LAYERS.map((l, i) => (
          <motion.div
            key={l.id}
            className="absolute rounded-full"
            style={{
              width: 200, height: 200,
              left: `${5 + i * 16}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: `radial-gradient(circle, ${l.color}04, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.3, 1], opacity: activeLayer === l.id ? [0.4, 0.8, 0.4] : [0.1, 0.2, 0.1] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div className="w-2 h-2 rounded-full" style={{ background: accent }} animate={{ boxShadow: [`0 0 4px ${accent}40`, `0 0 12px ${accent}60`, `0 0 4px ${accent}40`] }} transition={{ duration: 2, repeat: Infinity }} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-black" style={{ color: `${accent}70` }}>Platform Architecture</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}20, transparent)` }} />
          <span className="text-[9px] text-zinc-500 font-mono font-bold">6 layers</span>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-white mb-1.5 text-balance">A vertically integrated system, not a tool wrapper.</h2>
        <p className="text-[12px] text-zinc-400 leading-relaxed mb-5 max-w-2xl">
          Six architectural layers, each built for the trading workflow. Every layer shares context with every other. When a trader clicks Buy, all six coordinate in under one second. Click any layer to explore.
        </p>

        {/* Vertical layer stack */}
        <div className="flex flex-col gap-1.5 mb-4">
          {ARCH_LAYERS.map((layer, i) => (
            <div key={layer.id}>
              <LayerStackItem
                layer={layer}
                isActive={activeLayer === layer.id}
                onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                index={i}
              />
              {/* Flow indicator between layers */}
              {i < ARCH_LAYERS.length - 1 && (
                <div className="flex items-center justify-center py-0.5">
                  <motion.div
                    className="flex flex-col items-center"
                    animate={{ opacity: activeLayer ? (activeLayer === layer.id || activeLayer === ARCH_LAYERS[i + 1]?.id ? 1 : 0.15) : 0.3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-px h-2" style={{ background: `${layer.color}30` }} />
                    <ArrowDown className="w-2.5 h-2.5" style={{ color: `${layer.color}35` }} />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Data flow toggle + animation */}
        <button
          onClick={() => setShowFlows(!showFlows)}
          className="text-[9px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all duration-300 mb-3 outline-none"
          style={{
            background: showFlows ? `${accent}08` : "rgba(255,255,255,0.03)",
            border: `1px solid ${showFlows ? `${accent}20` : "rgba(255,255,255,0.06)"}`,
            color: showFlows ? `${accent}80` : "rgba(148,163,184,0.4)",
            boxShadow: showFlows ? `0 0 12px ${accent}10` : "none",
          }}
        >
          {showFlows ? "Hide" : "Show"} Inter-Layer Data Flow Map ({LAYER_FLOWS.length} connections)
        </button>

        <AnimatePresence>
          {showFlows && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mb-3"
            >
              <FlowAnimation activeLayer={activeLayer} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product bridge */}
        <div className="rounded-xl p-4" style={{ background: `${accent}05`, border: `1px solid ${accent}12`, boxShadow: `0 0 20px ${accent}06` }}>
          <p className="text-[12px] font-semibold leading-relaxed" style={{ color: `${accent}80` }}>
            You have seen the engine. The next four slides show the driving experience -- each product module running on top of this architecture.
          </p>
        </div>
      </div>
    </div>
  )
}
