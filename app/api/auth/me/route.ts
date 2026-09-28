import { createClient } from "@/lib/supabase/server"
import { getProfile, getUserMemberships, getUserOrganizations } from "@/lib/auth/db"
import { json, unauthorized, serverError } from "@/lib/http/json"

export async function GET() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return unauthorized("Authentication service unavailable")
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const profile = await getProfile(user.id)
    const memberships = await getUserMemberships(user.id)
    const orgs = await getUserOrganizations(user.id)

    return json({
      user,
      profile,
      memberships,
      orgs,
    })
  } catch (error) {
    return serverError(error, "Failed to fetch user")
  }
}
