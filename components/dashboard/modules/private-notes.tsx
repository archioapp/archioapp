"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS } from "@/components/mtf/mtf-theme"
import type { PrivateNote } from "../dashboard-types"
import { BookOpen, Plus, Lock, Sparkles, Link2, X } from "lucide-react"

const NOTE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  reflection: { label: "Reflection", color: ACCENT.amber.rgb },
  lesson: { label: "Lesson", color: ACCENT.emerald.rgb },
  bookmark: { label: "Bookmark", color: ACCENT.blue.rgb },
  setup: { label: "Setup", color: ACCENT.purple.rgb },
}

interface Props {
  notes: PrivateNote[]
}

export function PrivateNotesModule({ notes }: Props) {
  const [localNotes, setLocalNotes] = useState(notes)
  const [showComposer, setShowComposer] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [newNoteType, setNewNoteType] = useState<string>("reflection")

  const addNote = () => {
    if (!newNote.trim()) return
    const note: PrivateNote = {
      id: `pn-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString().split("T")[0],
      tags: [],
      type: newNoteType as any,
    }
    setLocalNotes(prev => [note, ...prev])
    setNewNote("")
    setShowComposer(false)
  }

  return (
    <div
      className="h-full"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${ACCENT.amber.rgb},0.08)`,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4" style={{ color: `rgba(${ACCENT.amber.rgb},0.6)` }} />
            <span className={TYPE.label} style={{ color: `rgba(${ACCENT.slate.rgb},0.5)` }}>Private Notes</span>
          </div>
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="p-1.5 rounded-lg transition-all duration-150 hover:scale-110"
            style={{
              background: `rgba(${ACCENT.amber.rgb},0.08)`,
              border: `1px solid rgba(${ACCENT.amber.rgb},0.15)`,
            }}
          >
            {showComposer ? (
              <X className="w-3.5 h-3.5" style={{ color: ACCENT.amber.hex }} />
            ) : (
              <Plus className="w-3.5 h-3.5" style={{ color: ACCENT.amber.hex }} />
            )}
          </button>
        </div>

        {/* Composer */}
        <AnimatePresence>
          {showComposer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div
                className="p-4 rounded-xl"
                style={{ background: SURFACE.recess, border: `1px solid rgba(${ACCENT.amber.rgb},0.1)` }}
              >
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a private reflection, lesson, or bookmark..."
                  className="w-full bg-transparent text-white text-xs leading-relaxed resize-none outline-none placeholder:text-slate-500"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid rgba(${ACCENT.slate.rgb},0.06)` }}>
                  <div className="flex items-center gap-1.5">
                    {Object.entries(NOTE_TYPE_CONFIG).map(([type, config]) => (
                      <button
                        key={type}
                        onClick={() => setNewNoteType(type)}
                        className="px-2 py-1 rounded text-[8px] font-mono uppercase tracking-wider font-semibold transition-all"
                        style={{
                          background: newNoteType === type ? `rgba(${config.color},0.12)` : `rgba(${config.color},0.03)`,
                          border: `1px solid rgba(${config.color},${newNoteType === type ? 0.25 : 0.05})`,
                          color: newNoteType === type ? `rgba(${config.color},0.9)` : `rgba(${config.color},0.4)`,
                        }}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={addNote}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150 hover:scale-105"
                    style={{
                      background: `rgba(${ACCENT.amber.rgb},0.15)`,
                      border: `1px solid rgba(${ACCENT.amber.rgb},0.3)`,
                      color: ACCENT.amber.hex,
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes list */}
        <div className="space-y-2.5">
          {localNotes.map((note, i) => {
            const config = NOTE_TYPE_CONFIG[note.type] || NOTE_TYPE_CONFIG.reflection

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-3.5 rounded-xl"
                style={{ background: SURFACE.recess, border: `1px solid rgba(${config.color},0.04)` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold"
                    style={{ background: `rgba(${config.color},0.1)`, color: `rgba(${config.color},0.7)` }}
                  >
                    {config.label}
                  </span>
                  <span className={TYPE.caption}>{note.createdAt}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: `rgba(255,255,255,0.6)` }}>
                  {note.content}
                </p>
                {(note.linkedForecastId || note.linkedTradeId) && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Link2 className="w-3 h-3" style={{ color: `rgba(${ACCENT.blue.rgb},0.4)` }} />
                    <span className="text-[9px] font-mono" style={{ color: `rgba(${ACCENT.blue.rgb},0.5)` }}>
                      Linked: {note.linkedForecastId || note.linkedTradeId}
                    </span>
                  </div>
                )}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono" style={{ color: `rgba(${config.color},0.4)` }}>#{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
