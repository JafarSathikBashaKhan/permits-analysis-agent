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

  // Track all network requests on mysignins
  page.on('request', req => {
    const url = req.url();
    if (url.includes('mysignins') || url.includes('SAS') || url.includes('ProcessAuth')) {
      console.log('[REQ]', req.method(), url.substring(0, 100));
    }
  });
  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('mysignins') || url.includes('SAS') || url.includes('ProcessAuth')) {
      console.log('[RESP]', resp.status(), url.substring(0, 100));
    }
  });
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

  // Click Next on MFA setup prompt
  console.log('\nClicking Next on MFA prompt...');
  try {
    const btn = page.locator('input[type="submit"]').first();
    await btn.click({ timeout: 5000 });
    console.log('Clicked Next');
  } catch (e) { console.log('No button found'); }

  // Wait for mysignins to load fully - watch for React app render
  await sleep(3000);
  console.log('\nOn mysignins page:', page.url().substring(0, 80));
  
  // Take screenshot immediately and after delay
  await page.screenshot({ path: 'screenshots/mysignins_t0.png', fullPage: true });

  // Check if there's a rendered React component
  for (let t = 0; t < 30; t++) {
    await sleep(2000);
    const url = page.url();
    console.log(`t=${t*2}s: ${url.substring(0, 80)}`);
    
    if (url.startsWith(BASE_URL)) {
      console.log('✅ APP REACHED!');
      break;
    }
    
    // Screenshot every 10 seconds
    if (t % 5 === 0) {
      await page.screenshot({ path: `screenshots/mysignins_t${t*2}.png`, fullPage: true });
    }

    // Check what's rendered
    const rendered = await page.evaluate(() => {
      const root = document.getElementById('root') || document.querySelector('[class*="app"]');
      if (root) return { innerHTML: root.innerHTML.substring(0, 200), childCount: root.childElementCount };
      return null;
    });
    if (rendered && rendered.childCount > 0) {
      console.log('React app rendered! Children:', rendered.childCount);
      console.log('Content:', rendered.innerHTML.substring(0, 100));
    }
    
    // Check for any buttons/links that appeared
    const btns = await page.$$eval('button, a, input[type="submit"]', els =>
      els.filter(e => {
        const s = window.getComputedStyle(e);
        return s.display !== 'none' && e.offsetWidth > 0;
      }).map(e => ({ tag: e.tagName, text: e.textContent?.trim() || e.value, id: e.id }))
    );
    if (btns.length > 1) {
      console.log('Buttons found:', btns.map(b => `${b.tag}[${b.id}]:"${b.text}"`).join(', '));
    }
  }

  await page.screenshot({ path: 'screenshots/mysignins_final.png', fullPage: true });
  console.log('\nFinal URL:', page.url().substring(0, 100));
  
  await sleep(2000);
  await browser.close();
}

main().catch(console.error);
