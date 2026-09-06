import { chromium } from 'playwright-core';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5173';
const testToken = process.env.S5_TEST_TOKEN;
const outputDir =
  process.env.SCREENSHOT_DIR ??
  '/Users/eric/.codex/visualizations/2026/09/06/01a075c8-db36-7b21-87b2-0339e5cf121a';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

if (!testToken) {
  throw new Error('S5_TEST_TOKEN is required.');
}

async function prepare(page) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate((token) => {
    localStorage.setItem('mathfatfat:auth-token', token);
  }, testToken);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.goto(`${baseUrl}#/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
}

async function load(page, route) {
  await page.goto(`${baseUrl}#${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
}

async function overflow(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const width = Math.max(root.clientWidth, document.body.clientWidth);
    const scrollWidth = Math.max(root.scrollWidth, document.body.scrollWidth);
    return scrollWidth - width;
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
  const page = await desktop.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await prepare(page);
  assert(
    (await page.getByRole('heading', { name: '直線坐標幾何視覺化與基礎解題' }).count()) === 1,
    'S5 home title is missing'
  );
  assert(
    (await page.getByRole('link', { name: /直線實驗室/ }).count()) >= 1,
    'S5 line lab entry is missing'
  );
  await page.screenshot({
    path: `${outputDir}/s5-home-desktop.png`,
    fullPage: true
  });
  assert((await overflow(page)) === 0, 'S5 desktop home has horizontal overflow');

  const lessonIds = [
    's5-directed-segment',
    's5-section-point',
    's5-polygon-area',
    's5-slope',
    's5-line-forms',
    's5-line-relations',
    's5-distance-normal',
    's5-line-family'
  ];
  for (const lessonId of lessonIds) {
    await load(page, `/lessons/${lessonId}`);
    assert(
      (await page.locator('.lesson-example-item').count()) >= 3,
      `${lessonId} is missing detailed examples`
    );
    assert(
      (await page.locator('.lesson-detail-list li').count()) >= 4,
      `${lessonId} is missing detailed notes`
    );
  }

  await load(page, '/s5-lab');
  assert(
    (await page.getByRole('heading', { name: '直線實驗室' }).count()) === 1,
    'S5 line lab page did not render'
  );
  assert(
    (await page.locator('.coordinate-line-lab').count()) === 1,
    'S5 coordinate line lab did not render'
  );
  await page.getByRole('button', { name: '比較第二條線' }).click();
  assert(
    (await page.getByText('兩線關係').count()) === 1,
    'two-line comparison did not render'
  );
  const lambdaSlider = page.getByRole('slider', {
    name: '定比分點 λ 滑桿'
  });
  assert(
    Number(await lambdaSlider.getAttribute('step')) < 0.5,
    'lambda slider is not smooth enough'
  );
  await page.getByLabel('λ 下限').fill('-2');
  await page.getByLabel('λ 上限').fill('4');
  assert(
    (await lambdaSlider.getAttribute('min')) === '-2' &&
      (await lambdaSlider.getAttribute('max')) === '4',
    'lambda custom range did not update'
  );
  await page.getByRole('button', { name: /y = mx \+ b/ }).click();
  assert(
    (await page.getByRole('slider', { name: /第一條線斜率/ }).count()) === 1,
    'slope-intercept mode did not render'
  );
  await page.screenshot({
    path: `${outputDir}/s5-lab-desktop.png`,
    fullPage: true
  });
  assert((await overflow(page)) === 0, 'S5 desktop line lab has horizontal overflow');

  await load(page, '/practice/s5-slope');
  assert(
    (await page.getByRole('heading', { name: '傾斜角與斜率' }).count()) === 1,
    'S5 practice did not render'
  );
  assert(
    (await page.getByRole('button', { name: /生成弱點練習/ }).count()) === 1,
    'S5 practice is missing AI question generation'
  );
  await page.route('**/api/ai/generate-practice', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        questions: [
          {
            id: 'ai-s5-browser-1',
            topic: 's5-slope',
            kind: 'slope',
            difficulty: 'standard',
            prompt: 'AI 生成的斜率題',
            choices: ['2', '1/2', '−2', '4'],
            answer: '2',
            explanation: '斜率是縱坐標差除以橫坐標差。',
            hint: '先算兩個坐標差。',
            mistakeTags: ['slope-angle-confusion']
          }
        ]
      })
    });
  });
  await page.getByRole('button', { name: /生成弱點練習/ }).click();
  await page.getByRole('heading', { name: 'AI 生成的斜率題' }).waitFor();
  await page.locator('.choice-button').first().click();
  assert(
    (await page.locator('.feedback').count()) === 1,
    'S5 practice feedback did not render'
  );

  await load(page, '/quiz');
  await page.getByRole('button', { name: '開始測驗' }).click();
  for (let index = 0; index < 12; index += 1) {
    await page.locator('.choice-button').first().click();
    await page
      .getByRole('button', { name: index === 11 ? '完成測驗' : '確認答案' })
      .click();
  }
  await page.locator('.quiz-summary').waitFor();
  assert(
    (await page.locator('.quiz-summary').count()) === 1,
    'S5 quiz summary did not render'
  );
  assert(
    (await page.getByRole('button', { name: /AI 老師/ }).count()) === 1,
    'S5 user is missing AI teacher'
  );
  await page.route('**/api/ai/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: '先計算兩點的縱坐標差與橫坐標差。' })
    });
  });
  await page.getByRole('button', { name: 'AI 老師' }).click();
  await page.locator('.ai-teacher__panel').waitFor();
  await page.locator('.ai-teacher__input textarea').fill('斜率怎麼求？');
  await page.locator('.ai-teacher__send').click();
  await page.getByText('先計算兩點的縱坐標差與橫坐標差。', { exact: true }).waitFor();
  await page.getByRole('button', { name: '關閉 AI 老師' }).click();

  const mobile = await browser.newContext({
    viewport: { width: 320, height: 568 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobile.newPage();
  await prepare(mobilePage);
  await load(mobilePage, '/s5-lab');
  await mobilePage.screenshot({
    path: `${outputDir}/s5-lab-mobile.png`,
    fullPage: true
  });
  assert((await overflow(mobilePage)) === 0, 'S5 mobile line lab has horizontal overflow');
  assert(
    (await mobilePage.locator('.coordinate-line-lab').count()) === 1,
    'S5 mobile line lab did not render'
  );

  assert(
    consoleErrors.length === 0,
    `S5 browser console errors: ${consoleErrors.join('\n')}`
  );
  await mobile.close();
  await desktop.close();
  console.log('S5 browser verification passed');
} finally {
  await browser.close();
}
