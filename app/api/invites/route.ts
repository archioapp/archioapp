import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createInvite, getRoom, getMembership, getRoomInvites } from "@/lib/auth/db"
import { canInviteToRoom } from "@/lib/auth/access"
import { createInviteSchema } from "@/lib/validation/invites"
import { json, unauthorized, notFound, forbidden, badRequest, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const room_id = searchParams.get("room_id")
    const org_id = searchParams.get("org_id")

    if (!room_id && !org_id) {
      return badRequest("room_id or org_id query parameter is required")
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    if (room_id) {
      const membership = await getMembership(user.id, room_id)

      if (!canInviteToRoom(membership)) {
        return forbidden("Only moderators and admins can view invites")
      }

      const invites = await getRoomInvites(room_id)

      console.info(`[v0] GET /api/invites?room_id=${room_id} - User: ${user.id}`)

      return json({ invites })
    }

    // TODO: Implement org-level invites if needed
    return json({ invites: [] })
  } catch (error) {
    return serverError(error, "Failed to fetch invites")
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

    const validation = createInviteSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const { room_id, expires_at } = validation.data

    const room = await getRoom(room_id)

    if (!room) {
      return notFound("Room not found")
    }

    const membership = await getMembership(user.id, room_id)

    if (!canInviteToRoom(membership)) {
      return forbidden("Only moderators and admins can create invites")
    }

    const invite = await createInvite(room_id, user.id, {
      max_uses: 1,
      expires_at,
    })

    console.info(`[v0] POST /api/invites - User: ${user.id}, Room: ${room_id}`)

    return json({ invite }, { status: 201 })
  } catch (error) {
    return serverError(error, "Failed to create invite")
  }
}
