#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║   NPS BACKOFFICE — FULL UI EXPLORATION AGENT                    ║
 * ║   Navigates all 18 modules, captures screenshots & selectors    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Usage:
 *   node explore_all_modules.js              # full exploration (headed)
 *   node explore_all_modules.js --headless   # headless mode
 *
 * Output:
 *   screenshots/explore_<timestamp>/  — all screenshots
 *   ui_exploration_<timestamp>.json   — structured UI report
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  baseUrl: 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/',
  credentials: { email: 'freedomappsvc@itsvc.co.uk', password: 'H@rd4r!v3+' },
  contract: 'AutomationApplyIQ',
  headless: process.argv.includes('--headless'),
};

const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
const OUT_DIR = `screenshots/explore_${RUN_ID}`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function log(...args) { console.log(new Date().toTimeString().substring(0, 8), ...args); }

// ── Login ──────────────────────────────────────────────────────────────────────
async function login(page) {
  log('🔐 Starting login...');
  await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CONFIG.credentials.email);
  await page.click('.signInBtn', { force: true });

  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', CONFIG.credentials.email);
  await page.click('[type="submit"]');
  await sleep(3000);

  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', CONFIG.credentials.password);
  await page.click('[type="submit"]');
  await sleep(5000);

  for (let i = 0; i < 40; i++) {
    const url = page.url();
    if (url.startsWith(CONFIG.baseUrl)) { log('✅ Login successful!'); return true; }

    if (url.includes('mysignins')) {
      for (let t = 0; t < 15; t++) {
        await sleep(1000);
        try {
          const btns = await page.$$eval('button', els =>
            els.filter(e => e.offsetWidth > 0).map(e => e.textContent?.trim().replace(/\s+/g, ' ')).filter(Boolean)
          );
          if (btns.includes('Skip setup')) {
            await page.click('button:has-text("Skip setup")');
            log('  ↳ Skipped MFA setup');
            await sleep(5000);
            break;
          }
        } catch (_) {}
      }
      continue;
    }

    if (url.includes('login.microsoftonline.com')) {
      try {
        const btn = page.locator('input[type="submit"]').first();
        if (await btn.isVisible({ timeout: 1500 })) { await btn.click(); await sleep(4000); continue; }
      } catch (_) {}
    }
    await sleep(2000);
  }
  log('❌ Login failed');
  return false;
}

// ── Navigate to ApplyIQ contract ───────────────────────────────────────────────
async function goToApplyIQ(page) {
  await sleep(5000);
  log('🏢 Selecting contract:', CONFIG.contract);
  await page.click(`text="${CONFIG.contract}"`, { timeout: 15000 });
  await sleep(4000);
  if (!page.url().includes('dashboard')) {
    try { await page.click('text="Application"', { timeout: 5000 }); await sleep(3000); } catch (_) {}
  }
  log('📍 At:', page.url());
}

// ── Capture utilities ──────────────────────────────────────────────────────────
async function snap(page, name) {
  const fname = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 60)}.png`;
  await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });
  return fname;
}

async function extractPageData(page) {
  return page.evaluate(() => {
    const unique = arr => [...new Set(arr.filter(Boolean))];

    // Page title
    const pageTitle = (
      document.querySelector('h1, h2, [class*="pageTitle"], [class*="title"]')?.textContent?.trim() || ''
    );

    // All visible leaf text (limited)
    const texts = new Set();
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const t = el.textContent?.trim().replace(/\s+/g, ' ');
      if (t && t.length > 1 && t.length < 120 &&
          window.getComputedStyle(el).display !== 'none' && el.offsetHeight > 0) {
        texts.add(t);
      }
    });

    // Table/grid columns
    const columns = unique([...document.querySelectorAll('th, [role="columnheader"], .MuiDataGrid-columnHeaderTitle')]
      .map(e => e.textContent?.trim()));

    // Form fields with labels
    const formFields = unique([...document.querySelectorAll('input:not([type=hidden]), select, textarea')]
      .map(e => {
        const lbl = e.labels?.[0]?.textContent?.trim() || e.placeholder || e.getAttribute('aria-label') || e.name || '';
        const type = e.type || e.tagName.toLowerCase();
        return lbl ? `${type}: ${lbl}` : null;
      }));

    // Tabs
    const tabs = unique([...document.querySelectorAll('[role="tab"], .MuiTab-root')]
      .map(e => e.textContent?.trim()));

    // Buttons (visible)
    const buttons = unique([...document.querySelectorAll('button, [role="button"], .MuiButton-root')]
      .filter(e => e.offsetWidth > 0 && window.getComputedStyle(e).display !== 'none')
      .map(e => e.textContent?.trim().replace(/\s+/g, ' '))
      .filter(t => t && t.length < 60));

    // Toggles/switches
    const toggles = unique([...document.querySelectorAll('.MuiSwitch-root, [role="switch"]')]
      .map(e => {
        const lbl = e.closest('label')?.textContent?.trim() ||
                    e.parentElement?.textContent?.trim() || '';
        const checked = e.querySelector('input')?.checked || false;
        return lbl ? `${lbl} (${checked ? 'ON' : 'OFF'})` : null;
      }));

    // Dropdowns/selects
    const dropdowns = unique([...document.querySelectorAll('.MuiSelect-root, .MuiAutocomplete-root, select')]
      .map(e => {
        const lbl = e.getAttribute('aria-label') ||
                    e.closest('.MuiFormControl-root')?.querySelector('label')?.textContent?.trim() || '';
        return lbl || null;
      }));

    // Menu items (sidebar navigation)
    const menuItems = unique([...document.querySelectorAll('.MuiListItemText-root, [class*="menuItem"], [class*="navItem"], .MuiMenuItem-root')]
      .map(e => e.textContent?.trim()));

    // Row count
    const rows = document.querySelectorAll('tbody tr, [role="row"]:not([role="columnheader"])').length;

    // Status/chip badges
    const chips = unique([...document.querySelectorAll('.MuiChip-root, [class*="badge"], [class*="status"], [class*="chip"]')]
      .map(e => e.textContent?.trim()));

    // Dialogs currently open
    const dialogs = [...document.querySelectorAll('.MuiDialog-root, [role="dialog"]')]
      .map(d => ({
        title: d.querySelector('.MuiDialogTitle-root, h2')?.textContent?.trim() || '',
        fields: unique([...d.querySelectorAll('input:not([type=hidden]), select, textarea')]
          .map(e => e.placeholder || e.getAttribute('aria-label') || e.name || '')),
        buttons: unique([...d.querySelectorAll('button')]
          .map(e => e.textContent?.trim()))
      }));

    return {
      pageTitle,
      url: window.location.href,
      columns,
      formFields,
      tabs,
      buttons: buttons.slice(0, 30),
      toggles,
      dropdowns,
      menuItems: menuItems.slice(0, 30),
      totalRows: rows,
      chips,
      dialogs,
      sampleTexts: [...texts].slice(0, 40)
    };
  });
}

// ── Navigation helpers ─────────────────────────────────────────────────────────
async function clickMenu(page, ...labels) {
  for (const label of labels) {
    try {
      await page.click(`text="${label}"`, { timeout: 5000 });
      await sleep(2000);
    } catch (e) {
      // Try partial match
      try {
        await page.locator(`text=/${label}/i`).first().click({ timeout: 3000 });
        await sleep(2000);
      } catch (_) {
        log(`    ⚠️ Menu "${label}" not found`);
        return false;
      }
    }
  }
  return true;
}

async function exploreSubItems(page, parentName, subItems, report) {
  report[parentName] = {};
  for (const item of subItems) {
    try {
      log(`    → ${item}...`);
      await page.click(`text="${item}"`, { timeout: 5000 });
      await sleep(2500);
      const screenshot = await snap(page, `${parentName}_${item}`);
      const data = await extractPageData(page);
      report[parentName][item] = { ...data, screenshot };
      log(`      Columns: [${data.columns.join(', ')}]`);
      log(`      Buttons: [${data.buttons.slice(0, 5).join(', ')}]`);
      if (data.tabs.length) log(`      Tabs: [${data.tabs.join(', ')}]`);
      if (data.totalRows) log(`      Rows: ${data.totalRows}`);
    } catch (err) {
      log(`      ⚠️ ${item}: ${err.message.substring(0, 60)}`);
    }
  }
}

// ── Module explorers ───────────────────────────────────────────────────────────

async function exploreHomeScreen(page, report) {
  log('\n🏠 1/18 — HOME SCREEN (contract selection)...');
  // We're already past it, but capture current menu structure
  const screenshot = await snap(page, '01_home_contract_selected');
  const data = await extractPageData(page);
  report.homeScreen = { ...data, screenshot };
  log('  Menu items:', data.menuItems.slice(0, 15).join(', '));
}

async function exploreDashboard(page, report) {
  log('\n📊 2/18 — DASHBOARD...');
  if (await clickMenu(page, 'Dashboard')) {
    await sleep(2000);
    const screenshot = await snap(page, '02_dashboard_overview');
    const data = await extractPageData(page);
    report.dashboard = { overview: { ...data, screenshot } };
    log('  Tabs:', data.tabs.join(', '));
    log('  Buttons:', data.buttons.slice(0, 8).join(', '));

    // Explore each tab
    for (const tab of data.tabs) {
      if (!tab || tab.length > 30) continue;
      try {
        await page.click(`[role="tab"]:has-text("${tab}")`, { timeout: 3000 });
        await sleep(2000);
        const ss = await snap(page, `02_dashboard_tab_${tab}`);
        report.dashboard[tab] = { ...(await extractPageData(page)), screenshot: ss };
        log(`    Tab "${tab}": captured`);
      } catch (_) {}
    }
  }
}

async function exploreApplications(page, report) {
  log('\n📋 3/18 — APPLICATIONS...');
  report.applications = {};

  if (await clickMenu(page, 'Applications')) {
    await sleep(1000);

    // Try different application types in submenu
    for (const appType of ['permit', 'Permits', 'Suspension', 'Suspensions', 'Dispensation', 'Dispensations', 'Exemption', 'Exemptions']) {
      try {
        await page.click(`text="${appType}"`, { timeout: 2000 });
        await sleep(2500);
        const ss = await snap(page, `03_applications_${appType.toLowerCase()}`);
        const data = await extractPageData(page);
        report.applications[appType.toLowerCase()] = { ...data, screenshot: ss };
        log(`  ${appType}: ${data.totalRows} rows | Cols: [${data.columns.join(', ')}]`);

        // Click first row to see detail view
        if (data.totalRows > 0) {
          try {
            await page.locator('[role="row"]').nth(1).click({ timeout: 3000 });
            await sleep(3000);
            const detailSS = await snap(page, `03_applications_${appType.toLowerCase()}_detail`);
            const detailData = await extractPageData(page);
            report.applications[`${appType.toLowerCase()}_detail`] = { ...detailData, screenshot: detailSS };
            log(`    Detail tabs: [${detailData.tabs.join(', ')}]`);
            log(`    Detail buttons: [${detailData.buttons.slice(0, 8).join(', ')}]`);

            // Explore each tab in detail view
            for (const tab of detailData.tabs) {
              if (!tab || tab.length > 30) continue;
              try {
                await page.click(`[role="tab"]:has-text("${tab}")`, { timeout: 2000 });
                await sleep(2000);
                const tabSS = await snap(page, `03_app_detail_tab_${tab}`);
                report.applications[`detail_tab_${tab.toLowerCase()}`] = { ...(await extractPageData(page)), screenshot: tabSS };
                log(`      Tab "${tab}": captured`);
              } catch (_) {}
            }

            // Go back to grid
            await page.goBack();
            await sleep(2000);
          } catch (_) { log('    Could not open detail view'); }
        }
        break; // Got the first working app type
      } catch (_) { continue; }
    }
  }
}

async function exploreUsers(page, report) {
  log('\n👥 4/18 — USERS...');
  report.users = {};

  if (await clickMenu(page, 'Users')) {
    await sleep(1000);

    for (const section of ['Roles & Permissions', 'Roles', 'System Users', 'Applicants']) {
      try {
        await page.click(`text="${section}"`, { timeout: 3000 });
        await sleep(2500);
        const key = section.toLowerCase().replace(/[^a-z]/g, '_');
        const ss = await snap(page, `04_users_${key}`);
        const data = await extractPageData(page);
        report.users[key] = { ...data, screenshot: ss };
        log(`  ${section}: ${data.totalRows} rows | Cols: [${data.columns.join(', ')}]`);
        if (data.buttons.length) log(`    Buttons: [${data.buttons.slice(0, 6).join(', ')}]`);

        // Try opening first row for detail
        if (data.totalRows > 0 && (section.includes('Applicant') || section.includes('System'))) {
          try {
            await page.locator('[role="row"]').nth(1).click({ timeout: 3000 });
            await sleep(3000);
            const detailSS = await snap(page, `04_users_${key}_detail`);
            const detailData = await extractPageData(page);
            report.users[`${key}_detail`] = { ...detailData, screenshot: detailSS };
            log(`    Detail tabs: [${detailData.tabs.join(', ')}]`);
            await page.goBack();
            await sleep(2000);
          } catch (_) {}
        }
      } catch (_) { continue; }
    }
  }
}

async function explorePermissionSetup(page, report) {
  log('\n🔧 5/18 — PERMISSION SETUP...');
  report.permissionSetup = {};

  if (await clickMenu(page, 'Permission Setup')) {
    await sleep(1000);

    // Groups
    for (const section of ['Groups', 'Group', 'Permission Builder', 'Builder']) {
      try {
        await page.click(`text="${section}"`, { timeout: 3000 });
        await sleep(2500);
        const key = section.toLowerCase().replace(/\s/g, '_');
        const ss = await snap(page, `05_permission_setup_${key}`);
        const data = await extractPageData(page);
        report.permissionSetup[key] = { ...data, screenshot: ss };
        log(`  ${section}: ${data.totalRows} rows | Cols: [${data.columns.join(', ')}]`);

        // Open first builder item to see tabs
        if (section.includes('Builder') && data.totalRows > 0) {
          try {
            await page.locator('[role="row"]').nth(1).click({ timeout: 3000 });
            await sleep(3000);
            const detailSS = await snap(page, '05_permission_builder_detail');
            const detailData = await extractPageData(page);
            report.permissionSetup.builder_detail = { ...detailData, screenshot: detailSS };
            log(`    Builder Detail tabs: [${detailData.tabs.join(', ')}]`);

            // Explore each builder tab
            for (const tab of detailData.tabs) {
              if (!tab || tab.length > 30) continue;
              try {
                await page.click(`[role="tab"]:has-text("${tab}")`, { timeout: 2000 });
                await sleep(2000);
                const tabSS = await snap(page, `05_builder_tab_${tab}`);
                report.permissionSetup[`builder_tab_${tab.toLowerCase()}`] = { ...(await extractPageData(page)), screenshot: tabSS };
                log(`      Tab "${tab}": captured`);
              } catch (_) {}
            }
            await page.goBack();
            await sleep(2000);
          } catch (_) {}
        }
      } catch (_) { continue; }
    }
  }
}

async function exploreTemplates(page, report) {
  log('\n📝 6/18 — TEMPLATES...');
  report.templates = {};

  if (await clickMenu(page, 'Templates')) {
    await sleep(1000);
    for (const section of ['Document Types', 'Terms & Conditions', 'Alerts', 'Tooltips', 'Alert/Tooltip']) {
      try {
        await page.click(`text="${section}"`, { timeout: 3000 });
        await sleep(2500);
        const key = section.toLowerCase().replace(/[^a-z]/g, '_');
        const ss = await snap(page, `06_templates_${key}`);
        const data = await extractPageData(page);
        report.templates[key] = { ...data, screenshot: ss };
        log(`  ${section}: ${data.totalRows} rows | Cols: [${data.columns.join(', ')}]`);
      } catch (_) { continue; }
    }
  }
}

async function explorePrint(page, report) {
  log('\n🖨️  7/18 — PRINT...');
  report.print = {};

  if (await clickMenu(page, 'Print')) {
    await sleep(1000);
    for (const section of ['Physical Permissions', 'Physical Permission', 'White Mail Reminder', 'White Mail']) {
      try {
        await page.click(`text="${section}"`, { timeout: 3000 });
        await sleep(2500);
        const key = section.toLowerCase().replace(/[^a-z]/g, '_');
        const ss = await snap(page, `07_print_${key}`);
        const data = await extractPageData(page);
        report.print[key] = { ...data, screenshot: ss };
        log(`  ${section}: ${data.totalRows} rows | Cols: [${data.columns.join(', ')}]`);
      } catch (_) { continue; }
    }
  }
}

async function exploreArea(page, report) {
  log('\n🗺️  8/18 — AREA...');
  report.area = {};

  if (await clickMenu(page, 'Area')) {
    await sleep(1000);
    for (const section of ['Streets', 'Zones', 'Locations', 'Special Events', 'SpecialEvents']) {
      try {
        await page.click(`text="${section}"`, { timeout: 3000 });
        await sleep(2500);
        const key = section.toLowerCase().replace(/[^a-z]/g, '_');
        const ss = await snap(page, `08_area_${key}`);
        const data = await extractPageData(page);
        report.area[key] = { ...data, screenshot: ss };
        log(`  ${section}: ${data.totalRows} rows | Cols: [${data.columns.join(', ')}]`);

        // For streets, check tabs (white list, black list)
        if (section === 'Streets' && data.tabs.length) {
          for (const tab of data.tabs) {
            try {
              await page.click(`[role="tab"]:has-text("${tab}")`, { timeout: 2000 });
              await sleep(2000);
              const tabSS = await snap(page, `08_area_streets_${tab}`);
              report.area[`streets_${tab.toLowerCase()}`] = { ...(await extractPageData(page)), screenshot: tabSS };
              log(`    Tab "${tab}": captured`);
            } catch (_) {}
          }
        }
      } catch (_) { continue; }
    }
  }
}

async function exploreReports(page, report) {
  log('\n📈 9/18 — REPORTS...');
  if (await clickMenu(page, 'Reports')) {
    await sleep(2500);
    const ss = await snap(page, '09_reports');
    const data = await extractPageData(page);
    report.reports = { ...data, screenshot: ss };
    log('  Tabs:', data.tabs.join(', '));

    // Explore report tabs
    for (const tab of data.tabs) {
      if (!tab || tab.length > 40) continue;
      try {
        await page.click(`[role="tab"]:has-text("${tab}")`, { timeout: 2000 });
        await sleep(2000);
        const tabSS = await snap(page, `09_reports_tab_${tab}`);
        report[`reports_tab_${tab.toLowerCase().replace(/\s/g, '_')}`] = { ...(await extractPageData(page)), screenshot: tabSS };
        log(`    Report "${tab}": captured`);
      } catch (_) {}
    }
  }
}

async function exploreSystemAudit(page, report) {
  log('\n🔍 10/18 — SYSTEM AUDIT...');
  if (await clickMenu(page, 'System Audits')) {
    await sleep(2500);
    const ss = await snap(page, '10_system_audits');
    const data = await extractPageData(page);
    report.systemAudit = { ...data, screenshot: ss };
    log('  Columns:', data.columns.join(', '));
    log('  Rows:', data.totalRows);
  }
}

async function exploreContractSettings(page, report) {
  log('\n⚙️  11/18 — CONTRACT SETTINGS...');
  if (await clickMenu(page, 'Contract Settings')) {
    await sleep(2500);
    const ss = await snap(page, '11_contract_settings');
    const data = await extractPageData(page);
    report.contractSettings = { ...data, screenshot: ss };
    log('  Toggles:', data.toggles.slice(0, 10).join(' | '));
    log('  Form fields:', data.formFields.slice(0, 10).join(', '));

    // Scroll down to capture more
    try {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await sleep(1000);
      await snap(page, '11_contract_settings_mid');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await sleep(1000);
      await snap(page, '11_contract_settings_bottom');
      await page.evaluate(() => window.scrollTo(0, 0));
    } catch (_) {}
  }
}

async function exploreEmail(page, report) {
  log('\n📧 12/18 — EMAIL...');
  if (await clickMenu(page, 'Email')) {
    await sleep(2500);
    const ss = await snap(page, '12_email');
    const data = await extractPageData(page);
    report.email = { ...data, screenshot: ss };
    log('  Buttons:', data.buttons.slice(0, 8).join(', '));
  }
}

async function explorePricing(page, report) {
  log('\n💰 13/18 — PRICING...');
  if (await clickMenu(page, 'Pricing')) {
    await sleep(2500);
    const ss = await snap(page, '13_pricing');
    const data = await extractPageData(page);
    report.pricing = { ...data, screenshot: ss };
    log('  Columns:', data.columns.join(', '));
  }
}

async function exploreBuyNow(page, report) {
  log('\n🛒 14/18 — BUY NOW...');
  if (await clickMenu(page, 'Buy Now')) {
    await sleep(2500);
    const ss = await snap(page, '14_buy_now');
    const data = await extractPageData(page);
    report.buyNow = { overview: { ...data, screenshot: ss } };
    log('  Buttons:', data.buttons.slice(0, 8).join(', '));

    // Try clicking a permission type to see the form
    try {
      const cards = await page.locator('.MuiCard-root, [class*="card"], [class*="permission"]').count();
      if (cards > 0) {
        await page.locator('.MuiCard-root, [class*="card"], [class*="permission"]').first().click({ timeout: 3000 });
        await sleep(3000);
        const formSS = await snap(page, '14_buy_now_form');
        const formData = await extractPageData(page);
        report.buyNow.form = { ...formData, screenshot: formSS };
        log('    Form tabs:', formData.tabs.join(', '));
        log('    Form fields:', formData.formFields.slice(0, 8).join(', '));
        await page.goBack();
        await sleep(2000);
      }
    } catch (_) { log('    Could not open Buy Now form'); }
  }
}

async function exploreMNPSContractSettings(page, report) {
  log('\n🏗️  15/18 — MNPS CONTRACT SETTINGS...');
  // Navigate back to MNPS level first
  report.mnpsContractSettings = {};

  // Try clicking the MNPS/org level menu
  try {
    // Look for a back/org-level navigation
    const orgNav = page.locator('text="MNPS"').first();
    if (await orgNav.isVisible({ timeout: 3000 })) {
      await orgNav.click();
      await sleep(2000);
    }
  } catch (_) {}

  // Try to find Contract Settings at MNPS level
  if (await clickMenu(page, 'Contract Settings')) {
    await sleep(2500);
    const ss = await snap(page, '15_mnps_contract_settings');
    const data = await extractPageData(page);
    report.mnpsContractSettings = { ...data, screenshot: ss };
    log('  Toggles:', data.toggles.slice(0, 8).join(' | '));
  }
}

async function exploreMNPSTemplateSettings(page, report) {
  log('\n📄 16/18 — MNPS TEMPLATE SETTINGS...');
  report.mnpsTemplateSettings = {};

  if (await clickMenu(page, 'Template Settings')) {
    await sleep(2500);
    const ss = await snap(page, '16_mnps_template_settings');
    const data = await extractPageData(page);
    report.mnpsTemplateSettings = { ...data, screenshot: ss };
    log('  Columns:', data.columns.join(', '));
  }
}

async function exploreWorkQueue(page, report) {
  log('\n📬 17/18 — WORK QUEUE / STATUS...');
  report.workQueue = {};

  // Work queue might be within Applications or a separate menu
  for (const label of ['Work Queue', 'WorkQueue', 'Queue']) {
    try {
      await page.click(`text="${label}"`, { timeout: 3000 });
      await sleep(2500);
      const ss = await snap(page, '17_work_queue');
      const data = await extractPageData(page);
      report.workQueue = { ...data, screenshot: ss };
      log('  Columns:', data.columns.join(', '));
      log('  Rows:', data.totalRows);
      break;
    } catch (_) { continue; }
  }
}

// ── Capture left sidebar navigation ────────────────────────────────────────────
async function captureNavigation(page, report) {
  log('\n🧭 Capturing sidebar navigation structure...');
  const navData = await page.evaluate(() => {
    const items = [];
    // Try various nav selectors
    const selectors = [
      '.MuiListItemText-root',
      '[class*="menuItem"]',
      '[class*="navItem"]',
      '.MuiDrawer-root *',
      'nav *',
      '[class*="sidebar"] *'
    ];

    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 1 && text.length < 40 && el.offsetHeight > 0) {
          items.push(text);
        }
      });
      if (items.length > 3) break;
    }
    return [...new Set(items)];
  });

  report.navigation = { menuItems: navData };
  log('  Menu items found:', navData.join(' | '));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: CONFIG.headless, slowMo: 60 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const report = {
    runId: RUN_ID,
    timestamp: new Date().toISOString(),
    modules: {}
  };

  try {
    const ok = await login(page);
    if (!ok) throw new Error('Login failed');
    await goToApplyIQ(page);

    // Capture the full navigation sidebar first
    await captureNavigation(page, report);

    // Explore all 18 modules in logical order
    await exploreHomeScreen(page, report.modules);
    await exploreDashboard(page, report.modules);
    await exploreApplications(page, report.modules);
    await exploreWorkQueue(page, report.modules);
    await exploreUsers(page, report.modules);
    await explorePermissionSetup(page, report.modules);
    await exploreTemplates(page, report.modules);
    await explorePrint(page, report.modules);
    await exploreArea(page, report.modules);
    await exploreReports(page, report.modules);
    await exploreSystemAudit(page, report.modules);
    await exploreContractSettings(page, report.modules);
    await exploreEmail(page, report.modules);
    await explorePricing(page, report.modules);
    await exploreBuyNow(page, report.modules);

    // MNPS-level modules (may require navigation to org level)
    // These may not be directly accessible depending on UI layout
    await exploreMNPSContractSettings(page, report.modules);
    await exploreMNPSTemplateSettings(page, report.modules);

    // Save full JSON report
    const reportFile = `ui_exploration_${RUN_ID}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    // Print summary
    log('\n' + '═'.repeat(70));
    log('  UI EXPLORATION COMPLETE');
    log('═'.repeat(70));
    log(`📸 Screenshots: ${OUT_DIR}/`);
    log(`📊 Report: ${reportFile}`);

    const screenshotCount = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png')).length;
    log(`\n  Total screenshots captured: ${screenshotCount}`);

    log('\n  Modules explored:');
    for (const [key, val] of Object.entries(report.modules)) {
      if (val && typeof val === 'object') {
        const subKeys = Object.keys(val).filter(k => k !== 'screenshot');
        log(`    ✅ ${key}: ${subKeys.length > 3 ? subKeys.length + ' sections' : subKeys.join(', ')}`);
      }
    }
    log('═'.repeat(70));

  } catch (err) {
    log('❌ Fatal error:', err.message);
    await page.screenshot({ path: path.join(OUT_DIR, 'error.png'), fullPage: true }).catch(() => {});
  }

  await sleep(2000);
  await browser.close();
}

main().catch(console.error);
