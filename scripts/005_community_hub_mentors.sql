-- ══════════════════════════════════════════════════════════════════════
-- PHASE 1B: CREATE community_mentors TABLE
-- ══════════════════════════════════════════════════════════════════════
-- Purpose: Mentors are the human trust anchor of every community.
-- A trader trusts a community because they trust the mentor.
-- This table stores the full credibility profile for every mentor
-- in every community, powering both the card-level avatar strip
-- and the drawer-level full mentor profile cards.
--
-- Key design decisions:
-- - A user can be a mentor in multiple communities (different rows)
-- - Each mentor row is community-specific (different specialties per community)
-- - office_hours_schedule is JSONB for flexible recurring schedules
-- - specialties and asset_focus are TEXT[] for multi-tag filtering
-- - is_lead distinguishes the primary mentor from assistants
-- - rating is NUMERIC(3,2) for precision (e.g., 4.87)
-- ══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.community_mentors (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Which community this mentor belongs to
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,

  -- Which user this mentor is (nullable for seed data with fake users)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- ── IDENTITY ──────────────────────────────────
  -- Display name shown on mentor cards
  display_name TEXT NOT NULL,

  -- Professional title ("Head Forex Analyst", "Senior Crypto Strategist")
  title TEXT,

  -- Full bio for the drawer-level mentor card (supports multi-paragraph)
  bio TEXT,

  -- Mentor avatar/photo URL
  avatar_url TEXT,

  -- ── EXPERTISE ─────────────────────────────────
  -- What this mentor specializes in (chips on mentor card)
  -- e.g., ['Price Action', 'Supply & Demand', 'ICT Concepts']
  specialties TEXT[] DEFAULT '{}',

  -- Which asset classes this mentor focuses on
  -- e.g., ['forex', 'crypto'] or ['stocks', 'futures']
  asset_focus TEXT[] DEFAULT '{}',

  -- This mentor's primary trading style
  trading_style TEXT
    CHECK (trading_style IN ('scalping', 'day_trading', 'swing', 'position', 'mixed')),

  -- Years of trading/mentoring experience
  years_experience INTEGER DEFAULT 0,

  -- ── CREDIBILITY ───────────────────────────────
  -- Has ArchioAI verified this mentor's credentials?
  verified BOOLEAN DEFAULT false,

  -- Average rating from student reviews (0.00 - 5.00)
  rating NUMERIC(3, 2) DEFAULT 0.00
    CHECK (rating >= 0 AND rating <= 5),

  -- Total number of students this mentor has coached
  total_students INTEGER DEFAULT 0,

  -- Total number of reviews/ratings received
  total_reviews INTEGER DEFAULT 0,

  -- ── ROLE ──────────────────────────────────────
  -- Is this the lead/primary mentor of the community?
  -- Only one mentor per community should be is_lead = true
  is_lead BOOLEAN DEFAULT false,

  -- Mentor's role within the community
  -- 'lead' = primary mentor, 'assistant' = helper, 'guest' = rotating guest
  mentor_role TEXT DEFAULT 'lead'
    CHECK (mentor_role IN ('lead', 'assistant', 'guest')),

  -- ── SCHEDULE ──────────────────────────────────
  -- Office hours schedule as structured JSONB
  -- Format: [
  --   { "day": "monday", "start": "09:00", "end": "11:00", "timezone": "Europe/London" },
  --   { "day": "wednesday", "start": "14:00", "end": "16:00", "timezone": "Europe/London" },
  --   { "day": "friday", "start": "09:00", "end": "10:00", "timezone": "Europe/London" }
  -- ]
  office_hours_schedule JSONB DEFAULT '[]'::jsonb,

  -- Is this mentor currently available / accepting new students?
  is_available BOOLEAN DEFAULT true,

  -- ── TIMESTAMPS ────────────────────────────────
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- A mentor can only appear once per community
  UNIQUE(group_id, user_id)
);

-- ── ROW LEVEL SECURITY ──────────────────────────
ALTER TABLE public.community_mentors ENABLE ROW LEVEL SECURITY;

-- Everyone can view mentors (discovery page needs this)
CREATE POLICY "community_mentors_select_all"
  ON public.community_mentors FOR SELECT
  USING (true);

-- Only group owners/admins can add mentors
CREATE POLICY "community_mentors_insert_admin"
  ON public.community_mentors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = community_mentors.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

-- Only group owners/admins can update mentor profiles
CREATE POLICY "community_mentors_update_admin"
  ON public.community_mentors FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = community_mentors.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

-- Only group owners can remove mentors
CREATE POLICY "community_mentors_delete_owner"
  ON public.community_mentors FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = community_mentors.group_id
      AND owner_id = auth.uid()
    )
  );

-- ── INDEXES ─────────────────────────────────────
-- Fast lookup by community (for card mentor strip + drawer mentor list)
CREATE INDEX IF NOT EXISTS idx_community_mentors_group_id
  ON public.community_mentors(group_id);

-- Fast lookup by user (for "my mentoring" profile)
CREATE INDEX IF NOT EXISTS idx_community_mentors_user_id
  ON public.community_mentors(user_id);

-- Find lead mentors quickly (for card display priority)
CREATE INDEX IF NOT EXISTS idx_community_mentors_is_lead
  ON public.community_mentors(group_id, is_lead)
  WHERE is_lead = true;

-- Find verified mentors (trust filter)
CREATE INDEX IF NOT EXISTS idx_community_mentors_verified
  ON public.community_mentors(verified)
  WHERE verified = true;

-- Sort by rating (for "top mentors" queries)
CREATE INDEX IF NOT EXISTS idx_community_mentors_rating
  ON public.community_mentors(rating DESC);

-- ── AUTO-UPDATE updated_at ──────────────────────
CREATE OR REPLACE FUNCTION update_community_mentors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_community_mentors_updated_at ON public.community_mentors;
CREATE TRIGGER trigger_update_community_mentors_updated_at
  BEFORE UPDATE ON public.community_mentors
  FOR EACH ROW
  EXECUTE FUNCTION update_community_mentors_updated_at();

-- ══════════════════════════════════════════════════════════════════════
-- END PHASE 1B: community_mentors table created with full identity,
-- expertise, credibility, role, schedule, RLS, and indexing.
-- ══════════════════════════════════════════════════════════════════════
