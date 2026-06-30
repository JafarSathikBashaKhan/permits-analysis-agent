#!/usr/bin/env node
/*
 * UI Element Inventory Scanner
 * ----------------------------
 * Walks .tsx files in a module folder of the MNPS-Permission-UI repo and
 * extracts every locator candidate the test automation would need:
 *
 *   • data-testid     (best — guaranteed unique-per-page if devs use it well)
 *   • id              (good — DOM-unique by HTML spec, but often reused)
 *   • name            (good for form inputs)
 *   • aria-label      (decent — readable, can collide)
 *   • placeholder     (decent — but copy-driven)
 *   • role + text     (fallback)
 *   • button/h1/h2 inner text constants  (fallback)
 *
 * For every match we record file, line, surrounding component, raw text,
 * and a selector "kind" + "value". Output is a flat JSON the test code
 * (or a SQL importer) can consume.
 *
 * Usage:
 *   node ui-inventory-scanner.js <moduleFolder> <outputJson>
 */
const fs = require("fs");
const path = require("path");

const moduleFolder = process.argv[2];
const outputJson   = process.argv[3];

if (!moduleFolder || !outputJson) {
    console.error("Usage: node ui-inventory-scanner.js <moduleFolder> <outputJson>");
    process.exit(2);
}

// Recursively collect .tsx / .ts files
function collectFiles(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...collectFiles(full));
        else if (/\.(tsx|ts)$/.test(entry.name)) out.push(full);
    }
    return out;
}

// One regex per locator kind. Each captures the literal selector value.
// Designed to match BOTH JSX literal form ( data-testid="x" ) and JSX
// expression form ( data-testid={"x"} or data-testid={`x`} ).
const patterns = [
    { kind: "data-testid", re: /data-testid\s*=\s*[{]?\s*["'`]([^"'`]+)["'`]/g, weight: 100 },
    { kind: "data-testid", re: /\bdataTestId\s*=\s*[{]?\s*["'`]([^"'`]+)["'`]/g, weight: 100 },
    { kind: "data-testid", re: /\btestId\s*=\s*[{]?\s*["'`]([^"'`]+)["'`]/g, weight: 100 },
    { kind: "id",          re: /\sid\s*=\s*[{]?\s*["'`]([A-Za-z][^"'`{}\s]+)["'`]/g, weight: 80 },
    { kind: "name",        re: /\sname\s*=\s*[{]?\s*["'`]([A-Za-z][^"'`{}\s]+)["'`]/g, weight: 70 },
    { kind: "aria-label",  re: /aria-label\s*=\s*[{]?\s*["'`]([^"'`]+)["'`]/g, weight: 60 },
    { kind: "aria-label",  re: /\bariaLabel\s*=\s*[{]?\s*["'`]([^"'`]+)["'`]/g, weight: 60 },
    { kind: "placeholder", re: /placeholder\s*=\s*[{]?\s*["'`]([^"'`]+)["'`]/g, weight: 40 },
    { kind: "placeholder", re: /\bplaceHolder\s*=\s*[{]?\s*["'`]([^"'`]+)["'`]/g, weight: 40 },
    { kind: "role",        re: /\brole\s*=\s*["'`]([a-z][^"'`]+)["'`]/g, weight: 20 },
];

// Capture button / heading / link inner-text constants — useful as fallback
// selectors when no attribute is present.
const textPatterns = [
    { kind: "button-text",   re: /<Button[^>]*>\s*([A-Z][A-Za-z0-9 &/\-]{1,60})\s*</g, weight: 50 },
    { kind: "menuitem-text", re: /<MenuItem[^>]*>\s*([A-Z][A-Za-z0-9 &/\-]{1,60})\s*</g, weight: 50 },
    { kind: "tab-text",      re: /<Tab[^>]*label\s*=\s*["'`]([A-Z][A-Za-z0-9 &/\-]{1,60})["'`]/g, weight: 50 },
    { kind: "h-text",        re: /<(?:h1|h2|h3|Typography)[^>]*>\s*([A-Z][A-Za-z0-9 &/\-]{1,60})\s*</g, weight: 30 },
];

const results = [];
const files = collectFiles(moduleFolder);

for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);
    const rel = path.relative(moduleFolder, file).replace(/\\/g, "/");
    const component = path.basename(file).replace(/\.(tsx|ts)$/, "");

    function lineOf(offset) {
        // Convert char offset to 1-based line number
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            count += lines[i].length + 1; // +1 for newline
            if (count > offset) return i + 1;
        }
        return lines.length;
    }

    for (const p of [...patterns, ...textPatterns]) {
        // Reset lastIndex on the shared regex
        p.re.lastIndex = 0;
        let m;
        while ((m = p.re.exec(text)) !== null) {
            const value = m[1].trim();
            if (!value || value.length > 120) continue;
            // Skip dynamic-looking values (full template expressions)
            if (/\$\{|\.\./.test(value)) continue;

            results.push({
                file: rel,
                component,
                line: lineOf(m.index),
                kind: p.kind,
                value,
                weight: p.weight,
            });
        }
    }
}

// Dedup: same file + component + kind + value collapsed to first occurrence
const seen = new Map();
for (const r of results) {
    const key = `${r.file}|${r.component}|${r.kind}|${r.value}`;
    if (!seen.has(key)) seen.set(key, r);
}
const deduped = Array.from(seen.values());

// Uniqueness analysis — flag values that repeat across components (potential collision)
const valueCounts = new Map();
for (const r of deduped) {
    if (r.kind === "data-testid" || r.kind === "id" || r.kind === "name") {
        valueCounts.set(r.value, (valueCounts.get(r.value) || 0) + 1);
    }
}
for (const r of deduped) {
    r.globalCount = valueCounts.get(r.value) || 1;
    r.isUnique = r.globalCount === 1;
}

// Sort: by component, then weight desc, then kind
deduped.sort((a, b) => {
    if (a.component !== b.component) return a.component.localeCompare(b.component);
    if (a.weight !== b.weight) return b.weight - a.weight;
    return a.kind.localeCompare(b.kind);
});

// Summaries
const byComponent = {};
for (const r of deduped) {
    const c = byComponent[r.component] ||= {
        component: r.component,
        file: r.file,
        elementCount: 0,
        byKind: {},
        unique: 0,
        nonUnique: 0,
    };
    c.elementCount++;
    c.byKind[r.kind] = (c.byKind[r.kind] || 0) + 1;
    if (r.isUnique) c.unique++;
    else c.nonUnique++;
}

const summary = {
    moduleFolder,
    scannedAt: new Date().toISOString(),
    fileCount: files.length,
    elementCount: deduped.length,
    componentCount: Object.keys(byComponent).length,
    components: Object.values(byComponent).sort((a, b) =>
        b.elementCount - a.elementCount
    ),
};

fs.writeFileSync(outputJson, JSON.stringify({ summary, elements: deduped }, null, 2));

// Console report
console.log("");
console.log("UI Inventory Scan");
console.log("=================");
console.log(`Module folder : ${moduleFolder}`);
console.log(`Files scanned : ${files.length}`);
console.log(`Components    : ${summary.componentCount}`);
console.log(`Elements      : ${deduped.length}`);
console.log("");
console.log("By kind:");
const byKind = {};
for (const r of deduped) byKind[r.kind] = (byKind[r.kind] || 0) + 1;
for (const k of Object.keys(byKind).sort()) {
    console.log(`  ${k.padEnd(15)} ${byKind[k]}`);
}
console.log("");
console.log("Top 10 components by element count:");
for (const c of summary.components.slice(0, 10)) {
    console.log(`  ${c.component.padEnd(40)} ${String(c.elementCount).padStart(4)} elements  (${c.unique} unique / ${c.nonUnique} collisions)`);
}
console.log("");
console.log(`Output: ${outputJson}`);
