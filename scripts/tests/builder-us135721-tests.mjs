/**
 * US-135721 — Permission Setup | Builder — Overview > Prefix
 *
 * ACs covered:
 *   - Alphanumeric only (A-Z, 0-9). Non-alphanumeric stripped on input.
 *   - Max length: 10; no minimum.
 *   - Spaces are auto-trimmed (stripped).
 *   - Auto-uppercase.
 *   - Tooltip on hover shows the exact AC text.
 *   - Empty prefix -> inline error "This field is required".
 *   - Duplicate prefix across another permission TYPE -> error
 *     "This prefix is already in use for another permission type".
 *   - Editing an existing prefix to a conflicting one shows the same error.
 *   - Valid prefix persists across reload.
 *
 * Run: node scripts/tests/builder-us135721-tests.mjs
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

const EXPECTED_TOOLTIP =
  "Enter a unique alphanumeric prefix up to 10 characters. This prefix will appear at the start of the application number (e.g., 'RP' in RP-8XF93Z2K).";
const DUP_MSG = 'This prefix is already in use for another permission type';
const REQ_MSG = 'This field is required';

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
      if (k.startsWith('prototype:builder:')) localStorage.removeItem(k);
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

async function fillPrefix(page, v) {
  const input = page.getByTestId('prefix-input');
  await input.click();
  await input.press('Control+A');
  await input.press('Delete');
  if (v) await input.pressSequentially(v, { delay: 15 });
  await wait(200);
  return input;
}

// ---------- Tests ----------

async function testAlphanumericOnly(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = await fillPrefix(page, 'AB@#12$%CD');
  const v = await input.inputValue();
  record('US-135721.format.alphanumericOnly',
    'Non-alphanumeric characters (@#$%) are stripped',
    v === 'AB12CD' && !/[^A-Z0-9]/.test(v),
    `value="${v}"`);
}

async function testAutoUppercase(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = await fillPrefix(page, 'abcd12');
  const v = await input.inputValue();
  record('US-135721.format.autoUppercase',
    'Lowercase input is auto-uppercased',
    v === 'ABCD12',
    `value="${v}"`);
}

async function testMaxLength10(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = await fillPrefix(page, 'ABCDEFGHIJKLMNOP');
  const v = await input.inputValue();
  record('US-135721.format.maxLength10',
    'Prefix is capped at 10 characters',
    v.length === 10 && v === 'ABCDEFGHIJ',
    `value="${v}" length=${v.length}`);
}

async function testSpacesTrimmed(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = await fillPrefix(page, '   RP  1  ');
  const v = await input.inputValue();
  record('US-135721.format.spacesStripped',
    'Spaces are auto-trimmed (stripped) from input',
    !/ /.test(v) && v === 'RP1',
    `value="${v}"`);
}

async function testTooltipText(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const row = page.locator('[data-field="Prefix"]');
  const icon = row.locator('svg').first();
  await icon.hover();
  await wait(800);
  const tt = page.locator('.MuiTooltip-tooltip');
  const visible = await tt.isVisible().catch(() => false);
  const text = visible ? (await tt.textContent()).trim() : '';
  const shot = await snap(page, 'US-135721.tooltip');
  record('US-135721.tooltip.exactText',
    'Tooltip on the Prefix field shows the exact AC-mandated text',
    visible && text === EXPECTED_TOOLTIP,
    `visible=${visible} text="${text.slice(0, 100)}..."`,
    shot);
}

async function testRequiredError(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await fillPrefix(page, '');
  const row = page.locator('[data-field="Prefix"]');
  const errText = (await row.textContent()).trim();
  const shot = await snap(page, 'US-135721.requiredError');
  record('US-135721.mandatory.emptyShowsRequired',
    'Empty prefix shows the required-field error text',
    errText.includes(REQ_MSG),
    `row text includes required msg? ${errText.includes(REQ_MSG)} rowText="${errText.slice(0, 120)}..."`,
    shot);
}

async function testDuplicateCrossTypeError(page) {
  // Open P-1003 (Business, prefix BSN) and try 'CCR' (P-1001 = Resident) -> cross-type dup
  await page.goto(`${BASE}/builder/P-1003`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  await openGeneralSettings(page);
  await fillPrefix(page, 'CCR');
  const row = page.locator('[data-field="Prefix"]');
  const errText = (await row.textContent()).trim();
  const shot = await snap(page, 'US-135721.dupCrossType');
  record('US-135721.duplicate.crossTypeShowsError',
    `Cross-type duplicate shows "${DUP_MSG}"`,
    errText.includes(DUP_MSG),
    `rowText="${errText.slice(0, 200)}"`, shot);
}

async function testEditToConflictError(page) {
  // Start with valid 'ZZ99', then edit to conflicting 'CCR' -> error
  await page.goto(`${BASE}/builder/P-1003`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  await openGeneralSettings(page);
  await fillPrefix(page, 'ZZ99');
  await wait(200);
  await fillPrefix(page, 'CCR');
  const row = page.locator('[data-field="Prefix"]');
  const errText = (await row.textContent()).trim();
  record('US-135721.edit.conflictShowsError',
    'Editing an existing prefix to a conflicting value shows the same error',
    errText.includes(DUP_MSG),
    `rowText="${errText.slice(0, 200)}"`);
}

async function testUniquePrefixNoError(page) {
  await page.goto(`${BASE}/builder/P-1003`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  await openGeneralSettings(page);
  await fillPrefix(page, 'UNIQ99');
  const row = page.locator('[data-field="Prefix"]');
  const errText = (await row.textContent()).trim();
  record('US-135721.duplicate.uniquePasses',
    'A unique prefix produces no duplicate error',
    !errText.includes(DUP_MSG) && !errText.includes(REQ_MSG),
    `rowText="${errText.slice(0, 200)}"`);
}

async function testPersistAcrossReload(page) {
  const id = await openDraftPermission(page);
  await openGeneralSettings(page);
  await fillPrefix(page, 'PST8');
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openGeneralSettings(page);
  const v = await page.getByTestId('prefix-input').inputValue();
  const shot = await snap(page, 'US-135721.persist');
  record('US-135721.persistence.acrossReload',
    'Prefix persists across page reload',
    v === 'PST8', `value="${v}" id=${id}`, shot);
}

async function testSameTypeSamePrefixAllowed(page) {
  // Two Business rows: P-1003 (BSN) and P-1005 (CTW). Set P-1005 to 'BSN' (same type as P-1003) - AC allows.
  await page.goto(`${BASE}/builder/P-1005`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  await openGeneralSettings(page);
  await fillPrefix(page, 'BSN');
  const row = page.locator('[data-field="Prefix"]');
  const errText = (await row.textContent()).trim();
  record('US-135721.duplicate.sameTypeAllowed',
    'Same prefix within the SAME permission type is allowed (no cross-type dup error)',
    !errText.includes(DUP_MSG),
    `rowText="${errText.slice(0, 200)}"`);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['alphanumeric only',        testAlphanumericOnly],
    ['auto uppercase',           testAutoUppercase],
    ['max length 10',            testMaxLength10],
    ['spaces trimmed',           testSpacesTrimmed],
    ['tooltip exact text',       testTooltipText],
    ['required error empty',     testRequiredError],
    ['duplicate cross-type',     testDuplicateCrossTypeError],
    ['edit to conflict',         testEditToConflictError],
    ['unique passes',            testUniquePrefixNoError],
    ['same type same allowed',   testSameTypeSamePrefixAllowed],
    ['persist across reload',    testPersistAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-135721.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-135721 Builder Prefix',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us135721-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-135721 Report</title>
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
<h1>US-135721 — Builder Prefix</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us135721-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us135721-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
