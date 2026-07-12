/**
 * US-132566 — Permission Setup - Builder | List Screen
 *
 * Covers every AC in doc/US-132566-*.md:
 *   • Default columns (Name, Type, Status, Actions)
 *   • Column picker for optional audit columns (Created/Updated By/On)
 *   • Permission Name link navigates to view page
 *   • Create button ("New Permission")
 *   • Row actions menu: Clone / Publish / Version History / Delete
 *   • Publish/Unpublish toggle based on status
 *   • Status chip: Draft / Published
 *   • Global search over Name / Type / Group
 *   • Per-column filter (hamburger on each header)
 *   • Multi-column filters combine (AND)
 *   • Sort cycle: header click → asc → desc → cleared
 *   • Default pagination applied
 *
 * Run: node scripts/tests/builder-us132566-tests.mjs
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
      if (k.startsWith('prototype:builder:') || k.startsWith('prototype:paymentSettings:') ||
          k.startsWith('prototype:documentTypes:') || k.startsWith('prototype:rules:') ||
          k.startsWith('prototype:pricing:') || k.startsWith('prototype:applicationForm:')) {
        localStorage.removeItem(k);
      }
    }
  });
}

async function gotoList(page) {
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
}

// ─── AC group 1: Default columns ───────────────────────────────────────────
async function testDefaultColumns(page) {
  await gotoList(page);
  const headers = (await page.locator('th [data-testid^="col-header-"], th').allTextContents())
    .map((h) => h.replace(/\s+/g, ' ').trim());
  const defaultCols = ['Permission Name', 'Type', 'Status', 'Actions'];
  const missing = defaultCols.filter((c) => !headers.some((h) => h.includes(c)));
  const extraAudit = ['Created On', 'Created By', 'Updated On', 'Updated By']
    .filter((c) => headers.some((h) => h.includes(c)));
  const shot = await snap(page, 'US-132566.cols.default');
  record('US-132566.cols.default',
    'Default columns show Name/Type/Status/Actions',
    missing.length === 0,
    `headers=${JSON.stringify(headers)}${missing.length ? `; missing=${JSON.stringify(missing)}` : ''}`,
    shot);
  record('US-132566.cols.auditHiddenByDefault',
    'Audit columns (Created/Updated) hidden by default',
    extraAudit.length === 0,
    extraAudit.length ? `unexpectedly visible: ${JSON.stringify(extraAudit)}` : 'audit cols hidden (correct)');
}

// ─── AC group 2: Column picker ─────────────────────────────────────────────
async function testColumnPicker(page) {
  await gotoList(page);
  await page.locator('[data-testid="column-picker-button"]').click();
  await wait(400);
  const picker = page.locator('.MuiMenu-root:visible').first();
  const options = ['name', 'type', 'group', 'scope', 'status', 'createdOn', 'createdBy', 'updatedOn', 'updatedBy'];
  const found = [];
  for (const k of options) {
    const c = await picker.locator(`[data-testid="col-toggle-${k}"]`).count();
    if (c > 0) found.push(k);
  }
  const shot = await snap(page, 'US-132566.cols.picker');
  record('US-132566.cols.pickerOptions',
    'Column picker offers all audit columns',
    found.length === options.length,
    `found=${JSON.stringify(found)}`,
    shot);

  // Enable Created By + Created On + Updated By + Updated On
  for (const k of ['createdOn', 'createdBy', 'updatedOn', 'updatedBy']) {
    await picker.locator(`[data-testid="col-toggle-${k}"] input[type="checkbox"]`).check({ force: true });
    await wait(120);
  }
  await page.keyboard.press('Escape');
  await wait(300);
  const headers2 = await page.locator('th').allTextContents();
  const nowVisible = ['Created On', 'Created By', 'Updated On', 'Updated By']
    .every((c) => headers2.some((h) => h.includes(c)));
  const shot2 = await snap(page, 'US-132566.cols.enabled');
  record('US-132566.cols.pickerToggles',
    'Enabling audit columns adds them to the grid',
    nowVisible,
    `headers=${JSON.stringify(headers2)}`,
    shot2);
}

// ─── AC group 3: Permission Name link ──────────────────────────────────────
async function testNameLink(page) {
  await gotoList(page);
  const firstLink = page.locator('[data-testid^="row-name-"]').first();
  const linkText = (await firstLink.innerText()).trim();
  await firstLink.click();
  await page.waitForLoadState('networkidle');
  await wait(500);
  const onDetail = page.url().includes('/builder/');
  const editable = await page.getByRole('button', { name: /^edit$|^save|^publish$/i }).count();
  const shot = await snap(page, 'US-132566.nameLink.detail');
  record('US-132566.nameLink.opens',
    'Clicking permission name opens the detail/view screen',
    onDetail && linkText.length > 0,
    `url=${page.url()}`,
    shot);
  record('US-132566.nameLink.hasEditAffordance',
    'Detail screen exposes edit/save/publish button',
    editable > 0,
    `edit-like button count=${editable}`);
}

// ─── AC group 4: Create button ─────────────────────────────────────────────
async function testCreateButton(page) {
  await gotoList(page);
  const btn = page.locator('[data-testid="new-permission"]');
  const count = await btn.count();
  const label = count ? (await btn.innerText()).trim() : '';
  const shot = await snap(page, 'US-132566.create.button');
  record('US-132566.create.buttonPresent',
    'List screen has "New Permission" create button',
    count > 0 && /new permission/i.test(label),
    `label="${label}"`,
    shot);
}

// ─── AC group 5: Row actions menu ──────────────────────────────────────────
async function testRowActionsMenu(page) {
  await gotoList(page);
  const draftRow = page.locator('[data-testid^="row-P-"]').filter({
    has: page.locator('[data-testid^="row-status-"]', { hasText: 'Draft' }),
  }).first();
  const draftId = await draftRow.getAttribute('data-testid');
  const rowId = draftId?.replace('row-', '') ?? '';
  await page.locator(`[data-testid="row-actions-${rowId}"]`).click();
  await wait(400);
  const items = (await page.locator('.MuiMenu-root:visible .MuiMenuItem-root').allTextContents())
    .map((s) => s.trim());
  const need = ['Clone', 'Publish', 'Version History', 'Delete'];
  const missing = need.filter((n) => !items.some((i) => i.includes(n)));
  const shot = await snap(page, 'US-132566.actions.draft');
  record('US-132566.actions.hasAllOptions',
    'Draft row shows Clone / Publish / Version History / Delete',
    missing.length === 0,
    `items=${JSON.stringify(items)}${missing.length ? `; missing=${JSON.stringify(missing)}` : ''}`,
    shot);
  await page.keyboard.press('Escape');
  await wait(200);

  // Published row → menu shows "Unpublish"
  const pubRow = page.locator('[data-testid^="row-P-"]').filter({
    has: page.locator('[data-testid^="row-status-"]', { hasText: 'Published' }),
  }).first();
  const pubId = (await pubRow.getAttribute('data-testid'))?.replace('row-', '') ?? '';
  await page.locator(`[data-testid="row-actions-${pubId}"]`).click();
  await wait(400);
  const pubItems = (await page.locator('.MuiMenu-root:visible .MuiMenuItem-root').allTextContents())
    .map((s) => s.trim());
  const hasUnpub = pubItems.some((i) => /unpublish/i.test(i));
  const shot2 = await snap(page, 'US-132566.actions.published');
  record('US-132566.actions.publishedShowsUnpublish',
    'Published row shows "Unpublish" instead of "Publish"',
    hasUnpub,
    `items=${JSON.stringify(pubItems)}`,
    shot2);
  await page.keyboard.press('Escape');
  await wait(200);
}

// ─── AC group 6: Status column ─────────────────────────────────────────────
async function testStatusColumn(page) {
  await gotoList(page);
  const chips = (await page.locator('[data-testid^="row-status-"]').allTextContents()).map((s) => s.trim());
  const validValues = chips.every((c) => c === 'Draft' || c === 'Published');
  const hasBoth = chips.includes('Draft') && chips.includes('Published');
  record('US-132566.status.validValues',
    'Status column shows only Draft or Published',
    validValues && chips.length > 0,
    `values=${JSON.stringify([...new Set(chips)])}`);
  record('US-132566.status.bothPresent',
    'Seed data includes both Draft and Published permissions',
    hasBoth);
}

// ─── AC group 7: Global search (Name / Type / Group) ───────────────────────
async function testGlobalSearch(page) {
  await gotoList(page);
  const search = page.locator('[data-testid="global-search"] input');

  // By name
  await search.fill('Visitor Book');
  await wait(400);
  const nameRows = await page.locator('[data-testid^="row-name-"]').allTextContents();
  const nameOk = nameRows.length > 0 && nameRows.every((n) => /visitor|book/i.test(n));
  const shotName = await snap(page, 'US-132566.search.name');
  record('US-132566.search.byName',
    'Search filters by Permission Name',
    nameOk,
    `matched=${nameRows.length}: ${JSON.stringify(nameRows.slice(0, 3))}`,
    shotName);

  // By type
  await search.fill('');
  await search.fill('Licence');
  await wait(400);
  const typeCells = await page.locator('td:nth-child(3)').allTextContents();
  const typeOk = typeCells.length > 0 && typeCells.every((t) => /licence/i.test(t));
  record('US-132566.search.byType',
    'Search filters by Type',
    typeOk,
    `matched=${typeCells.length}: ${JSON.stringify(typeCells)}`);

  // By group — need Group column visible first
  await page.locator('[data-testid="column-picker-button"]').click();
  await wait(300);
  await page.locator('[data-testid="col-toggle-group"] input[type="checkbox"]').check({ force: true });
  await page.keyboard.press('Escape');
  await wait(300);
  await search.fill('');
  await search.fill('Disabled');
  await wait(400);
  const groupRowCount = await page.locator('[data-testid^="row-name-"]').count();
  const shotGrp = await snap(page, 'US-132566.search.group');
  record('US-132566.search.byGroup',
    'Search filters by Group (e.g. "Disabled")',
    groupRowCount > 0,
    `matched=${groupRowCount}`,
    shotGrp);

  // Reset
  await search.fill('');
  await wait(300);
}

// ─── AC group 8: Per-column filter (hamburger) ─────────────────────────────
async function testColumnFilter(page) {
  await gotoList(page);
  const filterIcon = page.locator('[data-testid="col-filter-name"]').first();
  await filterIcon.click();
  await wait(300);
  const input = page.locator('[data-testid="col-filter-input-name"] input');
  await input.fill('City');
  await wait(400);
  const rows = await page.locator('[data-testid^="row-name-"]').allTextContents();
  const ok = rows.length > 0 && rows.every((n) => /city/i.test(n));
  const shot = await snap(page, 'US-132566.filter.column');
  record('US-132566.filter.perColumn',
    'Per-column filter (hamburger) filters rows',
    ok,
    `matched=${rows.length}: ${JSON.stringify(rows)}`,
    shot);
  await page.keyboard.press('Escape');
  await wait(200);

  // Add second filter on Type — combined AND
  await page.locator('[data-testid="col-filter-type"]').first().click();
  await wait(300);
  await page.locator('[data-testid="col-filter-input-type"] input').fill('Resident');
  await wait(400);
  const rows2 = await page.locator('[data-testid^="row-name-"]').allTextContents();
  const ok2 = rows2.every((n) => /city/i.test(n)); // still constrained by first filter
  const shot2 = await snap(page, 'US-132566.filter.multi');
  record('US-132566.filter.multiColumnAND',
    'Multiple column filters combine with AND',
    ok2,
    `after adding Type='Resident': matched=${rows2.length}: ${JSON.stringify(rows2)}`,
    shot2);
  await page.keyboard.press('Escape');
  await wait(200);
  // Clear
  await page.locator('[data-testid="clear-filters-button"]').click();
  await wait(300);
}

// ─── AC group 9: Sorting cycle ─────────────────────────────────────────────
async function testSorting(page) {
  await gotoList(page);
  const header = page.locator('[data-testid="col-sort-name"]');
  const names = async () => (await page.locator('[data-testid^="row-name-"]').allTextContents()).map((s) => s.trim());

  await header.click();
  await wait(300);
  const asc = await names();
  const sortedAsc = [...asc].sort((a, b) => a.localeCompare(b));
  const ascOk = JSON.stringify(asc) === JSON.stringify(sortedAsc);
  const shotAsc = await snap(page, 'US-132566.sort.asc');
  record('US-132566.sort.ascending',
    'First click sorts ascending',
    ascOk,
    `got=${JSON.stringify(asc.slice(0, 3))}...`,
    shotAsc);

  await header.click();
  await wait(300);
  const desc = await names();
  const sortedDesc = [...desc].sort((a, b) => b.localeCompare(a));
  const descOk = JSON.stringify(desc) === JSON.stringify(sortedDesc);
  const shotDesc = await snap(page, 'US-132566.sort.desc');
  record('US-132566.sort.descending',
    'Second click sorts descending',
    descOk,
    `got=${JSON.stringify(desc.slice(0, 3))}...`,
    shotDesc);

  await header.click();
  await wait(300);
  const cleared = await names();
  // "Cleared" means order matches the un-sorted natural order (i.e., differs from strict asc AND strict desc)
  const notAsc = JSON.stringify(cleared) !== JSON.stringify(sortedAsc);
  const notDesc = JSON.stringify(cleared) !== JSON.stringify(sortedDesc);
  record('US-132566.sort.clearedOnThirdClick',
    'Third click clears sorting',
    notAsc && notDesc,
    `after clear=${JSON.stringify(cleared.slice(0, 3))}...`);
}

// ─── AC group 10: Pagination default ───────────────────────────────────────
async function testPagination(page) {
  await gotoList(page);
  const label = await page.locator('.MuiTablePagination-selectLabel').innerText().catch(() => '');
  const shownPerPage = await page.locator('.MuiTablePagination-select').innerText().catch(() => '');
  const defaultsOk = /rows per page/i.test(label) && ['10', '25', '50'].includes(shownPerPage.trim());
  const shot = await snap(page, 'US-132566.paging.default');
  record('US-132566.paging.defaultApplied',
    'Default pagination is applied',
    defaultsOk,
    `label="${label}" rowsPerPage="${shownPerPage}"`,
    shot);
}

// ─── Runner ────────────────────────────────────────────────────────────────
(async () => {
  console.log('\nUS-132566 test pack — Permission Builder List Screen');
  console.log('────────────────────────────────────────────────────\n');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  const startedAt = new Date();
  const suites = [
    ['default columns',        testDefaultColumns],
    ['column picker',          testColumnPicker],
    ['name link',              testNameLink],
    ['create button',          testCreateButton],
    ['row actions menu',       testRowActionsMenu],
    ['status column',          testStatusColumn],
    ['global search',          testGlobalSearch],
    ['column filter',          testColumnFilter],
    ['sorting',                testSorting],
    ['pagination',             testPagination],
  ];
  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-132566.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
  }

  await browser.close();
  const endedAt = new Date();

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log('\n─── SUMMARY ─────────────────');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  // Write reports
  const outDir = path.resolve(__dirname, '..', '..', 'test-results');
  fs.mkdirSync(outDir, { recursive: true });

  const json = {
    suite: 'US-132566 Permission Builder List Screen',
    started: startedAt.toISOString(),
    ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt,
    total: results.length, passed, failed,
    results,
  };
  fs.writeFileSync(path.join(outDir, 'us132566-report.json'), JSON.stringify(json, null, 2));

  // HTML report
  const escapeXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${escapeXml(r.name)}</td><td><code>${escapeXml(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-132566 Report</title>
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
<h1>US-132566 — Permission Builder List Screen</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us132566-report.html'), html);

  console.log(`\nReports:\n  ${path.join(outDir, 'us132566-report.html')}\n  ${path.join(outDir, 'us132566-report.json')}\n`);
  process.exit(failed ? 1 : 0);
})();
