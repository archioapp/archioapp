-- ══════════════════════════════════════════════════════════════════════
-- SEED: Rich Community Discovery Data
-- Purpose: Populate the community discovery page with diverse,
-- realistic trading communities that showcase all capabilities.
-- ══════════════════════════════════════════════════════════════════════

-- First add members_count column if it doesn't exist
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS members_count INTEGER DEFAULT 0;

-- Upsert 8 diverse communities
INSERT INTO public.groups (
  id, name, slug, description, tags, visibility, owner_id,
  asset_class, trading_style, risk_profile, session_focus, language, timezone,
  beginner_friendly, tagline, strategy_focus, discipline,
  has_archio_ai_models, ai_models_description, has_mentor_dashboard, has_live_calls,
  verified, moderated, scam_protection,
  who_is_for, who_is_not_for,
  weekly_activity, posts_per_week, active_members, members_count, member_streaks,
  is_live_now, live_session_title, live_attendee_count,
  weekly_heatmap, accent_color
) VALUES
-- 1. Premium AI-powered forex community
(
  'a1000000-0000-0000-0000-000000000001',
  'London Precision Lab',
  'london-precision-lab',
  'Elite London session forex community focused on institutional order flow and precision entries. Our custom Archio AI model is trained on 3 years of live call recordings and proprietary supply & demand frameworks.',
  ARRAY['forex', 'london', 'order-flow', 'institutional', 'precision'],
  'paid', '00000000-0000-0000-0000-000000000000',
  'forex', 'day_trading', 'balanced', 'london', 'en', 'Europe/London',
  false,
  'Institutional-grade London session execution with AI mentor intelligence',
  'Supply & Demand + Order Flow',
  'High - daily journal reviews required',
  true,
  'Our AI model is trained on 3+ years of live call recordings, strategy breakdowns, and trade reviews. It can explain setups, review your trade ideas, and provide 24/7 mentorship support in the mentor''s voice and methodology.',
  true, true,
  true, true, true,
  'Traders with 6+ months experience who want to specialize in London session forex. Those seeking precision entries and institutional-level analysis with AI-powered 24/7 support.',
  'Complete beginners or traders looking for signals only. This is an education and execution environment, not a copy-trading service.',
  87, 34, 89, 156, 45,
  true, 'London Session Live Analysis - GBP/USD & EUR/USD', 34,
  '[78,92,88,95,82,30,15]'::jsonb, NULL
),
-- 2. Crypto scalping community
(
  'a1000000-0000-0000-0000-000000000002',
  'Scalp Velocity',
  'scalp-velocity',
  'High-intensity crypto scalping community running 24/7 across all major exchanges. Focus on 1m-5m setups with strict risk management. Real-time signal sharing with execution breakdowns.',
  ARRAY['crypto', 'scalping', 'high-frequency', 'risk-management'],
  'paid', '00000000-0000-0000-0000-000000000000',
  'crypto', 'scalping', 'aggressive', 'multi_session', 'en', 'UTC',
  false,
  'Ultra-fast crypto scalping with real-time execution breakdowns',
  'Tape Reading + Volume Profile',
  'Extreme - position sizing rules enforced',
  true,
  'The Scalp Velocity AI analyzes live order book data and provides real-time commentary on volume clusters, absorption patterns, and potential scalp zones based on the mentor''s methodology.',
  true, true,
  true, true, true,
  'Experienced traders comfortable with fast execution. Those who thrive in high-energy environments and want to master 1m-5m crypto setups.',
  'Swing traders or those who cannot handle rapid decision-making. Not for traders with less than $5k capital.',
  94, 67, 203, 312, 78,
  false, NULL, 0,
  '[90,88,95,92,89,85,72]'::jsonb, NULL
),
-- 3. Beginner-friendly structured education
(
  'a1000000-0000-0000-0000-000000000003',
  'Foundation Academy',
  'foundation-academy',
  'The most supportive beginner trading community on the platform. Structured 12-week curriculum covering price action, risk management, psychology, and your first live trades. No prior experience needed.',
  ARRAY['education', 'beginner', 'curriculum', 'price-action', 'psychology'],
  'public', '00000000-0000-0000-0000-000000000000',
  'mixed', 'mixed', 'conservative', 'multi_session', 'en', 'UTC',
  true,
  'Your first 90 days in trading, guided by mentors who care about your success',
  'Price Action Fundamentals',
  'Moderate - weekly assignments and reflections',
  false, NULL,
  true, true,
  true, true, true,
  'Complete beginners who want a structured, safe environment to learn trading from zero. Those who value patience, proper education, and building real skills before risking real capital.',
  'Experienced traders looking for advanced strategies. Those seeking quick profits or signal services.',
  72, 23, 145, 534, 112,
  false, NULL, 0,
  '[65,72,78,82,75,40,28]'::jsonb, NULL
),
-- 4. Swing trading community
(
  'a1000000-0000-0000-0000-000000000004',
  'Macro Swing Collective',
  'macro-swing-collective',
  'Patient, macro-driven swing trading community for serious traders. Weekly deep-dive sessions analyzing global macro events, intermarket correlations, and multi-week position management across forex and commodities.',
  ARRAY['swing', 'macro', 'commodities', 'forex', 'intermarket'],
  'paid', '00000000-0000-0000-0000-000000000000',
  'forex', 'swing', 'balanced', 'multi_session', 'en', 'America/New_York',
  false,
  'Macro-driven swing trading for patient, disciplined traders',
  'Top-Down Macro Analysis',
  'High - weekly position reports required',
  true,
  'Our macro AI model tracks 200+ economic indicators, central bank communications, and geopolitical events to provide context-aware analysis of your swing trade ideas.',
  true, true,
  true, true, false,
  'Intermediate to advanced traders who think in weekly and monthly timeframes. Those fascinated by macro economics and intermarket analysis.',
  'Scalpers, day traders who can''t hold positions overnight, or traders seeking daily action.',
  65, 12, 42, 87, 28,
  false, NULL, 0,
  '[45,50,55,48,52,35,20]'::jsonb, NULL
),
-- 5. NY session stocks/options community
(
  'a1000000-0000-0000-0000-000000000005',
  'Wall Street Edge',
  'wall-street-edge',
  'Professional New York session community focused on US equities and options flow. Pre-market analysis, opening bell execution, and real-time options chain analysis with institutional-grade tools.',
  ARRAY['stocks', 'options', 'new-york', 'equities', 'flow'],
  'paid', '00000000-0000-0000-0000-000000000000',
  'stocks', 'day_trading', 'balanced', 'new_york', 'en', 'America/New_York',
  false,
  'Institutional-grade US equities and options analysis with live pre-market calls',
  'Options Flow + Market Structure',
  'High - pre-market preparation mandatory',
  false, NULL,
  true, true,
  true, true, true,
  'Traders focused on US equities and options who want pre-market analysis, opening bell strategies, and professional-grade options flow intelligence.',
  'Forex-only or crypto-only traders. Those without understanding of basic options concepts.',
  81, 29, 67, 124, 35,
  true, 'Pre-Market Analysis - SPY, NVDA, TSLA Focus', 28,
  '[85,88,82,90,87,25,10]'::jsonb, NULL
),
-- 6. Peer-led accountability group
(
  'a1000000-0000-0000-0000-000000000006',
  'Discipline Circle',
  'discipline-circle',
  'Small, serious trading accountability circle. No signals, no hype. Daily journal sharing, weekly peer reviews, and monthly performance retrospectives. Maximum 50 members to maintain intimacy and accountability.',
  ARRAY['accountability', 'journal', 'discipline', 'mindset', 'peer'],
  'public', '00000000-0000-0000-0000-000000000000',
  'mixed', 'mixed', 'conservative', 'multi_session', 'en', 'UTC',
  true,
  'Maximum 50 traders. Maximum accountability. Zero noise.',
  'Process Over Outcome',
  'Extreme - daily journal entries required to maintain membership',
  false, NULL,
  false, false,
  true, true, true,
  'Traders at any level who are serious about building discipline, consistency, and self-awareness. Those who believe process matters more than profits.',
  'Traders looking for signals, tips, or quick wins. Those who cannot commit to daily journaling.',
  58, 18, 38, 47, 42,
  false, NULL, 0,
  '[70,75,72,78,74,55,45]'::jsonb, '#10b981'
),
-- 7. Asia session futures community
(
  'a1000000-0000-0000-0000-000000000007',
  'Tokyo Flow',
  'tokyo-flow',
  'Asia session specialist community for futures and forex. Covering Nikkei, gold, yen pairs, and Asian market microstructure. Live calls during Tokyo and Sydney sessions with unique time zone coverage.',
  ARRAY['asia', 'futures', 'tokyo', 'gold', 'yen'],
  'paid', '00000000-0000-0000-0000-000000000000',
  'futures', 'day_trading', 'balanced', 'asia', 'en', 'Asia/Tokyo',
  false,
  'The only serious Asia session trading community on the platform',
  'Asian Market Microstructure',
  'Moderate - session preparation notes required',
  true,
  'Our AI understands Asian market structure, BOJ policy nuances, and yen correlation patterns. Ask it anything about Asia session setups at any time.',
  true, true,
  true, true, false,
  'Traders in Asian time zones or those who want exposure to Tokyo/Sydney sessions. Gold, yen, and Nikkei specialists.',
  'Traders exclusively focused on London or NY sessions with no interest in Asian markets.',
  73, 21, 54, 98, 31,
  false, NULL, 0,
  '[82,78,85,80,76,45,30]'::jsonb, NULL
),
-- 8. AI-forward experimental community
(
  'a1000000-0000-0000-0000-000000000008',
  'Neural Trading Lab',
  'neural-trading-lab',
  'Experimental community at the intersection of AI and trading. Building, testing, and deploying custom trading AI models. Members collaborate on datasets, backtests, and model architectures alongside experienced quant mentors.',
  ARRAY['ai', 'quantitative', 'machine-learning', 'backtesting', 'experimental'],
  'paid', '00000000-0000-0000-0000-000000000000',
  'mixed', 'mixed', 'balanced', 'multi_session', 'en', 'UTC',
  false,
  'Where traders and AI engineers build the future of intelligent trading systems',
  'Machine Learning + Quantitative Analysis',
  'Technical - programming skills expected',
  true,
  'Multiple AI models including a market regime classifier, sentiment analyzer, and custom backtesting AI. Members contribute to and benefit from shared model development.',
  true, true,
  true, true, false,
  'Traders with programming skills interested in quantitative and AI-driven approaches. Those who want to build their own trading models and learn from quant mentors.',
  'Traders looking for manual chart-based strategies or those without basic programming knowledge.',
  69, 15, 37, 64, 19,
  false, NULL, 0,
  '[55,60,68,72,65,40,25]'::jsonb, '#8b5cf6'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  asset_class = EXCLUDED.asset_class,
  trading_style = EXCLUDED.trading_style,
  risk_profile = EXCLUDED.risk_profile,
  session_focus = EXCLUDED.session_focus,
  beginner_friendly = EXCLUDED.beginner_friendly,
  tagline = EXCLUDED.tagline,
  strategy_focus = EXCLUDED.strategy_focus,
  has_archio_ai_models = EXCLUDED.has_archio_ai_models,
  ai_models_description = EXCLUDED.ai_models_description,
  has_mentor_dashboard = EXCLUDED.has_mentor_dashboard,
  has_live_calls = EXCLUDED.has_live_calls,
  verified = EXCLUDED.verified,
  moderated = EXCLUDED.moderated,
  scam_protection = EXCLUDED.scam_protection,
  who_is_for = EXCLUDED.who_is_for,
  who_is_not_for = EXCLUDED.who_is_not_for,
  weekly_activity = EXCLUDED.weekly_activity,
  posts_per_week = EXCLUDED.posts_per_week,
  active_members = EXCLUDED.active_members,
  members_count = EXCLUDED.members_count,
  member_streaks = EXCLUDED.member_streaks,
  is_live_now = EXCLUDED.is_live_now,
  live_session_title = EXCLUDED.live_session_title,
  live_attendee_count = EXCLUDED.live_attendee_count,
  weekly_heatmap = EXCLUDED.weekly_heatmap,
  accent_color = EXCLUDED.accent_color;

-- ── SEED MENTORS ──
INSERT INTO public.community_mentors (
  id, group_id, display_name, title, bio, specialties, asset_focus,
  trading_style, years_experience, verified, rating, total_students,
  total_reviews, is_lead, mentor_role
) VALUES
-- London Precision Lab mentors
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Marcus Webb', 'Head London Analyst',
  'Former institutional trader with 12 years at a top-tier London bank. Specializes in GBP and EUR order flow analysis.',
  ARRAY['Order Flow', 'Supply & Demand', 'Institutional'], ARRAY['forex'],
  'day_trading', 12, true, 4.92, 340, 289, true, 'lead'
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'Sarah Chen', 'Senior Forex Strategist',
  'Quantitative forex analyst specializing in macro-driven setups and cross-pair correlations.',
  ARRAY['Macro Analysis', 'Correlations', 'Risk Management'], ARRAY['forex'],
  'day_trading', 8, true, 4.78, 180, 156, false, 'assistant'
),
-- Scalp Velocity mentors
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000002',
  'Alex Mercer', 'Chief Scalp Operator',
  'Professional crypto scalper with proven track record across BTC, ETH, and SOL. Pioneer of volume profile scalping.',
  ARRAY['Tape Reading', 'Volume Profile', 'Order Book'], ARRAY['crypto'],
  'scalping', 7, true, 4.85, 520, 445, true, 'lead'
),
-- Foundation Academy mentors
(
  'b1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000003',
  'Dr. Emily Foster', 'Head of Education',
  'Former university professor turned trading educator. Designed the Foundation curriculum used by 500+ students.',
  ARRAY['Price Action', 'Psychology', 'Risk Management'], ARRAY['forex', 'stocks'],
  'mixed', 15, true, 4.96, 534, 490, true, 'lead'
),
(
  'b1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000003',
  'James Rivera', 'Beginner Coach',
  'Dedicated to helping complete beginners take their first steps in trading safely and confidently.',
  ARRAY['Beginner Education', 'Chart Basics', 'Demo Trading'], ARRAY['forex', 'stocks'],
  'mixed', 5, true, 4.88, 280, 245, false, 'assistant'
),
-- Macro Swing Collective
(
  'b1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000004',
  'Robert Blackwell', 'Macro Strategist',
  'Global macro specialist with background in hedge fund research. Analyzes central bank policy, geopolitics, and intermarket flows.',
  ARRAY['Macro Economics', 'Central Banks', 'Intermarket'], ARRAY['forex', 'commodities'],
  'swing', 18, true, 4.91, 87, 82, true, 'lead'
),
-- Wall Street Edge
(
  'b1000000-0000-0000-0000-000000000007',
  'a1000000-0000-0000-0000-000000000005',
  'Michael Torres', 'Options Flow Specialist',
  'Ex-floor trader specializing in unusual options activity and institutional flow analysis.',
  ARRAY['Options Flow', 'Market Structure', 'Pre-Market'], ARRAY['stocks', 'options'],
  'day_trading', 14, true, 4.87, 124, 110, true, 'lead'
),
-- Tokyo Flow
(
  'b1000000-0000-0000-0000-000000000008',
  'a1000000-0000-0000-0000-000000000007',
  'Kenji Tanaka', 'Asia Session Lead',
  'Tokyo-based trader with deep expertise in yen pairs, Nikkei futures, and Asian market microstructure.',
  ARRAY['Asia Session', 'Yen Pairs', 'Nikkei', 'Gold'], ARRAY['futures', 'forex'],
  'day_trading', 10, true, 4.83, 98, 85, true, 'lead'
),
-- Neural Trading Lab
(
  'b1000000-0000-0000-0000-000000000009',
  'a1000000-0000-0000-0000-000000000008',
  'Dr. Priya Sharma', 'Quant Research Lead',
  'PhD in Machine Learning applied to financial markets. Published researcher in algorithmic trading systems.',
  ARRAY['Machine Learning', 'Backtesting', 'Python', 'Quant'], ARRAY['stocks', 'futures', 'crypto'],
  'mixed', 9, true, 4.79, 64, 52, true, 'lead'
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  title = EXCLUDED.title,
  specialties = EXCLUDED.specialties,
  verified = EXCLUDED.verified,
  rating = EXCLUDED.rating,
  total_students = EXCLUDED.total_students;

-- ══════════════════════════════════════════════════════════════════════
-- END SEED: 8 communities + 9 mentors seeded for discovery page.
-- ══════════════════════════════════════════════════════════════════════
