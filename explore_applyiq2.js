/**
 * Shared robust login function for Marston NPS + ApplyIQ
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/';
const CREDENTIALS = { email: 'freedomappsvc@itsvc.co.uk', password: 'H@rd4r!v3+' };
const OUT_DIR = 'screenshots/applyiq';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function robustLogin(page, verbose = true) {
  const log = verbose ? console.log : () => {};
  
  log('Step 1: App username...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CREDENTIALS.email);
  await page.click('.signInBtn', { force: true });

  log('Step 2: MS email...');
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CREDENTIALS.email);
  await page.click('[type="submit"]');
  await sleep(3000);

  log('Step 3: MS password...');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CREDENTIALS.password);
  await page.click('[type="submit"]');
  await sleep(5000);

  log('Step 4: Post-login flow...');
  // Handle the entire post-login flow in a single loop
  let attempts = 0;
  while (attempts < 40) {
    attempts++;
    const url = page.url();
    log(`  [${attempts}] URL: ${url.substring(0, 80)}`);

    if (url.startsWith(BASE_URL)) {
      log('✅ At app URL!');
      return true;
    }

    // MFA "Let's keep your account secure" - has input[type="submit"] with value "Next"
    if (url.includes('login.microsoftonline.com')) {
      try {
        const submitBtn = page.locator('input[type="submit"]').first();
        if (await submitBtn.isVisible({ timeout: 1500 })) {
          const val = await submitBtn.getAttribute('value');
          log(`  Clicking MS submit: "${val}"`);
          await submitBtn.click();
          await sleep(4000);
          continue;
        }
      } catch (_) {}
      // KMSI "Stay signed in?" 
      try {
        const yesBtn = page.locator('#idSIButton9').first();
        if (await yesBtn.isVisible({ timeout: 1500 })) {
          log('  Clicking KMSI Yes');
          await yesBtn.click();
          await sleep(3000);
          continue;
        }
      } catch (_) {}
    }

    // mysignins.microsoft.com/register - "Skip setup" button
    if (url.includes('mysignins')) {
      // Wait for React to render (up to 15s)
      log('  On mysignins, waiting for React...');
      let skipFound = false;
      for (let t = 0; t < 15 && !skipFound; t++) {
        await sleep(1000);
        try {
          const btns = await page.$$eval('button', els => 
            els.filter(e => e.offsetWidth > 0 && window.getComputedStyle(e).display !== 'none')
               .map(e => e.textContent?.trim().replace(/\s+/g, ' '))
               .filter(Boolean)
          );
          log(`  t=${t}s buttons: ${btns.join(', ')}`);
          if (btns.includes('Skip setup')) {
            skipFound = true;
            await page.click('button:has-text("Skip setup")');
            log('  ✅ Clicked "Skip setup"');
            await sleep(5000);
            break;
          }
        } catch (_) {}
      }
      if (!skipFound) {
        log('  "Skip setup" not found after 15s, trying alternate click...');
        // Try clicking by evaluating directly
        try {
          await page.evaluate(() => {
            const btns = document.querySelectorAll('button');
            for (const btn of btns) {
              if (btn.textContent.trim() === 'Skip setup') { btn.click(); return true; }
            }
            return false;
          });
          await sleep(5000);
        } catch (_) {}
      }
      continue;
    }

    await sleep(2000);
  }

  log('❌ Login failed after 40 attempts. URL:', page.url().substring(0, 80));
  return false;
}

async function navigateToApplyIQ(page) {
  await sleep(5000);
  await page.click('text="AutomationApplyIQ"', { timeout: 8000 });
  await sleep(4000);
  
  // If we land on permissions page but not dashboard, click "Application"
  const url = page.url();
  if (!url.includes('dashboard')) {
    try {
      await page.click('text="Application"', { timeout: 5000 });
      await sleep(3000);
    } catch (_) {}
  }
  console.log('✅ In ApplyIQ. URL:', page.url().substring(0, 80));
}

async function snap(page, name) {
  const fname = name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50) + '.png';
  await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });
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
    const headers = [...document.querySelectorAll('th, [role="columnheader"]')].map(e => e.textContent?.trim()).filter(Boolean);
    const fields = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].map(e => {
      const lbl = e.labels?.[0]?.textContent?.trim() || e.placeholder || e.getAttribute('aria-label') || e.name;
      return lbl ? `${e.type || e.tagName}: ${lbl}` : null;
    }).filter(Boolean);
    const tabs = [...document.querySelectorAll('[role="tab"]')].map(e => e.textContent?.trim()).filter(Boolean);
    const btns = [...document.querySelectorAll('button, [role="button"]')].map(e => e.textContent?.trim().replace(/\s+/g, ' ')).filter(t => t && t.length > 1 && t.length < 50);
    return { texts: [...s].slice(0, 60), headers: [...new Set(headers)], fields: [...new Set(fields)], tabs: [...new Set(tabs)], buttons: [...new Set(btns)] };
  });
  return { label, screenshot: fname, ...data };
}

async function cc(page, selector, label) {
  try {
    await page.click(selector, { timeout: 5000 });
    await sleep(2000);
    const data = await captureSection(page, label);
    console.log(`  📄 ${label}: headers=[${data.headers.slice(0,4).join(',')}] tabs=[${data.tabs.join(',')}] btns=[${data.buttons.slice(0,5).join(',')}]`);
    return data;
  } catch (err) {
    console.log(`  ⚠️  ${label}: ${err.message.substring(0, 50)}`);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) process.stdout.write(`[NAV] ${frame.url().substring(0, 80)}\n`);
  });

  const ok = await robustLogin(page);
  if (!ok) { await browser.close(); return; }

  await navigateToApplyIQ(page);

  const report = { system: 'ApplyIQ Permit Application System', sections: [] };

  // Capture dashboard
  const dash = await captureSection(page, 'dashboard');
  report.sections.push(dash);
  console.log(`\n📊 Dashboard: ${dash.texts.slice(0,8).join(' | ')}`);

  // Dashboard tabs
  for (const tab of ['APPLICATIONS', 'FINANCE']) {
    const d = await cc(page, `text="${tab}"`, `dashboard_${tab.toLowerCase()}`);
    if (d) report.sections.push(d);
  }

  // Applications section - expand and explore each type
  console.log('\n=== APPLICATIONS ===');
  await page.click('text="Applications"').catch(() => {});
  await sleep(1000);

  for (const appType of ['Suspension', 'Permit', 'Dispensation']) {
    const d = await cc(page, `text="${appType}"`, `app_${appType.toLowerCase()}`);
    if (d) {
      report.sections.push(d);
      // Look for sub-tabs on this page
      const subtabs = d.tabs.filter(t => !['Suspension', 'Permit', 'Dispensation', 'Applications'].includes(t));
      for (const st of subtabs.slice(0, 6)) {
        const sd = await cc(page, `[role="tab"]:has-text("${st}")`, `app_${appType.toLowerCase()}_${st.replace(/\s/g,'_').toLowerCase()}`);
        if (sd) report.sections.push(sd);
      }
    }
  }

  // Area section
  console.log('\n=== AREA ===');
  await page.click('text="Area"').catch(() => {});
  await sleep(1000);
  for (const area of ['Streets', 'Zones', 'Locations', 'SpecialEvents']) {
    const d = await cc(page, `text="${area}"`, `area_${area.toLowerCase()}`);
    if (d) report.sections.push(d);
  }

  // Contract Settings
  console.log('\n=== CONTRACT SETTINGS ===');
  const cs = await cc(page, 'text="Contract Settings"', 'contract_settings');
  if (cs) {
    report.sections.push(cs);
    for (const tab of cs.tabs.slice(0, 8)) {
      const t = await cc(page, `[role="tab"]:has-text("${tab}")`, `cs_${tab.replace(/\s/g,'_').toLowerCase()}`);
      if (t) report.sections.push(t);
    }
  }

  // Reports
  console.log('\n=== REPORTS ===');
  const rep = await cc(page, 'text="Reports"', 'reports');
  if (rep) report.sections.push(rep);

  // System Audits
  console.log('\n=== SYSTEM AUDITS ===');
  const aud = await cc(page, 'text="System Audits"', 'system_audits');
  if (aud) report.sections.push(aud);

  // Apply Config
  console.log('\n=== APPLY CONFIG ===');
  await page.click('text="Apply Config"').catch(() => {});
  await sleep(1000);
  const ac = await captureSection(page, 'apply_config');
  report.sections.push(ac);
  console.log(`  Apply Config tabs: ${ac.tabs.join(', ')}`);
  for (const tab of ac.tabs.slice(0, 6)) {
    const t = await cc(page, `[role="tab"]:has-text("${tab}")`, `applyconfig_${tab.replace(/\s/g,'_').toLowerCase()}`);
    if (t) report.sections.push(t);
  }

  fs.writeFileSync('applyiq_full_report.json', JSON.stringify(report, null, 2));

  // Final summary
  console.log('\n' + '═'.repeat(65));
  console.log('📊 APPLYIQ PERMIT APPLICATION - COMPLETE ANALYSIS');
  console.log('═'.repeat(65));
  report.sections.filter(Boolean).forEach(s => {
    console.log(`\n📄 ${s.label}`);
    if (s.headers?.length) console.log(`   Columns: ${s.headers.slice(0,6).join(' | ')}`);
    if (s.fields?.length) console.log(`   Fields: ${s.fields.slice(0,5).join(', ')}`);
    if (s.tabs?.length) console.log(`   Tabs: ${s.tabs.slice(0,6).join(', ')}`);
    if (s.buttons?.length) console.log(`   Buttons: ${s.buttons.slice(0,5).join(', ')}`);
  });

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
