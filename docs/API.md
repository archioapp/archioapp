# API Documentation

This document describes all REST API endpoints for the Archioai platform.

## Table of Contents

- [Authentication](#authentication)
- [Users & Profiles](#users--profiles)
- [Organizations](#organizations)
- [Rooms](#rooms)
- [Memberships](#memberships)
- [Invites](#invites)
- [Subscriptions](#subscriptions)
- [Error Handling](#error-handling)

---

## Authentication

### POST /api/auth/signup

Create a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "display_name": "John Doe"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  },
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "John Doe",
    "avatar_url": null,
    "verified_level": 0,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors:**
- `400` - Invalid email or password format
- `409` - Email already exists

---

### POST /api/auth/login

Authenticate an existing user.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  },
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "John Doe",
    ...
  }
}
\`\`\`

**Errors:**
- `400` - Invalid credentials
- `401` - Authentication failed

---

### POST /api/auth/logout

Log out the current user.

**Response (200):**
\`\`\`json
{
  "message": "Logged out successfully"
}
\`\`\`

---

### GET /api/auth/me

Get the current authenticated user's information.

**Response (200):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  },
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "John Doe",
    ...
  },
  "memberships": [
    {
      "id": "uuid",
      "room_id": "uuid",
      "user_id": "uuid",
      "role": "admin",
      "joined_at": "2025-01-01T00:00:00Z"
    }
  ],
  "orgs": [
    {
      "id": "uuid",
      "name": "My Organization",
      "slug": "my-organization",
      ...
    }
  ]
}
\`\`\`

**Errors:**
- `401` - Not authenticated

---

## Users & Profiles

### GET /api/users/profile

Get the current user's profile.

**Response (200):**
\`\`\`json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "verified_level": 1,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors:**
- `401` - Not authenticated
- `404` - Profile not found

---

### PATCH /api/users/profile

Update the current user's profile.

**Request Body:**
\`\`\`json
{
  "display_name": "Jane Doe",
  "avatar_url": "https://..."
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "Jane Doe",
    "avatar_url": "https://...",
    ...
  }
}
\`\`\`

**Errors:**
- `400` - Invalid input (e.g., empty display name)
- `401` - Not authenticated

---

### GET /api/users/:id

Get a user's public profile by ID.

**Response (200):**
\`\`\`json
{
  "profile": {
    "id": "uuid",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "verified_level": 1
  }
}
\`\`\`

**Errors:**
- `404` - User not found

---

## Organizations

### GET /api/orgs

Get all organizations the current user is a member of.

**Response (200):**
\`\`\`json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "My Organization",
      "slug": "my-organization",
      "description": "A great organization",
      "owner_id": "uuid",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

**Errors:**
- `401` - Not authenticated

---

### POST /api/orgs

Create a new organization.

**Request Body:**
\`\`\`json
{
  "name": "My New Organization",
  "description": "An amazing organization"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "organization": {
    "id": "uuid",
    "name": "My New Organization",
    "slug": "my-new-organization",
    "description": "An amazing organization",
    "owner_id": "uuid",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

**Notes:**
- Automatically creates a default "general" room
- Creator is added as admin member of the default room

**Errors:**
- `400` - Invalid input (e.g., name too short)
- `401` - Not authenticated

---

### GET /api/orgs/:id

Get an organization by ID.

**Response (200):**
\`\`\`json
{
  "organization": {
    "id": "uuid",
    "name": "My Organization",
    "slug": "my-organization",
    ...
  },
  "rooms": [
    {
      "id": "uuid",
      "org_id": "uuid",
      "name": "general",
      "slug": "general",
      "is_public": false,
      ...
    }
  ]
}
\`\`\`

**Notes:**
- Only returns rooms where the user is a member
- Unauthenticated users can view organization info but not rooms

**Errors:**
- `404` - Organization not found

---

### PATCH /api/orgs/:id

Update an organization (admin/owner only).

**Request Body:**
\`\`\`json
{
  "name": "Updated Organization Name",
  "description": "Updated description"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "organization": {
    "id": "uuid",
    "name": "Updated Organization Name",
    ...
  }
}
\`\`\`

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Not authorized (only admins/owners can update)
- `404` - Organization not found

---

### DELETE /api/orgs/:id

Delete an organization (admin/owner only).

**Response (200):**
\`\`\`json
{
  "message": "Organization deleted"
}
\`\`\`

**Errors:**
- `401` - Not authenticated
- `403` - Not authorized (only admins/owners can delete)
- `404` - Organization not found

---

## Rooms

### GET /api/rooms

Get rooms for an organization.

**Query Parameters:**
- `org_id` (required): Organization ID

**Response (200):**
\`\`\`json
{
  "rooms": [
    {
      "id": "uuid",
      "org_id": "uuid",
      "name": "general",
      "slug": "general",
      "description": "General discussion",
      "is_public": false,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

**Notes:**
- Only returns rooms where the user is a member
- Unauthenticated users only see public rooms

**Errors:**
- `400` - Missing org_id parameter

---

### POST /api/rooms

Create a new room (moderator/admin only).

**Request Body:**
\`\`\`json
{
  "org_id": "uuid",
  "name": "New Room",
  "description": "A new room for discussions",
  "is_public": false
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "room": {
    "id": "uuid",
    "org_id": "uuid",
    "name": "New Room",
    "slug": "new-room",
    "description": "A new room for discussions",
    "is_public": false,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

**Notes:**
- Creator is automatically added as admin member
- Requires moderator or admin role in at least one room in the organization

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Not authorized (only moderators/admins can create rooms)
- `404` - Organization not found

---

### GET /api/rooms/:id

Get a room by ID.

**Response (200):**
\`\`\`json
{
  "room": {
    "id": "uuid",
    "org_id": "uuid",
    "name": "general",
    "slug": "general",
    "description": "General discussion",
    "is_public": false,
    ...
  }
}
\`\`\`

**Errors:**
- `403` - Access denied (not a member of private room)
- `404` - Room not found

---

### PATCH /api/rooms/:id

Update a room (moderator/admin only).

**Request Body:**
\`\`\`json
{
  "name": "Updated Room Name",
  "description": "Updated description",
  "is_public": true
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "room": {
    "id": "uuid",
    "name": "Updated Room Name",
    ...
  }
}
\`\`\`

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Not authorized (only moderators/admins can update)
- `404` - Room not found

---

### DELETE /api/rooms/:id

Delete a room (organization admin only).

**Response (200):**
\`\`\`json
{
  "message": "Room deleted"
}
\`\`\`

**Errors:**
- `401` - Not authenticated
- `403` - Not authorized (only organization admins can delete)
- `404` - Room not found

---

## Memberships

### GET /api/memberships

Get memberships.

**Query Parameters:**
- `room_id` (optional): Get memberships for a specific room
- `user_id` (optional): Get memberships for a specific user (must be self)

**Response (200):**
\`\`\`json
{
  "memberships": [
    {
      "id": "uuid",
      "room_id": "uuid",
      "user_id": "uuid",
      "role": "admin",
      "joined_at": "2025-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

**Notes:**
- Without parameters, returns current user's memberships
- `user_id` can only be used to query your own memberships

**Errors:**
- `401` - Not authenticated
- `403` - Cannot view other users' memberships

---

### POST /api/memberships

Add a member to a room (moderator/admin only).

**Request Body:**
\`\`\`json
{
  "room_id": "uuid",
  "user_id": "uuid",
  "role": "member"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "membership": {
    "id": "uuid",
    "room_id": "uuid",
    "user_id": "uuid",
    "role": "member",
    "joined_at": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Not authorized (only moderators/admins can add members)
- `404` - Room not found

---

### PATCH /api/memberships/:id

Update a member's role (moderator/admin only).

**Request Body:**
\`\`\`json
{
  "role": "moderator"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "membership": {
    "id": "uuid",
    "room_id": "uuid",
    "user_id": "uuid",
    "role": "moderator",
    ...
  }
}
\`\`\`

**Notes:**
- Cannot promote someone to a role equal to or higher than your own
- Admins can promote to moderator, moderators cannot promote to admin

**Errors:**
- `400` - Invalid role
- `401` - Not authenticated
- `403` - Insufficient permissions
- `404` - Membership not found

---

### DELETE /api/memberships/:id

Remove a member from a room.

**Response (200):**
\`\`\`json
{
  "message": "Membership removed"
}
\`\`\`

**Notes:**
- Users can remove themselves
- Moderators/admins can remove members with lower roles

**Errors:**
- `401` - Not authenticated
- `403` - Insufficient permissions
- `404` - Membership not found

---

## Invites

### GET /api/invites

Get invites for a room or organization.

**Query Parameters:**
- `room_id` (optional): Get invites for a specific room
- `org_id` (optional): Get invites for an organization

**Response (200):**
\`\`\`json
{
  "invites": [
    {
      "id": "uuid",
      "room_id": "uuid",
      "invite_code": "abc123xyz",
      "invited_by": "uuid",
      "email": null,
      "max_uses": 1,
      "used_count": 0,
      "expires_at": "2025-01-08T00:00:00Z",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

**Errors:**
- `400` - Missing room_id or org_id parameter
- `401` - Not authenticated
- `403` - Not authorized (only moderators/admins can view invites)

---

### POST /api/invites

Create an invite link (moderator/admin only).

**Request Body:**
\`\`\`json
{
  "room_id": "uuid",
  "expires_at": "2025-01-08T00:00:00Z"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "invite": {
    "id": "uuid",
    "room_id": "uuid",
    "invite_code": "abc123xyz",
    "invited_by": "uuid",
    "max_uses": 1,
    "used_count": 0,
    "expires_at": "2025-01-08T00:00:00Z",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Not authorized (only moderators/admins can create invites)
- `404` - Room not found

---

### GET /api/invites/:token

Get invite details by token.

**Response (200):**
\`\`\`json
{
  "invite": {
    "id": "uuid",
    "room_id": "uuid",
    "invite_code": "abc123xyz",
    ...
  },
  "valid": true
}
\`\`\`

**Notes:**
- `valid` indicates if the invite can still be used (not expired, not fully used)

**Errors:**
- `404` - Invite not found

---

### POST /api/invites/:token/accept

Accept an invite and join a room.

**Response (201):**
\`\`\`json
{
  "membership": {
    "id": "uuid",
    "room_id": "uuid",
    "user_id": "uuid",
    "role": "member",
    "joined_at": "2025-01-01T00:00:00Z"
  },
  "message": "Successfully joined room"
}
\`\`\`

**Errors:**
- `400` - Invite expired, fully used, or already a member
- `401` - Not authenticated
- `404` - Invite not found

---

## Subscriptions

### GET /api/subscriptions/current

Get the current user's active subscription.

**Response (200):**
\`\`\`json
{
  "subscription": {
    "id": "uuid",
    "user_id": "uuid",
    "plan_id": "uuid",
    "status": "active",
    "current_period_start": "2025-01-01T00:00:00Z",
    "current_period_end": "2025-02-01T00:00:00Z",
    "cancel_at_period_end": false,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z",
    "plans": {
      "id": "uuid",
      "name": "Pro",
      "price": 1999,
      "interval": "month",
      ...
    }
  }
}
\`\`\`

**Notes:**
- Returns `null` if user has no active subscription

**Errors:**
- `401` - Not authenticated

---

## Error Handling

All endpoints follow a consistent error response format:

\`\`\`json
{
  "error": "Error message describing what went wrong"
}
\`\`\`

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

### Common Error Scenarios

**Authentication Required:**
\`\`\`json
{
  "error": "Unauthorized"
}
\`\`\`

**Insufficient Permissions:**
\`\`\`json
{
  "error": "Only moderators and admins can create rooms"
}
\`\`\`

**Resource Not Found:**
\`\`\`json
{
  "error": "Room not found"
}
\`\`\`

**Validation Error:**
\`\`\`json
{
  "error": "Display name cannot be empty"
}
\`\`\`

---

## Role Hierarchy

The platform uses a role-based access control system:

1. **admin** - Full control over room and members
2. **creator** - Original room creator (legacy role)
3. **moderator** - Can manage room settings and invite members
4. **member** - Regular member with access to room
5. **pending** - Awaiting approval
6. **banned** - No access

### Permission Matrix

| Action | Admin | Moderator | Member |
|--------|-------|-----------|--------|
| View room | ✓ | ✓ | ✓ |
| Send messages | ✓ | ✓ | ✓ |
| Invite members | ✓ | ✓ | ✗ |
| Update room | ✓ | ✓ | ✗ |
| Manage members | ✓ | ✓ | ✗ |
| Delete room | ✓ | ✗ | ✗ |

---

## Rate Limiting

Currently, there are no rate limits enforced. This may change in future versions.

---

## Versioning

This API is currently at version 1.0. Breaking changes will be communicated in advance.
