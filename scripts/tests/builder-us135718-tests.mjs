/**
 * US-135718 — Permission Setup | Builder — Permissions Tab Sub Menus / Sections
 *
 * ACs covered:
 *  1. Permissions tab shows the 10 static sub-sections in the AC-specified order:
 *     Basic Information, General Settings, Payment Settings, Discount settings,
 *     Document type settings, Merchant settings, Expiration and Renewals,
 *     Email templates, Operation criteria, Visitor portal (VRN only) setting
 *  2. Each sub-section is selectable and shows its own content
 *  3. Save Draft: mandatory Basic Information fields are enforced.
 *     - Empty required fields => "This field is required" error, save is blocked
 *     - All filled => draft saves successfully
 *  4. Publish: button available when not published; publish is blocked when other
 *     sub-menus' mandatory fields are unfilled (validation dialog appears)
 *
 * Run: node scripts/tests/builder-us135718-tests.mjs
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
  if (!rows.length) throw new Error('no rows');
  const id = (await rows[0].getAttribute('data-testid')).replace('row-', '');
  await page.getByTestId(`row-name-${id}`).click();
  await wait(500);
  return id;
}

// AC-required sub-sections, in AC order.
const AC_SECTIONS = [
  { label: 'Basic Information',        testid: 'subnav-basic-information' },
  { label: 'General Settings',         testid: 'subnav-general-settings' },
  { label: 'Payment Settings',         testid: 'subnav-payment-settings' },
  { label: 'Discount Settings',        testid: 'subnav-discount-settings' },
  { label: 'Document Type Settings',   testid: 'subnav-document-type-settings' },
  { label: 'Merchant Settings',        testid: 'subnav-merchant-settings' },
  { label: 'Renewals and Reminders',   testid: 'subnav-renewals-and-reminders' }, // AC: "Expiration and Renewals"
  { label: 'Email Templates',          testid: 'subnav-email-templates' },
  { label: 'Operation Criteria',       testid: 'subnav-operation-criteria' },
  { label: 'Visitor Portal Settings',  testid: 'subnav-visitor-portal-settings' }, // AC: "Visitor portal (VRN only) setting"
];

// ---------- Test suites ----------

async function testSubNavRendered(page) {
  await openFirstPermission(page);
  const subnav = await page.getByTestId('permissions-subnav').isVisible();
  record('US-135718.subnav.rendered', 'Permissions tab renders the sub-navigation list', subnav);
  const shot = await snap(page, 'US-135718.subnav.rendered');
  results[results.length - 1].shot = shot;
}

async function testAllAcSectionsPresent(page) {
  await openFirstPermission(page);
  for (const sec of AC_SECTIONS) {
    const visible = await page.getByTestId(sec.testid).isVisible().catch(() => false);
    record(`US-135718.subnav.has-${sec.testid}`, `Sub-section "${sec.label}" is present`, visible);
  }
}

async function testSectionOrder(page) {
  await openFirstPermission(page);
  // Read all subnav items in DOM order.
  const domOrder = await page.locator('[data-testid^="subnav-"]').evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-testid'))
  );
  // Extract indices of the AC-listed ones; must be strictly ascending.
  const indices = AC_SECTIONS.map((s) => domOrder.indexOf(s.testid));
  const allFound = indices.every((i) => i >= 0);
  const strictlyAscending = indices.every((v, i) => i === 0 || v > indices[i - 1]);
  record('US-135718.subnav.acSectionsFound',
    'All AC-required sub-sections found in DOM',
    allFound,
    `indices=${JSON.stringify(indices)}`);
  record('US-135718.subnav.acOrderPreserved',
    'AC-required sub-sections appear in the fixed AC order (relative)',
    allFound && strictlyAscending,
    `dom=${JSON.stringify(domOrder)}`);
}

async function testEachSectionSelectable(page) {
  await openFirstPermission(page);
  for (const sec of AC_SECTIONS) {
    await page.getByTestId(sec.testid).click();
    await wait(250);
    const active = await page.getByTestId(sec.testid).getAttribute('data-active');
    record(`US-135718.subnav.select-${sec.testid}`,
      `Clicking "${sec.label}" activates that section`,
      active === 'true',
      `data-active=${active}`);
  }
  // Re-open Operation Criteria and verify its content renders.
  await page.getByTestId('subnav-operation-criteria').click();
  await wait(400);
  const opVisible = await page.getByTestId('section-heading-operation-criteria').isVisible().catch(() => false);
  const shot = await snap(page, 'US-135718.subnav.operationCriteriaOpen');
  record('US-135718.subnav.operationCriteriaContent',
    'Operation Criteria section content is rendered',
    opVisible,
    '',
    shot);
}

async function testBasicInfoDefaultActive(page) {
  await openFirstPermission(page);
  const active = await page.getByTestId('subnav-basic-information').getAttribute('data-active');
  record('US-135718.subnav.basicInfoDefault',
    'Basic Information is active by default on opening a permission',
    active === 'true',
    `data-active=${active}`);
}

async function testSaveDraftBlocksWhenBasicInfoEmpty(page) {
  await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(400);

  // Clear all Basic Information text inputs (Permission Name and Description are the two text ones).
  const textboxes = page.locator('input[type="text"], textarea, input:not([type])');
  const count = await textboxes.count();
  for (let i = 0; i < count; i++) {
    const el = textboxes.nth(i);
    if (!(await el.isVisible().catch(() => false))) continue;
    try {
      await el.click({ clickCount: 3 });
      await el.press('Delete');
      await el.fill('');
    } catch { /* MUI Autocomplete inputs may be read-only */ }
  }

  await page.getByTestId('save-draft-button').click();
  await wait(700);

  const errorToast = await page.locator('text=/This field is required/i').first().isVisible().catch(() => false);
  const shotAfter = await snap(page, 'US-135718.saveDraft.errorShown');
  record('US-135718.saveDraft.blockedOnEmpty',
    'Save Draft is blocked when Basic Information mandatory fields are empty',
    errorToast,
    `toast visible=${errorToast}`,
    shotAfter);

  // Per-field errors: FormRow renders errors as a red Typography under the input.
  // Count occurrences of "This field is required" in the Basic Information panel (excluding the toast).
  const bodyMatches = await page.locator('[data-field] :text("This field is required")').count();
  record('US-135718.saveDraft.perFieldErrors',
    'Per-field "This field is required" errors are visible after failed Save Draft',
    bodyMatches >= 1,
    `field errors=${bodyMatches}`);
}

async function testSaveDraftSucceedsWhenFilled(page) {
  await openFirstPermission(page);
  await page.getByTestId('subnav-basic-information').click();
  await wait(300);

  // Open row already has all Basic Info populated (seeded). Just re-click Save.
  await page.getByTestId('save-draft-button').click();
  await wait(600);
  const successToast = await page.locator('text=/Draft saved/i').first().isVisible().catch(() => false);
  const shot = await snap(page, 'US-135718.saveDraft.success');
  record('US-135718.saveDraft.succeedsWhenFilled',
    'Save Draft succeeds when all Basic Information fields are filled',
    successToast,
    `toast=${successToast}`,
    shot);
}

async function testPublishButtonAvailable(page) {
  await openFirstPermission(page);
  const publishVisible = await page.getByTestId('publish-button').isVisible();
  record('US-135718.publish.buttonVisible',
    'Publish button is available on the configuration screen',
    publishVisible);
}

async function testPublishBlockedWhenIncomplete(page) {
  // Create a new permission to guarantee mandatory sub-sections are unfilled.
  await page.goto(`${BASE}/builder/new`);
  await page.waitForLoadState('networkidle');
  await wait(500);

  const publishBtn = page.getByTestId('publish-button');
  if (!(await publishBtn.isVisible())) {
    record('US-135718.publish.blockedIncomplete', 'Publish button hidden on /new', false, 'no publish button');
    return;
  }
  await publishBtn.click();
  await wait(500);

  const dialogVisible = await page.locator('.MuiDialog-root:has-text("fix the following before publishing")').isVisible().catch(() => false);
  const shot = await snap(page, 'US-135718.publish.blockedIncomplete');
  record('US-135718.publish.blockedIncomplete',
    'Publish is restricted and validation dialog appears when mandatory fields are unfilled',
    dialogVisible,
    `dialog=${dialogVisible}`,
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
    ['sub-nav rendered',           testSubNavRendered],
    ['all AC sections present',    testAllAcSectionsPresent],
    ['section order',              testSectionOrder],
    ['sections selectable',        testEachSectionSelectable],
    ['basic info default active',  testBasicInfoDefaultActive],
    ['save draft blocked',         testSaveDraftBlocksWhenBasicInfoEmpty],
    ['save draft success',         testSaveDraftSucceedsWhenFilled],
    ['publish button available',   testPublishButtonAvailable],
    ['publish blocked incomplete', testPublishBlockedWhenIncomplete],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-135718.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-135718 Builder Permissions Tab Sub-Sections',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us135718-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-135718 Report</title>
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
<h1>US-135718 — Builder Permissions Tab Sub-Sections</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us135718-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us135718-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
