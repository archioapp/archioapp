-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'paid')),
  description TEXT,
  tags TEXT[],
  members_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Create group_posts table
CREATE TABLE IF NOT EXISTS public.group_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups (read-only public directory)
CREATE POLICY "read_groups" ON public.groups
  FOR SELECT USING (true);

CREATE POLICY "create_groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "update_own_groups" ON public.groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = groups.id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for group_members
CREATE POLICY "read_group_members" ON public.group_members
  FOR SELECT USING (true);

CREATE POLICY "join_groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "leave_groups" ON public.group_members
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for group_posts
CREATE POLICY "read_group_posts" ON public.group_posts
  FOR SELECT USING (true);

CREATE POLICY "create_group_posts" ON public.group_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = group_posts.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "update_own_posts" ON public.group_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "delete_own_posts" ON public.group_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groups_visibility ON public.groups(visibility);
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(slug);
CREATE INDEX IF NOT EXISTS idx_groups_members_count ON public.groups(members_count DESC);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group_id ON public.group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_created_at ON public.group_posts(created_at DESC);

-- Function to update members_count when members join/leave
CREATE OR REPLACE FUNCTION update_group_members_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups 
    SET members_count = members_count + 1 
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups 
    SET members_count = members_count - 1 
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update members_count
CREATE TRIGGER trigger_update_group_members_count
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_members_count();

-- Insert some sample data
INSERT INTO public.groups (slug, name, visibility, description, tags, members_count) VALUES
  ('fx-traders', 'FX Traders United', 'public', 'Professional forex trading community sharing strategies and market insights', ARRAY['forex', 'trading', 'analysis'], 1247),
  ('crypto-alpha', 'Crypto Alpha Hunters', 'private', 'Exclusive group for finding alpha in cryptocurrency markets', ARRAY['crypto', 'defi', 'alpha'], 89),
  ('macro-minds', 'Macro Minds', 'paid', 'Premium macro economic analysis and trading signals', ARRAY['macro', 'economics', 'signals'], 156),
  ('options-flow', 'Options Flow Analysis', 'public', 'Track unusual options activity and dark pool flows', ARRAY['options', 'flow', 'darkpool'], 892),
  ('ai-trading', 'AI Trading Strategies', 'public', 'Algorithmic and AI-powered trading strategies and backtesting', ARRAY['ai', 'algorithms', 'backtesting'], 634),
  ('risk-management', 'Risk Management Masters', 'private', 'Advanced risk management techniques for professional traders', ARRAY['risk', 'management', 'professional'], 278)
ON CONFLICT (slug) DO NOTHING;
