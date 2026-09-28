"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Upload } from "lucide-react"

type ChartShareModalProps = {
  isOpen: boolean
  onClose: () => void
  onImport: (layout: string) => void
}

export function ChartShareModal({ isOpen, onClose, onImport }: ChartShareModalProps) {
  const [exportedLayout, setExportedLayout] = useState("")
  const [importLayout, setImportLayout] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      // When the modal opens, automatically load the current chart layout for export.
      // We assume the layout is saved under the key 'tv_chart_1' or similar.
      // For simplicity, we'll look for the most recent chart.
      const charts = JSON.parse(localStorage.getItem("tv_charts") || "[]")
      if (charts.length > 0) {
        // Get the most recently saved chart
        const latestChart = charts.reduce((latest: any, current: any) =>
          latest.timestamp > current.timestamp ? latest : current,
        )
        setExportedLayout(JSON.stringify(latestChart, null, 2))
      } else {
        setExportedLayout(
          "No saved chart layout found. Please save your chart first using the cloud icon on the chart.",
        )
      }
      setImportLayout("") // Clear import text area on open
    }
  }, [isOpen])

  const handleCopyToClipboard = () => {
    if (exportedLayout.startsWith("No saved chart")) return
    navigator.clipboard.writeText(exportedLayout)
    toast({
      title: "Copied to Clipboard",
      description: "You can now share this layout text with others.",
    })
  }

  const handleImport = () => {
    try {
      // Basic validation to ensure it's a JSON object
      const parsedLayout = JSON.parse(importLayout)
      if (typeof parsedLayout !== "object" || !parsedLayout.content) {
        throw new Error("Invalid layout format.")
      }
      onImport(importLayout)
      toast({
        title: "Import Successful",
        description: "The chart layout has been updated.",
      })
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "The provided text is not a valid chart layout. Please check the format.",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Share Chart Layout</DialogTitle>
          <DialogDescription>
            Copy the text below to share your current layout, or paste a layout to import it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Export Current Layout</h3>
            <div className="relative">
              <Textarea
                readOnly
                value={exportedLayout}
                className="h-48 bg-slate-800 border-slate-600 text-slate-300 font-mono text-xs"
              />
              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Import New Layout</h3>
            <Textarea
              placeholder="Paste a shared chart layout here..."
              value={importLayout}
              onChange={(e) => setImportLayout(e.target.value)}
              className="h-48 bg-slate-800 border-slate-600 font-mono text-xs"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-white border-slate-600 hover:bg-slate-800 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" /> Import Layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
