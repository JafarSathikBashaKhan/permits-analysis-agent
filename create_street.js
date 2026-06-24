const { chromium } = require('playwright');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'https://nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net/',
  credentials: { email: 'freedomappsvc@itsvc.co.uk', password: 'H@rd4r!v3+' },
  newStreet: {
    name: 'CopilotTestStreet_001',
    // We'll discover the form fields dynamically
  }
};

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function log(...a) { console.log(new Date().toTimeString().substr(0,8), ...a); }

async function login(page) {
  log('🔐 Logging in...');
  await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#txt_username', { timeout: 15000 });
  await page.fill('#txt_username', CONFIG.credentials.email);
  await page.click('.signInBtn', { force: true });

  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 15000 });
  await sleep(1500);
  await page.fill('input[type="email"]', CONFIG.credentials.email);
  await page.click('[type="submit"]');
  await sleep(3000);
  await page.fill('input[type="password"]', CONFIG.credentials.password);
  await page.click('[type="submit"]');
  await sleep(5000);

  for (let i = 0; i < 40; i++) {
    const url = page.url();
    if (url.startsWith(CONFIG.baseUrl)) { log('✅ Logged in'); return; }
    if (url.includes('mysignins')) {
      for (let t = 0; t < 15; t++) {
        await sleep(1000);
        try {
          const btns = await page.$$eval('button', els =>
            els.filter(e => e.offsetWidth > 0).map(e => e.textContent?.trim())
          );
          if (btns.includes('Skip setup')) {
            await page.click('button:has-text("Skip setup")');
            log('  ↳ Skipped MFA'); await sleep(5000); break;
          }
        } catch(_) {}
      }
      continue;
    }
    if (url.includes('login.microsoftonline.com')) {
      try {
        const btn = page.locator('input[type="submit"]').first();
        if (await btn.isVisible({ timeout: 1500 })) { await btn.click(); await sleep(4000); }
      } catch(_) {}
    }
    await sleep(2000);
  }
}

async function main() {
  if (!fs.existsSync('screenshots/streets')) fs.mkdirSync('screenshots/streets', { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 60 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  try {
    await login(page);

    // Navigate to ApplyIQ
    await sleep(8000);
    log('🏢 Navigating to AutomationApplyIQ...');
    await page.waitForSelector('text="AutomationApplyIQ"', { timeout: 20000 });
    await page.click('text="AutomationApplyIQ"', { timeout: 20000 });
    await sleep(4000);
    if (!page.url().includes('dashboard')) {
      try { await page.click('text="Application"', { timeout: 5000 }); await sleep(3000); } catch(_) {}
    }
    log('  ↳ At:', page.url().split('/').pop());

    // Navigate to Area → Streets
    log('🗺️  Opening Area → Streets...');
    await page.click('text="Area"');
    await sleep(500);
    await page.click('text="Streets"');
    await sleep(2000);
    await page.screenshot({ path: 'screenshots/streets/01_streets_list.png', fullPage: true });
    log('  ↳ Streets list captured');

    // Click + NEW STREET
    log('➕ Clicking + NEW STREET...');
    await page.click('button:has-text("NEW STREET")', { timeout: 5000 });
    await sleep(2500);
    await page.screenshot({ path: 'screenshots/streets/02_new_street_form.png', fullPage: true });

    // Inspect form fields
    const formInfo = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter(e => e.offsetWidth > 0);
      return inputs.map(e => ({
        tag: e.tagName,
        type: e.type,
        name: e.name,
        placeholder: e.placeholder,
        label: e.labels?.[0]?.textContent?.trim() || e.getAttribute('aria-label'),
        id: e.id,
        value: e.value
      }));
    });
    log('📝 Form fields found:', JSON.stringify(formInfo, null, 2));

    // ── Fill the form using React nativeInputValueSetter ─────────────────────
    // React controlled inputs need the native setter + dispatched events to update state
    async function reactFill(selector, value) {
      await page.evaluate(({selector, value}) => {
        const el = document.querySelector(selector) || [...document.querySelectorAll('input')].find(i => i.placeholder === selector);
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      }, { selector, value });
    }

    // 1. Street Name
    await page.click('input[placeholder="Enter Street Name"]');
    await sleep(200);
    await reactFill('Enter Street Name', CONFIG.newStreet.name);
    log('  ↳ Filled Street Name:', CONFIG.newStreet.name);
    await sleep(400);

    // 2. USRN
    await reactFill('USRN', '12345678');
    log('  ↳ Filled USRN: 12345678');
    await sleep(300);

    // 3. Town Name
    await reactFill('Town Name', 'Wokingham');
    log('  ↳ Filled Town Name: Wokingham');
    await sleep(300);

    // 4. Add property — type into the "Type and press enter" field then press Enter
    await page.click('input[placeholder="Type and press enter to add"]');
    await sleep(200);
    await reactFill('Type and press enter to add', '1-10');
    await sleep(200);
    await page.press('input[placeholder="Type and press enter to add"]', 'Enter');
    await sleep(1500);
    log('  ↳ Added property: 1-10');

    // 5. Fill Postcode in the property row
    await page.waitForSelector('input[placeholder="Postcode"]', { timeout: 5000 });
    await page.click('input[placeholder="Postcode"]');
    await sleep(200);
    await reactFill('Postcode', 'RG40 1BJ');
    log('  ↳ Filled Postcode: RG40 1BJ');
    await sleep(500);

    // Tab away to trigger all blur/validate events
    await page.keyboard.press('Tab');
    await sleep(800);

    await page.screenshot({ path: 'screenshots/streets/03_form_filled.png', fullPage: true });

    // Check button is now enabled
    const btnEnabled = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('ADD STREET'));
      return btn ? !btn.disabled : false;
    });
    log(btnEnabled ? '  ✅ ADD STREET button is enabled' : '  ⚠️  ADD STREET button still disabled');

    // 5. Click ADD STREET
    if (btnEnabled) {
      await page.click('button:has-text("ADD STREET")');
      log('💾 Clicked ADD STREET...');
      await sleep(3000);
      await page.screenshot({ path: 'screenshots/streets/04_after_save.png', fullPage: true });

      const pageText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
      const success = pageText.toLowerCase().includes('success') || pageText.toLowerCase().includes('created') || pageText.toLowerCase().includes('saved') || !pageText.includes('New Street');
      log(success ? '✅ Street created successfully!' : 'ℹ️  Check screenshot 04_after_save.png');
    } else {
      // Try clicking anyway with force
      log('  Trying force click...');
      await page.click('button:has-text("ADD STREET")', { force: true });
      await sleep(3000);
      await page.screenshot({ path: 'screenshots/streets/04_after_save.png', fullPage: true });
    }

    // Verify on Streets list
    await sleep(2000);
    await page.screenshot({ path: 'screenshots/streets/05_final_state.png', fullPage: true });

    const finalText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    if (finalText.includes(CONFIG.newStreet.name)) {
      log(`🎉 "${CONFIG.newStreet.name}" confirmed in the page!`);
    }

  } catch (err) {
    log('❌ Error:', err.message);
    await page.screenshot({ path: 'screenshots/streets/error.png', fullPage: true });
  }

  await sleep(3000);
  await browser.close();
}

main().catch(console.error);
