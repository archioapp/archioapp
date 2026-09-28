"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Globe,
  Coins,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  Target,
  Brain,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type FilterType = "all" | "forex" | "crypto" | "indices" | "commodities"
export type DirectionFilter = "all" | "long" | "short"
export type LevelFilter = "all" | "beginner" | "intermediate" | "advanced" | "expert"
export type TimeRangeFilter = "all" | "today" | "week" | "month" | "quarter" | "year"
export type SortOption = "newest" | "oldest" | "accuracy" | "likes" | "views" | "winrate"

export interface FilterState {
  search: string
  category: FilterType
  direction: DirectionFilter
  level: LevelFilter
  timeRange: TimeRangeFilter
  accuracyRange: [number, number]
  winRateRange: [number, number]
  sortBy: SortOption
  sortOrder: "asc" | "desc"
}

interface AdvancedFilterSystemProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

export function AdvancedFilterSystem({ filters, onFiltersChange, className }: AdvancedFilterSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      category: "all",
      direction: "all",
      level: "all",
      timeRange: "all",
      accuracyRange: [0, 100],
      winRateRange: [0, 100],
      sortBy: "newest",
      sortOrder: "desc",
    })
    setActiveFilters([])
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.category !== "all") count++
    if (filters.direction !== "all") count++
    if (filters.level !== "all") count++
    if (filters.timeRange !== "all") count++
    if (filters.accuracyRange[0] > 0 || filters.accuracyRange[1] < 100) count++
    if (filters.winRateRange[0] > 0 || filters.winRateRange[1] < 100) count++
    return count
  }

  const categoryOptions = [
    { value: "all", label: "All Categories", icon: Filter },
    { value: "forex", label: "Forex", icon: Globe },
    { value: "crypto", label: "Crypto", icon: Coins },
    { value: "indices", label: "Indices", icon: BarChart3 },
    { value: "commodities", label: "Commodities", icon: Target },
  ]

  const directionOptions = [
    { value: "all", label: "All Directions", icon: SlidersHorizontal },
    { value: "long", label: "Long", icon: TrendingUp },
    { value: "short", label: "Short", icon: TrendingDown },
  ]

  const levelOptions = [
    { value: "all", label: "All Levels", icon: Users },
    { value: "beginner", label: "Beginner", icon: Star },
    { value: "intermediate", label: "Intermediate", icon: Star },
    { value: "advanced", label: "Advanced", icon: Star },
    { value: "expert", label: "Expert", icon: Brain },
  ]

  const timeRangeOptions = [
    { value: "all", label: "All Time", icon: Calendar },
    { value: "today", label: "Today", icon: Calendar },
    { value: "week", label: "This Week", icon: Calendar },
    { value: "month", label: "This Month", icon: Calendar },
    { value: "quarter", label: "This Quarter", icon: Calendar },
    { value: "year", label: "This Year", icon: Calendar },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "accuracy", label: "Highest Accuracy" },
    { value: "likes", label: "Most Liked" },
    { value: "views", label: "Most Viewed" },
    { value: "winrate", label: "Best Win Rate" },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search forecasts, students, instruments..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 premium-glass-input"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {categoryOptions.slice(0, 4).map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                onClick={() => updateFilter("category", option.value as FilterType)}
                variant={filters.category === option.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "glassy-flash",
                  filters.category === option.value
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "border-purple-400/50 text-purple-300 hover:bg-purple-500/10",
                )}
              >
                <Icon className="w-3 h-3 mr-1" />
                {option.label}
              </Button>
            )
          })}
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 glassy-flash relative"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Advanced
          {getActiveFilterCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs px-1.5 py-0.5 min-w-[20px] h-5">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>

        {/* Reset Filters */}
        {getActiveFilterCount() > 0 && (
          <Button
            onClick={resetFilters}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          >
            <X className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="premium-glass-card p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-400" />
                Advanced Filters
              </h3>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Direction Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Direction</Label>
                <div className="grid grid-cols-1 gap-2">
                  {directionOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.value}
                        onClick={() => updateFilter("direction", option.value as DirectionFilter)}
                        variant={filters.direction === option.value ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "justify-start glassy-flash",
                          filters.direction === option.value
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "border-zinc-700 text-zinc-300 hover:bg-zinc-700/50",
                        )}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Level Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Trader Level</Label>
                <div className="grid grid-cols-1 gap-2">
                  {levelOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.value}
                        onClick={() => updateFilter("level", option.value as LevelFilter)}
                        variant={filters.level === option.value ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "justify-start glassy-flash",
                          filters.level === option.value
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "border-zinc-700 text-zinc-300 hover:bg-zinc-700/50",
                        )}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Time Range Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Time Range</Label>
                <div className="grid grid-cols-1 gap-2">
                  {timeRangeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.value}
                        onClick={() => updateFilter("timeRange", option.value as TimeRangeFilter)}
                        variant={filters.timeRange === option.value ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "justify-start glassy-flash",
                          filters.timeRange === option.value
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "border-zinc-700 text-zinc-300 hover:bg-zinc-700/50",
                        )}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Range Sliders */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Accuracy Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">
                  Accuracy Range: {filters.accuracyRange[0]}% - {filters.accuracyRange[1]}%
                </Label>
                <Slider
                  value={filters.accuracyRange}
                  onValueChange={(value) => updateFilter("accuracyRange", value as [number, number])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Win Rate Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">
                  Win Rate Range: {filters.winRateRange[0]}% - {filters.winRateRange[1]}%
                </Label>
                <Slider
                  value={filters.winRateRange}
                  onValueChange={(value) => updateFilter("winRateRange", value as [number, number])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white">Sort By</Label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => updateFilter("sortBy", option.value as SortOption)}
                    variant={filters.sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "glassy-flash",
                      filters.sortBy === option.value
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "border-zinc-700 text-zinc-300 hover:bg-zinc-700/50",
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-zinc-400">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              Search: "{filters.search}"
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilter("search", "")} />
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filters.category}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilter("category", "all")} />
            </Badge>
          )}
          {filters.direction !== "all" && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filters.direction}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilter("direction", "all")} />
            </Badge>
          )}
          {filters.level !== "all" && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filters.level}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilter("level", "all")} />
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  )
}
