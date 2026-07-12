// Opens Builder → New Permission → clicks Publish with empty fields
// so you can see the US-155975 validation errors dialog live.
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log('Launching Chromium…');
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log(`Opening ${BASE}/builder/new`);
  await page.goto(`${BASE}/builder/new`);
  await page.waitForLoadState('networkidle');
  await wait(1000);

  console.log('Clicking Publish with empty fields to trigger validation…');
  await page.getByRole('button', { name: /^publish$/i }).click();
  await wait(800);

  console.log('Validation dialog should be visible. Leaving open for review.');
  await wait(60000);

  await browser.close();
})();
