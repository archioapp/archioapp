"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CoachQna } from "@/components/copilot/coach/CoachQna"

export function CoachButtons() {
  const [showS, setShowS] = useState(false)
  const [showP, setShowP] = useState(false)
  return (
    <>
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => setShowS(true)}>
          Strategy
        </Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => setShowP(true)}>
          Psychology
        </Button>
      </div>
      <CoachQna flow="strategy" open={showS} onClose={() => setShowS(false)} />
      <CoachQna flow="psychology" open={showP} onClose={() => setShowP(false)} />
    </>
  )
}
