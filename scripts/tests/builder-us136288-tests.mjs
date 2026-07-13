/**
 * US-136288 — Permission Setup - Builder | Single/Multi Select - Delete
 *
 * Deep senior-QA coverage: 25 scenarios across single-row delete, bulk delete,
 * dialog UX, selection state, filter interaction, and edge cases.
 *
 * Run: node scripts/tests/builder-us136288-tests.mjs
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

async function getRowIds(page) {
  const nodes = await page.locator('[data-testid^="row-P-"]').all();
  const ids = [];
  for (const n of nodes) {
    const t = await n.getAttribute('data-testid');
    if (t) ids.push(t.replace('row-', ''));
  }
  return ids;
}

// ────────────────────────────────────────────────────────────────────────────
// SINGLE-ROW DELETE
// ────────────────────────────────────────────────────────────────────────────
async function testSingle_ThreeDotVisible(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  let allHaveMenu = true;
  for (const id of rowIds) {
    const c = await page.locator(`[data-testid="row-actions-${id}"]`).count();
    if (c === 0) { allHaveMenu = false; break; }
  }
  const shot = await snap(page, 'US-136288.single.threeDots');
  record('US-136288.single.threeDotOnEveryRow',
    'Three-dot action icon present on every row',
    rowIds.length > 0 && allHaveMenu,
    `rows=${rowIds.length}`, shot);
}

async function testSingle_MenuHasDelete(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  await page.locator(`[data-testid="row-actions-${rowIds[0]}"]`).click();
  await wait(400);
  const items = (await page.locator('.MuiMenu-root:visible .MuiMenuItem-root').allTextContents()).map((s) => s.trim());
  const hasDelete = items.some((i) => /^delete$/i.test(i));
  const shot = await snap(page, 'US-136288.single.menuHasDelete');
  record('US-136288.single.menuHasDelete',
    'Row menu contains Delete option',
    hasDelete, `menu=${JSON.stringify(items)}`, shot);
  await page.keyboard.press('Escape');
  await wait(200);
}

async function testSingle_DialogOpensWithNameCopy(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  const targetId = rowIds[0];
  const targetName = (await page.locator(`[data-testid="row-name-${targetId}"]`).innerText()).trim();
  await page.locator(`[data-testid="row-actions-${targetId}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${targetId}"]`).click();
  await wait(400);
  const dialog = page.locator('[data-testid="single-delete-dialog"]');
  const visible = await dialog.isVisible();
  const text = await dialog.innerText();
  const hasName = text.includes(targetName);
  const hasAskCopy = /are you sure you want to delete/i.test(text);
  const hasBtns = text.includes('Delete') && text.includes('Cancel');
  const shot = await snap(page, 'US-136288.single.dialogOpen');
  record('US-136288.single.dialogOpens',
    'Delete option opens confirmation dialog',
    visible, `visible=${visible}`, shot);
  record('US-136288.single.dialogHasPermissionName',
    'Dialog contains the permission name being deleted',
    hasName, `name="${targetName}", text="${text.slice(0, 150)}..."`);
  record('US-136288.single.dialogHasAskCopy',
    'Dialog uses "Are you sure you want to delete" copy',
    hasAskCopy);
  record('US-136288.single.dialogHasDeleteAndCancel',
    'Dialog has Delete and Cancel buttons',
    hasBtns);
}

async function testSingle_CancelPreservesRow(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  const before = rowIds.length;
  const targetId = rowIds[0];
  await page.locator(`[data-testid="row-actions-${targetId}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${targetId}"]`).click();
  await wait(400);
  await page.locator('[data-testid="single-delete-cancel"]').click();
  await wait(400);
  const dialogGone = !(await page.locator('[data-testid="single-delete-dialog"]').isVisible().catch(() => false));
  const stillThere = await page.locator(`[data-testid="row-${targetId}"]`).count();
  const after = (await getRowIds(page)).length;
  record('US-136288.single.cancelClosesDialog',
    'Cancel closes the delete dialog',
    dialogGone);
  record('US-136288.single.cancelPreservesRow',
    'Cancel does not remove the row',
    stillThere > 0 && after === before,
    `before=${before}, after=${after}, targetStillPresent=${stillThere}`);
}

async function testSingle_ConfirmDeletesAndToast(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  const before = rowIds.length;
  const targetId = rowIds[0];
  const targetName = (await page.locator(`[data-testid="row-name-${targetId}"]`).innerText()).trim();
  await page.locator(`[data-testid="row-actions-${targetId}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${targetId}"]`).click();
  await wait(400);
  await page.locator('[data-testid="single-delete-confirm"]').click();
  await wait(700);

  const dialogGone = !(await page.locator('[data-testid="single-delete-dialog"]').isVisible().catch(() => false));
  const rowGone = (await page.locator(`[data-testid="row-${targetId}"]`).count()) === 0;
  const after = (await getRowIds(page)).length;
  const toast = await page.locator('.MuiSnackbar-root, .MuiAlert-root').last().innerText().catch(() => '');
  const hasName = toast.includes(targetName);
  const hasSuccess = /deleted successfully/i.test(toast);
  const shot = await snap(page, 'US-136288.single.deletedToast');
  record('US-136288.single.confirmClosesDialog',
    'Confirm closes the dialog', dialogGone);
  record('US-136288.single.confirmRemovesRow',
    'Confirm removes the row from the list',
    rowGone && after === before - 1,
    `before=${before}, after=${after}, rowStillPresent=${!rowGone}`);
  record('US-136288.single.successToast',
    'Success toast reads "<name> Deleted Successfully"',
    hasName && hasSuccess,
    `toast="${toast}"`, shot);
}

async function testSingle_WorksOnPublishedRow(page) {
  await openList(page);
  const pubRow = page.locator('[data-testid^="row-P-"]').filter({
    has: page.locator('[data-testid^="row-status-"]', { hasText: 'Published' }),
  }).first();
  const pubId = (await pubRow.getAttribute('data-testid'))?.replace('row-', '') ?? '';
  await page.locator(`[data-testid="row-actions-${pubId}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${pubId}"]`).click();
  await wait(400);
  await page.locator('[data-testid="single-delete-confirm"]').click();
  await wait(500);
  const gone = (await page.locator(`[data-testid="row-${pubId}"]`).count()) === 0;
  record('US-136288.single.worksOnPublishedRow',
    'Delete works on Published rows',
    gone, `deletedId=${pubId}`);
}

async function testSingle_OtherRowsUnaffected(page) {
  await openList(page);
  const idsBefore = await getRowIds(page);
  const targetId = idsBefore[0];
  const namesBefore = [];
  for (const id of idsBefore.slice(1)) {
    namesBefore.push((await page.locator(`[data-testid="row-name-${id}"]`).innerText()).trim());
  }
  await page.locator(`[data-testid="row-actions-${targetId}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${targetId}"]`).click();
  await wait(400);
  await page.locator('[data-testid="single-delete-confirm"]').click();
  await wait(500);
  const idsAfter = await getRowIds(page);
  const namesAfter = [];
  for (const id of idsAfter) {
    namesAfter.push((await page.locator(`[data-testid="row-name-${id}"]`).innerText()).trim());
  }
  const preserved = namesBefore.every((n) => namesAfter.includes(n));
  record('US-136288.single.othersUnaffected',
    'Only the targeted row is removed; others remain',
    preserved && idsAfter.length === idsBefore.length - 1,
    `before=${idsBefore.length}, after=${idsAfter.length}, preservedAll=${preserved}`);
}

async function testSingle_EscapeClosesDialog(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  await page.locator(`[data-testid="row-actions-${rowIds[0]}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${rowIds[0]}"]`).click();
  await wait(400);
  await page.keyboard.press('Escape');
  await wait(400);
  const gone = !(await page.locator('[data-testid="single-delete-dialog"]').isVisible().catch(() => false));
  const stillThere = await page.locator(`[data-testid="row-${rowIds[0]}"]`).count();
  record('US-136288.single.escapeClosesDialog',
    'Escape key closes the delete dialog without deleting',
    gone && stillThere > 0);
}

// ────────────────────────────────────────────────────────────────────────────
// MULTI SELECT / BULK DELETE
// ────────────────────────────────────────────────────────────────────────────
async function testMulti_CheckboxesPresent(page) {
  await openList(page);
  const rowCheckboxes = await page.locator('tbody tr td:first-child input[type="checkbox"]').count();
  const headerCheckbox = await page.locator('thead tr th:first-child input[type="checkbox"]').count();
  record('US-136288.multi.rowCheckboxes',
    'Every row has a selection checkbox',
    rowCheckboxes > 0, `count=${rowCheckboxes}`);
  record('US-136288.multi.headerCheckbox',
    'Header row has "select all" checkbox',
    headerCheckbox === 1);
}

async function testMulti_HeaderSelectsAllVisible(page) {
  await openList(page);
  await page.locator('thead tr th:first-child input[type="checkbox"]').check();
  await wait(300);
  const checkedRows = await page.locator('tbody tr td:first-child input[type="checkbox"]:checked').count();
  const totalRows = await page.locator('tbody tr td:first-child input[type="checkbox"]').count();
  const count = await page.locator('[data-testid="selection-count"]').innerText().catch(() => '');
  const shot = await snap(page, 'US-136288.multi.selectAll');
  record('US-136288.multi.selectAllVisible',
    'Header checkbox selects all visible rows',
    checkedRows === totalRows && totalRows > 0,
    `checked=${checkedRows}/${totalRows}, banner="${count}"`, shot);
  await page.locator('thead tr th:first-child input[type="checkbox"]').uncheck();
  await wait(200);
}

async function testMulti_BulkDeleteHiddenWithZero(page) {
  await openList(page);
  const visible = await page.locator('[data-testid="bulk-delete-button"]').isVisible().catch(() => false);
  record('US-136288.multi.bulkDeleteHiddenWith0',
    'Bulk Delete button hidden when 0 selected', !visible);
}

async function testMulti_BulkDeleteHiddenWithOne(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  await page.locator(`[data-testid="row-${rowIds[0]}"] input[type="checkbox"]`).check();
  await wait(300);
  const visible = await page.locator('[data-testid="bulk-delete-button"]').isVisible().catch(() => false);
  const shot = await snap(page, 'US-136288.multi.oneSelectedNoBulk');
  record('US-136288.multi.bulkDeleteHiddenWith1',
    'Bulk Delete button hidden when only 1 selected (AC: 2+)',
    !visible, `visible=${visible}`, shot);
}

async function testMulti_BulkDeleteVisibleWithTwo(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  await page.locator(`[data-testid="row-${rowIds[0]}"] input[type="checkbox"]`).check();
  await page.locator(`[data-testid="row-${rowIds[1]}"] input[type="checkbox"]`).check();
  await wait(300);
  const visible = await page.locator('[data-testid="bulk-delete-button"]').isVisible();
  const shot = await snap(page, 'US-136288.multi.twoSelected');
  record('US-136288.multi.bulkDeleteVisibleWith2',
    'Bulk Delete button visible when 2+ selected',
    visible, '', shot);
}

async function testMulti_BulkDialogCopy(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  await page.locator(`[data-testid="row-${rowIds[0]}"] input[type="checkbox"]`).check();
  await page.locator(`[data-testid="row-${rowIds[1]}"] input[type="checkbox"]`).check();
  await wait(300);
  await page.locator('[data-testid="bulk-delete-button"]').click();
  await wait(400);
  const dialog = page.locator('[data-testid="bulk-delete-dialog"]');
  const visible = await dialog.isVisible();
  const text = await dialog.innerText();
  const hasTitle = /delete all permission\?/i.test(text);
  const hasBody = /are you sure want to delete all the selected permissions/i.test(text);
  const hasDeleteAll = /delete all/i.test(text);
  const hasCancel = /cancel/i.test(text);
  const shot = await snap(page, 'US-136288.multi.bulkDialog');
  record('US-136288.multi.bulkDialogOpens',
    'Bulk Delete opens confirmation dialog', visible, '', shot);
  record('US-136288.multi.bulkDialogTitle',
    'Dialog title is "Delete All Permission?"', hasTitle);
  record('US-136288.multi.bulkDialogBody',
    'Dialog body matches AC copy',
    hasBody, `text="${text.slice(0, 200).replace(/\s+/g, ' ')}"`);
  record('US-136288.multi.bulkDialogHasButtons',
    'Dialog has "Delete All" and "Cancel" buttons',
    hasDeleteAll && hasCancel);
}

async function testMulti_BulkCancelPreservesAll(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  const before = rowIds.length;
  await page.locator(`[data-testid="row-${rowIds[0]}"] input[type="checkbox"]`).check();
  await page.locator(`[data-testid="row-${rowIds[1]}"] input[type="checkbox"]`).check();
  await wait(300);
  await page.locator('[data-testid="bulk-delete-button"]').click();
  await wait(400);
  await page.locator('[data-testid="bulk-delete-cancel"]').click();
  await wait(500);
  const dialogGone = !(await page.locator('[data-testid="bulk-delete-dialog"]').isVisible().catch(() => false));
  const after = (await getRowIds(page)).length;
  const selCount = await page.locator('[data-testid="selection-count"]').innerText().catch(() => '');
  const stillSelected = /2\s+selected/i.test(selCount);
  record('US-136288.multi.cancelClosesDialog',
    'Cancel closes the bulk delete dialog', dialogGone);
  record('US-136288.multi.cancelKeepsAllRows',
    'Cancel does not delete anything',
    after === before, `before=${before}, after=${after}`);
  record('US-136288.multi.cancelPreservesSelection',
    'Cancel preserves the selection state',
    stillSelected, `selection banner="${selCount}"`);
}

async function testMulti_BulkConfirmDeletes(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  const before = rowIds.length;
  await page.locator(`[data-testid="row-${rowIds[0]}"] input[type="checkbox"]`).check();
  await page.locator(`[data-testid="row-${rowIds[1]}"] input[type="checkbox"]`).check();
  await wait(300);
  await page.locator('[data-testid="bulk-delete-button"]').click();
  await wait(400);
  await page.locator('[data-testid="bulk-delete-confirm"]').click();
  await wait(700);

  const dialogGone = !(await page.locator('[data-testid="bulk-delete-dialog"]').isVisible().catch(() => false));
  const idsAfter = await getRowIds(page);
  const removed = !idsAfter.includes(rowIds[0]) && !idsAfter.includes(rowIds[1]);
  const toast = await page.locator('.MuiSnackbar-root, .MuiAlert-root').last().innerText().catch(() => '');
  const toastOk = /permissions deleted successfully/i.test(toast);
  const selectionCleared = !(await page.locator('[data-testid="selection-count"]').isVisible().catch(() => false));
  const shot = await snap(page, 'US-136288.multi.bulkDeleted');
  record('US-136288.multi.bulkConfirmClosesDialog',
    'Confirm closes the bulk dialog', dialogGone);
  record('US-136288.multi.bulkConfirmRemovesRows',
    'Confirm removes all selected rows',
    removed && idsAfter.length === before - 2,
    `before=${before}, after=${idsAfter.length}, targetsRemoved=${removed}`, shot);
  record('US-136288.multi.bulkSuccessToast',
    'Success toast reads "Permissions Deleted successfully"',
    toastOk, `toast="${toast}"`);
  record('US-136288.multi.bulkSelectionCleared',
    'Selection cleared after bulk delete',
    selectionCleared);
}

// ────────────────────────────────────────────────────────────────────────────
// EDGE CASES
// ────────────────────────────────────────────────────────────────────────────
async function testEdge_DeleteAllRows(page) {
  await openList(page);
  // Delete every row via bulk delete
  await page.locator('thead tr th:first-child input[type="checkbox"]').check();
  await wait(400);
  await page.locator('[data-testid="bulk-delete-button"]').click();
  await wait(400);
  await page.locator('[data-testid="bulk-delete-confirm"]').click();
  await wait(700);
  const rowsLeft = (await getRowIds(page)).length;
  const emptyMsgVisible = await page.getByText(/no permissions match/i).isVisible().catch(() => false);
  const shot = await snap(page, 'US-136288.edge.allDeleted');
  record('US-136288.edge.emptyStateAfterDeleteAll',
    'Empty state message shown after deleting all rows',
    rowsLeft === 0 && emptyMsgVisible,
    `rowsLeft=${rowsLeft}, emptyMsg=${emptyMsgVisible}`, shot);
}

async function testEdge_DeleteCleansSelection(page) {
  await openList(page);
  const rowIds = await getRowIds(page);
  // Select row, then delete same row via three-dot
  await page.locator(`[data-testid="row-${rowIds[0]}"] input[type="checkbox"]`).check();
  await wait(200);
  await page.locator(`[data-testid="row-actions-${rowIds[0]}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${rowIds[0]}"]`).click();
  await wait(400);
  await page.locator('[data-testid="single-delete-confirm"]').click();
  await wait(500);
  const selVisible = await page.locator('[data-testid="selection-count"]').isVisible().catch(() => false);
  record('US-136288.edge.singleDeleteCleansSelection',
    'Single-row delete removes that row from selection state',
    !selVisible, `selection banner still visible=${selVisible}`);
}

async function testEdge_FilteredDeleteOnlyAffectsMatch(page) {
  await openList(page);
  await page.locator('[data-testid="global-search"] input').fill('Visitor');
  await wait(500);
  const filteredIds = await getRowIds(page);
  if (filteredIds.length < 1) {
    record('US-136288.edge.filteredSearch',
      'Search returns at least one match to test on',
      false, 'No matches for "Visitor"');
    return;
  }
  const target = filteredIds[0];
  const targetName = (await page.locator(`[data-testid="row-name-${target}"]`).innerText()).trim();
  await page.locator(`[data-testid="row-actions-${target}"]`).click();
  await wait(300);
  await page.locator(`[data-testid="action-delete-${target}"]`).click();
  await wait(300);
  await page.locator('[data-testid="single-delete-confirm"]').click();
  await wait(500);
  // Clear search — row should be gone completely
  await page.locator('[data-testid="global-search"] input').fill('');
  await wait(400);
  const allIds = await getRowIds(page);
  const gone = !allIds.includes(target);
  record('US-136288.edge.deleteFromFilteredRemoves',
    'Deleting from filtered view removes row globally (not just filter)',
    gone, `deleted="${targetName}", stillPresent=${!gone}`);
}

async function testEdge_ManyRowsAtOnce(page) {
  await openList(page);
  // Select all visible then bulk-delete
  await page.locator('thead tr th:first-child input[type="checkbox"]').check();
  await wait(300);
  const selCount = await page.locator('[data-testid="selection-count"]').innerText().catch(() => '');
  const initial = (await getRowIds(page)).length;
  await page.locator('[data-testid="bulk-delete-button"]').click();
  await wait(300);
  const dialogText = await page.locator('[data-testid="bulk-delete-dialog"]').innerText().catch(() => '');
  const hasCount = dialogText.includes(String(initial));
  await page.locator('[data-testid="bulk-delete-confirm"]').click();
  await wait(700);
  const afterCount = (await getRowIds(page)).length;
  record('US-136288.edge.bulkDialogShowsCount',
    'Bulk delete dialog shows selection count',
    hasCount, `expected=${initial}, dialog snippet="${dialogText.slice(0, 100).replace(/\s+/g, ' ')}"`);
  record('US-136288.edge.bulkDeleteAllVisibleRows',
    'Bulk delete removes every selected row (no stragglers)',
    afterCount === 0,
    `selected="${selCount}", initial=${initial}, remaining=${afterCount}`);
}

// ────────────────────────────────────────────────────────────────────────────
// RUNNER
// ────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\nUS-136288 test pack — Builder Single/Multi Delete');
  console.log('──────────────────────────────────────────────────\n');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  const startedAt = new Date();
  const suites = [
    // Single-row
    ['single: three-dot visible',         testSingle_ThreeDotVisible],
    ['single: menu has delete',           testSingle_MenuHasDelete],
    ['single: dialog opens + copy',       testSingle_DialogOpensWithNameCopy],
    ['single: cancel preserves',          testSingle_CancelPreservesRow],
    ['single: confirm deletes + toast',   testSingle_ConfirmDeletesAndToast],
    ['single: works on published row',    testSingle_WorksOnPublishedRow],
    ['single: others unaffected',         testSingle_OtherRowsUnaffected],
    ['single: escape closes dialog',      testSingle_EscapeClosesDialog],
    // Bulk
    ['multi: checkboxes present',         testMulti_CheckboxesPresent],
    ['multi: header selects all',         testMulti_HeaderSelectsAllVisible],
    ['multi: bulk hidden with 0',         testMulti_BulkDeleteHiddenWithZero],
    ['multi: bulk hidden with 1',         testMulti_BulkDeleteHiddenWithOne],
    ['multi: bulk visible with 2',        testMulti_BulkDeleteVisibleWithTwo],
    ['multi: bulk dialog copy',           testMulti_BulkDialogCopy],
    ['multi: bulk cancel',                testMulti_BulkCancelPreservesAll],
    ['multi: bulk confirm deletes',       testMulti_BulkConfirmDeletes],
    // Edges
    ['edge: delete all → empty state',    testEdge_DeleteAllRows],
    ['edge: delete cleans selection',     testEdge_DeleteCleansSelection],
    ['edge: filtered delete',             testEdge_FilteredDeleteOnlyAffectsMatch],
    ['edge: many rows at once',           testEdge_ManyRowsAtOnce],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-136288.${name.replace(/[\s:]+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-136288 Builder Single/Multi Delete',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us136288-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-136288 Report</title>
<style>
body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;margin:2rem;color:#1F2937;max-width:1400px}
h1{font-size:1.75rem;margin:0 0 0.5rem}
.summary{background:#F4F6F9;border:1px solid #E5E7EB;border-radius:8px;padding:1rem;margin-bottom:1.5rem}
.pill{display:inline-block;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700}
.pill.ok{background:#DCFCE7;color:#166534} .pill.bad{background:#FEE2E2;color:#991B1B}
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
<h1>US-136288 — Builder Single / Multi Delete</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us136288-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us136288-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
