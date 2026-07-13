/**
 * US-25058 — Permission Setup | Builder | Discount Settings
 *
 * ACs:
 *  1. Sub-menu "Discount Settings" is present in the Permissions tab.
 *  2. Section shows two MANDATORY numeric fields:
 *       - Blue Badge Discount
 *       - Pension Discount
 *     Each has a Percentage / Currency radio next to it, and the screen
 *     is always editable.
 *  3. Percentage validation: value 0–100, one decimal digit allowed.
 *     Error: "Percentage must be between 0 and 100. "
 *  4. Currency validation: value 0–1000, up to two decimals.
 *     Error: "Amount must be between 0 and 1000. "
 *  5. Currency symbol reads from MNPS contract settings.
 *  6. Save-as-Draft has NO validation — invalid / empty values allowed.
 *
 * Run: node scripts/tests/builder-us25058-tests.mjs
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
  await page.evaluate(({ currency }) => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:builder:') && !k.endsWith(':groups:rows')) localStorage.removeItem(k);
      if (k.startsWith('prototype:discountSettings:')) localStorage.removeItem(k);
    }
    if (currency != null) localStorage.setItem('prototype:mnps-contract:currency', JSON.stringify(currency));
    else localStorage.removeItem('prototype:mnps-contract:currency');
  }, { currency: opts.currency ?? null });
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

async function openDiscounts(page) {
  await page.getByTestId('subnav-discount-settings').click();
  await wait(400);
}

async function setValue(page, which, val) {
  const input = page.getByTestId(`discount-${which}-input`);
  await input.scrollIntoViewIfNeeded();
  await input.click();
  await input.press('Control+A');
  await input.press('Delete');
  if (val !== '') await input.pressSequentially(val, { delay: 15 });
  await input.blur();
  await wait(120);
  return input;
}

async function setKind(page, which, kind) {
  const radio = page.getByTestId(`discount-${which}-kind-${kind}`);
  await radio.scrollIntoViewIfNeeded();
  await radio.click({ force: true });
  await wait(120);
}

// ─── Tests ────────────────────────────────────────────────────────────────

async function testSubnavPresent(page) {
  await openDraft(page);
  const visible = await page.getByTestId('subnav-discount-settings').isVisible();
  const shot = await snap(page, 'US-25058.subnav.present');
  record('US-25058.subnav.discountSettingsInMenu',
    'Discount Settings appears in the Permissions sub-navigation',
    visible, `visible=${visible}`, shot);
}

async function testBothFieldsAndRadiosPresent(page) {
  await openDraft(page); await openDiscounts(page);
  const bbInput = await page.getByTestId('discount-blueBadge-input').isVisible();
  const bbPct   = await page.getByTestId('discount-blueBadge-kind-percentage').isVisible();
  const bbCur   = await page.getByTestId('discount-blueBadge-kind-currency').isVisible();
  const pInput  = await page.getByTestId('discount-pension-input').isVisible();
  const pPct    = await page.getByTestId('discount-pension-kind-percentage').isVisible();
  const pCur    = await page.getByTestId('discount-pension-kind-currency').isVisible();
  const bbLabel = await page.getByText('Blue Badge Discount', { exact: false }).first().isVisible();
  const pLabel  = await page.getByText('Pension Discount', { exact: false }).first().isVisible();
  const shot = await snap(page, 'US-25058.fields.present');
  const ok = bbInput && bbPct && bbCur && pInput && pPct && pCur && bbLabel && pLabel;
  record('US-25058.fields.bothFieldsWithPercentageAndCurrencyRadios',
    'Blue Badge Discount and Pension Discount fields each have Percentage + Currency radios',
    ok, `bb=[in:${bbInput} %:${bbPct} $:${bbCur} lbl:${bbLabel}] pen=[in:${pInput} %:${pPct} $:${pCur} lbl:${pLabel}]`, shot);
}

async function testAlwaysEditable(page) {
  await openDraft(page); await openDiscounts(page);
  const bbDisabled = await page.getByTestId('discount-blueBadge-input').isDisabled();
  const pDisabled = await page.getByTestId('discount-pension-input').isDisabled();
  const shot = await snap(page, 'US-25058.editable');
  record('US-25058.state.alwaysEditable',
    'Both discount input fields are always editable (never disabled)',
    !bbDisabled && !pDisabled, `bbDisabled=${bbDisabled} pDisabled=${pDisabled}`, shot);
}

async function testPercentageAcceptsRange(page) {
  const cases = ['0', '0.5', '50', '99.9', '100', '100.0'];
  const failures = [];
  for (const v of cases) {
    await resetStorage(page); await openDraft(page); await openDiscounts(page);
    await setKind(page, 'blueBadge', 'percentage');
    await setValue(page, 'blueBadge', v);
    const err = await page.getByTestId('discount-blueBadge-error').isVisible().catch(() => false);
    if (err) failures.push(v);
  }
  const shot = await snap(page, 'US-25058.percentage.accepts');
  record('US-25058.percentage.acceptsInRangeWithOneDecimal',
    'Percentage accepts values 0–100 with one decimal',
    failures.length === 0, failures.length ? `rejected: ${failures.join(', ')}` : 'all accepted', shot);
}

async function testPercentageRejectsOutOfRangeAndTwoDecimals(page) {
  const cases = ['-1', '100.1', '101', '250', 'abc', '10.55'];
  const failures = [];
  for (const v of cases) {
    await resetStorage(page); await openDraft(page); await openDiscounts(page);
    await setKind(page, 'blueBadge', 'percentage');
    await setValue(page, 'blueBadge', v);
    const err = page.getByTestId('discount-blueBadge-error');
    const visible = await err.isVisible().catch(() => false);
    const txt = visible ? ((await err.textContent()) || '').trim() : '';
    if (!visible || !/Percentage must be between 0 and 100\./.test(txt)) failures.push(`${v} => "${txt}"`);
  }
  const shot = await snap(page, 'US-25058.percentage.rejects');
  record('US-25058.percentage.rejectsWithExactErrorText',
    'Percentage values outside 0–100 or with >1 decimal show the exact error text',
    failures.length === 0, failures.length ? failures.join(' | ') : 'all rejected with correct text', shot);
}

async function testCurrencyAcceptsRange(page) {
  const cases = ['0', '0.00', '999.99', '1000', '500.5'];
  const failures = [];
  for (const v of cases) {
    await resetStorage(page); await openDraft(page); await openDiscounts(page);
    await setKind(page, 'pension', 'currency');
    await setValue(page, 'pension', v);
    const err = await page.getByTestId('discount-pension-error').isVisible().catch(() => false);
    if (err) failures.push(v);
  }
  const shot = await snap(page, 'US-25058.currency.accepts');
  record('US-25058.currency.acceptsInRangeWithTwoDecimals',
    'Currency accepts values 0–1000 with up to two decimals',
    failures.length === 0, failures.length ? `rejected: ${failures.join(', ')}` : 'all accepted', shot);
}

async function testCurrencyRejectsOutOfRangeAndThreeDecimals(page) {
  const cases = ['-1', '1000.01', '1001', 'abc', '10.555'];
  const failures = [];
  for (const v of cases) {
    await resetStorage(page); await openDraft(page); await openDiscounts(page);
    await setKind(page, 'pension', 'currency');
    await setValue(page, 'pension', v);
    const err = page.getByTestId('discount-pension-error');
    const visible = await err.isVisible().catch(() => false);
    const txt = visible ? ((await err.textContent()) || '').trim() : '';
    if (!visible || !/Amount must be between 0 and 1000\./.test(txt)) failures.push(`${v} => "${txt}"`);
  }
  const shot = await snap(page, 'US-25058.currency.rejects');
  record('US-25058.currency.rejectsWithExactErrorText',
    'Currency values outside 0–1000 or with >2 decimals show the exact error text',
    failures.length === 0, failures.length ? failures.join(' | ') : 'all rejected with correct text', shot);
}

async function testCurrencySymbolFromMnps(page) {
  await resetStorage(page, { currency: '€' });
  await openDraft(page); await openDiscounts(page);
  await setKind(page, 'blueBadge', 'currency');
  const sym = (await page.getByTestId('discount-blueBadge-currency-symbol').textContent()).trim();
  const shot = await snap(page, 'US-25058.currency.symbolFromMnps');
  record('US-25058.currency.symbolReflectsMnps',
    'Currency symbol on the discount field reflects the MNPS contract setting',
    sym === '€', `symbol="${sym}"`, shot);
}

async function testCurrencySymbolDefaultsToPound(page) {
  await resetStorage(page);
  await openDraft(page); await openDiscounts(page);
  await setKind(page, 'blueBadge', 'currency');
  const sym = (await page.getByTestId('discount-blueBadge-currency-symbol').textContent()).trim();
  const shot = await snap(page, 'US-25058.currency.defaultPound');
  record('US-25058.currency.symbolDefaultsToPound',
    'Currency symbol defaults to £ when no MNPS currency configured',
    sym === '£', `symbol="${sym}"`, shot);
}

async function testDraftHasNoValidation(page) {
  await resetStorage(page); await openDraft(page); await openDiscounts(page);
  // Enter a clearly invalid percentage — but Save-as-Draft should still succeed
  // (no dialog / error interception). Only inline error is shown; no toast blocker.
  await setKind(page, 'blueBadge', 'percentage');
  await setValue(page, 'blueBadge', '999');
  const btn = page.getByRole('button', { name: /Save Draft|Save as Draft|^Save$/i }).first();
  const btnVisible = await btn.isVisible().catch(() => false);
  if (btnVisible) await btn.click();
  await wait(400);
  // Presence of a general "cannot save" error dialog would indicate broken behavior.
  const dialog = await page.getByText(/cannot save|fix the following/i).isVisible().catch(() => false);
  const shot = await snap(page, 'US-25058.draft.noValidation');
  record('US-25058.draft.savesWithoutDiscountValidation',
    'Save as Draft succeeds even when the discount value is out of range',
    !dialog, `blockingDialog=${dialog} saveBtnClicked=${btnVisible}`, shot);
}

async function testValuesPersistAcrossReload(page) {
  await resetStorage(page); await openDraft(page); await openDiscounts(page);
  await setKind(page, 'blueBadge', 'currency');
  await setValue(page, 'blueBadge', '25.50');
  await setKind(page, 'pension', 'percentage');
  await setValue(page, 'pension', '15.5');
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(500);
  await openDiscounts(page);
  const bb = await page.getByTestId('discount-blueBadge-input').inputValue();
  const bbKind = await page.getByTestId('discount-blueBadge-kind-currency').isChecked();
  const p = await page.getByTestId('discount-pension-input').inputValue();
  const pKind = await page.getByTestId('discount-pension-kind-percentage').isChecked();
  const shot = await snap(page, 'US-25058.persist');
  const ok = bb === '25.50' && bbKind === true && p === '15.5' && pKind === true;
  record('US-25058.state.persistsAcrossReload',
    'Values and radio selections persist across page reload',
    ok, `bb=${bb}(cur=${bbKind}) pen=${p}(pct=${pKind})`, shot);
}

// ─── Runner ───────────────────────────────────────────────────────────────

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['subnav present',                          testSubnavPresent],
    ['both fields + radios present',            testBothFieldsAndRadiosPresent],
    ['always editable',                         testAlwaysEditable],
    ['percentage accepts 0–100 + 1 decimal',    testPercentageAcceptsRange],
    ['percentage rejects out-of-range/2 dec',   testPercentageRejectsOutOfRangeAndTwoDecimals],
    ['currency accepts 0–1000 + 2 decimals',    testCurrencyAcceptsRange],
    ['currency rejects out-of-range/3 dec',     testCurrencyRejectsOutOfRangeAndThreeDecimals],
    ['currency symbol from MNPS setting',       testCurrencySymbolFromMnps],
    ['currency symbol defaults to £',           testCurrencySymbolDefaultsToPound],
    ['draft ignores validation',                testDraftHasNoValidation],
    ['values persist across reload',            testValuesPersistAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-25058.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-25058 Discount Settings',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us25058-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-25058 Report</title>
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
<h1>US-25058 — Discount Settings</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us25058-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us25058-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
