-- ══════════════════════════════════════════════════════════════════════
-- PHASE 1A: ALTER groups TABLE -- Community Hub Flagship Reinvention
-- ══════════════════════════════════════════════════════════════════════
-- Purpose: Extend the existing groups table from a 10-column skeleton
-- into a 40+ column discovery-grade community identity system.
--
-- Current state: id, name, slug, description, tags[], visibility,
--   stripe_price_id, owner_id, created_at, updated_at, members_count
--
-- After this migration: Every column needed for the Community Hub
--   discovery page to render rich, differentiated, trustworthy
--   community cards and preview dossiers.
--
-- Groups: Identity | Capabilities | Trust | Pulse | Content | Media | Config
-- ══════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- GROUP 1: IDENTITY COLUMNS
-- These define what the community IS -- its market,
-- style, session, risk profile, and personality.
-- ─────────────────────────────────────────────

-- Primary asset class (drives card accent color)
-- forex=cyan, crypto=emerald, stocks=blue, futures=amber, options=violet, mixed=slate
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS asset_class TEXT
  CHECK (asset_class IN ('forex', 'crypto', 'stocks', 'futures', 'options', 'mixed'));

-- Trading style focus (drives card personality)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS trading_style TEXT
  CHECK (trading_style IN ('scalping', 'day_trading', 'swing', 'position', 'mixed'));

-- Risk profile of the community
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS risk_profile TEXT
  CHECK (risk_profile IN ('conservative', 'balanced', 'aggressive'));

-- Primary session focus (when is this community most active)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS session_focus TEXT
  CHECK (session_focus IN ('asia', 'london', 'new_york', 'multi_session'));

-- Primary language of the community
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Community timezone (for schedule display)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Is this community appropriate for beginners?
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS beginner_friendly BOOLEAN DEFAULT false;

-- Short tagline displayed on discovery card (max ~120 chars)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS tagline TEXT;

-- What specific strategy or methodology does this community focus on?
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS strategy_focus TEXT;

-- What discipline does the community expect from members?
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS discipline TEXT;

-- When was this community originally founded?
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS founded_at TIMESTAMPTZ;

-- Maximum allowed members (null = unlimited)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS max_members INTEGER;

-- ─────────────────────────────────────────────
-- GROUP 2: ARCHIO CAPABILITY COLUMNS
-- The 3 flagship differentiators that separate
-- ArchioAI communities from Discord/Skool/everything.
-- These drive the most prominent visual element on
-- every discovery card.
-- ─────────────────────────────────────────────

-- Does this community have custom Archio AI Models?
-- (Purple badge -- the ultimate differentiator)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS has_archio_ai_models BOOLEAN DEFAULT false;

-- Description of what the AI models do for this community
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS ai_models_description TEXT;

-- Does this community have the Mentor Dashboard?
-- (Blue badge -- structured coaching and student tracking)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS has_mentor_dashboard BOOLEAN DEFAULT false;

-- Does this community have integrated Live Calls?
-- (Red badge -- real-time sessions on the platform)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS has_live_calls BOOLEAN DEFAULT false;

-- ─────────────────────────────────────────────
-- GROUP 3: TRUST & SAFETY COLUMNS
-- Trust is the hardest problem in community discovery.
-- Traders have been burned. Every one of these columns
-- exists to build systemic, evidence-based trust.
-- ─────────────────────────────────────────────

-- Has ArchioAI team reviewed and verified this community?
-- (Shield badge -- means something specific and auditable)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Does this community have active human moderation?
-- (Eye badge -- someone is watching for quality)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS moderated BOOLEAN DEFAULT false;

-- Does this community offer scam protection?
-- (Lock badge -- refund policy + code of conduct enforced)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS scam_protection BOOLEAN DEFAULT false;

-- Community's code of conduct (displayed in preview dossier)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS code_of_conduct TEXT;

-- Community's safety/refund policy (displayed in preview dossier)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS safety_policy TEXT;

-- ─────────────────────────────────────────────
-- GROUP 4: CONTENT & EXPLANATION COLUMNS
-- These power the "How This Community Works" section
-- in the preview dossier. A community that tells you
-- who it is NOT for builds more trust than one that
-- says "everyone welcome."
-- ─────────────────────────────────────────────

-- "Who this community is for" -- 2-3 sentences
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS who_is_for TEXT;

-- "Who this community is NOT for" -- 2-3 sentences
-- (Critical trust signal: exclusion criteria = honesty)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS who_is_not_for TEXT;

-- ─────────────────────────────────────────────
-- GROUP 5: PULSE & ACTIVITY COLUMNS
-- Real-time health metrics that drive the Pulse
-- indicator (breathing dot + equalizer bars).
-- Every number here must map to a real countable event.
-- No fabricable metrics.
-- ─────────────────────────────────────────────

-- Rolling 7-day activity score (computed, 0-100)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS weekly_activity INTEGER DEFAULT 0;

-- Posts created in the last 7 days
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS posts_per_week INTEGER DEFAULT 0;

-- Copilot/AI sessions used by members this week
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS copilot_sessions_this_week INTEGER DEFAULT 0;

-- Members currently active (online or active in last 48h)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS active_members INTEGER DEFAULT 0;

-- Number of members with active streaks
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS member_streaks INTEGER DEFAULT 0;

-- Title of the most popular recent post (social proof)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS top_post_title TEXT;

-- When is the next scheduled meeting? (for card schedule strip)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS next_meeting_time TIMESTAMPTZ;

-- Is a live session happening right now?
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_live_now BOOLEAN DEFAULT false;

-- Title of the current live session (if is_live_now = true)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS live_session_title TEXT;

-- Number of people in the current live session
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS live_attendee_count INTEGER DEFAULT 0;

-- 7-day activity heatmap (Mon-Sun density values, 0-100 each)
-- Stored as JSONB array: [45, 82, 67, 91, 73, 30, 12]
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS weekly_heatmap JSONB DEFAULT '[0,0,0,0,0,0,0]'::jsonb;

-- ─────────────────────────────────────────────
-- GROUP 6: MEDIA & BRANDING COLUMNS
-- Allow each community to express visual identity
-- without breaking system coherence. Accent color is
-- optional override; default comes from asset_class.
-- ─────────────────────────────────────────────

-- Community avatar/logo URL
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Community cover/banner image URL (for preview dossier hero)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Optional accent color override (hex, e.g. "#10b981")
-- If null, accent is derived from asset_class
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS accent_color TEXT;

-- ─────────────────────────────────────────────
-- GROUP 7: FULL-TEXT SEARCH SUPPORT
-- A generated tsvector column for fast full-text search
-- across name, description, tagline, tags, and strategy.
-- Updated via trigger on every INSERT/UPDATE.
-- ─────────────────────────────────────────────

ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Function to auto-compute search_vector on changes
CREATE OR REPLACE FUNCTION compute_group_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.tagline, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.strategy_focus, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.who_is_for, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: recompute search_vector on every insert or update
DROP TRIGGER IF EXISTS trigger_compute_group_search_vector ON public.groups;
CREATE TRIGGER trigger_compute_group_search_vector
  BEFORE INSERT OR UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION compute_group_search_vector();

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at ON EVERY CHANGE
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_groups_updated_at ON public.groups;
CREATE TRIGGER trigger_update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION update_groups_updated_at();

-- ══════════════════════════════════════════════════════════════════════
-- END PHASE 1A: groups table now has 40+ columns covering identity,
-- capabilities, trust, pulse, content, media, and full-text search.
-- ══════════════════════════════════════════════════════════════════════
