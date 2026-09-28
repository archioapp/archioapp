import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRoom, updateRoom, deleteRoom, getMembership, getOrganization } from "@/lib/auth/db"
import { canManageRoom, canAccessRoom, canManageOrganization } from "@/lib/auth/access"
import { updateRoomSchema } from "@/lib/validation/rooms"
import { json, unauthorized, notFound, forbidden, badRequest, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const room = await getRoom(params.id)

    if (!room) {
      return notFound("Room not found")
    }

    const membership = user ? await getMembership(user.id, room.id) : null

    if (!canAccessRoom(membership, room)) {
      return forbidden("Access denied to this room")
    }

    console.info(`[v0] GET /api/rooms/${params.id} - User: ${user?.id || "anonymous"}`)

    return json({ room })
  } catch (error) {
    return serverError(error, "Failed to fetch room")
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

    const room = await getRoom(params.id)

    if (!room) {
      return notFound("Room not found")
    }

    const membership = await getMembership(user.id, room.id)

    if (!canManageRoom(membership, room)) {
      return forbidden("Only moderators and admins can update rooms")
    }

    const body = await request.json()

    const validation = updateRoomSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const updatedRoom = await updateRoom(params.id, validation.data)

    console.info(`[v0] PATCH /api/rooms/${params.id} - User: ${user.id}`)

    return json({ room: updatedRoom })
  } catch (error) {
    return serverError(error, "Failed to update room")
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

    const room = await getRoom(params.id)

    if (!room) {
      return notFound("Room not found")
    }

    const organization = await getOrganization(room.org_id)

    if (!organization || !canManageOrganization(user.id, organization)) {
      return forbidden("Only organization admins can delete rooms")
    }

    await deleteRoom(params.id)

    console.info(`[v0] DELETE /api/rooms/${params.id} - User: ${user.id}`)

    return json({ message: "Room deleted" })
  } catch (error) {
    return serverError(error, "Failed to delete room")
  }
}
