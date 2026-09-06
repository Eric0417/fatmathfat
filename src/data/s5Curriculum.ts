import type { Lesson } from '../types';

export const s5Lessons: Lesson[] = [
  {
    id: 's5-directed-segment',
    gradeLevel: 'S5',
    order: 1,
    title: '有向線段與兩點距離',
    shortTitle: '有向線段',
    summary: '先認識有向線段的數量與長度，再用坐標差求兩點距離。',
    definition:
      '規定起點與終點的線段稱為有向線段。它在數軸上的數量是終點坐標減起點坐標，長度則取這個差值的絕對值。',
    examples: [
      {
        title: '數軸上的有向線段',
        statement: '若 P₁ 的坐標是 x₁、P₂ 的坐標是 x₂，則 P₁P₂ = x₂ − x₁。',
        explanation:
          '有向線段由起點到終點的方向決定正負；長度不考慮方向，因此 |P₁P₂| = |x₂ − x₁|。'
      },
      {
        title: '反向線段',
        statement: '同一條線段，AB 與 BA 的數量互為相反數。',
        explanation:
          '起點與終點對調會改變方向，所以 AB + BA = 0；但兩者的長度相等。'
      },
      {
        title: '三角形邊長應用',
        statement: 'A(12, 0)、B(9, √30)、C(−1, 0)，可用距離公式檢查三角形的形狀。',
        explanation:
          '先求三邊長，再檢查是否符合畢氏定理；距離公式的結果要取非負平方根。'
      }
    ],
    explanation:
      '有向線段的重點是方向與長度分開處理。數量可以為正、負或零；兩點距離一定是非負數。坐標差的正負號不能因為平方而隨意丟掉。',
    detailedNotes: [
      'P₁P₂ 表示從 P₁ 到 P₂ 的有向線段，順序很重要。',
      '兩點距離 d = √((x₂ − x₁)² + (y₂ − y₁)²)。',
      '兩點重合時距離為 0，但兩條方向相反的線段仍可互為相反數。',
      '解含絕對值的距離問題時，通常要討論正負兩種情況。',
      '有向線段的概念是後續定比分點與直線方向判斷的基礎。'
    ],
    keyPoints: [
      '數量看起終點方向',
      '長度一定非負',
      'AB = −BA',
      '距離公式取平方根'
    ],
    color: 'navy',
    commonMistakes: [
      '把 AB 與 BA 的數量寫成相同，忽略方向造成的正負號。',
      '距離公式漏加平方或忘記取平方根，把有向線段與長度混用。'
    ],
    practiceTopic: 's5-directed-segment'
  },
  {
    id: 's5-section-point',
    gradeLevel: 'S5',
    order: 2,
    title: '定比分點、中點與重心',
    shortTitle: '定比分點',
    summary: '用比例 λ 求內分點與外分點，並延伸出中點與重心公式。',
    definition:
      '點 P 分有向線段 P₁P₂ 的比為 λ 時，P 的坐標是 ((x₁ + λx₂)/(1 + λ), (y₁ + λy₂)/(1 + λ))，其中 λ ≠ −1。',
    examples: [
      {
        title: '內分點',
        statement: 'P₁(−1, −6)、P₂(3, 0)，若 P 分 P₁P₂ 的比為 λ，可用公式求 P。',
        explanation:
          'P 在線段內部時 λ > 0；把起點、終點與比例代入同一個線性組合公式即可。'
      },
      {
        title: '中點',
        statement: 'λ = 1 時，P = ((x₁ + x₂)/2, (y₁ + y₂)/2)。',
        explanation:
          '中點是定比分點的特例，表示 P 到兩端點的有向線段比為 1。'
      },
      {
        title: '三角形重心',
        statement: '三個頂點坐標的平均值就是重心坐標。',
        explanation:
          '重心是三個頂點坐標的算術平均，也對應中線的 2:1 內分關係。'
      }
    ],
    explanation:
      '定比分點公式同時處理內分與外分。λ 的符號表示方向；λ = −1 時線段兩端的有向數量無法形成有限比值，因此公式不適用。',
    detailedNotes: [
      'λ > 0 表示 P 是 P₁P₂ 的內分點。',
      'λ < 0 且 λ ≠ −1 表示 P 是 P₁P₂ 的外分點。',
      '中點是 λ = 1 的特例，三個頂點坐標平均得到重心。',
      '公式對 x、y 座標分別線性組合，先確認起點與終點再代入。',
      '內心坐標可用邊長 a、b、c 對頂點坐標加權；這與普通中點公式不同。'
    ],
    keyPoints: [
      'λ > 0 為內分',
      'λ < 0 為外分',
      'λ = −1 無意義',
      '中點與重心是特例'
    ],
    color: 'blue',
    commonMistakes: [
      '把 P₁P₂ 與 P₂P₁ 的比值順序寫反，導致公式中的 λ 用錯方向。',
      '以為 λ = −1 只是一個普通的負比例，忽略分母為零的問題。'
    ],
    practiceTopic: 's5-section-point'
  },
  {
    id: 's5-polygon-area',
    gradeLevel: 'S5',
    order: 3,
    title: '直線形面積',
    shortTitle: '直線形面積',
    summary: '用行列式求三角形面積，再把多邊形切成三角形處理。',
    definition:
      '由 A(x₁, y₁)、B(x₂, y₂)、C(x₃, y₃) 形成的三角形面積等於 |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)| / 2。',
    examples: [
      {
        title: '三角形面積',
        statement: 'A(−3, −2)、B(2, 3)、C(1, 4) 的面積可用三點行列式一次求出。',
        explanation:
          '把三個頂點坐標代入公式，先算括號內的差，再取絕對值的一半。'
      },
      {
        title: '三點共線',
        statement: '三點共線時，行列式的值為 0，面積也為 0。',
        explanation:
          '面積公式也可以反向用來判斷共線；結果為零代表無法形成三角形。'
      },
      {
        title: '多邊形分割',
        statement: '五邊形可分割成若干個三角形後分別求面積再相加。',
        explanation:
          '多邊形頂點順序複雜時，先畫圖並選擇不相交的對角線分割，避免重複或漏算。'
      }
    ],
    explanation:
      '三角形面積公式來自二階行列式的幾何意義。絕對值確保面積非負；若只是判斷三點是否共線，重點是括號內數值是否為 0。',
    detailedNotes: [
      '三角形面積公式適合已知三個頂點坐標的題目。',
      '行列式結果為 0 表示三點共線或兩點重合。',
      '多邊形可分割為三角形，但分割線不能互相重疊。',
      '帶有絕對值的面積問題通常需要先求未取絕對值的值，再依題目條件選取。',
      '直線形面積是後續直線與坐標軸圍成圖形的基礎。'
    ],
    keyPoints: [
      '面積取絕對值的一半',
      '三點共線時面積為 0',
      '多邊形先分割',
      '頂點順序要一致'
    ],
    color: 'green',
    commonMistakes: [
      '三角形面積公式只取一半卻漏掉絕對值，得到負面積。',
      '分割多邊形時對角線重疊，造成同一塊區域重複計算。'
    ],
    practiceTopic: 's5-polygon-area'
  },
  {
    id: 's5-slope',
    gradeLevel: 'S5',
    order: 4,
    title: '傾斜角與斜率',
    shortTitle: '傾斜角與斜率',
    summary: '用正切連結直線的傾斜角與斜率，並處理垂直線沒有斜率的特例。',
    definition:
      '直線的傾斜角 α 是 x 軸依逆時針方向轉到直線的最小正角，範圍為 0 ≤ α < π；斜率 k = tan α。',
    examples: [
      {
        title: '兩點求斜率',
        statement: 'A(−1, 3)、B(√3, −√3) 的斜率為 (y₂ − y₁)/(x₂ − x₁)。',
        explanation:
          '先算縱坐標差與橫坐標差，再相除；分母為零時斜率不存在。'
      },
      {
        title: '斜率的正負',
        statement: 'k > 0 時傾斜角是銳角，k < 0 時傾斜角是鈍角。',
        explanation:
          '正切函數在 0 到 π 的範圍內，銳角為正、鈍角為負，因此斜率符號直接反映傾斜方向。'
      },
      {
        title: '三點共線',
        statement: 'A、B、C 三點共線，可用任意兩點算出的斜率相等來證明。',
        explanation:
          '同一條直線的斜率唯一；比較 AB 與 BC 的斜率即可，不必重複列出所有組合。'
      }
    ],
    explanation:
      '斜率描述直線相對於 x 軸的傾斜程度，但不是每一條直線都有斜率。與 x 軸垂直的直線傾斜角為 90°，正切未定義，因此只能寫成 x = 常數。',
    detailedNotes: [
      '傾斜角範圍固定為 [0°, 180°)。',
      '斜率公式要求兩點橫坐標不同。',
      'tan α 在 90° 無定義，垂直線沒有斜率。',
      '水平線的斜率為 0，傾斜角為 0。',
      '由斜率反求傾斜角時，要依斜率正負放在正確象限。'
    ],
    keyPoints: [
      'k = tan α',
      '垂直線斜率不存在',
      '水平線 k = 0',
      '共線可由等斜率判斷'
    ],
    color: 'orange',
    commonMistakes: [
      '把斜率與傾斜角當成可以直接互相代入，未考慮 tan 的週期與 90°。',
      '兩點求斜率時分子分母順序不一致，造成正負號相反。'
    ],
    practiceTopic: 's5-slope',
    interactive: 'line-lab'
  },
  {
    id: 's5-line-forms',
    gradeLevel: 'S5',
    order: 5,
    title: '直線方程的五種形式',
    shortTitle: '直線方程',
    summary: '從點斜式出發，認識斜截式、兩點式、截距式與一般式。',
    definition:
      '點斜式為 y − y₁ = k(x − x₁)；一般式為 Ax + By + C = 0，其中 A、B 不同時為 0。',
    examples: [
      {
        title: '點斜式與斜截式',
        statement: '已知斜率 k 與一點 P(x₁, y₁)，可寫 y − y₁ = k(x − x₁)。',
        explanation:
          '把已知點代入後展開，可得到斜截式 y = kx + b；b 是直線在 y 軸上的截距。'
      },
      {
        title: '兩點式與截距式',
        statement: '已知兩點可先求斜率；已知 x、y 截距可用 x/a + y/b = 1。',
        explanation:
          '不同已知條件適合不同形式；截距式要求 a、b 均不為 0。'
      },
      {
        title: '一般式',
        statement: 'Ax + By + C = 0 可以表示水平線、斜線與垂直線。',
        explanation:
          'B = 0 且 A ≠ 0 時是垂直線；B ≠ 0 時可化為斜截式。'
      }
    ],
    explanation:
      '直線的五種形式只是同一對象的不同寫法。解題時先看已知的是斜率、點、截距還是兩點，再選最直接的形式；最後常化為一般式比較。',
    detailedNotes: [
      '點斜式需要已知一點與斜率，垂直線斜率不存在時改用 x = x₁。',
      '斜截式的 b 是 y 截距，不是線段長度。',
      '兩點式只適用於兩點橫坐標不同的情況。',
      '截距式要求 a、b 不為 0，且截距可正、可負、可零。',
      '一般式的 A、B 不同時為 0，可涵蓋所有直線。'
    ],
    keyPoints: [
      '點斜式最常用',
      '斜截式看 y 截距',
      '兩點式先求斜率',
      '一般式涵蓋垂直線'
    ],
    color: 'teal',
    commonMistakes: [
      '使用截距式時未檢查 a 或 b 是否為 0，導致分母無意義。',
      '把 x 截距與 y 截距位置互換，寫錯截距式。'
    ],
    practiceTopic: 's5-line-forms',
    interactive: 'line-lab'
  },
  {
    id: 's5-line-relations',
    gradeLevel: 'S5',
    order: 6,
    title: '兩直線的位置與夾角',
    shortTitle: '兩線位置',
    summary: '用斜率與一般式係數判斷平行、相交、垂直與重合，再求夾角。',
    definition:
      '兩直線 l₁: A₁x + B₁y + C₁ = 0、l₂: A₂x + B₂y + C₂ = 0；平行條件為 A₁B₂ − A₂B₁ = 0，垂直條件為 A₁A₂ + B₁B₂ = 0。',
    examples: [
      {
        title: '平行與重合',
        statement: '兩線斜率相等時平行；若 y 截距也相等，則兩線重合。',
        explanation:
          '斜率只能判斷方向；是否重合還要比較截距或一般式中的常數比例。'
      },
      {
        title: '垂直',
        statement: '兩條有斜率的直線垂直時 k₁k₂ = −1。',
        explanation:
          '若其中一條是垂直線，另一條必須是水平線；不能直接套用斜率相乘。'
      },
      {
        title: '兩線夾角',
        statement: 'tan θ = |(k₂ − k₁)/(1 + k₁k₂)|，分母為零對應垂直。',
        explanation:
          '公式給出銳角；要先檢查平行、重合與垂直，再代入一般情況。'
      }
    ],
    explanation:
      '兩線位置關係要先看方向，再看常數。斜率法直觀，但垂直線要特別處理；一般式係數條件則可以統一涵蓋所有情況。',
    detailedNotes: [
      '相交條件是 A₁B₂ − A₂B₁ ≠ 0。',
      '平行條件是 A₁B₂ − A₂B₁ = 0。',
      '重合除了方向相同，還要對應常數比例相同。',
      '垂直條件是 A₁A₂ + B₁B₂ = 0。',
      '夾角公式中的分母為 0 時，兩線互相垂直。'
    ],
    keyPoints: [
      '平行看係數行列式',
      '垂直看係數點積',
      '重合再比常數',
      '夾角公式先判特例'
    ],
    color: 'red',
    commonMistakes: [
      '只用斜率相等判斷重合，忽略 y 截距不同時其實是平行。',
      '有垂直線時仍直接套 k₁k₂ = −1，忽略斜率不存在。'
    ],
    practiceTopic: 's5-line-relations',
    interactive: 'line-lab'
  },
  {
    id: 's5-distance-normal',
    gradeLevel: 'S5',
    order: 7,
    title: '點線距離與法線式',
    shortTitle: '點線距離',
    summary: '用一般式求點到直線的距離，並認識法線式與平行線距離。',
    definition:
      '點 P(x₀, y₀) 到直線 Ax + By + C = 0 的距離為 |Ax₀ + By₀ + C| / √(A² + B²)。',
    examples: [
      {
        title: '點到直線距離',
        statement: 'P(−3, −1) 到直線 2x + 4y − 3 = 0 的距離可直接代入公式。',
        explanation:
          '先算代入一般式左邊的值，取絕對值後除以 √(A² + B²)。'
      },
      {
        title: '平行線距離',
        statement: '兩平行線 Ax + By + C₁ = 0 與 Ax + By + C₂ = 0 的距離是 |C₁ − C₂| / √(A² + B²)。',
        explanation:
          '兩平行線距離可任取其中一線上的點，再求它到另一線的距離。'
      },
      {
        title: '法線式',
        statement: 'x cos ω + y sin ω − p = 0，其中 p ≥ 0。',
        explanation:
          '法線式把直線表示成離原點距離為 p、法線方向角為 ω 的直線，適合處理有向距離與符號問題。'
      }
    ],
    explanation:
      '距離公式的分子必須取絕對值；法線式則把正負號留給方向。化一般式為法線式時，要先除以 √(A² + B²)，並依 C 或 y 係數選擇正負號。',
    detailedNotes: [
      '距離公式分母是 √(A² + B²)，不是 √(A + B)。',
      '分子代入後要取絕對值。',
      '平行線距離要求兩式 A、B 先化成相同係數。',
      '法線式中的 p 規定為非負。',
      '點在直線上時，距離為 0。'
    ],
    keyPoints: [
      '距離公式分子取絕對值',
      '分母是係數平方和的平方根',
      '平行線先統一 A、B',
      '法線式 p ≥ 0'
    ],
    color: 'slate',
    commonMistakes: [
      '距離公式漏掉分子絕對值，得到負距離。',
      '求平行線距離時未先讓 A、B 係數一致，直接相減常數。'
    ],
    practiceTopic: 's5-distance-normal',
    interactive: 'line-lab'
  },
  {
    id: 's5-line-family',
    gradeLevel: 'S5',
    order: 8,
    title: '直線系',
    shortTitle: '直線系',
    summary: '用一個參數描述具有共同方向的直線，或經過同一交點的一族直線。',
    definition:
      '含有可變參數的一組直線，若具有共同方向或共同交點，就稱為直線系。',
    examples: [
      {
        title: '平行直線系',
        statement: '與 Ax + By + C = 0 平行的直線可寫成 Ax + By + λ = 0。',
        explanation:
          'A、B 固定時方向相同；改變 λ 只平移直線。'
      },
      {
        title: '垂直直線系',
        statement: '與 Ax + By + C = 0 垂直的直線可寫成 Bx − Ay + λ = 0。',
        explanation:
          '交換係數並改變一個符號，可得到與原直線垂直的方向。'
      },
      {
        title: '過交點的直線系',
        statement: 'l₁ + λl₂ = 0 表示經過 l₁ 與 l₂ 交點的直線系。',
        explanation:
          '只要交點同時滿足 l₁ = 0 與 l₂ = 0，線性組合也等於 0；此形式不包含 l₂ 本身。'
      }
    ],
    explanation:
      '直線系的參數把無限多條直線壓縮成一個方程。先寫出滿足一個條件的直線系，再用另一個條件求參數，是處理過定點、平行或垂直問題的常用策略。',
    detailedNotes: [
      '平行直線系的 A、B 不變，只有常數 λ 改變。',
      '垂直直線系可由 Bx − Ay + λ = 0 表示。',
      '過交點直線系 l₁ + λl₂ = 0 不包含 l₂。',
      '先求參數的幾何意義，再代入題目給的另一條件。',
      '直線系可與面積、距離或過點條件結合求解。'
    ],
    keyPoints: [
      '平行系固定 A、B',
      '垂直系交換係數',
      '過交點用線性組合',
      '再用第二條件定參數'
    ],
    color: 'navy',
    commonMistakes: [
      '誤以為 l₁ + λl₂ = 0 包含 l₂ 這條直線。',
      '用直線系解題時漏掉斜率不存在的直線。'
    ],
    practiceTopic: 's5-line-family',
    interactive: 'line-lab'
  }
];

export function s5LessonByTopic(id: string): Lesson | undefined {
  return s5Lessons.find((lesson) => lesson.id === id);
}
