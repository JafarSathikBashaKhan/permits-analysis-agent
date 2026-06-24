const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = {
  email: 'freedomappsvc@itsvc.co.uk',
  password: 'H@rd4r!v3+'
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) console.log('[NAV]', frame.url().substring(0, 100));
  });

  // Step 1: App login
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await sleep(300);
  await page.click('.signInBtn', { force: true });
  
  // Step 2: MS email
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(2000);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await sleep(300);
  await page.click('[type="submit"]');
  await sleep(3000);
  await page.screenshot({ path: 'screenshots/check_after_email.png', fullPage: true });

  // Step 3: MS password
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await sleep(300);
  await page.screenshot({ path: 'screenshots/check_before_submit.png', fullPage: true });
  await page.click('[type="submit"]');
  await sleep(5000);
  await page.screenshot({ path: 'screenshots/check_after_submit.png', fullPage: true });
  
  console.log('After password submit:');
  console.log('  URL:', page.url().substring(0, 100));
  console.log('  Title:', await page.title());

  // Capture all visible text
  const texts = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      if (text && text.length > 1 && text.length < 100) items.push(`[${el.tagName}] ${text}`);
    });
    return [...new Set(items)].slice(0, 50);
  });
  console.log('\nPage text:', texts.join('\n'));

  // Stay open for manual inspection
  console.log('\nBrowser open for 60 seconds...');
  await sleep(60000);
  
  await browser.close();
}

main().catch(console.error);
