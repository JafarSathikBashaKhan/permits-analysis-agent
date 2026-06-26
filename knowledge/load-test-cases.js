const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'session.db');
const db = new Database(dbPath);

function parseCSV(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i+1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQ = false; i++; continue; }
      field += c; i++;
    } else {
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ',') { row.push(field); field = ''; i++; continue; }
      if (c === '\r') { i++; continue; }
      if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      field += c; i++;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function loadCSV(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCSV(text).filter(r => r.length > 1);
  const header = rows.shift();
  return rows.map(r => Object.fromEntries(header.map((h, i) => [h, r[i] || ''])));
}

db.prepare('DELETE FROM pb_test_cases').run();
db.prepare('DELETE FROM pb_test_steps').run();

const cases = loadCSV(path.join(__dirname, 'pb_test_cases.csv'));
const steps = loadCSV(path.join(__dirname, 'pb_test_steps.csv'));

const insCase = db.prepare('INSERT OR REPLACE INTO pb_test_cases VALUES (?,?,?,?,?)');
const insStep = db.prepare('INSERT INTO pb_test_steps VALUES (?,?,?,?)');

const tx = db.transaction(() => {
  for (const c of cases) insCase.run(c.id, c.file, c.feature, c.title, parseInt(c.steps) || 0);
  for (const s of steps) insStep.run(s.case_id, parseInt(s.step_no) || 0, s.action, s.expected);
});
tx();

console.log('cases:', db.prepare('SELECT COUNT(*) FROM pb_test_cases').get());
console.log('steps:', db.prepare('SELECT COUNT(*) FROM pb_test_steps').get());
db.close();
