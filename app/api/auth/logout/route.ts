import { createClient } from "@/lib/supabase/server"
import { json, serverError } from "@/lib/http/json"

export async function POST() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      // Supabase not available -- still return success since
      // the client-side signOut handles cookie/localStorage cleanup
      return json({ message: "Logged out successfully" })
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("[Logout] Supabase signOut error:", error)
      return serverError(error, "Failed to log out")
    }

    return json({ message: "Logged out successfully" })
  } catch (error) {
    return serverError(error, "Failed to log out")
  }
}
