-- =====================================================
-- Phase 1 / Step 1: Authentication & User Identity
-- Database Schema Migration
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- Public profiles table that references auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  verified_level INTEGER DEFAULT 0 CHECK (verified_level >= 0 AND verified_level <= 3),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true); -- Anyone can view profiles

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- =====================================================
-- ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "organizations_select_member"
  ON public.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.organization_id = organizations.id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

CREATE POLICY "organizations_insert_own"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "organizations_update_admin"
  ON public.organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.organization_id = organizations.id
      AND memberships.user_id = auth.uid()
      AND memberships.role = 'admin'
      AND memberships.status = 'active'
    )
  );

CREATE POLICY "organizations_delete_owner"
  ON public.organizations FOR DELETE
  USING (auth.uid() = owner_id);

-- =====================================================
-- ROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'invite_only')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

-- Enable RLS on rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms
CREATE POLICY "rooms_select_member"
  ON public.rooms FOR SELECT
  USING (
    visibility = 'public' OR
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.room_id = rooms.id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

CREATE POLICY "rooms_insert_org_admin"
  ON public.rooms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.organization_id = organization_id
      AND memberships.user_id = auth.uid()
      AND memberships.role IN ('admin', 'creator')
      AND memberships.status = 'active'
    )
  );

CREATE POLICY "rooms_update_admin"
  ON public.rooms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.room_id = rooms.id
      AND memberships.user_id = auth.uid()
      AND memberships.role IN ('admin', 'moderator')
      AND memberships.status = 'active'
    )
  );

CREATE POLICY "rooms_delete_admin"
  ON public.rooms FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.room_id = rooms.id
      AND memberships.user_id = auth.uid()
      AND memberships.role = 'admin'
      AND memberships.status = 'active'
    )
  );

-- =====================================================
-- MEMBERSHIPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'creator', 'moderator', 'member', 'pending', 'banned')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'banned')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (organization_id IS NOT NULL AND room_id IS NULL) OR
    (organization_id IS NULL AND room_id IS NOT NULL)
  ),
  UNIQUE(user_id, organization_id),
  UNIQUE(user_id, room_id)
);

-- Enable RLS on memberships
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for memberships
CREATE POLICY "memberships_select_own"
  ON public.memberships FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE (
        (m.organization_id = memberships.organization_id AND m.user_id = auth.uid()) OR
        (m.room_id = memberships.room_id AND m.user_id = auth.uid())
      )
      AND m.status = 'active'
    )
  );

CREATE POLICY "memberships_insert_admin"
  ON public.memberships FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE (
        (m.organization_id = memberships.organization_id) OR
        (m.room_id = memberships.room_id)
      )
      AND m.user_id = auth.uid()
      AND m.role IN ('admin', 'creator')
      AND m.status = 'active'
    )
  );

CREATE POLICY "memberships_update_admin"
  ON public.memberships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE (
        (m.organization_id = memberships.organization_id) OR
        (m.room_id = memberships.room_id)
      )
      AND m.user_id = auth.uid()
      AND m.role IN ('admin', 'creator')
      AND m.status = 'active'
    )
  );

CREATE POLICY "memberships_delete_admin"
  ON public.memberships FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE (
        (m.organization_id = memberships.organization_id) OR
        (m.room_id = memberships.room_id)
      )
      AND m.user_id = auth.uid()
      AND m.role IN ('admin', 'creator')
      AND m.status = 'active'
    )
  );

-- =====================================================
-- INVITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_code TEXT UNIQUE NOT NULL,
  email TEXT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'creator', 'moderator', 'member')),
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (organization_id IS NOT NULL AND room_id IS NULL) OR
    (organization_id IS NULL AND room_id IS NOT NULL)
  )
);

-- Enable RLS on invites
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invites
CREATE POLICY "invites_select_own"
  ON public.invites FOR SELECT
  USING (
    invited_by = auth.uid() OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "invites_insert_admin"
  ON public.invites FOR INSERT
  WITH CHECK (
    invited_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE (
        (m.organization_id = invites.organization_id) OR
        (m.room_id = invites.room_id)
      )
      AND m.user_id = auth.uid()
      AND m.role IN ('admin', 'creator', 'moderator')
      AND m.status = 'active'
    )
  );

CREATE POLICY "invites_update_creator"
  ON public.invites FOR UPDATE
  USING (invited_by = auth.uid());

CREATE POLICY "invites_delete_creator"
  ON public.invites FOR DELETE
  USING (invited_by = auth.uid());

-- =====================================================
-- PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) DEFAULT 0,
  price_yearly DECIMAL(10, 2) DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans (read-only for all users)
CREATE POLICY "plans_select_all"
  ON public.plans FOR SELECT
  USING (is_active = true);

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "subscriptions_insert_own"
  ON public.subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions_update_own"
  ON public.subscriptions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "subscriptions_delete_own"
  ON public.subscriptions FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, bio, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'bio', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_rooms_organization_id ON public.rooms(organization_id);
CREATE INDEX IF NOT EXISTS idx_rooms_slug ON public.rooms(slug);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_organization_id ON public.memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_room_id ON public.memberships(room_id);
CREATE INDEX IF NOT EXISTS idx_invites_invite_code ON public.invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_invites_email ON public.invites(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
