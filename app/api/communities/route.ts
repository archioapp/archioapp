import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/* ── Rich mock data so the page always has life ── */
const MOCK_COMMUNITIES = [
  {
    id: "a1-london", name: "London Precision Lab", slug: "london-precision-lab",
    tagline: "Institutional-grade London session execution with AI mentor intelligence",
    description: "Elite London session forex community focused on institutional order flow and precision entries. Our custom Archio AI model is trained on 3 years of live call recordings and proprietary supply & demand frameworks.",
    asset_class: "forex", trading_style: "day_trading", session_focus: "london", visibility: "paid",
    has_archio_ai_models: true, ai_models_description: "Our AI model is trained on 3+ years of live call recordings, strategy breakdowns, and trade reviews. It can explain setups, review your trade ideas, and provide 24/7 mentorship support in the mentor's voice and methodology.",
    has_live_calls: true, has_mentor_dashboard: true, verified: true, beginner_friendly: false,
    members_count: 156, active_members: 89, weekly_activity: 87, posts_per_week: 34,
    is_live_now: true, live_session_title: "London Session Live Analysis - GBP/USD & EUR/USD", live_attendee_count: 34,
    tags: ["forex", "london", "order-flow", "institutional", "precision"],
    weekly_heatmap: [78, 92, 88, 95, 82, 30, 15],
    who_is_for: "Traders with 6+ months experience who want to specialize in London session forex.",
    who_is_not_for: "Complete beginners or traders looking for signals only.",
    community_mentors: [
      { id: "m1", display_name: "Marcus Webb", title: "Head London Analyst", verified: true, rating: 4.92, total_students: 340, is_lead: true, years_experience: 12, specialties: ["Order Flow", "Supply & Demand", "Institutional"] },
      { id: "m2", display_name: "Sarah Chen", title: "Senior Forex Strategist", verified: true, rating: 4.78, total_students: 180, is_lead: false, years_experience: 8, specialties: ["Macro Analysis", "Correlations"] },
    ],
  },
  {
    id: "a2-scalp", name: "Scalp Velocity", slug: "scalp-velocity",
    tagline: "Ultra-fast crypto scalping with real-time execution breakdowns",
    description: "High-intensity crypto scalping community running 24/7 across all major exchanges.",
    asset_class: "crypto", trading_style: "scalping", session_focus: "multi_session", visibility: "paid",
    has_archio_ai_models: true, ai_models_description: "The Scalp Velocity AI analyzes live order book data and provides real-time commentary on volume clusters, absorption patterns, and potential scalp zones.",
    has_live_calls: true, has_mentor_dashboard: true, verified: true, beginner_friendly: false,
    members_count: 312, active_members: 203, weekly_activity: 94, posts_per_week: 67,
    is_live_now: false, tags: ["crypto", "scalping", "high-frequency", "risk-management"],
    weekly_heatmap: [90, 88, 95, 92, 89, 85, 72],
    who_is_for: "Experienced traders comfortable with fast execution.",
    who_is_not_for: "Swing traders or those who cannot handle rapid decision-making.",
    community_mentors: [
      { id: "m3", display_name: "Alex Mercer", title: "Chief Scalp Operator", verified: true, rating: 4.85, total_students: 520, is_lead: true, years_experience: 7, specialties: ["Tape Reading", "Volume Profile", "Order Book"] },
    ],
  },
  {
    id: "a3-foundation", name: "Foundation Academy", slug: "foundation-academy",
    tagline: "Your first 90 days in trading, guided by mentors who care about your success",
    description: "The most supportive beginner trading community on the platform. Structured 12-week curriculum covering price action, risk management, psychology, and your first live trades.",
    asset_class: "mixed", trading_style: "mixed", session_focus: "multi_session", visibility: "public",
    has_archio_ai_models: false, has_live_calls: true, has_mentor_dashboard: true, verified: true, beginner_friendly: true,
    members_count: 534, active_members: 145, weekly_activity: 72, posts_per_week: 23,
    is_live_now: false, tags: ["education", "beginner", "curriculum", "price-action", "psychology"],
    weekly_heatmap: [65, 72, 78, 82, 75, 40, 28],
    who_is_for: "Complete beginners who want a structured, safe environment to learn trading from zero.",
    who_is_not_for: "Experienced traders looking for advanced strategies.",
    community_mentors: [
      { id: "m4", display_name: "Dr. Emily Foster", title: "Head of Education", verified: true, rating: 4.96, total_students: 534, is_lead: true, years_experience: 15, specialties: ["Price Action", "Psychology", "Risk Management"] },
      { id: "m5", display_name: "James Rivera", title: "Beginner Coach", verified: true, rating: 4.88, total_students: 280, is_lead: false, years_experience: 5, specialties: ["Beginner Education", "Chart Basics"] },
    ],
  },
  {
    id: "a4-macro", name: "Macro Swing Collective", slug: "macro-swing-collective",
    tagline: "Macro-driven swing trading for patient, disciplined traders",
    description: "Patient, macro-driven swing trading community for serious traders. Weekly deep-dive sessions analyzing global macro events, intermarket correlations, and multi-week position management.",
    asset_class: "forex", trading_style: "swing", session_focus: "multi_session", visibility: "paid",
    has_archio_ai_models: true, ai_models_description: "Our macro AI model tracks 200+ economic indicators, central bank communications, and geopolitical events to provide context-aware analysis of your swing trade ideas.",
    has_live_calls: true, has_mentor_dashboard: true, verified: true, beginner_friendly: false,
    members_count: 87, active_members: 42, weekly_activity: 65, posts_per_week: 12,
    is_live_now: false, tags: ["swing", "macro", "commodities", "forex", "intermarket"],
    weekly_heatmap: [45, 50, 55, 48, 52, 35, 20],
    who_is_for: "Intermediate to advanced traders who think in weekly and monthly timeframes.",
    who_is_not_for: "Scalpers, day traders who can't hold positions overnight.",
    community_mentors: [
      { id: "m6", display_name: "Robert Blackwell", title: "Macro Strategist", verified: true, rating: 4.91, total_students: 87, is_lead: true, years_experience: 18, specialties: ["Macro Economics", "Central Banks", "Intermarket"] },
    ],
  },
  {
    id: "a5-wallst", name: "Wall Street Edge", slug: "wall-street-edge",
    tagline: "Institutional-grade US equities and options analysis with live pre-market calls",
    description: "Professional New York session community focused on US equities and options flow.",
    asset_class: "stocks", trading_style: "day_trading", session_focus: "new_york", visibility: "paid",
    has_archio_ai_models: false, has_live_calls: true, has_mentor_dashboard: true, verified: true, beginner_friendly: false,
    members_count: 124, active_members: 67, weekly_activity: 81, posts_per_week: 29,
    is_live_now: true, live_session_title: "Pre-Market Analysis - SPY, NVDA, TSLA Focus", live_attendee_count: 28,
    tags: ["stocks", "options", "new-york", "equities", "flow"],
    weekly_heatmap: [85, 88, 82, 90, 87, 25, 10],
    who_is_for: "Traders focused on US equities and options who want pre-market analysis.",
    who_is_not_for: "Forex-only or crypto-only traders.",
    community_mentors: [
      { id: "m7", display_name: "Michael Torres", title: "Options Flow Specialist", verified: true, rating: 4.87, total_students: 124, is_lead: true, years_experience: 14, specialties: ["Options Flow", "Market Structure", "Pre-Market"] },
    ],
  },
  {
    id: "a6-discipline", name: "Discipline Circle", slug: "discipline-circle",
    tagline: "Maximum 50 traders. Maximum accountability. Zero noise.",
    description: "Small, serious trading accountability circle. No signals, no hype. Daily journal sharing, weekly peer reviews, and monthly performance retrospectives.",
    asset_class: "mixed", trading_style: "mixed", session_focus: "multi_session", visibility: "public",
    has_archio_ai_models: false, has_live_calls: false, has_mentor_dashboard: false, verified: true, beginner_friendly: true,
    members_count: 47, active_members: 38, weekly_activity: 58, posts_per_week: 18,
    is_live_now: false, tags: ["accountability", "journal", "discipline", "mindset", "peer"],
    weekly_heatmap: [70, 75, 72, 78, 74, 55, 45],
    who_is_for: "Traders at any level serious about building discipline and consistency.",
    who_is_not_for: "Traders looking for signals, tips, or quick wins.",
    community_mentors: [],
  },
  {
    id: "a7-tokyo", name: "Tokyo Flow", slug: "tokyo-flow",
    tagline: "The only serious Asia session trading community on the platform",
    description: "Asia session specialist community for futures and forex covering Nikkei, gold, yen pairs, and Asian market microstructure.",
    asset_class: "futures", trading_style: "day_trading", session_focus: "asia", visibility: "paid",
    has_archio_ai_models: true, ai_models_description: "Our AI understands Asian market structure, BOJ policy nuances, and yen correlation patterns.",
    has_live_calls: true, has_mentor_dashboard: true, verified: true, beginner_friendly: false,
    members_count: 98, active_members: 54, weekly_activity: 73, posts_per_week: 21,
    is_live_now: false, tags: ["asia", "futures", "tokyo", "gold", "yen"],
    weekly_heatmap: [82, 78, 85, 80, 76, 45, 30],
    who_is_for: "Traders in Asian time zones or those wanting exposure to Tokyo/Sydney sessions.",
    who_is_not_for: "Traders exclusively focused on London or NY sessions.",
    community_mentors: [
      { id: "m8", display_name: "Kenji Tanaka", title: "Asia Session Lead", verified: true, rating: 4.83, total_students: 98, is_lead: true, years_experience: 10, specialties: ["Asia Session", "Yen Pairs", "Nikkei", "Gold"] },
    ],
  },
  {
    id: "a8-neural", name: "Neural Trading Lab", slug: "neural-trading-lab",
    tagline: "Where traders and AI engineers build the future of intelligent trading systems",
    description: "Experimental community at the intersection of AI and trading. Building, testing, and deploying custom trading AI models.",
    asset_class: "mixed", trading_style: "mixed", session_focus: "multi_session", visibility: "paid",
    has_archio_ai_models: true, ai_models_description: "Multiple AI models including a market regime classifier, sentiment analyzer, and custom backtesting AI.",
    has_live_calls: true, has_mentor_dashboard: true, verified: true, beginner_friendly: false,
    members_count: 64, active_members: 37, weekly_activity: 69, posts_per_week: 15,
    is_live_now: false, tags: ["ai", "quantitative", "machine-learning", "backtesting", "experimental"],
    weekly_heatmap: [55, 60, 68, 72, 65, 40, 25],
    who_is_for: "Traders with programming skills interested in quantitative and AI-driven approaches.",
    who_is_not_for: "Traders looking for manual chart-based strategies.",
    community_mentors: [
      { id: "m9", display_name: "Dr. Priya Sharma", title: "Quant Research Lead", verified: true, rating: 4.79, total_students: 64, is_lead: true, years_experience: 9, specialties: ["Machine Learning", "Backtesting", "Python", "Quant"] },
    ],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const assetClass = searchParams.get("asset_class") || ""
  const tradingStyle = searchParams.get("trading_style") || ""
  const sessionFocus = searchParams.get("session_focus") || ""
  const hasAi = searchParams.get("has_ai") === "true"
  const hasLiveCalls = searchParams.get("has_live_calls") === "true"
  const verified = searchParams.get("verified") === "true"
  const beginnerFriendly = searchParams.get("beginner_friendly") === "true"
  const visibility = searchParams.get("visibility") || ""
  const hasMentorDashboard = searchParams.get("has_mentor_dashboard") === "true"
  const sortBy = searchParams.get("sort_by") || "activity"

  try {
    const supabase = await createClient()

    let query = supabase
      .from("groups")
      .select(`
        *,
        community_mentors (
          id, display_name, title, avatar_url, specialties, asset_focus,
          trading_style, verified, rating, total_students, is_lead,
          mentor_role, years_experience
        )
      `)

    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tagline.ilike.%${search}%`)
    if (assetClass) query = query.eq("asset_class", assetClass)
    if (tradingStyle) query = query.eq("trading_style", tradingStyle)
    if (sessionFocus) query = query.eq("session_focus", sessionFocus)
    if (hasAi) query = query.eq("has_archio_ai_models", true)
    if (hasLiveCalls) query = query.eq("has_live_calls", true)
    if (verified) query = query.eq("verified", true)
    if (beginnerFriendly) query = query.eq("beginner_friendly", true)
    if (hasMentorDashboard) query = query.eq("has_mentor_dashboard", true)
    if (visibility) query = query.eq("visibility", visibility)

    switch (sortBy) {
      case "activity": query = query.order("weekly_activity", { ascending: false }); break
      case "members": query = query.order("members_count", { ascending: false, nullsFirst: false }); break
      case "rating": query = query.order("verified", { ascending: false }); break
      case "newest": query = query.order("created_at", { ascending: false }); break
      default: query = query.order("weekly_activity", { ascending: false })
    }

    query = query.limit(50)
    const { data, error } = await query

    if (error) {
      console.log("[v0] Communities: groups table not found, using mock data")
      return NextResponse.json({ communities: filterMock(MOCK_COMMUNITIES, { search, assetClass, tradingStyle, sessionFocus, hasAi, hasLiveCalls, verified, beginnerFriendly, hasMentorDashboard, visibility, sortBy }), source: "mock" })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ communities: filterMock(MOCK_COMMUNITIES, { search, assetClass, tradingStyle, sessionFocus, hasAi, hasLiveCalls, verified, beginnerFriendly, hasMentorDashboard, visibility, sortBy }), source: "mock" })
    }

    return NextResponse.json({ communities: data, source: "db" })
  } catch (err) {
    console.log("[v0] Communities: DB unavailable, using mock data")
    return NextResponse.json({ communities: filterMock(MOCK_COMMUNITIES, { search, assetClass: "", tradingStyle: "", sessionFocus: "", hasAi: false, hasLiveCalls: false, verified: false, beginnerFriendly: false, hasMentorDashboard: false, visibility: "", sortBy: "activity" }), source: "mock" })
  }
}

function filterMock(data: any[], f: any) {
  let result = [...data]
  if (f.search) {
    const s = f.search.toLowerCase()
    result = result.filter((c: any) => c.name.toLowerCase().includes(s) || c.description?.toLowerCase().includes(s) || c.tagline?.toLowerCase().includes(s) || c.tags?.some((t: string) => t.includes(s)))
  }
  if (f.assetClass) result = result.filter((c: any) => c.asset_class === f.assetClass)
  if (f.tradingStyle) result = result.filter((c: any) => c.trading_style === f.tradingStyle)
  if (f.sessionFocus) result = result.filter((c: any) => c.session_focus === f.sessionFocus)
  if (f.hasAi) result = result.filter((c: any) => c.has_archio_ai_models)
  if (f.hasLiveCalls) result = result.filter((c: any) => c.has_live_calls)
  if (f.verified) result = result.filter((c: any) => c.verified)
  if (f.beginnerFriendly) result = result.filter((c: any) => c.beginner_friendly)
  if (f.hasMentorDashboard) result = result.filter((c: any) => c.has_mentor_dashboard)
  if (f.visibility) result = result.filter((c: any) => c.visibility === f.visibility)
  if (f.sortBy === "members") result.sort((a: any, b: any) => (b.members_count || 0) - (a.members_count || 0))
  else result.sort((a: any, b: any) => (b.weekly_activity || 0) - (a.weekly_activity || 0))
  return result
}
