import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const body = await req.json()
  const { mentorId, entryId, userId } = body
  const { error } = await sb.from("mentor_notifications").insert({
    mentor_id: mentorId,
    entry_id: entryId,
    from_user_id: userId,
    kind: "copied_entry",
    created_at: new Date().toISOString(),
    read: false,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
