"use client"

import { useParams } from "next/navigation"

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>()
  return (
    <main>
      <h1>Reset Password: {String(params.token)}</h1>
      <div />
    </main>
  )
}
