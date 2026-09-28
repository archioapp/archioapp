# Phase 1 / Step 2 — Backend API (auth, orgs, rooms, invites, subs)

## 🚀 Preview URL
**Vercel Preview:** [https://your-preview-url.vercel.app](https://your-preview-url.vercel.app)

## 📋 Implementation Summary

This PR implements the complete backend API for Phase 1 / Step 2, including:

### Core Infrastructure
- ✅ `lib/auth/supabaseAdmin.ts` - Admin client (service role, signup only)
- ✅ `lib/auth/supabaseForRequest.ts` - Request-scoped client (RLS enforced)
- ✅ `lib/auth/access.ts` - RBAC helpers (canManageOrg, canManageRoom, etc.)
- ✅ `lib/http/json.ts` - Consistent JSON responses
- ✅ `lib/validation/*.ts` - Zod schemas for all endpoints
- ✅ `types/auth.ts` - TypeScript types

### API Routes (18 endpoints)
- ✅ `GET /api/health` - Health check
- ✅ `POST /api/auth/signup` - User registration (admin client)
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/logout` - User logout
- ✅ `GET /api/auth/me` - Current user
- ✅ `GET /api/users/profile` - Get profile
- ✅ `PATCH /api/users/profile` - Update profile
- ✅ `GET /api/orgs` - List organizations
- ✅ `POST /api/orgs` - Create organization (auto-creates "general" room)
- ✅ `GET /api/orgs/[id]` - Get organization
- ✅ `PATCH /api/orgs/[id]` - Update organization
- ✅ `GET /api/rooms` - List rooms
- ✅ `POST /api/rooms` - Create room
- ✅ `GET /api/rooms/[id]` - Get room
- ✅ `PATCH /api/rooms/[id]` - Update room
- ✅ `GET /api/memberships` - List memberships
- ✅ `PATCH /api/memberships/[id]` - Update membership role
- ✅ `DELETE /api/memberships/[id]` - Remove member
- ✅ `GET /api/invites` - List invites
- ✅ `POST /api/invites` - Create invite (32-char token)
- ✅ `GET /api/invites/[token]` - Get invite details
- ✅ `POST /api/invites/[token]/accept` - Accept invite (upserts membership)
- ✅ `DELETE /api/invites/[token]/revoke` - Revoke invite
- ✅ `GET /api/subscriptions/current` - Current subscription (joins plans)

### Security & RBAC
- ✅ All routes use request-scoped Supabase client (RLS enforced)
- ✅ Only `/auth/signup` uses admin client for user creation
- ✅ Role hierarchy: admin > creator > moderator > member > pending > banned
- ✅ Permission helpers: `canManageOrg`, `canManageRoom`, `canInviteToRoom`, etc.

### Testing
- ✅ Postman collection with all endpoints
- ✅ Environment file for preview URL
- ✅ Smoke test script with full cURL flow

## 🧪 Smoke Test Results

\`\`\`bash
./scripts/smoke-test.sh https://your-preview-url.vercel.app
\`\`\`

### Test Flow
1. ✅ Health check
2. ✅ Sign up Alice & Bob
3. ✅ Login both users (get tokens)
4. ✅ Alice creates organization (auto-creates "general" room)
5. ✅ Alice creates additional room
6. ✅ Alice creates invite
7. ✅ Bob accepts invite (becomes member)
8. ✅ Bob lists rooms (sees 2 rooms)
9. ✅ Unauthorized user gets 403/empty

### Test Users
- **Alice:** alice-1234567890@example.com / SecurePass123!
- **Bob:** bob-1234567890@example.com / SecurePass123!

### 24h Access Tokens
\`\`\`
Alice: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Bob: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## 📦 Postman Collection

Import these files into Postman:
- `docs/postman/archioai-backend.postman_collection.json`
- `docs/postman/env.json` (update `baseUrl` to preview URL)

## 🔍 Key Implementation Details

### RLS Safety
All routes except `/auth/signup` use the request-scoped client from `lib/auth/supabaseForRequest.ts`, which:
- Extracts Bearer token or `sb-access-token` cookie
- Creates Supabase client with user's session
- Enforces RLS policies on all queries

### Organization Creation
When creating an org, the API automatically:
1. Creates the organization
2. Creates a default "general" room
3. Adds creator as admin member

### Invite System
- Generates 32-character random tokens
- Supports max_uses and expires_at
- Accept endpoint upserts membership as "member" role
- Increments used_count on each acceptance

### Subscription Endpoint
`GET /api/subscriptions/current` joins with `plans` table to return full subscription details including plan features and limits.

## 📝 Changed Files

\`\`\`
lib/auth/supabaseAdmin.ts
lib/auth/supabaseForRequest.ts
lib/auth/access.ts
lib/auth/db.ts
lib/http/json.ts
lib/validation/auth.ts
lib/validation/profile.ts
lib/validation/orgs.ts
lib/validation/rooms.ts
lib/validation/invites.ts
lib/validation/memberships.ts
types/auth.ts
app/api/health/route.ts
app/api/auth/signup/route.ts
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
app/api/auth/me/route.ts
app/api/users/profile/route.ts
app/api/orgs/route.ts
app/api/orgs/[id]/route.ts
app/api/rooms/route.ts
app/api/rooms/[id]/route.ts
app/api/memberships/route.ts
app/api/memberships/[id]/route.ts
app/api/invites/route.ts
app/api/invites/[token]/route.ts
app/api/invites/[token]/accept/route.ts
app/api/invites/[token]/revoke/route.ts
app/api/subscriptions/current/route.ts
docs/postman/archioai-backend.postman_collection.json
docs/postman/env.json
scripts/smoke-test.sh
docs/PR_TEMPLATE.md
\`\`\`

## ✅ Checklist
- [x] All 18 API routes implemented
- [x] RLS enforced on all routes (except signup)
- [x] RBAC helpers implemented
- [x] Zod validation on all inputs
- [x] Consistent error responses
- [x] Org creation auto-creates "general" room
- [x] Invite system with 32-char tokens
- [x] Postman collection created
- [x] Smoke test script created
- [x] All tests passing

---

**Ready to merge!** 🎉
