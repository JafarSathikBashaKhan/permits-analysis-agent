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
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  console.log('Navigating to app...');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(3000);

  await page.screenshot({ path: 'screenshots/01_initial.png', fullPage: true });
  console.log('Initial page title:', await page.title());
  console.log('Initial URL:', page.url());

  // Log all buttons and links on page
  const buttons = await page.$$eval('button, a', els => 
    els.map(e => ({ tag: e.tagName, text: e.textContent.trim().substring(0, 50), class: e.className.substring(0, 50) }))
       .filter(e => e.text.length > 0)
  );
  console.log('\nButtons/Links on page:');
  buttons.forEach(b => console.log(' -', b.tag, ':', b.text));

  // Try to find and click "Sign in" button
  console.log('\nLooking for Sign in button...');
  try {
    const signInBtn = await page.getByRole('button', { name: /sign in/i }).first();
    if (await signInBtn.isVisible()) {
      console.log('Found Sign in button, clicking...');
      await signInBtn.click();
      await sleep(3000);
      await page.screenshot({ path: 'screenshots/02_after_signin_click.png', fullPage: true });
      console.log('URL after click:', page.url());
      console.log('Title after click:', await page.title());
    }
  } catch (err) {
    console.log('No Sign in button found:', err.message);
  }

  // Check if we're now on Microsoft login page
  const currentUrl = page.url();
  console.log('\nCurrent URL:', currentUrl);

  if (currentUrl.includes('login.microsoftonline') || currentUrl.includes('microsoft') || currentUrl.includes('live.com')) {
    console.log('\n=== Microsoft/Azure AD Login Detected ===');
    
    await sleep(2000);
    await page.screenshot({ path: 'screenshots/03_ms_login.png', fullPage: true });

    // Fill email
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      await page.fill('input[type="email"]', CREDENTIALS.email);
      console.log('Filled email');
      await page.screenshot({ path: 'screenshots/04_email_filled.png' });
      
      // Click Next
      const nextBtn = await page.$('input[type="submit"], button[type="submit"]');
      if (nextBtn) {
        await nextBtn.click();
        await sleep(3000);
        await page.screenshot({ path: 'screenshots/05_after_email_next.png', fullPage: true });
        console.log('URL after email:', page.url());
      }
    } catch (err) {
      console.log('Email field error:', err.message);
    }

    // Fill password
    try {
      await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      await page.fill('input[type="password"]', CREDENTIALS.password);
      console.log('Filled password');
      await page.screenshot({ path: 'screenshots/06_password_filled.png' });

      // Click Sign in
      const signBtn = await page.$('input[type="submit"], button[type="submit"]');
      if (signBtn) {
        await signBtn.click();
        await sleep(5000);
        await page.screenshot({ path: 'screenshots/07_after_password.png', fullPage: true });
        console.log('URL after password:', page.url());
      }
    } catch (err) {
      console.log('Password field error:', err.message);
    }

    // Handle "Stay signed in?" prompt
    try {
      const stayBtn = await page.getByRole('button', { name: /yes|no/i }).first();
      if (await stayBtn.isVisible({ timeout: 5000 })) {
        await stayBtn.click();
        await sleep(3000);
      }
    } catch (_) {}

  } else {
    // Try direct login form on the app
    console.log('\n=== Looking for direct login form ===');
    const allInputs = await page.$$eval('input', els => 
      els.map(e => ({ type: e.type, name: e.name, id: e.id, placeholder: e.placeholder }))
    );
    console.log('All inputs:', JSON.stringify(allInputs, null, 2));
  }

  // Final state after login
  await sleep(5000);
  await page.screenshot({ path: 'screenshots/08_final_state.png', fullPage: true });
  const finalUrl = page.url();
  const finalTitle = await page.title();
  console.log('\n=== Final State ===');
  console.log('URL:', finalUrl);
  console.log('Title:', finalTitle);

  // Capture all nav links
  await sleep(2000);
  const navItems = await page.$$eval('a, button, [role="menuitem"], [role="tab"]', els =>
    els.map(e => ({ text: e.textContent.trim().substring(0, 80), href: e.href || '', tag: e.tagName }))
       .filter(e => e.text.length > 1)
  );
  console.log('\nAll nav items after login:');
  navItems.slice(0, 50).forEach(n => console.log(' -', n.tag, ':', n.text, n.href ? '-> ' + n.href : ''));

  // Save page HTML
  const html = await page.content();
  fs.writeFileSync('screenshots/logged_in_page.html', html.substring(0, 200000));

  console.log('\nDone! Screenshots saved in ./screenshots/');
  
  await sleep(2000);
  await browser.close();
}

explore().catch(console.error);
