-- Create community tables for group functionality

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'paid')),
  stripe_price_id TEXT,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'banned')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Group invites table
CREATE TABLE IF NOT EXISTS group_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groups_visibility ON groups(visibility);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_code ON group_invites(invite_code);

-- Function to generate unique group slug
CREATE OR REPLACE FUNCTION generate_group_slug(group_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from name
  base_slug := lower(regexp_replace(group_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'group';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM groups WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups table
CREATE POLICY "Groups are viewable by everyone" ON groups
  FOR SELECT USING (visibility = 'public' OR visibility = 'paid');

CREATE POLICY "Private groups are viewable by members" ON groups
  FOR SELECT USING (
    visibility = 'private' AND 
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = groups.id 
      AND group_members.user_id = auth.uid()
      AND group_members.status = 'active'
    )
  );

CREATE POLICY "Users can create groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group owners can update their groups" ON groups
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Group owners can delete their groups" ON groups
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for group_members table
CREATE POLICY "Group members are viewable by group members" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_members.group_id 
      AND gm.user_id = auth.uid()
      AND gm.status = 'active'
    )
  );

CREATE POLICY "Users can join groups" ON group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group admins can manage members" ON group_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_members.group_id 
      AND gm.user_id = auth.uid()
      AND gm.role IN ('owner', 'admin')
      AND gm.status = 'active'
    )
  );

-- RLS Policies for group_invites table
CREATE POLICY "Group invites are viewable by group admins" ON group_invites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_invites.group_id 
      AND gm.user_id = auth.uid()
      AND gm.role IN ('owner', 'admin')
      AND gm.status = 'active'
    )
  );

CREATE POLICY "Group admins can create invites" ON group_invites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_invites.group_id 
      AND gm.user_id = auth.uid()
      AND gm.role IN ('owner', 'admin')
      AND gm.status = 'active'
    )
  );

-- Insert some sample data
INSERT INTO groups (name, slug, description, tags, visibility, owner_id) VALUES
  ('Trading Beginners', 'trading-beginners', 'A community for new traders to learn and share experiences', ARRAY['trading', 'education', 'beginners'], 'public', '00000000-0000-0000-0000-000000000000'),
  ('Forex Masters', 'forex-masters', 'Advanced forex trading strategies and market analysis', ARRAY['forex', 'advanced', 'analysis'], 'public', '00000000-0000-0000-0000-000000000000'),
  ('Crypto Signals', 'crypto-signals', 'Premium cryptocurrency trading signals and insights', ARRAY['crypto', 'signals', 'premium'], 'paid', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (slug) DO NOTHING;
