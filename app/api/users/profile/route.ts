import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile, updateProfile } from "@/lib/auth/db"
import { updateProfileSchema } from "@/lib/validation/profile"
import { json, unauthorized, notFound, badRequest, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const profile = await getProfile(user.id)

    if (!profile) {
      return notFound("Profile not found")
    }

    console.info(`[v0] GET /api/users/profile - User: ${user.id}`)

    return json({ profile })
  } catch (error) {
    return serverError(error, "Failed to fetch profile")
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const body = await request.json()

    const validation = updateProfileSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const profile = await updateProfile(user.id, validation.data)

    console.info(`[v0] PATCH /api/users/profile - User: ${user.id}`)

    return json({ profile })
  } catch (error) {
    return serverError(error, "Failed to update profile")
  }
}
