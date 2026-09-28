import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'components', 'copilot', 'ai', 'CopilotAIView.tsx')
console.log('Looking for file at:', filePath)
const lines = fs.readFileSync(filePath, 'utf8').split('\n')

console.log('Total lines before:', lines.length)

// Find the start: line with "old-code-start-marker" 
const startIdx = lines.findIndex(l => l.includes('old-code-start-marker'))

// Find the end: the line with "CONTENT LAYER" 
const contentLayerIdx = lines.findIndex(l => l.includes('CONTENT LAYER'))

if (startIdx === -1) {
  console.log('ERROR: old-code-start-marker not found')
  process.exit(1)
}
if (contentLayerIdx === -1) {
  console.log('ERROR: CONTENT LAYER not found')
  process.exit(1)
}

console.log('old-code-start-marker at line:', startIdx + 1)
console.log('CONTENT LAYER at line:', contentLayerIdx + 1)

// The CONTENT LAYER comment block starts with {/* two lines above 
// We need to find the {/* that starts the content layer comment
// It should be at contentLayerIdx - 1 (the ══════ opening line)
let blockStart = contentLayerIdx
while (blockStart > startIdx && !lines[blockStart].trim().startsWith('{/*')) {
  blockStart--
}

console.log('Content layer comment block starts at line:', blockStart + 1)
console.log('Content:', lines[blockStart])

// Show context
console.log('\n--- Lines we are REMOVING (first 5 and last 5) ---')
for (let i = startIdx; i < Math.min(startIdx + 5, blockStart); i++) {
  console.log(`  ${i+1}: ${lines[i].substring(0, 80)}`)
}
console.log('  ...')
for (let i = Math.max(blockStart - 5, startIdx); i < blockStart; i++) {
  console.log(`  ${i+1}: ${lines[i].substring(0, 80)}`)
}

console.log('\n--- Lines we are KEEPING (first 3) ---')
for (let i = blockStart; i < blockStart + 3; i++) {
  console.log(`  ${i+1}: ${lines[i].substring(0, 80)}`)
}

// Remove from startIdx to blockStart (exclusive)
const removedCount = blockStart - startIdx
console.log(`\nRemoving ${removedCount} lines (lines ${startIdx + 1} through ${blockStart})`)

const newLines = [
  ...lines.slice(0, startIdx),
  ...lines.slice(blockStart)
]

fs.writeFileSync(filePath, newLines.join('\n'))
console.log(`Done. File now has ${newLines.length} lines (was ${lines.length})`)
