import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserMemberships, getRoomMemberships, createMembership, getRoom, getMembership } from "@/lib/auth/db"
import { canManageRoom } from "@/lib/auth/access"
import { createMembershipSchema } from "@/lib/validation/memberships"
import { json, unauthorized, notFound, forbidden, badRequest, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const room_id = searchParams.get("room_id")
    const org_id = searchParams.get("org_id")
    const user_id = searchParams.get("user_id")

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    let memberships

    if (room_id) {
      memberships = await getRoomMemberships(room_id)
    } else if (user_id) {
      if (user_id !== user.id) {
        return forbidden("Cannot view other users' memberships")
      }
      memberships = await getUserMemberships(user_id)
    } else {
      memberships = await getUserMemberships(user.id)
    }

    console.info(`[v0] GET /api/memberships - User: ${user.id}`)

    return json({ memberships })
  } catch (error) {
    return serverError(error, "Failed to fetch memberships")
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

    const validation = createMembershipSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const { room_id, user_id, role } = validation.data

    const room = await getRoom(room_id)

    if (!room) {
      return notFound("Room not found")
    }

    const actorMembership = await getMembership(user.id, room_id)

    if (!canManageRoom(actorMembership, room)) {
      return forbidden("Only moderators and admins can add members")
    }

    const membership = await createMembership(room_id, user_id, role)

    console.info(`[v0] POST /api/memberships - User: ${user.id}, Added: ${user_id}`)

    return json({ membership }, { status: 201 })
  } catch (error) {
    return serverError(error, "Failed to create membership")
  }
}
