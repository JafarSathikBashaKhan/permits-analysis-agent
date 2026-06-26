#!/usr/bin/env node
/*
 * SQLite importer for the UI inventory.
 *
 * Reads every inventory-<Module>.json in the same folder and writes/refreshes
 * `ui-inventory.sqlite` with two tables:
 *
 *   ui_modules(module PK, files, components, elements)
 *   ui_elements(rowid, module, component, file, line, kind, value, weight,
 *               is_unique, global_count)
 *
 * Lets us query the inventory like:
 *
 *   sqlite3 ui-inventory.sqlite
 *   > SELECT * FROM ui_elements WHERE module='builder'
 *       AND kind='data-testid' AND is_unique=1;
 *   > SELECT value, COUNT(*) FROM ui_elements
 *       WHERE kind='id' GROUP BY value HAVING COUNT(*) > 1;
 *
 * Usage:
 *   node load-to-sqlite.js
 *
 * Requires:  npm install better-sqlite3
 */
const fs = require("fs");
const path = require("path");

let Database;
try {
    Database = require("better-sqlite3");
} catch (e) {
    console.error("Missing dependency. Run:  npm install better-sqlite3");
    process.exit(2);
}

const dir = __dirname;
const dbPath = path.join(dir, "ui-inventory.sqlite");
const indexPath = path.join(dir, "inventory-INDEX.json");

if (!fs.existsSync(indexPath)) {
    console.error(`Inventory not found: ${indexPath}`);
    console.error(`Run  node ui-inventory-all.js  first.`);
    process.exit(2);
}

// Fresh DB each run — small enough, simpler than schema migration
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
const db = new Database(dbPath);

db.exec(`
CREATE TABLE ui_modules (
  module TEXT PRIMARY KEY,
  files INTEGER NOT NULL,
  components INTEGER NOT NULL,
  elements INTEGER NOT NULL
);
CREATE TABLE ui_elements (
  module TEXT NOT NULL,
  component TEXT NOT NULL,
  file TEXT NOT NULL,
  line INTEGER NOT NULL,
  kind TEXT NOT NULL,
  value TEXT NOT NULL,
  weight INTEGER NOT NULL,
  is_unique INTEGER NOT NULL,
  global_count INTEGER NOT NULL
);
CREATE INDEX idx_elements_module ON ui_elements(module);
CREATE INDEX idx_elements_component ON ui_elements(component);
CREATE INDEX idx_elements_kind ON ui_elements(kind);
CREATE INDEX idx_elements_value ON ui_elements(value);
`);

const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const insertMod = db.prepare(
    "INSERT INTO ui_modules (module, files, components, elements) VALUES (?, ?, ?, ?)"
);
const insertEl = db.prepare(
    "INSERT INTO ui_elements (module, component, file, line, kind, value, weight, is_unique, global_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

const txn = db.transaction(() => {
    for (const m of index.modules) {
        insertMod.run(m.module, m.files, m.components, m.elements);
    }

    let totalRows = 0;
    for (const f of fs.readdirSync(dir)) {
        if (!f.startsWith("inventory-") || !f.endsWith(".json")) continue;
        if (f === "inventory-INDEX.json") continue;
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
        const mod = f.replace(/^inventory-/, "").replace(/\.json$/, "");
        for (const e of data.elements) {
            insertEl.run(
                mod, e.component, e.file, e.line, e.kind, e.value,
                e.weight, e.isUnique ? 1 : 0, e.globalCount
            );
            totalRows++;
        }
    }
    return totalRows;
});

const inserted = txn();

const moduleCount = db.prepare("SELECT COUNT(*) AS c FROM ui_modules").get().c;
const elementCount = db.prepare("SELECT COUNT(*) AS c FROM ui_elements").get().c;
const uniqueTestids = db.prepare(
    "SELECT COUNT(*) AS c FROM ui_elements WHERE kind='data-testid' AND is_unique=1"
).get().c;
const collisions = db.prepare(
    "SELECT COUNT(DISTINCT value) AS c FROM ui_elements WHERE is_unique=0 AND kind IN ('data-testid','id','name')"
).get().c;

console.log("");
console.log("UI Inventory SQLite Loader");
console.log("==========================");
console.log(`DB              : ${dbPath}`);
console.log(`Modules         : ${moduleCount}`);
console.log(`Elements        : ${elementCount}`);
console.log(`Unique testids  : ${uniqueTestids}`);
console.log(`Colliding values: ${collisions}`);
console.log("");
console.log("Example queries:");
console.log("  sqlite3 ui-inventory.sqlite");
console.log("  > SELECT * FROM ui_elements WHERE module='builder' AND component='BasicInformation';");
console.log("  > SELECT value, COUNT(*) FROM ui_elements WHERE kind='id' GROUP BY value HAVING COUNT(*)>1;");
