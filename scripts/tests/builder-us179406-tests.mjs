/**
 * US-179406 — Permission Setup | Builder — General Settings
 *              Free Permission Option
 *
 * ACs:
 *   1. General Settings shows a "Free Permission" field with Enable / Disable radios.
 *   2. Default is Disable.
 *   3. Selecting Enable opens a confirmation prompt with the exact message
 *      "Enabling this option will make this permission free, even if a pricing
 *      is configured. No charges will be applied." and two actions: Enable, Cancel.
 *   4. Enable → applied; radio stays on Enable.
 *   5. Cancel from Enable prompt → radio remains Disable, no change applied.
 *   6. When free permission is enabled, radio persists across reload.
 *   7. Selecting Disable when currently Enable opens a confirmation prompt with
 *      "Disabling this option will remove the free status from this permission.
 *      Configured pricing will now be applied." with actions: Disable, Cancel.
 *   8. Disable action → radio flips to Disable.
 *   9. Cancel from Disable prompt → radio remains Enable, no change applied.
 *  10. Toggling the free permission does not clear/change pricing configuration.
 *
 * Run: node scripts/tests/builder-us179406-tests.mjs
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
      mk('City Centre', 'Zonal'), mk('Visitor Books', 'Zonal'),
      mk('Business', 'Non-Zonal'), mk('Disabled', 'Zonal'),
      mk('Contractor', 'Zonal'), mk('Market', 'Zonal'),
    ]));
  });
}

async function resetStorage(page) {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:builder:') && !k.endsWith(':groups:rows')) localStorage.removeItem(k);
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

async function openGeneralSettings(page) {
  await page.getByTestId('subnav-general-settings').click();
  await wait(400);
  // Scroll Free Permission into view.
  const label = page.getByText('Free Permission', { exact: true }).first();
  await label.scrollIntoViewIfNeeded().catch(() => {});
  await wait(100);
}

// ---------- Tests ----------

async function testFreePermissionFieldPresent(page) {
  await openDraft(page); await openGeneralSettings(page);
  const enable = await page.getByTestId('free-permission-enable').isVisible();
  const disable = await page.getByTestId('free-permission-disable').isVisible();
  const shot = await snap(page, 'US-179406.field.present');
  record('US-179406.field.present',
    '"Free Permission" field with Enable/Disable radios is present in General Settings',
    enable && disable, `enable=${enable} disable=${disable}`, shot);
}

async function testDefaultDisabled(page) {
  await openDraft(page); await openGeneralSettings(page);
  const disabledChecked = await page.getByTestId('free-permission-disable').isChecked();
  const enabledChecked = await page.getByTestId('free-permission-enable').isChecked();
  record('US-179406.field.defaultDisabled',
    'Free Permission is Disabled by default',
    disabledChecked && !enabledChecked, `disable=${disabledChecked} enable=${enabledChecked}`);
}

async function testEnablePromptMessage(page) {
  await openDraft(page); await openGeneralSettings(page);
  await page.getByTestId('free-permission-enable').click();
  await wait(300);
  const visible = await page.getByTestId('free-permission-dialog').isVisible();
  const msg = (await page.getByTestId('free-permission-dialog-message').textContent()).trim();
  const cancelBtn = await page.getByTestId('free-permission-dialog-cancel').isVisible();
  const confirmBtn = (await page.getByTestId('free-permission-dialog-confirm').textContent()).trim();
  const shot = await snap(page, 'US-179406.enable.prompt');
  const expected = 'Enabling this option will make this permission free, even if a pricing is configured. No charges will be applied.';
  record('US-179406.enable.promptExactMessage',
    'Enable prompt shows the exact AC message + Enable/Cancel actions',
    visible && msg === expected && cancelBtn && confirmBtn === 'Enable',
    `visible=${visible} msg="${msg}" cancel=${cancelBtn} confirmLabel="${confirmBtn}"`, shot);
}

async function testEnableCancelKeepsDisabled(page) {
  await openDraft(page); await openGeneralSettings(page);
  await page.getByTestId('free-permission-enable').click();
  await wait(300);
  await page.getByTestId('free-permission-dialog-cancel').click();
  await wait(300);
  const dialogClosed = !(await page.getByTestId('free-permission-dialog').isVisible().catch(() => false));
  const disableChecked = await page.getByTestId('free-permission-disable').isChecked();
  const enableChecked = await page.getByTestId('free-permission-enable').isChecked();
  record('US-179406.enable.cancelKeepsDisabled',
    'Cancelling Enable keeps the option Disabled — no change applied',
    dialogClosed && disableChecked && !enableChecked,
    `dialogClosed=${dialogClosed} disable=${disableChecked} enable=${enableChecked}`);
}

async function testEnableConfirmApplies(page) {
  await openDraft(page); await openGeneralSettings(page);
  await page.getByTestId('free-permission-enable').click();
  await wait(300);
  await page.getByTestId('free-permission-dialog-confirm').click();
  await wait(400);
  const dialogClosed = !(await page.getByTestId('free-permission-dialog').isVisible().catch(() => false));
  const enableChecked = await page.getByTestId('free-permission-enable').isChecked();
  const statusVisible = await page.getByTestId('free-permission-status').isVisible().catch(() => false);
  const shot = await snap(page, 'US-179406.enable.applied');
  record('US-179406.enable.confirmApplies',
    'Confirming Enable turns Free Permission on and shows the status note',
    dialogClosed && enableChecked && statusVisible,
    `dialogClosed=${dialogClosed} enable=${enableChecked} status=${statusVisible}`, shot);
}

async function testEnablePersistsAcrossReload(page) {
  await openDraft(page); await openGeneralSettings(page);
  await page.getByTestId('free-permission-enable').click();
  await wait(300);
  await page.getByTestId('free-permission-dialog-confirm').click();
  await wait(400);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openGeneralSettings(page);
  const enableChecked = await page.getByTestId('free-permission-enable').isChecked();
  record('US-179406.enable.persistsAcrossReload',
    'Free Permission = Enable persists across page reload',
    enableChecked, `enable=${enableChecked}`);
}

async function testDisablePromptMessage(page) {
  await openDraft(page); await openGeneralSettings(page);
  // Turn it on first.
  await page.getByTestId('free-permission-enable').click(); await wait(200);
  await page.getByTestId('free-permission-dialog-confirm').click(); await wait(400);
  // Now attempt to disable.
  await page.getByTestId('free-permission-disable').click();
  await wait(300);
  const visible = await page.getByTestId('free-permission-dialog').isVisible();
  const msg = (await page.getByTestId('free-permission-dialog-message').textContent()).trim();
  const confirmBtn = (await page.getByTestId('free-permission-dialog-confirm').textContent()).trim();
  const cancelBtn = await page.getByTestId('free-permission-dialog-cancel').isVisible();
  const shot = await snap(page, 'US-179406.disable.prompt');
  const expected = 'Disabling this option will remove the free status from this permission. Configured pricing will now be applied.';
  record('US-179406.disable.promptExactMessage',
    'Disable prompt shows the exact AC message + Disable/Cancel actions',
    visible && msg === expected && cancelBtn && confirmBtn === 'Disable',
    `visible=${visible} msg="${msg}" cancel=${cancelBtn} confirmLabel="${confirmBtn}"`, shot);
}

async function testDisableCancelKeepsEnabled(page) {
  await openDraft(page); await openGeneralSettings(page);
  await page.getByTestId('free-permission-enable').click(); await wait(200);
  await page.getByTestId('free-permission-dialog-confirm').click(); await wait(400);
  await page.getByTestId('free-permission-disable').click(); await wait(300);
  await page.getByTestId('free-permission-dialog-cancel').click(); await wait(300);
  const dialogClosed = !(await page.getByTestId('free-permission-dialog').isVisible().catch(() => false));
  const enableChecked = await page.getByTestId('free-permission-enable').isChecked();
  const disableChecked = await page.getByTestId('free-permission-disable').isChecked();
  record('US-179406.disable.cancelKeepsEnabled',
    'Cancelling Disable keeps the option Enabled — no change applied',
    dialogClosed && enableChecked && !disableChecked,
    `dialogClosed=${dialogClosed} enable=${enableChecked} disable=${disableChecked}`);
}

async function testDisableConfirmApplies(page) {
  await openDraft(page); await openGeneralSettings(page);
  await page.getByTestId('free-permission-enable').click(); await wait(200);
  await page.getByTestId('free-permission-dialog-confirm').click(); await wait(400);
  await page.getByTestId('free-permission-disable').click(); await wait(300);
  await page.getByTestId('free-permission-dialog-confirm').click(); await wait(400);
  const disableChecked = await page.getByTestId('free-permission-disable').isChecked();
  const enableChecked = await page.getByTestId('free-permission-enable').isChecked();
  const statusVisible = await page.getByTestId('free-permission-status').isVisible().catch(() => false);
  const shot = await snap(page, 'US-179406.disable.applied');
  record('US-179406.disable.confirmApplies',
    'Confirming Disable turns Free Permission off and removes the status note',
    disableChecked && !enableChecked && !statusVisible,
    `disable=${disableChecked} enable=${enableChecked} status=${statusVisible}`, shot);
}

async function testTogglingDoesNotAffectPricing(page) {
  // Use the pricing snapshot key to prove pricing isn't cleared.
  await openDraft(page); await openGeneralSettings(page);
  // Seed a fake pricing snapshot for the current permission.
  await page.evaluate(() => {
    const rows = JSON.parse(localStorage.getItem('prototype:builder:list:rows') || '[]');
    const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft');
    if (draft) {
      localStorage.setItem(`prototype:builder:${draft.id}:pricingSnapshot`, JSON.stringify({ base: 42, currency: 'GBP' }));
    }
  });
  // Toggle enable → confirm.
  await page.getByTestId('free-permission-enable').click(); await wait(200);
  await page.getByTestId('free-permission-dialog-confirm').click(); await wait(400);
  // Toggle disable → confirm.
  await page.getByTestId('free-permission-disable').click(); await wait(200);
  await page.getByTestId('free-permission-dialog-confirm').click(); await wait(400);
  const snapshot = await page.evaluate(() => {
    const rows = JSON.parse(localStorage.getItem('prototype:builder:list:rows') || '[]');
    const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft');
    return draft ? localStorage.getItem(`prototype:builder:${draft.id}:pricingSnapshot`) : null;
  });
  const preserved = snapshot && snapshot.includes('42');
  record('US-179406.toggle.pricingPreserved',
    'Toggling Free Permission (enable → disable) does NOT alter the pricing snapshot',
    !!preserved, `pricingSnapshot=${snapshot}`);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['field present',                testFreePermissionFieldPresent],
    ['default disabled',             testDefaultDisabled],
    ['enable prompt message',        testEnablePromptMessage],
    ['enable cancel keeps disabled', testEnableCancelKeepsDisabled],
    ['enable confirm applies',       testEnableConfirmApplies],
    ['enable persists',              testEnablePersistsAcrossReload],
    ['disable prompt message',       testDisablePromptMessage],
    ['disable cancel keeps enabled', testDisableCancelKeepsEnabled],
    ['disable confirm applies',      testDisableConfirmApplies],
    ['pricing preserved on toggle',  testTogglingDoesNotAffectPricing],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-179406.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-179406 Free Permission Option',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us179406-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-179406 Report</title>
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
<h1>US-179406 — Free Permission Option</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us179406-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us179406-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
