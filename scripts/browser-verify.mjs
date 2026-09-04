import { chromium } from 'playwright-core';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5173';
const testToken = process.env.TEST_TOKEN;
const outputDir =
  process.env.SCREENSHOT_DIR ??
  '/Users/eric/.codex/visualizations/2026/09/02/01a0627b-cfa6-77a0-8ea4-4c11561abead';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

if (!testToken) {
  throw new Error(
    'TEST_TOKEN is required. Start the local backend and pass a valid teacher JWT.'
  );
}

async function load(page, route) {
  await page.goto(`${baseUrl}#${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
}

async function prepare(page) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  if (testToken) {
    await page.evaluate((token) => {
      localStorage.setItem('mathfatfat:auth-token', token);
    }, testToken);
    await page.reload({ waitUntil: 'domcontentloaded' });
  }
  await page.goto(`${baseUrl}#/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
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

  await prepare(desktopPage);
  assert(
    (await desktopPage.getByText('developed by Eric Wong', { exact: true }).count()) === 1,
    'footer credit is missing'
  );
  assert(
    (await desktopPage.getByRole('link', { name: /學習結果/ }).count()) >= 1,
    'home results entry is missing'
  );
  await desktopPage.screenshot({
    path: `${outputDir}/home-desktop.png`,
    fullPage: true
  });
  assert((await overflow(desktopPage)).overflow === 0, 'desktop home has horizontal overflow');

  await load(desktopPage, '/lessons/membership');
  await desktopPage.getByRole('heading', { name: '元素與集合的關係' }).waitFor();
  assert(
    (await desktopPage.getByRole('link', { name: '開始練習' }).count()) === 1,
    'lesson practice entry is missing'
  );
  const markButton = desktopPage.getByRole('button', { name: '標記完成' });
  if ((await markButton.count()) > 0) {
    await markButton.click();
  }
  await desktopPage.getByText('已標記完成', { exact: true }).waitFor();
  assert(
    (await desktopPage.getByText('已標記完成', { exact: true }).count()) === 1,
    'completed lesson was not saved'
  );
  await desktopPage.screenshot({
    path: `${outputDir}/lesson-desktop.png`,
    fullPage: true
  });

  await load(desktopPage, '/explorer');
  await desktopPage.getByRole('button', { name: /元素 7/ }).click();
  await desktopPage.getByRole('button', { name: '加入 A' }).click();
  await desktopPage.getByRole('button', { name: '復原' }).click();
  assert(
    (await desktopPage.locator('[aria-label*="元素 7，目前在 U 中但不屬於 A 或 B"]').count()) === 1,
    'explorer undo did not restore membership'
  );
  const element7 = desktopPage.getByRole('button', { name: /元素 7/ });
  const dropZoneA = desktopPage.locator('.venn-drop-zone--a');
  const element7Box = await element7.boundingBox();
  const dropZoneABox = await dropZoneA.boundingBox();
  assert(element7Box && dropZoneABox, 'explorer drag targets are not visible');
  await desktopPage.mouse.move(
    element7Box.x + element7Box.width / 2,
    element7Box.y + element7Box.height / 2
  );
  await desktopPage.mouse.down();
  await desktopPage.mouse.move(
    dropZoneABox.x + dropZoneABox.width / 2,
    dropZoneABox.y + dropZoneABox.height / 2,
    { steps: 8 }
  );
  await desktopPage.mouse.up();
  await desktopPage.waitForTimeout(100);
  assert(
    (await desktopPage.locator('[aria-label*="元素 7，目前只屬於 A"]').count()) === 1,
    'explorer drag did not move element into A'
  );
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
  await load(desktopPage, '/practice/membership');
  assert(
    (await desktopPage.getByRole('heading', { name: '元素關係' }).count()) === 1,
    'unit practice did not render'
  );
  await desktopPage.screenshot({
    path: `${outputDir}/practice-desktop.png`,
    fullPage: true
  });
  assert((await overflow(desktopPage)).overflow === 0, 'desktop practice has horizontal overflow');

  await load(desktopPage, '/practice/operations');
  assert(
    (await desktopPage.getByRole('heading', { name: '交集、聯集與差集' }).count()) === 1,
    'operations unit practice did not render'
  );
  assert(
    (await desktopPage.getByText('第 1 / 12 題').count()) === 1,
    'operations unit practice did not include both operation topics'
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
    (await desktopPage.getByText('建議重學內容').count()) === 1,
    'quiz summary is missing relearning suggestions'
  );
  assert(
    (await desktopPage.getByRole('button', { name: '錯題重做' }).count()) === 1,
    'quiz result is missing retry action'
  );
  await desktopPage.getByRole('button', { name: '錯題重做' }).click();
  await desktopPage.getByRole('heading', { name: '重新練習這一組錯題' }).waitFor();
  await desktopPage.getByRole('button', { name: /返回測驗結果/ }).click();
  const quizSaved = await desktopPage.evaluate(async () => {
    const token = localStorage.getItem('mathfatfat:auth-token');
    const response = await fetch('/api/progress', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return false;
    const progress = await response.json();
    return progress.quiz_attempts.length > 0;
  });
  assert(quizSaved, 'quiz result was not saved');

  await load(desktopPage, '/results');
  assert(
    (await desktopPage.getByRole('heading', { name: '我的學習結果' }).count()) === 1,
    'results page did not render'
  );
  assert(
    (await desktopPage.getByText('建議重學內容').count()) === 1,
    'results page is missing relearning suggestions'
  );
  await desktopPage.screenshot({
    path: `${outputDir}/results-desktop.png`,
    fullPage: true
  });
  assert((await overflow(desktopPage)).overflow === 0, 'desktop results has horizontal overflow');

  await load(desktopPage, '/admin');
  await desktopPage.getByRole('heading', { name: '學生學習數據' }).waitFor();
  assert(
    (await desktopPage.locator('.admin-teacher-form').count()) === 1,
    'admin teacher management did not render'
  );
  assert(
    (await desktopPage.locator('.admin-table').count()) === 1,
    'admin student table did not render'
  );

  await desktopPage.getByRole('button', { name: 'AI 老師' }).click();
  await desktopPage.locator('.ai-teacher__panel').waitFor();
  assert(
    (await desktopPage.locator('.ai-teacher__input textarea').count()) === 1,
    'AI teacher panel did not render'
  );
  await desktopPage.getByRole('button', { name: '關閉 AI 老師' }).click();

  assert(consoleErrors.length === 0, `browser console issues: ${consoleErrors.join('\n')}`);

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobile.newPage();
  await prepare(mobilePage);
  assert(
    (await mobilePage.locator('.main-nav__link').first().getAttribute('aria-label')) === '首頁',
    'mobile nav link is missing an accessible label'
  );
  assert(
    (await mobilePage.getByText('developed by Eric Wong', { exact: true }).count()) === 1,
    'mobile footer credit is missing'
  );
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

  await load(mobilePage, '/practice/membership');
  await mobilePage.screenshot({
    path: `${outputDir}/practice-mobile.png`,
    fullPage: true
  });
  assert((await overflow(mobilePage)).overflow === 0, 'mobile practice has horizontal overflow');

  await desktop.close();
  await mobile.close();
  console.log('browser verification passed');
} finally {
  await browser.close();
}
