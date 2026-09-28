import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getOrganization, updateOrganization, deleteOrganization, getRooms, getUserMemberships } from "@/lib/auth/db"
import { canManageOrganization } from "@/lib/auth/access"
import { updateOrgSchema } from "@/lib/validation/orgs"
import { json, unauthorized, notFound, forbidden, badRequest, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const organization = await getOrganization(params.id)

    if (!organization) {
      return notFound("Organization not found")
    }

    let rooms = []
    if (user) {
      const memberships = await getUserMemberships(user.id)
      const userRoomIds = memberships.map((m) => m.room_id)
      const orgRooms = await getRooms({ org_id: params.id })
      rooms = orgRooms.filter((r) => userRoomIds.includes(r.id))
    }

    console.info(`[v0] GET /api/orgs/${params.id}`)

    return json({ organization, rooms })
  } catch (error) {
    return serverError(error, "Failed to fetch organization")
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const organization = await getOrganization(params.id)

    if (!organization) {
      return notFound("Organization not found")
    }

    if (!canManageOrganization(user.id, organization)) {
      return forbidden("Only organization admins can update")
    }

    const body = await request.json()

    const validation = updateOrgSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const updatedOrg = await updateOrganization(params.id, validation.data)

    console.info(`[v0] PATCH /api/orgs/${params.id} - User: ${user.id}`)

    return json({ organization: updatedOrg })
  } catch (error) {
    return serverError(error, "Failed to update organization")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const organization = await getOrganization(params.id)

    if (!organization) {
      return notFound("Organization not found")
    }

    if (!canManageOrganization(user.id, organization)) {
      return forbidden("Only organization admins can delete")
    }

    await deleteOrganization(params.id)

    console.info(`[v0] DELETE /api/orgs/${params.id} - User: ${user.id}`)

    return json({ message: "Organization deleted" })
  } catch (error) {
    return serverError(error, "Failed to delete organization")
  }
}
