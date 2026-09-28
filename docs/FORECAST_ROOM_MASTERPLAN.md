# FORECAST ROOM MASTERPLAN
## The Most Comprehensive Trading Prediction System on Any Platform

**Version:** 1.0
**Status:** PLANNING
**Priority:** HIGH
**Last Updated:** May 2026

---

## EXECUTIVE SUMMARY

The Forecast Room is Archio's prediction verification engine — a system where traders publish directional market calls that are automatically resolved against real market outcomes. Unlike social trading platforms where users self-report results, every forecast in the Archio system is cryptographically timestamped and resolved by price data, creating an unfakeable track record.

This masterplan outlines a complete expansion of the Forecast Room from its current MVP state into a full-featured prediction marketplace with real-time resolution, AI-assisted analysis, mentor review workflows, community challenges, and gamification.

---

## CURRENT STATE ANALYSIS

### What Exists Today

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| ForecastHub | `forecast-hub.tsx` | Built | Main container with tab navigation |
| ForecastFeed | `forecast-feed.tsx` | Built | Card grid with filtering/sorting |
| ForecastMyRecord | `forecast-my-record.tsx` | Partial | Empty state built, no real data |
| ForecastLeaderboard | `forecast-leaderboard.tsx` | Partial | Empty state built, no real data |
| ForecastArchive | `forecast-archive.tsx` | Partial | Calendar view placeholder |
| ForecastSubmitDrawer | `forecast-submit-drawer.tsx` | Built | 2-step form, no backend |
| ForecastDetailDrawer | `forecast-detail-drawer.tsx` | Partial | Basic detail view |
| ForecastTypes | `forecast-types.ts` | Built | Complete type definitions |
| ForecastRoomTemplate | `flight-deck/.../forecast-room.tsx` | Built | Flight Deck integration |

### Current Data Model (Types)

```typescript
ForecastItem {
  id, user, instrument, instrumentType,
  direction (LONG/SHORT), timeframe, entry, stopLoss, takeProfit,
  riskReward, confidence, commentary, invalidation,
  confluences[], status, accuracy, timestamps,
  likes, comments, views, mentorReview?, communityContext?
}

ForecastStatus = active | near_expiry | awaiting_resolution | 
                 resolved_win | resolved_loss | expired | invalidated

LeaderboardEntry {
  rank, user, totalForecasts, resolvedForecasts,
  accuracy, winRate, avgRiskReward, streaks, points, trend
}
```

### What's Missing

1. **Database tables** — No Supabase schema for forecasts
2. **Real-time resolution** — No price feed integration
3. **API routes** — No CRUD operations
4. **RLS policies** — No security rules
5. **Notification system** — No alerts for resolution
6. **Chart screenshots** — No image upload flow
7. **Mentor review workflow** — UI exists but no backend
8. **Community challenges** — Not started
9. **AI analysis** — Not started
10. **Mobile optimization** — Limited

---

## DATABASE SCHEMA

### Core Tables

```sql
-- ══════════════════════════════════════════════════════════════════════
-- FORECASTS TABLE
-- The central prediction record
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Market data
  instrument VARCHAR(20) NOT NULL,
  instrument_type VARCHAR(20) NOT NULL CHECK (instrument_type IN ('Forex', 'Crypto', 'Indices', 'Commodities')),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
  timeframe VARCHAR(10) NOT NULL,
  
  -- Price levels (stored as text to preserve precision)
  entry_price NUMERIC(20, 8) NOT NULL,
  stop_loss NUMERIC(20, 8) NOT NULL,
  take_profit NUMERIC(20, 8) NOT NULL,
  risk_reward NUMERIC(5, 2) GENERATED ALWAYS AS (
    CASE WHEN entry_price = stop_loss THEN NULL
         ELSE ABS(take_profit - entry_price) / ABS(entry_price - stop_loss)
    END
  ) STORED,
  
  -- Conviction and reasoning
  confidence INTEGER NOT NULL CHECK (confidence BETWEEN 10 AND 100),
  commentary TEXT NOT NULL CHECK (char_length(commentary) >= 10),
  invalidation TEXT,
  chart_image_url TEXT,
  
  -- Lifecycle
  status VARCHAR(30) NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'near_expiry', 'awaiting_resolution', 
                      'resolved_win', 'resolved_loss', 'expired', 'invalidated')),
  expires_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolution_price NUMERIC(20, 8),
  resolution_reason TEXT,
  
  -- Engagement
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  
  -- Community context
  community_id UUID REFERENCES communities(id),
  challenge_id UUID REFERENCES forecast_challenges(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Computed accuracy (NULL until resolved, 0-100)
  accuracy_score NUMERIC(5, 2),
  
  -- Indexes
  CONSTRAINT valid_price_levels CHECK (
    (direction = 'LONG' AND stop_loss < entry_price AND take_profit > entry_price) OR
    (direction = 'SHORT' AND stop_loss > entry_price AND take_profit < entry_price)
  )
);

CREATE INDEX idx_forecasts_user ON forecasts(user_id);
CREATE INDEX idx_forecasts_status ON forecasts(status);
CREATE INDEX idx_forecasts_instrument ON forecasts(instrument);
CREATE INDEX idx_forecasts_created ON forecasts(created_at DESC);
CREATE INDEX idx_forecasts_community ON forecasts(community_id);
CREATE INDEX idx_forecasts_expires ON forecasts(expires_at) WHERE status IN ('active', 'near_expiry');

-- ══════════════════════════════════════════════════════════════════════
-- FORECAST CONFLUENCES
-- Technical factors supporting the prediction
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecast_confluences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id UUID REFERENCES forecasts(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('structure', 'liquidity', 'momentum', 'session', 'pattern')),
  strength INTEGER NOT NULL CHECK (strength BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_confluences_forecast ON forecast_confluences(forecast_id);

-- ══════════════════════════════════════════════════════════════════════
-- FORECAST LIKES
-- User engagement tracking
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecast_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  forecast_id UUID REFERENCES forecasts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, forecast_id)
);

-- ══════════════════════════════════════════════════════════════════════
-- FORECAST COMMENTS
-- Discussion threads on predictions
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecast_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id UUID REFERENCES forecasts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES forecast_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1),
  is_mentor_feedback BOOLEAN NOT NULL DEFAULT false,
  rating INTEGER CHECK (rating IS NULL OR (rating BETWEEN 1 AND 10)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_forecast ON forecast_comments(forecast_id);
CREATE INDEX idx_comments_user ON forecast_comments(user_id);

-- ══════════════════════════════════════════════════════════════════════
-- MENTOR REVIEWS
-- Formal mentor feedback on student forecasts
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecast_mentor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id UUID REFERENCES forecasts(id) ON DELETE CASCADE NOT NULL UNIQUE,
  mentor_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10),
  feedback TEXT NOT NULL,
  entry_quality INTEGER CHECK (entry_quality BETWEEN 1 AND 10),
  risk_management INTEGER CHECK (risk_management BETWEEN 1 AND 10),
  thesis_clarity INTEGER CHECK (thesis_clarity BETWEEN 1 AND 10),
  confluence_quality INTEGER CHECK (confluence_quality BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mentor_reviews_mentor ON forecast_mentor_reviews(mentor_id);

-- ══════════════════════════════════════════════════════════════════════
-- FORECAST VIEWS
-- Track unique views for analytics
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecast_views (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  forecast_id UUID REFERENCES forecasts(id) ON DELETE CASCADE NOT NULL,
  anonymous_id TEXT, -- For non-authenticated users
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (COALESCE(user_id::text, anonymous_id), forecast_id)
);

-- ══════════════════════════════════════════════════════════════════════
-- FORECAST CHALLENGES
-- Community prediction competitions
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecast_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Challenge rules
  instrument VARCHAR(20), -- NULL = any instrument
  instrument_type VARCHAR(20),
  min_confidence INTEGER DEFAULT 50,
  max_entries_per_user INTEGER DEFAULT 3,
  
  -- Timeline
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  resolution_deadline TIMESTAMPTZ NOT NULL,
  
  -- Prizes (could be XP, badges, or real rewards)
  prize_pool JSONB, -- { "1st": { "xp": 500, "badge": "challenge_winner" }, ... }
  
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming' 
    CHECK (status IN ('upcoming', 'active', 'resolving', 'completed', 'cancelled')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_challenges_community ON forecast_challenges(community_id);
CREATE INDEX idx_challenges_status ON forecast_challenges(status);

-- ══════════════════════════════════════════════════════════════════════
-- USER FORECAST STATS
-- Materialized aggregate stats for leaderboard/profile
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE user_forecast_stats (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  
  total_forecasts INTEGER NOT NULL DEFAULT 0,
  resolved_forecasts INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  active_forecasts INTEGER NOT NULL DEFAULT 0,
  
  win_rate NUMERIC(5, 2) GENERATED ALWAYS AS (
    CASE WHEN resolved_forecasts > 0 
         THEN (wins::NUMERIC / resolved_forecasts) * 100 
         ELSE 0 END
  ) STORED,
  
  avg_risk_reward NUMERIC(5, 2),
  avg_confidence NUMERIC(5, 2),
  avg_accuracy NUMERIC(5, 2),
  
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  
  -- XP/Points for gamification
  forecast_xp INTEGER NOT NULL DEFAULT 0,
  
  -- Best/worst instruments
  best_instrument VARCHAR(20),
  best_instrument_win_rate NUMERIC(5, 2),
  worst_instrument VARCHAR(20),
  worst_instrument_win_rate NUMERIC(5, 2),
  
  -- Timestamps
  last_forecast_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════════════════
-- PRICE SNAPSHOTS
-- Historical price data for resolution verification
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE price_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument VARCHAR(20) NOT NULL,
  price NUMERIC(20, 8) NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'polygon', 'binance', 'tradingview', etc.
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_price_snapshots_instrument ON price_snapshots(instrument, captured_at DESC);

-- ══════════════════════════════════════════════════════════════════════
-- RESOLUTION LOGS
-- Audit trail for how forecasts were resolved
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE forecast_resolution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id UUID REFERENCES forecasts(id) ON DELETE CASCADE NOT NULL,
  resolved_by VARCHAR(50) NOT NULL, -- 'system', 'admin', 'user_dispute'
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  resolution_price NUMERIC(20, 8),
  price_source VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## RESOLUTION ENGINE

### Architecture

The Resolution Engine is the core differentiator — it automatically resolves forecasts by comparing price data against entry/SL/TP levels.

```
┌─────────────────────────────────────────────────────────────────────┐
│                      RESOLUTION ENGINE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │   Polygon    │    │   Binance    │    │ TradingView  │         │
│  │  (Forex/FX)  │    │   (Crypto)   │    │  (Indices)   │         │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
│         │                   │                   │                  │
│         └───────────────────┼───────────────────┘                  │
│                             │                                       │
│                    ┌────────▼────────┐                             │
│                    │  Price Ingester │                             │
│                    │   (Cron Job)    │                             │
│                    └────────┬────────┘                             │
│                             │                                       │
│                    ┌────────▼────────┐                             │
│                    │ price_snapshots │                             │
│                    │     table       │                             │
│                    └────────┬────────┘                             │
│                             │                                       │
│         ┌───────────────────┼───────────────────┐                  │
│         │                   │                   │                  │
│  ┌──────▼───────┐   ┌──────▼───────┐   ┌──────▼───────┐          │
│  │  Resolution  │   │   Expiry     │   │  Near-Expiry │          │
│  │   Checker    │   │   Handler    │   │   Alerter    │          │
│  │   (5 min)    │   │   (hourly)   │   │   (hourly)   │          │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘          │
│         │                   │                   │                  │
│         └───────────────────┼───────────────────┘                  │
│                             │                                       │
│                    ┌────────▼────────┐                             │
│                    │  Notification   │                             │
│                    │    Service      │                             │
│                    └─────────────────┘                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Resolution Logic

```typescript
// lib/resolution/check-forecast.ts

interface ResolutionResult {
  resolved: boolean
  status?: "resolved_win" | "resolved_loss"
  resolutionPrice?: number
  accuracy?: number
}

export function checkForecastResolution(
  forecast: {
    direction: "LONG" | "SHORT"
    entry_price: number
    stop_loss: number
    take_profit: number
  },
  currentPrice: number,
  highSinceEntry: number,
  lowSinceEntry: number
): ResolutionResult {
  const { direction, entry_price, stop_loss, take_profit } = forecast
  
  if (direction === "LONG") {
    // Check if SL was hit first
    if (lowSinceEntry <= stop_loss) {
      return {
        resolved: true,
        status: "resolved_loss",
        resolutionPrice: stop_loss,
        accuracy: 0,
      }
    }
    
    // Check if TP was hit
    if (highSinceEntry >= take_profit) {
      const totalRange = take_profit - entry_price
      const achievedRange = highSinceEntry - entry_price
      const accuracy = Math.min(100, (achievedRange / totalRange) * 100)
      
      return {
        resolved: true,
        status: "resolved_win",
        resolutionPrice: take_profit,
        accuracy,
      }
    }
  } else {
    // SHORT
    if (highSinceEntry >= stop_loss) {
      return {
        resolved: true,
        status: "resolved_loss",
        resolutionPrice: stop_loss,
        accuracy: 0,
      }
    }
    
    if (lowSinceEntry <= take_profit) {
      const totalRange = entry_price - take_profit
      const achievedRange = entry_price - lowSinceEntry
      const accuracy = Math.min(100, (achievedRange / totalRange) * 100)
      
      return {
        resolved: true,
        status: "resolved_win",
        resolutionPrice: take_profit,
        accuracy,
      }
    }
  }
  
  return { resolved: false }
}
```

---

## COMPONENT ENHANCEMENTS

### 1. Feed Enhancements

**Real-time updates with SWR:**
```typescript
// hooks/use-forecasts.ts
export function useForecasts(filters: ForecastFilters) {
  return useSWR(
    ["/api/forecasts/feed", filters],
    ([url, f]) => fetchForecasts(url, f),
    {
      refreshInterval: 30000, // Refresh every 30s
      revalidateOnFocus: true,
    }
  )
}
```

**Enhanced Card Features:**
- Live price overlay showing current price vs entry
- Time remaining countdown with visual urgency
- Inline mini-chart with entry/SL/TP lines
- Quick actions: Like, Comment, Share, Follow user
- Mentor badge glow for mentor forecasts
- Community context chip linking to source community

### 2. My Record Enhancements

**New Metrics:**
- Instrument-level breakdown (best/worst pairs)
- Session analysis (London vs NY vs Asia performance)
- Conviction calibration (high confidence accuracy vs low)
- Timeframe analysis (intraday vs swing performance)
- Monthly/weekly trend sparklines
- Comparative percentile rank ("Top 12% this month")

**Visual Additions:**
- Equity curve simulation (if you traded every forecast)
- Win/loss heatmap calendar
- Streak timeline with milestones
- Radar chart of trading style dimensions

### 3. Leaderboard Enhancements

**Multiple Leaderboards:**
- Global all-time
- Global this month
- Global this week
- Per-community
- Mentors only
- Students only
- By instrument type (Forex masters, Crypto kings, etc.)

**Gamification:**
- Rank badges (Bronze, Silver, Gold, Platinum, Diamond)
- Title unlocks ("The Oracle", "Streak Master", "Risk Architect")
- Weekly rank change animation (+3, -2)
- "New to leaderboard" badge for first-time qualifiers

### 4. Archive Enhancements

**Calendar Heatmap:**
- Color intensity = number of forecasts that day
- Click to expand day's forecasts
- Win/loss ratio overlay
- Streak indicators on consecutive win days

**Export:**
- CSV export of historical forecasts
- PDF trade journal generation
- Share individual forecasts as images

### 5. Submit Flow Enhancements

**Chart Upload:**
- Drag-and-drop chart screenshot
- Paste from clipboard
- Annotation tools (draw entry/SL/TP lines)
- Auto-crop and optimize image

**AI-Assisted Features:**
- "Analyze my chart" — AI identifies key levels
- Confluence suggestions based on description
- Risk/reward optimization suggestions
- Similar historical setups comparison

---

## GAMIFICATION

### XP System

| Action | XP |
|--------|-----|
| Submit a forecast | +10 |
| Forecast resolves as win | +50 x (confidence/100) |
| Forecast resolves as loss | +5 (participation) |
| Win streak bonus (3+) | +25 per additional win |
| First forecast of the day | +5 |
| Mentor reviews your forecast | +15 |
| Your forecast gets 10+ likes | +10 |
| Your forecast gets 50+ views | +5 |
| Enter the leaderboard | +100 (one-time) |
| Reach top 10 | +200 |
| Reach #1 | +500 |

### Badges

**Milestones:**
- First Blood — Submit your first forecast
- Verified — 5 resolved forecasts
- Consistent — 20 resolved forecasts
- Centurion — 100 resolved forecasts

**Accuracy:**
- Sharp Shooter — 60%+ win rate (min 10 resolved)
- The Oracle — 75%+ win rate (min 20 resolved)
- Never Wrong — 90%+ win rate (min 10 resolved)

**Streaks:**
- On Fire — 3-win streak
- Unstoppable — 5-win streak
- Legendary — 10-win streak

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Create database schema (all tables)
- [ ] Implement RLS policies
- [ ] Create API routes (CRUD for forecasts)
- [ ] Connect ForecastSubmitDrawer to real API
- [ ] Connect ForecastFeed to real API
- [ ] Basic error handling and loading states

### Phase 2: Resolution Engine (Week 3)
- [ ] Integrate Polygon API for Forex/Indices
- [ ] Integrate Binance API for Crypto
- [ ] Create price snapshot ingestion
- [ ] Implement resolution checker cron
- [ ] Implement expiry handler cron
- [ ] Add resolution notification hooks

### Phase 3: Engagement (Week 4)
- [ ] Implement likes system
- [ ] Implement comments system
- [ ] Implement view tracking
- [ ] Add real-time updates with SWR
- [ ] Implement mentor review workflow

### Phase 4: Gamification (Week 5)
- [ ] Implement XP system
- [ ] Create badges logic
- [ ] Build leaderboard with real data
- [ ] Add streak tracking
- [ ] Implement notifications

### Phase 5: Advanced (Week 6-8)
- [ ] AI chart analysis integration
- [ ] AI forecast critique
- [ ] Community challenges
- [ ] Mobile optimization
- [ ] PWA features
- [ ] Export/sharing features

---

## SUCCESS METRICS

### Engagement
- **DAU of Forecast Room** — Target: 40% of platform DAU
- **Forecasts submitted per day** — Target: 50+ after 3 months
- **Average comments per forecast** — Target: 3+
- **Feed scroll depth** — Target: 80% reach 5+ forecasts

### Quality
- **Resolution rate** — Target: 85%+ forecasts resolved (not expired)
- **Average accuracy on wins** — Track over time
- **Mentor review coverage** — Target: 30% of student forecasts reviewed

### Retention
- **7-day retention after first forecast** — Target: 60%
- **30-day retention** — Target: 40%
- **Users returning to check resolution** — Target: 80%

---

## STATUS FLOW DIAGRAM

```
                    ┌──────────────┐
                    │    DRAFT     │ (local only, not submitted)
                    └──────┬───────┘
                           │ submit
                    ┌──────▼───────┐
           ┌────────│    ACTIVE    │────────┐
           │        └──────┬───────┘        │
           │               │ 4hrs before    │ SL or TP hit
           │               │ expiry         │
           │        ┌──────▼───────┐        │
           │        │  NEAR_EXPIRY │        │
           │        └──────┬───────┘        │
           │               │ expires        │
           │        ┌──────▼───────────┐    │
           │        │ AWAITING_RESOLU- │    │
           │        │      TION        │    │
           │        └──────┬───────────┘    │
           │               │ manual review  │
           │               │                │
    ┌──────▼───────┐ ┌─────▼──────┐  ┌──────▼───────┐
    │   EXPIRED    │ │ INVALIDATED │  │ RESOLVED_WIN │
    └──────────────┘ └─────────────┘  │   or _LOSS   │
                                      └──────────────┘
```

---

## CONCLUSION

The Forecast Room has the potential to become the most trusted prediction verification system in retail trading education. By combining cryptographic timestamping, automated price resolution, mentor oversight, and gamification, we create a system where track records are unfakeable and skill is objectively measurable.

This masterplan provides a complete roadmap from the current MVP to a full-featured prediction marketplace. Each phase builds on the previous, with clear deliverables and success metrics.

**Next immediate action:** Create the Supabase schema and apply migrations.
