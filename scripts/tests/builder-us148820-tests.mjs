/**
 * US-148820 — Permission Setup | Builder | Discount Settings | Help Description
 *
 * ACs:
 *  1. In Discount Settings the admin sees Blue Badge Discount, Pension
 *     Discount and a "Discount Help Description" text box.
 *  2. The text box accepts a maximum of 500 characters.
 *  3. On the application form, next to the discounts field, a help
 *     icon ("i") is visible.
 *  4. Hovering the icon shows a tooltip with the configured help message.
 *
 * Run: node scripts/tests/builder-us148820-tests.mjs
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
      if (k.startsWith('prototype:discountSettings:')) localStorage.removeItem(k);
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

async function openDiscounts(page) {
  await page.getByTestId('subnav-discount-settings').click();
  await wait(400);
}

async function seedPermissionForBuyNow(page, opts = {}) {
  // Publish a well-known permission and pre-populate its discount settings so
  // the Buy Now drawer can render the discounts field with the help icon.
  await page.evaluate(({ helpText, blueBadge, pension }) => {
    const permId = 'P-DISCOUNT-BN';
    const rows = JSON.parse(localStorage.getItem('prototype:builder:list:rows') || '[]');
    const others = rows.filter((r) => r.id !== permId);
    others.push({
      id: permId,
      name: 'Discount Buy-Now Test',
      type: 'Permit',
      group: 'Business',
      status: 'Published',
      version: '1.0',
      modifiedOn: '2025-01-01',
      modifiedBy: 'test',
    });
    localStorage.setItem('prototype:builder:list:rows', JSON.stringify(others));
    localStorage.setItem(`prototype:discountSettings:${permId}`, JSON.stringify({
      blueBadge: blueBadge || { value: '', kind: 'percentage' },
      pension:   pension   || { value: '', kind: 'percentage' },
      helpDescription: helpText || '',
    }));
  }, opts);
}

async function openBuyNowForPerm(page, permId = 'P-DISCOUNT-BN') {
  await page.goto(`${BASE}/applicants`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  await page.locator('button[title="Edit"]').first().click();
  await wait(300);
  await page.getByRole('tab', { name: 'Applications' }).click();
  await wait(300);
  await page.getByTestId('applicant-buy-now').click();
  await wait(500);
  await page.getByTestId(`buynow-perm-card-${permId}`).click();
  await wait(400);
}

async function advanceBuyNowToPriceStep(page) {
  // Step 0 — Address. Fields share generic labels, so target them by role.
  const textboxes0 = page.getByRole('textbox');
  await textboxes0.nth(0).fill('1 High Street');
  await textboxes0.nth(2).fill('London');
  await textboxes0.nth(3).fill('SW1A 1AA');
  await page.getByRole('combobox').first().click();
  await wait(200);
  await page.getByRole('option', { name: 'Zone A' }).click();
  await wait(200);
  await page.getByTestId('buynow-next').click();
  await wait(300);
  // Step 1 — Documents
  await page.getByRole('button', { name: /Upload Document/i }).click();
  await wait(300);
  await page.getByTestId('buynow-next').click();
  await wait(300);
  // Step 2 — Vehicle
  const textboxes2 = page.getByRole('textbox');
  await textboxes2.nth(0).fill('AB12CDE');
  await textboxes2.nth(1).fill('Ford');
  await textboxes2.nth(2).fill('Focus');
  await page.getByTestId('buynow-next').click();
  await wait(500);
}

// ─── Tests ────────────────────────────────────────────────────────────────

async function testHelpDescriptionFieldPresent(page) {
  await openDraft(page); await openDiscounts(page);
  const label = await page.getByText('Discount Help Description', { exact: false }).first().isVisible();
  const input = await page.getByTestId('discount-help-description').isVisible();
  const counter = await page.getByTestId('discount-help-description-counter').isVisible();
  const shot = await snap(page, 'US-148820.field.present');
  record('US-148820.builder.helpDescriptionFieldPresent',
    'Discount Settings shows a "Discount Help Description" text box with a character counter',
    label && input && counter, `label=${label} input=${input} counter=${counter}`, shot);
}

async function testMaxLength500(page) {
  await openDraft(page); await openDiscounts(page);
  const input = page.getByTestId('discount-help-description');
  await input.click();
  const big = 'a'.repeat(600);
  await input.pressSequentially(big, { delay: 0 });
  await wait(200);
  const val = await input.inputValue();
  const counterText = (await page.getByTestId('discount-help-description-counter').textContent()).trim();
  const shot = await snap(page, 'US-148820.field.maxLength');
  const ok = val.length === 500 && counterText.startsWith('500/500');
  record('US-148820.builder.acceptsMaximum500Characters',
    'The text box hard-limits input to 500 characters and the counter reports 500/500',
    ok, `stored length=${val.length}, counter="${counterText}"`, shot);
}

async function testCounterUpdatesLive(page) {
  await openDraft(page); await openDiscounts(page);
  const input = page.getByTestId('discount-help-description');
  await input.click();
  await input.pressSequentially('Hello discounts', { delay: 5 });
  await wait(150);
  const counter = (await page.getByTestId('discount-help-description-counter').textContent()).trim();
  const shot = await snap(page, 'US-148820.field.counterLive');
  record('US-148820.builder.counterUpdatesLive',
    'The character counter updates as the user types',
    counter.startsWith('15/500'), `counter="${counter}"`, shot);
}

async function testValuePersistsAcrossReload(page) {
  await openDraft(page); await openDiscounts(page);
  const input = page.getByTestId('discount-help-description');
  await input.click();
  await input.pressSequentially('Applies at checkout only.', { delay: 5 });
  await wait(200);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openDiscounts(page);
  const val = await page.getByTestId('discount-help-description').inputValue();
  const shot = await snap(page, 'US-148820.field.persists');
  record('US-148820.builder.helpDescriptionPersists',
    'The help description text persists across a page reload',
    val === 'Applies at checkout only.', `stored="${val}"`, shot);
}

async function testDraftIgnoresHelpValidation(page) {
  await openDraft(page); await openDiscounts(page);
  // Blank help text is allowed; ensure Save-as-Draft succeeds regardless.
  const btn = page.getByRole('button', { name: /Save Draft|Save as Draft|^Save$/i }).first();
  const visible = await btn.isVisible().catch(() => false);
  if (visible) await btn.click();
  await wait(400);
  const blocking = await page.getByText(/cannot save|fix the following/i).isVisible().catch(() => false);
  const shot = await snap(page, 'US-148820.field.draftBlank');
  record('US-148820.builder.blankHelpAllowedInDraft',
    'Save as Draft succeeds with a blank Discount Help Description',
    !blocking, `blockingDialog=${blocking}`, shot);
}

async function testBuyNowHiddenMirrorMatchesConfigured(page) {
  await resetStorage(page);
  await seedPermissionForBuyNow(page, {
    helpText: 'Blue Badge holders get an automatic 20% discount at checkout.',
    blueBadge: { value: '20', kind: 'percentage' },
    pension:   { value: '10', kind: 'currency' },
  });
  await openBuyNowForPerm(page);
  const mirror = page.getByTestId('buynow-hidden-discount-help');
  const text = (await mirror.textContent()) || '';
  const shot = await snap(page, 'US-148820.buynow.mirror');
  const ok = text === 'Blue Badge holders get an automatic 20% discount at checkout.';
  record('US-148820.buynow.hiddenMirrorCarriesHelpText',
    'The Buy Now drawer exposes the configured help text via a hidden mirror',
    ok, `text="${text}"`, shot);
}

async function testBuyNowShowsHelpIconAndTooltip(page) {
  await resetStorage(page);
  await seedPermissionForBuyNow(page, {
    helpText: 'Discount will be applied automatically at checkout.',
    blueBadge: { value: '15', kind: 'percentage' },
    pension:   { value: '', kind: 'percentage' },
  });
  await openBuyNowForPerm(page);
  await advanceBuyNowToPriceStep(page);
  const iconVisible = await page.getByTestId('discount-help-icon').isVisible().catch(() => false);
  let tooltipVisible = false;
  let tooltipText = '';
  if (iconVisible) {
    await page.getByTestId('discount-help-icon').hover();
    await wait(600);
    const t = page.getByTestId('discount-help-tooltip-content');
    tooltipVisible = await t.isVisible().catch(() => false);
    tooltipText = tooltipVisible ? (await t.textContent()) || '' : '';
  }
  const shot = await snap(page, 'US-148820.buynow.tooltip');
  const ok = iconVisible && tooltipVisible && tooltipText === 'Discount will be applied automatically at checkout.';
  record('US-148820.buynow.helpIconShowsTooltipOnHover',
    'On the application form the discounts field shows an info icon and hovering reveals the configured message',
    ok, `iconVisible=${iconVisible} tooltipVisible=${tooltipVisible} text="${tooltipText}"`, shot);
}

async function testBuyNowNoIconWhenBlank(page) {
  await resetStorage(page);
  await seedPermissionForBuyNow(page, {
    helpText: '',
    blueBadge: { value: '5', kind: 'percentage' },
    pension:   { value: '', kind: 'percentage' },
  });
  await openBuyNowForPerm(page);
  await advanceBuyNowToPriceStep(page);
  const iconCount = await page.getByTestId('discount-help-icon').count();
  const shot = await snap(page, 'US-148820.buynow.noIconWhenBlank');
  record('US-148820.buynow.helpIconHiddenWhenNoDescription',
    'The help icon is hidden when the admin has not configured a Discount Help Description',
    iconCount === 0, `iconCount=${iconCount}`, shot);
}

// ─── Runner ───────────────────────────────────────────────────────────────

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['help description field present',       testHelpDescriptionFieldPresent],
    ['max length 500',                       testMaxLength500],
    ['counter updates live',                 testCounterUpdatesLive],
    ['value persists across reload',         testValuePersistsAcrossReload],
    ['draft ignores help validation',        testDraftIgnoresHelpValidation],
    ['buy now hidden mirror carries text',   testBuyNowHiddenMirrorMatchesConfigured],
    ['buy now shows help icon and tooltip',  testBuyNowShowsHelpIconAndTooltip],
    ['buy now hides icon when blank',        testBuyNowNoIconWhenBlank],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-148820.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-148820 Discount Help Description',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us148820-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-148820 Report</title>
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
<h1>US-148820 — Discount Settings | Help Description</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us148820-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us148820-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
