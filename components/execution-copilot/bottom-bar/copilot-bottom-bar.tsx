import type React from "react"
import { ConfluenceBottomBar } from "./confluence-bottom-bar"

const CopilotBottomBar: React.FC = () => {
  return (
    <div className="copilot-bottom-bar">
      {/* Main content of the bottom bar */}
      <ConfluenceBottomBar />
    </div>
  )
}

export default CopilotBottomBar
