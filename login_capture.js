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

async function performLogin(page) {
  console.log('Step 1: Navigate to app');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);

  console.log('Step 2: Fill app username');
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await sleep(300);
  await page.click('.signInBtn', { force: true });

  console.log('Step 3: Handle MS OAuth...');
  // Wait for MS login page
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);

  // Fill MS email
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await sleep(300);
  await page.click('[type="submit"]');
  await sleep(3000);

  // Fill MS password
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await sleep(300);
  await page.click('[type="submit"]');
  
  console.log('Step 4: Waiting for all redirects to complete...');
  
  // Wait for app URL — allow up to 60 seconds for all MFA/SSPR redirects to settle
  try {
    await page.waitForURL(`${BASE_URL}**`, { timeout: 60000 });
    console.log('✓ Redirected to app!');
  } catch (_) {
    // If direct wait fails, try polling
    for (let i = 0; i < 30; i++) {
      await sleep(2000);
      const url = page.url();
      console.log(`  Polling... ${url.substring(0, 80)}`);
      if (url.startsWith(BASE_URL)) {
        console.log('✓ App URL reached!');
        break;
      }
      // Handle intermediate prompts
      const title = await page.title();
      if (title.includes('secure') || url.includes('mysignins')) {
        // Click Next on MFA/security prompts
        try {
          await page.click('[type="submit"], [value="Next"], button:has-text("Next")', { timeout: 2000 });
          console.log('  Clicked Next/Submit');
        } catch (_) {}
      }
      if (url.includes('kmsi')) {
        // Stay signed in = Yes
        try {
          await page.click('[id="idSIButton9"]', { timeout: 2000 });
          console.log('  Clicked Yes (stay signed in)');
        } catch (_) {}
      }
    }
  }

  return page.url().startsWith(BASE_URL);
}

async function exploreApp(page) {
  console.log('\n=== Exploring the logged-in app ===');
  
  // Let React fully render
  await sleep(5000);
  await page.screenshot({ path: 'screenshots/app_home.png', fullPage: true });
  console.log('Home screenshot saved');

  const getPageText = async () => {
    return page.evaluate(() => {
      const items = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.childElementCount > 0) return;
        const text = el.textContent?.trim().replace(/\s+/g, ' ');
        if (!text || text.length < 2 || text.length > 100) return;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;
        if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
        items.push({
          tag: el.tagName,
          id: el.id || '',
          cls: el.className?.toString().substring(0, 60) || '',
          text,
          href: el.href || '',
          clickable: style.cursor === 'pointer'
        });
      });
      return items;
    });
  };

  const homeElements = await getPageText();
  console.log('\nHome page elements:');
  homeElements.forEach(el => {
    const mark = el.clickable ? '[CLICK]' : '       ';
    console.log(`  ${mark} [${el.tag}]${el.id ? '#' + el.id : ''} "${el.text}"`);
  });

  const results = { home: { url: page.url(), elements: homeElements, pages: [] } };
  fs.writeFileSync('app_home_elements.json', JSON.stringify(homeElements, null, 2));

  // Find and click permit-related menu items
  const menuItems = homeElements.filter(el => el.clickable || el.tag === 'A');
  console.log('\nClickable items:', menuItems.map(e => `"${e.text}"`).join(', '));

  // Navigate to interesting pages
  const permitKeywords = /permit|application|licen|approv|submiss|new case|case/i;
  const targetItems = menuItems.filter(el => permitKeywords.test(el.text) || el.href);
  
  console.log('\nPermit-related navigation items:');
  targetItems.forEach(el => console.log(`  "${el.text}" ${el.href || ''}`));

  // Try navigating to the first few permit-related links
  for (const item of targetItems.slice(0, 5)) {
    try {
      if (item.href && item.href.startsWith(BASE_URL)) {
        console.log(`\nNavigating to: "${item.text}" (${item.href})`);
        await page.goto(item.href, { waitUntil: 'networkidle', timeout: 15000 });
        await sleep(2000);
        const safeName = item.text.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
        await page.screenshot({ path: `screenshots/page_${safeName}.png`, fullPage: true });
        const pageEls = await getPageText();
        results.home.pages.push({ text: item.text, url: page.url(), elements: pageEls });
        await page.goBack({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
        await sleep(1500);
      }
    } catch (err) {
      console.log(`  Error navigating to "${item.text}":`, err.message.substring(0, 60));
    }
  }

  fs.writeFileSync('app_exploration.json', JSON.stringify(results, null, 2));
  console.log('\nSaved app_exploration.json');
  return results;
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      const url = frame.url();
      if (!url.includes('cdn') && !url.includes('favicon')) {
        console.log('[NAV]', url.substring(0, 100));
      }
    }
  });

  try {
    const loggedIn = await performLogin(page);
    console.log('\n✓ Login result:', loggedIn, '| URL:', page.url().substring(0, 80));

    if (loggedIn || page.url().startsWith(BASE_URL)) {
      await exploreApp(page);
    } else {
      console.log('Not logged in. URL:', page.url());
      const html = await page.content();
      fs.writeFileSync('screenshots/not_logged_in.html', html.substring(0, 100000));
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
    await page.screenshot({ path: 'screenshots/error.png', fullPage: true }).catch(() => {});
    throw err;
  } finally {
    await sleep(2000);
    await browser.close();
  }
}

main().catch(console.error);
