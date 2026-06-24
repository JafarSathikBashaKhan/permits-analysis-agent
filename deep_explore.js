/**
 * Marston NPS - Contract & Sub-Menu Deep Exploration
 * Explores contracts, Configuration sub-items, and finds permit application workflows
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = { email: 'freedomappsvc@itsvc.co.uk', password: 'H@rd4r!v3+' };
const OUT_DIR = 'screenshots/deep';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function login(page) {
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
  try {
    const n = page.locator('input[type="submit"]').first();
    if (await n.isVisible({ timeout: 4000 })) { await n.click(); await sleep(5000); }
  } catch (_) {}
  if (page.url().includes('mysignins')) {
    await sleep(8000);
    try { await page.click('button:has-text("Skip setup")', { timeout: 5000 }); await sleep(5000); } catch (_) {}
  }
  for (let i = 0; i < 30; i++) {
    if (page.url().startsWith(BASE_URL)) break;
    try { const y = page.locator('#idSIButton9').first(); if (await y.isVisible({ timeout: 500 })) { await y.click(); await sleep(3000); } } catch (_) {}
    await sleep(2000);
  }
  return page.url().startsWith(BASE_URL);
}

async function snap(page, name) {
  const fname = name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50) + '.png';
  await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });
  return fname;
}

async function getButtons(page) {
  return page.evaluate(() => {
    const btns = new Set();
    document.querySelectorAll('button, [role="button"], [role="tab"], [role="menuitem"]').forEach(el => {
      const t = el.textContent?.trim().replace(/\s+/g, ' ');
      const s = window.getComputedStyle(el);
      if (t && t.length > 1 && t.length < 60 && s.display !== 'none' && el.offsetHeight > 0) btns.add(t);
    });
    return [...btns];
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) process.stdout.write(`[NAV] ${frame.url().substring(BASE_URL.length, 80) || '/'}\n`);
  });

  console.log('Logging in...');
  const ok = await login(page);
  if (!ok) { console.log('Login failed'); await browser.close(); return; }
  console.log('✅ Logged in!\n');
  await sleep(5000);

  const report = [];

  // ── 1. Click on AutomationApplyIQ contract ──────────────────────────────
  console.log('=== Exploring AutomationApplyIQ contract ===');
  try {
    await page.click('text="AutomationApplyIQ"', { timeout: 5000 });
    await sleep(3000);
    await snap(page, '1_contract_applyiq');
    const btns = await getButtons(page);
    console.log('Buttons:', btns.join(', '));
    
    // Get page content
    const content = await page.evaluate(() => {
      const texts = new Set();
      document.querySelectorAll('*').forEach(el => {
        if (el.childElementCount > 0) return;
        const t = el.textContent?.trim().replace(/\s+/g, ' ');
        if (t && t.length > 1 && t.length < 100) {
          const s = window.getComputedStyle(el);
          if (s.display !== 'none' && el.offsetHeight > 0) texts.add(t);
        }
      });
      return [...texts];
    });
    console.log('Content:', content.slice(0, 30).join(' | '));
    report.push({ section: 'AutomationApplyIQ Contract', buttons: btns, content: content.slice(0, 50) });

    // Explore tabs/sections within contract
    for (const btn of btns.slice(0, 15)) {
      try {
        console.log(`  → Clicking "${btn}"`);
        await page.click(`text="${btn}"`, { timeout: 3000 });
        await sleep(2000);
        const safeName = `1_applyiq_${btn.replace(/[^a-z0-9]/gi,'_').toLowerCase().substring(0,20)}`;
        await snap(page, safeName);
        const subBtns = await getButtons(page);
        const headers = await page.$$eval('th, [role="columnheader"]', els => els.map(e => e.textContent?.trim()).filter(Boolean));
        const fields = await page.$$eval('input, select', els => els.map(e => e.placeholder || e.getAttribute('aria-label') || e.id).filter(Boolean));
        console.log(`    Headers: ${headers.join(', ') || 'none'}`);
        console.log(`    Fields: ${fields.join(', ') || 'none'}`);
        report.push({ section: `ApplyIQ - ${btn}`, headers, fields, buttons: subBtns.slice(0, 10) });
      } catch (_) {}
    }
  } catch (err) { console.log('ApplyIQ error:', err.message.substring(0,60)); }

  // ── 2. Expand "All" contracts and click first few ─────────────────────────
  console.log('\n=== Expanding All Contracts on Home ===');
  await page.click('text="Home"', { timeout: 5000 }).catch(() => {});
  await sleep(2000);
  try {
    await page.click('text="All (465)"', { timeout: 5000 });
    await sleep(3000);
    await snap(page, '2_all_contracts');
    const contractCards = await page.$$eval('[class*="card"], [class*="contract"], [class*="tile"]',
      els => els.map(e => e.textContent?.trim().replace(/\s+/g, ' ').substring(0, 60)).filter(Boolean).slice(0, 20)
    );
    console.log('Contracts visible:', contractCards.join(' | '));
  } catch (err) { console.log('All contracts error:', err.message.substring(0, 60)); }

  // ── 3. Configuration sub-menus ────────────────────────────────────────────
  console.log('\n=== Exploring Configuration sub-items ===');
  await page.click('text="Configuration"', { timeout: 5000 }).catch(() => {});
  await sleep(1500);

  const configSubItems = ['Users', 'Templates', 'Zone', 'Location', 'Controlled Parking Zone', 
    'Vehicle Type', 'Contravention Codes', 'FAQ', 'Cancellation Reasons', 'Reject Reasons', 
    'CP Rep. Grounds', 'Hold', 'Geo Fencing Setup', 'Reporting'];

  for (const item of configSubItems) {
    try {
      console.log(`\n→ Configuration > ${item}`);
      await page.click(`text="${item}"`, { timeout: 4000 });
      await sleep(2000);
      await snap(page, `3_config_${item.replace(/\s/g,'_').toLowerCase()}`);
      const headers = await page.$$eval('th, [role="columnheader"]', els => els.map(e => e.textContent?.trim()).filter(Boolean));
      const fields = await page.$$eval('input:not([type=hidden]), select', els => 
        els.map(e => e.placeholder || e.getAttribute('aria-label') || e.id).filter(Boolean));
      const btns = await getButtons(page);
      console.log(`  Headers: ${headers.join(', ') || 'none'}`);
      console.log(`  Fields: ${fields.join(', ') || 'none'}`);
      console.log(`  Buttons: ${btns.slice(0,8).join(', ')}`);
      report.push({ section: `Configuration > ${item}`, headers, fields, buttons: btns.slice(0,10) });
    } catch (err) { console.log(`  Error: ${err.message.substring(0,50)}`); }
  }

  // ── 4. Client Setup sub-menus ─────────────────────────────────────────────
  console.log('\n=== Exploring Client Setup sub-items ===');
  await page.click('text="Client Setup"', { timeout: 5000 }).catch(() => {});
  await sleep(1500);

  const clientSetupItems = ['Organisation', 'Contract', 'Branding', 'Prefix', 'Enforcement Agency', 'Purge'];
  for (const item of clientSetupItems) {
    try {
      console.log(`\n→ Client Setup > ${item}`);
      await page.click(`text="${item}"`, { timeout: 4000 });
      await sleep(2000);
      await snap(page, `4_clientsetup_${item.replace(/\s/g,'_').toLowerCase()}`);
      const headers = await page.$$eval('th, [role="columnheader"]', els => els.map(e => e.textContent?.trim()).filter(Boolean));
      const fields = await page.$$eval('input:not([type=hidden]), select', els => 
        els.map(e => e.placeholder || e.getAttribute('aria-label') || e.id).filter(Boolean));
      const btns = await getButtons(page);
      console.log(`  Headers: ${headers.join(', ') || 'none'}`);
      console.log(`  Fields: ${fields.join(', ') || 'none'}`);
      console.log(`  Buttons: ${btns.slice(0,8).join(', ')}`);
      report.push({ section: `Client Setup > ${item}`, headers, fields, buttons: btns.slice(0,10) });
    } catch (err) { console.log(`  Error: ${err.message.substring(0,50)}`); }
  }

  // ── 5. CR Configuration sub-menus ─────────────────────────────────────────
  console.log('\n=== Exploring CR Configuration sub-items ===');
  await page.click('text="CR Configuration"', { timeout: 5000 }).catch(() => {});
  await sleep(1500);
  const crItems = ['Pound Location', 'Cancellation Reasons', 'Priority Settings', 'Truck', 'Charge', 'Release Reasons'];
  for (const item of crItems) {
    try {
      console.log(`\n→ CR Config > ${item}`);
      await page.click(`text="${item}"`, { timeout: 4000 });
      await sleep(2000);
      await snap(page, `5_crconfig_${item.replace(/\s/g,'_').toLowerCase()}`);
      const headers = await page.$$eval('th, [role="columnheader"]', els => els.map(e => e.textContent?.trim()).filter(Boolean));
      const btns = await getButtons(page);
      console.log(`  Headers: ${headers.join(', ') || 'none'}`);
      console.log(`  Buttons: ${btns.slice(0,8).join(', ')}`);
      report.push({ section: `CR Config > ${item}`, headers, buttons: btns.slice(0,10) });
    } catch (err) { console.log(`  Error: ${err.message.substring(0,50)}`); }
  }

  // ── Save report ───────────────────────────────────────────────────────────
  fs.writeFileSync('deep_exploration_report.json', JSON.stringify(report, null, 2));

  console.log('\n' + '═'.repeat(60));
  console.log('📊 DEEP EXPLORATION COMPLETE');
  console.log('═'.repeat(60));
  report.forEach(r => {
    console.log(`\n📄 ${r.section}`);
    if (r.headers?.length > 0) console.log(`   Cols: ${r.headers.slice(0,6).join(' | ')}`);
    if (r.fields?.length > 0) console.log(`   Fields: ${r.fields.slice(0,5).join(', ')}`);
    if (r.buttons?.length > 0) console.log(`   Btns: ${r.buttons.slice(0,6).join(', ')}`);
  });

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
