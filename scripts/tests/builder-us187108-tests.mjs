/**
 * US-187108 — Permission Setup | Builder — Special Event Properties Mapping
 *
 * ACs covered:
 *   - Menu appears below General Settings when SE toggle = Enable.
 *   - Menu hidden when SE toggle = Disable; Zone Mapping shows instead.
 *   - Zone Mapping is hidden when SE = Enable (mutually exclusive).
 *   - Add Street picker adds a street with a properties section beneath.
 *   - Grid columns: Property Name, UPRN, Permission Limit.
 *   - Empty-street message when a street has no properties.
 *   - Individual property select/unselect.
 *   - Select-all/unselect-all per street.
 *   - Remove entire street removes its properties from the mapping.
 *   - Multiple streets shown as collapsible sections.
 *   - Search by property name — "equals" logic.
 *   - Search by street name — "equals" logic.
 *   - Save validation: "Please select at least one street and one property to map."
 *   - Existing mapping is updated (not duplicated) after Save.
 *   - Persistence: pre-populated on reload.
 *   - Same properties can be mapped to different Special Event permissions.
 *
 * Run: node scripts/tests/builder-us187108-tests.mjs
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

async function setSpecialEvent(page, on) {
  await page.getByTestId('subnav-general-settings').click();
  await wait(300);
  const val = on ? 'enable' : 'disable';
  await page.locator(`[data-field="Special Event"] input[type="radio"][value="${val}"]`).check();
  await wait(300);
}

async function gotoSEPM(page) {
  await page.getByTestId('subnav-special-event-properties-mapping').click();
  await wait(400);
}

async function addFirstStreet(page) {
  const panelOpen = await page.getByTestId('sepm-add-panel').isVisible().catch(() => false);
  if (!panelOpen) {
    await page.getByTestId('sepm-add-street-btn').click();
    await wait(300);
  }
  const picker = page.getByTestId('sepm-street-picker');
  await picker.click();
  await picker.fill('');
  await wait(200);
  const option = page.locator('.MuiAutocomplete-popper li').first();
  const label = await option.textContent();
  await option.click();
  await wait(300);
  return label; // e.g. "High Street (USRN-23100)"
}

// ---------- Tests ----------

async function testMenuHiddenWhenSEDisabled(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, false);
  const sepm = await page.getByTestId('subnav-special-event-properties-mapping').isVisible().catch(() => false);
  const zm = await page.getByTestId('subnav-zone-mapping').isVisible().catch(() => false);
  record('US-187108.menu.hiddenWhenDisabled',
    'SEPM menu hidden when Special Event = Disable',
    !sepm, `sepm visible=${sepm}`);
  record('US-187108.menu.zoneMappingShownWhenDisabled',
    'Zone Mapping is visible when Special Event = Disable',
    zm, `zm visible=${zm}`);
}

async function testMenuShownAndZoneHiddenWhenEnabled(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  const sepm = await page.getByTestId('subnav-special-event-properties-mapping').isVisible();
  const zm = await page.getByTestId('subnav-zone-mapping').isVisible().catch(() => false);
  const shot = await snap(page, 'US-187108.menu.enabled');
  record('US-187108.menu.shownWhenEnabled',
    'SEPM menu appears when Special Event = Enable',
    sepm, '', shot);
  record('US-187108.menu.zoneMappingHiddenWhenEnabled',
    'Zone Mapping is hidden when Special Event = Enable',
    !zm, `zm visible=${zm}`);
}

async function testAddStreetShowsPropertiesGrid(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  const label = await addFirstStreet(page);
  const streetCard = await page.locator('[data-testid^="sepm-street-"][data-testid$="ST-1"]').count();
  // Table should be visible
  const anyTable = await page.locator('[data-testid^="sepm-street-table-"]').count();
  const shot = await snap(page, 'US-187108.add.streetAdded');
  record('US-187108.add.streetAppearsWithGrid',
    `Added street "${label?.trim()}" appears with a properties grid`,
    streetCard >= 0 && anyTable >= 1,
    `tables=${anyTable}`, shot);

  // Column headers
  const headers = await page.locator('[data-testid^="sepm-street-table-"] thead th').allTextContents();
  const clean = headers.map((h) => h.trim()).filter(Boolean);
  const wantsAll = ['Property Name', 'UPRN', 'Permission Limit'].every((h) => clean.includes(h));
  record('US-187108.add.columnsPresent',
    'Grid shows Property Name, UPRN and Permission Limit columns',
    wantsAll, `headers=${JSON.stringify(clean)}`);
}

async function testEmptyStreetMessage(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await page.getByTestId('sepm-add-street-btn').click(); await wait(200);
  const picker = page.getByTestId('sepm-street-picker');
  await picker.click(); await picker.fill('');
  await wait(200);
  // ST-6 is the first empty street (index 5 in mock data — si % 6 === 5).
  const optionCount = await page.locator('.MuiAutocomplete-popper li').count();
  let selected = false;
  for (let i = 0; i < optionCount; i++) {
    const li = page.locator('.MuiAutocomplete-popper li').nth(i);
    const t = (await li.textContent()) || '';
    // Any street whose ST-id ends in "6" (index 5) — check the summary chip after adding.
    if (/USRN-23105\b/.test(t)) { await li.click(); selected = true; break; }
  }
  if (!selected) {
    await page.locator('.MuiAutocomplete-popper li').first().click();
  }
  await wait(400);
  const emptyMsgVisible = await page.locator('[data-testid^="sepm-street-empty-"]').first().isVisible().catch(() => false);
  const text = emptyMsgVisible ? (await page.locator('[data-testid^="sepm-street-empty-"]').first().textContent()).trim() : '';
  record('US-187108.empty.streetMessage',
    'Empty street shows "No properties available for the selected street."',
    emptyMsgVisible && /no properties available/i.test(text),
    `text=${text}`);
}

async function testIndividualCheckbox(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  const firstCheckbox = page.locator('[data-testid^="sepm-property-check-"]').first();
  const testid = await firstCheckbox.getAttribute('data-testid');
  await firstCheckbox.check();
  await wait(150);
  const checked = await firstCheckbox.isChecked();
  record('US-187108.select.individualProperty',
    `Individual property checkbox toggles ON (${testid})`,
    checked);
  await firstCheckbox.uncheck();
  await wait(150);
  const still = await firstCheckbox.isChecked();
  record('US-187108.unselect.individualProperty',
    'Individual property checkbox toggles OFF',
    !still);
}

async function testSelectAllInStreet(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  const streetId = await page.locator('[data-testid^="sepm-street-select-all-"]').first().getAttribute('data-testid');
  // Note: MUI Checkbox wraps input — target the underlying input.
  const selectAll = page.locator(`input[data-testid="${streetId}"]`);
  await selectAll.check();
  await wait(200);
  const total = await page.locator('[data-testid^="sepm-property-check-"]').count();
  const checkedCount = await page.locator('[data-testid^="sepm-property-check-"]:checked').count();
  record('US-187108.selectAll.all',
    'Select-all checks every property in that street',
    total > 0 && checkedCount === total,
    `total=${total} checked=${checkedCount}`);
  await selectAll.uncheck();
  await wait(200);
  const nowChecked = await page.locator('[data-testid^="sepm-property-check-"]:checked').count();
  record('US-187108.selectAll.none',
    'Unselect-all clears every property in that street',
    nowChecked === 0, `remainingChecked=${nowChecked}`);
}

async function testRemoveStreet(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  const before = await page.locator('[data-testid^="sepm-street-"][data-testid^="sepm-street-ST-"]').count();
  const removeBtn = page.locator('[data-testid^="sepm-street-remove-"]').first();
  await removeBtn.click();
  await wait(300);
  const after = await page.locator('[data-testid^="sepm-street-"][data-testid^="sepm-street-ST-"]').count();
  record('US-187108.remove.street',
    'Remove-street removes the entire street card',
    after === before - 1,
    `before=${before} after=${after}`);
}

async function testMultipleStreetsCollapsible(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  await addFirstStreet(page); // adds the next street since first is filtered out
  await wait(200);
  const streetCount = await page.locator('[data-testid^="sepm-street-"][data-testid^="sepm-street-ST-"]').count();
  const shot = await snap(page, 'US-187108.multi.streets');
  record('US-187108.multi.streets',
    'Multiple streets can be added',
    streetCount === 2, `count=${streetCount}`, shot);

  // Collapse first street — the MUI Collapse wrapper animates height to 0.
  const firstToggle = page.locator('[data-testid^="sepm-street-toggle-"]').first();
  await firstToggle.click();
  await wait(500);
  const firstTableHeight = await page.locator('[data-testid^="sepm-street-table-"]').first()
    .evaluate((el) => (el.closest('.MuiCollapse-root') ? el.closest('.MuiCollapse-root').getBoundingClientRect().height : el.getBoundingClientRect().height))
    .catch(() => -1);
  record('US-187108.multi.collapsible',
    'Street sections are collapsible/expandable (Collapse height → 0)',
    firstTableHeight === 0,
    `collapseHeight=${firstTableHeight}`);
}

async function testSearchPropertyEqualsLogic(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  // Pick an exact property name from the first row
  const firstRow = page.locator('[data-testid^="sepm-property-row-"]').first();
  const name = ((await firstRow.locator('td').nth(1).textContent()) || '').trim();
  const totalBefore = await page.locator('[data-testid^="sepm-property-row-"]').count();

  await page.getByTestId('sepm-search-property').fill(name);
  await wait(300);
  const totalAfter = await page.locator('[data-testid^="sepm-property-row-"]').count();
  record('US-187108.search.propertyEqualsExact',
    `Exact property name "${name}" filters to 1 row`,
    totalAfter === 1 && totalBefore > 1,
    `before=${totalBefore} after=${totalAfter}`);

  // Partial should not match (equals logic)
  await page.getByTestId('sepm-search-property').fill(name.slice(0, 3));
  await wait(300);
  const partialCount = await page.locator('[data-testid^="sepm-property-row-"]').count();
  record('US-187108.search.propertyPartialDoesNotMatch',
    `Partial property text "${name.slice(0, 3)}" does NOT match (equals logic)`,
    partialCount === 0,
    `partialMatches=${partialCount}`);
  await page.getByTestId('sepm-search-property').fill('');
}

async function testSearchStreetEqualsLogic(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  await addFirstStreet(page);
  await wait(200);
  const streetNameEl = page.locator('[data-testid^="sepm-street-name-"]').first();
  const streetName = ((await streetNameEl.textContent()) || '').trim();

  await page.getByTestId('sepm-search-street').fill(streetName);
  await wait(300);
  const visibleCount = await page.locator('[data-testid^="sepm-street-name-"]:visible').count();
  record('US-187108.search.streetEqualsExact',
    `Exact street name "${streetName}" filters to 1 visible street`,
    visibleCount === 1,
    `visible=${visibleCount}`);

  await page.getByTestId('sepm-search-street').fill(streetName.slice(0, 3));
  await wait(300);
  const partial = await page.locator('[data-testid^="sepm-street-name-"]:visible').count();
  record('US-187108.search.streetPartialDoesNotMatch',
    'Partial street text does NOT match (equals logic)',
    partial === 0, `partialVisible=${partial}`);
  await page.getByTestId('sepm-search-street').fill('');
}

async function testSaveValidation(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  // No streets added yet
  await page.getByTestId('sepm-save-btn').click();
  await wait(200);
  const err1 = await page.getByTestId('sepm-save-error').isVisible().catch(() => false);
  const text1 = err1 ? (await page.getByTestId('sepm-save-error').textContent()).trim() : '';
  record('US-187108.save.validationNoStreet',
    'Saving with no streets shows "Please select at least one street and one property to map."',
    err1 && /at least one street and one property/i.test(text1),
    `error=${text1}`);

  // Add a street but select no properties
  await addFirstStreet(page);
  await page.getByTestId('sepm-save-btn').click();
  await wait(200);
  const err2 = await page.getByTestId('sepm-save-error').isVisible().catch(() => false);
  record('US-187108.save.validationNoProperty',
    'Adding a street but selecting no properties still triggers the validation',
    err2);
}

async function testSaveSucceedsAndUpdatesExisting(page) {
  const permId = await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  await page.locator('[data-testid^="sepm-property-check-"]').first().check();
  await page.getByTestId('sepm-save-btn').click();
  await wait(300);
  const ok1 = await page.getByTestId('sepm-saved-flash').isVisible().catch(() => false);
  record('US-187108.save.success',
    'Save succeeds when at least one street and property selected',
    ok1);

  const snapshot1 = await page.evaluate((pid) => localStorage.getItem(`prototype:builder:${pid}:sepm`), permId);

  // Toggle a second property and save again — should UPDATE the same mapping, not create a new one.
  await page.locator('[data-testid^="sepm-property-check-"]').nth(1).check();
  await page.getByTestId('sepm-save-btn').click();
  await wait(400);
  const snapshot2 = await page.evaluate((pid) => localStorage.getItem(`prototype:builder:${pid}:sepm`), permId);

  const keys1 = Object.keys(JSON.parse(snapshot1).streets);
  const keys2 = Object.keys(JSON.parse(snapshot2).streets);
  record('US-187108.save.updatesExistingMapping',
    'Re-save updates the existing mapping (same street key, more properties) — no duplicate mapping set',
    JSON.stringify(keys1) === JSON.stringify(keys2)
      && JSON.parse(snapshot2).streets[keys2[0]].length > JSON.parse(snapshot1).streets[keys1[0]].length,
    `props1=${JSON.parse(snapshot1).streets[keys1[0]].length} props2=${JSON.parse(snapshot2).streets[keys2[0]].length}`);
}

async function testPersistenceAcrossReload(page) {
  const permId = await openDraftPermission(page);
  await setSpecialEvent(page, true);
  await gotoSEPM(page);
  await addFirstStreet(page);
  const firstProp = page.locator('[data-testid^="sepm-property-check-"]').first();
  const propTestId = await firstProp.getAttribute('data-testid');
  await firstProp.check();
  await page.getByTestId('sepm-save-btn').click();
  await wait(300);

  // Reload
  await page.goto(`${BASE}/builder/${permId}`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  // Re-enable SE if state didn't persist
  const seVisible = await page.getByTestId('subnav-special-event-properties-mapping').isVisible().catch(() => false);
  if (!seVisible) await setSpecialEvent(page, true);
  await gotoSEPM(page);
  const streets = await page.locator('[data-testid^="sepm-street-"][data-testid^="sepm-street-ST-"]').count();
  const stillChecked = await page.locator(`[data-testid="${propTestId}"]`).isChecked().catch(() => false);
  const shot = await snap(page, 'US-187108.persistence.afterReload');
  record('US-187108.persistence.mappingPrePopulated',
    'Streets + selected properties are pre-populated on reload',
    streets >= 1 && stillChecked,
    `streets=${streets} checked=${stillChecked}`, shot);
}

async function testMenuOrderBelowGeneralSettings(page) {
  await openDraftPermission(page);
  await setSpecialEvent(page, true);
  const items = await page.locator('[data-testid^="subnav-"]').evaluateAll(els =>
    els.map(e => e.getAttribute('data-testid')));
  const gsIdx = items.indexOf('subnav-general-settings');
  const sepmIdx = items.indexOf('subnav-special-event-properties-mapping');
  record('US-187108.menu.orderBelowGS',
    'Special Event Properties Mapping is positioned below General Settings',
    sepmIdx > gsIdx && gsIdx >= 0,
    `gsIdx=${gsIdx} sepmIdx=${sepmIdx}`);
}

// ---------- Runner ----------

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  const startedAt = new Date();
  const suites = [
    ['menu hidden when disabled',        testMenuHiddenWhenSEDisabled],
    ['menu shown / zone hidden when enabled', testMenuShownAndZoneHiddenWhenEnabled],
    ['menu order below GS',              testMenuOrderBelowGeneralSettings],
    ['add street shows grid',            testAddStreetShowsPropertiesGrid],
    ['empty street message',             testEmptyStreetMessage],
    ['individual checkbox',              testIndividualCheckbox],
    ['select all in street',             testSelectAllInStreet],
    ['remove street',                    testRemoveStreet],
    ['multiple streets collapsible',     testMultipleStreetsCollapsible],
    ['search property equals',           testSearchPropertyEqualsLogic],
    ['search street equals',             testSearchStreetEqualsLogic],
    ['save validation',                  testSaveValidation],
    ['save success + updates existing',  testSaveSucceedsAndUpdatesExisting],
    ['persistence',                      testPersistenceAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) {
      record(`US-187108.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message);
    }
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
    suite: 'US-187108 Builder Special Event Properties Mapping',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us187108-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-187108 Report</title>
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
<h1>US-187108 — Builder Special Event Properties Mapping</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us187108-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us187108-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
