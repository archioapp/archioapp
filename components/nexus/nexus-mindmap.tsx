"use client"

import type React from "react"
import { useCallback, useEffect } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  type Connection,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { motion } from "framer-motion"

interface NexusNode extends Node {
  data: {
    label: string
    category: string
    strength: number
    connections: number
    impact: "high" | "medium" | "low"
    description?: string
  }
}

interface NexusMindmapProps {
  nodes: NexusNode[]
  edges: Edge[]
  layouts: Record<string, any>
  activeLayout: string
  onNodeClick: (node: NexusNode) => void
  onPaneClick: () => void
}

const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const getNodeColor = (category: string) => {
    switch (category) {
      case "economic":
        return "from-blue-500 to-blue-700"
      case "geopolitical":
        return "from-red-500 to-red-700"
      case "market":
        return "from-green-500 to-green-700"
      case "technical":
        return "from-purple-500 to-purple-700"
      case "sentiment":
        return "from-yellow-500 to-yellow-700"
      default:
        return "from-gray-500 to-gray-700"
    }
  }

  const getImpactSize = (impact: string) => {
    switch (impact) {
      case "high":
        return "w-24 h-24"
      case "medium":
        return "w-20 h-20"
      case "low":
        return "w-16 h-16"
      default:
        return "w-20 h-20"
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className={`
        ${getImpactSize(data.impact)}
        bg-gradient-to-br ${getNodeColor(data.category)}
        rounded-full flex items-center justify-center
        border-2 ${selected ? "border-white" : "border-transparent"}
        shadow-lg cursor-pointer
        transition-all duration-200
      `}
    >
      <div className="text-center p-2">
        <div className="text-white font-semibold text-xs leading-tight">{data.label}</div>
        <div className="text-white/70 text-xs mt-1">{data.strength}%</div>
      </div>
    </motion.div>
  )
}

const nodeTypes: NodeTypes = {
  nexusNode: CustomNode,
}

export function NexusMindmap({ nodes, edges, layouts, activeLayout, onNodeClick, onPaneClick }: NexusMindmapProps) {
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges)

  useEffect(() => {
    if (layouts[activeLayout]) {
      const layoutNodes = nodes.map((node, index) => ({
        ...node,
        position: layouts[activeLayout][index] || { x: 0, y: 0 },
        type: "nexusNode",
      }))
      setNodes(layoutNodes)
    }
  }, [activeLayout, layouts, nodes, setNodes])

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick(node as NexusNode)
    },
    [onNodeClick],
  )

  return (
    <div className="w-full h-full bg-slate-950">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-950"
      >
        <Controls className="bg-slate-800 border-slate-700" />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
      </ReactFlow>
    </div>
  )
}
