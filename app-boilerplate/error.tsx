"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold text-red-600">An error occurred</h1>
      <p className="mt-2 text-sm text-slate-600">{error?.message ?? "Unknown error"}</p>
      <button
        className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
