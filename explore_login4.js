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
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  
  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  const page = await context.newPage();

  // Track navigation
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) console.log('[NAV]', frame.url());
  });

  // Track popups  
  context.on('page', async (popup) => {
    console.log('[POPUP]', popup.url());
    await popup.waitForLoadState('domcontentloaded').catch(() => {});
    await popup.screenshot({ path: `screenshots/popup_${Date.now()}.png`, fullPage: true }).catch(() => {});
    
    // Handle MS/AAD login in popup
    popup.on('framenavigated', frame => {
      if (frame === popup.mainFrame()) console.log('[POPUP NAV]', frame.url());
    });
    
    try {
      await popup.waitForSelector('input[type="password"]', { timeout: 15000 });
      await sleep(1000);
      console.log('Password field found in popup');
      await popup.fill('input[type="password"]', CREDENTIALS.password);
      await popup.screenshot({ path: 'screenshots/popup_password.png', fullPage: true });
      await popup.click('input[type="submit"]');
      await sleep(5000);
      
      // Handle "Stay signed in?"
      try {
        const yesBtn = popup.getByRole('button', { name: /yes/i });
        if (await yesBtn.isVisible({ timeout: 3000 })) {
          await yesBtn.click();
        }
      } catch (_) {}
    } catch (err) {
      console.log('Popup password:', err.message);
    }
  });

  console.log('Loading app...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);

  // Inspect all clickable elements on the rendered page
  const dom = await page.evaluate(() => {
    const elements = [];
    const all = document.querySelectorAll('*');
    all.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null) {
        const text = el.textContent?.trim().substring(0, 50);
        if (text && el.children.length === 0) {
          elements.push({
            tag: el.tagName,
            class: el.className?.toString().substring(0, 80),
            id: el.id,
            text,
            cursor: style.cursor
          });
        }
      }
    });
    return elements;
  });

  console.log('\nAll visible leaf elements:');
  dom.forEach(el => console.log(`  [${el.tag}] id="${el.id}" class="${el.class.substring(0,40)}" text="${el.text}" cursor="${el.cursor}"`));

  // Fill the email field
  await page.fill('#txt_username', CREDENTIALS.email);
  console.log('\nFilled email field');
  await sleep(500);

  // Try to click the Sign in button using various strategies
  console.log('\nTrying to click Sign in...');
  
  // Strategy 1: by class
  let clicked = false;
  const strategies = [
    '.signInBtn',
    '[class*="signInBtn"]', 
    'text=Sign in',
    ':text("Sign in")',
    'div.signInBtn',
    'span.signInBtn',
    'p.signInBtn'
  ];

  for (const sel of strategies) {
    try {
      const el = await page.$(sel);
      if (el) {
        const tag = await el.evaluate(e => e.tagName);
        const txt = await el.textContent();
        console.log(`Found with "${sel}": <${tag}> "${txt?.trim()}"`);
        await el.click({ force: true });
        clicked = true;
        console.log('Clicked!');
        break;
      }
    } catch (err) {
      console.log(`Strategy "${sel}" failed:`, err.message.substring(0, 50));
    }
  }

  if (!clicked) {
    // Try clicking by text content
    console.log('Trying click by text...');
    await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      for (const el of all) {
        if (el.textContent?.trim() === 'Sign in' && el.children.length === 0) {
          el.click();
          return el.tagName + ' ' + el.className;
        }
      }
    });
    clicked = true;
  }

  await sleep(8000);
  await page.screenshot({ path: 'screenshots/after_click.png', fullPage: true });
  console.log('\nURL after click:', page.url());
  console.log('Title:', await page.title());

  // Wait more for login to complete
  await sleep(10000);
  await page.screenshot({ path: 'screenshots/final.png', fullPage: true });
  console.log('\nFinal URL:', page.url());
  console.log('Final Title:', await page.title());

  // Capture logged-in navigation
  const navItems = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      if (text && text.length > 2 && text.length < 60 && el.children.length === 0) {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          items.push({ tag: el.tagName, text, class: el.className?.toString().substring(0, 60) });
        }
      }
    });
    return items.slice(0, 100);
  });

  console.log('\n=== Visible text on page ===');
  navItems.forEach(n => console.log(`  [${n.tag}] "${n.text}"`));

  const html = await page.content();
  fs.writeFileSync('screenshots/final_dom.html', html.substring(0, 400000));
  console.log('\nSaved DOM to screenshots/final_dom.html');

  await sleep(2000);
  await browser.close();
}

explore().catch(console.error);
