import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateMembership, deleteMembership, getMembership } from "@/lib/auth/db"
import { canUpdateMemberRole, canRemoveMember } from "@/lib/auth/access"
import { updateMembershipSchema } from "@/lib/validation/memberships"
import { json, unauthorized, notFound, forbidden, badRequest, serverError } from "@/lib/http/json"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const body = await request.json()

    const validation = updateMembershipSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const { data: targetMembership, error: fetchError } = await (await createClient())
      .from("memberships")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !targetMembership) {
      return notFound("Membership not found")
    }

    const actorMembership = await getMembership(user.id, targetMembership.room_id)

    if (!canUpdateMemberRole(actorMembership, targetMembership)) {
      return forbidden("Insufficient permissions to update role")
    }

    const updatedMembership = await updateMembership(params.id, validation.data.role)

    console.info(`[v0] PATCH /api/memberships/${params.id} - User: ${user.id}`)

    return json({ membership: updatedMembership })
  } catch (error) {
    return serverError(error, "Failed to update membership")
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

    const { data: targetMembership, error: fetchError } = await (await createClient())
      .from("memberships")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !targetMembership) {
      return notFound("Membership not found")
    }

    const isSelf = targetMembership.user_id === user.id

    if (!isSelf) {
      const actorMembership = await getMembership(user.id, targetMembership.room_id)

      if (!canRemoveMember(actorMembership, targetMembership)) {
        return forbidden("Insufficient permissions to remove member")
      }
    }

    await deleteMembership(params.id)

    console.info(`[v0] DELETE /api/memberships/${params.id} - User: ${user.id}`)

    return json({ message: "Membership removed" })
  } catch (error) {
    return serverError(error, "Failed to delete membership")
  }
}
