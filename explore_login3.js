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
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  
  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  const page = await context.newPage();

  // Listen for any new pages/popups
  const popupPages = [];
  context.on('page', async (popup) => {
    const url = popup.url();
    console.log('New page/popup opened:', url);
    popupPages.push(popup);
    await popup.screenshot({ path: `screenshots/popup_${Date.now()}.png` }).catch(() => {});
  });

  // Track all navigation
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      console.log('Main frame navigated to:', frame.url());
    }
  });

  // Track network requests for API calls
  const apiCalls = [];
  page.on('request', req => {
    const url = req.url();
    if (!url.includes('.png') && !url.includes('.css') && !url.includes('.js') && !url.includes('cdn')) {
      apiCalls.push({ method: req.method(), url });
    }
  });

  console.log('Going to:', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await sleep(2000);
  await page.screenshot({ path: 'screenshots/01_loaded.png', fullPage: true });

  // Fill email
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await sleep(500);
  console.log('Email filled');

  // Listen for navigation BEFORE clicking
  const navigationPromise = page.waitForNavigation({ timeout: 15000 }).catch(() => null);

  // Click the Sign in button
  await page.click('button');
  console.log('Clicked Sign in button');
  
  // Wait for navigation or popup
  await Promise.race([
    navigationPromise,
    sleep(8000)
  ]);

  await sleep(3000);
  const currentUrl = page.url();
  console.log('URL after button click:', currentUrl);
  await page.screenshot({ path: 'screenshots/02_after_click.png', fullPage: true });

  // Check if page changed or if we need to look at popup
  if (currentUrl !== BASE_URL || popupPages.length > 0) {
    console.log('Navigation detected or popup opened');
    
    if (popupPages.length > 0) {
      const popup = popupPages[popupPages.length - 1];
      await popup.waitForLoadState('domcontentloaded');
      await sleep(2000);
      console.log('Popup URL:', popup.url());
      await popup.screenshot({ path: 'screenshots/03_popup.png', fullPage: true });
      
      // Handle Microsoft login in popup
      if (popup.url().includes('microsoft') || popup.url().includes('login.') || popup.url().includes('azure')) {
        // Fill password if email is pre-filled
        try {
          const passInput = await popup.$('input[type="password"]');
          if (passInput) {
            await passInput.fill(CREDENTIALS.password);
            await popup.click('input[type="submit"]');
            await sleep(5000);
          }
        } catch (err) { console.log('Popup password err:', err.message); }
      }
    }
  } else {
    // Check if a password field appeared on the main page
    const allInputs = await page.$$eval('input', els => 
      els.map(e => ({ type: e.type, id: e.id, placeholder: e.placeholder, visible: e.offsetParent !== null }))
    );
    console.log('All inputs on page:', JSON.stringify(allInputs, null, 2));
    
    // Check for error messages
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('Page text:', pageText.substring(0, 500));
  }

  // Wait for redirect back to app after login
  await sleep(8000);
  await page.screenshot({ path: 'screenshots/10_final.png', fullPage: true });
  console.log('\n=== Final State ===');
  console.log('URL:', page.url());
  console.log('Title:', await page.title());

  // Print captured API calls
  console.log('\n=== API Calls intercepted ===');
  apiCalls.slice(0, 30).forEach(c => console.log(c.method, c.url));

  // Save page content
  const html = await page.content();
  fs.writeFileSync('screenshots/final_page.html', html.substring(0, 300000));
  
  // If logged in, capture navigation
  const navLinks = await page.$$eval('a, button, [role="menuitem"]', els =>
    els.map(e => ({ tag: e.tagName, text: e.textContent.trim().substring(0, 60), href: e.href || '' }))
       .filter(e => e.text.length > 1)
  );
  console.log('\n=== Page navigation items ===');
  navLinks.slice(0, 50).forEach(n => console.log(` [${n.tag}] ${n.text}`));

  await sleep(3000);
  await browser.close();
}

explore().catch(console.error);
