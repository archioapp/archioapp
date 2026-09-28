import type { NextRequest } from "next/server"
import { getInvite } from "@/lib/auth/db"
import { json, notFound, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const invite = await getInvite(params.token)

    if (!invite) {
      return notFound("Invite not found")
    }

    const isExpired = invite.expires_at && new Date(invite.expires_at) < new Date()
    const isFullyUsed = invite.used_count >= invite.max_uses

    console.info(`[v0] GET /api/invites/${params.token}`)

    return json({
      invite,
      valid: !isExpired && !isFullyUsed,
    })
  } catch (error) {
    return serverError(error, "Failed to fetch invite")
  }
}
