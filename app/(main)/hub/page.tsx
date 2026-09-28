import { StudentCollaborationHub } from "@/components/student-collaboration-hub"

/* Room-Navigator alignment (July 2026): the auth guard here (and the
   matching /hub entry in lib/supabase/middleware.ts protectedRoots) was
   removed so the MENTOR HALL "Collab Hub" door works — the hub renders
   the same mock demo data as the public /dashboard. When real per-user
   collaboration data lands, restore the Supabase getUser() check +
   redirect("/login?from=/hub") and re-add /hub to protectedRoots. */
export default function HubPage() {
  return <StudentCollaborationHub />
}
