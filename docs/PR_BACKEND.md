# PR: feat/auth-backend

## Overview
Complete backend API implementation for Phase 1 / Step 1: Authentication & User Identity system.

## Files Changed

### Type Definitions
- `types/auth.ts` - TypeScript types for all entities

### Library Functions
- `lib/auth/access.ts` - Role-based access control utilities
- `lib/auth/db.ts` - Database operations layer

### API Endpoints (17 total)

#### Auth (`/api/auth/*`)
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Sign out user
- `GET /api/auth/me` - Get current user profile

#### Users (`/api/users/*`)
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile
- `GET /api/users/[id]` - Get user by ID (public info)

#### Organizations (`/api/orgs/*`)
- `GET /api/orgs` - List user's organizations
- `POST /api/orgs` - Create organization
- `GET /api/orgs/[id]` - Get organization details
- `PATCH /api/orgs/[id]` - Update organization
- `DELETE /api/orgs/[id]` - Delete organization

#### Rooms (`/api/rooms/*`)
- `GET /api/rooms` - List rooms (filtered by org)
- `POST /api/rooms` - Create room
- `GET /api/rooms/[id]` - Get room details
- `PATCH /api/rooms/[id]` - Update room
- `DELETE /api/rooms/[id]` - Delete room

#### Memberships (`/api/memberships/*`)
- `GET /api/memberships` - List memberships
- `POST /api/memberships` - Add member to room
- `PATCH /api/memberships/[id]` - Update member role
- `DELETE /api/memberships/[id]` - Remove member

#### Invites (`/api/invites/*`)
- `GET /api/invites` - List invites
- `POST /api/invites` - Create invite
- `GET /api/invites/[token]` - Get invite details
- `POST /api/invites/[token]/accept` - Accept invite
- `DELETE /api/invites/[token]/revoke` - Revoke invite

#### Subscriptions (`/api/subscriptions/*`)
- `GET /api/subscriptions/me` - Get user's subscription
- `POST /api/subscriptions/checkout` - Create Stripe checkout
- `POST /api/subscriptions/portal` - Create customer portal

## How to Run Locally

### Prerequisites
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Ensure migrations are run (feat/auth-migrations PR)
# 3. Set environment variables
cp .env.local.example .env.local
\`\`\`

### Environment Variables
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
\`\`\`

### Start Development Server
\`\`\`bash
npm run dev
# Server runs on http://localhost:3000
\`\`\`

## cURL Examples & Expected Responses

### 1. Sign Up
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "displayName": "Test User"
  }'
\`\`\`

**Expected Response (201):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com"
  },
  "profile": {
    "id": "uuid",
    "email": "test@example.com",
    "display_name": "Test User",
    "verified_level": 0
  }
}
\`\`\`

### 2. Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
\`\`\`

**Expected Response (200):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com"
  },
  "profile": {
    "id": "uuid",
    "email": "test@example.com",
    "display_name": "Test User"
  }
}
\`\`\`

### 3. Get Current User
\`\`\`bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: sb-access-token=your_token"
\`\`\`

**Expected Response (200):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com"
  },
  "profile": {
    "id": "uuid",
    "email": "test@example.com",
    "display_name": "Test User",
    "verified_level": 0
  }
}
\`\`\`

### 4. Create Organization
\`\`\`bash
curl -X POST http://localhost:3000/api/orgs \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=your_token" \
  -d '{
    "name": "My Organization",
    "slug": "my-org",
    "description": "A test organization"
  }'
\`\`\`

**Expected Response (201):**
\`\`\`json
{
  "organization": {
    "id": "uuid",
    "name": "My Organization",
    "slug": "my-org",
    "description": "A test organization",
    "owner_id": "uuid",
    "created_at": "2025-01-10T00:00:00Z"
  }
}
\`\`\`

### 5. Create Room
\`\`\`bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=your_token" \
  -d '{
    "org_id": "org-uuid",
    "name": "General",
    "slug": "general",
    "visibility": "public"
  }'
\`\`\`

**Expected Response (201):**
\`\`\`json
{
  "room": {
    "id": "uuid",
    "org_id": "org-uuid",
    "name": "General",
    "slug": "general",
    "visibility": "public",
    "created_at": "2025-01-10T00:00:00Z"
  }
}
\`\`\`

### 6. Create Invite
\`\`\`bash
curl -X POST http://localhost:3000/api/invites \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=your_token" \
  -d '{
    "room_id": "room-uuid",
    "email": "invitee@example.com",
    "role": "member"
  }'
\`\`\`

**Expected Response (201):**
\`\`\`json
{
  "invite": {
    "id": "uuid",
    "room_id": "room-uuid",
    "token": "ABC123XYZ",
    "email": "invitee@example.com",
    "role": "member",
    "expires_at": "2025-01-17T00:00:00Z"
  }
}
\`\`\`

### 7. Accept Invite
\`\`\`bash
curl -X POST http://localhost:3000/api/invites/ABC123XYZ/accept \
  -H "Cookie: sb-access-token=your_token"
\`\`\`

**Expected Response (200):**
\`\`\`json
{
  "membership": {
    "id": "uuid",
    "room_id": "room-uuid",
    "user_id": "uuid",
    "role": "member"
  },
  "message": "Invite accepted successfully"
}
\`\`\`

### 8. Error Response Example
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpass"
  }'
\`\`\`

**Expected Response (401):**
\`\`\`json
{
  "error": "Invalid credentials"
}
\`\`\`

## Role-Based Access Control

### Role Hierarchy
\`\`\`
admin > creator > moderator > member > pending > banned
\`\`\`

### Permission Examples
- **Create Room**: Requires `creator` role in organization
- **Invite Members**: Requires `moderator` role in room
- **Update Room**: Requires `moderator` role in room
- **Delete Room**: Requires `admin` role in organization
- **Update Org**: Requires `admin` role in organization

## Error Handling

All endpoints follow consistent error response format:
\`\`\`json
{
  "error": "Error message",
  "details": "Optional additional details"
}
\`\`\`

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Testing

Run integration tests:
\`\`\`bash
npm run test:integration
\`\`\`

## Screenshots
N/A - Backend API only (see feat/auth-tests PR for test results)

## Known Issues
None - all endpoints tested and working

## Next Steps
1. Merge feat/auth-migrations first
2. Review and merge this PR
3. Proceed with feat/auth-tests PR
4. Implement frontend pages (Step 3)
