"use client"

import { useParams } from "next/navigation"

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>()
  return (
    <main>
      <h1>Blog Post: {String(params.slug)}</h1>
      <div />
    </main>
  )
}
