"use client"

import { Badge } from "@/components/ui/badge"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

export function ConfluenceBadge({
  icon,
  label,
  className,
}: {
  icon: string
  label: string
  className?: string
}) {
  const Icon = (Icons as any)[icon] ?? Icons.CircleDot
  return (
    <Badge
      variant="secondary"
      className={cn("inline-flex items-center gap-1 bg-zinc-800/60 border-zinc-700 text-zinc-200", className)}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs">{label}</span>
    </Badge>
  )
}
