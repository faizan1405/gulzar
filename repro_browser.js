const { chromium } = require('playwright');

async function run(cookieValue, label, screenshotPath) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  if (cookieValue) {
    await context.addCookies([
      {
        name: 'authjs.session-token',
        value: cookieValue,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
  }
  const page = await context.newPage();
  const consoleMsgs = [];
  const apiCalls = [];
  page.on('console', (msg) => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => consoleMsgs.push(`[pageerror] ${err.message}`));
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) consoleMsgs.push(`[navigated ->] ${frame.url()}`);
  });
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/')) {
      apiCalls.push(`${res.status()} ${url}`);
    }
  });

  console.log(`\n=== ${label} ===`);
  await page.goto('http://localhost:3000/my-account', { waitUntil: 'load', timeout: 30000 }).catch(e => console.log('goto error:', e.message));

  await page.waitForTimeout(4000);

  console.log('FINAL URL:', page.url());
  const bodyText = await page.locator('main').innerText().catch(() => '(no main element)');
  console.log('MAIN TEXT SNIPPET:', bodyText.slice(0, 200).replace(/\n+/g, ' | '));

  console.log('API CALLS:');
  apiCalls.forEach(m => console.log('  ' + m));
  console.log('CONSOLE:');
  consoleMsgs.forEach(m => console.log('  ' + m));

  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to', screenshotPath);

  await browser.close();
}

async function main() {
  const scratch = 'C:/Users/Faiza/AppData/Local/Temp/claude/e--012-Git-Repos-of-Cleints-Rishte-Forever/c0a3b5fe-2cb8-4cf9-a067-a3fcefdc61af/scratchpad';
  const withProfileToken = process.argv[2];
  const noProfileToken = process.argv[3];
  if (withProfileToken) {
    await run(withProfileToken, 'WITH PROFILE (should work)', `${scratch}/shot_with_profile.png`);
  }
  if (noProfileToken) {
    await run(noProfileToken, 'NO PROFILE (repro bug)', `${scratch}/shot_no_profile.png`);
  }
  await run(null, 'LOGGED OUT', `${scratch}/shot_logged_out.png`);
}

main().catch(e => { console.error(e); process.exit(1); });
