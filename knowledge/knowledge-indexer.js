/**
 * Knowledge Indexer for ApplyIQ Permission System
 *
 * Scans MNPS-Permission-UI source code and extracts:
 *  - Pages and their components (with file paths)
 *  - Form fields (data-testid, id, placeholder, label, validation)
 *  - API endpoints (URL, method, used by which file)
 *  - Toast/error messages
 *  - Cascading dependencies (state -> effect -> action)
 *
 * Stores into session SQLite DB for fast querying.
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Users\\jafar.s\\Automation_Codes\\ApplyIQ\\Developers_Source_Code';
const UI = path.join(ROOT, 'MNPS-Permission-UI', 'src');
const API = path.join(ROOT, 'MNPS-Permission-RestAPI', 'Src');
const DB = path.join(__dirname, '..', 'session.db');

const db = new Database(DB);

// ───────── Schema ─────────
db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module TEXT,
    page_file TEXT,
    page_name TEXT
  );
  CREATE TABLE IF NOT EXISTS knowledge_fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_file TEXT,
    label TEXT,
    field_id TEXT,
    data_testid TEXT,
    placeholder TEXT,
    component TEXT,
    is_required INTEGER,
    max_length INTEGER,
    error_text TEXT
  );
  CREATE TABLE IF NOT EXISTS knowledge_apis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module TEXT,
    key TEXT,
    url TEXT,
    method TEXT
  );
  CREATE TABLE IF NOT EXISTS knowledge_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_file TEXT,
    kind TEXT,
    message TEXT
  );
  DELETE FROM knowledge_pages;
  DELETE FROM knowledge_fields;
  DELETE FROM knowledge_apis;
  DELETE FROM knowledge_messages;
`);

// ───────── Helpers ─────────
function walk(dir, exts, hits = []) {
  if (!fs.existsSync(dir)) return hits;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.next', '.git', 'bin', 'obj', 'dist'].includes(e.name)) continue;
      walk(full, exts, hits);
    } else if (exts.some(ext => e.name.endsWith(ext))) {
      hits.push(full);
    }
  }
  return hits;
}

function moduleOf(filePath) {
  // src/app/(pages)/<module>/...
  const m = filePath.match(/\\\(pages\)\\([^\\]+)/);
  return m ? m[1] : path.basename(path.dirname(filePath));
}

// ───────── Extract Fields from .tsx files ─────────
const tsxFiles = walk(UI, ['.tsx']);
console.log(`Scanning ${tsxFiles.length} TSX files...`);

const insField = db.prepare(`INSERT INTO knowledge_fields
  (page_file, label, field_id, data_testid, placeholder, component, is_required, max_length, error_text)
  VALUES (?,?,?,?,?,?,?,?,?)`);
const insMsg = db.prepare(`INSERT INTO knowledge_messages (page_file, kind, message) VALUES (?,?,?)`);
const insPage = db.prepare(`INSERT INTO knowledge_pages (module, page_file, page_name) VALUES (?,?,?)`);

// Track unique pages
const seenPages = new Set();

for (const file of tsxFiles) {
  let txt;
  try { txt = fs.readFileSync(file, 'utf8'); } catch { continue; }
  const rel = file.replace(UI + '\\', '');
  const mod = moduleOf(file);
  const pageName = path.basename(file, '.tsx');

  if (!seenPages.has(rel)) {
    insPage.run(mod, rel, pageName);
    seenPages.add(rel);
  }

  // Extract JSX components (DPSTextField, DPSAutoComplete, DPSButton, etc.)
  // Use brace-balanced parser to handle props like `error={x > 0}`
  const compStartRegex = /<(DPS[A-Z]\w+)\s/g;
  let cm;
  while ((cm = compStartRegex.exec(txt)) !== null) {
    const comp = cm[1];
    const start = cm.index + cm[0].length - 1;
    let i = start, depth = 0, inStr = false, strCh = '';
    let propsText = '';
    while (i < txt.length) {
      const ch = txt[i];
      if (inStr) {
        if (ch === strCh && txt[i-1] !== '\\') inStr = false;
        propsText += ch; i++; continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; propsText += ch; i++; continue; }
      if (ch === '{') { depth++; propsText += ch; i++; continue; }
      if (ch === '}') { depth--; propsText += ch; i++; continue; }
      if (depth === 0 && ch === '>') break;
      propsText += ch; i++;
    }

    // Extract props from propsText
    const getProp = (name) => {
      // String prop: name="value" or name='value'
      const rs = new RegExp(`\\b${name}=["']([^"']*)["']`);
      const ms = propsText.match(rs);
      if (ms) return ms[1];
      // Brace prop: name={...} — capture balanced
      const rb = new RegExp(`\\b${name}=\\{`);
      const mb = propsText.match(rb);
      if (mb) {
        let j = mb.index + mb[0].length, d = 1, val = '';
        while (j < propsText.length && d > 0) {
          if (propsText[j] === '{') d++;
          else if (propsText[j] === '}') { d--; if (d === 0) break; }
          val += propsText[j]; j++;
        }
        return val.trim();
      }
      return null;
    };

    const id = getProp('id');
    const testId = getProp('dataTestId') || getProp('data-testid');
    const placeholder = getProp('placeholder') || getProp('placeHolder');
    const maxLength = getProp('maxLength');
    const errorText = getProp('errorText');
    const required = /required\s*=\s*\{?true/.test(propsText);
    const fieldName = getProp('fieldName');
    const labelProp = getProp('label');

    if (id || testId || placeholder || fieldName || labelProp) {
      insField.run(
        rel,
        fieldName || labelProp || '',
        id || '',
        testId || '',
        placeholder || '',
        comp,
        required ? 1 : 0,
        maxLength && /^\d+$/.test(maxLength) ? parseInt(maxLength) : null,
        errorText || ''
      );
    }
  }

  // Extract literal labels: <label className='custom-label'>X</label>
  const labelRegex = /<label[^>]*>([^<]+)<\/label>/g;
  let lm;
  while ((lm = labelRegex.exec(txt)) !== null) {
    const label = lm[1].trim();
    if (label && label.length < 60) {
      insField.run(rel, label, '', '', '', 'label', 0, null, '');
    }
  }

  // Extract toast/flash messages
  const msgRegex = /(?:showFlashMessage|setError\w*)\(\s*['"`]([^'"`]+)['"`]/g;
  let mm;
  while ((mm = msgRegex.exec(txt)) !== null) {
    const msg = mm[1].trim();
    if (msg) insMsg.run(rel, 'flash', msg);
  }

  // Extract simple object literal messages (BuilderMessage = { CreateSuccess: '...' })
  const objMsgRegex = /(?:Success|Error|Alert|Message|Created|Updated|Deleted|Duplicate|NoGroups)\s*:\s*['"`]([^'"`]+)['"`]/g;
  let om;
  while ((om = objMsgRegex.exec(txt)) !== null) {
    insMsg.run(rel, 'constant', om[1].trim());
  }
}

// ───────── Extract API Endpoints ─────────
const apiFile = path.join(UI, 'models', 'services', 'apiEndPoint.tsx');
if (fs.existsSync(apiFile)) {
  const txt = fs.readFileSync(apiFile, 'utf8');
  const insApi = db.prepare(`INSERT INTO knowledge_apis (module, key, url, method) VALUES (?,?,?,?)`);

  // Match: keyName: { url: `...`, method: apiMethod?.X, ... }
  const apiRegex = /(\w+)\s*:\s*\{[^}]*?url\s*:\s*[`'"]([^`'"]+)[`'"][^}]*?method\s*:\s*apiMethod\?\.(\w+)/gs;
  let am;
  while ((am = apiRegex.exec(txt)) !== null) {
    const key = am[1];
    const url = am[2];
    const method = am[3];
    // Try to infer module from URL
    let mod = 'other';
    if (url.includes('Builder')) mod = 'permissionBuilder';
    else if (url.includes('Permission')) mod = 'permission';
    else if (url.includes('User')) mod = 'users';
    else if (url.includes('Street') || url.includes('Zone')) mod = 'area';
    else if (url.includes('Contract')) mod = 'contractSettings';
    insApi.run(mod, key, url, method.toUpperCase());
  }
}

// ───────── Summary ─────────
console.log('Pages:    ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_pages').get().c);
console.log('Fields:   ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_fields').get().c);
console.log('APIs:     ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_apis').get().c);
console.log('Messages: ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_messages').get().c);
console.log('\nModule breakdown (pages):');
for (const r of db.prepare('SELECT module, COUNT(*) AS c FROM knowledge_pages GROUP BY module ORDER BY c DESC LIMIT 20').all()) {
  console.log(`  ${r.module.padEnd(30)} ${r.c}`);
}

db.close();
console.log('\n✅ Knowledge indexed.');
