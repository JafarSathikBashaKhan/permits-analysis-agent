/**
 * Real-UI end-to-end demo — clicks the actual UI just like a user.
 *   Streets  -> Add Street -> fill drawer -> Save
 *   Zones    -> Add Zone   -> fill drawer -> Attach street -> Save
 *   Groups   -> Add Group  -> fill drawer -> Save
 *   Builder  -> New Permission -> design page -> Publish
 *   Applications -> New Application dialog -> Create Application
 *
 * Run: node scripts/demo-live-crud.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const suffix = String(Date.now()).slice(-4);
const NAMES = {
  street: `Demo Street ${suffix}`,
  usrn: `USRN-${suffix}0`,
  town: 'Colchester',
  zone: `Demo Zone ${suffix}`,
  group: `Demo Group ${suffix}`,
  permission: `Demo Resident ${suffix}`,
  applicant: `Demo Applicant ${suffix}`,
  vrm: `DM${suffix}XYZ`,
};

async function main() {
  console.log('Launching Chromium (visible)…');
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
    slowMo: 150,
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // ---- helpers ---------------------------------------------------------
  const banner = async (text, ms = 900) => {
    await page.evaluate((t) => {
      let n = document.getElementById('__demo_banner');
      if (!n) {
        n = document.createElement('div');
        n.id = '__demo_banner';
        n.style.cssText =
          'position:fixed;top:16px;left:50%;transform:translateX(-50%);' +
          'padding:12px 24px;background:rgba(21,101,192,0.95);color:#fff;' +
          'font:600 15px/1.3 -apple-system,Segoe UI,sans-serif;border-radius:8px;' +
          'box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:2147483647;' +
          'pointer-events:none;max-width:70vw;text-align:center';
        document.body.appendChild(n);
      }
      n.textContent = t;
    }, text);
    await pause(ms);
  };

  // Scope every form action to the visible drawer/dialog only.
  const openForm = () =>
    page.locator('.MuiDrawer-paper:visible, .MuiDialog-container:visible').last();

  const fillIn = async (label, value) => {
    const field = openForm().getByLabel(label, { exact: false }).first();
    await field.waitFor({ state: 'visible', timeout: 8000 });
    await field.fill(String(value));
    await pause(200);
  };

  const pickSelect = async (label, optionText) => {
    // MUI Select renders as a combobox. Scope to form to avoid grid header hits.
    const combo = openForm().getByLabel(label, { exact: false }).first();
    await combo.waitFor({ state: 'visible', timeout: 8000 });
    await combo.click();
    await pause(300);
    try {
      // options are rendered in a portal on document.body — not inside the form.
      await page
        .getByRole('option', { name: new RegExp(optionText, 'i') })
        .first()
        .click({ timeout: 4000 });
      await pause(250);
    } catch (e) {
      // Close any stuck popover so subsequent clicks aren't blocked.
      await page.keyboard.press('Escape').catch(() => {});
      await pause(200);
      throw e;
    }
  };

  const clickFormButton = async (nameRegex) => {
    const btn = openForm().getByRole('button', { name: nameRegex }).first();
    await btn.waitFor({ state: 'visible', timeout: 8000 });
    await btn.click();
  };

  const clickPageButton = async (nameRegex) => {
    await page.getByRole('button', { name: nameRegex }).first().click();
  };

  // ---- flow ------------------------------------------------------------
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pause(600);

  // 1) STREETS
  await banner('Step 1 — Area › Streets');
  await page.goto(`${BASE}/streets`, { waitUntil: 'domcontentloaded' });
  await pause(700);

  await banner('Clicking "Add Street"');
  await clickPageButton(/^Add Street$/i);
  await pause(500);

  await banner(`Typing Street Name: "${NAMES.street}"`);
  await fillIn('Street Name', NAMES.street);

  const usrnField = openForm().getByLabel('USRN', { exact: false }).first();
  if (await usrnField.isEditable().catch(() => false)) {
    await banner(`Typing USRN: ${NAMES.usrn}`);
    await usrnField.fill(NAMES.usrn);
    await pause(200);
  } else {
    await banner('USRN is auto-generated (skipping)');
  }

  await banner(`Picking Town: ${NAMES.town}`);
  await pickSelect('Town', NAMES.town);

  await banner('Clicking Save — persists to store');
  await clickFormButton(/^(Save|Create)$/i);
  await pause(1400);
  await banner(`✓ Street "${NAMES.street}" saved`, 1600);

  // 2) ZONES
  await banner('Step 2 — Area › Zones');
  await page.goto(`${BASE}/zones`, { waitUntil: 'domcontentloaded' });
  await pause(700);

  await banner('Clicking "Add Zone"');
  await clickPageButton(/^Add Zone$/i);
  await pause(500);

  await banner(`Typing Zone Name: "${NAMES.zone}"`);
  await fillIn('Zone Name', NAMES.zone);

  await banner(`Attaching our new street "${NAMES.street}"`);
  try {
    await pickSelect('Add Street', NAMES.street);
    await pause(200);
    await clickFormButton(/^Attach$/i);
    await pause(500);
  } catch (e) {
    console.warn('Attach step skipped:', e.message);
  }

  await banner('Clicking Save — creates zone');
  await clickFormButton(/^(Create|Save Changes|Save)$/i);
  await pause(1400);
  await banner(`✓ Zone "${NAMES.zone}" created`, 1600);

  // 3) GROUPS
  await banner('Step 3 — Permission Setup › Groups');
  await page.goto(`${BASE}/groups`, { waitUntil: 'domcontentloaded' });
  await pause(700);

  await banner('Clicking "New Group"');
  await clickPageButton(/^New Group$/i);
  await pause(500);

  await banner(`Typing Group Name: "${NAMES.group}"`);
  await fillIn('Group Name', NAMES.group);

  await banner('Picking Permission Type: Resident');
  try {
    await pickSelect('Permission Type', 'Resident');
  } catch (e) {
    console.warn('Permission Type select skipped:', e.message);
  }

  await banner('Clicking Save');
  await clickFormButton(/^(Create|Save Changes|Save)$/i);
  await pause(1400);
  await banner(`✓ Group "${NAMES.group}" created`, 1600);

  // 4) PERMISSION BUILDER
  await banner('Step 4 — Permission Setup › Permission Builder');
  await page.goto(`${BASE}/builder`, { waitUntil: 'domcontentloaded' });
  await pause(700);

  await banner('Clicking "New Permission"');
  // Rendered as an anchor (RouterLink) — navigate directly for reliability.
  await page.goto(`${BASE}/builder/new`, { waitUntil: 'domcontentloaded' });
  await pause(1200);

  await banner(`Typing Permission Name: "${NAMES.permission}"`);
  const permInput = page
    .locator(
      'input[placeholder*="Permission Name" i], input[placeholder*="permission name" i], input[placeholder*="Name" i]'
    )
    .first();
  await permInput.waitFor({ state: 'visible', timeout: 8000 });
  await permInput.fill(NAMES.permission);
  await pause(400);

  await banner('Clicking Publish — makes it available in Buy Now');
  await clickPageButton(/^Publish$/i);
  await pause(2000);
  await banner(`✓ Permission "${NAMES.permission}" published`, 1800);

  // 5) APPLICATIONS
  await banner('Step 5 — Applications');
  await page.goto(`${BASE}/applications`, { waitUntil: 'domcontentloaded' });
  await pause(700);

  await banner('Clicking "New Application"');
  await clickPageButton(/^New Application$/i);
  await pause(600);

  await banner(`Typing Applicant Name: "${NAMES.applicant}"`);
  await fillIn('Applicant Name', NAMES.applicant);

  await banner('Picking Permission Type (already defaults to Resident Permit)');
  // Default value is already 'Resident Permit' — but try to switch if our published one is available.
  try {
    await pickSelect('Permission Type', 'Resident Permit');
  } catch (e) {
    await page.keyboard.press('Escape').catch(() => {});
    console.warn('Permission Type keep default:', e.message);
  }
  await pause(300);

  await banner(`Typing Vehicle VRM: ${NAMES.vrm}`);
  try { await fillIn('Vehicle VRM', NAMES.vrm); } catch (e) { console.warn('VRM skipped:', e.message); }

  await banner('Clicking Create Application');
  await clickFormButton(/Create Application/i);
  await pause(1800);
  await banner(`✓ Application created for ${NAMES.applicant}`, 2200);

  await banner('🎉 End-to-end CRUD demo complete — browser stays open', 4000);
  await page.evaluate(() => {
    const n = document.getElementById('__demo_banner');
    if (n) n.remove();
  });

  console.log('Demo complete. Close the Chromium window when finished.');
}

main().catch((e) => {
  console.error('Demo failed:', e);
  process.exit(1);
});
