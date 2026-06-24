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

async function handleMFAPrompt(page) {
  // Look for skip/not now/later options
  const skipSelectors = [
    'text=Skip for now',
    'text=Skip',
    'text=Not now',
    'text=Ask later',
    'text=Cancel',
    '[id*="skip" i]',
    '[id*="later" i]',
    'a:has-text("skip")',
    'a:has-text("later")',
  ];

  for (const sel of skipSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        console.log('Found skip option:', sel);
        await el.click();
        await sleep(3000);
        return true;
      }
    } catch (_) {}
  }

  // If no skip, try clicking Next and see what comes next
  console.log('No skip found. Clicking Next to proceed...');
  try {
    await page.click('[value="Next"], button:has-text("Next")', { timeout: 5000 });
    await sleep(3000);
    await page.screenshot({ path: 'screenshots/mfa_next.png', fullPage: true });
    console.log('URL after Next:', page.url().substring(0, 100));
    
    // Look for skip again on next page
    for (const sel of skipSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 })) {
          console.log('Found skip on next page:', sel);
          await el.click();
          await sleep(3000);
          return true;
        }
      } catch (_) {}
    }
  } catch (err) {
    console.log('Next button click error:', err.message);
  }

  return false;
}

async function login(page) {
  console.log('\n--- Step 1: Navigate ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);

  console.log('--- Step 2: Fill username ---');
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await sleep(300);
  await page.click('.signInBtn', { force: true });

  console.log('--- Step 3: MS login ---');
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(2000);

  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await sleep(300);
  await page.click('[type="submit"]');
  await sleep(3000);

  console.log('--- Step 4: Fill password ---');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await sleep(300);
  await page.click('[type="submit"]');
  await sleep(5000);

  console.log('After password, URL:', page.url().substring(0, 80));

  // Handle various post-login states
  let attempt = 0;
  while (attempt < 10 && !page.url().startsWith(BASE_URL)) {
    attempt++;
    const url = page.url();
    const title = await page.title();
    console.log(`[Attempt ${attempt}] URL: ${url.substring(0, 80)}, Title: ${title}`);
    await page.screenshot({ path: `screenshots/login_step_${attempt}.png`, fullPage: true });

    if (title.includes("keep your account secure") || title.includes("More information required")) {
      console.log('MFA setup prompt detected');
      await handleMFAPrompt(page);
    } else if (url.includes('kmsi') || title.includes('Stay signed in')) {
      // "Stay signed in?" prompt
      console.log('Stay signed in prompt');
      try {
        await page.click('[id="idSIButton9"]', { timeout: 3000 }); // "Yes" button
      } catch (_) {
        await page.click('[type="submit"]', { timeout: 3000 }).catch(() => {});
      }
      await sleep(3000);
    } else if (url.includes('login.microsoftonline.com') || url.includes('b2clogin')) {
      // Still on MS login - check for "Next" or submit
      try {
        const nextBtn = page.locator('[type="submit"], [value="Next"], button:has-text("Next")').first();
        if (await nextBtn.isVisible({ timeout: 3000 })) {
          await nextBtn.click();
          await sleep(3000);
        } else {
          break;
        }
      } catch (_) { break; }
    } else {
      await sleep(3000);
    }
  }

  const finalUrl = page.url();
  await page.screenshot({ path: 'screenshots/final_login.png', fullPage: true });
  console.log('\nFinal login URL:', finalUrl.substring(0, 100));
  return finalUrl.startsWith(BASE_URL);
}

async function exploreApp(page) {
  console.log('\n=== EXPLORING PERMIT APPLICATION ===');
  await sleep(3000); // Let app fully load
  await page.screenshot({ path: 'screenshots/app_home.png', fullPage: true });
  
  // Get all visible text
  const visibleElements = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      if (!text || text.length < 2 || text.length > 100) return;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
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

  console.log('\nAll visible elements on home page:');
  visibleElements.forEach(el => {
    const marker = el.clickable ? '[CLICK]' : '      ';
    console.log(`  ${marker} [${el.tag}]${el.id ? '#' + el.id : ''} "${el.text}"`);
  });

  fs.writeFileSync('app_home_elements.json', JSON.stringify(visibleElements, null, 2));
  console.log('\nSaved app_home_elements.json');

  // Look for permit-related navigation
  const permitItems = visibleElements.filter(el => 
    /permit|application|license|licence|approval|submission|case/i.test(el.text)
  );
  console.log('\nPermit-related elements:');
  permitItems.forEach(el => console.log(`  [${el.tag}] "${el.text}" ${el.href || ''}`));

  return visibleElements;
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
    console.log('\n✓ Logged in:', loggedIn, '| URL:', page.url().substring(0, 80));

    if (page.url().startsWith(BASE_URL)) {
      await exploreApp(page);
    } else {
      console.log('\n✗ Not at app URL. Need manual intervention.');
      await sleep(30000); // Wait 30s for manual login if needed
    }
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: 'screenshots/error.png', fullPage: true }).catch(() => {});
  }

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
