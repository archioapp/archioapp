"use client"

import { useParams } from "next/navigation"

export default function Page() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <div>
      <h1 className="text-3xl font-bold">Blog Post: {slug}</h1>
      <div className="mt-4" />
    </div>
  )
}
