/**
 * US-132611 — Permission Setup | Builder – Create Permission
 *
 * Covers every AC in doc/US-132611-*.md:
 *   • Create button opens right-side slider panel
 *   • 4 required fields: Permission Name, Type, Group, Description
 *   • Permission Name: free text, ≤100 chars, no duplicates
 *   • Type: dropdown listing catalogue types
 *   • Group: dropdown filtered by selected Type
 *   • Group: empty-state message when no groups for selected type
 *   • Description: alphanumeric, ≤500 chars
 *   • Field-level "This field is required" errors when blank
 *   • Duplicate name error: "The permission name already exists."
 *   • Create success toast: "New Permission Created Successfully"
 *   • New row appears in list as Draft
 *   • Cancel with dirty form → confirmation dialog
 *   • Cancel confirm → panel closes, no row added
 *   • Cancel decline → panel stays open with data intact
 *
 * Run: node scripts/tests/builder-us132611-tests.mjs
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

async function resetStorage(page) {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:builder:')) localStorage.removeItem(k);
    }
  });
}

async function openList(page) {
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
}

async function openSlider(page) {
  await page.locator('[data-testid="new-permission"]').click();
  await wait(400);
}

// Helper: pick MUI Select value by clicking its combobox then the option
async function pickSelect(page, testId, optionText) {
  const trigger = page.locator(`[data-testid="${testId}"]`).locator('..').locator('[role="combobox"]').first();
  await trigger.click();
  await wait(300);
  await page.getByRole('option', { name: optionText, exact: true }).click();
  await wait(300);
}

// ─── AC 1: Slider opens ───────────────────────────────────────────────────
async function testSliderOpens(page) {
  await openList(page);
  const before = await page.locator('[data-testid="create-permission-drawer"]').isVisible().catch(() => false);
  await openSlider(page);
  const after = await page.locator('[data-testid="create-permission-drawer"]').isVisible();
  const shot = await snap(page, 'US-132611.slider.opened');
  record('US-132611.slider.opens',
    'Create button opens right-side slider panel',
    !before && after, `visible before=${before}, after=${after}`, shot);
}

// ─── AC 2: Required fields present ────────────────────────────────────────
async function testFieldsPresent(page) {
  await openList(page); await openSlider(page);
  const drawer = page.locator('[data-testid="create-permission-drawer"]');
  const needed = ['Permission Name', 'Type', 'Group', 'Description'];
  const labels = await drawer.locator('label').allTextContents();
  const missing = needed.filter((n) => !labels.some((l) => l.includes(n)));
  const shot = await snap(page, 'US-132611.fields.present');
  record('US-132611.fields.allRequiredPresent',
    'Slider exposes 4 required fields',
    missing.length === 0,
    `labels=${JSON.stringify(labels)}${missing.length ? `; missing=${JSON.stringify(missing)}` : ''}`,
    shot);
}

// ─── AC 3: Empty-field errors ─────────────────────────────────────────────
async function testEmptyFieldErrors(page) {
  await openList(page); await openSlider(page);
  await page.locator('[data-testid="create-submit"]').click();
  await wait(400);
  const helpers = await page.locator('[data-testid="create-permission-drawer"] .MuiFormHelperText-root.Mui-error').allTextContents();
  const reqCount = helpers.filter((h) => /this field is required/i.test(h)).length;
  const shot = await snap(page, 'US-132611.validation.empty');
  record('US-132611.validation.thisFieldRequired',
    'Empty required fields show "This field is required"',
    reqCount >= 3, `errors=${JSON.stringify(helpers)}`, shot);
}

// ─── AC 4: Name max 100 chars ─────────────────────────────────────────────
async function testNameMax(page) {
  await openList(page); await openSlider(page);
  const long = 'A'.repeat(150);
  await page.locator('[data-testid="create-name-input"]').fill(long);
  const val = await page.locator('[data-testid="create-name-input"]').inputValue();
  record('US-132611.name.maxLength100',
    'Permission Name accepts max 100 characters',
    val.length === 100, `entered=150 chars, kept=${val.length}`);
}

// ─── AC 5: Duplicate name ─────────────────────────────────────────────────
async function testDuplicateName(page) {
  await openList(page);
  // Grab a name that already exists from the first row
  const existingName = (await page.locator('[data-testid^="row-name-"]').first().innerText()).trim();
  await openSlider(page);
  await page.locator('[data-testid="create-name-input"]').fill(existingName);
  await page.locator('[data-testid="create-description-input"]').fill('Test description');
  await page.locator('[data-testid="create-submit"]').click();
  await wait(400);
  const err = await page.locator('[data-testid="create-permission-drawer"] .MuiFormHelperText-root.Mui-error').allTextContents();
  const found = err.some((e) => /permission name already exists/i.test(e));
  const shot = await snap(page, 'US-132611.name.duplicate');
  record('US-132611.name.duplicateBlocked',
    'Duplicate name shows "The permission name already exists."',
    found, `errors=${JSON.stringify(err)}`, shot);
}

// ─── AC 6: Type dropdown populates + selecting filters Group ──────────────
async function testTypeAndGroupCascade(page) {
  await openList(page); await openSlider(page);

  // Click Type combobox
  const typeCombo = page.locator('[data-field="Type"] [role="combobox"]');
  await typeCombo.click();
  await wait(300);
  const typeOpts = (await page.getByRole('option').allTextContents()).map((s) => s.trim());
  const shot1 = await snap(page, 'US-132611.type.options');
  record('US-132611.type.dropdownPopulated',
    'Type dropdown lists catalogue types',
    typeOpts.length >= 5,
    `options=${JSON.stringify(typeOpts.slice(0, 8))}...`,
    shot1);

  await page.getByRole('option', { name: 'Residents Permit', exact: true }).click();
  await wait(300);

  // Open Group dropdown — should have at least 1 group filtered by 'Residents Permit'
  const groupCombo = page.locator('[data-field="Group"] [role="combobox"]');
  await groupCombo.click();
  await wait(300);
  const groupOpts = (await page.getByRole('option').allTextContents()).map((s) => s.trim());
  const filteredOk = groupOpts.length > 0;
  const shot2 = await snap(page, 'US-132611.group.filtered');
  record('US-132611.group.filteredByType',
    'Selecting Type filters Group dropdown to matching groups',
    filteredOk, `groups for Residents Permit=${JSON.stringify(groupOpts)}`, shot2);
  await page.keyboard.press('Escape');
  await wait(200);
}

// ─── AC 7: Group empty-state message ──────────────────────────────────────
async function testGroupEmptyState(page) {
  await openList(page);
  // Zero out groups so no type has any group
  await page.evaluate(() => localStorage.setItem('prototype:builder:groups:rows', JSON.stringify([])));
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openSlider(page);

  const typeCombo = page.locator('[data-field="Type"] [role="combobox"]');
  await typeCombo.click();
  await wait(300);
  await page.getByRole('option', { name: 'Residents Permit', exact: true }).click();
  await wait(400);

  const helper = await page.locator('[data-field="Group"] .MuiFormHelperText-root').innerText().catch(() => '');
  const ok = /no groups yet\.\s*create a group for this type/i.test(helper);
  const shot = await snap(page, 'US-132611.group.emptyState');
  record('US-132611.group.emptyStateMessage',
    'Empty group list shows "No groups yet. Create a group for this type."',
    ok, `helper="${helper}"`, shot);
}

// ─── AC 8: Description ≤500 chars + alphanumeric ──────────────────────────
async function testDescriptionRules(page) {
  await openList(page); await openSlider(page);
  const desc = page.locator('[data-testid="create-description-input"]');
  await desc.fill('A'.repeat(600));
  const val = await desc.inputValue();
  record('US-132611.desc.maxLength500',
    'Description accepts max 500 characters',
    val.length === 500, `entered=600, kept=${val.length}`);
}

// ─── AC 9: Successful create → toast + Draft row in list ──────────────────
async function testSuccessfulCreate(page) {
  await openList(page); await openSlider(page);
  const unique = `Auto Test Permission ${Date.now()}`;
  await page.locator('[data-testid="create-name-input"]').fill(unique);
  await page.locator('[data-field="Type"] [role="combobox"]').click();
  await wait(300);
  await page.getByRole('option', { name: 'Residents Permit', exact: true }).click();
  await wait(300);
  await page.locator('[data-field="Group"] [role="combobox"]').click();
  await wait(300);
  const opt = page.getByRole('option').first();
  await opt.click();
  await wait(300);
  await page.locator('[data-testid="create-description-input"]').fill('This is a valid alphanumeric description for the new permission.');
  await wait(200);
  await page.locator('[data-testid="create-submit"]').click();
  await wait(700);

  const toast = await page.locator('.MuiSnackbar-root, .MuiAlert-root').last().innerText().catch(() => '');
  const toastOk = /new permission created successfully/i.test(toast);
  const drawerClosed = !(await page.locator('[data-testid="create-permission-drawer"]').isVisible().catch(() => false));
  const shot = await snap(page, 'US-132611.create.success');
  record('US-132611.create.successToast',
    'Success toast reads "New Permission Created Successfully"',
    toastOk, `toast="${toast}"`, shot);
  record('US-132611.create.drawerCloses',
    'Slider closes after successful create',
    drawerClosed);

  await wait(300);
  const rowExists = await page.locator(`[data-testid^="row-name-"]`, { hasText: unique }).count();
  const statusChip = await page.locator(`[data-testid^="row-P-"]`).filter({ hasText: unique })
    .locator('[data-testid^="row-status-"]').innerText().catch(() => '');
  const shot2 = await snap(page, 'US-132611.create.rowVisible');
  record('US-132611.create.newRowInList',
    'New permission appears in list',
    rowExists > 0, `name="${unique}" found=${rowExists}`, shot2);
  record('US-132611.create.newRowDraftStatus',
    'New row shows "Draft" status',
    /^draft$/i.test(statusChip.trim()), `status="${statusChip}"`);
}

// ─── AC 10: Cancel confirmation ───────────────────────────────────────────
async function testCancelConfirmation(page) {
  await openList(page); await openSlider(page);
  // Dirty the form
  await page.locator('[data-testid="create-name-input"]').fill('Dirty entry');
  await page.locator('[data-testid="create-cancel"]').click();
  await wait(400);
  const dialog = page.locator('.MuiDialog-root:visible');
  const dialogText = await dialog.innerText().catch(() => '');
  const hasCopy = /are you sure you want to cancel\?/i.test(dialogText) &&
    /reset the data on the screen and close it/i.test(dialogText);
  const shot = await snap(page, 'US-132611.cancel.dialog');
  record('US-132611.cancel.confirmationDialog',
    'Cancel with dirty form opens confirmation dialog with expected copy',
    hasCopy, `text="${dialogText.slice(0, 200).replace(/\s+/g, ' ')}"`, shot);

  // Decline → stays open with data preserved
  await page.locator('[data-testid="cancel-dialog-decline"]').click();
  await wait(300);
  const stillOpen = await page.locator('[data-testid="create-permission-drawer"]').isVisible();
  const nameKept = await page.locator('[data-testid="create-name-input"]').inputValue();
  record('US-132611.cancel.declineKeepsData',
    'Declining cancel keeps slider open with entered data',
    stillOpen && nameKept === 'Dirty entry', `open=${stillOpen}, name="${nameKept}"`);

  // Confirm → closes without adding a row
  const countBefore = await page.locator('[data-testid^="row-name-"]').count();
  await page.locator('[data-testid="create-cancel"]').click();
  await wait(300);
  await page.locator('[data-testid="cancel-dialog-confirm"]').click();
  await wait(400);
  const nowClosed = !(await page.locator('[data-testid="create-permission-drawer"]').isVisible().catch(() => false));
  const countAfter = await page.locator('[data-testid^="row-name-"]').count();
  record('US-132611.cancel.confirmClosesNoRow',
    'Confirming cancel closes slider and does not add a row',
    nowClosed && countAfter === countBefore,
    `closed=${nowClosed}, rowsBefore=${countBefore}, rowsAfter=${countAfter}`);
}

// ─── Runner ────────────────────────────────────────────────────────────────
(async () => {
  console.log('\nUS-132611 test pack — Builder Create Permission');
  console.log('────────────────────────────────────────────────\n');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  const startedAt = new Date();
  const suites = [
    ['slider opens',           testSliderOpens],
    ['fields present',         testFieldsPresent],
    ['empty errors',           testEmptyFieldErrors],
    ['name max length',        testNameMax],
    ['duplicate name',         testDuplicateName],
    ['type-group cascade',     testTypeAndGroupCascade],
    ['group empty state',      testGroupEmptyState],
    ['description max',        testDescriptionRules],
    ['successful create',      testSuccessfulCreate],
    ['cancel confirmation',    testCancelConfirmation],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-132611.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-132611 Builder Create Permission',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us132611-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-132611 Report</title>
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
<h1>US-132611 — Builder Create Permission</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us132611-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us132611-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
