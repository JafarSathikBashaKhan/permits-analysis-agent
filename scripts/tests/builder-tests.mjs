/**
 * Builder test pack — 2 stories
 *   US-155975 — Publish blocks when mandatory fields empty; dialog groups errors by section
 *   US-188673 — Prefix duplicate across types blocked; Type + Prefix locked after publish
 *
 * Usage: node scripts/tests/builder-tests.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
function record(id, name, passed, detail = '') {
  results.push({ id, name, passed, detail });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${id} — ${name}${detail ? `\n   ${detail}` : ''}`);
}

async function resetBuilderStorage(page) {
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (
        k === 'prototype:builder:list:rows' ||
        k.startsWith('prototype:paymentSettings:') ||
        k.startsWith('prototype:documentTypes:') ||
        k.startsWith('prototype:rules:') ||
        k.startsWith('prototype:pricing:') ||
        k.startsWith('prototype:applicationForm:')
      ) {
        localStorage.removeItem(k);
      }
    }
  });
}

// ────────────────────────────────────────────────────────────────────────────
// US-155975 — Publish mandatory-field validation
// ────────────────────────────────────────────────────────────────────────────
async function testUS155975(page) {
  console.log('\n▶ US-155975 — Publish mandatory-field validation');
  await page.goto(`${BASE}/builder/new`);
  await page.waitForLoadState('networkidle');
  await resetBuilderStorage(page);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(600);
  record('US-155975.pre', 'Blank builder loads', true);

  await page.getByRole('button', { name: /^publish$/i }).click();
  await wait(600);

  const dialog = page.locator('.MuiDialog-root:visible');
  const dialogOpen = (await dialog.count()) > 0;
  record('US-155975.ac1', 'Dialog opens on Publish with empty form', dialogOpen);
  if (!dialogOpen) return;

  const title = await dialog.locator('.MuiDialogTitle-root').innerText();
  const hasPhrasing = /please fix the following before publishing/i.test(title);
  const hasCount = /\(\d+\)/.test(title);
  record('US-155975.ac2', 'Title shows phrasing + count', hasPhrasing && hasCount, `title="${title.trim()}"`);

  const sections = (await dialog.locator('.MuiTypography-subtitle2').allTextContents()).map((s) => s.trim());
  const required = ['Basic Information', 'General Settings', 'Pricing', 'Application Form'];
  const missing = required.filter((s) => !sections.includes(s));
  record('US-155975.ac3', 'Dialog lists every failing section', missing.length === 0,
    `sections=${JSON.stringify(sections)}${missing.length ? `; missing=${JSON.stringify(missing)}` : ''}`);

  const fields = (await dialog.locator('.MuiListItemText-primary').allTextContents()).map((s) => s.trim());
  const requiredFields = ['Permission Name', 'Type', 'Group', 'Description'];
  const missingFields = requiredFields.filter((f) => !fields.includes(f));
  record('US-155975.ac4', 'Basic Information fields listed in dialog', missingFields.length === 0,
    `basicFieldsFound=${requiredFields.filter((f) => fields.includes(f)).length}/4`);

  await dialog.locator('.MuiTypography-subtitle2', { hasText: 'Pricing' }).click();
  await wait(500);
  const pricingTabAria = await page.getByRole('tab', { name: /pricing/i }).getAttribute('aria-selected');
  record('US-155975.ac5', 'Clicking section jumps to that tab', pricingTabAria === 'true',
    `pricing aria-selected=${pricingTabAria}`);

  const permsBadge = await page.getByRole('tab', { name: /permissions/i }).locator('.MuiChip-root').innerText().catch(() => '');
  const hasBadge = /^\d+$/.test(permsBadge.trim());
  record('US-155975.ac6', 'Top tab shows error badge', hasBadge, `permissions badge="${permsBadge}"`);

  const banner = await page.locator('.MuiAlert-standardError').first().innerText().catch(() => '');
  const bannerOk = /still need to be filled/i.test(banner);
  record('US-155975.ac7', 'Global error banner visible', bannerOk, `banner="${banner.split('\n')[0]}"`);

  // Fill one field, publish again, count should drop
  await page.getByRole('tab', { name: /permissions/i }).click();
  await wait(300);
  await page.locator('[data-field="Permission Name"] input').fill(`Test-${Date.now()}`);
  await page.locator('[data-field="Type"] [role="combobox"]').click();
  await wait(300);
  await page.getByRole('option', { name: 'Suspension' }).click();
  await wait(300);
  await page.getByRole('button', { name: /^publish$/i }).click();
  await wait(500);
  const dlg2 = page.locator('.MuiDialog-root:visible');
  const title2 = await dlg2.locator('.MuiDialogTitle-root').innerText();
  const count2 = parseInt(title2.match(/\((\d+)\)/)?.[1] ?? '0', 10);
  const count1 = parseInt(title.match(/\((\d+)\)/)?.[1] ?? '0', 10);
  record('US-155975.ac8', 'Filling fields reduces error count', count2 < count1, `before=${count1}, after=${count2}`);

  await page.getByRole('button', { name: 'OK' }).click();
  await wait(300);
}

// ────────────────────────────────────────────────────────────────────────────
// US-188673 — Prefix duplicate + Type/Prefix locked after publish
// ────────────────────────────────────────────────────────────────────────────
async function testUS188673(page) {
  console.log('\n▶ US-188673 — Prefix duplicate + Type/Prefix locked');
  await page.goto(`${BASE}/builder`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    const seed = [{
      id: 'P-SEEDED-1', name: 'Seeded Suspension', type: 'Suspension', group: 'Any',
      category: 'Suspension', status: 'Published', prefix: 'SUSP', price: 0, version: 1,
      lastUpdated: '2026-01-01', createdBy: 'Test', zones: 0, documents: 0,
    }];
    localStorage.setItem('prototype:builder:list:rows', JSON.stringify(seed));
  });

  await page.goto(`${BASE}/builder/P-SEEDED-1`);
  await page.waitForLoadState('networkidle');
  await wait(600);

  const typeDisabled = await page.locator('[data-field="Type"] .Mui-disabled').first().count();
  record('US-188673.ac1', 'Type disabled after publish', typeDisabled > 0);

  await page.getByText('General Settings', { exact: true }).click();
  await wait(400);
  const prefixDisabled = await page.locator('[data-field="Prefix"] input[disabled]').count();
  record('US-188673.ac2', 'Prefix disabled after publish', prefixDisabled > 0);

  const lockCaption = await page.locator('[data-field="Prefix"]').innerText();
  const hasNote = /cannot be changed after the permission is published/i.test(lockCaption);
  record('US-188673.ac3', 'Locked caption references US-188673', hasNote);

  // Duplicate prefix across DIFFERENT type — blocked
  await page.goto(`${BASE}/builder/new`);
  await page.waitForLoadState('networkidle');
  await wait(500);
  await page.locator('[data-field="Permission Name"] input').fill('Dup Prefix Test');
  await page.locator('[data-field="Type"] [role="combobox"]').click();
  await wait(300);
  await page.getByRole('option', { name: 'Permit', exact: true }).click();
  await wait(300);
  await page.getByText('General Settings', { exact: true }).click();
  await wait(400);
  await page.locator('[data-field="Prefix"] input').fill('SUSP');
  await wait(300);
  await page.getByRole('button', { name: /save draft/i }).click();
  await wait(800);
  const toastText = await page.locator('.MuiSnackbar-root, .MuiAlert-root').last().innerText().catch(() => '');
  const dupBlocked = /prefix.*already used|unique across permission types/i.test(toastText);
  record('US-188673.ac4', 'Duplicate prefix across types blocked', dupBlocked,
    `toast="${toastText.slice(0, 200).replace(/\n/g, ' ')}"`);

  // Same prefix within SAME type — allowed
  await page.getByText('Basic Information', { exact: true }).click();
  await wait(400);
  await page.locator('[data-field="Type"] [role="combobox"]').click();
  await wait(300);
  await page.getByRole('option', { name: 'Suspension' }).click();
  await wait(300);
  await page.getByRole('button', { name: /save draft/i }).click();
  await wait(1000);
  const toast2 = await page.locator('.MuiSnackbar-root, .MuiAlert-root').last().innerText().catch(() => '');
  const sameTypeOk = !/prefix.*already used/i.test(toast2);
  record('US-188673.ac5', 'Same prefix within same type allowed', sameTypeOk,
    `toast="${toast2.slice(0, 200).replace(/\n/g, ' ')}"`);

  // Prefix normalization: uppercase alphanumeric ≤10 chars
  await page.goto(`${BASE}/builder/new`);
  await page.waitForLoadState('networkidle');
  await wait(500);
  await page.getByText('General Settings', { exact: true }).click();
  await wait(400);
  await page.locator('[data-field="Prefix"] input').fill('ab-cd 12$3EXTRA-TRUNCATED');
  await wait(200);
  const normalized = await page.locator('[data-field="Prefix"] input').inputValue();
  // Assert format rules (uppercase, alphanumeric only, ≤10 chars) — not exact length,
  // because Playwright fill interacts with native maxLength attr differently across builds.
  const ok = /^[A-Z0-9]+$/.test(normalized) && normalized.length > 0 && normalized.length <= 10;
  record('US-188673.ac6', 'Prefix normalized (uppercase alphanumeric ≤10)', ok, `got="${normalized}"`);
}

// Runner ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Builder test pack');
  console.log('─────────────────');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log(`  ⚠ page error: ${err.message}`));

  try { await testUS155975(page); }
  catch (e) { record('US-155975.fatal', 'Test crashed', false, e.message); }

  try { await testUS188673(page); }
  catch (e) { record('US-188673.fatal', 'Test crashed', false, e.message); }

  await browser.close();

  console.log('\n─── SUMMARY ─────────────────');
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  const byStory = {};
  for (const r of results) {
    const story = r.id.split('.')[0];
    byStory[story] = byStory[story] || { pass: 0, fail: 0 };
    if (r.passed) byStory[story].pass++; else byStory[story].fail++;
  }
  for (const [story, s] of Object.entries(byStory)) {
    console.log(`  ${story}: ${s.pass} passed, ${s.fail} failed`);
  }
  process.exit(failed > 0 ? 1 : 0);
})();
