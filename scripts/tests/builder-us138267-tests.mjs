/**
 * US-138267 — Permission Setup | Builder — General Settings
 *              Set of check boxes (Other Settings + Zone Related + Permit Mode)
 *
 * ACs covered:
 *   Other Settings section
 *     - Section titled "Other Settings" is present.
 *     - Contains exactly 5 checkboxes: Back-office Use, VAT Applicable,
 *       Hours of Operation, Business Name, Enable Experian Check.
 *     - "Business Address" and "Comment Box" are NOT rendered in Other Settings.
 *     - All 5 checkboxes are unchecked by default and each toggles independently.
 *   Permit Mode
 *     - Rendered as TWO CHECKBOXES: Physical Permit + Virtual Permit
 *       (not a radio group).
 *     - Both checked by default.
 *     - Min-1 rule: attempting to un-check the last remaining mode is prevented.
 *   Zone Related
 *     - Two radio options: Zonal (default) and Non-Zonal.
 *     - When Zonal, a multi-select of zones is visible.
 *     - When Non-Zonal, the zone multi-select is hidden.
 *     - Zonal + empty zones → clicking Publish is blocked with message
 *       "Please select at least one zone".
 *     - Zonal + empty zones → Save Draft is allowed.
 *     - Selecting one or more zones clears the required error.
 *   Persistence
 *     - Zone Related, Zone selection, Permit Mode checkboxes and Other Settings
 *       checkboxes persist across page reload.
 *
 * Run: node scripts/tests/builder-us138267-tests.mjs
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

// ---------- Other Settings ----------

async function testOtherSettingsHeadingPresent(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const visible = await page.getByTestId('other-settings-heading').isVisible();
  const shot = await snap(page, 'US-138267.other.heading');
  record('US-138267.other.heading',
    'Section titled "Other Settings" is present',
    visible, `visible=${visible}`, shot);
}

async function testOtherSettingsAllFiveCheckboxesExist(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const ids = ['os-back-office', 'os-vat', 'os-hours', 'os-business-name', 'os-experian'];
  const missing = [];
  for (const t of ids) {
    if (!(await page.getByTestId(t).isVisible().catch(() => false))) missing.push(t);
  }
  record('US-138267.other.fiveCheckboxesPresent',
    'All 5 Other Settings checkboxes are rendered',
    missing.length === 0, `missing=[${missing.join(',')}]`);
}

async function testOtherSettingsExcludesBusinessAddressAndComment(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const body = await page.locator('body').textContent();
  // Both strings must be absent from the currently-rendered General Settings view.
  const hasBA = /Business Address/.test(body);
  const hasCB = /Comment Box/.test(body);
  record('US-138267.other.excludesLegacyCheckboxes',
    '"Business Address" and "Comment Box" are NOT rendered in Other Settings',
    !hasBA && !hasCB,
    `Business Address=${hasBA} Comment Box=${hasCB}`);
}

async function testOtherSettingsDefaultUnchecked(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const ids = ['os-back-office', 'os-vat', 'os-hours', 'os-business-name', 'os-experian'];
  const checked = [];
  for (const t of ids) {
    if (await page.getByTestId(t).isChecked()) checked.push(t);
  }
  record('US-138267.other.defaultUnchecked',
    'All 5 Other Settings checkboxes are unchecked by default',
    checked.length === 0, `checked=[${checked.join(',')}]`);
}

async function testOtherSettingsToggleIndependently(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const ids = ['os-back-office', 'os-vat', 'os-hours', 'os-business-name', 'os-experian'];
  const problems = [];
  for (const t of ids) {
    await page.getByTestId(t).check();
    await wait(80);
    if (!(await page.getByTestId(t).isChecked())) problems.push(`${t} not checked after check`);
    await page.getByTestId(t).uncheck();
    await wait(80);
    if (await page.getByTestId(t).isChecked()) problems.push(`${t} still checked after uncheck`);
  }
  record('US-138267.other.independentToggle',
    'Each Other Settings checkbox toggles independently',
    problems.length === 0, problems.join('; '));
}

// ---------- Permit Mode ----------

async function testPermitModeIsTwoCheckboxes(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const physical = await page.getByTestId('permit-mode-physical').isVisible().catch(() => false);
  const virtual = await page.getByTestId('permit-mode-virtual').isVisible().catch(() => false);
  const shot = await snap(page, 'US-138267.permitMode.checkboxes');
  record('US-138267.permitMode.twoCheckboxes',
    'Permit Mode is rendered as two checkboxes (Physical + Virtual)',
    physical && virtual, `physical=${physical} virtual=${virtual}`, shot);
}

async function testPermitModeDefaultBothChecked(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const p = await page.getByTestId('permit-mode-physical').isChecked();
  const v = await page.getByTestId('permit-mode-virtual').isChecked();
  record('US-138267.permitMode.defaultBoth',
    'Both Physical and Virtual are checked by default',
    p && v, `physical=${p} virtual=${v}`);
}

async function testPermitModeMinOneEnforced(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  // Uncheck one → allowed. Then try to uncheck the remaining one → should stay checked.
  await page.getByTestId('permit-mode-physical').uncheck();
  await wait(150);
  const virtualStillChecked = await page.getByTestId('permit-mode-virtual').isChecked();
  const physicalUnchecked = !(await page.getByTestId('permit-mode-physical').isChecked());
  // Attempt to also uncheck virtual (the last remaining one).
  await page.getByTestId('permit-mode-virtual').uncheck().catch(() => {});
  await wait(150);
  const virtualAfter = await page.getByTestId('permit-mode-virtual').isChecked();
  const shot = await snap(page, 'US-138267.permitMode.minOne');
  record('US-138267.permitMode.minOneRule',
    'At least one Permit Mode must remain selected (cannot un-check both)',
    virtualStillChecked && physicalUnchecked && virtualAfter,
    `afterUncheckPhysical: virtual=${virtualStillChecked} physical=${physicalUnchecked}; afterUncheckVirtualToo: virtual=${virtualAfter}`, shot);
}

// ---------- Zone Related ----------

async function testZoneRelatedRadiosPresent(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const zonal = await page.getByTestId('zone-related-zonal').isVisible();
  const nonZonal = await page.getByTestId('zone-related-non-zonal').isVisible();
  record('US-138267.zoneRelated.radiosPresent',
    'Zone Related exposes Zonal and Non-Zonal radios',
    zonal && nonZonal, `zonal=${zonal} nonZonal=${nonZonal}`);
}

async function testZoneRelatedDefaultZonalWithMultiSelect(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const zonalChecked = await page.getByTestId('zone-related-zonal').isChecked();
  const dropdown = await page.getByTestId('zone-multi-select').isVisible().catch(() => false);
  const shot = await snap(page, 'US-138267.zoneRelated.defaultZonal');
  record('US-138267.zoneRelated.defaultZonal',
    'Default is Zonal and the multi-select is visible',
    zonalChecked && dropdown, `zonal=${zonalChecked} dropdown=${dropdown}`, shot);
}

async function testZoneRelatedNonZonalHidesDropdown(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await page.getByTestId('zone-related-non-zonal').check();
  await wait(200);
  const dropdown = await page.getByTestId('zone-multi-select').isVisible().catch(() => false);
  const shot = await snap(page, 'US-138267.zoneRelated.nonZonalHidden');
  record('US-138267.zoneRelated.nonZonalHidesDropdown',
    'Selecting Non-Zonal hides the zone multi-select',
    dropdown === false, `dropdownVisible=${dropdown}`, shot);
}

async function testZonalEmptyBlocksPublish(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  // Ensure zonal + empty
  await page.getByTestId('zone-related-zonal').check();
  await wait(120);
  const publish = page.getByTestId('publish-button');
  await publish.click();
  await wait(600);
  const body = (await page.locator('body').textContent()).toLowerCase();
  const blocked = /please select at least one zone/.test(body);
  const shot = await snap(page, 'US-138267.zonal.publishBlocked');
  record('US-138267.zonal.publishBlockedWithMessage',
    'Publish is blocked with "Please select at least one zone" when zonal + no zones',
    blocked, `bodyMentionsMessage=${blocked}`, shot);
}

async function testZonalEmptyAllowsDraft(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await page.getByTestId('zone-related-zonal').check();
  await wait(120);
  const draft = page.getByTestId('save-draft-button');
  await draft.click();
  await wait(500);
  const body = (await page.locator('body').textContent()).toLowerCase();
  const savedOk = /draft saved/.test(body);
  record('US-138267.zonal.draftAllowedWithNoZones',
    'Save Draft is allowed when zonal + no zones selected',
    savedOk, `draftToast=${savedOk}`);
}

async function testZoneSelectionClearsError(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await page.getByTestId('zone-related-zonal').check();
  await wait(120);
  // Trigger the error by attempting publish first.
  await page.getByTestId('publish-button').click();
  await wait(400);
  const errBefore = await page.getByTestId('zone-required-error').isVisible().catch(() => false);
  // Close the "Please fix..." publish-errors dialog before interacting with the form.
  const okBtn = page.getByRole('button', { name: /^OK$/ });
  if (await okBtn.isVisible().catch(() => false)) {
    await okBtn.click();
    await wait(300);
  }
  // Open the multi-select and pick the first zone option.
  await page.getByTestId('zone-multi-select').click();
  await wait(300);
  const firstOpt = page.locator('[data-testid^="zone-opt-"]').first();
  await firstOpt.click();
  await page.keyboard.press('Escape');
  await wait(300);
  const errAfter = await page.getByTestId('zone-required-error').isVisible().catch(() => false);
  const shot = await snap(page, 'US-138267.zonal.selectionClears');
  record('US-138267.zonal.selectionClearsError',
    'Selecting one or more zones clears the required error',
    errBefore && !errAfter, `errorBefore=${errBefore} errorAfter=${errAfter}`, shot);
}

// ---------- Persistence ----------

async function testPersistenceAcrossReload(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  // Toggle: Other Settings — check 2, leave 3 unchecked
  await page.getByTestId('os-back-office').check();
  await page.getByTestId('os-experian').check();
  // Permit Mode: uncheck physical (virtual only)
  await page.getByTestId('permit-mode-physical').uncheck();
  // Zone Related: Non-Zonal
  await page.getByTestId('zone-related-non-zonal').check();
  await wait(300);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(500);
  await openGeneralSettings(page);
  const backOffice = await page.getByTestId('os-back-office').isChecked();
  const vat = await page.getByTestId('os-vat').isChecked();
  const experian = await page.getByTestId('os-experian').isChecked();
  const physical = await page.getByTestId('permit-mode-physical').isChecked();
  const virtual = await page.getByTestId('permit-mode-virtual').isChecked();
  const nonZonal = await page.getByTestId('zone-related-non-zonal').isChecked();
  const shot = await snap(page, 'US-138267.persistence');
  const ok = backOffice && !vat && experian && !physical && virtual && nonZonal;
  record('US-138267.persistence.acrossReload',
    'All fields (Other Settings, Permit Mode, Zone Related) persist across reload',
    ok, `backOffice=${backOffice} vat=${vat} experian=${experian} physical=${physical} virtual=${virtual} nonZonal=${nonZonal}`, shot);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['other heading',              testOtherSettingsHeadingPresent],
    ['other five checkboxes',      testOtherSettingsAllFiveCheckboxesExist],
    ['other excludes legacy',      testOtherSettingsExcludesBusinessAddressAndComment],
    ['other default unchecked',    testOtherSettingsDefaultUnchecked],
    ['other toggles independent',  testOtherSettingsToggleIndependently],
    ['permit mode two checkboxes', testPermitModeIsTwoCheckboxes],
    ['permit mode default both',   testPermitModeDefaultBothChecked],
    ['permit mode min-1 rule',     testPermitModeMinOneEnforced],
    ['zone related radios',        testZoneRelatedRadiosPresent],
    ['zone related default zonal', testZoneRelatedDefaultZonalWithMultiSelect],
    ['zone related non-zonal',     testZoneRelatedNonZonalHidesDropdown],
    ['zonal empty blocks publish', testZonalEmptyBlocksPublish],
    ['zonal empty allows draft',   testZonalEmptyAllowsDraft],
    ['zone selection clears err',  testZoneSelectionClearsError],
    ['persistence across reload',  testPersistenceAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-138267.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-138267 Builder Set of check boxes (Other Settings + Zone Related + Permit Mode)',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us138267-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-138267 Report</title>
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
<h1>US-138267 — Builder Set of check boxes (Other Settings + Zone Related + Permit Mode)</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us138267-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us138267-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
