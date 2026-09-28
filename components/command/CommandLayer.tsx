"use client"

import { useEffect, useCallback } from "react"
import { useCommandStore } from "@/lib/stores/commandStore"
import { CommandRail } from "@/components/command/CommandRail"
import { CommandBar } from "@/components/command/CommandBar"

/**
 * CommandLayer — Root wrapper for the Archio Command Layer.
 * Handles keyboard shortcuts and renders both surfaces.
 * Place this in the root layout so it persists across navigation.
 */
export function CommandLayer() {
  const {
    toggleRail,
    toggleCommandBar,
    setCommandBarOpen,
    railOpen,
    setRailOpen,
    setRailCollapsed,
    commandBarOpen,
  } = useCommandStore()

  // Global keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Cmd+K / Ctrl+K → toggle floating command bar
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggleCommandBar()
        return
      }

      // Cmd+Shift+A → toggle persistent rail
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "A") {
        e.preventDefault()
        if (!railOpen) {
          setRailOpen(true)
          setRailCollapsed(false)
        } else {
          setRailOpen(false)
        }
        return
      }

      // Escape → close command bar if open
      if (e.key === "Escape" && commandBarOpen) {
        e.preventDefault()
        setCommandBarOpen(false)
        return
      }
    },
    [toggleRail, toggleCommandBar, commandBarOpen, railOpen, setRailOpen, setRailCollapsed, setCommandBarOpen]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Listen for command:execute events from CommandBar
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const query = e.detail?.query
      if (query) {
        // Give the rail time to mount, then dispatch the query
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("command:send", { detail: { query } })
          )
        }, 300)
      }
    }
    window.addEventListener("command:execute", handler as EventListener)
    return () => window.removeEventListener("command:execute", handler as EventListener)
  }, [])

  return (
    <>
      <CommandRail />
      <CommandBar />
    </>
  )
}
