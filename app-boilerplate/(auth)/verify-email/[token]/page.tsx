"use client"

import { useParams } from "next/navigation"

export default function Page() {
  const { token } = useParams<{ token: string }>()
  return (
    <div>
      <h1 className="text-3xl font-bold">Verify Email: {token}</h1>
      <div className="mt-4" />
    </div>
  )
}
