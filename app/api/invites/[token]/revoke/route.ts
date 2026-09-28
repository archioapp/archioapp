import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { deleteInvite, getMembership } from "@/lib/auth/db"
import { canInviteToRoom } from "@/lib/auth/access"

export async function DELETE(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the invite to check room_id
    const { data: invite, error: fetchError } = await (await createClient())
      .from("invites")
      .select("*")
      .eq("id", params.token)
      .single()

    if (fetchError || !invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    }

    // Check permissions
    const membership = await getMembership(user.id, invite.room_id)

    if (!canInviteToRoom(membership)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    await deleteInvite(params.token)

    return NextResponse.json({ message: "Invite revoked" })
  } catch (error) {
    console.error("[v0] Error revoking invite:", error)
    return NextResponse.json({ error: "Failed to revoke invite" }, { status: 500 })
  }
}
