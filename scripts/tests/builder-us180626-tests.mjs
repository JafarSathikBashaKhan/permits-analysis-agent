/**
 * US-180626 — Permission set up | Zone mapping CHANGES
 *
 * ACs:
 *   1. General Settings — "Permit related to" / "Zone Related" field REMOVED.
 *   2. General Settings — "Change Zone Limit" field is SHOWN when the group is
 *      Zonal and HIDDEN when the group is Non-Zonal.
 *   3. Zone Mapping — the zone dropdown lists ALL zones created against the
 *      contract (not filtered by any per-permission zone list).
 *   4. Zone Mapping > Edit Pricing button:
 *      - Present per zone set when pricing is configured.
 *      - When more than one pricing scheme exists, a scheme dropdown appears
 *        beside the Edit Pricing button.
 *      - User selects a scheme and clicks Edit Pricing to proceed.
 *
 * Run: node scripts/tests/builder-us180626-tests.mjs
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
    const groups = [
      mk('City Centre', 'Zonal'),
      mk('Visitor Books', 'Zonal'),
      mk('Business', 'Non-Zonal'),
      mk('Disabled', 'Zonal'),
      mk('Contractor', 'Zonal'),
      mk('Market', 'Zonal'),
    ];
    localStorage.setItem('prototype:builder:groups:rows', JSON.stringify(groups));
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

async function openDraftByGroup(page, groupName) {
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  const rows = await page.evaluate(() => {
    const raw = localStorage.getItem('prototype:builder:list:rows');
    return raw ? JSON.parse(raw) : [];
  });
  const drafts = rows.filter((r) => (r.status || '').toLowerCase() === 'draft');
  let pick = drafts.find((r) => r.group === groupName);
  if (!pick) pick = drafts.find((r) => r.group !== 'Business') || drafts[0];
  if (!pick) throw new Error('no draft row');
  await page.getByTestId(`row-name-${pick.id}`).click();
  await wait(500);
  return pick;
}

async function openSubnav(page, key) {
  await page.getByTestId(`subnav-${key}`).click();
  await wait(400);
}

async function pickZonesInSet(page, setIndex, howMany) {
  await page.getByTestId(`zone-set-select-${setIndex}`).click();
  await wait(300);
  const opts = await page.locator(`[data-testid^="zone-set-opt-${setIndex}-"]`).all();
  let picked = 0;
  for (const o of opts) {
    if (picked >= howMany) break;
    const disabled = await o.getAttribute('aria-disabled');
    if (disabled === 'true') continue;
    await o.click();
    await wait(80);
    picked++;
  }
  await page.keyboard.press('Escape');
  await wait(300);
  return picked;
}

// ---------- Tests ----------

async function testZoneRelatedFieldRemoved(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'general-settings');
  const zonalRadio = await page.getByTestId('zone-related-zonal').isVisible().catch(() => false);
  const nonZonalRadio = await page.getByTestId('zone-related-non-zonal').isVisible().catch(() => false);
  const multi = await page.getByTestId('zone-multi-select').isVisible().catch(() => false);
  const body = await page.locator('body').textContent();
  const hasLabel = /Permit related to|Zone Related/.test(body);
  const shot = await snap(page, 'US-180626.zoneRelatedRemoved');
  record('US-180626.gs.zoneRelatedFieldRemoved',
    '"Permit related to" / "Zone Related" field is removed from General Settings',
    !zonalRadio && !nonZonalRadio && !multi && !hasLabel,
    `zonalRadio=${zonalRadio} nonZonalRadio=${nonZonalRadio} multi=${multi} label=${hasLabel}`, shot);
}

async function testChangeZoneLimitShownForZonal(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'general-settings');
  const visible = await page.getByTestId('change-zone-limit-input').isVisible().catch(() => false);
  const shot = await snap(page, 'US-180626.czl.zonal');
  record('US-180626.gs.changeZoneLimitVisibleWhenZonal',
    '"Change Zone Limit" field is shown when the group is Zonal',
    visible, `visible=${visible}`, shot);
}

async function testChangeZoneLimitHiddenForNonZonal(page) {
  await openDraftByGroup(page, 'Business');
  await openSubnav(page, 'general-settings');
  const visible = await page.getByTestId('change-zone-limit-input').isVisible().catch(() => false);
  const shot = await snap(page, 'US-180626.czl.nonzonal');
  record('US-180626.gs.changeZoneLimitHiddenWhenNonZonal',
    '"Change Zone Limit" field is hidden when the group is Non-Zonal',
    !visible, `visible=${visible}`, shot);
}

async function testChangeZoneLimitDigitsOnly(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'general-settings');
  const input = page.getByTestId('change-zone-limit-input');
  await input.click();
  await input.press('Control+A');
  await input.press('Delete');
  await input.pressSequentially('ab12cd3', { delay: 20 });
  await wait(150);
  const v = await input.inputValue();
  record('US-180626.gs.changeZoneLimitDigitsOnly',
    '"Change Zone Limit" accepts digits only',
    v === '123', `value="${v}"`);
}

async function testChangeZoneLimitPersists(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'general-settings');
  const input = page.getByTestId('change-zone-limit-input');
  await input.click(); await input.press('Control+A'); await input.press('Delete');
  await input.pressSequentially('7', { delay: 20 });
  await wait(300);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openSubnav(page, 'general-settings');
  const v = await page.getByTestId('change-zone-limit-input').inputValue();
  record('US-180626.gs.changeZoneLimitPersists',
    '"Change Zone Limit" value persists across reload',
    v === '7', `value="${v}"`);
}

async function testZoneMappingDropdownAllContractZones(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await wait(200);
  await page.getByTestId('zone-set-select-1').click();
  await wait(300);
  const opts = await page.locator('[data-testid^="zone-set-opt-1-"]').all();
  const shot = await snap(page, 'US-180626.zoneMapping.allContractZones');
  await page.keyboard.press('Escape');
  record('US-180626.zm.dropdownListsAllContractZones',
    'Zone Mapping dropdown lists ALL contract zones (5 seeded in mock)',
    opts.length === 5, `optionCount=${opts.length}`, shot);
}

async function testEditPricingButtonAppearsWhenConfigured(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  await page.getByTestId('zone-set-add-scheme-1').click();
  await wait(200);
  const editVisible = await page.getByTestId('zone-set-edit-pricing-1').isVisible().catch(() => false);
  const enabled = editVisible && !(await page.getByTestId('zone-set-edit-pricing-1').isDisabled());
  const shot = await snap(page, 'US-180626.editPricing.single');
  record('US-180626.zm.editPricingButtonAppears',
    'Edit Pricing button appears and is enabled once pricing is configured',
    editVisible && enabled, `visible=${editVisible} enabled=${enabled}`, shot);
}

async function testEditPricingSchemeDropdownWhenMultiple(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  // Add 2 schemes so a dropdown appears.
  await page.getByTestId('zone-set-add-scheme-1').click();
  await wait(150);
  await page.getByTestId('zone-set-add-scheme-1').click();
  await wait(200);
  const dropdownVisible = await page.getByTestId('zone-set-scheme-select-1').isVisible().catch(() => false);
  const shot = await snap(page, 'US-180626.editPricing.multiSchemes');
  record('US-180626.zm.schemeDropdownWhenMultiple',
    'Pricing scheme dropdown appears beside Edit Pricing when >1 scheme exists',
    dropdownVisible, `dropdownVisible=${dropdownVisible}`, shot);
}

async function testEditPricingSchemeSelectionDrivesButton(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  await page.getByTestId('zone-set-add-scheme-1').click();
  await wait(120);
  await page.getByTestId('zone-set-add-scheme-1').click();
  await wait(200);
  // Open scheme dropdown and pick "Scheme 2".
  await page.getByTestId('zone-set-scheme-select-1').click();
  await wait(300);
  await page.getByTestId('zone-set-scheme-opt-1-Scheme-2').click();
  await wait(300);
  const btnText = (await page.getByTestId('zone-set-edit-pricing-1').textContent()).trim();
  const shot = await snap(page, 'US-180626.editPricing.selectionReflected');
  record('US-180626.zm.schemeSelectionReflectedInButton',
    'Selecting a scheme is reflected in the Edit Pricing button label',
    /Scheme 2/.test(btnText), `btnText="${btnText}"`, shot);
}

async function testEditPricingClickInvokes(page) {
  await openDraftByGroup(page, 'City Centre');
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  await page.getByTestId('zone-set-add-scheme-1').click();
  await wait(200);
  await page.getByTestId('zone-set-edit-pricing-1').click();
  await wait(400);
  const body = (await page.locator('body').textContent()).toLowerCase();
  const opened = /opening pricing for standard on zone set 1/.test(body);
  const shot = await snap(page, 'US-180626.editPricing.invoked');
  record('US-180626.zm.editPricingClickInvokes',
    'Clicking Edit Pricing surfaces confirmation for the currently-selected scheme',
    opened, `bodyContainsToast=${opened}`, shot);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['zone related removed',        testZoneRelatedFieldRemoved],
    ['CZL visible zonal',           testChangeZoneLimitShownForZonal],
    ['CZL hidden non-zonal',        testChangeZoneLimitHiddenForNonZonal],
    ['CZL digits only',             testChangeZoneLimitDigitsOnly],
    ['CZL persists',                testChangeZoneLimitPersists],
    ['ZM lists all contract zones', testZoneMappingDropdownAllContractZones],
    ['edit pricing appears',        testEditPricingButtonAppearsWhenConfigured],
    ['scheme dropdown multi',       testEditPricingSchemeDropdownWhenMultiple],
    ['scheme selection reflected',  testEditPricingSchemeSelectionDrivesButton],
    ['edit pricing invokes',        testEditPricingClickInvokes],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-180626.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-180626 Builder Zone Mapping Changes',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us180626-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-180626 Report</title>
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
<h1>US-180626 — Builder Zone Mapping Changes</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us180626-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us180626-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
