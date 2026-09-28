-- Community/Groups Database Schema
-- Run this script to create the necessary tables for the community feature

-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'paid', 'private')),
  stripe_price_id TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'expired')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Group invites table
CREATE TABLE IF NOT EXISTS public.group_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forecast groups junction table (connects forecasts to groups)
CREATE TABLE IF NOT EXISTS public.forecast_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id UUID NOT NULL, -- References forecasts table (to be created)
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(forecast_id, group_id)
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups table
CREATE POLICY "groups_select_all" ON public.groups FOR SELECT USING (true);
CREATE POLICY "groups_insert_own" ON public.groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "groups_update_owner_admin" ON public.groups FOR UPDATE USING (
  auth.uid() = owner_id OR 
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = groups.id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);
CREATE POLICY "groups_delete_owner" ON public.groups FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for group_members table
CREATE POLICY "group_members_select_own_or_group_member" ON public.group_members FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_members.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.status = 'active'
  )
);
CREATE POLICY "group_members_insert_self_join" ON public.group_members FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_members.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);
CREATE POLICY "group_members_update_admin" ON public.group_members FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_members.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);
CREATE POLICY "group_members_delete_admin_or_self" ON public.group_members FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_members.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);

-- RLS Policies for group_invites table
CREATE POLICY "group_invites_select_group_admin" ON public.group_invites FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_invites.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);
CREATE POLICY "group_invites_insert_group_admin" ON public.group_invites FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_invites.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);
CREATE POLICY "group_invites_update_group_admin" ON public.group_invites FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_invites.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);
CREATE POLICY "group_invites_delete_group_admin" ON public.group_invites FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_invites.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);

-- RLS Policies for forecast_groups table
CREATE POLICY "forecast_groups_select_group_member" ON public.forecast_groups FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = forecast_groups.group_id 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
);
CREATE POLICY "forecast_groups_insert_group_member" ON public.forecast_groups FOR INSERT WITH CHECK (
  auth.uid() = shared_by AND
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = forecast_groups.group_id 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
);
CREATE POLICY "forecast_groups_delete_author_or_admin" ON public.forecast_groups FOR DELETE USING (
  auth.uid() = shared_by OR 
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = forecast_groups.group_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(slug);
CREATE INDEX IF NOT EXISTS idx_groups_visibility ON public.groups(visibility);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON public.group_members(status);
CREATE INDEX IF NOT EXISTS idx_group_invites_group_id ON public.group_invites(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_code ON public.group_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_forecast_groups_group_id ON public.forecast_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_forecast_groups_forecast_id ON public.forecast_groups(forecast_id);

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_group_slug(group_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from name
  base_slug := lower(regexp_replace(trim(group_name), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'group';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.groups WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-add owner as member
CREATE OR REPLACE FUNCTION add_group_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role, status)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-add owner as member
DROP TRIGGER IF EXISTS trigger_add_group_owner_as_member ON public.groups;
CREATE TRIGGER trigger_add_group_owner_as_member
  AFTER INSERT ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION add_group_owner_as_member();
