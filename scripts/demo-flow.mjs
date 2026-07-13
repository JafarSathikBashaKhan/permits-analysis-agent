/**
 * Live end-to-end demo driver.
 * Launches a visible Chromium window and walks through the created entities
 * so you can watch every page light up in order.
 *
 * Run: node scripts/demo-flow.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log('Launching Chromium…');
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  const banner = async (text, ms = 1500) => {
    await page.evaluate((t) => {
      let n = document.getElementById('__demo_banner');
      if (!n) {
        n = document.createElement('div');
        n.id = '__demo_banner';
        n.style.cssText = [
          'position:fixed', 'top:16px', 'left:50%', 'transform:translateX(-50%)',
          'padding:12px 24px', 'background:rgba(21,101,192,0.95)', 'color:#fff',
          'font:600 15px/1.3 -apple-system,Segoe UI,sans-serif', 'border-radius:8px',
          'box-shadow:0 8px 24px rgba(0,0,0,0.25)', 'z-index:99999',
          'pointer-events:none', 'letter-spacing:0.2px',
        ].join(';');
        document.body.appendChild(n);
      }
      n.textContent = t;
    }, text);
    await pause(ms);
  };

  const clearBanner = async () => {
    await page.evaluate(() => {
      const n = document.getElementById('__demo_banner');
      if (n) n.remove();
    });
  };

  console.log('Opening', BASE);
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pause(800);

  // ============ Step 1: Demo flow runner ============
  await banner('Step 1 — Opening Demo Flow page');
  await page.goto(`${BASE}/demoflow`, { waitUntil: 'domcontentloaded' });
  await pause(1200);

  await banner('Clicking "Run End-to-End Flow"…', 1200);
  await page.getByRole('button', { name: /Run End-to-End Flow/i }).click();

  // Wait for the flow to complete (5 "Open" buttons should appear)
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.filter((b) => /^Open$/i.test((b.textContent || '').trim())).length >= 5;
  }, null, { timeout: 20000 });

  await banner('✓ Street, Zone, Group, Permission and Application created', 2500);
  await clearBanner();
  await pause(800);

  // ============ Step 2: Streets ============
  await banner('Step 2 — Streets: the new "Demo Street" is at the top of the list');
  await page.goto(`${BASE}/streets`, { waitUntil: 'domcontentloaded' });
  await pause(3000);

  // ============ Step 3: Zones ============
  await banner('Step 3 — Zones: new "Demo Zone" (Published) with the street mapped');
  await page.goto(`${BASE}/zones`, { waitUntil: 'domcontentloaded' });
  await pause(3000);

  // ============ Step 4: Groups ============
  await banner('Step 4 — Permission Setup › Groups: new "Demo Group"');
  await page.goto(`${BASE}/groups`, { waitUntil: 'domcontentloaded' });
  await pause(3000);

  // ============ Step 5: Permission Builder ============
  await banner('Step 5 — Permission Builder: new Published permission');
  await page.goto(`${BASE}/builder`, { waitUntil: 'domcontentloaded' });
  await pause(3000);

  // ============ Step 6: Applications ============
  await banner('Step 6 — Applications: the new application in "Awaiting Payment" status');
  await page.goto(`${BASE}/applications`, { waitUntil: 'domcontentloaded' });
  await pause(3500);

  await banner('Demo complete — leaving the browser open so you can explore', 3000);
  await clearBanner();

  console.log('Demo complete. Close the Chromium window when done.');
  // Keep the browser open — do NOT close.
}

main().catch((e) => {
  console.error('Demo failed:', e);
  process.exit(1);
});
