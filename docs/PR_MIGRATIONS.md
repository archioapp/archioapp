# PR: feat/auth-migrations

## Overview
SQL migration files for Phase 1 / Step 1: Authentication & User Identity system.

## Files Changed
- `scripts/001_auth_schema.sql` - Complete database schema with RLS policies
- `scripts/002_seed_plans.sql` - Seed data for subscription plans
- `scripts/README.md` - Migration documentation

## Database Schema

### Tables Created
1. **profiles** - User profile data (extends auth.users)
2. **organizations** - Multi-tenant organizations
3. **rooms** - Spaces within organizations
4. **memberships** - User-room relationships with roles
5. **invites** - Room invitation system
6. **plans** - Subscription plan definitions
7. **subscriptions** - User subscription tracking

### RLS Policies
- ✅ Profiles: Users can read all, update own
- ✅ Organizations: Members can read, admins can update
- ✅ Rooms: Visibility-based read, member-based write
- ✅ Memberships: Room members can read, moderators can manage
- ✅ Invites: Invitees and room moderators can access

## How to Run Locally

### Prerequisites
\`\`\`bash
# Ensure Supabase is connected
# Check Project Settings > Integrations in v0 UI
\`\`\`

### Run Migrations
\`\`\`bash
# Option 1: Via v0 UI (Recommended)
# Click "Run Script" buttons in order:
# 1. scripts/001_auth_schema.sql
# 2. scripts/002_seed_plans.sql

# Option 2: Via Supabase CLI
supabase db reset
supabase db push

# Option 3: Via Supabase Dashboard
# Go to SQL Editor > New Query
# Copy/paste each file and run
\`\`\`

### Verify Installation
\`\`\`sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check plans seeded
SELECT * FROM plans;
\`\`\`

## Testing Queries

### Create Test User Profile
\`\`\`sql
-- This happens automatically via trigger on signup
-- Manual test:
INSERT INTO profiles (id, email, display_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@example.com',
  'Test User'
);
\`\`\`

### Create Test Organization
\`\`\`sql
INSERT INTO organizations (name, slug, owner_id)
VALUES (
  'Test Org',
  'test-org',
  '00000000-0000-0000-0000-000000000001'
);
\`\`\`

### Create Test Room
\`\`\`sql
INSERT INTO rooms (org_id, name, slug, visibility)
VALUES (
  (SELECT id FROM organizations WHERE slug = 'test-org'),
  'General',
  'general',
  'public'
);
\`\`\`

## Rollback Instructions

\`\`\`sql
-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS invites CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
\`\`\`

## Environment Variables Required
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Screenshots
N/A - Database migrations only

## Known Issues
None - migrations tested successfully

## Next Steps
After merging this PR:
1. Run migrations in production Supabase instance
2. Proceed with feat/auth-backend PR (API endpoints)
3. Proceed with feat/auth-tests PR (integration tests)
