// Verify validation dialog contents after Publish click
import { chromium } from 'playwright';
const BASE = 'http://localhost:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Clear any state
  await page.goto(`${BASE}/builder/new`);
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('prototype:paymentSettings:') || k.startsWith('prototype:documentTypes:') ||
          k.startsWith('prototype:rules:') || k.startsWith('prototype:pricing:') ||
          k.startsWith('prototype:applicationForm:')) {
        localStorage.removeItem(k);
      }
    }
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await wait(500);

  // Click Publish
  await page.getByRole('button', { name: /^publish$/i }).click();
  await wait(600);

  // Dump dialog sections
  const dialog = page.locator('.MuiDialog-root:visible');
  if (await dialog.count() === 0) {
    console.log('❌ No dialog opened');
  } else {
    const sections = await dialog.locator('.MuiTypography-subtitle2').allTextContents();
    console.log('Dialog sections:', JSON.stringify(sections));
    const items = await dialog.locator('.MuiListItemText-primary').allTextContents();
    console.log('Field errors:', JSON.stringify(items));
  }

  // Tab badges
  const tabBadges = await page.locator('.MuiTab-root .MuiChip-root').allTextContents();
  console.log('Top tab badges:', tabBadges);

  await browser.close();
})();
