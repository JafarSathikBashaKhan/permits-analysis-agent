/**
 * US-135723 — Permission Setup | Builder | Payment Settings
 *
 * ACs:
 *  1. Payment Settings section shows a list of pre-defined methods with
 *     checkboxes, grouped into Online and Offline.
 *     Online: Use Registered Card, Pay Now, Pay After Approval, Pay Monthly,
 *             Pay Quarterly, Agent Assist, Wallet.
 *     Offline: Postal Payment, Pay on Collection, Invoice,
 *              Cost Centre / Budget Code.
 *  2. Boxes can be checked and unchecked.
 *  3. Saving as Draft has no restriction — zero selections allowed.
 *  4. Publish requires at least one payment method selected.
 *  5. A tag line / info text is shown under each method (from Figma).
 *  6. Attempting to publish with zero selections surfaces the exact error
 *     "At least one payment method is required to publish this permission".
 *
 * Run: node scripts/tests/builder-us135723-tests.mjs
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

const ONLINE = [
  { key: 'useRegisteredCard', label: 'Use Registered Card' },
  { key: 'payNow',            label: 'Pay Now' },
  { key: 'payAfterApproval',  label: 'Pay After Approval' },
  { key: 'payMonthly',        label: 'Pay Monthly' },
  { key: 'payQuarterly',      label: 'Pay Quarterly' },
  { key: 'agentAssist',       label: 'Agent Assist' },
  { key: 'wallet',            label: 'Wallet' },
];
const OFFLINE = [
  { key: 'postalPayment',    label: 'Postal Payment' },
  { key: 'payOnCollection',  label: 'Pay on Collection' },
  { key: 'invoice',          label: 'Invoice' },
  { key: 'costCentreBudget', label: 'Cost Centre / Budget Code' },
];
const ALL = [...ONLINE, ...OFFLINE];

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

async function testAllMethodsRenderInCorrectGroups(page) {
  await openDraft(page); await openPayments(page);
  const onlineHost = await page.getByTestId('payment-group-online').isVisible();
  const offlineHost = await page.getByTestId('payment-group-offline').isVisible();

  const missing = [];
  for (const m of ONLINE) {
    const inOnline = await page.locator(`[data-testid="payment-group-online"] [data-testid="payment-method-${m.key}"]`).count();
    if (inOnline !== 1) missing.push(`Online:${m.label}`);
  }
  for (const m of OFFLINE) {
    const inOffline = await page.locator(`[data-testid="payment-group-offline"] [data-testid="payment-method-${m.key}"]`).count();
    if (inOffline !== 1) missing.push(`Offline:${m.label}`);
  }
  const shot = await snap(page, 'US-135723.methods.groupedRender');
  record('US-135723.methods.allMethodsInCorrectGroups',
    'All 7 Online and 4 Offline methods render in their correct UI groups',
    onlineHost && offlineHost && missing.length === 0,
    `online=${onlineHost} offline=${offlineHost} missing=${missing.join(',') || 'none'}`, shot);
}

async function testMethodLabelsExact(page) {
  await openDraft(page); await openPayments(page);
  const missing = [];
  for (const m of ALL) {
    const cnt = await page.getByText(m.label, { exact: true }).count();
    if (cnt < 1) missing.push(m.label);
  }
  const shot = await snap(page, 'US-135723.methods.labelsExact');
  record('US-135723.methods.labelsMatchAcExactly',
    'Every method label in the section matches the AC wording exactly',
    missing.length === 0, missing.length ? `missing=${missing.join(',')}` : 'all 11 labels present', shot);
}

async function testEachMethodHasInfoTagline(page) {
  await openDraft(page); await openPayments(page);
  const missing = [];
  for (const m of ALL) {
    const el = page.getByTestId(`payment-method-info-${m.key}`);
    const visible = await el.isVisible().catch(() => false);
    const txt = visible ? ((await el.textContent()) || '').trim() : '';
    if (!visible || txt.length < 10) missing.push(`${m.label} (${txt.length} chars)`);
  }
  const shot = await snap(page, 'US-135723.methods.taglines');
  record('US-135723.methods.eachHasInfoTagline',
    'Each method displays an info tagline / caption beneath its label',
    missing.length === 0, missing.length ? `missing/short=${missing.join('; ')}` : 'all 11 taglines present', shot);
}

async function testDefaultAllUnchecked(page) {
  await openDraft(page); await openPayments(page);
  const checked = [];
  for (const m of ALL) {
    if (await page.getByTestId(`payment-method-${m.key}`).isChecked()) checked.push(m.label);
  }
  const shot = await snap(page, 'US-135723.methods.defaultUnchecked');
  record('US-135723.methods.defaultAllUnchecked',
    'By default (fresh draft), no payment methods are checked',
    checked.length === 0, checked.length ? `unexpectedly checked=${checked.join(',')}` : 'all unchecked', shot);
}

async function testCheckAndUncheck(page) {
  await openDraft(page); await openPayments(page);
  const cb = page.getByTestId('payment-method-payNow');
  await cb.check();
  const afterCheck = await cb.isChecked();
  await cb.uncheck();
  const afterUncheck = await cb.isChecked();
  const shot = await snap(page, 'US-135723.methods.checkUncheck');
  record('US-135723.methods.canCheckAndUncheck',
    'A method checkbox can be checked and then unchecked',
    afterCheck === true && afterUncheck === false,
    `afterCheck=${afterCheck} afterUncheck=${afterUncheck}`, shot);
}

async function testSelectionsPersist(page) {
  await openDraft(page); await openPayments(page);
  await page.getByTestId('payment-method-payMonthly').check();
  await page.getByTestId('payment-method-invoice').check();
  await wait(200);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(500);
  await openPayments(page);
  const a = await page.getByTestId('payment-method-payMonthly').isChecked();
  const b = await page.getByTestId('payment-method-invoice').isChecked();
  const c = await page.getByTestId('payment-method-payNow').isChecked();
  const shot = await snap(page, 'US-135723.methods.persistReload');
  record('US-135723.methods.selectionsPersistAcrossReload',
    'Method selections persist across page reload',
    a === true && b === true && c === false,
    `payMonthly=${a} invoice=${b} payNow=${c}`, shot);
}

async function testDraftAllowsZeroMethods(page) {
  await openDraft(page); await openPayments(page);
  // Ensure all unchecked (already default), then click Save Draft.
  const anyChecked = [];
  for (const m of ALL) if (await page.getByTestId(`payment-method-${m.key}`).isChecked()) anyChecked.push(m.key);
  // If somehow any were checked, uncheck.
  for (const k of anyChecked) await page.getByTestId(`payment-method-${k}`).uncheck();
  await wait(150);
  // Click a "Save Draft" style button. Look for common testids/labels.
  const saveDraftBtn = page.getByRole('button', { name: /Save Draft|Save as Draft|Save/i }).first();
  const btnVisible = await saveDraftBtn.isVisible().catch(() => false);
  if (btnVisible) await saveDraftBtn.click();
  await wait(300);
  // No error alert should be present.
  const errShown = await page.getByTestId('payment-methods-error').isVisible().catch(() => false);
  const shot = await snap(page, 'US-135723.draft.allowsZero');
  record('US-135723.draft.allowsZeroMethods',
    'Saving as Draft with zero methods surfaces no payment-methods error',
    !errShown, `errorAlertVisible=${errShown} saveBtnClicked=${btnVisible}`, shot);
}

async function testPublishBlocksWithZeroMethods(page) {
  await openDraft(page); await openPayments(page);
  // Ensure all unchecked.
  for (const m of ALL) {
    const cb = page.getByTestId(`payment-method-${m.key}`);
    if (await cb.isChecked()) await cb.uncheck();
  }
  await wait(150);
  // Click Publish.
  const publishBtn = page.getByRole('button', { name: /^Publish$/i }).first();
  const btnVisible = await publishBtn.isVisible().catch(() => false);
  if (btnVisible) await publishBtn.click();
  await wait(500);
  // Look for the exact error text anywhere (dialog OR inline alert).
  const exactMsg = 'At least one payment method is required to publish this permission';
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasMsg = bodyText.includes(exactMsg);
  const shot = await snap(page, 'US-135723.publish.blockedZero');
  record('US-135723.publish.blockedWithExactError',
    'Publishing with zero methods surfaces the exact required error message',
    hasMsg, hasMsg ? 'exact error found' : `msg not found; publishBtnVisible=${btnVisible}`, shot);
}

async function testPublishAllowsWithOneMethod(page) {
  await openDraft(page); await openPayments(page);
  await page.getByTestId('payment-method-payNow').check();
  await wait(200);
  // Fill any other publish-required fields via localStorage direct write to
  // avoid tripping unrelated validation; but only if the publish dialog still
  // pops up we can accept that "payment method" error is at least NOT in it.
  const publishBtn = page.getByRole('button', { name: /^Publish$/i }).first();
  if (await publishBtn.isVisible().catch(() => false)) await publishBtn.click();
  await wait(500);
  const bodyText = await page.evaluate(() => document.body.innerText);
  const stillPaymentErr = bodyText.includes('At least one payment method is required to publish this permission');
  const shot = await snap(page, 'US-135723.publish.oneMethodOk');
  record('US-135723.publish.paymentErrorClearsWithOneMethod',
    'Selecting one method removes the payment-method publish error (other validations may still block)',
    !stillPaymentErr, stillPaymentErr ? 'payment error still shown' : 'no payment error present', shot);
}

async function testInfoTaglinePresent(page) {
  await openDraft(page); await openPayments(page);
  // At least the section-level info tagline should exist when no error state.
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasInfo = /at least one method is required before you can publish/i.test(bodyText);
  const shot = await snap(page, 'US-135723.info.sectionTagline');
  record('US-135723.info.sectionTaglineVisible',
    'Section-level info text explains draft vs. publish behaviour',
    hasInfo, hasInfo ? 'info tagline found' : 'tagline missing', shot);
}

// ─── Runner ───────────────────────────────────────────────────────────────

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['methods grouped correctly',        testAllMethodsRenderInCorrectGroups],
    ['exact AC labels',                  testMethodLabelsExact],
    ['each has info tagline',            testEachMethodHasInfoTagline],
    ['default all unchecked',            testDefaultAllUnchecked],
    ['check + uncheck',                  testCheckAndUncheck],
    ['selections persist reload',        testSelectionsPersist],
    ['draft allows zero methods',        testDraftAllowsZeroMethods],
    ['publish blocked at zero',          testPublishBlocksWithZeroMethods],
    ['publish ok with one method',       testPublishAllowsWithOneMethod],
    ['section info tagline visible',     testInfoTaglinePresent],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-135723.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-135723 Payment Settings',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us135723-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-135723 Report</title>
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
<h1>US-135723 — Payment Settings</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us135723-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us135723-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
