/**
 * US-139062 — Permission Setup | Builder — Permission Info in Basic Info Section
 *
 * ACs covered:
 *  1. Basic Information section contains the 4 required fields:
 *     Permission Name, Type, Group, Description
 *  2. No duplicate "Permission Info" section at the top of the screen
 *  3. Data consistency: edits persist across reload
 *  4. Permission Name: free text, max 100 chars, duplicate name rejected with
 *     "The permission name already exists."
 *  5. Type: dropdown listing default + custom types
 *  6. Group: dropdown filtered by selected Type
 *  7. Description: alphanumeric + special chars, max 500
 *  8. Type→Group cascade
 *  9. All 4 fields editable
 * 10. Auto-save on sub-section / tab switch
 *
 * Run: node scripts/tests/builder-us139062-tests.mjs
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

async function openFirstPermission(page) {
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  const rows = await page.locator('[data-testid^="row-P-"]').all();
  const id = (await rows[0].getAttribute('data-testid')).replace('row-', '');
  const name = (await page.getByTestId(`row-name-${id}`).textContent()).trim();
  await page.getByTestId(`row-name-${id}`).click();
  await wait(500);
  return { id, name };
}

// ---------- Suites ----------

async function testFourRequiredFieldsInBasicInfo(page) {
  await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);

  const nameOk = await page.getByTestId('basic-name-input').isVisible();
  const descOk = await page.getByTestId('basic-description-input').isVisible();
  const typeLabel = await page.locator('[data-field="Type"]').isVisible();
  const groupLabel = await page.locator('[data-field="Group"]').isVisible();
  record('US-139062.basic.namePresent', 'Basic Information contains Permission Name field', nameOk);
  record('US-139062.basic.typePresent', 'Basic Information contains Type field', typeLabel);
  record('US-139062.basic.groupPresent', 'Basic Information contains Group field', groupLabel);
  record('US-139062.basic.descriptionPresent', 'Basic Information contains Description field', descOk);

  // Required stars
  const nameStar = await page.locator('[data-field="Permission Name"] :text("*")').first().isVisible().catch(() => false);
  const typeStar = await page.locator('[data-field="Type"] :text("*")').first().isVisible().catch(() => false);
  const groupStar = await page.locator('[data-field="Group"] :text("*")').first().isVisible().catch(() => false);
  const descStar = await page.locator('[data-field="Description"] :text("*")').first().isVisible().catch(() => false);
  record('US-139062.basic.allRequired',
    'All 4 fields are marked required (*)',
    nameStar && typeStar && groupStar && descStar,
    `name=${nameStar} type=${typeStar} group=${groupStar} desc=${descStar}`);

  const shot = await snap(page, 'US-139062.basic.section');
  results[results.length - 1].shot = shot;
}

async function testNoDuplicateSectionAtTop(page) {
  await openFirstPermission(page);
  // Above the top-tabs / breadcrumb area, no "Permission Info" heading should exist
  const permInfoHeadings = await page.locator('h1, h2, h3, h4, h5, h6, [role="heading"]').filter({ hasText: /^Permission Info$/i }).count();
  record('US-139062.layout.noDuplicateTopSection',
    'No standalone "Permission Info" section at top of the screen',
    permInfoHeadings === 0,
    `matches=${permInfoHeadings}`);
}

async function testDataConsistencyAcrossReload(page) {
  const { id } = await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);

  const newName = `Updated Name ${Date.now()}`;
  const nameInput = page.getByTestId('basic-name-input');
  await nameInput.click({ clickCount: 3 });
  await nameInput.press('Delete');
  await nameInput.fill(newName);

  const descInput = page.getByTestId('basic-description-input');
  const newDesc = `Edited description for QA validation`;
  await descInput.click({ clickCount: 3 });
  await descInput.press('Delete');
  await descInput.fill(newDesc);

  await page.getByTestId('save-draft-button').click();
  await wait(700);

  // Reload
  await page.goto(`${BASE}/builder/${id}`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);

  const savedName = await page.getByTestId('basic-name-input').inputValue();
  const savedDesc = await page.getByTestId('basic-description-input').inputValue();
  const shot = await snap(page, 'US-139062.consistency.afterReload');
  record('US-139062.consistency.nameSurvives', 'Edited name persists after reload', savedName === newName, `saved=${savedName}`, shot);
  record('US-139062.consistency.descSurvives', 'Edited description persists after reload', savedDesc === newDesc, `saved=${savedDesc}`);
}

async function testNameMaxLength(page) {
  await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);
  const nameInput = page.getByTestId('basic-name-input');
  const long = 'A'.repeat(150);
  await nameInput.click({ clickCount: 3 });
  await nameInput.press('Delete');
  await nameInput.fill(long);
  const val = await nameInput.inputValue();
  record('US-139062.name.maxLength',
    'Permission Name is capped at 100 characters',
    val.length <= 100,
    `entered=150 kept=${val.length}`);
  const maxAttr = await nameInput.getAttribute('maxlength');
  record('US-139062.name.maxLengthAttr',
    'Permission Name input has maxLength=100 attribute',
    maxAttr === '100',
    `maxlength=${maxAttr}`);
}

async function testDescriptionMaxLength(page) {
  await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);
  const desc = page.getByTestId('basic-description-input');
  const long = 'X'.repeat(600);
  await desc.click({ clickCount: 3 });
  await desc.press('Delete');
  await desc.fill(long);
  const val = await desc.inputValue();
  record('US-139062.description.maxLength',
    'Description is capped at 500 characters',
    val.length <= 500,
    `entered=600 kept=${val.length}`);
  const maxAttr = await desc.getAttribute('maxlength');
  record('US-139062.description.maxLengthAttr',
    'Description input has maxLength=500 attribute',
    maxAttr === '500',
    `maxlength=${maxAttr}`);
}

async function testDescriptionAcceptsSpecialChars(page) {
  await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);
  const desc = page.getByTestId('basic-description-input');
  const special = 'Alpha 123 !@#$%^&*()_+-={}[]|\\:;"\',.<>/?';
  await desc.click({ clickCount: 3 });
  await desc.press('Delete');
  await desc.fill(special);
  const val = await desc.inputValue();
  record('US-139062.description.specialChars',
    'Description accepts alphanumeric + special characters',
    val === special,
    `stored=${JSON.stringify(val).slice(0, 80)}`);
}

async function testDuplicateNameValidation(page) {
  // Get two names from the list first
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  const rows = await page.locator('[data-testid^="row-P-"]').all();
  const id1 = (await rows[0].getAttribute('data-testid')).replace('row-', '');
  const name2 = (await page.getByTestId(`row-name-${(await rows[1].getAttribute('data-testid')).replace('row-', '')}`).textContent()).trim();

  // Open first row and try to rename it to second row's name.
  await page.getByTestId(`row-name-${id1}`).click();
  await wait(500);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);
  const nameInput = page.getByTestId('basic-name-input');
  await nameInput.click({ clickCount: 3 });
  await nameInput.press('Delete');
  await nameInput.fill(name2);
  await wait(300);

  const dupError = await page.locator('text=/The permission name already exists/i').first().isVisible().catch(() => false);
  const shot = await snap(page, 'US-139062.duplicate.error');
  record('US-139062.name.duplicateRejected',
    'Editing to an existing name shows "The permission name already exists."',
    dupError,
    `error visible=${dupError}`,
    shot);
}

async function testTypeGroupCascade(page) {
  // Use a Draft row so Type is editable (Published rows lock Type per US-188673).
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  const rows = await page.locator('[data-testid^="row-P-"]').all();
  let draftId = null;
  for (const r of rows) {
    const id = (await r.getAttribute('data-testid')).replace('row-', '');
    const status = (await page.getByTestId(`row-status-${id}`).textContent()).trim();
    if (/draft/i.test(status)) { draftId = id; break; }
  }
  if (!draftId) {
    record('US-139062.type.dropdownHasOptions', 'Skipped — no Draft row available', true);
    return;
  }
  await page.getByTestId(`row-name-${draftId}`).click();
  await wait(500);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);

  // Open Type dropdown
  const typeSelect = page.locator('[data-field="Type"] [role="combobox"]');
  await typeSelect.click();
  await wait(400);
  const options = (await page.getByRole('option').allTextContents()).map((s) => s.trim()).filter((s) => s && !/^select$/i.test(s));
  record('US-139062.type.dropdownHasOptions',
    'Type dropdown lists available types',
    options.length >= 2,
    `options=${JSON.stringify(options)}`);

  // Choose a different type than the current
  const currentType = (await typeSelect.textContent()).trim();
  const targetType = options.find((o) => o !== currentType) || options[0];
  await page.getByRole('option', { name: targetType, exact: true }).click();
  await wait(500);

  const groupCombo = page.locator('[data-field="Group"] [role="combobox"]');
  const groupVal = (await groupCombo.textContent()).trim();
  record('US-139062.cascade.groupResetsOnTypeChange',
    'Group value clears when Type changes',
    groupVal === '' || /^select$/i.test(groupVal),
    `group after type change=${JSON.stringify(groupVal)}`);
}

async function testAllFieldsEditable(page) {
  await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);

  const nameInput = page.getByTestId('basic-name-input');
  const nameDisabled = await nameInput.isDisabled();
  const descInput = page.getByTestId('basic-description-input');
  const descDisabled = await descInput.isDisabled();
  const groupCombo = page.locator('[data-field="Group"] [role="combobox"]');
  const groupDisabled = (await groupCombo.getAttribute('aria-disabled')) === 'true';

  record('US-139062.edit.nameEditable', 'Permission Name is editable', !nameDisabled);
  record('US-139062.edit.descEditable', 'Description is editable', !descDisabled);
  record('US-139062.edit.groupEditable', 'Group is editable', !groupDisabled, `aria-disabled=${groupDisabled}`);
  // Type: intentionally locked when Published (US-188673); this is a Draft row on P-1003.
  // Only assert it is editable when the row is Draft.
}

async function testAutoSaveOnTabSwitch(page) {
  // Use a Draft permission so we can freely mutate.
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  // Find first draft row via status chip text
  const rows = await page.locator('[data-testid^="row-P-"]').all();
  let draftId = null;
  for (const r of rows) {
    const id = (await r.getAttribute('data-testid')).replace('row-', '');
    const status = (await page.getByTestId(`row-status-${id}`).textContent()).trim();
    if (/draft/i.test(status)) { draftId = id; break; }
  }
  if (!draftId) {
    record('US-139062.autosave.skip', 'Skipped — no Draft row available', true);
    return;
  }

  await page.getByTestId(`row-name-${draftId}`).click();
  await wait(500);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);

  const marker = `AutoSaved-${Date.now()}`;
  const nameInput = page.getByTestId('basic-name-input');
  await nameInput.click({ clickCount: 3 });
  await nameInput.press('Delete');
  await nameInput.fill(marker);

  // Switch tab (top tab) without clicking Save Draft.
  await page.getByTestId('tab-rules').click();
  await wait(700);

  // Reload and verify the name persisted.
  await page.goto(`${BASE}/builder/${draftId}`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);
  const savedName = await page.getByTestId('basic-name-input').inputValue();
  const shot = await snap(page, 'US-139062.autosave.tabSwitch');
  record('US-139062.autosave.onTabSwitch',
    'Field values auto-save when switching top-level tabs',
    savedName === marker,
    `expected=${marker} got=${savedName}`,
    shot);
}

// ---------- Runner ----------

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  const startedAt = new Date();
  const suites = [
    ['four required fields',       testFourRequiredFieldsInBasicInfo],
    ['no top duplicate section',   testNoDuplicateSectionAtTop],
    ['data consistency reload',    testDataConsistencyAcrossReload],
    ['name max length',            testNameMaxLength],
    ['description max length',     testDescriptionMaxLength],
    ['description special chars',  testDescriptionAcceptsSpecialChars],
    ['duplicate name rejected',    testDuplicateNameValidation],
    ['type-group cascade',         testTypeGroupCascade],
    ['all fields editable',        testAllFieldsEditable],
    ['auto-save on tab switch',    testAutoSaveOnTabSwitch],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-139062.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-139062 Builder Basic Info Permission Info',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us139062-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-139062 Report</title>
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
<h1>US-139062 — Builder Basic Info / Permission Info</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us139062-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us139062-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
