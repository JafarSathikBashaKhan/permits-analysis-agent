#!/usr/bin/env node
/*
 * Multi-module UI inventory orchestrator.
 * Scans every (pages)/<module>/ folder and produces:
 *   1) Per-module JSON (inventory-<Module>.json) — full element rows
 *   2) Combined index (inventory-INDEX.json) — module → counts
 *   3) Markdown summary (UI-INVENTORY.md) — human-readable overview
 *   4) Gap list (UI-GAPS.md) — collisions + missing-unique elements
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const PAGES_ROOT = String.raw`C:\Users\jafar.s\Automation_Codes\ApplyIQ\Developers_Source_Code\MNPS-Permission-UI\src\app\(pages)`;
const SCANNER   = path.join(__dirname, "ui-inventory-scanner.js");
const OUT_DIR   = path.join(__dirname, "ui-inventory");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const modules = fs.readdirSync(PAGES_ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

console.log(`Found ${modules.length} module folders. Scanning…\n`);

const index = [];
const globalGaps = [];

for (const mod of modules) {
    const moduleFolder = path.join(PAGES_ROOT, mod);
    const outJson = path.join(OUT_DIR, `inventory-${mod}.json`);
    try {
        execFileSync("node", [SCANNER, moduleFolder, outJson], { stdio: ["ignore", "ignore", "pipe"] });
        const data = JSON.parse(fs.readFileSync(outJson, "utf8"));
        const s = data.summary;
        index.push({
            module: mod,
            files: s.fileCount,
            components: s.componentCount,
            elements: s.elementCount,
            byKind: data.elements.reduce((a, r) => { a[r.kind] = (a[r.kind] || 0) + 1; return a; }, {}),
            componentsDetail: s.components,
        });

        // Capture collisions (non-unique testid/id/name) — these need fixing in UI
        for (const r of data.elements) {
            if ((r.kind === "data-testid" || r.kind === "id" || r.kind === "name") && !r.isUnique) {
                globalGaps.push({ module: mod, ...r });
            }
        }
        console.log(`  ${mod.padEnd(25)} ${String(s.fileCount).padStart(3)} files  ${String(s.componentCount).padStart(3)} components  ${String(s.elementCount).padStart(4)} elements`);
    } catch (e) {
        console.log(`  ${mod.padEnd(25)} SKIPPED (${e.message.split("\n")[0]})`);
    }
}

// Sort & totals
index.sort((a, b) => b.elements - a.elements);
const totals = index.reduce((a, m) => {
    a.files += m.files; a.components += m.components; a.elements += m.elements;
    for (const k of Object.keys(m.byKind)) a.byKind[k] = (a.byKind[k] || 0) + m.byKind[k];
    return a;
}, { files: 0, components: 0, elements: 0, byKind: {} });

fs.writeFileSync(path.join(OUT_DIR, "inventory-INDEX.json"),
    JSON.stringify({ scannedAt: new Date().toISOString(), totals, modules: index }, null, 2));

// Markdown summary
let md = `# UI Element Inventory — MNPS-Permission-UI\n\n`;
md += `*Scanned ${new Date().toISOString()}*\n\n`;
md += `## Totals\n\n`;
md += `- **Modules:**     ${index.length}\n`;
md += `- **Files:**       ${totals.files}\n`;
md += `- **Components:**  ${totals.components}\n`;
md += `- **Elements:**    ${totals.elements}\n\n`;
md += `## Elements by selector kind\n\n`;
md += `| Kind | Count |\n|---|---:|\n`;
for (const k of Object.keys(totals.byKind).sort()) md += `| ${k} | ${totals.byKind[k]} |\n`;
md += `\n## Modules\n\n`;
md += `| Module | Files | Components | Elements | data-testid | id | name | aria-label | placeholder |\n`;
md += `|---|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
for (const m of index) {
    md += `| ${m.module} | ${m.files} | ${m.components} | ${m.elements} | ${m.byKind["data-testid"]||0} | ${m.byKind["id"]||0} | ${m.byKind["name"]||0} | ${m.byKind["aria-label"]||0} | ${m.byKind["placeholder"]||0} |\n`;
}
fs.writeFileSync(path.join(OUT_DIR, "UI-INVENTORY.md"), md);

// Gap list
let gap = `# UI Selector Gap Report\n\n`;
gap += `Elements where a \`data-testid\`, \`id\`, or \`name\` is reused across multiple components.\n`;
gap += `These cause locator collisions in automation tests — UI team should make each value unique per component.\n\n`;

const byValue = {};
for (const g of globalGaps) (byValue[g.value] ||= []).push(g);

gap += `**${Object.keys(byValue).length} unique colliding values across ${globalGaps.length} occurrences.**\n\n`;
gap += `| Value | Kind | Occurrences | Files |\n|---|---|---:|---|\n`;
const sortedColl = Object.entries(byValue).sort((a, b) => b[1].length - a[1].length).slice(0, 80);
for (const [val, occ] of sortedColl) {
    const files = occ.map(o => `${o.module}/${o.component}:${o.line}`).join(" · ");
    gap += `| \`${val}\` | ${occ[0].kind} | ${occ.length} | ${files} |\n`;
}
fs.writeFileSync(path.join(OUT_DIR, "UI-GAPS.md"), gap);

console.log("");
console.log("====================================================");
console.log(`Modules scanned : ${index.length}`);
console.log(`Files           : ${totals.files}`);
console.log(`Components      : ${totals.components}`);
console.log(`Elements        : ${totals.elements}`);
console.log(`Collisions      : ${Object.keys(byValue).length} unique values, ${globalGaps.length} occurrences`);
console.log("");
console.log(`Output dir      : ${OUT_DIR}`);
console.log(`  • UI-INVENTORY.md    — module-by-module summary`);
console.log(`  • UI-GAPS.md         — gap list for UI team`);
console.log(`  • inventory-INDEX.json — machine-readable index`);
console.log(`  • inventory-<Module>.json — per-module rows`);
