/**
 * Marston NPS - Interactive Exploration
 * Navigates all menu items by clicking them and captures each page
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = { email: 'freedomappsvc@itsvc.co.uk', password: 'H@rd4r!v3+' };
const OUT_DIR = 'screenshots/explore';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function login(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await page.click('.signInBtn', { force: true });
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await page.click('[type="submit"]');
  await sleep(3000);
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await page.click('[type="submit"]');
  await sleep(5000);

  try {
    const nextBtn = page.locator('input[type="submit"]').first();
    if (await nextBtn.isVisible({ timeout: 4000 })) { await nextBtn.click(); await sleep(5000); }
  } catch (_) {}

  if (page.url().includes('mysignins')) {
    await sleep(8000);
    try { await page.click('button:has-text("Skip setup")', { timeout: 5000 }); await sleep(5000); } catch (_) {}
  }

  for (let i = 0; i < 30; i++) {
    if (page.url().startsWith(BASE_URL)) break;
    try {
      const y = page.locator('#idSIButton9').first();
      if (await y.isVisible({ timeout: 500 })) { await y.click(); await sleep(3000); }
    } catch (_) {}
    await sleep(2000);
  }

  return page.url().startsWith(BASE_URL);
}

async function getPageInfo(page, label) {
  await sleep(2000);
  const fname = label.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 40) + '.png';
  await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });

  const info = await page.evaluate(() => {
    // All visible text
    const texts = new Set();
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const t = el.textContent?.trim().replace(/\s+/g, ' ');
      if (t && t.length > 1 && t.length < 100) {
        const s = window.getComputedStyle(el);
        if (s.display !== 'none' && el.offsetHeight > 0) texts.add(t);
      }
    });

    // Form fields
    const fields = [];
    document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(el => {
      const label = el.labels?.[0]?.textContent?.trim()
        || el.placeholder || el.getAttribute('aria-label') || el.name || el.id;
      if (label) fields.push(`${el.type || el.tagName}: ${label}`);
    });

    // Table headers
    const headers = [];
    document.querySelectorAll('th, [role="columnheader"], [class*="header"]').forEach(el => {
      const t = el.textContent?.trim();
      if (t && t.length > 1 && t.length < 50) headers.push(t);
    });

    // Buttons
    const btns = [];
    document.querySelectorAll('button, [role="button"]').forEach(el => {
      const t = el.textContent?.trim();
      if (t && t.length > 1 && t.length < 50 && window.getComputedStyle(el).display !== 'none') btns.push(t);
    });

    return {
      texts: [...texts].slice(0, 50),
      fields: [...new Set(fields)],
      headers: [...new Set(headers)],
      buttons: [...new Set(btns)]
    };
  });

  return { label, screenshot: fname, ...info };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) process.stdout.write(`[NAV] ${frame.url().substring(0, 80)}\n`);
  });

  console.log('Logging in...');
  const ok = await login(page);
  if (!ok) { console.log('Login failed'); await browser.close(); return; }
  console.log('✅ Logged in!\n');

  await sleep(5000); // Let app render fully

  const report = { pages: [] };

  // ── Capture home ──────────────────────────────────────────────────────────
  console.log('📄 Home page...');
  const homeInfo = await getPageInfo(page, 'Home');
  report.pages.push(homeInfo);
  console.log('   Texts:', homeInfo.texts.join(' | '));
  console.log('   Buttons:', homeInfo.buttons.join(', '));

  // ── Top-level menu items to click ─────────────────────────────────────────
  const topMenuItems = [
    'Home',
    'Configuration',
    'Client Setup',
    'CR Configuration',
    'AIRA Configuration',
    'ANPR Configuration',
    'Print Admin',
    'Monitoring',
    'Case Lock'
  ];

  for (const menuName of topMenuItems) {
    console.log(`\n▶ Clicking menu: "${menuName}"`);
    try {
      await page.click(`text="${menuName}"`, { timeout: 5000 });
      await sleep(1500);
      await page.screenshot({ path: path.join(OUT_DIR, `menu_click_${menuName.replace(/\s/g,'_').toLowerCase()}.png`), fullPage: true });

      // Check for sub-menu items that appeared
      const subItems = await page.evaluate((menuName) => {
        const items = [];
        document.querySelectorAll('li, a, [role="menuitem"]').forEach(el => {
          const t = el.textContent?.trim().replace(/\s+/g, ' ');
          const s = window.getComputedStyle(el);
          if (t && t.length > 2 && t.length < 50 && s.cursor === 'pointer' && el.childElementCount === 0) {
            // Look for items that seem to be sub-items
            const parentText = el.closest('[class*="collapse"], [class*="submenu"], ul')?.textContent?.trim().substring(0, 30);
            items.push({ text: t, parentHint: parentText?.substring(0,20) });
          }
        });
        return [...new Map(items.map(i => [i.text, i])).values()].slice(0, 20);
      }, menuName);

      const subTexts = subItems.map(s => s.text).filter(t => !topMenuItems.includes(t));
      if (subTexts.length > 0) {
        console.log(`   Sub-items: ${subTexts.join(', ')}`);

        // Click each sub-item
        for (const subItem of subTexts.slice(0, 10)) {
          try {
            console.log(`   → Sub-item: "${subItem}"`);
            await page.click(`text="${subItem}"`, { timeout: 3000 });
            await sleep(2000);
            const info = await getPageInfo(page, `${menuName} - ${subItem}`);
            report.pages.push(info);
            console.log(`     Fields: ${info.fields.join(', ') || '(none)'}`);
            console.log(`     Headers: ${info.headers.join(', ') || '(none)'}`);
            console.log(`     Buttons: ${info.buttons.slice(0,6).join(', ') || '(none)'}`);
          } catch (err) {
            console.log(`     Error clicking "${subItem}": ${err.message.substring(0, 50)}`);
          }
        }
      } else {
        // No sub-items, capture this page
        const info = await getPageInfo(page, menuName);
        if (!report.pages.find(p => p.label === menuName)) report.pages.push(info);
        console.log(`   Fields: ${info.fields.join(', ') || '(none)'}`);
        console.log(`   Headers: ${info.headers.join(', ') || '(none)'}`);
        console.log(`   Buttons: ${info.buttons.slice(0,6).join(', ') || '(none)'}`);
      }
    } catch (err) {
      console.log(`   Error: ${err.message.substring(0, 60)}`);
    }
  }

  // Save report
  fs.writeFileSync('exploration_full_report.json', JSON.stringify(report, null, 2));
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 EXPLORATION COMPLETE');
  console.log('═'.repeat(60));
  console.log(`Pages captured: ${report.pages.length}`);
  console.log('\nAll sections explored:');
  report.pages.forEach(p => {
    console.log(`  📄 ${p.label}`);
    if (p.fields.length > 0) console.log(`     Fields: ${p.fields.join(', ')}`);
    if (p.headers.length > 0) console.log(`     Table headers: ${p.headers.join(', ')}`);
  });

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
