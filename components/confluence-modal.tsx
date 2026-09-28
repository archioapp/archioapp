"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, BookOpen, TrendingUp, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Confluence } from "@/lib/analysis-data"
import { ConfluenceEditor } from "./confluence-editor"
import { useState } from "react"
import Image from "next/image"

interface ConfluenceModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  confluence: Confluence | null
}

export function ConfluenceModal({ isOpen, onOpenChange, confluence }: ConfluenceModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "chart">("overview")

  if (!confluence) return null

  const handleSave = (content: string, comments: any[], versions: any[]) => {
    console.log("Confluence saved:", { confluenceId: confluence.id, content, comments, versions })
    // Here you would typically send to your backend
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50"
          />
          <DialogContent className="max-w-5xl w-full bg-slate-grey/95 border border-zinc-700 text-white p-0 shadow-2xl shadow-black/50 rounded-2xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <DialogHeader className="p-6 pb-4 border-b border-zinc-800">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-zinc-800/50" style={{ color: confluence.color }}>
                      <confluence.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-white">{confluence.title}</DialogTitle>
                      <p className="text-zinc-400 text-lg">{confluence.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`text-sm ${
                        confluence.statusColor === "emerald"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : confluence.statusColor === "amber"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-cyan-500/20 text-cyan-400"
                      }`}
                    >
                      {confluence.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("overview")}
                    className={activeTab === "overview" ? "bg-luxury-gold text-matte-black" : "text-zinc-300"}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === "edit" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("edit")}
                    className={activeTab === "edit" ? "bg-luxury-gold text-matte-black" : "text-zinc-300"}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Edit & Annotate
                  </Button>
                  <Button
                    variant={activeTab === "chart" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("chart")}
                    className={activeTab === "chart" ? "bg-luxury-gold text-matte-black" : "text-zinc-300"}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Chart Example
                  </Button>
                </div>
              </DialogHeader>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                          <h3 className="font-bold text-white mb-3">Textbook Explanation</h3>
                          <div
                            className="text-zinc-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: confluence.textbookExplanation }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                          <h4 className="font-semibold text-white mb-3">Confidence Metrics</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">AI Confidence</span>
                                <span className="font-bold text-white">{confluence.confidence}%</span>
                              </div>
                              <div className="w-full bg-zinc-800 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${confluence.confidence}%`,
                                    backgroundColor: confluence.color,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                          <h4 className="font-semibold text-white mb-3">Relevant Pairs</h4>
                          <div className="flex flex-wrap gap-2">
                            {confluence.relevantPairs.map((pair) => (
                              <Badge key={pair} variant="secondary" className="text-xs">
                                {pair}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "edit" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ConfluenceEditor
                      confluenceId={confluence.id}
                      initialContent={confluence.textbookExplanation}
                      onSave={handleSave}
                    />
                  </motion.div>
                )}

                {activeTab === "chart" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                      <h3 className="font-bold text-white mb-4">Chart Example</h3>
                      {confluence.imagePath && (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-700">
                          <Image
                            src={confluence.imagePath || "/placeholder.svg"}
                            alt={`${confluence.title} chart example`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-zinc-400 text-sm mt-3">
                        This chart demonstrates the {confluence.title.toLowerCase()} confluence in action. Look for
                        similar patterns in your analysis.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
