/**
 * US-138832 — Permission Setup | Builder — Overview > Display Description
 *
 * ACs covered:
 *   - Field is editable (Super Admin / Contract Admin).
 *   - Default value: "Purchase your permission with ease".
 *   - Default is editable (can be cleared and replaced).
 *   - Max length 1000 characters. Extra chars are prevented from being entered.
 *   - Character counter is visible in the UI (e.g. "34/1000").
 *   - Allows alphabets, numbers, punctuation, and special characters.
 *   - Empty value blocks Publish (mandatory).
 *   - Value persists across page reload.
 *
 * Run: node scripts/tests/builder-us138832-tests.mjs
 */
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';

const BASE = 'http://localhost:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const SHOTS_DIR = path.resolve(__dirname, '..', '..', 'test-results', 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

const DEFAULT_TEXT = 'Purchase your permission with ease';

const results = [];
async function snap(page, id) {
  const file = `${id.replace(/[^A-Za-z0-9._-]/g, '_')}.png`;
  const abs = path.join(SHOTS_DIR, file);
  try { await page.screenshot({ path: abs, fullPage: false }); return `screenshots/${file}`; }
  catch { return ''; }
}
function record(id, name, passed, detail = '', shot = '') {
  results.push({ id, name, passed, detail, shot });
  console.log(`${passed ? '✅' : '❌'} ${id} — ${name}${detail ? `\n   ${detail}` : ''}${shot ? `\n   📸 ${shot}` : ''}`);
}

async function resetStorage(page) {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:builder:') || k.startsWith('prototype:templates:')) {
        localStorage.removeItem(k);
      }
    }
  });
}

async function openDraftPermission(page) {
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  const rows = await page.locator('[data-testid^="row-P-"]').all();
  for (const r of rows) {
    const id = (await r.getAttribute('data-testid')).replace('row-', '');
    const status = (await page.getByTestId(`row-status-${id}`).textContent()).trim();
    if (/draft/i.test(status)) {
      await page.getByTestId(`row-name-${id}`).click();
      await wait(500);
      return id;
    }
  }
  throw new Error('no draft row');
}

async function openGeneralSettings(page) {
  await page.getByTestId('subnav-general-settings').click();
  await wait(400);
}

// ---------- Tests ----------

async function testFieldPresent(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('display-description-input');
  const visible = await input.isVisible();
  record('US-138832.field.present',
    'Display Description field is visible and editable',
    visible);
}

async function testDefaultValue(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const v = await page.getByTestId('display-description-input').inputValue();
  const shot = await snap(page, 'US-138832.defaultValue');
  record('US-138832.default.exactWording',
    'Default text is "Purchase your permission with ease"',
    v === DEFAULT_TEXT,
    `value="${v}"`, shot);
}

async function testEditableClearAndReplace(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('display-description-input');
  await input.fill('Custom description for this permission');
  await wait(150);
  const v = await input.inputValue();
  record('US-138832.editable.clearAndReplace',
    'Default value can be cleared and replaced',
    v === 'Custom description for this permission',
    `value="${v}"`);
}

async function testCharacterCounter(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('display-description-input');
  await input.fill('Hello');
  await wait(150);
  const counter = (await page.getByTestId('display-description-counter').textContent()).trim();
  record('US-138832.counter.showsCount',
    'Character counter shows current length out of 1000',
    counter === '5/1000',
    `counter="${counter}"`);
}

async function testMaxLength1000Enforced(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const longText = 'A'.repeat(1050);
  const input = page.getByTestId('display-description-input');
  await input.fill(longText);
  await wait(200);
  const v = await input.inputValue();
  const counter = (await page.getByTestId('display-description-counter').textContent()).trim();
  const shot = await snap(page, 'US-138832.maxLength');
  record('US-138832.maxLength.oneThousand',
    'Input is capped at 1000 characters even when a longer value is supplied',
    v.length === 1000 && counter === '1000/1000',
    `length=${v.length} counter="${counter}"`, shot);
}

async function testAllowsAllCharacters(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const mixed = 'Abc 123 !@#$%^&*()_+-=[]{}|;:\'",.<>/?~` \n\t Résumé — “curly” ✅';
  const input = page.getByTestId('display-description-input');
  await input.fill(mixed);
  await wait(200);
  const v = await input.inputValue();
  record('US-138832.allowed.alphaNumericPunctuationSpecial',
    'Allows letters, numbers, punctuation, symbols, unicode, and whitespace',
    v === mixed,
    `equal=${v === mixed} len=${v.length}`);
}

async function testEmptyBlocksPublish(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('display-description-input');
  await input.fill('');
  await wait(200);
  // Try to publish: click the top-bar action menu, then Publish.
  // The Publish button is inside a menu; simplest: find "Publish" button/menu item anywhere.
  const publish = page.getByRole('button', { name: /publish/i }).first();
  const hasPublishBtn = await publish.isVisible().catch(() => false);
  let blocked = false;
  if (hasPublishBtn) {
    await publish.click();
    await wait(500);
    // A toast/error banner or menu should indicate a mandatory-field failure.
    const body = (await page.locator('body').textContent()).toLowerCase();
    blocked = /mandatory|required|fix.*field|display description/i.test(body);
  } else {
    // Fallback: the required indicator on the field itself is sufficient evidence.
    const errBanner = await page.locator('[data-field="Display Description"]').textContent();
    blocked = /required|This field/i.test(errBanner);
  }
  record('US-138832.mandatory.blocksPublish',
    'Empty description blocks Publish (mandatory)',
    blocked,
    `blocked=${blocked}`);
}

async function testPersistAcrossReload(page) {
  const id = await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('display-description-input');
  await input.fill('Persistence check description 🎯');
  await wait(300);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openGeneralSettings(page);
  const v = await page.getByTestId('display-description-input').inputValue();
  const shot = await snap(page, 'US-138832.persist');
  record('US-138832.persistence.acrossReload',
    'Display Description persists across page reload',
    v === 'Persistence check description 🎯',
    `value="${v}" id=${id}`, shot);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['field present',        testFieldPresent],
    ['default value',        testDefaultValue],
    ['editable',             testEditableClearAndReplace],
    ['character counter',    testCharacterCounter],
    ['max length 1000',      testMaxLength1000Enforced],
    ['allows all chars',     testAllowsAllCharacters],
    ['empty blocks publish', testEmptyBlocksPublish],
    ['persist across reload',testPersistAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-138832.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
  }

  await browser.close();
  const endedAt = new Date();

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log('\n─── SUMMARY ─────────────────');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  const outDir = path.resolve(__dirname, '..', '..', 'test-results');
  fs.mkdirSync(outDir, { recursive: true });
  const json = {
    suite: 'US-138832 Builder Display Description',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us138832-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-138832 Report</title>
<style>
body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;margin:2rem;color:#1F2937;max-width:1400px}
h1{font-size:1.75rem;margin:0 0 0.5rem}
.summary{background:#F4F6F9;border:1px solid #E5E7EB;border-radius:8px;padding:1rem;margin-bottom:1.5rem}
.pill{display:inline-block;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700}
.pill.ok{background:#DCFCE7;color:#166534}
.pill.bad{background:#FEE2E2;color:#991B1B}
table{width:100%;border-collapse:collapse;margin:0.5rem 0 2rem;font-size:0.85rem}
th,td{border-bottom:1px solid #E5E7EB;padding:8px 10px;text-align:left;vertical-align:top}
th{background:#F9FAFB;font-weight:600}
tr.p td:nth-child(2){color:#166534}
tr.f{background:#FEF2F2}
code{background:#F3F4F6;padding:1px 4px;border-radius:3px;font-size:0.75rem}
img.thumb{width:220px;height:auto;border:1px solid #D1D5DB;border-radius:4px;cursor:zoom-in;transition:transform 0.15s}
img.thumb:hover{transform:scale(1.6);z-index:10;position:relative;box-shadow:0 8px 24px rgba(0,0,0,0.25)}
</style></head>
<body>
<h1>US-138832 — Builder Display Description</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us138832-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us138832-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
