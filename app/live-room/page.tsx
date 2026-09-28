import type { Metadata } from "next"
import { LiveRoom } from "@/components/live-room/live-room"

export const metadata: Metadata = {
  title: "Live Room",
  robots: { index: false, follow: false },
}

/**
 * Standalone stage for the Live Room — the same component the community
 * hub mounts for the `live-stage` view, rendered at full viewport width so
 * the room can be judged on a phone without the desktop shell.
 */
export default function LiveRoomPage() {
  return (
    <main className="h-[100dvh] w-full flex flex-col" style={{ background: "var(--vt-ink, #0A0E12)" }}>
      <LiveRoom />
    </main>
  )
}
