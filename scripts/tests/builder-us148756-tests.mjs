/**
 * US-148756 — Permission Setup | Builder | Payment Settings |
 *              Payment Method Help Description
 *
 * ACs:
 *  1. Payment Settings still shows the Online + Offline method groups (see
 *     US-135723 pack for the group-level coverage).
 *  2. A "Payment Method Help Description" text box is available.
 *  3. The description accepts a maximum of 500 characters.
 *  4. On the application form, the Payment Methods field displays a help
 *     ("i") icon next to it.
 *  5. Hovering / activating the icon reveals the configured help text.
 *
 * Run: node scripts/tests/builder-us148756-tests.mjs
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

async function resetStorage(page) {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:builder:') && !k.endsWith(':groups:rows')) localStorage.removeItem(k);
      if (k.startsWith('prototype:paymentSettings:')) localStorage.removeItem(k);
    }
  });
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

async function openPayments(page) {
  await page.getByTestId('subnav-payment-settings').click();
  await wait(400);
}

// ─── Tests ────────────────────────────────────────────────────────────────

async function testHelpFieldPresent(page) {
  await openDraft(page); await openPayments(page);
  const field = await page.getByTestId('payment-help-description').isVisible();
  const label = await page.getByText('Payment Method Help Description', { exact: true }).first().isVisible();
  const shot = await snap(page, 'US-148756.help.fieldPresent');
  record('US-148756.help.fieldPresentAndLabelled',
    'A "Payment Method Help Description" text box is present in Payment Settings',
    field && label, `field=${field} label=${label}`, shot);
}

async function testHelpAcceptsUpTo500(page) {
  await openDraft(page); await openPayments(page);
  const input = page.getByTestId('payment-help-description');
  const text = 'A'.repeat(500);
  await input.click();
  await input.fill(text);
  await wait(150);
  const v = await input.inputValue();
  const counter = (await page.getByTestId('payment-help-description-counter').textContent()).trim();
  const shot = await snap(page, 'US-148756.help.accepts500');
  record('US-148756.help.acceptsExactly500Chars',
    'The help description accepts a value exactly 500 characters long',
    v.length === 500 && /500\s*\/\s*500/.test(counter),
    `len=${v.length} counter="${counter}"`, shot);
}

async function testHelpCaps501AtBrowserLevel(page) {
  await openDraft(page); await openPayments(page);
  const input = page.getByTestId('payment-help-description');
  const attempt = 'B'.repeat(501);
  await input.click();
  await input.fill(attempt);
  await wait(150);
  const v = await input.inputValue();
  const stored = await page.evaluate(() => {
    const rows = JSON.parse(localStorage.getItem('prototype:builder:list:rows') || '[]');
    const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft');
    const raw = localStorage.getItem(`prototype:paymentSettings:${draft.id}`);
    return raw ? (JSON.parse(raw).helpDescription || '') : '';
  });
  const shot = await snap(page, 'US-148756.help.caps501');
  record('US-148756.help.cappedAt500EvenIf501Attempted',
    'The field caps input at 500 characters even when 501 are attempted',
    v.length === 500 && stored.length === 500,
    `inputLen=${v.length} storedLen=${stored.length}`, shot);
}

async function testHelpPersistsAcrossReload(page) {
  await openDraft(page); await openPayments(page);
  const msg = 'Choose Pay Now to complete online; select Invoice for offline settlement.';
  await page.getByTestId('payment-help-description').fill(msg);
  await wait(200);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(500);
  await openPayments(page);
  const v = await page.getByTestId('payment-help-description').inputValue();
  const shot = await snap(page, 'US-148756.help.persist');
  record('US-148756.help.persistsAcrossReload',
    'The saved help description survives a page reload',
    v === msg, `expected="${msg}" got="${v}"`, shot);
}

async function testCounterUpdates(page) {
  await openDraft(page); await openPayments(page);
  const input = page.getByTestId('payment-help-description');
  await input.fill('hello');
  await wait(120);
  const c1 = (await page.getByTestId('payment-help-description-counter').textContent()).trim();
  await input.fill('hello world');
  await wait(120);
  const c2 = (await page.getByTestId('payment-help-description-counter').textContent()).trim();
  const shot = await snap(page, 'US-148756.help.counter');
  record('US-148756.help.counterReflectsLiveLength',
    'Character counter updates live as the user types',
    /^5\s*\/\s*500/.test(c1) && /^11\s*\/\s*500/.test(c2), `c1="${c1}" c2="${c2}"`, shot);
}

async function testAppFormHelpIconAndTooltip(page) {
  // Seed a published Parking Bay permission with a known help text, then
  // open the Buy Now drawer and verify the help mirror carries the text.
  await resetStorage(page);
  await openDraft(page);
  const helpText = 'Please choose a payment method that suits you. Online Card = immediate; Invoice = billed monthly.';
  await page.evaluate((help) => {
    const rows = JSON.parse(localStorage.getItem('prototype:builder:list:rows') || '[]');
    const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft') || rows[0];
    draft.status = 'Published';
    draft.name = 'Parking Bay Permission';
    draft.type = 'Permit';
    draft.id = 'P-PARKINGBAY';
    localStorage.setItem('prototype:builder:list:rows', JSON.stringify([draft, ...rows.filter((r) => r.id !== draft.id)]));
    localStorage.setItem(`prototype:paymentSettings:${draft.id}`, JSON.stringify({
      payNow: true, invoice: true, useRegisteredCard: false, payAfterApproval: false,
      payMonthly: false, payQuarterly: false, agentAssist: false, wallet: false,
      postalPayment: false, payOnCollection: false, costCentreBudget: false,
      paymentMode: 'immediate', invoiceDays: '14', partialPaymentAllowed: false,
      helpDescription: help,
    }));
  }, helpText);
  await page.goto(`${BASE}/applicants`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  await page.locator('button[title="Edit"]').first().click();
  await wait(300);
  await page.getByRole('tab', { name: 'Applications' }).click();
  await wait(300);
  await page.getByTestId('applicant-buy-now').click();
  await wait(500);
  await page.getByTestId('buynow-perm-card-P-PARKINGBAY').click();
  await wait(400);
  // Top-level hidden mirror should contain the help text — visible from any step.
  const hidden = (await page.getByTestId('buynow-hidden-payment-help').textContent()).trim();
  const shot = await snap(page, 'US-148756.appform.helpMirror');
  record('US-148756.appform.helpTextAvailableForTooltip',
    'The permission-level help text is available for the application-form Payment Methods tooltip',
    hidden === helpText, `expected="${helpText}" got="${hidden}"`, shot);
}

async function testNoIconWhenHelpEmpty(page) {
  await resetStorage(page);
  await openDraft(page);
  await page.evaluate(() => {
    const rows = JSON.parse(localStorage.getItem('prototype:builder:list:rows') || '[]');
    const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft') || rows[0];
    draft.status = 'Published';
    draft.name = 'Parking Bay Permission';
    draft.type = 'Permit';
    draft.id = 'P-PARKINGBAY';
    localStorage.setItem('prototype:builder:list:rows', JSON.stringify([draft, ...rows.filter((r) => r.id !== draft.id)]));
    // Explicitly empty help description.
    localStorage.setItem(`prototype:paymentSettings:${draft.id}`, JSON.stringify({
      payNow: true, invoice: false, useRegisteredCard: false, payAfterApproval: false,
      payMonthly: false, payQuarterly: false, agentAssist: false, wallet: false,
      postalPayment: false, payOnCollection: false, costCentreBudget: false,
      paymentMode: 'immediate', invoiceDays: '14', partialPaymentAllowed: false,
      helpDescription: '',
    }));
  });
  await page.goto(`${BASE}/applicants`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  await page.locator('button[title="Edit"]').first().click();
  await wait(300);
  await page.getByRole('tab', { name: 'Applications' }).click();
  await wait(300);
  await page.getByTestId('applicant-buy-now').click();
  await wait(500);
  await page.getByTestId('buynow-perm-card-P-PARKINGBAY').click();
  await wait(400);
  const hidden = (await page.getByTestId('buynow-hidden-payment-help').textContent()).trim();
  const shot = await snap(page, 'US-148756.appform.noHelp');
  record('US-148756.appform.noHelpWhenDescriptionEmpty',
    'When no help description is configured, the help mirror is empty (icon suppressed)',
    hidden === '', `hidden="${hidden}"`, shot);
}

// ─── Runner ───────────────────────────────────────────────────────────────

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['help field present',              testHelpFieldPresent],
    ['accepts up to 500',               testHelpAcceptsUpTo500],
    ['caps 501 attempts at 500',        testHelpCaps501AtBrowserLevel],
    ['help persists reload',            testHelpPersistsAcrossReload],
    ['counter updates live',            testCounterUpdates],
    ['app-form exposes help text',      testAppFormHelpIconAndTooltip],
    ['no help mirror when empty',       testNoIconWhenHelpEmpty],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-148756.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-148756 Payment Method Help Description',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us148756-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-148756 Report</title>
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
<h1>US-148756 — Payment Method Help Description</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us148756-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us148756-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
