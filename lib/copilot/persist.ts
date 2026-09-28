import type { CopilotEvent } from "./types"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const sb = createClient(supabaseUrl, supabaseKey)

export async function persistCopilotEvents(events: CopilotEvent[]) {
  // Create "copilot_events" table first (see SQL below)
  const { error } = await sb.from("copilot_events").insert(events)
  if (error) throw error
}
