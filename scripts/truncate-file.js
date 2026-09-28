// fs loaded below

const path = require('path');
const fs = require('fs');
// Try finding the file
const possiblePaths = [
  path.join(__dirname, '..', 'components/copilot/analytics/PsychologyAnalytics.tsx'),
  '/vercel/share/v0-project/components/copilot/analytics/PsychologyAnalytics.tsx',
  path.join(process.cwd(), 'components/copilot/analytics/PsychologyAnalytics.tsx'),
];
let filePath;
for (const p of possiblePaths) {
  console.log('Trying:', p, 'exists:', fs.existsSync(p));
  if (fs.existsSync(p)) { filePath = p; break; }
}
if (!filePath) { console.log('CWD:', process.cwd(), '__dirname:', __dirname); process.exit(1); }
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// Find the orphan removal point marker
const markerIndex = lines.findIndex(l => l.includes('___ORPHAN_REMOVAL_POINT___'));
if (markerIndex === -1) {
  console.log('Marker not found!');
  process.exit(1);
}

// Keep everything up to but not including the marker line
const goodLines = lines.slice(0, markerIndex);
const result = goodLines.join('\n') + '\n';

fs.writeFileSync(filePath, result, 'utf-8');
console.log(`Truncated file at line ${markerIndex + 1}. Kept ${goodLines.length} lines. Removed ${lines.length - markerIndex} lines.`);
