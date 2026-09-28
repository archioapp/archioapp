"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { technicalConfluences, confluenceById, type Confluence } from "@/lib/confluences"
import { CustomConfluenceModal } from "./custom-confluence-modal"

interface ConfluenceCardProps {
  confluenceId: string
  isSelected: boolean
  onToggle: (id: string) => void
  onSettingsClick: (id: string) => void
}

function ConfluenceCard({ confluenceId, isSelected, onToggle, onSettingsClick }: ConfluenceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const confluence = confluenceById.get(confluenceId)

  if (!confluence) {
    return null // Or a fallback UI
  }

  const Icon = confluence.icon

  const cardVariants = {
    initial: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(39, 39, 42, 0.4)",
    },
    hover: {
      borderColor: "rgba(255, 255, 255, 0.3)",
      backgroundColor: "rgba(39, 39, 42, 0.7)",
    },
    selected: {
      borderColor: "rgba(52, 211, 153, 0.4)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
    },
  }

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate={isSelected ? "selected" : "initial"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onToggle(confluence.id)}
      className="relative cursor-pointer rounded-2xl border p-4 backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-zinc-300" />
          <h3 className="font-semibold text-white">{confluence.name}</h3>
        </div>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300",
            isSelected ? "border-green-400 bg-green-500" : "border-zinc-600 bg-zinc-800",
          )}
        >
          <AnimatePresence>
            {isSelected && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-3 overflow-hidden"
          >
            <p className="text-xs text-zinc-400 mb-2">{confluence.hoverDescription}</p>
            <ul className="space-y-1">
              {confluence.detectionRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-zinc-300">
                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-500" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function EnhancedConfluenceSelector({
  selectedConfluences,
  onConfluenceToggle,
  onParameterChange,
}: {
  selectedConfluences: string[]
  onConfluenceToggle: (id: string) => void
  onParameterChange: (confluenceId: string, parameterId: string, value: number) => void
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [editingConfluence, setEditingConfluence] = useState<Confluence | null>(null)

  const handleSettingsClick = (id: string) => {
    const confluence = confluenceById.get(id)
    if (confluence) {
      setEditingConfluence(confluence)
      // Logic to open settings modal for this confluence
    }
  }

  const avgStrength = Math.round((selectedConfluences.length / technicalConfluences.length) * 100)

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">Interactive Technical Confluences</h2>
            <Badge className="bg-green-900/50 text-green-300 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm text-zinc-300">Selected: </span>
              <span className="font-bold text-white">{selectedConfluences.length}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-zinc-300">Avg Strength: </span>
              <span className="font-bold text-green-400">{avgStrength}%</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Custom
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {technicalConfluences.map((confluence) => (
            <ConfluenceCard
              key={confluence.id}
              confluenceId={confluence.id}
              isSelected={selectedConfluences.includes(confluence.id)}
              onToggle={onConfluenceToggle}
              onSettingsClick={handleSettingsClick}
            />
          ))}
        </div>
      </div>
      <CustomConfluenceModal isOpen={showCreate} onOpenChange={setShowCreate} />
    </>
  )
}
