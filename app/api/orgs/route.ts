import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserOrganizations, createOrganization, createRoom, createMembership } from "@/lib/auth/db"
import { createOrgSchema } from "@/lib/validation/orgs"
import { json, unauthorized, badRequest, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const organizations = await getUserOrganizations(user.id)

    console.info(`[v0] GET /api/orgs - User: ${user.id}`)

    return json({ organizations })
  } catch (error) {
    return serverError(error, "Failed to fetch organizations")
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

    const validation = createOrgSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const organization = await createOrganization(user.id, validation.data)

    // Create default "general" room
    const room = await createRoom({
      org_id: organization.id,
      name: "general",
      is_public: false,
    })

    // Add creator as admin member
    await createMembership(room.id, user.id, "admin")

    console.info(`[v0] POST /api/orgs - User: ${user.id}, Org: ${organization.id}`)

    return json({ organization }, { status: 201 })
  } catch (error) {
    return serverError(error, "Failed to create organization")
  }
}
