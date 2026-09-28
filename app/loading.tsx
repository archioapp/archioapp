import { Loader2 } from "lucide-react"

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/20 backdrop-blur-md">
      <div className="flex items-center gap-3 text-zinc-200">
        <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  )
}
