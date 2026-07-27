// Reusable navbar overlap/clickability regression check.
// Requires the dev server running at http://localhost:3000 (npm run dev).
// Run: node tests/navbar-overlap.check.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = process.env.NAVBAR_TEST_URL || 'http://localhost:3000/';
const DESKTOP_WIDTHS = [1920, 1600, 1440, 1366, 1280, 1024];
const HAMBURGER_WIDTHS = [991, 768];
const OUT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function intersects(a, b) {
  if (!a || !b) return false;
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

let failures = [];

async function checkDesktopWidth(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.nav-container');

  const data = await page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const logoWrapper = rect('.logo-arch-wrapper');
    const desktopMenuDisplay = document.querySelector('.nav-menu-desktop')
      ? getComputedStyle(document.querySelector('.nav-menu-desktop')).display
      : null;

    const targets = [];
    document.querySelectorAll('.nav-menu-desktop a.nav-link, .nav-menu-desktop .nav-btn').forEach((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      targets.push({
        text: el.textContent.trim(),
        rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height },
        clickableMatch: hit === el || el.contains(hit),
        hitClass: hit ? hit.className : null,
      });
    });

    return { logoWrapper, desktopMenuDisplay, targets };
  });

  await page.screenshot({ path: path.join(OUT_DIR, `nav-${width}.png`), clip: { x: 0, y: 0, width, height: 260 } });

  if (data.desktopMenuDisplay !== 'block' && data.desktopMenuDisplay !== 'flex') {
    failures.push(`[${width}px] expected desktop menu visible, got display:${data.desktopMenuDisplay}`);
  }
  for (const t of data.targets) {
    if (intersects(t.rect, data.logoWrapper)) {
      failures.push(`[${width}px] "${t.text}" rectangle intersects logo rectangle`);
    }
    if (!t.clickableMatch) {
      failures.push(`[${width}px] "${t.text}" center point resolves to "${t.hitClass}" instead of the link/button itself`);
    }
  }

  await page.close();
}

async function checkHamburgerWidth(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.nav-container');

  const desktopMenuDisplay = await page.evaluate(
    () => getComputedStyle(document.querySelector('.nav-menu-desktop')).display
  );
  if (desktopMenuDisplay !== 'none') {
    failures.push(`[${width}px] expected desktop menu hidden below hamburger cutover, got display:${desktopMenuDisplay}`);
  }

  await page.screenshot({ path: path.join(OUT_DIR, `nav-${width}.png`), clip: { x: 0, y: 0, width, height: 260 } });

  await page.click('#hamburger-btn');
  await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 3000 }).catch(() => null);
  const drawerOpened = await page.locator('.modal-overlay').isVisible().catch(() => false);
  if (!drawerOpened) {
    failures.push(`[${width}px] hamburger click did not open the mobile drawer`);
  } else {
    try {
      await page.click('.modal-overlay a[href="/zaicha"]');
      await page.waitForURL('**/zaicha', { timeout: 5000 });
    } catch {
      failures.push(`[${width}px] drawer link click did not navigate`);
    }
  }

  await page.close();
}

(async () => {
  const browser = await chromium.launch();

  for (const width of DESKTOP_WIDTHS) await checkDesktopWidth(browser, width);
  for (const width of HAMBURGER_WIDTHS) await checkHamburgerWidth(browser, width);

  await browser.close();

  if (failures.length) {
    console.error(`FAIL — ${failures.length} navbar issue(s):`);
    failures.forEach((f) => console.error(' -', f));
    process.exit(1);
  }
  console.log(`PASS — navbar has zero overlap and full clickability at ${[...DESKTOP_WIDTHS, ...HAMBURGER_WIDTHS].join(', ')}px. Screenshots in tests/screenshots/.`);
})();
