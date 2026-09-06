import type {
  S5QuestionKind,
  S5QuizTopic,
  QuizQuestion
} from '../types';

export const s5TopicLabels: Record<S5QuizTopic, string> = {
  's5-directed-segment': '有向線段與兩點距離',
  's5-section-point': '定比分點',
  's5-polygon-area': '直線形面積',
  's5-slope': '傾斜角與斜率',
  's5-line-forms': '直線方程',
  's5-line-relations': '兩線位置與夾角',
  's5-distance-normal': '點線距離與法線式',
  's5-line-family': '直線系'
};

export const s5QuestionKindLabels: Record<S5QuestionKind, string> = {
  coordinate: '坐標計算',
  slope: '斜率',
  'line-equation': '直線方程',
  'line-relation': '直線關係',
  distance: '距離',
  angle: '夾角',
  area: '面積'
};

export const s5Questions: QuizQuestion[] = [
  {
    id: 's5-directed-01',
    topic: 's5-directed-segment',
    kind: 'coordinate',
    difficulty: 'basic',
    prompt: '在數軸上，A 的坐標是 3，B 的坐標是 −2，則 AB = ?',
    choices: ['−5', '5', '1', '−1'],
    answer: '−5',
    explanation: 'AB = B 的坐標 − A 的坐標 = −2 − 3 = −5。',
    hint: '有向線段的數量是終點坐標減起點坐標。',
    mistakeTags: ['directed-length-sign']
  },
  {
    id: 's5-directed-02',
    topic: 's5-directed-segment',
    kind: 'distance',
    difficulty: 'basic',
    prompt: 'A(1, 2) 與 B(4, 6) 的距離是多少？',
    choices: ['3', '4', '5', '7'],
    answer: '5',
    explanation: '距離 = √((4 − 1)² + (6 − 2)²) = √(9 + 16) = 5。',
    mistakeTags: []
  },
  {
    id: 's5-directed-03',
    topic: 's5-directed-segment',
    kind: 'distance',
    difficulty: 'standard',
    prompt: '若 |AB| = 7 且 BA = −7，則 AB 的數量是多少？',
    choices: ['−7', '7', '0', '無法確定'],
    answer: '7',
    explanation: 'BA 與 AB 互為相反數，所以 AB = −BA = 7。',
    hint: 'AB = −BA。',
    mistakeTags: ['directed-length-sign']
  },
  {
    id: 's5-directed-04',
    topic: 's5-directed-segment',
    kind: 'coordinate',
    difficulty: 'basic',
    prompt: '對於同一有向線段，AB + BA 一定等於多少？',
    choices: ['0', '2AB', '|AB|', '1'],
    answer: '0',
    explanation: 'AB 與 BA 的方向相反，數量互為相反數，所以和為 0。',
    mistakeTags: ['directed-length-sign']
  },
  {
    id: 's5-directed-05',
    topic: 's5-directed-segment',
    kind: 'distance',
    difficulty: 'challenge',
    prompt: 'P(−2, 1) 到 Q(x, 5) 的距離為 5，且 x 是正數，則 x = ?',
    choices: ['1', '2', '3', '4'],
    answer: '1',
    explanation: '√((x + 2)² + 4²) = 5，所以 (x + 2)² = 9。x 為正數時 x + 2 = 3，得 x = 1。',
    hint: '平方後解絕對值，並使用 x 為正數的條件。',
    mistakeTags: ['distance-absolute-value']
  },
  {
    id: 's5-section-01',
    topic: 's5-section-point',
    kind: 'coordinate',
    difficulty: 'basic',
    prompt: 'A(2, 5)、B(−4, 1)，線段 AB 的中點是？',
    choices: ['(−1, 3)', '(3, 2)', '(−1, 2)', '(1, 3)'],
    answer: '(−1, 3)',
    explanation: '中點坐標是 ((2 − 4)/2, (5 + 1)/2) = (−1, 3)。',
    mistakeTags: []
  },
  {
    id: 's5-section-02',
    topic: 's5-section-point',
    kind: 'coordinate',
    difficulty: 'standard',
    prompt: 'P₁(1, 2)、P₂(4, 6)，點 P 分 P₁P₂ 的比為 λ = 2，P 的坐標是？',
    choices: ['(3, 14/3)', '(2, 4)', '(7/3, 10/3)', '(3, 4)'],
    answer: '(3, 14/3)',
    explanation: 'x = (1 + 2·4)/(1 + 2) = 3，y = (2 + 2·6)/3 = 14/3。',
    mistakeTags: ['section-ratio-order']
  },
  {
    id: 's5-section-03',
    topic: 's5-section-point',
    kind: 'coordinate',
    difficulty: 'challenge',
    prompt: 'P₁(1, 2)、P₂(4, 6)，點 P 外分 P₁P₂ 的比為 λ = −2，P 的坐標是？',
    choices: ['(7, 10)', '(−7, −10)', '(2, 10/3)', '(5, 8)'],
    answer: '(7, 10)',
    explanation: 'x = (1 − 8)/(−1) = 7，y = (2 − 12)/(−1) = 10。',
    mistakeTags: ['section-ratio-order']
  },
  {
    id: 's5-section-04',
    topic: 's5-section-point',
    kind: 'coordinate',
    difficulty: 'basic',
    prompt: '三角形頂點為 (0, 0)、(6, 0)、(0, 3)，重心坐標是？',
    choices: ['(2, 1)', '(3, 1)', '(2, 3)', '(3, 1.5)'],
    answer: '(2, 1)',
    explanation: '重心是三個頂點坐標的平均值：((0 + 6 + 0)/3, (0 + 0 + 3)/3)。',
    mistakeTags: []
  },
  {
    id: 's5-section-05',
    topic: 's5-section-point',
    kind: 'coordinate',
    difficulty: 'standard',
    prompt: '定比分點公式中的 λ 不能等於哪一個值？',
    choices: ['−1', '0', '1', '2'],
    answer: '−1',
    explanation: 'λ = −1 時分母 1 + λ 為 0，公式無意義。',
    mistakeTags: ['section-ratio-order']
  },
  {
    id: 's5-area-01',
    topic: 's5-polygon-area',
    kind: 'area',
    difficulty: 'basic',
    prompt: '三角形頂點為 (0, 0)、(4, 0)、(0, 3)，面積是多少？',
    choices: ['6', '12', '7', '24'],
    answer: '6',
    explanation: '這是直角邊長 4 與 3 的三角形，面積 = 4 × 3 ÷ 2 = 6。',
    mistakeTags: []
  },
  {
    id: 's5-area-02',
    topic: 's5-polygon-area',
    kind: 'area',
    difficulty: 'basic',
    prompt: '三點共線時，由這三點形成的三角形面積是多少？',
    choices: ['0', '1', '無法確定', '負數'],
    answer: '0',
    explanation: '三點共線不能形成三角形，面積為 0。',
    mistakeTags: []
  },
  {
    id: 's5-area-03',
    topic: 's5-polygon-area',
    kind: 'area',
    difficulty: 'standard',
    prompt: '三角形頂點為 (1, 1)、(3, 1)、(1, 4)，面積是多少？',
    choices: ['3', '6', '9', '4.5'],
    answer: '3',
    explanation: '底長為 2、高為 3，面積 = 2 × 3 ÷ 2 = 3。',
    mistakeTags: []
  },
  {
    id: 's5-area-04',
    topic: 's5-polygon-area',
    kind: 'area',
    difficulty: 'challenge',
    prompt: 'A(−1, 0)、B(2, 0)、C(0, 2) 所形成的三角形面積是多少？',
    choices: ['3', '6', '1.5', '2'],
    answer: '3',
    explanation: '底 AB = 3，C 到 x 軸的高 = 2，面積 = 3。',
    mistakeTags: []
  },
  {
    id: 's5-area-05',
    topic: 's5-polygon-area',
    kind: 'area',
    difficulty: 'standard',
    prompt: '用三點面積公式時，括號內行列式的值為 −4，則三角形的實際面積是多少？',
    choices: ['4', '−4', '8', '2'],
    answer: '2',
    explanation: '實際面積 = |−4| / 2 = 2。',
    mistakeTags: ['distance-absolute-value']
  },
  {
    id: 's5-slope-01',
    topic: 's5-slope',
    kind: 'slope',
    difficulty: 'basic',
    prompt: 'A(1, 2)、B(3, 6)，直線 AB 的斜率是多少？',
    choices: ['2', '1/2', '−2', '4'],
    answer: '2',
    explanation: 'k = (6 − 2)/(3 − 1) = 4/2 = 2。',
    mistakeTags: []
  },
  {
    id: 's5-slope-02',
    topic: 's5-slope',
    kind: 'slope',
    difficulty: 'basic',
    prompt: '直線 x = 4 的斜率如何？',
    choices: ['不存在', '0', '1', '−1'],
    answer: '不存在',
    explanation: 'x = 4 是垂直線，傾斜角為 90°，斜率 tan 90° 不存在。',
    mistakeTags: ['slope-angle-confusion']
  },
  {
    id: 's5-slope-03',
    topic: 's5-slope',
    kind: 'angle',
    difficulty: 'basic',
    prompt: '斜率為 1 的直線，其傾斜角是多少？',
    choices: ['45°', '30°', '60°', '135°'],
    answer: '45°',
    explanation: 'tan 45° = 1。',
    mistakeTags: ['slope-angle-confusion']
  },
  {
    id: 's5-slope-04',
    topic: 's5-slope',
    kind: 'angle',
    difficulty: 'standard',
    prompt: '斜率為 −√3 的直線，其傾斜角是多少？',
    choices: ['120°', '60°', '150°', '30°'],
    answer: '120°',
    explanation: 'tan 60° = √3；斜率為負，傾斜角在 90° 到 180°，所以是 120°。',
    mistakeTags: ['slope-angle-confusion']
  },
  {
    id: 's5-slope-05',
    topic: 's5-slope',
    kind: 'coordinate',
    difficulty: 'challenge',
    prompt: 'A(1, 1)、B(3, 3)、C(k, 7) 三點共線，則 k = ?',
    choices: ['7', '5', '6', '8'],
    answer: '7',
    explanation: 'A、B 所在直線是 y = x，因此 C(k, 7) 要共線必須 k = 7。',
    mistakeTags: ['slope-angle-confusion']
  },
  {
    id: 's5-form-01',
    topic: 's5-line-forms',
    kind: 'line-equation',
    difficulty: 'basic',
    prompt: '經過點 (2, 3) 且斜率為 2 的直線方程是？',
    choices: ['y = 2x − 1', 'y = 2x + 3', 'y = 3x + 2', 'y = −2x + 1'],
    answer: 'y = 2x − 1',
    explanation: '點斜式為 y − 3 = 2(x − 2)，化簡得 y = 2x − 1。',
    mistakeTags: []
  },
  {
    id: 's5-form-02',
    topic: 's5-line-forms',
    kind: 'line-equation',
    difficulty: 'basic',
    prompt: '直線 y = 3x − 4 在 y 軸上的截距是多少？',
    choices: ['−4', '4', '3', '−3'],
    answer: '−4',
    explanation: '斜截式 y = kx + b 中，b = −4 是 y 截距。',
    mistakeTags: ['intercept-sign']
  },
  {
    id: 's5-form-03',
    topic: 's5-line-forms',
    kind: 'line-equation',
    difficulty: 'standard',
    prompt: '直線在 x 軸截距為 3、y 軸截距為 −2，其截距式是？',
    choices: ['x/3 + y/(−2) = 1', 'x/3 − y/2 = 0', '3x − 2y = 1', 'x/2 + y/3 = 1'],
    answer: 'x/3 + y/(−2) = 1',
    explanation: '截距式為 x/a + y/b = 1，其中 a = 3、b = −2。',
    mistakeTags: ['intercept-sign']
  },
  {
    id: 's5-form-04',
    topic: 's5-line-forms',
    kind: 'line-equation',
    difficulty: 'basic',
    prompt: '經過點 (5, −1) 且與 y 軸平行的直線方程是？',
    choices: ['x = 5', 'y = −1', 'y = 5x − 1', 'x = −1'],
    answer: 'x = 5',
    explanation: '與 y 軸平行的直線是垂直線，x 坐標固定為 5。',
    mistakeTags: ['line-form-domain']
  },
  {
    id: 's5-form-05',
    topic: 's5-line-forms',
    kind: 'line-equation',
    difficulty: 'challenge',
    prompt: '一般式 Ax + By + C = 0 表示垂直線時，正確條件是？',
    choices: ['B = 0 且 A ≠ 0', 'A = 0 且 B ≠ 0', 'A = B = 0', 'C = 0'],
    answer: 'B = 0 且 A ≠ 0',
    explanation: 'B = 0 時方程不含 y，化簡為 x = 常數，表示垂直線。',
    mistakeTags: ['line-form-domain']
  },
  {
    id: 's5-relation-01',
    topic: 's5-line-relations',
    kind: 'line-relation',
    difficulty: 'basic',
    prompt: '斜率分別為 2 與 −1/2 的兩直線，位置關係是？',
    choices: ['垂直', '平行', '重合', '相交但不垂直'],
    answer: '垂直',
    explanation: '2 × (−1/2) = −1，所以兩線垂直。',
    mistakeTags: ['parallel-perpendicular-condition']
  },
  {
    id: 's5-relation-02',
    topic: 's5-line-relations',
    kind: 'line-relation',
    difficulty: 'basic',
    prompt: 'y = 2x + 1 與 y = 2x − 3 的位置關係是？',
    choices: ['平行', '重合', '垂直', '相交於一點'],
    answer: '平行',
    explanation: '兩線斜率相同但 y 截距不同，因此平行。',
    mistakeTags: ['parallel-perpendicular-condition']
  },
  {
    id: 's5-relation-03',
    topic: 's5-line-relations',
    kind: 'line-relation',
    difficulty: 'standard',
    prompt: 'x + y + 1 = 0 與 2x + 2y + 2 = 0 的位置關係是？',
    choices: ['重合', '平行', '垂直', '相交'],
    answer: '重合',
    explanation: '第二式是第一式的兩倍，兩者表示同一條直線。',
    mistakeTags: ['parallel-perpendicular-condition']
  },
  {
    id: 's5-relation-04',
    topic: 's5-line-relations',
    kind: 'line-relation',
    difficulty: 'standard',
    prompt: 'y = x 與 y = −x + 2 的交點是？',
    choices: ['(1, 1)', '(−1, −1)', '(2, 0)', '(0, 2)'],
    answer: '(1, 1)',
    explanation: '令 x = −x + 2，得 x = 1、y = 1。',
    mistakeTags: []
  },
  {
    id: 's5-relation-05',
    topic: 's5-line-relations',
    kind: 'angle',
    difficulty: 'standard',
    prompt: '兩直線斜率分別為 1 與 0，它們的銳角夾角是多少？',
    choices: ['45°', '30°', '60°', '90°'],
    answer: '45°',
    explanation: '斜率 1 的傾斜角是 45°，水平線傾斜角是 0°，夾角為 45°。',
    mistakeTags: ['slope-angle-confusion']
  },
  {
    id: 's5-distance-01',
    topic: 's5-distance-normal',
    kind: 'distance',
    difficulty: 'basic',
    prompt: '原點到直線 3x + 4y + 5 = 0 的距離是多少？',
    choices: ['1', '5', '0.6', '2'],
    answer: '1',
    explanation: '距離 = |0 + 0 + 5| / √(9 + 16) = 5/5 = 1。',
    mistakeTags: ['distance-absolute-value']
  },
  {
    id: 's5-distance-02',
    topic: 's5-distance-normal',
    kind: 'distance',
    difficulty: 'basic',
    prompt: '點 (1, 1) 到直線 x + y − 2 = 0 的距離是多少？',
    choices: ['0', '√2', '1', '2'],
    answer: '0',
    explanation: '1 + 1 − 2 = 0，點在直線上，所以距離為 0。',
    mistakeTags: []
  },
  {
    id: 's5-distance-03',
    topic: 's5-distance-normal',
    kind: 'distance',
    difficulty: 'standard',
    prompt: '3x + 4y − 7 = 0 與 3x + 4y + 8 = 0 的距離是多少？',
    choices: ['3', '5', '1', '15'],
    answer: '3',
    explanation: '兩平行線距離 = |−7 − 8| / 5 = 15/5 = 3。',
    mistakeTags: ['distance-absolute-value']
  },
  {
    id: 's5-distance-04',
    topic: 's5-distance-normal',
    kind: 'line-equation',
    difficulty: 'challenge',
    prompt: '直線 x + y − 1 = 0 的法線式是？',
    choices: [
      'x/√2 + y/√2 − 1/√2 = 0',
      'x + y − 1 = 0',
      'x/√2 + y/√2 + 1/√2 = 0',
      '√2x + √2y − 1 = 0'
    ],
    answer: 'x/√2 + y/√2 − 1/√2 = 0',
    explanation: '兩邊除以 √(1² + 1²) = √2，並使常數項為負，得到法線式。',
    mistakeTags: ['normal-form-sign']
  },
  {
    id: 's5-distance-05',
    topic: 's5-distance-normal',
    kind: 'distance',
    difficulty: 'challenge',
    prompt: '點 (3, 4) 到直線 4x + 3y = 0 的距離是多少？',
    choices: ['24/5', '12/5', '0', '5'],
    answer: '24/5',
    explanation: '距離 = |12 + 12| / 5 = 24/5。',
    mistakeTags: ['distance-absolute-value']
  },
  {
    id: 's5-family-01',
    topic: 's5-line-family',
    kind: 'line-equation',
    difficulty: 'basic',
    prompt: '與 2x + 3y + 1 = 0 平行的直線系可寫成？',
    choices: ['2x + 3y + λ = 0', '3x − 2y + λ = 0', '2x − 3y + λ = 0', '3x + 2y + λ = 0'],
    answer: '2x + 3y + λ = 0',
    explanation: '平行直線保持 A、B 係數不變，只改變常數項。',
    mistakeTags: ['parallel-perpendicular-condition']
  },
  {
    id: 's5-family-02',
    topic: 's5-line-family',
    kind: 'line-equation',
    difficulty: 'standard',
    prompt: '與 2x + 3y + 1 = 0 垂直的直線系可寫成？',
    choices: ['3x − 2y + λ = 0', '2x + 3y + λ = 0', '2x − 3y + λ = 0', '3x + 2y + λ = 0'],
    answer: '3x − 2y + λ = 0',
    explanation: '垂直方向可由 Bx − Ay + λ = 0 得到，即 3x − 2y + λ = 0。',
    mistakeTags: ['parallel-perpendicular-condition']
  },
  {
    id: 's5-family-03',
    topic: 's5-line-family',
    kind: 'line-equation',
    difficulty: 'standard',
    prompt: 'l₁ + λl₂ = 0 表示經過 l₁ 與 l₂ 交點的直線系，但它不包含哪一條直線？',
    choices: ['l₂', 'l₁', '兩條都不包含', '水平線'],
    answer: 'l₂',
    explanation: '該線性組合固定保留 l₁，λ 變化時無法單獨表示 l₂。',
    mistakeTags: []
  },
  {
    id: 's5-family-04',
    topic: 's5-line-family',
    kind: 'line-equation',
    difficulty: 'basic',
    prompt: '直線系 y = kx + b 中，b 固定而 k 改變時，所有直線都經過哪一點？',
    choices: ['(0, b)', '(b, 0)', '(1, b)', '(0, 0)'],
    answer: '(0, b)',
    explanation: 'x = 0 時 y = b，因此都經過 y 軸上的點 (0, b)。',
    mistakeTags: []
  },
  {
    id: 's5-family-05',
    topic: 's5-line-family',
    kind: 'line-equation',
    difficulty: 'challenge',
    prompt: 'x + y − 1 = 0 與 x − y + 1 = 0 的交點是 (0, 1)。過此點且平行 x 軸的直線是？',
    choices: ['y = 1', 'x = 0', 'y = 0', 'y = x'],
    answer: 'y = 1',
    explanation: '平行 x 軸的直線 y 坐標固定，交點縱坐標為 1，所以是 y = 1。',
    mistakeTags: ['parallel-perpendicular-condition']
  },
  {
    id: 's5-directed-06',
    topic: 's5-directed-segment',
    kind: 'coordinate',
    difficulty: 'challenge',
    prompt: 'A(−3, 2)、B(1, 2)，有向線段 AB 的 x 分量是多少？',
    choices: ['4', '−4', '1', '2'],
    answer: '4',
    explanation: '有向線段的 x 分量是 xB − xA = 1 − (−3) = 4。',
    mistakeTags: ['directed-length-sign']
  },
  {
    id: 's5-section-06',
    topic: 's5-section-point',
    kind: 'coordinate',
    difficulty: 'challenge',
    prompt: '三角形頂點為 (1, 2)、(3, 4)、(5, 6)，重心坐標是？',
    choices: ['(3, 4)', '(2, 3)', '(4, 5)', '(3, 3)'],
    answer: '(3, 4)',
    explanation: 'x = (1 + 3 + 5)/3 = 3，y = (2 + 4 + 6)/3 = 4。',
    mistakeTags: ['section-ratio-order']
  },
  {
    id: 's5-area-06',
    topic: 's5-polygon-area',
    kind: 'area',
    difficulty: 'challenge',
    prompt: '三角形頂點為 (0, 0)、(5, 0)、(2, 4)，面積是多少？',
    choices: ['10', '20', '5', '8'],
    answer: '10',
    explanation: '底長 5、高 4，面積 = 5 × 4 ÷ 2 = 10。',
    mistakeTags: []
  },
  {
    id: 's5-slope-06',
    topic: 's5-slope',
    kind: 'slope',
    difficulty: 'challenge',
    prompt: 'A(1, 2)、B(1, 5) 的直線斜率如何？',
    choices: ['不存在', '0', '3', '−3'],
    answer: '不存在',
    explanation: '兩點 x 坐標相同，直線為垂直線，斜率不存在。',
    mistakeTags: ['slope-angle-confusion']
  },
  {
    id: 's5-form-06',
    topic: 's5-line-forms',
    kind: 'line-equation',
    difficulty: 'challenge',
    prompt: '直線在 x 軸截距為 2、y 軸截距為 4，其斜截式是？',
    choices: ['y = −2x + 4', 'y = 2x + 4', 'y = 4x + 2', 'y = −4x + 2'],
    answer: 'y = −2x + 4',
    explanation: '直線過 (2, 0) 與 (0, 4)，斜率 = (4 − 0)/(0 − 2) = −2。',
    mistakeTags: ['intercept-sign']
  },
  {
    id: 's5-relation-06',
    topic: 's5-line-relations',
    kind: 'line-relation',
    difficulty: 'challenge',
    prompt: 'y = 3x − 1 與 y = −x + 3 的交點是？',
    choices: ['(1, 2)', '(2, 1)', '(1, −2)', '(3, 0)'],
    answer: '(1, 2)',
    explanation: '令 3x − 1 = −x + 3，得 x = 1、y = 2。',
    mistakeTags: []
  },
  {
    id: 's5-distance-06',
    topic: 's5-distance-normal',
    kind: 'distance',
    difficulty: 'challenge',
    prompt: '原點到直線 y = x 的距離是多少？',
    choices: ['0', '1', '√2', '1/√2'],
    answer: '0',
    explanation: '原點 (0, 0) 在直線 y = x 上，所以距離為 0。',
    mistakeTags: ['distance-absolute-value']
  },
  {
    id: 's5-family-06',
    topic: 's5-line-family',
    kind: 'line-equation',
    difficulty: 'challenge',
    prompt: '平行直線系 2x + 3y + λ = 0 經過 (1, 1) 時，λ = ?',
    choices: ['−5', '5', '−1', '1'],
    answer: '−5',
    explanation: '代入 (1, 1) 得 2 + 3 + λ = 0，所以 λ = −5。',
    mistakeTags: ['parallel-perpendicular-condition']
  }
];

export const s5QuizQuestionIds = [
  's5-directed-01',
  's5-section-02',
  's5-area-01',
  's5-slope-01',
  's5-slope-04',
  's5-form-01',
  's5-form-03',
  's5-relation-01',
  's5-relation-04',
  's5-distance-01',
  's5-distance-03',
  's5-family-02'
];

export function s5QuizQuestions(): QuizQuestion[] {
  return s5QuizQuestionIds
    .map((id) => s5Questions.find((question) => question.id === id))
    .filter((question): question is QuizQuestion => Boolean(question));
}

export function s5QuestionsForTopic(topic: S5QuizTopic): QuizQuestion[] {
  return s5Questions.filter((question) => question.topic === topic);
}
