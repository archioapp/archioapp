"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { UltraConfluenceCard } from "./ultra-confluence-card"
import { ULTRA_CONFLUENCES } from "./types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CustomConfluenceModal } from "@/components/custom-confluence-modal"
import { useState } from "react"

export function UltraConfluencePanel() {
  const [openCustom, setOpenCustom] = useState(false)

  const gridVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.1,
        },
      },
    }),
    [],
  )

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 20 } },
  }

  return (
    <div className="w-full premium-glass-container p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Confluences</h3>
          <p className="text-xs text-zinc-400">Cinematic stagger, unique motion per card, purple glass UI.</p>
        </div>
        <Button className="liquid-glass-button h-9" onClick={() => setOpenCustom(true)}>
          <Plus className="w-4 h-4 mr-2" /> Custom
        </Button>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {ULTRA_CONFLUENCES.map((c, idx) => (
          <motion.div key={c.id} variants={itemVariants} style={{ zIndex: 10 - (idx % 3) }}>
            <UltraConfluenceCard id={c.id} />
          </motion.div>
        ))}
      </motion.div>

      <CustomConfluenceModal open={openCustom} onOpenChange={setOpenCustom} />
    </div>
  )
}
