/**
 * US-143256 — Permission Setup | Builder — Special Event (Permissions Tab)
 *
 * ACs covered:
 *   - Special Event sub-section shown only when GS > Special Event = Enable
 *   - Section hidden when GS > Special Event = Disable
 *   - Displays: Start/End Date, Days multi-select ("All Week days"),
 *     From/Until time, Delete icon (only when >1), Duplicate icon, Add Timing.
 *   - Days list is dynamic based on selected date range.
 *   - Validation: Start date > End date -> error.
 *   - Validation: Start time >= End time -> error.
 *   - Validation: No day selected while other fields entered -> error.
 *   - Validation: Overlapping time ranges on same day.
 *   - Validation: Back-to-back time ranges are allowed.
 *   - Validation: Date range overlap error.
 *   - Add Timing appends a new empty block.
 *   - Delete removes only the selected block.
 *   - Delete icon hidden when only one block.
 *   - Duplicate creates a pre-filled copy directly below and is editable.
 *   - Max 15 events — Add Timing and Duplicate disabled at limit.
 *   - Persistence across reload.
 *
 * Run: node scripts/tests/builder-us143256-tests.mjs
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

async function enableSpecialEvent(page) {
  await page.getByTestId('subnav-general-settings').click();
  await wait(400);
  // Radio group under "Special Event" label
  const enableRadio = page.locator('[data-field="Special Event"] input[type="radio"][value="enable"]');
  await enableRadio.check();
  await wait(300);
}

async function disableSpecialEvent(page) {
  await page.getByTestId('subnav-general-settings').click();
  await wait(400);
  const disableRadio = page.locator('[data-field="Special Event"] input[type="radio"][value="disable"]');
  await disableRadio.check();
  await wait(300);
}

async function goToSection(page) {
  await page.getByTestId('subnav-special-event').click();
  await wait(400);
}

// ---------- Tests ----------

async function testSectionHiddenWhenDisabled(page) {
  await openDraftPermission(page);
  await disableSpecialEvent(page);
  const visible = await page.getByTestId('subnav-special-event').isVisible().catch(() => false);
  record('US-143256.toggle.hiddenWhenDisabled',
    'Special Event sub-section hidden when GS toggle is Disabled',
    !visible,
    `visible=${visible}`);
}

async function testSectionShownWhenEnabled(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  const visible = await page.getByTestId('subnav-special-event').isVisible();
  const shot = await snap(page, 'US-143256.toggle.enabled');
  record('US-143256.toggle.shownWhenEnabled',
    'Special Event sub-section appears when GS toggle is Enabled',
    visible, '', shot);
}

async function testFieldsPresent(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);

  const section = await page.getByTestId('special-event-section').isVisible();
  record('US-143256.fields.sectionRendered', 'Special Event section renders content', section);

  const startDate = await page.getByTestId('se-start-date-0').isVisible();
  const endDate = await page.getByTestId('se-end-date-0').isVisible();
  const days = await page.getByTestId('se-days-0').isVisible();
  const startTime = await page.getByTestId('se-start-time-0').isVisible();
  const endTime = await page.getByTestId('se-end-time-0').isVisible();
  const addBtn = await page.getByTestId('se-add-timing').isVisible();

  record('US-143256.fields.startDate', 'Start Date picker present', startDate);
  record('US-143256.fields.endDate',   'End Date picker present',   endDate);
  record('US-143256.fields.days',      'Days multi-select present', days);
  record('US-143256.fields.startTime', 'From (time) picker present', startTime);
  record('US-143256.fields.endTime',   'Until (time) picker present', endTime);
  record('US-143256.fields.addTiming', 'Add Timing button present', addBtn);
}

async function testDaysListDynamic(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);

  // 2026-06-15 (Mon) to 2026-06-17 (Wed) -> days should be Mon, Tue, Wed
  await page.getByTestId('se-start-date-0').fill('2026-06-15');
  await page.getByTestId('se-end-date-0').fill('2026-06-17');
  await wait(200);
  await page.getByTestId('se-days-0').click();
  await wait(300);
  const options = (await page.getByRole('option').allTextContents()).map((s) => s.trim());
  const hasMon = options.includes('Mon');
  const hasTue = options.includes('Tue');
  const hasWed = options.includes('Wed');
  const hasThu = options.includes('Thu');
  record('US-143256.days.dynamicPositive',
    'Days dropdown includes weekdays that fall inside the date range (Mon–Wed)',
    hasMon && hasTue && hasWed,
    `options=${JSON.stringify(options)}`);
  record('US-143256.days.dynamicNegative',
    'Days dropdown excludes weekdays outside the date range (Thu)',
    !hasThu,
    `Thu present=${hasThu}`);
  await page.keyboard.press('Escape');
}

async function testStartDateAfterEndDate(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  await page.getByTestId('se-start-date-0').fill('2026-06-20');
  await page.getByTestId('se-end-date-0').fill('2026-06-10');
  await wait(300);
  const err = await page.getByTestId('se-error-date-0').isVisible().catch(() => false);
  const text = err ? (await page.getByTestId('se-error-date-0').textContent()).trim() : '';
  const shot = await snap(page, 'US-143256.validation.dateOrder');
  record('US-143256.validation.startAfterEndDate',
    'Start date > End date shows "Start date cannot be larger than end date"',
    err && /larger than end date/i.test(text),
    `error=${text}`, shot);
}

async function testStartTimeAfterEndTime(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  await page.getByTestId('se-start-date-0').fill('2026-06-15');
  await page.getByTestId('se-end-date-0').fill('2026-06-15');
  await page.getByTestId('se-days-0').click();
  await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-0').fill('15:00');
  await page.getByTestId('se-end-time-0').fill('10:00');
  await wait(300);
  const err = await page.getByTestId('se-error-time-0').isVisible().catch(() => false);
  const text = err ? (await page.getByTestId('se-error-time-0').textContent()).trim() : '';
  record('US-143256.validation.startTimeAfterEnd',
    'Start time >= End time shows "Start time must be before end time"',
    err && /before end time/i.test(text),
    `error=${text}`);
}

async function testNoDaySelectedError(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  await page.getByTestId('se-start-date-0').fill('2026-06-15');
  await page.getByTestId('se-end-date-0').fill('2026-06-16');
  await page.getByTestId('se-start-time-0').fill('09:00');
  await page.getByTestId('se-end-time-0').fill('10:00');
  await wait(300);
  const err = await page.getByTestId('se-error-day-0').isVisible().catch(() => false);
  const text = err ? (await page.getByTestId('se-error-day-0').textContent()).trim() : '';
  const shot = await snap(page, 'US-143256.validation.noDay');
  record('US-143256.validation.noDaySelected',
    'No day selected while other fields entered shows "At least one day must be selected"',
    err && /at least one day/i.test(text),
    `error=${text}`, shot);
}

async function testAddTimingAppendsBlock(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  const before = await page.locator('[data-testid^="se-block-"]').count();
  await page.getByTestId('se-add-timing').click();
  await wait(300);
  const after = await page.locator('[data-testid^="se-block-"]').count();
  record('US-143256.add.appendsBlock',
    'Add Timing appends a new empty block below',
    after === before + 1,
    `before=${before} after=${after}`);
}

async function testDeleteRemovesOnlyThatBlock(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  // Get to 3 blocks
  await page.getByTestId('se-add-timing').click(); await wait(200);
  await page.getByTestId('se-add-timing').click(); await wait(200);
  const before = await page.locator('[data-testid^="se-block-"]').count();

  // Delete middle one — put a marker on block 0 and 2 so we can verify they survive.
  await page.getByTestId('se-start-date-0').fill('2026-01-01');
  await page.getByTestId('se-start-date-2').fill('2026-03-03');
  await page.getByTestId('se-delete-1').click();
  await wait(300);
  const after = await page.locator('[data-testid^="se-block-"]').count();
  const first = await page.getByTestId('se-start-date-0').inputValue();
  const second = await page.getByTestId('se-start-date-1').inputValue();
  record('US-143256.delete.removesOnlyThatBlock',
    'Delete removes only the selected block and preserves others',
    after === before - 1 && first === '2026-01-01' && second === '2026-03-03',
    `before=${before} after=${after} first=${first} second=${second}`);
}

async function testDeleteHiddenWithOne(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  const count = await page.locator('[data-testid^="se-block-"]').count();
  const deleteVisible = await page.getByTestId('se-delete-0').isVisible().catch(() => false);
  record('US-143256.delete.hiddenWithOne',
    'Delete icon hidden when only one block exists',
    count === 1 && !deleteVisible,
    `blocks=${count} deleteVisible=${deleteVisible}`);
}

async function testDuplicateClonesBlock(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  await page.getByTestId('se-start-date-0').fill('2026-06-15');
  await page.getByTestId('se-end-date-0').fill('2026-06-16');
  await page.getByTestId('se-days-0').click();
  await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-0').fill('09:00');
  await page.getByTestId('se-end-time-0').fill('10:00');

  await page.getByTestId('se-duplicate-0').click();
  await wait(400);

  const blocks = await page.locator('[data-testid^="se-block-"]').count();
  const dupStart = await page.getByTestId('se-start-date-1').inputValue();
  const dupEnd = await page.getByTestId('se-end-date-1').inputValue();
  const dupStartT = await page.getByTestId('se-start-time-1').inputValue();
  const dupEndT = await page.getByTestId('se-end-time-1').inputValue();
  const shot = await snap(page, 'US-143256.duplicate.cloned');
  record('US-143256.duplicate.insertedBelow',
    'Duplicate inserts a new block directly below the original with same values',
    blocks === 2 && dupStart === '2026-06-15' && dupEnd === '2026-06-16'
      && dupStartT === '09:00' && dupEndT === '10:00',
    `blocks=${blocks} startDate=${dupStart} endDate=${dupEnd} startT=${dupStartT} endT=${dupEndT}`,
    shot);

  // Modify the duplicate — should not affect original.
  await page.getByTestId('se-start-date-1').fill('2026-07-01');
  await wait(200);
  const origStill = await page.getByTestId('se-start-date-0').inputValue();
  record('US-143256.duplicate.editableIndependently',
    'Duplicate block is fully editable and does not mutate the original',
    origStill === '2026-06-15',
    `original after duplicate edit=${origStill}`);
}

async function testTimeOverlapSameDay(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);

  // Block 0: Mon 13:00–15:00
  await page.getByTestId('se-start-date-0').fill('2026-06-15');
  await page.getByTestId('se-end-date-0').fill('2026-06-15');
  await page.getByTestId('se-days-0').click(); await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-0').fill('13:00');
  await page.getByTestId('se-end-time-0').fill('15:00');

  // Block 1: Mon 14:30–16:00 (overlap)
  await page.getByTestId('se-add-timing').click(); await wait(200);
  await page.getByTestId('se-start-date-1').fill('2026-06-15');
  await page.getByTestId('se-end-date-1').fill('2026-06-15');
  await page.getByTestId('se-days-1').click(); await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-1').fill('14:30');
  await page.getByTestId('se-end-time-1').fill('16:00');
  await wait(300);

  const err = await page.getByTestId('se-error-time-overlap-1').isVisible().catch(() => false);
  const text = err ? (await page.getByTestId('se-error-time-overlap-1').textContent()).trim() : '';
  const shot = await snap(page, 'US-143256.validation.timeOverlap');
  record('US-143256.validation.timeOverlapPartial',
    'Partial overlap on same day triggers "Time range overlaps..."',
    err && /time range overlaps/i.test(text),
    `error=${text}`, shot);
}

async function testTimeOverlapExactMatch(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  await page.getByTestId('se-start-date-0').fill('2026-06-15');
  await page.getByTestId('se-end-date-0').fill('2026-06-15');
  await page.getByTestId('se-days-0').click(); await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-0').fill('14:00');
  await page.getByTestId('se-end-time-0').fill('16:00');

  await page.getByTestId('se-add-timing').click(); await wait(200);
  await page.getByTestId('se-start-date-1').fill('2026-06-15');
  await page.getByTestId('se-end-date-1').fill('2026-06-15');
  await page.getByTestId('se-days-1').click(); await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-1').fill('14:00');
  await page.getByTestId('se-end-time-1').fill('16:00');
  await wait(300);
  const err = await page.getByTestId('se-error-time-overlap-1').isVisible().catch(() => false);
  record('US-143256.validation.timeOverlapExact',
    'Exact time match on same day triggers overlap error',
    err);
}

async function testBackToBackAllowed(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  await page.getByTestId('se-start-date-0').fill('2026-06-15');
  await page.getByTestId('se-end-date-0').fill('2026-06-15');
  await page.getByTestId('se-days-0').click(); await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-0').fill('13:00');
  await page.getByTestId('se-end-time-0').fill('14:00');

  await page.getByTestId('se-add-timing').click(); await wait(200);
  await page.getByTestId('se-start-date-1').fill('2026-06-15');
  await page.getByTestId('se-end-date-1').fill('2026-06-15');
  await page.getByTestId('se-days-1').click(); await wait(200);
  await page.getByRole('option', { name: 'Mon', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-1').fill('14:00');
  await page.getByTestId('se-end-time-1').fill('15:00');
  await wait(300);

  const err = await page.getByTestId('se-error-time-overlap-1').isVisible().catch(() => false);
  record('US-143256.validation.backToBackAllowed',
    'Back-to-back time ranges (14:00-15:00 after 13:00-14:00) DO NOT trigger overlap',
    !err,
    `err visible=${err}`);
}

async function testDateRangeOverlap(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  await page.getByTestId('se-start-date-0').fill('2026-06-10');
  await page.getByTestId('se-end-date-0').fill('2026-06-20');
  await page.getByTestId('se-add-timing').click(); await wait(200);
  await page.getByTestId('se-start-date-1').fill('2026-06-15');
  await page.getByTestId('se-end-date-1').fill('2026-06-25');
  await wait(300);
  const err = await page.getByTestId('se-error-date-overlap-1').isVisible().catch(() => false);
  const text = err ? (await page.getByTestId('se-error-date-overlap-1').textContent()).trim() : '';
  record('US-143256.validation.dateRangeOverlap',
    'Overlapping date ranges trigger a validation error',
    err && /overlap/i.test(text),
    `error=${text}`);
}

async function testMax15Events(page) {
  await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  // Fill to 15 blocks
  for (let i = 1; i < 15; i++) {
    await page.getByTestId('se-add-timing').click();
    await wait(120);
  }
  const count = await page.locator('[data-testid^="se-block-"]').count();
  record('US-143256.limit.canReach15', 'Can add up to 15 timing blocks', count === 15, `count=${count}`);

  const addDisabled = await page.getByTestId('se-add-timing').isDisabled();
  record('US-143256.limit.addDisabledAtLimit', 'Add Timing disabled when at 15', addDisabled);

  const dupDisabled = await page.getByTestId('se-duplicate-0').isDisabled();
  record('US-143256.limit.duplicateDisabledAtLimit', 'Duplicate disabled when at 15', dupDisabled);

  // Chip
  const chipText = (await page.getByTestId('se-count').textContent()).trim();
  record('US-143256.limit.countChip', 'Count chip shows 15/15', /15\s*\/\s*15/.test(chipText), `chip=${chipText}`);
}

async function testPersistAcrossReload(page) {
  const permId = await openDraftPermission(page);
  await enableSpecialEvent(page);
  await goToSection(page);
  const marker = '2026-08-15';
  await page.getByTestId('se-start-date-0').fill(marker);
  await page.getByTestId('se-end-date-0').fill(marker);
  await page.getByTestId('se-days-0').click(); await wait(200);
  await page.getByRole('option', { name: 'Sat', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('se-start-time-0').fill('09:00');
  await page.getByTestId('se-end-time-0').fill('11:00');

  // Reload
  await page.goto(`${BASE}/builder/${permId}`);
  await page.waitForLoadState('networkidle');
  await wait(600);
  // GS state may not be persisted across reload — re-enable so the sub-nav re-appears.
  const seVisible = await page.getByTestId('subnav-special-event').isVisible().catch(() => false);
  if (!seVisible) await enableSpecialEvent(page);
  await page.getByTestId('subnav-special-event').click();
  await wait(400);

  const savedStart = await page.getByTestId('se-start-date-0').inputValue();
  const savedFromT = await page.getByTestId('se-start-time-0').inputValue();
  const shot = await snap(page, 'US-143256.persistence.afterReload');
  record('US-143256.persistence.acrossReload',
    'Special event blocks persist across reload',
    savedStart === marker && savedFromT === '09:00',
    `startDate=${savedStart} startTime=${savedFromT}`, shot);
}

// ---------- Runner ----------

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  const startedAt = new Date();
  const suites = [
    ['toggle disabled hides',      testSectionHiddenWhenDisabled],
    ['toggle enabled shows',       testSectionShownWhenEnabled],
    ['fields present',             testFieldsPresent],
    ['days list dynamic',          testDaysListDynamic],
    ['start > end date',           testStartDateAfterEndDate],
    ['start >= end time',          testStartTimeAfterEndTime],
    ['no day selected',            testNoDaySelectedError],
    ['add timing appends',         testAddTimingAppendsBlock],
    ['delete removes one',         testDeleteRemovesOnlyThatBlock],
    ['delete hidden with 1',       testDeleteHiddenWithOne],
    ['duplicate clones',           testDuplicateClonesBlock],
    ['time overlap partial',       testTimeOverlapSameDay],
    ['time overlap exact',         testTimeOverlapExactMatch],
    ['back to back allowed',       testBackToBackAllowed],
    ['date range overlap',         testDateRangeOverlap],
    ['max 15 events',              testMax15Events],
    ['persistence',                testPersistAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-143256.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-143256 Builder Special Event',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us143256-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-143256 Report</title>
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
<h1>US-143256 — Builder Special Event</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us143256-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us143256-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
