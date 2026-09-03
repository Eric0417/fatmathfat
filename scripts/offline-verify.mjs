import { chromium } from 'playwright-core';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox']
});

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/#/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker?.ready);
  await page.waitForTimeout(500);

  const controlled = await page.evaluate(() =>
    Boolean(navigator.serviceWorker?.controller)
  );
  assert(controlled, 'service worker did not take control');

  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');

  const title = await page.locator('h1').first().textContent();
  const footerCount = await page.getByText('developed by Eric Wong', {
    exact: true
  }).count();

  assert(Boolean(title), 'offline reload did not render the app');
  assert(footerCount === 1, 'offline reload is missing the footer');

  await page.goto(`${baseUrl}/#/explorer`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');
  const explorerTitle = await page.locator('h1').first().textContent();
  assert(
    explorerTitle === '集合操作工具',
    'offline reload did not render the explorer'
  );
  assert(errors.length === 0, `offline console issues: ${errors.join('\n')}`);
  await context.setOffline(false);
  console.log('offline verification passed');
} finally {
  await browser.close();
}
