-- Helper function to increment invite usage atomically
CREATE OR REPLACE FUNCTION increment_invite_usage(invite_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE invites
  SET used_count = used_count + 1
  WHERE id = invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to generate unique slugs for organizations
CREATE OR REPLACE FUNCTION generate_org_slug(org_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  -- Generate base slug from name
  base_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Helper function to generate unique slugs for rooms
CREATE OR REPLACE FUNCTION generate_room_slug(room_name TEXT, org_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  -- Generate base slug from name
  base_slug := lower(regexp_replace(room_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check for uniqueness within the organization
  WHILE EXISTS (
    SELECT 1 FROM rooms 
    WHERE slug = final_slug AND rooms.org_id = generate_room_slug.org_id
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;
