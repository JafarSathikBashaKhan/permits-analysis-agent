/**
 * US-165020 — Permission Setup | Builder | General Settings
 *              Configure admin fees for permission
 *
 * ACs:
 *  1. General Settings shows a field labelled "Admin Fee for Permission".
 *  2. Field accepts numeric values only.
 *  3. Accepts values between 0 and 1000.
 *  4. Allows up to 2 decimal places (currency).
 *  5. When the value is out of range or non-numeric, the exact error message
 *     "Amount must be between 0 and 1000." is shown.
 *  6. Currency symbol is sourced from MNPS contract settings; defaults to £.
 *  7. Contract-level default (from Apply > Contract Settings) is visible as
 *     the placeholder; a permission-level value overrides it for that permission.
 *  8. Committing a valid value writes an audit event with the fields
 *     Event Type = "Admin Fee for Permission Updated"
 *     Description = "Admin fee configuration updated in '<Permission Name>'"
 *     Category = "Configuration"
 *
 * Run: node scripts/tests/builder-us165020-tests.mjs
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

async function seedGroups(page) {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    const mk = (name, groupType) => ({
      id: `g-${name.replace(/\W+/g, '-').toLowerCase()}`, name, permissionType: 'Resident', groupType,
      householdLimit: 2, maxVouchers: 10, backOfficeUse: false, status: 'Active',
      linkedPermissions: 0, createdOn: '2025-01-01', createdByUser: 'test',
      updatedOn: '2025-01-01', updatedByUser: 'test',
    });
    localStorage.setItem('prototype:builder:groups:rows', JSON.stringify([
      mk('City Centre', 'Zonal'), mk('Business', 'Non-Zonal'),
    ]));
  });
}

async function resetStorage(page, opts = {}) {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(({ currency, adminFee }) => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:builder:') && !k.endsWith(':groups:rows')) localStorage.removeItem(k);
    }
    localStorage.removeItem('prototype:builder:audit:events');
    if (currency != null) localStorage.setItem('prototype:mnps-contract:currency', JSON.stringify(currency));
    else localStorage.removeItem('prototype:mnps-contract:currency');
    if (adminFee != null) localStorage.setItem('prototype:contract-settings:adminFee', JSON.stringify(adminFee));
    else localStorage.setItem('prototype:contract-settings:adminFee', JSON.stringify('3.50'));
  }, { currency: opts.currency ?? null, adminFee: opts.adminFee ?? null });
  await seedGroups(page);
}

async function openDraft(page) {
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  const rows = await page.evaluate(() => {
    const raw = localStorage.getItem('prototype:builder:list:rows');
    return raw ? JSON.parse(raw) : [];
  });
  const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft');
  if (!draft) throw new Error('no draft row');
  await page.getByTestId(`row-name-${draft.id}`).click();
  await wait(500);
  return draft;
}

async function openGS(page) {
  await page.getByTestId('subnav-general-settings').click();
  await wait(400);
  await page.getByText('Admin Fee for Permission', { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {});
  await wait(100);
}

async function setAdminFee(page, value) {
  const input = page.getByTestId('admin-fee-input');
  await input.click();
  await input.press('Control+A');
  await input.press('Delete');
  if (value !== '') await input.pressSequentially(value, { delay: 20 });
  return input;
}

// ---------- Tests ----------

async function testFieldLabelPresent(page) {
  await openDraft(page); await openGS(page);
  // FormRow renders the label Typography followed by a sibling "(optional)" span,
  // so use a partial text match rather than exact.
  const label = await page.getByText(/^Admin Fee for Permission/).first().isVisible();
  const input = await page.getByTestId('admin-fee-input').isVisible();
  const shot = await snap(page, 'US-165020.field.present');
  record('US-165020.field.exactLabelAndInputPresent',
    'A field labelled "Admin Fee for Permission" is present with an input',
    label && input, `label=${label} input=${input}`, shot);
}

async function testDefaultCurrencyPound(page) {
  await openDraft(page); await openGS(page);
  const sym = (await page.getByTestId('admin-fee-currency-symbol').textContent()).trim();
  record('US-165020.currency.defaultsToPound',
    'Currency symbol defaults to £ when no MNPS currency configured',
    sym === '£', `symbol="${sym}"`);
}

async function testCurrencyReflectsMnpsSetting(page) {
  await resetStorage(page, { currency: '€' });
  await openDraft(page); await openGS(page);
  const sym = (await page.getByTestId('admin-fee-currency-symbol').textContent()).trim();
  record('US-165020.currency.readsFromMnps',
    'Currency symbol reflects the MNPS contract-settings value',
    sym === '€', `symbol="${sym}"`);
}

async function testPlaceholderShowsContractDefault(page) {
  await resetStorage(page, { adminFee: '7.25' });
  await openDraft(page); await openGS(page);
  const placeholder = await page.getByTestId('admin-fee-input').getAttribute('placeholder');
  record('US-165020.default.placeholderShowsContractLevel',
    'Placeholder shows the contract-level default from Apply > Contract Settings',
    placeholder === 'Default: £7.25', `placeholder="${placeholder}"`);
}

async function testAcceptsValidNumericValue(page) {
  await openDraft(page); await openGS(page);
  await setAdminFee(page, '5.75');
  await page.getByTestId('admin-fee-input').blur();
  await wait(200);
  const hasErr = await page.getByTestId('admin-fee-error').isVisible().catch(() => false);
  const v = await page.getByTestId('admin-fee-input').inputValue();
  record('US-165020.value.accepts5point75',
    'Accepts a valid numeric value 5.75',
    !hasErr && v === '5.75', `value=${v} error=${hasErr}`);
}

async function testAcceptsBoundaries(page) {
  const cases = [['0', true], ['1000', true], ['0.00', true], ['1000.00', true], ['500.50', true]];
  const failures = [];
  for (const [val, ok] of cases) {
    await resetStorage(page);
    await openDraft(page); await openGS(page);
    await setAdminFee(page, val);
    await page.getByTestId('admin-fee-input').blur();
    await wait(150);
    const err = await page.getByTestId('admin-fee-error').isVisible().catch(() => false);
    if ((!err) !== ok) failures.push(`${val} err=${err}`);
  }
  record('US-165020.value.acceptsBoundaries',
    'Accepts boundary values 0, 0.00, 500.50, 1000, 1000.00',
    failures.length === 0, `failures=${JSON.stringify(failures)}`);
}

async function testRejectsOutOfRange(page) {
  const cases = ['-1', '1000.01', '1001', '9999'];
  const failures = [];
  for (const val of cases) {
    await resetStorage(page);
    await openDraft(page); await openGS(page);
    await setAdminFee(page, val);
    await page.getByTestId('admin-fee-input').blur();
    await wait(150);
    const errVisible = await page.getByTestId('admin-fee-error').isVisible().catch(() => false);
    const errText = errVisible ? (await page.getByTestId('admin-fee-error').textContent()).trim() : '';
    if (!errVisible || errText !== 'Amount must be between 0 and 1000.') {
      failures.push(`${val} visible=${errVisible} text="${errText}"`);
    }
  }
  const shot = await snap(page, 'US-165020.error.outOfRange');
  record('US-165020.value.rejectsOutOfRangeWithExactMessage',
    'Rejects values outside 0–1000 with the exact AC error text',
    failures.length === 0, `failures=${JSON.stringify(failures)}`, shot);
}

async function testRejectsMoreThanTwoDecimals(page) {
  await openDraft(page); await openGS(page);
  await setAdminFee(page, '5.123');
  await page.getByTestId('admin-fee-input').blur();
  await wait(200);
  const errVisible = await page.getByTestId('admin-fee-error').isVisible().catch(() => false);
  const errText = errVisible ? (await page.getByTestId('admin-fee-error').textContent()).trim() : '';
  record('US-165020.value.rejectsMoreThan2DecimalsWithExactMessage',
    'Rejects values with more than 2 decimal places, showing the exact AC message',
    errVisible && errText === 'Amount must be between 0 and 1000.',
    `visible=${errVisible} text="${errText}"`);
}

async function testBlankFallsBackToContractDefault(page) {
  await resetStorage(page, { adminFee: '4.20' });
  await openDraft(page); await openGS(page);
  await setAdminFee(page, ''); // clear
  await page.getByTestId('admin-fee-input').blur();
  await wait(200);
  const err = await page.getByTestId('admin-fee-error').isVisible().catch(() => false);
  const placeholder = await page.getByTestId('admin-fee-input').getAttribute('placeholder');
  record('US-165020.default.blankIsValidAndFallsBack',
    'Blank value is valid (permission uses contract-level default)',
    !err && placeholder === 'Default: £4.20', `error=${err} placeholder="${placeholder}"`);
}

async function testValueOverridesDefaultAndPersists(page) {
  await resetStorage(page, { adminFee: '3.50' });
  await openDraft(page); await openGS(page);
  await setAdminFee(page, '12.34');
  await page.getByTestId('admin-fee-input').blur();
  await wait(300);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openGS(page);
  const v = await page.getByTestId('admin-fee-input').inputValue();
  record('US-165020.value.overridesDefaultAndPersists',
    'A permission-level admin fee overrides the contract default and persists across reload',
    v === '12.34', `value=${v}`);
}

async function testAuditEventWrittenOnCommit(page) {
  await openDraft(page); await openGS(page);
  await setAdminFee(page, '9.99');
  await page.getByTestId('admin-fee-input').blur();
  await wait(400);
  const events = await page.evaluate(() => JSON.parse(localStorage.getItem('prototype:builder:audit:events') || '[]'));
  const evt = events[0];
  const okType = evt && evt.eventType === 'Admin Fee for Permission Updated';
  const okDesc = evt && /^Admin fee configuration updated in '.+'$/.test(evt.description);
  const okCat = evt && evt.category === 'Configuration';
  const okTs = evt && !Number.isNaN(new Date(evt.timestamp).getTime());
  record('US-165020.audit.eventOnCommit',
    'A "Admin Fee for Permission Updated" audit event is written on commit with description and Configuration category',
    okType && okDesc && okCat && okTs,
    `event=${JSON.stringify(evt)}`);
}

async function testErrorClearsWhenFixed(page) {
  await openDraft(page); await openGS(page);
  await setAdminFee(page, '5000');
  await page.getByTestId('admin-fee-input').blur();
  await wait(200);
  const errBefore = await page.getByTestId('admin-fee-error').isVisible().catch(() => false);
  await setAdminFee(page, '5.5');
  await page.getByTestId('admin-fee-input').blur();
  await wait(200);
  const errAfter = await page.getByTestId('admin-fee-error').isVisible().catch(() => false);
  record('US-165020.error.clearsWhenFixed',
    'Correcting an invalid value clears the error message',
    errBefore && !errAfter, `before=${errBefore} after=${errAfter}`);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['field label present',          testFieldLabelPresent],
    ['default currency £',           testDefaultCurrencyPound],
    ['currency from MNPS setting',   testCurrencyReflectsMnpsSetting],
    ['placeholder shows contract',   testPlaceholderShowsContractDefault],
    ['accepts 5.75',                 testAcceptsValidNumericValue],
    ['accepts boundaries',           testAcceptsBoundaries],
    ['rejects out of range',         testRejectsOutOfRange],
    ['rejects >2 decimals',          testRejectsMoreThanTwoDecimals],
    ['blank falls back to default',  testBlankFallsBackToContractDefault],
    ['override persists',            testValueOverridesDefaultAndPersists],
    ['audit event on commit',        testAuditEventWrittenOnCommit],
    ['error clears when fixed',      testErrorClearsWhenFixed],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-165020.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-165020 Admin Fee for Permission',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us165020-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-165020 Report</title>
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
<h1>US-165020 — Admin Fee for Permission</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us165020-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us165020-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
