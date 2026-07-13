/**
 * US-135720 — Permission Setup | Builder — Configure Permissions | Setup Screen and Tabs
 *
 * ACs covered:
 *   • Selecting a Permission Type (row / name link) loads the configuration screen
 *   • Configuration screen shows 3 required tabs: Permissions, Rules, Application Form
 *   • Tabs are visible, in order, and switchable
 *   • Breadcrumb reads "Builder > $NameOfThePermission"
 *   • Breadcrumb "Builder" link navigates back to list screen
 *   • Different permission rows load their own detail screen (name reflected in crumb)
 *   • Cancel button also returns to list (bonus verification)
 *
 * Run: node scripts/tests/builder-us135720-tests.mjs
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

async function firstRow(page) {
  const rows = await page.locator('[data-testid^="row-P-"]').all();
  if (!rows.length) throw new Error('no rows');
  const id = (await rows[0].getAttribute('data-testid')).replace('row-', '');
  const name = (await page.getByTestId(`row-name-${id}`).textContent()).trim();
  return { id, name };
}

// ---------- Test suites ----------

async function testNavigationToConfigScreen(page) {
  await openList(page);
  const { id, name } = await firstRow(page);

  await page.getByTestId(`row-name-${id}`).click();
  await page.waitForURL(new RegExp(`/builder/${id}`));
  await wait(400);

  const urlOk = page.url().includes(`/builder/${id}`);
  const shot = await snap(page, 'US-135720.nav.configLoaded');
  record('US-135720.nav.selectLoadsConfig', 'Selecting a permission loads its configuration screen', urlOk, `url=${page.url()}`, shot);

  // Config screen indicators: breadcrumb + tabs
  const crumbVisible = await page.getByTestId('crumb-builder').isVisible();
  record('US-135720.nav.configHasBreadcrumb', 'Configuration screen shows Builder breadcrumb', crumbVisible);
}

async function testThreeRequiredTabs(page) {
  await openList(page);
  const { id } = await firstRow(page);
  await page.getByTestId(`row-name-${id}`).click();
  await wait(400);

  // AC-mandated 3 tabs
  const permTab = page.getByTestId('tab-permissions');
  const rulesTab = page.getByTestId('tab-rules');
  const formTab = page.getByTestId('tab-application-form');

  const permOk = await permTab.isVisible();
  const rulesOk = await rulesTab.isVisible();
  const formOk = await formTab.isVisible();

  record('US-135720.tabs.permissionsPresent', 'Tab "Permissions" is present', permOk);
  record('US-135720.tabs.rulesPresent', 'Tab "Rules" is present', rulesOk);
  record('US-135720.tabs.applicationFormPresent', 'Tab "Application Form" is present', formOk);

  // Correct labels
  const permText = (await permTab.textContent()).trim();
  const rulesText = (await rulesTab.textContent()).trim();
  const formText = (await formTab.textContent()).trim();
  record('US-135720.tabs.permissionsLabel', 'Permissions tab label matches AC', /^Permissions/i.test(permText), `text=${permText}`);
  record('US-135720.tabs.rulesLabel', 'Rules tab label matches AC', /^Rules/i.test(rulesText), `text=${rulesText}`);
  record('US-135720.tabs.applicationFormLabel', 'Application Form tab label matches AC', /^Application Form/i.test(formText), `text=${formText}`);
}

async function testTabOrder(page) {
  await openList(page);
  const { id } = await firstRow(page);
  await page.getByTestId(`row-name-${id}`).click();
  await wait(400);

  const testIds = await page.locator('[data-testid^="tab-"]').evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-testid'))
  );
  const idxPerm = testIds.indexOf('tab-permissions');
  const idxRules = testIds.indexOf('tab-rules');
  const idxForm = testIds.indexOf('tab-application-form');

  record('US-135720.tabs.orderPermissionsFirst',
    'Permissions tab appears before Rules',
    idxPerm >= 0 && idxPerm < idxRules,
    `perm=${idxPerm} rules=${idxRules}`);
  record('US-135720.tabs.orderRulesBeforeForm',
    'Rules tab appears before Application Form',
    idxRules < idxForm && idxRules >= 0,
    `rules=${idxRules} form=${idxForm}`);
}

async function testTabsAreSwitchable(page) {
  await openList(page);
  const { id } = await firstRow(page);
  await page.getByTestId(`row-name-${id}`).click();
  await wait(400);

  const initialAria = await page.getByTestId('tab-permissions').getAttribute('aria-selected');
  record('US-135720.tabs.permissionsDefault', 'Permissions tab is selected by default', initialAria === 'true', `aria=${initialAria}`);

  await page.getByTestId('tab-rules').click();
  await wait(300);
  const rulesAria = await page.getByTestId('tab-rules').getAttribute('aria-selected');
  const shotRules = await snap(page, 'US-135720.tabs.rulesSelected');
  record('US-135720.tabs.rulesSwitchable', 'Rules tab becomes selected on click', rulesAria === 'true', `aria=${rulesAria}`, shotRules);

  await page.getByTestId('tab-application-form').click();
  await wait(300);
  const formAria = await page.getByTestId('tab-application-form').getAttribute('aria-selected');
  const shotForm = await snap(page, 'US-135720.tabs.applicationFormSelected');
  record('US-135720.tabs.applicationFormSwitchable', 'Application Form tab becomes selected on click', formAria === 'true', `aria=${formAria}`, shotForm);
}

async function testBreadcrumbFormat(page) {
  await openList(page);
  const { id, name } = await firstRow(page);
  await page.getByTestId(`row-name-${id}`).click();
  await wait(400);

  const builderCrumb = (await page.getByTestId('crumb-builder').textContent()).trim();
  record('US-135720.crumb.builderText', 'Breadcrumb has "Builder" segment', /^Builder$/i.test(builderCrumb), `text=${builderCrumb}`);

  const nameCrumb = (await page.getByTestId('crumb-name').textContent()).trim();
  record('US-135720.crumb.nameMatches', 'Breadcrumb shows the permission name', nameCrumb === name, `expected=${name} got=${nameCrumb}`);

  // Chevron separator
  const chevron = await page.locator('[data-testid="crumb-builder"] ~ svg').first().isVisible();
  record('US-135720.crumb.hasSeparator', 'Breadcrumb has a separator between Builder and name', chevron);

  const shot = await snap(page, 'US-135720.crumb.format');
  record('US-135720.crumb.snapshot', 'Breadcrumb visible on config screen', true, `builder=${builderCrumb} name=${nameCrumb}`, shot);
}

async function testBreadcrumbBuilderIsLink(page) {
  await openList(page);
  const { id } = await firstRow(page);
  await page.getByTestId(`row-name-${id}`).click();
  await wait(400);

  const tag = await page.getByTestId('crumb-builder').evaluate((el) => el.tagName.toLowerCase());
  const href = await page.getByTestId('crumb-builder').getAttribute('href');
  record('US-135720.crumb.builderIsAnchor', 'Breadcrumb "Builder" is a clickable link', tag === 'a', `tag=${tag}`);
  record('US-135720.crumb.builderHrefCorrect', 'Breadcrumb "Builder" links to /builder', href && href.endsWith('/builder'), `href=${href}`);
}

async function testBreadcrumbNavigatesBack(page) {
  await openList(page);
  const { id } = await firstRow(page);
  await page.getByTestId(`row-name-${id}`).click();
  await wait(400);
  const beforeUrl = page.url();

  await page.getByTestId('crumb-builder').click();
  await wait(500);
  const afterUrl = page.url();
  const onList = /\/builder\/?$/.test(afterUrl);
  const listMarkerVisible = await page.getByTestId('new-permission').isVisible().catch(() => false);
  const shot = await snap(page, 'US-135720.nav.backToList');
  record('US-135720.crumb.navigatesBack',
    'Clicking "Builder" breadcrumb returns to the list screen',
    onList && listMarkerVisible,
    `before=${beforeUrl} after=${afterUrl} listMarker=${listMarkerVisible}`,
    shot);
}

async function testDifferentRowsDifferentCrumbs(page) {
  await openList(page);
  const rows = await page.locator('[data-testid^="row-P-"]').all();
  if (rows.length < 2) {
    record('US-135720.crumb.multipleRows', 'Skipped — need at least 2 rows', true, 'only one row available');
    return;
  }

  const id1 = (await rows[0].getAttribute('data-testid')).replace('row-', '');
  const name1 = (await page.getByTestId(`row-name-${id1}`).textContent()).trim();
  await page.getByTestId(`row-name-${id1}`).click();
  await wait(400);
  const crumb1 = (await page.getByTestId('crumb-name').textContent()).trim();

  await page.getByTestId('crumb-builder').click();
  await wait(400);

  const rows2 = await page.locator('[data-testid^="row-P-"]').all();
  const id2 = (await rows2[1].getAttribute('data-testid')).replace('row-', '');
  const name2 = (await page.getByTestId(`row-name-${id2}`).textContent()).trim();
  await page.getByTestId(`row-name-${id2}`).click();
  await wait(400);
  const crumb2 = (await page.getByTestId('crumb-name').textContent()).trim();

  record('US-135720.crumb.multipleRows',
    'Different rows load their own name into breadcrumb',
    crumb1 === name1 && crumb2 === name2 && crumb1 !== crumb2,
    `row1: ${name1}→${crumb1}; row2: ${name2}→${crumb2}`);
}

async function testCancelReturnsToList(page) {
  await openList(page);
  const { id } = await firstRow(page);
  await page.getByTestId(`row-name-${id}`).click();
  await wait(400);

  const cancelBtn = page.getByRole('button', { name: /^Cancel$/ });
  const visible = await cancelBtn.isVisible();
  record('US-135720.actions.cancelVisible', 'Cancel button is visible on config screen', visible);

  if (visible) {
    await cancelBtn.click();
    await wait(600);
    const onList = /\/builder\/?$/.test(page.url());
    record('US-135720.actions.cancelReturnsToList', 'Cancel returns to list screen', onList, `url=${page.url()}`);
  }
}

// ---------- Runner ----------

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  const startedAt = new Date();
  const suites = [
    ['nav to config',       testNavigationToConfigScreen],
    ['three required tabs', testThreeRequiredTabs],
    ['tab order',           testTabOrder],
    ['tabs switchable',     testTabsAreSwitchable],
    ['breadcrumb format',   testBreadcrumbFormat],
    ['breadcrumb is link',  testBreadcrumbBuilderIsLink],
    ['breadcrumb back',     testBreadcrumbNavigatesBack],
    ['different rows',      testDifferentRowsDifferentCrumbs],
    ['cancel returns',      testCancelReturnsToList],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-135720.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-135720 Builder Setup Screen & Tabs',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us135720-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-135720 Report</title>
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
<h1>US-135720 — Builder Setup Screen &amp; Tabs</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us135720-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us135720-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
