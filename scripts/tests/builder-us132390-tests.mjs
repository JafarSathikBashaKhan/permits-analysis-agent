/**
 * US-132390 — Permission Setup | Builder — Permissions Tab > Overview > Start Date Settings
 *
 * ACs covered:
 *   - When on Overview > General Settings, the FIRST grouped section is "Start Date Settings".
 *   - Fields present: Start Date Policy (mandatory), Include Time (checkbox), Start Date Delay (mandatory numeric 0-100, default 0).
 *   - Start Date Policy dropdown lists exactly:
 *       Issue Now, Backdated to Start of the Month, Backdated to Start of the Application, Forward to Set Date.
 *   - Include Time and Start Date Delay are ENABLED only when policy = "Forward to Set Date".
 *   - Include Time and Start Date Delay are DISABLED for the other 3 options.
 *   - Delay accepts 0 and 100 (boundary values); clamps > 100 → 100, < 0 → 0.
 *   - Delay is required when policy = "Forward to Set Date" (empty shows error).
 *   - Selecting Include Time is possible only when policy = "Forward to Set Date".
 *   - All Start Date Settings values persist across page reload.
 *
 * Run: node scripts/tests/builder-us132390-tests.mjs
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

async function pickPolicy(page, optId) {
  // MUI Select: click combobox, then click option
  const combo = page.locator('[data-testid="start-date-policy-select"]')
    .locator('xpath=../div[@role="combobox"]');
  await combo.click();
  await wait(200);
  await page.getByTestId(`start-date-policy-opt-${optId}`).click();
  await wait(200);
}

async function readPolicyValue(page) {
  const combo = page.locator('[data-testid="start-date-policy-select"]')
    .locator('xpath=../div[@role="combobox"]');
  return (await combo.textContent()).trim();
}

// ---------- Tests ----------

async function testHeadingIsFirstSection(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const heading = page.getByTestId('start-date-settings-heading');
  const visible = await heading.isVisible();
  const text = visible ? (await heading.textContent()).trim() : '';
  const shot = await snap(page, 'US-132390.heading.startDateSettings');
  record('US-132390.heading.present',
    '"Start Date Settings" heading rendered under General Settings',
    visible && /start date settings/i.test(text),
    `text="${text}"`, shot);
}

async function testFieldsPresent(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const select = await page.getByTestId('start-date-policy-select').count();
  const chk = await page.getByTestId('include-time-checkbox').count();
  const delay = await page.getByTestId('start-date-delay-input').count();
  record('US-132390.fields.allPresent',
    'Start Date Policy, Include Time, Start Date Delay all rendered',
    select > 0 && chk > 0 && delay > 0,
    `select=${select}, includeTime=${chk}, delay=${delay}`);
}

async function testDropdownOptionsExact(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const combo = page.locator('[data-testid="start-date-policy-select"]')
    .locator('xpath=../div[@role="combobox"]');
  await combo.click();
  await wait(300);
  const shot = await snap(page, 'US-132390.dropdown.options');
  const opts = await page.locator('.MuiMenu-list [role="option"]').allTextContents();
  await page.keyboard.press('Escape');
  const trimmed = opts.map((o) => o.trim()).filter(Boolean);
  const expected = [
    'Issue Now',
    'Backdated to Start of the Month',
    'Backdated to Start of the Application',
    'Forward to Set Date',
  ];
  const missing = expected.filter((e) => !trimmed.includes(e));
  const extra = trimmed.filter((o) => o !== 'Select' && !expected.includes(o));
  record('US-132390.dropdown.exactOptions',
    'Start Date Policy exposes exactly the 4 required options',
    missing.length === 0 && extra.length === 0,
    `options=${JSON.stringify(trimmed)}${missing.length ? ` missing=${JSON.stringify(missing)}` : ''}${extra.length ? ` extra=${JSON.stringify(extra)}` : ''}`,
    shot);
}

async function testDelayDefaultZero(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const v = await page.getByTestId('start-date-delay-input').inputValue();
  record('US-132390.delay.defaultZero',
    'Start Date Delay defaults to 0',
    v === '0',
    `value="${v}"`);
}

async function testIncludeTimeDisabledByDefault(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const disabled = await page.getByTestId('include-time-checkbox').isDisabled();
  record('US-132390.includeTime.disabledInitially',
    'Include Time checkbox is disabled when no policy is selected',
    disabled,
    `disabled=${disabled}`);
}

async function testDelayDisabledByDefault(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  const disabled = await page.getByTestId('start-date-delay-input').isDisabled();
  record('US-132390.delay.disabledInitially',
    'Start Date Delay field is disabled when no policy / non-Forward policy is selected',
    disabled,
    `disabled=${disabled}`);
}

async function testIssueNowDisablesDelayAndIncludeTime(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'issue-now');
  const chkDisabled = await page.getByTestId('include-time-checkbox').isDisabled();
  const delayDisabled = await page.getByTestId('start-date-delay-input').isDisabled();
  const shot = await snap(page, 'US-132390.policy.issueNow');
  record('US-132390.policy.issueNowDisablesDependents',
    'Issue Now → Include Time and Delay remain disabled',
    chkDisabled && delayDisabled,
    `chkDisabled=${chkDisabled} delayDisabled=${delayDisabled}`, shot);
}

async function testBackdatedMonthDisablesDependents(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'backdated-month');
  const chkDisabled = await page.getByTestId('include-time-checkbox').isDisabled();
  const delayDisabled = await page.getByTestId('start-date-delay-input').isDisabled();
  record('US-132390.policy.backdatedMonthDisablesDependents',
    'Backdated to Start of the Month → Include Time and Delay disabled',
    chkDisabled && delayDisabled);
}

async function testBackdatedAppDisablesDependents(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'backdated-application');
  const chkDisabled = await page.getByTestId('include-time-checkbox').isDisabled();
  const delayDisabled = await page.getByTestId('start-date-delay-input').isDisabled();
  record('US-132390.policy.backdatedApplicationDisablesDependents',
    'Backdated to Start of the Application → Include Time and Delay disabled',
    chkDisabled && delayDisabled);
}

async function testForwardEnablesDependents(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  const chkDisabled = await page.getByTestId('include-time-checkbox').isDisabled();
  const delayDisabled = await page.getByTestId('start-date-delay-input').isDisabled();
  const shot = await snap(page, 'US-132390.policy.forwardEnables');
  record('US-132390.policy.forwardEnablesDependents',
    'Forward to Set Date → Include Time and Start Date Delay become ENABLED',
    !chkDisabled && !delayDisabled,
    `chkDisabled=${chkDisabled} delayDisabled=${delayDisabled}`, shot);
}

async function testIncludeTimeToggleWorks(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  const chk = page.getByTestId('include-time-checkbox');
  await chk.check();
  const c1 = await chk.isChecked();
  await chk.uncheck();
  const c2 = await chk.isChecked();
  record('US-132390.includeTime.toggleWorks',
    'Include Time checkbox toggles on/off when enabled',
    c1 === true && c2 === false,
    `afterCheck=${c1} afterUncheck=${c2}`);
}

async function testDelayAcceptsZero(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  const input = page.getByTestId('start-date-delay-input');
  await input.fill('0');
  await wait(150);
  const v = await input.inputValue();
  record('US-132390.delay.acceptsZero',
    'Start Date Delay accepts 0 (today allowed)',
    v === '0',
    `value="${v}"`);
}

async function testDelayAcceptsHundred(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  const input = page.getByTestId('start-date-delay-input');
  await input.fill('100');
  await wait(150);
  const v = await input.inputValue();
  record('US-132390.delay.acceptsHundred',
    'Start Date Delay accepts 100 (upper boundary)',
    v === '100',
    `value="${v}"`);
}

async function testDelayClampsAbove100(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  const input = page.getByTestId('start-date-delay-input');
  await input.fill('150');
  await wait(150);
  const v = await input.inputValue();
  record('US-132390.delay.clampsAboveHundred',
    'Values above 100 are clamped to 100',
    v === '100',
    `value="${v}"`);
}

async function testDelayClampsBelowZero(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  const input = page.getByTestId('start-date-delay-input');
  await input.fill('-5');
  await wait(150);
  const v = await input.inputValue();
  record('US-132390.delay.clampsBelowZero',
    'Negative values are clamped to 0',
    v === '0',
    `value="${v}"`);
}

async function testDelayRequiredError(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  const input = page.getByTestId('start-date-delay-input');
  await input.fill('');
  await wait(200);
  // Playwright: aria-invalid on the input reflects error state
  const invalid = await input.getAttribute('aria-invalid');
  const shot = await snap(page, 'US-132390.delay.requiredError');
  record('US-132390.delay.requiredWhenForward',
    'Empty Delay shows validation error when policy is Forward to Set Date',
    invalid === 'true',
    `aria-invalid="${invalid}"`, shot);
}

async function testPolicyPersistsAcrossReload(page) {
  const id = await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  await page.getByTestId('start-date-delay-input').fill('7');
  await page.getByTestId('include-time-checkbox').check();
  await wait(300);
  // Save draft to persist to storage
  const saveBtn = page.getByRole('button', { name: /save.*draft|save draft/i }).first();
  if (await saveBtn.isVisible().catch(() => false)) {
    await saveBtn.click();
    await wait(600);
  }
  // Reload and reopen
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(400);
  await openGeneralSettings(page);
  const policyText = await readPolicyValue(page);
  const delayVal = await page.getByTestId('start-date-delay-input').inputValue();
  const chkChecked = await page.getByTestId('include-time-checkbox').isChecked();
  const shot = await snap(page, 'US-132390.persist.afterReload');
  record('US-132390.persist.acrossReload',
    'Start Date Policy, Delay and Include Time persist after reload',
    /forward to set date/i.test(policyText) && delayVal === '7' && chkChecked === true,
    `policy="${policyText}" delay="${delayVal}" includeTime=${chkChecked} id=${id}`, shot);
}

async function testSwitchingAwayResetsDependents(page) {
  await openDraftPermission(page);
  await openGeneralSettings(page);
  await pickPolicy(page, 'forward-set-date');
  await page.getByTestId('start-date-delay-input').fill('5');
  await page.getByTestId('include-time-checkbox').check();
  await wait(200);
  // Switch to Issue Now — Include Time and Delay should become disabled again
  await pickPolicy(page, 'issue-now');
  const chkDisabled = await page.getByTestId('include-time-checkbox').isDisabled();
  const delayDisabled = await page.getByTestId('start-date-delay-input').isDisabled();
  record('US-132390.policy.switchDisablesDependents',
    'Switching back to a non-Forward policy re-disables Include Time and Delay',
    chkDisabled && delayDisabled,
    `chkDisabled=${chkDisabled} delayDisabled=${delayDisabled}`);
}

// ---------- Runner ----------

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const suites = [
    ['heading is first section',      testHeadingIsFirstSection],
    ['fields present',                testFieldsPresent],
    ['dropdown exact 4 options',      testDropdownOptionsExact],
    ['delay default zero',            testDelayDefaultZero],
    ['include time disabled default', testIncludeTimeDisabledByDefault],
    ['delay disabled default',        testDelayDisabledByDefault],
    ['issue now disables deps',       testIssueNowDisablesDelayAndIncludeTime],
    ['backdated month disables',      testBackdatedMonthDisablesDependents],
    ['backdated app disables',        testBackdatedAppDisablesDependents],
    ['forward enables deps',          testForwardEnablesDependents],
    ['include time toggle',           testIncludeTimeToggleWorks],
    ['delay accepts 0',               testDelayAcceptsZero],
    ['delay accepts 100',             testDelayAcceptsHundred],
    ['delay clamp > 100',             testDelayClampsAbove100],
    ['delay clamp < 0',               testDelayClampsBelowZero],
    ['delay required error',          testDelayRequiredError],
    ['switch away resets deps',       testSwitchingAwayResetsDependents],
    ['persistence across reload',     testPolicyPersistsAcrossReload],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-132390.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-132390 Builder Start Date Settings',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us132390-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-132390 Report</title>
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
<h1>US-132390 — Builder Start Date Settings</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us132390-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us132390-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
