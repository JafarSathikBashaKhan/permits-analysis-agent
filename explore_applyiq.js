/**
 * ApplyIQ Permit Application System - Deep Exploration
 * Navigates all sections within the Wokingham BC permit application portal
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = { email: 'freedomappsvc@itsvc.co.uk', password: 'H@rd4r!v3+' };
const OUT_DIR = 'screenshots/applyiq';

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
  try { const n = page.locator('input[type="submit"]').first(); if (await n.isVisible({ timeout: 4000 })) { await n.click(); await sleep(5000); } } catch (_) {}
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

async function navigateToApplyIQ(page) {
  await sleep(5000);
  // Click AutomationApplyIQ contract
  await page.click('text="AutomationApplyIQ"', { timeout: 8000 });
  await sleep(3000);
  // Click "Application" in the contract view
  await page.click('text="Application"', { timeout: 5000 });
  await sleep(3000);
  console.log('✅ In ApplyIQ portal. URL:', page.url().substring(0, 80));
}

async function snap(page, name) {
  const fname = name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50) + '.png';
  await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });
  console.log(`   📸 ${fname}`);
  return fname;
}

async function captureSection(page, label) {
  const fname = await snap(page, label);
  
  const data = await page.evaluate(() => {
    const s = new Set();
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const t = el.textContent?.trim().replace(/\s+/g, ' ');
      if (t && t.length > 1 && t.length < 120) {
        const st = window.getComputedStyle(el);
        if (st.display !== 'none' && el.offsetHeight > 0) s.add(t);
      }
    });

    const headers = [...document.querySelectorAll('th, [role="columnheader"], [class*="tableHead"]')]
      .map(e => e.textContent?.trim()).filter(Boolean);
    
    const fields = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')]
      .map(e => {
        const lbl = e.labels?.[0]?.textContent?.trim() || e.placeholder || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby'))?.textContent?.trim() || e.name || e.id;
        return lbl ? `${e.type || e.tagName}: ${lbl}` : null;
      }).filter(Boolean);

    const tabs = [...document.querySelectorAll('[role="tab"], [class*="tab"]')]
      .map(e => e.textContent?.trim()).filter(Boolean);

    const btns = [...document.querySelectorAll('button, [role="button"]')]
      .map(e => e.textContent?.trim().replace(/\s+/g, ' ')).filter(t => t && t.length > 1 && t.length < 50);

    return {
      texts: [...s].slice(0, 60),
      headers: [...new Set(headers)].slice(0, 20),
      fields: [...new Set(fields)].slice(0, 20),
      tabs: [...new Set(tabs)].slice(0, 15),
      buttons: [...new Set(btns)].slice(0, 20)
    };
  });

  return { label, screenshot: fname, ...data };
}

async function clickAndCapture(page, selector, name) {
  try {
    await page.click(selector, { timeout: 5000 });
    await sleep(2000);
    return await captureSection(page, name);
  } catch (err) {
    console.log(`   ⚠️  Could not click "${name}": ${err.message.substring(0, 50)}`);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) process.stdout.write(`  [NAV] ${frame.url().substring(0, 90)}\n`);
  });

  console.log('🔐 Logging in...');
  const ok = await login(page);
  if (!ok) { console.log('Login failed'); await browser.close(); return; }
  console.log('✅ Logged in!');

  await navigateToApplyIQ(page);

  const report = { system: 'Marston ApplyIQ - Permit Application', sections: [] };

  // ── Dashboard ────────────────────────────────────────────────────────────
  console.log('\n=== Dashboard ===');
  const dash = await captureSection(page, 'dashboard');
  report.sections.push(dash);
  console.log('  Tabs:', dash.tabs.join(', '));
  console.log('  Text sample:', dash.texts.slice(0, 10).join(' | '));

  // Click FINANCE tab on dashboard
  const finance = await clickAndCapture(page, 'text="FINANCE"', 'dashboard_finance');
  if (finance) {
    report.sections.push(finance);
    console.log('  Finance texts:', finance.texts.slice(0, 10).join(' | '));
  }

  // ── Applications section ─────────────────────────────────────────────────
  console.log('\n=== Applications ===');
  await clickAndCapture(page, 'text="Applications"', 'temp');
  await sleep(500);

  // Application types
  for (const appType of ['Suspension', 'Permit', 'Dispensation']) {
    console.log(`\n--- Applications > ${appType} ---`);
    const data = await clickAndCapture(page, `text="${appType}"`, `applications_${appType.toLowerCase()}`);
    if (data) {
      report.sections.push(data);
      console.log('  Tabs:', data.tabs.join(', '));
      console.log('  Headers:', data.headers.join(', '));
      console.log('  Buttons:', data.buttons.slice(0,8).join(', '));
      
      // Look for sub-tabs like "All", "Approved", "Rejected", etc.
      const tabButtons = data.tabs.filter(t => !['Suspension', 'Permit', 'Dispensation', 'Applications', 'Dashboard'].includes(t));
      console.log('  Sub-tabs:', tabButtons.join(', '));
      
      for (const tab of tabButtons.slice(0, 6)) {
        const tabData = await clickAndCapture(page, `text="${tab}"`, `${appType.toLowerCase()}_tab_${tab.replace(/\s/g,'_').toLowerCase()}`);
        if (tabData) {
          report.sections.push(tabData);
          console.log(`    Tab "${tab}": headers=${tabData.headers.join(',')} fields=${tabData.fields.join(',')}`);
        }
      }
    }
  }

  // ── Area section ─────────────────────────────────────────────────────────
  console.log('\n=== Area ===');
  await clickAndCapture(page, 'text="Area"', 'temp');
  await sleep(500);

  for (const area of ['Streets', 'Zones', 'Locations', 'SpecialEvents']) {
    console.log(`\n--- Area > ${area} ---`);
    const data = await clickAndCapture(page, `text="${area}"`, `area_${area.toLowerCase()}`);
    if (data) {
      report.sections.push(data);
      console.log('  Headers:', data.headers.join(', '));
      console.log('  Buttons:', data.buttons.slice(0,6).join(', '));
    }
  }

  // ── Users section ────────────────────────────────────────────────────────
  console.log('\n=== Users ===');
  const usersData = await clickAndCapture(page, 'text="Users"', 'users');
  if (usersData) {
    report.sections.push(usersData);
    console.log('  Tabs:', usersData.tabs.join(', '));
    
    for (const tab of ['System Users', 'Applicants', 'Roles and Permissions'].filter(t => usersData.tabs.includes(t))) {
      const tabData = await clickAndCapture(page, `text="${tab}"`, `users_${tab.replace(/\s/g,'_').toLowerCase()}`);
      if (tabData) { report.sections.push(tabData); console.log(`  ${tab}: headers=${tabData.headers.join(',')}`); }
    }
  }

  // ── Reports section ──────────────────────────────────────────────────────
  console.log('\n=== Reports ===');
  const reportsData = await clickAndCapture(page, 'text="Reports"', 'reports');
  if (reportsData) {
    report.sections.push(reportsData);
    console.log('  Tabs:', reportsData.tabs.join(', '));
    console.log('  Buttons:', reportsData.buttons.slice(0,8).join(', '));
  }

  // ── Contract Settings ─────────────────────────────────────────────────────
  console.log('\n=== Contract Settings ===');
  const contractData = await clickAndCapture(page, 'text="Contract Settings"', 'contract_settings');
  if (contractData) {
    report.sections.push(contractData);
    console.log('  Tabs:', contractData.tabs.join(', '));
    console.log('  Fields:', contractData.fields.join(', '));
    // Explore tabs
    for (const tab of contractData.tabs.slice(0, 8)) {
      const t = await clickAndCapture(page, `text="${tab}"`, `contractsettings_${tab.replace(/\s/g,'_').toLowerCase()}`);
      if (t) { report.sections.push(t); console.log(`  ${tab}: fields=${t.fields.join(',')}`); }
    }
  }

  // ── Vehicles ─────────────────────────────────────────────────────────────
  console.log('\n=== Vehicles ===');
  const vehiclesData = await clickAndCapture(page, 'text="Vehicles"', 'vehicles');
  if (vehiclesData) {
    report.sections.push(vehiclesData);
    console.log('  Headers:', vehiclesData.headers.join(', '));
    console.log('  Buttons:', vehiclesData.buttons.slice(0,6).join(', '));
  }

  // ── Apply Config ─────────────────────────────────────────────────────────
  console.log('\n=== Apply Config ===');
  await clickAndCapture(page, 'text="Apply Config"', 'temp');
  await sleep(500);
  const acData = await captureSection(page, 'apply_config');
  if (acData) {
    report.sections.push(acData);
    console.log('  Tabs:', acData.tabs.join(', '));
    console.log('  Buttons:', acData.buttons.slice(0,8).join(', '));
  }

  // ── System Audits ─────────────────────────────────────────────────────────
  console.log('\n=== System Audits ===');
  const auditsData = await clickAndCapture(page, 'text="System Audits"', 'system_audits');
  if (auditsData) {
    report.sections.push(auditsData);
    console.log('  Headers:', auditsData.headers.join(', '));
    console.log('  Fields:', auditsData.fields.join(', '));
  }

  // ── Save comprehensive report ─────────────────────────────────────────────
  fs.writeFileSync('applyiq_report.json', JSON.stringify(report, null, 2));

  console.log('\n' + '═'.repeat(65));
  console.log('📊 APPLYIQ PERMIT APPLICATION SYSTEM - ANALYSIS COMPLETE');
  console.log('═'.repeat(65));
  console.log(`Sections explored: ${report.sections.length}`);
  report.sections.forEach(s => {
    if (s) {
      console.log(`\n  📄 ${s.label}`);
      if (s.headers?.length) console.log(`     📋 Columns: ${s.headers.slice(0,6).join(' | ')}`);
      if (s.fields?.length) console.log(`     📝 Fields: ${s.fields.slice(0,5).join(', ')}`);
      if (s.tabs?.length) console.log(`     🗂️  Tabs: ${s.tabs.slice(0,6).join(', ')}`);
      if (s.buttons?.length) console.log(`     🔘 Buttons: ${s.buttons.slice(0,5).join(', ')}`);
    }
  });

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
