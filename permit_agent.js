/**
 * Permit Application Agent - Main Script
 * Logs in to Marston NPS, explores permit-related sections,
 * and generates a structured report.
 */
const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = {
  email: 'freedomappsvc@itsvc.co.uk',
  password: 'H@rd4r!v3+'
};
const SCREENSHOT_DIR = 'screenshots';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function performLogin(page) {
  // --- App username ---
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await page.click('.signInBtn', { force: true });

  // --- MS OAuth email ---
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await page.click('[type="submit"]');
  await sleep(3000);

  // --- MS password ---
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await page.click('[type="submit"]');
  await sleep(5000);

  // --- "Let's keep your account secure" — click Next ---
  try {
    const nextBtn = page.locator('input[type="submit"]').first();
    if (await nextBtn.isVisible({ timeout: 4000 })) {
      console.log('  Clicking Next on MFA setup prompt...');
      await nextBtn.click();
      await sleep(5000);
    }
  } catch (_) {}

  // --- mysignins.microsoft.com/register — click "Skip setup" ---
  if (page.url().includes('mysignins')) {
    console.log("Checking for skip button at:", page.url().substring(0,80));
  try {
    const skipBtn = page.locator('button:has-text("Skip setup")').first();
      if (await skipBtn.isVisible({ timeout: 8000 })) {
        console.log('  Clicking "Skip setup" on mysignins...');
        await skipBtn.click();
        await sleep(5000);
      }
    } catch (_) {}
  }

  // --- Wait for redirect back to app (KMSI → app) ---
  for (let i = 0; i < 30; i++) {
    const url = page.url();
    if (url.startsWith(BASE_URL)) break;

    // KMSI "Stay signed in?" prompt
    if (url.includes('kmsi') || url.includes('login.microsoftonline')) {
      try {
        const yesBtn = page.locator('#idSIButton9, input[value="Yes"]').first();
        if (await yesBtn.isVisible({ timeout: 1500 })) {
          console.log('  Clicking Yes on KMSI...');
          await yesBtn.click();
          await sleep(3000);
          continue;
        }
      } catch (_) {}
    }

    await sleep(2000);
  }

  return page.url().startsWith(BASE_URL);
}

async function getPageElements(page) {
  return page.evaluate(() => {
    const seen = new Set();
    const items = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      if (!text || text.length < 2 || text.length > 120 || seen.has(text)) return;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
      seen.add(text);
      items.push({
        tag: el.tagName,
        id: el.id || '',
        cls: el.className?.toString().substring(0, 80) || '',
        text,
        href: el.href || '',
        clickable: style.cursor === 'pointer'
      });
    });
    return items;
  });
}

async function explorePage(page, name, depth = 0) {
  await sleep(2000);
  const safeName = name.replace(/[^a-z0-9]/gi, '_').substring(0, 40);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${safeName}.png`, fullPage: true });
  const elements = await getPageElements(page);
  const url = page.url();
  console.log(`\n📄 Page: "${name}" — ${url.substring(0, 80)}`);
  console.log(`   Elements: ${elements.length}`);
  
  const clickable = elements.filter(e => e.clickable || e.tag === 'A');
  console.log(`   Clickable: ${clickable.map(e => `"${e.text}"`).join(', ')}`);

  return { name, url, screenshotFile: `${safeName}.png`, elements };
}

async function navigateToSection(page, selector, name) {
  try {
    await page.click(selector, { timeout: 5000 });
    await sleep(3000);
    return await explorePage(page, name, 1);
  } catch (err) {
    console.log(`  Could not navigate to "${name}": ${err.message.substring(0, 60)}`);
    return null;
  }
}

async function explorePermitSections(page, homeElements) {
  const results = [];

  // Find all unique navigation links and permit-related items
  const allClickable = homeElements.filter(e => e.clickable || e.tag === 'A');
  
  // Sort by permit-relevance
  const permitKeywords = /permit|application|applic|licen|approv|submiss|case|notice|pcn|enforce|street|work/i;
  const permitItems = allClickable.filter(e => permitKeywords.test(e.text));
  const otherNavItems = allClickable.filter(e => !permitKeywords.test(e.text) && e.text.length < 40);

  console.log('\n🔍 Permit-related items:', permitItems.map(e => `"${e.text}"`).join(', '));
  console.log('🗺️  Other nav items:', otherNavItems.map(e => `"${e.text}"`).join(', '));

  // Navigate to permit sections
  for (const item of permitItems.slice(0, 8)) {
    if (item.href && item.href.startsWith(BASE_URL)) {
      console.log(`\n→ Navigating to: "${item.text}"`);
      await page.goto(item.href, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      const pageData = await explorePage(page, item.text, 1);
      results.push(pageData);
      
      // If this is a list/grid page, look for individual items to click
      const subItems = (await getPageElements(page)).filter(e => e.clickable);
      console.log(`   Sub-items (${subItems.length}):`, subItems.slice(0, 5).map(e => `"${e.text}"`).join(', '));
    } else if (item.clickable) {
      console.log(`\n→ Clicking: "${item.text}"`);
      try {
        await page.click(`:text("${item.text.replace(/"/g, '\\"')}")`, { timeout: 5000 });
        await sleep(3000);
        const pageData = await explorePage(page, item.text, 1);
        results.push(pageData);
        await page.goBack({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
        await sleep(1500);
      } catch (err) {
        console.log(`   Error: ${err.message.substring(0, 60)}`);
      }
    }
  }

  // Also explore top-level nav items
  for (const item of otherNavItems.slice(0, 5)) {
    if (item.href && item.href.startsWith(BASE_URL) && !results.find(r => r.url === item.href)) {
      console.log(`\n→ Exploring nav: "${item.text}"`);
      await page.goto(item.href, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      const pageData = await explorePage(page, item.text, 1);
      results.push(pageData);
    }
  }

  return results;
}

async function main() {
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) console.log('[NAV]', frame.url().substring(0, 100));
  });

  const report = {
    timestamp: new Date().toISOString(),
    appUrl: BASE_URL,
    loginSuccessful: false,
    home: null,
    sections: []
  };

  try {
    console.log('🔐 Logging in...');
    const loggedIn = await performLogin(page);
    report.loginSuccessful = loggedIn;
    console.log(`\n✅ Login: ${loggedIn ? 'SUCCESS' : 'FAILED'} | URL: ${page.url().substring(0, 80)}`);

    if (!page.url().startsWith(BASE_URL)) {
      console.log('❌ Not at app. Aborting.');
      await browser.close();
      return;
    }

    // Explore home page
    console.log('\n🏠 Exploring home page...');
    report.home = await explorePage(page, 'home');

    // Explore permit sections
    report.sections = await explorePermitSections(page, report.home.elements);

    // Save full report
    fs.writeFileSync('permit_analysis_report.json', JSON.stringify(report, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 PERMIT APPLICATION ANALYSIS REPORT');
    console.log('='.repeat(60));
    console.log(`Login: ${report.loginSuccessful ? '✅' : '❌'}`);
    console.log(`Home elements: ${report.home?.elements?.length || 0}`);
    console.log(`Sections explored: ${report.sections.length}`);
    report.sections.forEach(s => {
      console.log(`  - "${s.name}" (${s.elements?.length || 0} elements) → ${s.screenshotFile}`);
    });
    console.log('\nSaved: permit_analysis_report.json');
    console.log('Screenshots in:', SCREENSHOT_DIR + '/');

  } catch (err) {
    console.error('Fatal:', err.message);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/error.png`, fullPage: true }).catch(() => {});
  }

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);

