import type { NextRequest } from "next/server"
import { getProfile } from "@/lib/auth/db"
import { json, notFound, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profile = await getProfile(params.id)

    if (!profile) {
      return notFound("Profile not found")
    }

    const publicProfile = {
      id: profile.id,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      verified_level: profile.verified_level,
    }

    console.info(`[v0] GET /api/users/${params.id}`)

    return json({ profile: publicProfile })
  } catch (error) {
    return serverError(error, "Failed to fetch profile")
  }
}
