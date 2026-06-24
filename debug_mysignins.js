const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = {
  email: 'freedomappsvc@itsvc.co.uk',
  password: 'H@rd4r!v3+'
};

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');
  
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) console.log('[NAV]', frame.url().substring(0, 100));
  });

  // Login
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

  // Click Next on MFA setup
  console.log('Clicking Next on MFA page...');
  try {
    const btn = page.locator('input[type="submit"]').first();
    if (await btn.isVisible({ timeout: 3000 })) {
      await btn.click();
      console.log('Clicked Next');
    }
  } catch (e) { console.log('No button:', e.message.substring(0, 40)); }

  // Screenshot the mysignins page
  await sleep(3000);
  await page.screenshot({ path: 'screenshots/mysignins.png', fullPage: true });
  console.log('mysignins URL:', page.url().substring(0, 100));
  console.log('mysignins title:', await page.title());

  // Capture page content
  const texts = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      if (text && text.length > 1 && text.length < 100) {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none') items.push(`[${el.tagName}][id=${el.id}] ${text}`);
      }
    });
    return [...new Set(items)].slice(0, 60);
  });
  console.log('\nPage content:');
  texts.forEach(t => console.log(' ', t));

  // Wait for auto-redirect
  console.log('\nWaiting 60s for auto-redirect to app...');
  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    const url = page.url();
    if (url.startsWith(BASE_URL)) {
      console.log('✅ APP REACHED at second', i+1);
      break;
    }
    if (i % 5 === 0) console.log(`  ${i+1}s: ${url.substring(0, 70)}`);
    
    // Try to click any button that appears
    try {
      const btn = page.locator('input[type="submit"], button[type="submit"]').first();
      if (await btn.isVisible({ timeout: 500 })) {
        const val = await btn.getAttribute('value').catch(() => '?');
        console.log(`  Clicking button: "${val}"`);
        await btn.click();
      }
    } catch (_) {}
  }

  await page.screenshot({ path: 'screenshots/after_wait.png', fullPage: true });
  console.log('\nFinal URL:', page.url().substring(0, 100));
  
  await sleep(2000);
  await browser.close();
}

main().catch(console.error);
