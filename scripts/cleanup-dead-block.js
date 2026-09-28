import { readFileSync, writeFileSync } from 'fs'

import { resolve } from 'path'
const filePath = resolve(process.cwd(), 'components', 'copilot', 'ai', 'CopilotAIView.tsx')
console.log('Resolved path:', filePath)
const content = readFileSync(filePath, 'utf-8')
const lines = content.split('\n')

// Find line 887 (0-indexed: 886) with "DEAD-BLOCK-PART-B"
const deadBlockStart = lines.findIndex(l => l.includes('DEAD-BLOCK-PART-B'))
console.log('Dead block start at line:', deadBlockStart + 1)

// Find "CONTENT LAYER" 
const contentLayerLine = lines.findIndex(l => l.includes('CONTENT LAYER'))
console.log('Content layer at line:', contentLayerLine + 1)

if (deadBlockStart === -1 || contentLayerLine === -1) {
  console.log('Could not find markers, aborting')
  process.exit(1)
}

// We want to remove from deadBlockStart (the {/* DEAD-BLOCK-PART-B */} line) 
// through the line BEFORE the CONTENT LAYER comment block start
// The CONTENT LAYER comment block starts 2 lines before the "CONTENT LAYER" text (the opening {/* line)
const contentLayerBlockStart = contentLayerLine - 1 // the line with ═══ opening

// Remove lines from deadBlockStart through contentLayerBlockStart (exclusive of content layer)
// Actually we need to remove: deadBlockStart line AND everything up to but not including the CONTENT LAYER AnimatePresence
// The actual content we want to keep starts at line 1088 (AnimatePresence mode="wait")
const animatePresenceLine = lines.findIndex((l, idx) => idx > deadBlockStart && l.includes('<AnimatePresence mode="wait">') && idx > contentLayerLine)
console.log('AnimatePresence at line:', animatePresenceLine + 1)

// Remove from deadBlockStart to the line before the AnimatePresence
const newLines = [
  ...lines.slice(0, deadBlockStart), // everything before dead block
  '', // empty line
  ...lines.slice(animatePresenceLine) // from AnimatePresence onward
]

writeFileSync(filePath, newLines.join('\n'))
console.log('Removed lines', deadBlockStart + 1, 'through', animatePresenceLine)
console.log('Total lines removed:', animatePresenceLine - deadBlockStart)
