"use client"

import { useState, useCallback, useEffect } from "react"
import { generateUUID } from "@/lib/utils/uuid"

export interface NexusNode {
  id: string
  label: string
  type: "market" | "indicator" | "event" | "confluence"
  x: number
  y: number
  strength: number
  connections: string[]
  metadata?: Record<string, any>
}

export interface NexusEdge {
  id: string
  source: string
  target: string
  weight: number
  type: "correlation" | "causation" | "influence"
  label?: string
}

export interface NexusGraphData {
  nodes: NexusNode[]
  edges: NexusEdge[]
}

export interface UseNexusGraphReturn {
  graphData: NexusGraphData
  selectedNode: NexusNode | null
  isLoading: boolean
  error: string | null

  // Actions
  addNode: (node: Omit<NexusNode, "id">) => void
  updateNode: (id: string, updates: Partial<NexusNode>) => void
  removeNode: (id: string) => void
  addEdge: (edge: Omit<NexusEdge, "id">) => void
  removeEdge: (id: string) => void
  selectNode: (node: NexusNode | null) => void
  refreshGraph: () => Promise<void>
  clearGraph: () => void
}

export function useNexusGraph(): UseNexusGraphReturn {
  const [graphData, setGraphData] = useState<NexusGraphData>({
    nodes: [],
    edges: [],
  })
  const [selectedNode, setSelectedNode] = useState<NexusNode | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addNode = useCallback((nodeData: Omit<NexusNode, "id">) => {
    const newNode: NexusNode = {
      ...nodeData,
      id: generateUUID(),
    }
    setGraphData((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }))
  }, [])

  const updateNode = useCallback((id: string, updates: Partial<NexusNode>) => {
    setGraphData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
    }))
  }, [])

  const removeNode = useCallback(
    (id: string) => {
      setGraphData((prev) => ({
        nodes: prev.nodes.filter((node) => node.id !== id),
        edges: prev.edges.filter((edge) => edge.source !== id && edge.target !== id),
      }))
      if (selectedNode?.id === id) {
        setSelectedNode(null)
      }
    },
    [selectedNode],
  )

  const addEdge = useCallback((edgeData: Omit<NexusEdge, "id">) => {
    const newEdge: NexusEdge = {
      ...edgeData,
      id: generateUUID(),
    }
    setGraphData((prev) => ({
      ...prev,
      edges: [...prev.edges, newEdge],
    }))
  }, [])

  const removeEdge = useCallback((id: string) => {
    setGraphData((prev) => ({
      ...prev,
      edges: prev.edges.filter((edge) => edge.id !== id),
    }))
  }, [])

  const selectNode = useCallback((node: NexusNode | null) => {
    setSelectedNode(node)
  }, [])

  const refreshGraph = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate API call or data refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // In a real implementation, this would fetch fresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh graph")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearGraph = useCallback(() => {
    setGraphData({ nodes: [], edges: [] })
    setSelectedNode(null)
    setError(null)
  }, [])

  // Initialize with sample data
  useEffect(() => {
    const sampleNodes: NexusNode[] = [
      {
        id: "1",
        label: "EUR/USD",
        type: "market",
        x: 100,
        y: 100,
        strength: 0.8,
        connections: ["2", "3"],
      },
      {
        id: "2",
        label: "DXY",
        type: "indicator",
        x: 200,
        y: 150,
        strength: 0.9,
        connections: ["1"],
      },
      {
        id: "3",
        label: "ECB Meeting",
        type: "event",
        x: 150,
        y: 200,
        strength: 0.7,
        connections: ["1"],
      },
    ]

    const sampleEdges: NexusEdge[] = [
      {
        id: "e1",
        source: "1",
        target: "2",
        weight: 0.8,
        type: "correlation",
        label: "Inverse correlation",
      },
      {
        id: "e2",
        source: "3",
        target: "1",
        weight: 0.6,
        type: "influence",
        label: "Policy impact",
      },
    ]

    setGraphData({ nodes: sampleNodes, edges: sampleEdges })
  }, [])

  return {
    graphData,
    selectedNode,
    isLoading,
    error,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    selectNode,
    refreshGraph,
    clearGraph,
  }
}
