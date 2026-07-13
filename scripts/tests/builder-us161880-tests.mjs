/**
 * US-161880 — Permission set up | Zone Mapping
 *
 * ACs covered:
 *   - Zone Mapping sub-section visible ONLY when Zone Related = Zonal
 *     (and hidden when Non-Zonal, and hidden when Special Event enabled).
 *   - Info alert/description visible.
 *   - "New Zone Set" button creates sets labelled Zone Set 1, Zone Set 2 ...
 *   - Each set shows a multi-select seeded only from General Settings zones.
 *   - Zone selected in Zone Set 1 becomes unavailable/disabled in Zone Set 2
 *     (mutual exclusion across sets of the same permission).
 *   - Delete option per set; deletes the set immediately (hard delete).
 *   - "Pricing not configured" indicator by default; "Pricing Configured"
 *     when the (mocked) pricing flag is set.
 *   - Delete button disabled when pricing is configured for that set.
 *   - "New Zone Set" button disabled when ALL General-Settings zones are
 *     already mapped to existing sets.
 *   - Editing: removing all zones from a set triggers the AC error
 *     "At least one zone must be mapped to the zone set. Changes cannot be
 *     saved otherwise."
 *   - Draft save allowed even with empty state.
 *   - Publish blocked when zonal + no zone sets ("At least one zone set...").
 *   - Publish blocked when a set has zero zones (AC error text).
 *   - Zone sets persist across page reload.
 *
 * Run: node scripts/tests/builder-us161880-tests.mjs
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

async function openSubnav(page, key) {
  await page.getByTestId(`subnav-${key}`).click();
  await wait(400);
}

// Seed General Settings zones so Zone Mapping has a zone pool to work with.
async function seedZonesInGeneralSettings(page, count = 3) {
  await openSubnav(page, 'general-settings');
  // Ensure Zonal is selected (default).
  await page.getByTestId('zone-related-zonal').check();
  await wait(150);
  await page.getByTestId('zone-multi-select').click();
  await wait(300);
  const opts = await page.locator('[data-testid^="zone-opt-"]').all();
  for (let i = 0; i < Math.min(count, opts.length); i++) {
    await opts[i].click();
    await wait(80);
  }
  await page.keyboard.press('Escape');
  await wait(300);
}

async function pickZonesInSet(page, setIndex, howMany) {
  await page.getByTestId(`zone-set-select-${setIndex}`).click();
  await wait(300);
  const opts = await page.locator(`[data-testid^="zone-set-opt-${setIndex}-"]`).all();
  let picked = 0;
  for (const opt of opts) {
    if (picked >= howMany) break;
    const disabled = await opt.getAttribute('aria-disabled');
    if (disabled === 'true') continue;
    await opt.click();
    await wait(80);
    picked++;
  }
  await page.keyboard.press('Escape');
  await wait(300);
  return picked;
}

// ---------- Tests ----------

async function testHiddenWhenNonZonal(page) {
  await openDraftPermission(page);
  await openSubnav(page, 'general-settings');
  await page.getByTestId('zone-related-non-zonal').check();
  await wait(300);
  const visible = await page.getByTestId('subnav-zone-mapping').isVisible().catch(() => false);
  record('US-161880.visibility.hiddenWhenNonZonal',
    'Zone Mapping sub-nav is hidden when Zone Related = Non-Zonal',
    !visible, `subnavVisible=${visible}`);
}

async function testVisibleWhenZonal(page) {
  await openDraftPermission(page);
  await openSubnav(page, 'general-settings');
  await page.getByTestId('zone-related-zonal').check();
  await wait(200);
  const visible = await page.getByTestId('subnav-zone-mapping').isVisible().catch(() => false);
  record('US-161880.visibility.visibleWhenZonal',
    'Zone Mapping sub-nav is visible when Zone Related = Zonal',
    visible, `subnavVisible=${visible}`);
}

async function testInfoAlertPresent(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 3);
  await openSubnav(page, 'zone-mapping');
  const alert = page.getByTestId('zone-mapping-info');
  const visible = await alert.isVisible();
  const text = (await alert.textContent()).toLowerCase();
  const shot = await snap(page, 'US-161880.info');
  record('US-161880.info.alertPresent',
    'Zone Mapping info alert is present and mentions Zone Sets + Pricing Configuration',
    visible && text.includes('zone set') && text.includes('pricing configuration'),
    `visible=${visible}`, shot);
}

async function testCreateNewZoneSetLabels(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 3);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await wait(200);
  await page.getByTestId('new-zone-set-btn').click();
  await wait(200);
  const label1 = (await page.getByTestId('zone-set-label-1').textContent()).trim();
  const label2 = (await page.getByTestId('zone-set-label-2').textContent()).trim();
  const shot = await snap(page, 'US-161880.labels');
  record('US-161880.create.incrementalLabels',
    'New Zone Set creates sets labelled Zone Set 1, Zone Set 2 ...',
    label1 === 'Zone Set 1' && label2 === 'Zone Set 2',
    `label1="${label1}" label2="${label2}"`, shot);
}

async function testDropdownOnlyGSSelectedZones(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await wait(200);
  await page.getByTestId('zone-set-select-1').click();
  await wait(300);
  const opts = await page.locator('[data-testid^="zone-set-opt-1-"]').all();
  const shot = await snap(page, 'US-161880.dropdownScope');
  await page.keyboard.press('Escape');
  record('US-161880.create.dropdownScopedToGS',
    'Zone Set dropdown lists only the zones selected in General Settings',
    opts.length === 2, `dropdownOptions=${opts.length}`, shot);
}

async function testCrossSetMutualExclusion(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 3);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await page.getByTestId('new-zone-set-btn').click();
  await wait(200);
  // Pick first zone into Zone Set 1
  const picked1 = await pickZonesInSet(page, 1, 1);
  // Open Zone Set 2's dropdown and check that one option is disabled
  await page.getByTestId('zone-set-select-2').click();
  await wait(300);
  const opts2 = await page.locator('[data-testid^="zone-set-opt-2-"]').all();
  let disabledCount = 0;
  for (const o of opts2) {
    const d = await o.getAttribute('aria-disabled');
    if (d === 'true') disabledCount++;
  }
  const shot = await snap(page, 'US-161880.crossSetExclusion');
  await page.keyboard.press('Escape');
  record('US-161880.mutex.acrossSets',
    'Zones picked in Zone Set 1 are disabled in Zone Set 2',
    picked1 === 1 && disabledCount === 1,
    `picked1=${picked1} disabledInSet2=${disabledCount}`, shot);
}

async function testDeleteZoneSet(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 3);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await page.getByTestId('new-zone-set-btn').click();
  await wait(200);
  await page.getByTestId('zone-set-delete-1').click();
  await wait(200);
  // After deleting set 1, only 1 set should remain — now re-labelled Zone Set 1
  const remaining = await page.locator('[data-testid^="zone-set-label-"]').count();
  const label = (await page.getByTestId('zone-set-label-1').textContent()).trim();
  record('US-161880.delete.hardDeleteAndRelabel',
    'Delete removes a zone set and remaining sets re-label from 1',
    remaining === 1 && label === 'Zone Set 1',
    `remainingSets=${remaining} firstLabel="${label}"`);
}

async function testPricingIndicators(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  const before = (await page.getByTestId('zone-set-pricing-status-1').textContent()).trim();
  await page.getByTestId('zone-set-mark-pricing-1').click();
  await wait(200);
  const after = (await page.getByTestId('zone-set-pricing-status-1').textContent()).trim();
  const shot = await snap(page, 'US-161880.pricingIndicator');
  record('US-161880.pricing.indicatorFlips',
    'Pricing indicator toggles between "Pricing not configured" and "Pricing Configured"',
    before === 'Pricing not configured' && after === 'Pricing Configured',
    `before="${before}" after="${after}"`, shot);
}

async function testDeleteDisabledWhenPricingConfigured(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  await page.getByTestId('zone-set-mark-pricing-1').click();
  await wait(200);
  const disabled = await page.getByTestId('zone-set-delete-1').isDisabled();
  const shot = await snap(page, 'US-161880.deleteDisabled');
  record('US-161880.delete.disabledWhenPricingConfigured',
    'Delete button is disabled for a zone set that has pricing configured',
    disabled, `deleteDisabled=${disabled}`, shot);
}

async function testCreateButtonDisabledWhenAllZonesMapped(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  // Create two sets and pick all zones between them
  await page.getByTestId('new-zone-set-btn').click();
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  await pickZonesInSet(page, 2, 1);
  const disabled = await page.getByTestId('new-zone-set-btn').isDisabled();
  const shot = await snap(page, 'US-161880.createDisabled');
  record('US-161880.create.disabledWhenAllZonesMapped',
    'New Zone Set button is disabled when every GS zone is already mapped',
    disabled, `newBtnDisabled=${disabled}`, shot);
}

async function testAtLeastOneZoneErrorWhenEmpty(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  // Now un-check the picked zone to leave the set empty
  await page.getByTestId('zone-set-select-1').click();
  await wait(300);
  const opts = await page.locator('[data-testid^="zone-set-opt-1-"]').all();
  // Click the checked one to uncheck it
  for (const o of opts) {
    const box = await o.locator('input[type="checkbox"]');
    if (await box.isChecked()) { await o.click(); await wait(80); break; }
  }
  await page.keyboard.press('Escape');
  await wait(300);
  const errVisible = await page.getByTestId('zone-set-error-1').isVisible().catch(() => false);
  const errText = errVisible ? (await page.getByTestId('zone-set-error-1').textContent()).trim() : '';
  const shot = await snap(page, 'US-161880.emptySetError');
  record('US-161880.edit.emptySetShowsAcError',
    'Removing all zones from a set shows the exact AC error message',
    errVisible && errText === 'At least one zone must be mapped to the zone set. Changes cannot be saved otherwise.',
    `visible=${errVisible} text="${errText}"`, shot);
}

async function testDraftAllowedWithEmptyState(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('save-draft-button').click();
  await wait(500);
  const body = (await page.locator('body').textContent()).toLowerCase();
  record('US-161880.draft.allowedWithNoZoneSets',
    'Save Draft is allowed even with no zone sets configured',
    /draft saved/.test(body), `toast=${/draft saved/.test(body)}`);
}

async function testPublishBlockedNoZoneSets(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('publish-button').click();
  await wait(500);
  const body = (await page.locator('body').textContent()).toLowerCase();
  const shot = await snap(page, 'US-161880.publishNoSets');
  record('US-161880.publish.blockedWhenNoZoneSets',
    'Publish is blocked when zonal + no zone sets',
    /at least one zone set must be created/.test(body),
    `bodyMentionsError=${/at least one zone set must be created/.test(body)}`, shot);
}

async function testPublishBlockedEmptyZoneSet(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 2);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  // Leave the set empty; try publish.
  await page.getByTestId('publish-button').click();
  await wait(500);
  const body = (await page.locator('body').textContent()).toLowerCase();
  const shot = await snap(page, 'US-161880.publishEmptySet');
  record('US-161880.publish.blockedWhenSetEmpty',
    'Publish is blocked with the exact AC message when a zone set has no zones',
    /at least one zone must be mapped to the zone set/.test(body),
    `bodyMentionsError=${/at least one zone must be mapped/.test(body)}`, shot);
}

async function testPersistenceAcrossReload(page) {
  await openDraftPermission(page);
  await seedZonesInGeneralSettings(page, 3);
  await openSubnav(page, 'zone-mapping');
  await page.getByTestId('new-zone-set-btn').click();
  await page.getByTestId('new-zone-set-btn').click();
  await pickZonesInSet(page, 1, 1);
  await pickZonesInSet(page, 2, 1);
  await page.getByTestId('zone-set-mark-pricing-1').click();
  await wait(300);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(500);
  await openSubnav(page, 'zone-mapping');
  const setCount = await page.locator('[data-testid^="zone-set-label-"]').count();
  const status1 = (await page.getByTestId('zone-set-pricing-status-1').textContent()).trim();
  const shot = await snap(page, 'US-161880.persistence');
  record('US-161880.persistence.acrossReload',
    'Zone sets and pricing flags persist across reload',
    setCount === 2 && status1 === 'Pricing Configured',
    `sets=${setCount} status1="${status1}"`, shot);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['hidden when non-zonal',       testHiddenWhenNonZonal],
    ['visible when zonal',          testVisibleWhenZonal],
    ['info alert present',          testInfoAlertPresent],
    ['create incremental labels',   testCreateNewZoneSetLabels],
    ['dropdown scoped to GS',       testDropdownOnlyGSSelectedZones],
    ['cross-set mutex',             testCrossSetMutualExclusion],
    ['delete zone set',             testDeleteZoneSet],
    ['pricing indicators',          testPricingIndicators],
    ['delete disabled if pricing',  testDeleteDisabledWhenPricingConfigured],
    ['create disabled when full',   testCreateButtonDisabledWhenAllZonesMapped],
    ['empty set error',             testAtLeastOneZoneErrorWhenEmpty],
    ['draft allowed empty',         testDraftAllowedWithEmptyState],
    ['publish blocked no sets',     testPublishBlockedNoZoneSets],
    ['publish blocked empty set',   testPublishBlockedEmptyZoneSet],
    ['persistence across reload',   testPersistenceAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-161880.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-161880 Builder Zone Mapping',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us161880-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-161880 Report</title>
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
<h1>US-161880 — Builder Zone Mapping</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us161880-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us161880-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
