"use client"

import { useState, useCallback } from "react"
import { NexusMindmap } from "@/components/nexus/nexus-mindmap"
import { NexusControlPanel } from "@/components/nexus/nexus-control-panel"
import { NexusAISynthesisPanel } from "@/components/nexus/nexus-ai-synthesis-panel"
import { NexusNodeDetailPanel } from "@/components/nexus/nexus-node-detail-panel"
import { useNexusGraph } from "@/hooks/use-nexus-graph"

const DEFAULT_LAYOUTS: Record<string, { x: number; y: number }[]> = {
  circular: [
    { x: 400, y: 100 },
    { x: 550, y: 300 },
    { x: 250, y: 300 },
  ],
  force: [
    { x: 300, y: 150 },
    { x: 500, y: 250 },
    { x: 200, y: 350 },
  ],
  hierarchical: [
    { x: 400, y: 50 },
    { x: 250, y: 200 },
    { x: 550, y: 200 },
  ],
}

export default function NexusPage() {
  const { graphData, selectedNode, selectNode } = useNexusGraph()

  const [activeLayout, setActiveLayout] = useState("circular")

  const handleNodeClick = useCallback(
    (node: any) => {
      selectNode(node)
    },
    [selectNode],
  )

  const handlePaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const layouts = DEFAULT_LAYOUTS

  return (
    <div className="h-screen w-full bg-slate-950 text-white relative flex overflow-hidden">
      <div className="flex-grow relative">
        <NexusMindmap
          nodes={graphData.nodes as any[]}
          edges={graphData.edges as any[]}
          layouts={layouts}
          activeLayout={activeLayout}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
        />
        <NexusControlPanel
          layouts={Object.keys(layouts)}
          activeLayout={activeLayout}
          onLayoutChange={setActiveLayout}
        />
        <NexusAISynthesisPanel />
      </div>
      <NexusNodeDetailPanel node={selectedNode as any} onClose={() => selectNode(null)} />
    </div>
  )
}
