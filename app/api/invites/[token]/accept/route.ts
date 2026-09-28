import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getInvite, createMembership, incrementInviteUsage, getMembership } from "@/lib/auth/db"
import { json, unauthorized, notFound, badRequest, serverError } from "@/lib/http/json"

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const invite = await getInvite(params.token)

    if (!invite) {
      return notFound("Invite not found")
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return badRequest("Invite has expired")
    }

    if (invite.used_count >= invite.max_uses) {
      return badRequest("Invite has been fully used")
    }

    const existingMembership = await getMembership(user.id, invite.room_id)

    if (existingMembership) {
      return badRequest("Already a member of this room")
    }

    const membership = await createMembership(invite.room_id, user.id, "member")

    await incrementInviteUsage(invite.id)

    console.info(`[v0] POST /api/invites/${params.token}/accept - User: ${user.id}`)

    return json(
      {
        membership,
        message: "Successfully joined room",
      },
      { status: 201 },
    )
  } catch (error) {
    return serverError(error, "Failed to accept invite")
  }
}
