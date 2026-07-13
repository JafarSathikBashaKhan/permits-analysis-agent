/**
 * US-181519 — Permission Setup | Builder | Permission Label
 *              Configure the label text shown on the application form via a
 *              rich text editor.
 *
 * ACs:
 *  1. Builder shows a "Permission Label" section (subnav item present).
 *  2. Selecting Permission Label reveals a rich text editor.
 *  3. Text formatting: Bold, Italic, Underline.
 *  4. Font size and font family are configurable.
 *  5. Alignment: Left, Center, Right.
 *  6. Ordered and Unordered lists.
 *  7. Hyperlinks.
 *  8. Cut / Copy / Paste / Undo / Redo (Undo & Redo tested explicitly).
 *  9. Content persists to storage and is displayed on the application form
 *     (Buy Now drawer).
 *
 * Run: node scripts/tests/builder-us181519-tests.mjs
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
    localStorage.setItem('prototype:builder:groups:rows', JSON.stringify([
      mk('City Centre', 'Zonal'), mk('Business', 'Non-Zonal'),
    ]));
  });
}

async function resetStorage(page) {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:builder:') && !k.endsWith(':groups:rows')) localStorage.removeItem(k);
      if (k.startsWith('prototype:permissionLabel:')) localStorage.removeItem(k);
    }
  });
  await seedGroups(page);
}

async function openDraft(page) {
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  const rows = await page.evaluate(() => {
    const raw = localStorage.getItem('prototype:builder:list:rows');
    return raw ? JSON.parse(raw) : [];
  });
  const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft');
  if (!draft) throw new Error('no draft row');
  await page.getByTestId(`row-name-${draft.id}`).click();
  await wait(500);
  return draft;
}

async function openLabelSection(page) {
  await page.getByTestId('subnav-permission-label').click();
  await wait(400);
}

async function typeInEditor(page, text) {
  const ed = page.getByTestId('permission-label-editor');
  await ed.click();
  await ed.press('Control+A');
  await ed.press('Delete');
  await page.keyboard.type(text);
  await wait(120);
}

async function readEditorHtml(page) {
  return (await page.getByTestId('permission-label-editor').innerHTML()).trim();
}

// ─── Tests ────────────────────────────────────────────────────────────────

async function testSectionSubnavPresent(page) {
  await openDraft(page);
  const visible = await page.getByTestId('subnav-permission-label').isVisible();
  const shot = await snap(page, 'US-181519.subnav.present');
  record('US-181519.subnav.present',
    'Permission Label appears in the Permissions sub-navigation',
    visible, `visible=${visible}`, shot);
}

async function testEditorAndToolbarPresent(page) {
  await openDraft(page); await openLabelSection(page);
  const editor = await page.getByTestId('permission-label-editor').isVisible();
  const toolbar = await page.getByTestId('permission-label-toolbar').isVisible();
  const shot = await snap(page, 'US-181519.editor.present');
  record('US-181519.editor.toolbarAndSurfacePresent',
    'A rich text editor surface and formatting toolbar are rendered',
    editor && toolbar, `editor=${editor} toolbar=${toolbar}`, shot);
}

async function testBoldItalicUnderline(page) {
  await openDraft(page); await openLabelSection(page);
  await typeInEditor(page, 'Hello world');
  // Select all, then apply B/I/U
  await page.getByTestId('permission-label-editor').press('Control+A');
  await page.getByTestId('permission-label-btn-bold').click();
  await page.getByTestId('permission-label-btn-italic').click();
  await page.getByTestId('permission-label-btn-underline').click();
  await wait(150);
  const html = (await readEditorHtml(page)).toLowerCase();
  // execCommand may emit <b>/<strong>, <i>/<em>, <u>
  const hasB = /<(b|strong)[\s>]/.test(html);
  const hasI = /<(i|em)[\s>]/.test(html);
  const hasU = /<u[\s>]/.test(html);
  const shot = await snap(page, 'US-181519.format.biu');
  record('US-181519.format.boldItalicUnderline',
    'Bold, italic and underline formatting are applied to selected text',
    hasB && hasI && hasU, `html=${html.slice(0, 220)}`, shot);
}

async function testFontSizeAndFamily(page) {
  await openDraft(page); await openLabelSection(page);
  await typeInEditor(page, 'Sized text');
  await page.getByTestId('permission-label-editor').press('Control+A');
  // Font size 5 (18pt)
  await page.locator('[data-testid="permission-label-font-size"]').click();
  await wait(100);
  await page.getByTestId('permission-label-font-size-opt-5').click();
  await wait(150);
  // Font family Georgia
  await page.locator('[data-testid="permission-label-font-family"]').click();
  await wait(100);
  await page.getByTestId('permission-label-font-family-opt-Georgia').click();
  await wait(150);
  const html = (await readEditorHtml(page));
  // execCommand fontSize emits <font size="5">; fontName emits <font face="Georgia">
  const hasSize = /size=["']?5/i.test(html) || /font-size:\s*(?:1?[0-9]|2[0-4])p/i.test(html) || /<font[^>]+size/i.test(html);
  const hasFamily = /face=["']?Georgia/i.test(html) || /font-family:\s*Georgia/i.test(html);
  const shot = await snap(page, 'US-181519.format.fontSizeFamily');
  record('US-181519.format.fontSizeAndFamily',
    'Font size and font family selections are applied to selected text',
    hasSize && hasFamily, `hasSize=${hasSize} hasFamily=${hasFamily} html=${html.slice(0, 250)}`, shot);
}

async function testAlignment(page) {
  const cases = [
    ['permission-label-btn-align-left', /text-align:\s*left|align=["']?left/i, 'left'],
    ['permission-label-btn-align-center', /text-align:\s*center|align=["']?center/i, 'center'],
    ['permission-label-btn-align-right', /text-align:\s*right|align=["']?right/i, 'right'],
  ];
  const failures = [];
  for (const [btn, re, name] of cases) {
    await resetStorage(page);
    await openDraft(page); await openLabelSection(page);
    await typeInEditor(page, `${name} aligned`);
    await page.getByTestId('permission-label-editor').press('Control+A');
    // Apply center first to guarantee a non-default baseline so justifyLeft/Right emit inline style.
    if (name === 'left' || name === 'right') {
      await page.getByTestId('permission-label-btn-align-center').click();
      await wait(120);
    }
    await page.getByTestId(btn).click();
    await wait(200);
    const html = await readEditorHtml(page);
    if (!re.test(html)) failures.push(`${name}: ${html.slice(0, 200)}`);
  }
  const shot = await snap(page, 'US-181519.format.alignment');
  record('US-181519.format.leftCenterRight',
    'Left / Center / Right alignment can each be applied to selected text',
    failures.length === 0, failures.length ? failures.join(' | ') : 'all 3 alignments applied', shot);
}

async function testOrderedAndUnorderedLists(page) {
  await openDraft(page); await openLabelSection(page);
  await typeInEditor(page, 'apple');
  await page.getByTestId('permission-label-editor').press('Control+A');
  await page.getByTestId('permission-label-btn-ul').click();
  await wait(200);
  const ulHtml = await readEditorHtml(page);

  await resetStorage(page);
  await openDraft(page); await openLabelSection(page);
  await typeInEditor(page, 'one');
  await page.getByTestId('permission-label-editor').press('Control+A');
  await page.getByTestId('permission-label-btn-ol').click();
  await wait(200);
  const olHtml = await readEditorHtml(page);

  const shot = await snap(page, 'US-181519.format.lists');
  const hasUL = /<ul[\s>]/i.test(ulHtml);
  const hasOL = /<ol[\s>]/i.test(olHtml);
  record('US-181519.format.orderedAndUnorderedLists',
    'Ordered and unordered lists can be created from selected text',
    hasUL && hasOL, `ul=${hasUL} ol=${hasOL}`, shot);
}

async function testHyperlink(page) {
  await openDraft(page); await openLabelSection(page);
  await typeInEditor(page, 'GitHub');
  await page.getByTestId('permission-label-editor').press('Control+A');
  // Auto-accept the URL prompt
  page.once('dialog', (d) => d.accept('https://github.com'));
  await page.getByTestId('permission-label-btn-link').click();
  await wait(200);
  const html = await readEditorHtml(page);
  const shot = await snap(page, 'US-181519.format.link');
  const ok = /<a[^>]+href=["']https:\/\/github\.com["'][^>]*>GitHub<\/a>/i.test(html);
  record('US-181519.format.hyperlink',
    'A hyperlink wraps selected text with the provided URL',
    ok, `html=${html.slice(0, 200)}`, shot);
}

async function testUndoRedo(page) {
  await openDraft(page); await openLabelSection(page);
  const ed = page.getByTestId('permission-label-editor');
  await ed.click();
  await page.keyboard.type('Original', { delay: 40 });
  await wait(200);
  const before = (await readEditorHtml(page)).replace(/<[^>]+>/g, '').trim();
  // Break undo-coalescing by dispatching a beforeinput of type 'historyUndo' boundary:
  // simplest reliable trigger — blur + refocus resets the input-event typing group.
  await ed.blur();
  await wait(80);
  await ed.click();
  await page.keyboard.type(' extra', { delay: 40 });
  await wait(200);
  const middle = (await readEditorHtml(page)).replace(/<[^>]+>/g, '').trim();

  await page.getByTestId('permission-label-btn-undo').click();
  await wait(250);
  const afterUndo = (await readEditorHtml(page)).replace(/<[^>]+>/g, '').trim();

  await page.getByTestId('permission-label-btn-redo').click();
  await wait(250);
  const afterRedo = (await readEditorHtml(page)).replace(/<[^>]+>/g, '').trim();

  const shot = await snap(page, 'US-181519.edit.undoRedo');
  // Undo must produce a state that is NOT equal to middle (content changed).
  // Redo must restore back to middle. This matches the AC wording — "editor
  // should update the content accordingly while maintaining formatting" —
  // regardless of how the browser groups typing bursts into undo entries.
  const undoOk = afterUndo !== middle;
  const redoOk = afterRedo === middle;
  record('US-181519.edit.undoAndRedo',
    'Undo reverses the last change; Redo reapplies it',
    undoOk && redoOk,
    `before="${before}" middle="${middle}" undo="${afterUndo}" redo="${afterRedo}"`, shot);
}

async function testCopyPasteRoundTrip(page) {
  await openDraft(page); await openLabelSection(page);
  await typeInEditor(page, 'Copy me');
  await page.getByTestId('permission-label-editor').press('Control+A');
  await page.getByTestId('permission-label-editor').press('Control+C');
  await wait(150);
  // Move caret to the end and paste
  await page.getByTestId('permission-label-editor').press('End');
  await page.keyboard.type(' - ');
  await page.getByTestId('permission-label-editor').press('Control+V');
  await wait(250);
  const html = await readEditorHtml(page);
  // Decode &nbsp; entity and stray nbsp characters before asserting.
  const plain = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ').trim();
  const shot = await snap(page, 'US-181519.edit.copyPaste');
  const ok = /Copy me\s*-\s*Copy me/.test(plain);
  record('US-181519.edit.copyAndPaste',
    'Copy and Paste round-trip inserts the copied text at the caret',
    ok, `plain="${plain}"`, shot);
}

async function testPersistenceAfterReload(page) {
  await openDraft(page); await openLabelSection(page);
  await typeInEditor(page, 'Persisted label');
  await page.getByTestId('permission-label-editor').press('Control+A');
  await page.getByTestId('permission-label-btn-bold').click();
  await wait(200);
  const draftId = (await page.evaluate(() => {
    const raw = localStorage.getItem('prototype:builder:list:rows');
    const rows = raw ? JSON.parse(raw) : [];
    return (rows.find((r) => (r.status || '').toLowerCase() === 'draft') || {}).id;
  }));
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(500);
  await openLabelSection(page);
  const html = await readEditorHtml(page);
  const shot = await snap(page, 'US-181519.persistence.reload');
  const stored = await page.evaluate((k) => localStorage.getItem(k), `prototype:permissionLabel:${draftId}`);
  const ok = /Persisted label/.test(html) && /<(b|strong)[\s>]/i.test(html) && stored != null && stored.includes('Persisted label');
  record('US-181519.persistence.survivesReload',
    'Editor content and formatting persist across page reload',
    ok, `html=${html.slice(0, 200)}`, shot);
}

async function testLabelRendersOnApplicationForm(page) {
  await resetStorage(page);
  await openDraft(page);
  // Seed a Parking Bay draft with a published status and known label content.
  await page.evaluate(() => {
    const rows = JSON.parse(localStorage.getItem('prototype:builder:list:rows') || '[]');
    const draft = rows.find((r) => (r.status || '').toLowerCase() === 'draft') || rows[0];
    if (!draft) throw new Error('no draft to seed');
    // Ensure it appears in Buy Now
    draft.status = 'Published';
    draft.name = 'Parking Bay Permission';
    draft.basePrice = 25;
    draft.adminFee = 5;
    draft.type = 'Permit';
    draft.id = 'P-PARKINGBAY';
    localStorage.setItem('prototype:builder:list:rows', JSON.stringify([draft, ...rows.filter((r) => r.id !== draft.id)]));
    localStorage.setItem('prototype:permissionLabel:P-PARKINGBAY', JSON.stringify({
      labelText: '<p><strong>Parking Bay</strong> for <em>residents only</em>. <a href="https://help.example">Learn more</a></p>',
      displayLabel: 'Parking Bay',
      shortCode: 'PB', colour: '#1976D2', icon: 'directions_car',
      showOnPermit: true, showOnBadge: true, showOnDashboard: true,
    }));
    localStorage.setItem('prototype:contract-settings:state', JSON.stringify({
      tierPricing: false, dieselSurcharge: false,
    }));
  });
  await page.goto(`${BASE}/applicants`);
  await page.waitForLoadState('networkidle');
  await wait(400);
  await page.locator('button[title="Edit"]').first().click();
  await wait(300);
  await page.getByRole('tab', { name: 'Applications' }).click();
  await wait(300);
  await page.getByTestId('applicant-buy-now').click();
  await wait(500);
  await page.getByTestId('buynow-perm-card-P-PARKINGBAY').click();
  await wait(400);
  const hidden = (await page.getByTestId('buynow-hidden-label-html').textContent()).trim();
  const visible = await page.getByTestId('buynow-permission-label').isVisible().catch(() => false);
  const shot = await snap(page, 'US-181519.render.applicationForm');
  const ok = /Parking Bay/i.test(hidden) && /<strong/.test(hidden) && /<a[^>]+href=/.test(hidden) && visible;
  record('US-181519.render.appearsOnApplicationForm',
    'Permission label rich text is displayed on the application form (Buy Now)',
    ok, `visible=${visible} hidden="${hidden.slice(0, 180)}"`, shot);
}

// ─── Runner ───────────────────────────────────────────────────────────────

(async () => {
  const startedAt = new Date();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();

  const suites = [
    ['subnav present',              testSectionSubnavPresent],
    ['editor + toolbar rendered',   testEditorAndToolbarPresent],
    ['bold / italic / underline',   testBoldItalicUnderline],
    ['font size + family',          testFontSizeAndFamily],
    ['alignment L / C / R',         testAlignment],
    ['ordered + unordered lists',   testOrderedAndUnorderedLists],
    ['hyperlink',                   testHyperlink],
    ['undo + redo',                 testUndoRedo],
    ['copy + paste',                testCopyPasteRoundTrip],
    ['persistence after reload',    testPersistenceAfterReload],
    ['renders on application form', testLabelRendersOnApplicationForm],
  ];

  for (const [name, fn] of suites) {
    console.log(`\n▶ ${name}`);
    await resetStorage(page);
    try { await fn(page); }
    catch (e) { record(`US-181519.${name.replace(/\s+/g, '-')}.fatal`, `${name} crashed`, false, e.message); }
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
    suite: 'US-181519 Permission Label configuration',
    started: startedAt.toISOString(), ended: endedAt.toISOString(),
    durationMs: endedAt - startedAt, total: results.length, passed, failed, results,
  };
  fs.writeFileSync(path.join(outDir, 'us181519-report.json'), JSON.stringify(json, null, 2));

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rowHtml = (r) => `<tr class="${r.passed ? 'p' : 'f'}"><td>${r.id}</td><td>${r.passed ? '✅' : '❌'}</td><td>${esc(r.name)}</td><td><code>${esc(r.detail || '')}</code></td><td>${r.shot ? `<a href="${r.shot}" target="_blank"><img src="${r.shot}" class="thumb"/></a>` : ''}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>US-181519 Report</title>
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
<h1>US-181519 — Permission Label configuration</h1>
<div class="summary">
  <strong>Total:</strong> ${results.length} · <strong>Passed:</strong> <span class="pill ok">${passed}</span> · <strong>Failed:</strong> <span class="pill ${failed ? 'bad' : 'ok'}">${failed}</span><br>
  <strong>Duration:</strong> ${(json.durationMs / 1000).toFixed(1)}s
</div>
<table><thead><tr><th>ID</th><th></th><th>Assertion</th><th>Detail</th><th>Screenshot</th></tr></thead>
<tbody>${results.map(rowHtml).join('')}</tbody></table>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'us181519-report.html'), html);
  console.log(`\nReports:\n  ${path.join(outDir, 'us181519-report.html')}`);
  process.exit(failed ? 1 : 0);
})();
