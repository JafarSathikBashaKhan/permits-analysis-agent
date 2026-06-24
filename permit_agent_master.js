#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║   MARSTON NPS — APPLYIQ PERMIT APPLICATION AGENT                ║
 * ║   Organisation: Wokingham Borough Council                       ║
 * ║   System: Marston Notice Processing System + ApplyIQ Portal     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Usage:
 *   node permit_agent_master.js                    # full exploration
 *   node permit_agent_master.js --section=permit   # just permit apps
 *   node permit_agent_master.js --section=finance  # finance dashboard
 *   node permit_agent_master.js --section=streets  # area streets
 *   node permit_agent_master.js --headless         # run headless
 *
 * Output:
 *   screenshots/run_<timestamp>/  — all screenshots
 *   permit_run_<timestamp>.json   — structured data report
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ── Configuration ─────────────────────────────────────────────────────────────
const CONFIG = {
  baseUrl: 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/',
  credentials: {
    email: 'freedomappsvc@itsvc.co.uk',
    password: 'H@rd4r!v3+'
  },
  contract: 'AutomationApplyIQ',
  headless: process.argv.includes('--headless'),
  section: (process.argv.find(a => a.startsWith('--section=')) || '').replace('--section=', '') || 'all'
};

const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
const OUT_DIR = `screenshots/run_${RUN_ID}`;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function log(...args) { console.log(new Date().toTimeString().substring(0, 8), ...args); }

// ── Login ─────────────────────────────────────────────────────────────────────
async function login(page) {
  log('🔐 Starting login...');
  
  await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
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

  // Handle entire post-login flow
  for (let i = 0; i < 40; i++) {
    const url = page.url();
    if (url.startsWith(CONFIG.baseUrl)) { log('✅ Login successful!'); return true; }

    if (url.includes('login.microsoftonline.com')) {
      try {
        const btn = page.locator('input[type="submit"]').first();
        if (await btn.isVisible({ timeout: 1500 })) { await btn.click(); await sleep(4000); continue; }
      } catch (_) {}
    }

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
    await sleep(2000);
  }

  log('❌ Login failed');
  return false;
}

// ── Navigate to ApplyIQ ────────────────────────────────────────────────────────
async function goToApplyIQ(page) {
  await sleep(5000);
  await page.click(`text="${CONFIG.contract}"`, { timeout: 10000 });
  await sleep(4000);
  if (!page.url().includes('dashboard')) {
    try { await page.click('text="Application"', { timeout: 5000 }); await sleep(3000); } catch (_) {}
  }
  log('📍 ApplyIQ URL:', page.url().substring(CONFIG.baseUrl.length));
}

// ── Capture utilities ─────────────────────────────────────────────────────────
async function snapshot(page, name) {
  const fname = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 45)}.png`;
  await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });
  return fname;
}

async function extractPageData(page) {
  return page.evaluate(() => {
    const unique = arr => [...new Set(arr.filter(Boolean))];
    
    // All visible leaf text
    const texts = new Set();
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount > 0) return;
      const t = el.textContent?.trim().replace(/\s+/g, ' ');
      if (t && t.length > 1 && t.length < 120 && window.getComputedStyle(el).display !== 'none' && el.offsetHeight > 0) {
        texts.add(t);
      }
    });
    
    // Table columns
    const columns = unique([...document.querySelectorAll('th, [role="columnheader"]')]
      .map(e => e.textContent?.trim()));
    
    // Form fields
    const formFields = unique([...document.querySelectorAll('input:not([type=hidden]), select, textarea')]
      .map(e => {
        const lbl = e.labels?.[0]?.textContent?.trim() || e.placeholder || e.getAttribute('aria-label') || e.name;
        return lbl ? `${e.type || e.tagName.toLowerCase()}: ${lbl}` : null;
      }));
    
    // Tabs
    const tabs = unique([...document.querySelectorAll('[role="tab"]')].map(e => e.textContent?.trim()));
    
    // Action buttons
    const buttons = unique([...document.querySelectorAll('button, [role="button"]')]
      .filter(e => e.offsetWidth > 0 && window.getComputedStyle(e).display !== 'none')
      .map(e => e.textContent?.trim().replace(/\s+/g, ' ')));

    // Table row count
    const rows = document.querySelectorAll('tbody tr, [role="row"]:not([role="columnheader"])').length;
    
    // Status badges
    const statuses = unique([...document.querySelectorAll('[class*="badge"], [class*="status"], [class*="chip"]')]
      .map(e => e.textContent?.trim()));

    return {
      pageTitle: document.querySelector('h1, h2, [class*="pageTitle"], [class*="title"]')?.textContent?.trim(),
      url: window.location.href,
      texts: [...texts].slice(0, 60),
      columns,
      formFields,
      tabs,
      buttons,
      totalRows: rows,
      statuses
    };
  });
}

// ── Permit Application Sections ────────────────────────────────────────────────

async function analyzeDashboard(page, report) {
  log('\n📊 Analyzing Dashboard...');
  await snapshot(page, 'dashboard_overview');
  const appData = await extractPageData(page);
  report.dashboard = { applications: appData };

  // Finance tab
  try {
    await page.click('text="FINANCE"', { timeout: 3000 });
    await sleep(2000);
    await snapshot(page, 'dashboard_finance');
    report.dashboard.finance = await extractPageData(page);
    log('  Finance: Total Revenue, Net Revenue, Issued Refund captured');
  } catch (_) {}
  
  // Back to Applications
  await page.click('text="APPLICATIONS"', { timeout: 3000 }).catch(() => {});
  log('  Applications dashboard: Active Suspension, Permit, Dispensation counts');
}

async function analyzeApplications(page, report) {
  log('\n📋 Analyzing Applications...');
  report.applications = {};
  
  await page.click('text="Applications"').catch(() => {});
  await sleep(500);

  for (const type of ['permit', 'Suspension', 'Dispensation']) {
    log(`  → ${type} applications...`);
    try {
      await page.click(`text="${type}"`, { timeout: 5000 });
      await sleep(2000);
      await snapshot(page, `applications_${type.toLowerCase()}`);
      const data = await extractPageData(page);
      report.applications[type.toLowerCase()] = data;
      log(`    Columns: ${data.columns.join(', ')}`);
      log(`    Rows: ${data.totalRows}`);
    } catch (err) {
      log(`    ⚠️  ${type}: ${err.message.substring(0, 50)}`);
    }
  }
}

async function analyzeArea(page, report) {
  log('\n🗺️  Analyzing Area...');
  report.area = {};
  
  await page.click('text="Area"').catch(() => {});
  await sleep(500);

  for (const section of ['Streets', 'Zones', 'Locations', 'SpecialEvents']) {
    try {
      await page.click(`text="${section}"`, { timeout: 5000 });
      await sleep(2000);
      await snapshot(page, `area_${section.toLowerCase()}`);
      const data = await extractPageData(page);
      report.area[section.toLowerCase()] = data;
      log(`  ${section}: ${data.columns.join(', ')} (${data.totalRows} rows)`);
    } catch (err) {
      log(`  ⚠️  ${section}: ${err.message.substring(0, 40)}`);
    }
  }
}

async function analyzeContractSettings(page, report) {
  log('\n⚙️  Analyzing Contract Settings...');
  try {
    await page.click('text="Contract Settings"', { timeout: 5000 });
    await sleep(2000);
    await snapshot(page, 'contract_settings');
    report.contractSettings = await extractPageData(page);
    log('  Sections:', report.contractSettings.texts.filter(t => t === t.toUpperCase() && t.length > 3).join(', '));
  } catch (err) {
    log('  ⚠️', err.message.substring(0, 50));
  }
}

async function analyzeAudits(page, report) {
  log('\n📝 Analyzing System Audits...');
  try {
    await page.click('text="System Audits"', { timeout: 5000 });
    await sleep(2000);
    await snapshot(page, 'system_audits');
    report.systemAudits = await extractPageData(page);
    log('  Columns:', report.systemAudits.columns.join(', '));
  } catch (err) {
    log('  ⚠️', err.message.substring(0, 50));
  }
}

async function analyzeReports(page, report) {
  log('\n📈 Analyzing Reports...');
  try {
    await page.click('text="Reports"', { timeout: 5000 });
    await sleep(2000);
    await snapshot(page, 'reports_section');
    report.reports = await extractPageData(page);
    log('  Tabs:', report.reports.tabs.join(', '));
    log('  Buttons:', report.reports.buttons.slice(0, 5).join(', '));
  } catch (err) {
    log('  ⚠️', err.message.substring(0, 50));
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: CONFIG.headless, slowMo: 80 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const report = {
    runId: RUN_ID,
    timestamp: new Date().toISOString(),
    config: { baseUrl: CONFIG.baseUrl, contract: CONFIG.contract, section: CONFIG.section }
  };

  try {
    const ok = await login(page);
    if (!ok) throw new Error('Login failed');

    await goToApplyIQ(page);

    // Run analysis sections based on config
    const all = CONFIG.section === 'all';
    if (all || CONFIG.section === 'dashboard') await analyzeDashboard(page, report);
    if (all || CONFIG.section === 'permit') await analyzeApplications(page, report);
    if (all || CONFIG.section === 'streets') await analyzeArea(page, report);
    if (all || CONFIG.section === 'settings') await analyzeContractSettings(page, report);
    if (all || CONFIG.section === 'audits') await analyzeAudits(page, report);
    if (all || CONFIG.section === 'reports') await analyzeReports(page, report);

    // Save report
    const reportFile = `permit_run_${RUN_ID}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    log(`\n✅ Report saved: ${reportFile}`);
    log(`📸 Screenshots: ${OUT_DIR}/`);

    // Print summary
    log('\n' + '═'.repeat(60));
    log('PERMIT APPLICATION AGENT — RUN SUMMARY');
    log('═'.repeat(60));
    if (report.applications) {
      log('\nApplications:');
      Object.entries(report.applications).forEach(([type, data]) => {
        log(`  ${type}: ${data.totalRows} records | Cols: ${data.columns.slice(0,4).join(', ')}`);
      });
    }
    if (report.area) {
      log('\nArea:');
      Object.entries(report.area).forEach(([name, data]) => {
        log(`  ${name}: ${data.totalRows} records | Cols: ${data.columns.slice(0,3).join(', ')}`);
      });
    }
    log('═'.repeat(60));

  } catch (err) {
    log('Fatal error:', err.message);
    await page.screenshot({ path: path.join(OUT_DIR, 'error.png'), fullPage: true }).catch(() => {});
  }

  await sleep(2000);
  await browser.close();
}

main().catch(console.error);
