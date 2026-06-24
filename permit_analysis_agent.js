/**
 * Permit Application Agent - Full Analysis
 * Marston Notice Processing System
 * 
 * This script:
 * 1. Logs in via Microsoft OAuth (with Skip MFA setup)
 * 2. Saves session cookies for reuse
 * 3. Explores all navigation sections
 * 4. Expands menus, navigates pages, captures screenshots
 * 5. Generates a comprehensive analysis report
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = { email: 'freedomappsvc@itsvc.co.uk', password: 'H@rd4r!v3+' };
const SCREENSHOT_DIR = 'screenshots/analysis';
const SESSION_FILE = 'session_state.json';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function safeFilename(name) { return name.replace(/[^a-z0-9]/gi, '_').substring(0, 40).toLowerCase(); }

// ── LOGIN ────────────────────────────────────────────────────────────────────
async function login(page) {
  console.log('🔐 Logging in...');

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await page.click('.signInBtn', { force: true });

  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await page.click('[type="submit"]');
  await sleep(3000);

  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await page.click('[type="submit"]');
  await sleep(5000);

  // MFA setup "Next"
  try {
    const nextBtn = page.locator('input[type="submit"]').first();
    if (await nextBtn.isVisible({ timeout: 4000 })) {
      await nextBtn.click();
      await sleep(5000);
    }
  } catch (_) {}

  // mysignins "Skip setup"
  if (page.url().includes('mysignins')) {
    await sleep(8000); // React needs time
    try {
      await page.click('button:has-text("Skip setup")', { timeout: 5000 });
      console.log('   Skipped MFA setup');
      await sleep(5000);
    } catch (_) {}
  }

  // Wait for app (handle KMSI)
  for (let i = 0; i < 30; i++) {
    if (page.url().startsWith(BASE_URL)) break;
    try {
      const yesBtn = page.locator('#idSIButton9').first();
      if (await yesBtn.isVisible({ timeout: 500 })) { await yesBtn.click(); await sleep(3000); }
    } catch (_) {}
    await sleep(2000);
  }

  const ok = page.url().startsWith(BASE_URL);
  if (ok) console.log('✅ Logged in!');
  else console.log('❌ Login failed. URL:', page.url().substring(0, 80));
  return ok;
}

// ── CAPTURE PAGE ─────────────────────────────────────────────────────────────
async function capturePage(page, name) {
  await sleep(2000);
  const fname = safeFilename(name) + '.png';
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, fname), fullPage: true });

  const elements = await page.evaluate(() => {
    const items = [];
    const seen = new Set();
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      if (!text || text.length < 2 || text.length > 120 || seen.has(text)) return;
      seen.add(text);
      const s = window.getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return;
      if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
      items.push({
        tag: el.tagName,
        id: el.id || '',
        cls: el.className?.toString().substring(0, 60) || '',
        text,
        href: el.href || '',
        clickable: s.cursor === 'pointer'
      });
    });
    return items;
  });

  // Also capture table headers and form fields
  const tables = await page.evaluate(() => {
    const t = [];
    document.querySelectorAll('table, [role="grid"], [role="table"]').forEach(table => {
      const headers = [...table.querySelectorAll('th, [role="columnheader"]')]
        .map(h => h.textContent?.trim()).filter(Boolean);
      if (headers.length > 0) t.push(headers);
    });
    return t;
  });

  const forms = await page.evaluate(() => {
    const f = [];
    document.querySelectorAll('input, select, textarea').forEach(el => {
      const label = el.labels?.[0]?.textContent?.trim()
        || el.getAttribute('placeholder')
        || el.getAttribute('aria-label')
        || el.id;
      if (label) f.push({ type: el.tagName + (el.type ? `[${el.type}]` : ''), label, name: el.name });
    });
    return f;
  });

  return { name, url: page.url(), screenshot: fname, elements, tables, forms };
}

// ── EXPLORE MENU ─────────────────────────────────────────────────────────────
async function exploreMenu(page, report) {
  console.log('\n🗺️  Exploring menu structure...');

  // First expand all collapsible menus
  const expandableMenus = await page.$$('[class*="menuItem"] [class*="expandIcon"], [aria-expanded="false"]');
  console.log(`   Found ${expandableMenus.length} expandable items`);

  // Get all sidebar links before expanding
  const sidebarLinks = await page.$$eval(
    'nav a, aside a, [class*="sidebar"] a, [class*="menu"] a, [class*="nav"] a',
    els => els.map(e => ({ text: e.textContent?.trim(), href: e.href, class: e.className }))
              .filter(e => e.text && e.text.length > 1)
  );
  console.log('   Sidebar links:', sidebarLinks.map(l => `"${l.text}"`).join(', '));

  // Click each menu item to expand submenus
  const menuItems = await page.$$('[class*="MuiListItem"], [class*="menuItem"], li[class*="nav"]');
  console.log(`   Menu items: ${menuItems.length}`);

  // Try clicking expandable items
  for (const item of menuItems.slice(0, 20)) {
    try {
      const text = await item.textContent();
      const hasArrow = await item.$('[class*="expand"], [class*="arrow"], svg');
      if (hasArrow && text?.trim()) {
        await item.click();
        await sleep(500);
      }
    } catch (_) {}
  }

  await sleep(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'menu_expanded.png'), fullPage: true });

  // Get all visible links now
  const allLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a[href], [class*="menuItem"], [role="menuitem"]').forEach(el => {
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      const href = el.href || '';
      if (text && text.length > 1 && text.length < 60) {
        links.push({ text, href, class: el.className?.toString().substring(0, 40) });
      }
    });
    return links.filter((l, i, arr) => arr.findIndex(x => x.text === l.text) === i);
  });

  console.log('\n📋 All navigation items:');
  allLinks.forEach(l => console.log(`   "${l.text}" ${l.href ? '→ ' + l.href.substring(0, 60) : ''}`));

  return allLinks;
}

// ── NAVIGATE AND EXPLORE SECTIONS ────────────────────────────────────────────
async function exploreSections(page, report) {
  const sections = [];
  const visitedUrls = new Set([page.url()]);

  // First capture home
  console.log('\n📄 Capturing Home page...');
  const homeData = await capturePage(page, 'home');
  sections.push(homeData);
  report.pages.push(homeData);

  // Get all nav links after expanding menus
  const allLinks = await exploreMenu(page, report);

  // Filter to app-internal links
  const appLinks = allLinks.filter(l => l.href && l.href.startsWith(BASE_URL) && !visitedUrls.has(l.href));

  console.log(`\n🔍 Will explore ${appLinks.length} pages...`);

  for (const link of appLinks.slice(0, 25)) {
    if (visitedUrls.has(link.href)) continue;
    visitedUrls.add(link.href);

    console.log(`\n→ Navigating to: "${link.text}"`);
    try {
      await page.goto(link.href, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(2000);
      const pageData = await capturePage(page, link.text);
      sections.push(pageData);
      report.pages.push(pageData);

      // Print what we found
      const clickableItems = pageData.elements.filter(e => e.clickable);
      if (pageData.tables.length > 0) {
        console.log(`   Tables: ${pageData.tables.map(t => `[${t.slice(0,5).join('|')}]`).join(', ')}`);
      }
      if (pageData.forms.length > 0) {
        console.log(`   Forms: ${pageData.forms.map(f => f.label).join(', ')}`);
      }
      if (clickableItems.length > 0) {
        console.log(`   Clickable: ${clickableItems.slice(0, 8).map(e => `"${e.text}"`).join(', ')}`);
      }
    } catch (err) {
      console.log(`   Error: ${err.message.substring(0, 60)}`);
    }
  }

  // Also click sidebar items directly (for items without href)
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 20000 });
  await sleep(2000);
  
  const sidebarClickables = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('[class*="sidebar"] *, [class*="menu"] *, [class*="nav"] *').forEach(el => {
      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      const s = window.getComputedStyle(el);
      if (text && text.length > 2 && text.length < 40 && s.cursor === 'pointer' && el.childElementCount === 0) {
        items.push(text);
      }
    });
    return [...new Set(items)];
  });

  console.log('\n📌 Sidebar clickable items:', sidebarClickables.join(', '));

  // Click items not yet visited
  for (const itemText of sidebarClickables.slice(0, 20)) {
    try {
      const currentUrl = page.url();
      await page.click(`:text("${itemText.replace(/"/g, '\\"')}")`, { timeout: 3000 });
      await sleep(2000);

      const newUrl = page.url();
      if (newUrl !== currentUrl && newUrl.startsWith(BASE_URL) && !visitedUrls.has(newUrl)) {
        visitedUrls.add(newUrl);
        console.log(`\n→ Clicked "${itemText}" → ${newUrl.substring(BASE_URL.length)}`);
        const pageData = await capturePage(page, itemText);
        sections.push(pageData);
        report.pages.push(pageData);
        await page.goBack({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
        await sleep(1000);
      }
    } catch (_) {}
  }

  return sections;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame() && !frame.url().includes('cdn')) {
      process.stdout.write(`[NAV] ${frame.url().substring(0, 90)}\n`);
    }
  });

  const report = {
    timestamp: new Date().toISOString(),
    appName: 'Marston Notice Processing System',
    appUrl: BASE_URL,
    loginSuccessful: false,
    summary: {},
    pages: []
  };

  try {
    report.loginSuccessful = await login(page);
    if (!page.url().startsWith(BASE_URL)) {
      console.log('Cannot proceed — login failed');
      await browser.close();
      return;
    }

    // Let the app fully render
    await sleep(5000);

    // Explore all sections
    await exploreSections(page, report);

    // Build summary
    report.summary = {
      totalPages: report.pages.length,
      pagesWithForms: report.pages.filter(p => p.forms.length > 0).length,
      pagesWithTables: report.pages.filter(p => p.tables.length > 0).length,
      allFormFields: [...new Set(report.pages.flatMap(p => p.forms.map(f => f.label)))],
      allTableHeaders: [...new Set(report.pages.flatMap(p => p.tables.flat()))],
      navigationItems: [...new Set(report.pages.map(p => p.name))]
    };

    // Print final report
    console.log('\n' + '═'.repeat(65));
    console.log('📊 MARSTON NPS - PERMIT APPLICATION ANALYSIS REPORT');
    console.log('═'.repeat(65));
    console.log(`✅ Login: ${report.loginSuccessful ? 'Success' : 'Failed'}`);
    console.log(`📄 Pages explored: ${report.summary.totalPages}`);
    console.log(`📝 Pages with forms: ${report.summary.pagesWithForms}`);
    console.log(`📋 Pages with tables: ${report.summary.pagesWithTables}`);
    console.log('\n🗂️  Navigation Structure:');
    report.summary.navigationItems.forEach(name => console.log(`   • ${name}`));
    if (report.summary.allFormFields.length > 0) {
      console.log('\n📝 Form Fields Found:');
      report.summary.allFormFields.forEach(f => console.log(`   • ${f}`));
    }
    if (report.summary.allTableHeaders.length > 0) {
      console.log('\n📋 Table Columns Found:');
      report.summary.allTableHeaders.forEach(h => console.log(`   • ${h}`));
    }
    console.log('\nScreenshots saved in:', SCREENSHOT_DIR);
    console.log('Full report: permit_analysis_report.json');

    fs.writeFileSync('permit_analysis_report.json', JSON.stringify(report, null, 2));

  } catch (err) {
    console.error('Fatal error:', err.message);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error.png'), fullPage: true }).catch(() => {});
  }

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
