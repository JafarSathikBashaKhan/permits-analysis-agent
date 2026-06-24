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

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const report = {
    loginPage: {},
    navigation: [],
    permitPages: [],
    formFields: {},
    screenshots: []
  };

  console.log('=== STEP 1: Navigating to login page ===');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  
  // Capture page title and URL
  report.loginPage.title = await page.title();
  report.loginPage.url = page.url();
  console.log('Title:', report.loginPage.title);
  console.log('URL:', report.loginPage.url);

  // Capture login form structure
  const inputs = await page.$$eval('input', els => els.map(e => ({
    type: e.type, name: e.name, id: e.id, placeholder: e.placeholder, label: e.getAttribute('aria-label')
  })));
  report.loginPage.inputs = inputs;
  console.log('Login inputs:', JSON.stringify(inputs, null, 2));

  await page.screenshot({ path: 'screenshots/01_login.png', fullPage: true });

  // --- LOGIN ---
  console.log('\n=== STEP 2: Attempting login ===');
  try {
    // Try common selectors for email/username
    const emailSel = 'input[type="email"], input[name*="email"], input[name*="user"], input[id*="email"], input[id*="user"], input[placeholder*="email" i], input[placeholder*="username" i]';
    const passSel = 'input[type="password"]';
    
    await page.waitForSelector(passSel, { timeout: 10000 });
    
    const emailInput = await page.$(emailSel);
    if (emailInput) {
      await emailInput.fill(CREDENTIALS.email);
      console.log('Filled email field');
    } else {
      // Maybe there's only one text input
      const textInput = await page.$('input[type="text"]');
      if (textInput) {
        await textInput.fill(CREDENTIALS.email);
        console.log('Filled text field with email');
      }
    }

    await page.fill(passSel, CREDENTIALS.password);
    console.log('Filled password field');

    // Click submit
    const submitSel = 'button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Log in")';
    const submitBtn = await page.$(submitSel);
    if (submitBtn) {
      await submitBtn.click();
      console.log('Clicked submit button');
    } else {
      await page.keyboard.press('Enter');
      console.log('Pressed Enter to submit');
    }

    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await sleep(2000);
    
    const afterLoginUrl = page.url();
    const afterLoginTitle = await page.title();
    console.log('After login URL:', afterLoginUrl);
    console.log('After login Title:', afterLoginTitle);
    report.afterLogin = { url: afterLoginUrl, title: afterLoginTitle };

    await page.screenshot({ path: 'screenshots/02_after_login.png', fullPage: true });

  } catch (err) {
    console.error('Login error:', err.message);
    // Capture current page HTML for analysis
    const html = await page.content();
    fs.writeFileSync('screenshots/login_page.html', html);
    report.loginError = err.message;
  }

  // --- EXPLORE NAVIGATION ---
  console.log('\n=== STEP 3: Exploring navigation ===');
  try {
    // Capture all navigation links
    const navLinks = await page.$$eval('nav a, aside a, [role="navigation"] a, .sidebar a, .menu a', 
      els => els.map(e => ({ text: e.textContent.trim(), href: e.href, class: e.className }))
           .filter(e => e.text && e.text.length > 0)
    );
    report.navigation = navLinks;
    console.log('Navigation links found:', navLinks.length);
    navLinks.forEach(l => console.log(' -', l.text, ':', l.href));

    // Also capture all visible text that might hint at permit-related sections
    const bodyText = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const texts = [];
      let node;
      while ((node = walker.nextNode())) {
        const t = node.textContent.trim();
        if (t.length > 2 && t.length < 100) texts.push(t);
      }
      return [...new Set(texts)].slice(0, 200);
    });
    report.bodyTexts = bodyText;
    console.log('\nPage text samples:', bodyText.slice(0, 30).join(', '));

  } catch (err) {
    console.error('Navigation explore error:', err.message);
  }

  // --- LOOK FOR PERMIT SECTIONS ---
  console.log('\n=== STEP 4: Looking for Permit sections ===');
  const permitKeywords = ['permit', 'application', 'license', 'licence', 'approval', 'submission'];
  const currentUrl = page.url();
  
  // Find links containing permit-related text
  try {
    const permitLinks = await page.$$eval('a, button, [role="menuitem"]', (els, kw) => 
      els.filter(e => kw.some(k => e.textContent.toLowerCase().includes(k)))
         .map(e => ({ text: e.textContent.trim(), href: e.href || '', tag: e.tagName })),
      permitKeywords
    );
    report.permitLinks = permitLinks;
    console.log('Permit-related links:', permitLinks.length);
    permitLinks.forEach(l => console.log(' -', l.text, ':', l.href));
  } catch (err) {
    console.error('Permit link search error:', err.message);
  }

  // Save full page HTML for analysis
  const fullHtml = await page.content();
  fs.writeFileSync('screenshots/main_page.html', fullHtml.substring(0, 100000));

  // Save final report
  fs.writeFileSync('exploration_report.json', JSON.stringify(report, null, 2));
  console.log('\n=== Report saved to exploration_report.json ===');

  await browser.close();
}

// Ensure screenshots dir exists
if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

explore().catch(console.error);
