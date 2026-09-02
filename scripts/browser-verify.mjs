import { chromium } from 'playwright-core';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5174';
const outputDir =
  process.env.SCREENSHOT_DIR ??
  '/Users/eric/.codex/visualizations/2026/09/02/01a0627b-cfa6-77a0-8ea4-4c11561abead';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function load(page, route) {
  await page.goto(`${baseUrl}#${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(120);
}

async function overflow(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const width = Math.max(html.clientWidth, body.clientWidth);
    const scrollWidth = Math.max(html.scrollWidth, body.scrollWidth);
    return {
      width,
      scrollWidth,
      overflow: scrollWidth - width
    };
  });
}

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox']
});

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 }
  });
  const desktopPage = await desktop.newPage();
  const consoleErrors = [];

  desktopPage.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      consoleErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  desktopPage.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));

  await load(desktopPage, '/');
  await desktopPage.screenshot({
    path: `${outputDir}/home-desktop.png`,
    fullPage: true
  });
  assert((await overflow(desktopPage)).overflow === 0, 'desktop home has horizontal overflow');

  await load(desktopPage, '/lessons/membership');
  await desktopPage.getByRole('heading', { name: '元素與集合的關係' }).waitFor();
  await desktopPage.getByRole('button', { name: '標記完成' }).click();
  assert(
    await desktopPage.evaluate(() =>
      localStorage.getItem('collection-tool:progress:v1')?.includes('membership')
    ),
    'completed lesson was not saved'
  );
  await desktopPage.screenshot({
    path: `${outputDir}/lesson-desktop.png`,
    fullPage: true
  });

  await load(desktopPage, '/explorer');
  const draggedChip = desktopPage.locator('.element-chip').filter({ hasText: '7' }).first();
  const dropZone = desktopPage.locator('[data-drop-zone="a"]').first();
  const chipBox = await draggedChip.boundingBox();
  const zoneBox = await dropZone.boundingBox();
  assert(chipBox && zoneBox, 'drag targets were not visible');
  await desktopPage.mouse.move(
    chipBox.x + chipBox.width / 2,
    chipBox.y + chipBox.height / 2
  );
  await desktopPage.mouse.down();
  await desktopPage.mouse.move(
    zoneBox.x + zoneBox.width / 2,
    zoneBox.y + zoneBox.height / 2,
    { steps: 10 }
  );
  await desktopPage.mouse.up();
  assert(
    (await desktopPage.locator('body').innerText()).includes('{1, 2, 3, 4, 7}'),
    'dragging an element into A did not update the set'
  );
  await desktopPage.getByRole('button', { name: /元素 3/ }).click();
  await desktopPage.getByRole('button', { name: '加入 A' }).click();
  await desktopPage.getByRole('button', { name: /Aᶜ/ }).click();
  assert(
    (await desktopPage.getByText('Aᶜ', { exact: true }).count()) >= 1,
    'explorer complement control did not render'
  );
  await desktopPage.locator('#new-universe-value').fill('9');
  await desktopPage.getByRole('button', { name: '加入', exact: true }).click();
  await desktopPage.getByRole('button', { name: /元素 9/ }).click();
  await desktopPage.getByRole('button', { name: '移出 U' }).click();
  assert(
    (await desktopPage.getByRole('button', { name: /元素 9/ }).count()) === 0,
    'universe removal did not remove element'
  );

  await load(desktopPage, '/practice');
  await desktopPage.locator('.choice-button').first().click();
  assert(
    (await desktopPage.locator('.feedback').count()) === 1,
    'practice feedback did not render'
  );

  await load(desktopPage, '/quiz');
  await desktopPage.getByRole('button', { name: '開始測驗' }).click();
  for (let index = 0; index < 12; index += 1) {
    await desktopPage.locator('.choice-button').first().click();
    await desktopPage
      .getByRole('button', { name: index === 11 ? '完成測驗' : '確認答案' })
      .click();
  }
  await desktopPage.locator('.quiz-summary').waitFor();
  assert(
    (await desktopPage.locator('.mistake-section, .all-correct').count()) === 1,
    'quiz summary did not show final report'
  );
  assert(
    await desktopPage.evaluate(() =>
      Boolean(localStorage.getItem('collection-tool:quiz-history:v1'))
    ),
    'quiz result was not saved'
  );

  await load(desktopPage, '/results');
  assert(
    (await desktopPage.getByRole('heading', { name: '我的學習結果' }).count()) === 1,
    'results page did not render'
  );

  assert(consoleErrors.length === 0, `browser console issues: ${consoleErrors.join('\n')}`);

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobile.newPage();
  await load(mobilePage, '/');
  await mobilePage.screenshot({
    path: `${outputDir}/home-mobile.png`,
    fullPage: true
  });
  assert((await overflow(mobilePage)).overflow === 0, 'mobile home has horizontal overflow');

  await load(mobilePage, '/explorer');
  await mobilePage.screenshot({
    path: `${outputDir}/explorer-mobile.png`,
    fullPage: true
  });
  assert((await overflow(mobilePage)).overflow === 0, 'mobile explorer has horizontal overflow');

  await desktop.close();
  await mobile.close();
  console.log('browser verification passed');
} finally {
  await browser.close();
}
