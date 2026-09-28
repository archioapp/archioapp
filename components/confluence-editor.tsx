"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  MessageSquare,
  Save,
  History,
  Undo,
  Redo,
  Eye,
  Edit3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Comment {
  id: string
  text: string
  author: string
  timestamp: string
  position: { start: number; end: number }
  resolved: boolean
}

interface Version {
  id: string
  content: string
  timestamp: string
  author: string
  changes: string
}

interface ConfluenceEditorProps {
  confluenceId: string
  initialContent: string
  onSave: (content: string, comments: Comment[], versions: Version[]) => void
}

export function ConfluenceEditor({ confluenceId, initialContent, onSave }: ConfluenceEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [comments, setComments] = useState<Comment[]>([])
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedText, setSelectedText] = useState("")
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showVersions, setShowVersions] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  // Load saved data from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`confluence-comments-${confluenceId}`)
    const savedVersions = localStorage.getItem(`confluence-versions-${confluenceId}`)
    const savedContent = localStorage.getItem(`confluence-content-${confluenceId}`)

    if (savedComments) setComments(JSON.parse(savedComments))
    if (savedVersions) setVersions(JSON.parse(savedVersions))
    if (savedContent) setContent(savedContent)
  }, [confluenceId])

  // Save to localStorage
  const saveToStorage = (newContent: string, newComments: Comment[], newVersions: Version[]) => {
    localStorage.setItem(`confluence-content-${confluenceId}`, newContent)
    localStorage.setItem(`confluence-comments-${confluenceId}`, JSON.stringify(newComments))
    localStorage.setItem(`confluence-versions-${confluenceId}`, JSON.stringify(newVersions))
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString())
    }
  }

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
  }

  const highlightText = () => {
    if (selectedText) {
      applyFormatting("hiliteColor", "#fbbf24")
    }
  }

  const addComment = () => {
    if (!commentText.trim() || !selectedText) return

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      author: "Current User",
      timestamp: new Date().toISOString(),
      position: { start: 0, end: selectedText.length },
      resolved: false,
    }

    const updatedComments = [...comments, newComment]
    setComments(updatedComments)
    setCommentText("")
    setShowCommentInput(false)
    setSelectedText("")

    saveToStorage(content, updatedComments, versions)
  }

  const saveVersion = () => {
    const newVersion: Version = {
      id: Date.now().toString(),
      content: content,
      timestamp: new Date().toISOString(),
      author: "Current User",
      changes: "Manual save",
    }

    const updatedVersions = [...versions, newVersion]
    setVersions(updatedVersions)
    saveToStorage(content, comments, updatedVersions)
    onSave(content, comments, updatedVersions)

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("confluence:edited", {
        detail: { confluenceId, content, comments: updatedVersions },
      }),
    )
  }

  const toggleComment = (commentId: string) => {
    const updatedComments = comments.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c))
    setComments(updatedComments)
    saveToStorage(content, updatedComments, versions)
  }

  const loadVersion = (version: Version) => {
    setContent(version.content)
    if (editorRef.current) {
      editorRef.current.innerHTML = version.content
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-zinc-300 hover:text-white"
          >
            {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? "Preview" : "Edit"}
          </Button>

          {isEditing && (
            <>
              <div className="w-px h-6 bg-zinc-600" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormatting("bold")}
                      className="text-zinc-300 hover:text-white"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormatting("italic")}
                      className="text-zinc-300 hover:text-white"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormatting("underline")}
                      className="text-zinc-300 hover:text-white"
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={highlightText}
                      disabled={!selectedText}
                      className="text-zinc-300 hover:text-white disabled:opacity-50"
                    >
                      <Highlighter className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Highlight Selection</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCommentInput(true)}
                      disabled={!selectedText}
                      className="text-zinc-300 hover:text-white disabled:opacity-50"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Comment to Selection</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="w-px h-6 bg-zinc-600" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormatting("undo")}
                      className="text-zinc-300 hover:text-white"
                    >
                      <Undo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormatting("redo")}
                      className="text-zinc-300 hover:text-white"
                    >
                      <Redo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVersions(!showVersions)}
            className="text-zinc-300 hover:text-white"
          >
            <History className="w-4 h-4 mr-1" />
            Versions ({versions.length})
          </Button>

          {isEditing && (
            <Button variant="ghost" size="sm" onClick={saveVersion} className="text-emerald-300 hover:text-emerald-200">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Selected text indicator */}
      {selectedText && (
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-md">
          <p className="text-sm text-amber-200">
            Selected: <span className="font-mono">"{selectedText}"</span>
          </p>
        </div>
      )}

      {/* Comment input */}
      {showCommentInput && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md space-y-2">
          <p className="text-sm text-blue-200">Add comment to: "{selectedText}"</p>
          <Textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter your comment..."
            className="bg-zinc-800 border-zinc-600 text-white"
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addComment} className="bg-blue-600 hover:bg-blue-700">
              Add Comment
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowCommentInput(false)
                setCommentText("")
              }}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={isEditing}
        onMouseUp={handleTextSelection}
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        className={cn(
          "min-h-[200px] p-4 rounded-lg border text-white leading-relaxed",
          isEditing
            ? "bg-zinc-900/50 border-zinc-600 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
            : "bg-zinc-900/30 border-zinc-700",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
        suppressContentEditableWarning={true}
      />

      {/* Comments sidebar */}
      {comments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comments ({comments.filter((c) => !c.resolved).length} active)
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={cn(
                  "p-3 rounded-md border text-sm",
                  comment.resolved ? "bg-zinc-800/50 border-zinc-700 opacity-60" : "bg-blue-500/10 border-blue-500/30",
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-white">{comment.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleComment(comment.id)}
                      className="h-6 px-2 text-xs"
                    >
                      {comment.resolved ? "Reopen" : "Resolve"}
                    </Button>
                  </div>
                </div>
                <p className="text-zinc-200">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Version history */}
      {showVersions && versions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <History className="w-4 h-4" />
            Version History
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {versions
              .slice()
              .reverse()
              .map((version, index) => (
                <div key={version.id} className="p-3 rounded-md border bg-zinc-800/50 border-zinc-700 text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-white">Version {versions.length - index}</span>
                      <span className="text-zinc-400 ml-2">by {version.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">{new Date(version.timestamp).toLocaleString()}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => loadVersion(version)}
                        className="h-6 px-2 text-xs text-blue-300 hover:text-blue-200"
                      >
                        Load
                      </Button>
                    </div>
                  </div>
                  <p className="text-zinc-300 mt-1">{version.changes}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
