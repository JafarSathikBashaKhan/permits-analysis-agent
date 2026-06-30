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
const DB = path.join(__dirname, '..', 'session.db');

// All UI repos to scan
const UI_REPOS = [
  { name: 'MNPS-Permission-UI', src: path.join(ROOT, 'MNPS-Permission-UI', 'src'), portal: 'backoffice' },
  { name: 'CustomerPortal-UI',  src: path.join(ROOT, 'CustomerPortal-UI', 'src'),  portal: 'customer'   },
];

// All API repos to scan (.cs controllers + request/response DTOs)
const API_REPOS = [
  { name: 'MNPS-Permission-RestAPI',     src: path.join(ROOT, 'MNPS-Permission-RestAPI',     'Src') },
  { name: 'ApplyPurchaseService-RestAPI', src: path.join(ROOT, 'ApplyPurchaseService-RestAPI', 'Src') },
  { name: 'CustomerPortal-RestAPI',      src: path.join(ROOT, 'CustomerPortal-RestAPI',      'Src') },
  { name: 'AuditLog-RestAPI',            src: path.join(ROOT, 'AuditLog-RestAPI',            'Src') },
  { name: 'Func-AutoGuru-LiveLookup',    src: path.join(ROOT, 'Func-AutoGuru-LiveLookup'         ) },
  { name: 'Func-PermitAuditLog',         src: path.join(ROOT, 'Func-PermitAuditLog'              ) },
  { name: 'Func-PermitSchedule',         src: path.join(ROOT, 'Func-PermitSchedule'              ) },
];

const db = new Database(DB);

// ───────── Schema ─────────
db.exec(`
  DROP TABLE IF EXISTS knowledge_pages;
  DROP TABLE IF EXISTS knowledge_fields;
  DROP TABLE IF EXISTS knowledge_apis;
  DROP TABLE IF EXISTS knowledge_messages;
  DROP TABLE IF EXISTS knowledge_dtos;

  CREATE TABLE knowledge_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portal TEXT,
    repo TEXT,
    module TEXT,
    page_file TEXT,
    page_name TEXT
  );
  CREATE TABLE knowledge_fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portal TEXT,
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
  CREATE TABLE knowledge_apis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo TEXT,
    module TEXT,
    key TEXT,
    url TEXT,
    method TEXT,
    source_file TEXT
  );
  CREATE TABLE knowledge_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portal TEXT,
    page_file TEXT,
    kind TEXT,
    message TEXT
  );
  CREATE TABLE knowledge_dtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo TEXT,
    file TEXT,
    class_name TEXT,
    field_name TEXT,
    field_type TEXT,
    is_nullable INTEGER
  );
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

// ───────── Insert preps ─────────
const insField = db.prepare(`INSERT INTO knowledge_fields
  (portal, page_file, label, field_id, data_testid, placeholder, component, is_required, max_length, error_text)
  VALUES (?,?,?,?,?,?,?,?,?,?)`);
const insMsg  = db.prepare(`INSERT INTO knowledge_messages (portal, page_file, kind, message) VALUES (?,?,?,?)`);
const insPage = db.prepare(`INSERT INTO knowledge_pages (portal, repo, module, page_file, page_name) VALUES (?,?,?,?,?)`);
const insApi  = db.prepare(`INSERT INTO knowledge_apis (repo, module, key, url, method, source_file) VALUES (?,?,?,?,?,?)`);
const insDto  = db.prepare(`INSERT INTO knowledge_dtos (repo, file, class_name, field_name, field_type, is_nullable) VALUES (?,?,?,?,?,?)`);

// ───────── TSX scanner (UI repos) ─────────
function scanTsxFile(file, srcRoot, portal, repoName) {
  let txt;
  try { txt = fs.readFileSync(file, 'utf8'); } catch { return; }
  const rel = file.replace(srcRoot + path.sep, '');
  const mod = moduleOf(file);
  const pageName = path.basename(file, '.tsx');

  insPage.run(portal, repoName, mod, rel, pageName);

  // JSX components (brace-balanced parser)
  const compStartRegex = /<(DPS[A-Z]\w+|Mui[A-Z]\w+)\s/g;
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

    const getProp = (name) => {
      const rs = new RegExp(`\\b${name}=["']([^"']*)["']`);
      const ms = propsText.match(rs);
      if (ms) return ms[1];
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
        portal, rel,
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

  // <label>...</label>
  const labelRegex = /<label[^>]*>([^<]+)<\/label>/g;
  let lm;
  while ((lm = labelRegex.exec(txt)) !== null) {
    const lbl = lm[1].trim();
    if (lbl && lbl.length < 60) insField.run(portal, rel, lbl, '', '', '', 'label', 0, null, '');
  }

  // showFlashMessage / setError
  const msgRegex = /(?:showFlashMessage|setError\w*)\(\s*['"`]([^'"`]+)['"`]/g;
  let mm;
  while ((mm = msgRegex.exec(txt)) !== null) {
    const msg = mm[1].trim();
    if (msg) insMsg.run(portal, rel, 'flash', msg);
  }

  // Object literal message constants
  const objMsgRegex = /(?:Success|Error|Alert|Message|Created|Updated|Deleted|Duplicate|NoGroups|Failed|Confirm)\s*:\s*['"`]([^'"`]+)['"`]/g;
  let om;
  while ((om = objMsgRegex.exec(txt)) !== null) {
    insMsg.run(portal, rel, 'constant', om[1].trim());
  }
}

// ───────── apiEndPoint.tsx scanner ─────────
function scanApiEndpointsFile(file, repoName) {
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, 'utf8');
  const apiRegex = /(\w+)\s*:\s*\{[^}]*?url\s*:\s*[`'"]([^`'"]+)[`'"][^}]*?method\s*:\s*apiMethod\?\.(\w+)/gs;
  let am;
  while ((am = apiRegex.exec(txt)) !== null) {
    const key = am[1], url = am[2], method = am[3];
    let mod = 'other';
    if (/Builder/i.test(url)) mod = 'permissionBuilder';
    else if (/PermissionType|Permission\//i.test(url)) mod = 'permission';
    else if (/User|Role/i.test(url)) mod = 'users';
    else if (/Street|Zone|Property|Location|Area/i.test(url)) mod = 'area';
    else if (/Contract/i.test(url)) mod = 'contractSettings';
    else if (/Vehicle/i.test(url)) mod = 'vehicle';
    else if (/Application|Permit/i.test(url)) mod = 'applications';
    else if (/Template|Email|SMS/i.test(url)) mod = 'templates';
    else if (/Audit/i.test(url)) mod = 'audit';
    insApi.run(repoName, mod, key, url, method.toUpperCase(), file.split(path.sep).slice(-3).join('/'));
  }
}

// ───────── .cs scanner (API repos) ─────────
function scanCsFile(file, srcRoot, repoName) {
  let txt;
  try { txt = fs.readFileSync(file, 'utf8'); } catch { return; }
  const rel = file.replace(srcRoot + path.sep, '');
  const fname = path.basename(file);

  // Controller routes: [HttpGet("...")] [HttpPost("...")] etc., usually under [Route("...")]
  const routePrefixMatch = txt.match(/\[Route\(\s*"([^"]+)"\s*\)\]/);
  const routePrefix = routePrefixMatch ? routePrefixMatch[1].replace(/\[controller\]/i, fname.replace(/Controller\.cs$/, '')) : '';

  const httpRegex = /\[Http(Get|Post|Put|Delete|Patch)(?:\(\s*"([^"]*)"\s*\))?\]\s*(?:\[[^\]]+\]\s*)*public\s+(?:async\s+)?[\w<>?,\s]+\s+(\w+)\s*\(/g;
  let hm;
  while ((hm = httpRegex.exec(txt)) !== null) {
    const method = hm[1].toUpperCase();
    const route = hm[2] || '';
    const action = hm[3];
    const fullUrl = (routePrefix + '/' + route).replace(/\/+/g, '/').replace(/\/$/, '');
    let mod = 'other';
    if (/Builder/i.test(fullUrl)) mod = 'permissionBuilder';
    else if (/Permission/i.test(fullUrl)) mod = 'permission';
    else if (/User|Role/i.test(fullUrl)) mod = 'users';
    else if (/Street|Zone|Property|Location/i.test(fullUrl)) mod = 'area';
    else if (/Contract/i.test(fullUrl)) mod = 'contractSettings';
    else if (/Vehicle/i.test(fullUrl)) mod = 'vehicle';
    else if (/Application|Permit/i.test(fullUrl)) mod = 'applications';
    else if (/Audit/i.test(fullUrl)) mod = 'audit';
    insApi.run(repoName, mod, action, fullUrl, method, rel);
  }

  // DTOs / Request/Response classes: extract public properties
  if (/Request|Response|Dto|Entity|Model/i.test(fname)) {
    const classMatch = txt.match(/public\s+(?:partial\s+)?class\s+(\w+)/);
    if (classMatch) {
      const className = classMatch[1];
      const propRegex = /public\s+([\w<>?,\s]+?)\s+(\w+)\s*\{\s*get\s*;\s*(?:set\s*;\s*)?\}/g;
      let pm;
      while ((pm = propRegex.exec(txt)) !== null) {
        let type = pm[1].trim();
        const name = pm[2];
        const nullable = type.includes('?') ? 1 : 0;
        type = type.replace(/\s+/g, ' ');
        insDto.run(repoName, rel, className, name, type, nullable);
      }
    }
  }
}

// ───────── Run scanners ─────────
let totalTsx = 0, totalCs = 0;
for (const repo of UI_REPOS) {
  const files = walk(repo.src, ['.tsx']);
  console.log(`UI ${repo.name}: ${files.length} tsx files`);
  totalTsx += files.length;
  for (const f of files) scanTsxFile(f, repo.src, repo.portal, repo.name);

  // Also scan apiEndPoint files
  const apiEndpointFiles = walk(repo.src, ['apiEndPoint.tsx', 'apiEndPoints.tsx', 'apiendpoint.tsx']);
  for (const f of apiEndpointFiles) scanApiEndpointsFile(f, repo.name);
}

for (const repo of API_REPOS) {
  const files = walk(repo.src, ['.cs']);
  console.log(`API ${repo.name}: ${files.length} cs files`);
  totalCs += files.length;
  for (const f of files) scanCsFile(f, repo.src, repo.name);
}

// ───────── Summary ─────────
console.log('\n══════ INDEX SUMMARY ══════');
console.log('Files scanned: ', totalTsx, 'tsx,', totalCs, 'cs');
console.log('Pages:    ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_pages').get().c);
console.log('Fields:   ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_fields').get().c);
console.log('  with testid:', db.prepare("SELECT COUNT(*) AS c FROM knowledge_fields WHERE data_testid != ''").get().c);
console.log('APIs:     ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_apis').get().c);
console.log('DTOs:     ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_dtos').get().c);
console.log('Messages: ', db.prepare('SELECT COUNT(*) AS c FROM knowledge_messages').get().c);

console.log('\nPages by portal/repo:');
for (const r of db.prepare('SELECT portal, repo, COUNT(*) AS c FROM knowledge_pages GROUP BY portal, repo').all()) {
  console.log(`  ${r.portal} / ${r.repo}: ${r.c}`);
}

console.log('\nAPIs by repo:');
for (const r of db.prepare('SELECT repo, COUNT(*) AS c FROM knowledge_apis GROUP BY repo ORDER BY c DESC').all()) {
  console.log(`  ${r.repo.padEnd(36)} ${r.c}`);
}

console.log('\nTop 20 modules (by page count):');
for (const r of db.prepare('SELECT module, COUNT(*) AS c FROM knowledge_pages GROUP BY module ORDER BY c DESC LIMIT 20').all()) {
  console.log(`  ${r.module.padEnd(30)} ${r.c}`);
}

db.close();
console.log('\n✅ Knowledge indexed.');
