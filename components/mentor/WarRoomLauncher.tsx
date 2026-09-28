"use client"

import type { WarRoom } from "@/lib/mentor/types"

interface Props {
  warRooms: WarRoom[]
  mentorName: string
}

export function WarRoomLauncher({ warRooms, mentorName }: Props) {
  if (warRooms.length === 0) return null

  return (
    <div className="mx-3 my-2">
      {warRooms.map(room => {
        const elapsed = Math.round((Date.now() - new Date(room.createdAt).getTime()) / 60000)
        const phaseColor = room.phase === "ACTIVE" ? "#10b981" : room.phase === "FORMING" ? "#f59e0b" : "#6b7280"

        return (
          <button
            key={room.id}
            className="w-full rounded-xl px-3 py-3 text-left transition-all duration-300 group relative overflow-hidden cursor-pointer hover:brightness-110"
            style={{
              backgroundColor: `${phaseColor}06`,
              border: `1px solid ${phaseColor}15`,
            }}
          >
            {/* Pulse overlay */}
            <div
              className="absolute inset-0 animate-pulse opacity-30"
              style={{ background: `radial-gradient(ellipse at 20% 50%, ${phaseColor}10, transparent 60%)` }}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: phaseColor }} />
                  </div>
                  <span className="text-[7px] font-mono font-black tracking-[0.14em] uppercase" style={{ color: `${phaseColor}80` }}>
                    WAR ROOM
                  </span>
                  <span
                    className="text-[6px] font-mono font-black tracking-wider uppercase px-1 py-0.5 rounded"
                    style={{ color: phaseColor, backgroundColor: `${phaseColor}10` }}
                  >
                    {room.phase}
                  </span>
                </div>
                <span className="text-[8px] font-mono tabular-nums text-white/20">{elapsed}m ago</span>
              </div>

              <div className="mt-1.5">
                <span className="text-[10px] font-mono font-bold text-white/60">
                  {room.instrument} {room.direction === "BEARISH" ? "Short" : "Long"}
                </span>
              </div>
              <p className="text-[8px] font-mono text-white/25 mt-1 leading-relaxed">{room.thesis}</p>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-[8px] font-mono text-white/15">{room.participantCount} watching</span>
                <span className="text-[8px] font-mono text-white/15">{room.messageCount} messages</span>
                <span className="text-[8px] font-mono font-bold ml-auto group-hover:text-white/50 transition-colors" style={{ color: `${phaseColor}50` }}>
                  {"JOIN ->"}
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
