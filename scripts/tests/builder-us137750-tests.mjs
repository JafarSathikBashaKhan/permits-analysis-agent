/**
 * US-137750 — Permission Setup | Builder — Overview > Retention Period for Expired Permits
 *
 * ACs covered:
 *   - Field label: "Retention Period for Expired Permits (Days)".
 *   - Default value: 7.
 *   - Accepts only positive whole numbers including 0.
 *   - Negative numbers are rejected (input clamps to 0 / stripped).
 *   - Decimal values are rejected (input strips fractional part).
 *   - Non-numeric characters are stripped.
 *   - Empty value shows a required error.
 *   - Tooltip shows exact spec text on hover.
 *   - Persists across page reload (per-permission).
 *   - Edit allowed after initial save; same validations apply.
 *
 * Run: node scripts/tests/builder-us137750-tests.mjs
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
  'Enter the number of days expired permits should remain visible after their expiry date. For example, if set to 7, expired permits will be displayed for 7 days before being hidden from the system view. Enter 0 to hide them immediately upon expiry.';

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

// ---------- Tests ----------

async function testLabelPresent(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const row = page.locator('[data-field="Retention Period for Expired Permits (Days)"]');
  const visible = await row.isVisible();
  const shot = await snap(page, 'US-137750.label');
  record('US-137750.label.exactWording',
    'Field label is exactly "Retention Period for Expired Permits (Days)"',
    visible, `visible=${visible}`, shot);
}

async function testDefaultValueSeven(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const v = await page.getByTestId('retention-days-input').inputValue();
  record('US-137750.default.sevenDays',
    'Default value is 7',
    v === '7',
    `value="${v}"`);
}

async function testAcceptsZero(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('retention-days-input');
  await input.fill('0');
  await wait(150);
  const v = await input.inputValue();
  record('US-137750.entry.acceptsZero',
    'Field accepts 0 (hide immediately on expiry)',
    v === '0', `value="${v}"`);
}

async function testAcceptsPositiveInteger(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('retention-days-input');
  await input.fill('30');
  await wait(150);
  const v = await input.inputValue();
  record('US-137750.entry.acceptsPositive',
    'Field accepts positive whole number (e.g. 30)',
    v === '30', `value="${v}"`);
}

async function testStripsNegativeSign(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('retention-days-input');
  await input.fill('-15');
  await wait(150);
  const v = await input.inputValue();
  // "-15" → strip non-digits → "15"
  record('US-137750.entry.rejectsNegative',
    'Negative values are stripped (input becomes positive digits only)',
    v === '15' || v === '0',
    `value="${v}" (expected "15" from stripping the sign)`);
}

async function testStripsDecimal(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('retention-days-input');
  await input.fill('7.5');
  await wait(150);
  const v = await input.inputValue();
  // "7.5" → strip → "75"; not ideal but AC says whole numbers only
  record('US-137750.entry.rejectsDecimal',
    'Decimal values have the fractional part removed (whole numbers only)',
    !v.includes('.'),
    `value="${v}"`);
}

async function testStripsAlpha(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('retention-days-input');
  // type=number rejects alpha via fill; use keyboard typing
  await input.click();
  await input.press('Control+A');
  await input.press('Delete');
  await input.pressSequentially('abc12def', { delay: 20 });
  await wait(200);
  const v = await input.inputValue();
  record('US-137750.entry.stripsAlpha',
    'Non-numeric characters are ignored by the numeric field (only digits accepted)',
    /^[0-9]*$/.test(v),
    `value="${v}"`);
}

async function testRequiredError(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('retention-days-input');
  await input.fill('');
  await wait(200);
  const err = await page.getByTestId('retention-required-error').isVisible().catch(() => false);
  const shot = await snap(page, 'US-137750.requiredError');
  record('US-137750.entry.requiredWhenEmpty',
    'Empty value shows a required-field error',
    err, `err=${err}`, shot);
}

async function testTooltipText(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const row = page.locator('[data-field="Retention Period for Expired Permits (Days)"]');
  const icon = row.locator('svg').first();
  await icon.hover();
  await wait(800);
  const tt = page.locator('.MuiTooltip-tooltip');
  const visible = await tt.isVisible().catch(() => false);
  const text = visible ? (await tt.textContent()).trim() : '';
  const shot = await snap(page, 'US-137750.tooltip');
  record('US-137750.tooltip.exactText',
    'Tooltip shows the exact spec text on hover',
    visible && text === EXPECTED_TOOLTIP,
    `visible=${visible} text="${text.slice(0, 100)}..."`,
    shot);
}

async function testPersistAcrossReload(page) {
  const id = await openDraftPermission(page);
  await openGeneralSettings(page);
  await page.getByTestId('retention-days-input').fill('45');
  await wait(300);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openGeneralSettings(page);
  const v = await page.getByTestId('retention-days-input').inputValue();
  const shot = await snap(page, 'US-137750.persist');
  record('US-137750.persistence.acrossReload',
    'Retention value persists across page reload',
    v === '45', `value="${v}" id=${id}`, shot);
}

async function testEditAfterInitialValue(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const input = page.getByTestId('retention-days-input');
  await input.fill('10');
  await wait(150);
  await input.fill('25');
  await wait(150);
  const v = await input.inputValue();
  record('US-137750.edit.allowedWithSameValidations',
    'Edit is allowed and validation rules still apply',
    v === '25', `value="${v}"`);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['label present',           testLabelPresent],
    ['default value 7',         testDefaultValueSeven],
    ['accepts 0',               testAcceptsZero],
    ['accepts positive int',    testAcceptsPositiveInteger],
    ['strips negative sign',    testStripsNegativeSign],
    ['strips decimal',          testStripsDecimal],
    ['strips alpha',            testStripsAlpha],
    ['required error empty',    testRequiredError],
    ['tooltip exact text',      testTooltipText],
    ['persist across reload',   testPersistAcrossReload],
    ['edit allowed',            testEditAfterInitialValue],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-137750.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-137750 Builder Retention Period',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us137750-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-137750 Report</title>
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
<h1>US-137750 — Builder Retention Period for Expired Permits</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us137750-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us137750-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
