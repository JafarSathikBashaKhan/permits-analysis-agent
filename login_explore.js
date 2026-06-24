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

async function login(page) {
  console.log('\n--- Step 1: Navigate to app ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);

  console.log('--- Step 2: Fill username on app login page ---');
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await sleep(500);

  console.log('--- Step 3: Click Sign in (triggers MS OAuth redirect) ---');
  await page.click('.signInBtn', { force: true });
  
  console.log('--- Step 4: Wait for MS login page ---');
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(2000);
  await page.screenshot({ path: 'screenshots/ms_login.png', fullPage: true });

  console.log('--- Step 5: Fill email on MS login ---');
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await sleep(500);
  await page.click('[type="submit"]');
  await sleep(3000);
  await page.screenshot({ path: 'screenshots/ms_after_email.png', fullPage: true });

  console.log('--- Step 6: Fill password ---');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await sleep(500);
  await page.screenshot({ path: 'screenshots/ms_password_filled.png', fullPage: true });
  await page.click('[type="submit"]');
  await sleep(5000);
  await page.screenshot({ path: 'screenshots/ms_after_password.png', fullPage: true });
  console.log('URL after password:', page.url());

  // Handle "Stay signed in?" or MFA
  const afterPasswordUrl = page.url();
  if (afterPasswordUrl.includes('login.microsoftonline') || afterPasswordUrl.includes('b2clogin')) {
    // Check for "Stay signed in?" prompt
    try {
      const staySignedInBtn = page.locator('[id="idSIButton9"]'); // MS "Yes" button
      if (await staySignedInBtn.isVisible({ timeout: 5000 })) {
        await staySignedInBtn.click();
        console.log('Clicked "Yes" on stay signed in prompt');
        await sleep(3000);
      }
    } catch (_) {}

    // Check for any other prompts
    const title = await page.title();
    const url = page.url();
    console.log('Intermediate page:', title, url.substring(0, 80));
    await page.screenshot({ path: 'screenshots/ms_intermediate.png', fullPage: true });
  }

  // Wait for redirect back to app
  console.log('--- Step 7: Waiting for redirect back to app ---');
  try {
    await page.waitForURL(`${BASE_URL}**`, { timeout: 20000 });
  } catch (_) {
    console.log('No redirect detected, current URL:', page.url());
  }
  
  await sleep(3000);
  await page.screenshot({ path: 'screenshots/app_logged_in.png', fullPage: true });
  console.log('URL after full login:', page.url());
  console.log('Title:', await page.title());
  return page.url().startsWith(BASE_URL);
}

async function exploreApp(page) {
  console.log('\n=== EXPLORING APP ===');
  
  // Capture the full page structure
  const structure = await page.evaluate(() => {
    const items = [];
    const processEl = (el, depth = 0) => {
      if (depth > 6) return;
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      const tag = el.tagName;
      const id = el.id;
      const cls = el.className?.toString().substring(0, 60);
      const href = el.href;
      
      if (text && text.length > 1 && text.length < 100 && el.childElementCount === 0) {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          items.push({ tag, id, cls, text, href, cursor: style.cursor });
        }
      }
      
      for (const child of el.children) {
        processEl(child, depth + 1);
      }
    };
    processEl(document.body);
    return items;
  });

  console.log('\nAll visible text elements:');
  structure.forEach(el => {
    const pointer = el.cursor === 'pointer' ? ' [CLICKABLE]' : '';
    console.log(`  [${el.tag}]${el.id ? ' #' + el.id : ''} "${el.text}"${pointer}`);
  });

  // Find navigation menu items
  const menuItems = structure.filter(el => 
    el.cursor === 'pointer' || el.tag === 'A' || el.cls?.includes('menu') || el.cls?.includes('nav')
  );
  console.log('\nClickable/Navigation items:');
  menuItems.forEach(el => console.log(`  [${el.tag}] "${el.text}" ${el.href || ''}`));

  return structure;
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) console.log('[NAV]', frame.url().substring(0, 100));
  });

  try {
    const loggedIn = await login(page);
    console.log('\nLogin success:', loggedIn);

    if (loggedIn || page.url().startsWith(BASE_URL)) {
      const structure = await exploreApp(page);
      fs.writeFileSync('app_structure.json', JSON.stringify(structure, null, 2));
      
      // Save the DOM
      const html = await page.content();
      fs.writeFileSync('screenshots/app_home.html', html.substring(0, 500000));
      console.log('\nSaved app_structure.json and screenshots/app_home.html');
    } else {
      console.log('\nNot logged in. Current URL:', page.url());
      const html = await page.content();
      fs.writeFileSync('screenshots/not_logged_in.html', html.substring(0, 100000));
    }
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: 'screenshots/error_state.png', fullPage: true });
  }

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
