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

async function explore() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  console.log('Navigating to app...');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

  // Wait for the login form to fully render
  console.log('Waiting for login form...');
  await page.waitForSelector('input[placeholder*="username" i], input[placeholder*="email" i]', { timeout: 20000 });
  await sleep(1000);
  await page.screenshot({ path: 'screenshots/01_login_form.png', fullPage: true });

  // Inspect all inputs
  const inputs = await page.$$eval('input', els => 
    els.map(e => ({ type: e.type, name: e.name, id: e.id, placeholder: e.placeholder, class: e.className }))
  );
  console.log('Inputs found:', JSON.stringify(inputs, null, 2));

  // Fill username/email
  const emailInput = await page.$('input[placeholder*="username" i], input[placeholder*="email" i]');
  if (emailInput) {
    await emailInput.click();
    await emailInput.fill(CREDENTIALS.email);
    console.log('Filled email/username:', CREDENTIALS.email);
    await sleep(500);
    await page.screenshot({ path: 'screenshots/02_email_filled.png', fullPage: true });
  }

  // Click Sign in button
  const signInBtn = await page.$('button');
  if (signInBtn) {
    const btnText = await signInBtn.textContent();
    console.log('Clicking button:', btnText);
    await signInBtn.click();
    await sleep(4000);
    await page.screenshot({ path: 'screenshots/03_after_signin.png', fullPage: true });
    console.log('URL after sign in click:', page.url());
    console.log('Title:', await page.title());
  }

  // Check if we got redirected to MS login or a password page
  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  if (currentUrl.includes('login.microsoftonline') || currentUrl.includes('microsoft') || currentUrl.includes('live.com')) {
    console.log('=== Microsoft Azure AD login detected ===');
    
    // Fill MS email if needed
    try {
      const msEmailInput = await page.$('input[type="email"]');
      if (msEmailInput) {
        const val = await msEmailInput.inputValue();
        if (!val) {
          await msEmailInput.fill(CREDENTIALS.email);
          console.log('Filled MS email');
        }
        await page.click('input[type="submit"]');
        await sleep(3000);
        await page.screenshot({ path: 'screenshots/04_ms_email.png', fullPage: true });
      }
    } catch (err) { console.log('MS email step:', err.message); }

    // Fill password
    try {
      await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      await page.fill('input[type="password"]', CREDENTIALS.password);
      console.log('Filled MS password');
      await page.screenshot({ path: 'screenshots/05_ms_password.png', fullPage: true });
      await page.click('input[type="submit"]');
      await sleep(5000);
    } catch (err) { console.log('MS password step:', err.message); }

    // Stay signed in prompt
    try {
      const stayBtn = page.getByRole('button', { name: /yes/i });
      if (await stayBtn.isVisible({ timeout: 3000 })) {
        await stayBtn.click();
        await sleep(3000);
      }
    } catch (_) {}

  } else {
    // Maybe there's a password field on the same page or next step
    try {
      await page.waitForSelector('input[type="password"]', { timeout: 8000 });
      await page.fill('input[type="password"]', CREDENTIALS.password);
      console.log('Filled password on app page');
      await page.screenshot({ path: 'screenshots/04_password_filled.png', fullPage: true });
      
      const submitBtn = await page.$('button[type="submit"], button');
      if (submitBtn) {
        await submitBtn.click();
        await sleep(5000);
      }
    } catch (err) {
      console.log('No password field found:', err.message);
    }
  }

  // Wait for app to fully load after login
  await sleep(5000);
  await page.screenshot({ path: 'screenshots/09_logged_in.png', fullPage: true });
  console.log('\n=== After Login ===');
  console.log('Final URL:', page.url());
  console.log('Final Title:', await page.title());

  // Capture all visible navigation elements
  const allLinks = await page.$$eval('a, button, [role="menuitem"], [role="tab"], li', els =>
    els.map(e => ({ tag: e.tagName, text: e.textContent.trim().replace(/\s+/g, ' ').substring(0, 80), href: e.href || '' }))
       .filter(e => e.text.length > 1 && e.text.length < 80)
  );

  console.log('\n=== Navigation Items ===');
  allLinks.slice(0, 80).forEach(l => console.log(` [${l.tag}] ${l.text}${l.href ? ' -> ' + l.href : ''}`));

  // Save full HTML
  const html = await page.content();
  fs.writeFileSync('screenshots/logged_in.html', html.substring(0, 300000));
  
  const report = { finalUrl: page.url(), allLinks: allLinks.slice(0, 100) };
  fs.writeFileSync('exploration_report.json', JSON.stringify(report, null, 2));

  await sleep(3000);
  await browser.close();
  console.log('\nDone!');
}

explore().catch(console.error);
