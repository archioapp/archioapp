"use client"

import { useParams } from "next/navigation"

export default function VerifyEmailPage() {
  const params = useParams<{ token: string }>()
  return (
    <main>
      <h1>Email Verification: {String(params.token)}</h1>
      <div />
    </main>
  )
}
