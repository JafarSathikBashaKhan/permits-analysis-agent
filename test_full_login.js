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
    if (frame === page.mainFrame()) console.log('[NAV]', frame.url().substring(0, 80));
  });

  // Full login flow
  console.log('1. App login...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await page.click('.signInBtn', { force: true });
  
  console.log('2. MS email...');
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await page.click('[type="submit"]');
  await sleep(3000);
  
  console.log('3. MS password...');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await page.click('[type="submit"]');
  await sleep(5000);
  
  console.log('4. MFA prompt Next...');
  await page.screenshot({ path: 'screenshots/step4_mfa.png', fullPage: true });
  try {
    const nextBtn = page.locator('input[type="submit"]').first();
    const visible = await nextBtn.isVisible({ timeout: 4000 });
    console.log('   Next button visible:', visible);
    if (visible) {
      await nextBtn.click();
      console.log('   Clicked Next');
      await sleep(5000);
      await page.screenshot({ path: 'screenshots/step4_after.png', fullPage: true });
    }
  } catch (e) { console.log('   Error:', e.message.substring(0, 60)); }
  
  console.log('5. Current URL:', page.url().substring(0, 80));
  
  if (page.url().includes('mysignins')) {
    console.log('6. On mysignins - waiting for React to render...');
    await sleep(8000); // Give React 8s to fully render
    await page.screenshot({ path: 'screenshots/step6_mysignins.png', fullPage: true });
    
    // List all buttons
    const allBtns = await page.$$eval('button, a', els =>
      els.map(e => ({ tag: e.tagName, text: e.textContent.trim(), visible: e.offsetWidth > 0 }))
         .filter(e => e.text && e.visible)
    );
    console.log('   Buttons:', allBtns.map(b => `"${b.text}"`).join(', '));
    
    // Click "Skip setup"
    const skipFound = allBtns.find(b => b.text === 'Skip setup');
    if (skipFound) {
      console.log('   Found "Skip setup", clicking...');
      await page.click('button:has-text("Skip setup")');
      await sleep(5000);
      console.log('   URL after Skip:', page.url().substring(0, 80));
      await page.screenshot({ path: 'screenshots/step6_after_skip.png', fullPage: true });
    } else {
      console.log('   "Skip setup" NOT found in buttons list!');
    }
  }
  
  // Wait for app
  console.log('7. Waiting for app URL...');
  for (let i = 0; i < 30; i++) {
    const url = page.url();
    if (url.startsWith(BASE_URL)) {
      console.log('   ✅ APP REACHED at step', i+1);
      break;
    }
    if (i % 5 === 0) {
      console.log(`   t=${i*2}s: ${url.substring(0, 70)}`);
      await page.screenshot({ path: `screenshots/step7_t${i*2}.png`, fullPage: true });
    }
    // Handle KMSI
    try {
      const yesBtn = page.locator('#idSIButton9').first();
      if (await yesBtn.isVisible({ timeout: 500 })) {
        await yesBtn.click();
        console.log('   Clicked KMSI Yes');
      }
    } catch (_) {}
    await sleep(2000);
  }
  
  const finalUrl = page.url();
  console.log('\nFinal URL:', finalUrl.substring(0, 100));
  
  if (finalUrl.startsWith(BASE_URL)) {
    console.log('✅ LOGIN SUCCESSFUL!');
    await sleep(5000); // Let React render
    await page.screenshot({ path: 'screenshots/app_logged_in.png', fullPage: true });
    
    // Get page content
    const els = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.childElementCount > 0) return;
        const text = el.textContent?.trim().replace(/\s+/g, ' ');
        if (!text || text.length < 2 || text.length > 100) return;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;
        if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
        items.push({ tag: el.tagName, text, clickable: style.cursor === 'pointer' });
      });
      return items;
    });
    console.log('\nApp elements:', els.slice(0, 30).map(e => `[${e.clickable?'C':' '}] "${e.text}"`).join('\n'));
    fs.writeFileSync('app_elements.json', JSON.stringify(els, null, 2));
  }
  
  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
