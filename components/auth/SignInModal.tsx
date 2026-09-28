"use client"
import { useState } from "react"
import { useSession, type Role } from "@/lib/stores/useSession"
import { generateUUID } from "@/lib/utils/uuid"

export default function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn } = useSession()
  const [handle, setHandle] = useState("trader")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("STUDENT")
  if (!open) return null
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 60 }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 16,
          top: 56,
          minWidth: 280,
          background: "rgba(20,22,28,.95)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 12,
          padding: "12px",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Sign in (dev stub)</div>
        <label style={{ fontSize: 12, opacity: 0.8 }}>Handle</label>
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          style={{
            width: "100%",
            margin: "6px 0 10px",
            background: "#0f1217",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 8,
            color: "#e5e7eb",
            padding: "8px",
          }}
        />
        <label style={{ fontSize: 12, opacity: 0.8 }}>Email (optional)</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            margin: "6px 0 10px",
            background: "#0f1217",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 8,
            color: "#e5e7eb",
            padding: "8px",
          }}
        />
        <label style={{ fontSize: 12, opacity: 0.8 }}>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={{
            width: "100%",
            margin: "6px 0 12px",
            background: "#0f1217",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 8,
            color: "#e5e7eb",
            padding: "8px",
          }}
        >
          <option value="STUDENT">STUDENT</option>
          <option value="MENTOR">MENTOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button
          onClick={() => {
            signIn({ id: generateUUID(), handle, email: email || undefined, role })
            onClose()
          }}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 10,
            background: "linear-gradient(90deg,#7c3aed,#6366f1)",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  )
}
