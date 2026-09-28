import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRooms, createRoom, getOrganization, getMembership, createMembership } from "@/lib/auth/db"
import { canManageRoom } from "@/lib/auth/access"
import { createRoomSchema } from "@/lib/validation/rooms"
import { json, unauthorized, notFound, forbidden, badRequest, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const org_id = searchParams.get("org_id")

    if (!org_id) {
      return badRequest("org_id query parameter is required")
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const filters: any = { org_id }

    if (user) {
      filters.user_id = user.id
    }

    const rooms = await getRooms(filters)

    console.info(`[v0] GET /api/rooms?org_id=${org_id} - User: ${user?.id || "anonymous"}`)

    return json({ rooms })
  } catch (error) {
    return serverError(error, "Failed to fetch rooms")
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const body = await request.json()

    const validation = createRoomSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const organization = await getOrganization(validation.data.org_id)

    if (!organization) {
      return notFound("Organization not found")
    }

    // Check if user has any room membership in this org with moderator+ role
    const orgRooms = await getRooms({ org_id: validation.data.org_id })
    let hasModeratorAccess = organization.owner_id === user.id

    if (!hasModeratorAccess) {
      for (const room of orgRooms) {
        const membership = await getMembership(user.id, room.id)
        if (membership && canManageRoom(membership, room)) {
          hasModeratorAccess = true
          break
        }
      }
    }

    if (!hasModeratorAccess) {
      return forbidden("Only moderators and admins can create rooms")
    }

    const room = await createRoom(validation.data)

    await createMembership(room.id, user.id, "admin")

    console.info(`[v0] POST /api/rooms - User: ${user.id}, Room: ${room.id}`)

    return json({ room }, { status: 201 })
  } catch (error) {
    return serverError(error, "Failed to create room")
  }
}
