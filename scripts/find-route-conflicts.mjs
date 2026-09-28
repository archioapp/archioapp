// Auto-detect Next.js app dir and report sibling dynamic routes
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const IGNORE = new Set(["node_modules", ".git", ".next", "dist", "build", "out"]);

// try common locations first
const tryDirs = ["app", "src/app"];

async function findAppDir(root = process.cwd()) {
  for (const d of tryDirs) {
    const p = path.join(root, d);
    if (existsSync(p)) return p;
  }
  // fallback: walk repo to find an "app" folder that looks like Next.js
  async function walk(dir) {
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); }
    catch { return null; }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (IGNORE.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.name === "app") {
        // quick sanity check: contains layout or page or api
        try {
          const kids = await fs.readdir(p);
          if (kids.some(k => /^(layout|page)\.(t|j)sx?$/.test(k)) || kids.includes("api"))
            return p;
        } catch {}
      }
      const hit = await walk(p);
      if (hit) return hit;
    }
    return null;
  }
  return await walk(root);
}

const DYNAMIC = /^\[(.+)\]$/;
const ROUTE_GROUP = /^\(.+\)$/;

async function scan(dir, report = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  // collect immediate child dynamic segments under this parent
  const dynamic = new Map();
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const name = e.name;
    if (ROUTE_GROUP.test(name)) {
      await scan(path.join(dir, name), report);
      continue;
    }
    const m = name.match(DYNAMIC);
    if (m) dynamic.set(m[1], path.join(dir, name));
  }
  if (dynamic.size > 1) {
    report.push({
      parent: dir,
      segments: [...dynamic.entries()].map(([seg, full]) => ({ seg, full })),
    });
  }
  for (const e of entries) {
    if (e.isDirectory() && !ROUTE_GROUP.test(e.name)) {
      await scan(path.join(dir, e.name), report);
    }
  }
  return report;
}

const appDir = await findAppDir();
if (!appDir) {
  console.error("❌ Could not locate a Next.js app directory. Looked for app/ and src/app/, then scanned the repo.");
  console.error("Working dir:", process.cwd());
  process.exit(1);
}

console.log("🔎 Scanning:", appDir);
const conflicts = await scan(appDir);

if (conflicts.length === 0) {
  console.log("✅ No dynamic route conflicts found.");
} else {
  console.log("❌ Dynamic route conflicts:");
  for (const c of conflicts) {
    console.log(`\nParent: ${path.relative(process.cwd(), c.parent)}`);
    for (const s of c.segments) {
      console.log(`  - [${s.seg}]  -> ${path.relative(process.cwd(), s.full)}`);
    }
  }
  console.log("\nFix: Under each Parent choose ONE param name (e.g. [id]) and rename the others to match.");
  process.exitCode = 1;
}
