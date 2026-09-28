#!/usr/bin/env node
/**
 * Publishes docs/source-of-truth/ as downloadable artifacts under
 * public/docs/source-of-truth/ so the whole folder can be fetched in ONE click:
 *
 *   archio-source-of-truth.zip            every file, original names
 *   ARCHIO-CONTROL-CENTER-12-13-14.md     docs 12 + 13 + 14 as one paste-ready file
 *   ARCHIO-SOURCE-OF-TRUTH-ALL.md         README + 00…15 as one file
 *   index.html                            download page (same look as /docs/index.html)
 *   <each original .md>                   individually linkable copies
 *
 * Run:  node scripts/bundle-source-of-truth.mjs
 * Re-run after ANY edit to docs/source-of-truth — the published copies do not update themselves.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, copyFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(new URL('..', import.meta.url).pathname)
const SRC = join(ROOT, 'docs', 'source-of-truth')
const OUT = join(ROOT, 'public', 'docs', 'source-of-truth')
const ZIP_NAME = 'archio-source-of-truth.zip'
const CONTROL_BUNDLE = 'ARCHIO-CONTROL-CENTER-12-13-14.md'
const ALL_BUNDLE = 'ARCHIO-SOURCE-OF-TRUTH-ALL.md'
const CONTROL_SET = new Set([
  '12-product-design-control-center.md',
  '13-technical-backend-control-center.md',
  '14-archio-master-cross-reference.md',
])

const stamp = new Date().toISOString().slice(0, 10)

const files = readdirSync(SRC)
  .filter((f) => f.endsWith('.md'))
  .sort((a, b) => {
    // README first, then numeric prefix order
    if (a === 'README.md') return -1
    if (b === 'README.md') return 1
    return a.localeCompare(b, 'en', { numeric: true })
  })

if (files.length === 0) {
  console.error(`No markdown files found in ${SRC}`)
  process.exit(1)
}

const titleOf = (body, fallback) => {
  const m = body.match(/^#\s+(.+)$/m)
  return (m ? m[1] : fallback).replace(/\s+/g, ' ').trim()
}

const records = files.map((name) => {
  const body = readFileSync(join(SRC, name), 'utf8')
  return {
    name,
    body,
    title: titleOf(body, name.replace(/\.md$/, '')),
    lines: body.split('\n').length,
    bytes: Buffer.byteLength(body, 'utf8'),
  }
})

const fmtKb = (n) => `${Math.max(1, Math.round(n / 1024))} KB`

const bundleHeader = (label, subset) => `<!--
  ${label}
  Generated ${stamp} from docs/source-of-truth/ by scripts/bundle-source-of-truth.mjs
  ${subset.length} files concatenated in reading order. Each file starts at a line
  reading "<!-- FILE: name -->" followed by a level-1 heading, so an AI can address
  a section as "<file> §<n>" exactly as the documents cross-reference each other.

  READING ORDER FOR AN AI
    1. 14-archio-master-cross-reference.md  §0  (the AI-to-AI briefing: what ARCHIO is, who the bots are, what is real vs mock)
    2. 12-product-design-control-center.md   (every UI surface as a control record, one vocabulary)
    3. 13-technical-backend-control-center.md (every table, route, foundation, security flag — from code)
    4. everything else, only when a control record points at it
  Counts are canonical in 13 §9 — do not re-derive them.
-->

# ${label}

_Generated ${stamp}. Source of truth remains \`docs/source-of-truth/\`; this file is a convenience copy._

## Contents

| # | File | Title | Lines | Size |
|---|------|-------|------:|-----:|
${subset.map((r, i) => `| ${i + 1} | \`${r.name}\` | ${r.title} | ${r.lines} | ${fmtKb(r.bytes)} |`).join('\n')}

`

const joinBundle = (subset) =>
  subset
    .map((r) => `\n\n---\n\n<!-- FILE: ${r.name} -->\n\n${r.body.trimEnd()}\n`)
    .join('')

// Fresh output directory
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

// 1. Individual copies
for (const r of records) copyFileSync(join(SRC, r.name), join(OUT, r.name))

// 2. Bundles
const controlRecords = records.filter((r) => CONTROL_SET.has(r.name))
writeFileSync(join(OUT, CONTROL_BUNDLE), bundleHeader('ARCHIO Control Center — Documents 12, 13, 14', controlRecords) + joinBundle(controlRecords))
writeFileSync(join(OUT, ALL_BUNDLE), bundleHeader('ARCHIO Source of Truth — complete folder', records) + joinBundle(records))

// 3. Zip (originals + both bundles, flat, deterministic order)
let zipBytes = 0
try {
  execFileSync('zip', ['-q', '-X', '-j', join(OUT, ZIP_NAME), ...records.map((r) => join(OUT, r.name)), join(OUT, CONTROL_BUNDLE), join(OUT, ALL_BUNDLE)], {
    stdio: 'inherit',
  })
  zipBytes = statSync(join(OUT, ZIP_NAME)).size
} catch (err) {
  console.warn(`zip step skipped (${err.message}). Bundles and copies were still written.`)
}

// 4. Download page — same visual grammar as public/docs/index.html
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const row = (num, href, title, desc, download = true) => `    <a class="doc-link" href="${href}"${download ? ' download' : ''}>
      <span class="doc-number">${esc(num)}</span>
      <div class="doc-info">
        <div class="doc-title">${esc(title)}</div>
        <div class="doc-desc">${esc(desc)}</div>
      </div>
      <span class="arrow">&darr;</span>
    </a>`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>ARCHIO Source of Truth — downloads</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #e2e8f0; min-height: 100vh; padding: 40px 20px; }
  .container { max-width: 800px; margin: 0 auto; }
  h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; color: #fff; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #8b5cf6; margin: 36px 0 12px; }
  .subtitle { color: #64748b; font-size: 14px; margin-bottom: 8px; }
  .stamp { color: #4b5563; font-size: 12px; font-family: monospace; }
  .doc-list { display: flex; flex-direction: column; gap: 12px; }
  a.doc-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-radius: 12px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    text-decoration: none; color: #e2e8f0; transition: all 0.2s;
  }
  a.doc-link:hover { background: rgba(255,255,255,0.06); border-color: rgba(139,92,246,0.3); transform: translateX(4px); }
  a.doc-link.primary { background: rgba(139,92,246,0.10); border-color: rgba(139,92,246,0.35); }
  .doc-number { font-size: 12px; font-weight: 700; color: #8b5cf6; font-family: monospace; min-width: 44px; }
  .doc-info { flex: 1; margin-left: 16px; min-width: 0; }
  .doc-title { font-size: 15px; font-weight: 600; color: #fff; overflow-wrap: anywhere; }
  .doc-desc { font-size: 12px; color: #64748b; margin-top: 2px; }
  .arrow { color: #4b5563; font-size: 18px; margin-left: 12px; }
  .instructions { margin-top: 40px; padding: 20px; border-radius: 12px; background: rgba(139,92,246,0.05); border: 1px solid rgba(139,92,246,0.1); }
  .instructions h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #8b5cf6; margin-bottom: 8px; }
  .instructions p { font-size: 13px; color: #94a3b8; line-height: 1.6; }
  .instructions code { font-family: monospace; font-size: 12px; color: #c4b5fd; }
</style>
</head>
<body>
<div class="container">
  <h1>ARCHIO Source of Truth</h1>
  <p class="subtitle">Every control document in one download. Master copies live in <code>docs/source-of-truth/</code>.</p>
  <p class="stamp">published ${stamp} · ${records.length} files · ${fmtKb(records.reduce((n, r) => n + r.bytes, 0))} of markdown</p>

  <h2>One click</h2>
  <div class="doc-list">
${zipBytes ? row('ZIP', ZIP_NAME, 'archio-source-of-truth.zip', `All ${records.length} documents plus both bundles, original filenames · ${fmtKb(zipBytes)}`).replace('class="doc-link"', 'class="doc-link primary"') : ''}
${row('12-14', CONTROL_BUNDLE, CONTROL_BUNDLE, 'Documents 12 + 13 + 14 as ONE file — hand this to ChatGPT; it opens with the AI-to-AI briefing')}
${row('ALL', ALL_BUNDLE, ALL_BUNDLE, `README + 00…15 as ONE file · ${fmtKb(records.reduce((n, r) => n + r.bytes, 0))}`)}
  </div>

  <h2>Individual files</h2>
  <div class="doc-list">
${records.map((r) => row(r.name.replace(/\.md$/, '').slice(0, 2).toUpperCase() === 'RE' ? 'READ' : r.name.slice(0, 2), r.name, r.title, `${r.name} · ${r.lines} lines · ${fmtKb(r.bytes)}`)).join('\n')}
  </div>

  <div class="instructions">
    <h3>For the AI pipeline</h3>
    <p>v0 writes the documents → you hand <code>${CONTROL_BUNDLE}</code> to ChatGPT → ChatGPT briefs the Grok bots using the IDs inside (record IDs from 12, F-/S- flags from 13, Q-/B-/D-/T- items from 14). Every ID is stable; quote it rather than paraphrasing the record.</p>
    <p style="margin-top:8px">These copies are regenerated by <code>node scripts/bundle-source-of-truth.mjs</code>. If a date here is older than the newest file in <code>docs/source-of-truth/</code>, ask v0 to re-run it.</p>
  </div>
</div>
</body>
</html>
`
writeFileSync(join(OUT, 'index.html'), html)

// Summary
console.log(`Published ${records.length} documents to public/docs/source-of-truth/`)
for (const r of records) console.log(`  ${r.name.padEnd(46)} ${String(r.lines).padStart(5)} lines  ${fmtKb(r.bytes).padStart(7)}`)
console.log(`  ${CONTROL_BUNDLE.padEnd(46)} ${fmtKb(statSync(join(OUT, CONTROL_BUNDLE)).size).padStart(14)}`)
console.log(`  ${ALL_BUNDLE.padEnd(46)} ${fmtKb(statSync(join(OUT, ALL_BUNDLE)).size).padStart(14)}`)
if (zipBytes) console.log(`  ${ZIP_NAME.padEnd(46)} ${fmtKb(zipBytes).padStart(14)}`)
console.log('Open /docs/source-of-truth/index.html on the preview to download.')
