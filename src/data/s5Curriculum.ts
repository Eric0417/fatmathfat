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
      '規定起點與終點的線段稱為有向線段。數軸上 P₁P₂ 的數量為 x₂ − x₁，長度為 |x₂ − x₁|；平面上 P₁(x₁, y₁)、P₂(x₂, y₂) 的距離為 √((x₂ − x₁)² + (y₂ − y₁)²)。',
    examples: [
      {
        title: '數軸上的有向線段',
        statement: '若 P₁ 的坐標是 x₁、P₂ 的坐標是 x₂，則 P₁P₂ = x₂ − x₁。',
        steps: [
          '寫出終點坐標減起點坐標。',
          'P₁P₂ = x₂ − x₁，保留正負號。',
          '長度取絕對值：|P₁P₂| = |x₂ − x₁|。'
        ],
        conclusion: '數量包含方向，長度永遠非負。',
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
        steps: [
          'AB² = (9 − 12)² + (√30 − 0)² = 9 + 30 = 39。',
          'BC² = (−1 − 9)² + (0 − √30)² = 100 + 30 = 130。',
          'AC² = (−1 − 12)² + 0² = 169。',
          '因為 AB² + BC² = AC²，所以 ∠ABC = 90°。'
        ],
        conclusion: '三角形 ABC 是以 B 為直角頂的直角三角形。',
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
      '解含絕對值的距離問題時，通常要拆成正、負兩種情況。',
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
    strategies: [
      '先寫「終點坐標 − 起點坐標」，不要憑圖形猜正負。',
      '求長度時把整個差先平方，最後才取平方根。',
      '遇到絕對值條件時拆成正、負兩種情況。'
    ],
    applications: [
      {
        title: '導航位移',
        situation: '從 A 走到 B，往右或往左的距離相同，但位移方向相反。',
        connection: 'AB 是位移，|AB| 是路徑上的直線長度。'
      },
      {
        title: '校正測量資料',
        situation: '同一組點用相反順序記錄時，數值只差一個正負號。',
        connection: 'AB + BA = 0 可檢查資料方向是否寫反。'
      }
    ],
    challenges: [
      {
        title: '方向與長度',
        prompt: '數軸上 A = 2、B = 8，求 AB、BA 與 |AB|。',
        steps: [
          'AB = B − A = 8 − 2。',
          'BA = A − B = 2 − 8。',
          '長度 |AB| = |6|。'
        ],
        solution: 'AB = 8 − 2 = 6；BA = −6；|AB| = 6。'
      }
    ],
    practiceTopic: 's5-directed-segment',
    interactive: 'directed-segment'
  },
  {
    id: 's5-section-point',
    gradeLevel: 'S5',
    order: 2,
    title: '定比分點、中點與重心',
    shortTitle: '定比分點',
    summary: '用比例 λ 求內分點與外分點，並延伸出中點與重心公式。',
    definition:
      '若 λ = P₁P / PP₂，則點 P 分有向線段 P₁P₂ 的比為 λ；P 的坐標是 ((x₁ + λx₂)/(1 + λ), (y₁ + λy₂)/(1 + λ))，其中 λ ≠ −1。',
    examples: [
      {
        title: '內分點',
        statement: 'P₁(−1, −6)、P₂(3, 0)，若 P 分 P₁P₂ 的比為 λ，可用公式求 P。',
        steps: [
          '確認 λ 的定義是 P₁P ÷ PP₂。',
          '把起點 P₁、終點 P₂ 與 λ 分別代入兩個坐標。',
          '內分時 λ > 0；得到 P 後用比例驗證方向。'
        ],
        conclusion: '公式同一套，內分、外分只差 λ 的符號。',
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
      '公式對 x、y 坐標分別線性組合，先確認起點與終點再代入。',
      '內心坐標可用各邊對應的對邊長 a、b、c 對頂點加權，與中點和重心公式不同。'
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
    strategies: [
      '先圈起起點 P₁ 與終點 P₂，再確認 λ 是 P₁P 除以 PP₂。',
      '先判斷內分或外分，內分 λ > 0，外分 λ < 0。',
      '用中點或已知端點反查 λ，避免只背公式。'
    ],
    applications: [
      {
        title: '路線分段',
        situation: '公車站把兩地之間的線段按固定比例分段。',
        connection: '定比分點公式就是「按比例插值」的坐標版。'
      },
      {
        title: '三角形的重心',
        situation: '均勻三角形紙板可用重心支撐保持平衡。',
        connection: '重心是三個頂點坐標的平均值。'
      }
    ],
    challenges: [
      {
        title: '找內分點',
        prompt: 'P₁(2, 3)、P₂(8, 7)，λ = 3，求 P。',
        steps: [
          'x = (2 + 3 × 8) ÷ (1 + 3)。',
          'y = (3 + 3 × 7) ÷ (1 + 3)。',
          '化簡得到 P 的坐標。'
        ],
        solution: 'P = ((2 + 3×8)/4, (3 + 3×7)/4) = (6.5, 6)。'
      }
    ],
    practiceTopic: 's5-section-point',
    interactive: 'section-point'
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
        steps: [
          '把三個頂點按同一方向寫入 x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)。',
          '代入數值：−3(3 − 4) + 2(4 + 2) + 1(−2 − 3)。',
          '計算後取絕對值的一半。'
        ],
        conclusion: '結果為正值，代表實際三角形面積。',
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
      '三角形面積公式可整理成三階行列式或 shoelace formula。絕對值確保面積非負；若只是判斷三點是否共線，重點是括號內數值是否為 0。',
    detailedNotes: [
      '三角形面積公式適合已知三個頂點坐標的題目。',
      '行列式結果為 0 表示三點共線或兩點重合。',
      '多邊形可分割為若干個內部互不重疊、合起來恰好覆蓋原多邊形的三角形。',
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
    strategies: [
      '三個頂點保持一致的環繞順序代入，最後取絕對值的一半。',
      '先算行列式是否為 0，快速判斷共線。',
      '多邊形先畫對角線分割，再逐塊加總。'
    ],
    applications: [
      {
        title: '土地測量',
        situation: '已知多邊形地界的頂點坐標，要估算面積。',
        connection: '把多邊形切成三角形，再用頂點坐標求面積。'
      },
      {
        title: '三個感測點共線',
        situation: '三個資料點是否正好落在同一條直線上。',
        connection: '共線時三角形面積為 0。'
      }
    ],
    challenges: [
      {
        title: '坐標三角形面積',
        prompt: '求 (0, 0)、(6, 0)、(0, 4) 的面積，並用三點公式檢查。',
        steps: [
          '代公式：0×(0 − 4) + 6×(4 − 0) + 0×(0 − 0)。',
          '括號內得 24。',
          '面積 = |24| ÷ 2。'
        ],
        solution: '0 + 24 + 0 = 24，面積 = 12。'
      }
    ],
    practiceTopic: 's5-polygon-area',
    interactive: 'polygon-area'
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
        steps: [
          '先算縱坐標差：−√3 − 3。',
          '再算橫坐標差：√3 − (−1)。',
          '化簡分式並判斷傾斜角所在的象限。'
        ],
        conclusion: '斜率為負，傾斜角是鈍角。',
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
    strategies: [
      '斜率公式固定用 (y₂ − y₁)/(x₂ − x₁)。',
      '垂直線先判 x 坐標是否相等，不要硬除零。',
      '由斜率轉傾斜角時，負斜率要加上 180°。'
    ],
    applications: [
      {
        title: '坡道與樓梯',
        situation: '路面每前進一段水平距離，高度改變多少。',
        connection: '斜率就是「垂直變化 ÷ 水平變化」。'
      },
      {
        title: '價格趨勢線',
        situation: '兩個時間點的價格連線，判斷上升或下降快慢。',
        connection: '正斜率表示上升，負斜率表示下降。'
      }
    ],
    challenges: [
      {
        title: '兩點求斜率',
        prompt: '求 (2, 3) 與 (5, 9) 的斜率。',
        steps: [
          '縱坐標差 = 9 − 3。',
          '橫坐標差 = 5 − 2。',
          '兩者相除得到 k。'
        ],
        solution: 'k = (9 − 3)/(5 − 2) = 2。'
      }
    ],
    practiceTopic: 's5-slope',
    interactive: 'slope'
  },
  {
    id: 's5-line-forms',
    gradeLevel: 'S5',
    order: 5,
    title: '直線方程的五種形式',
    shortTitle: '直線方程',
    summary: '從點斜式出發，認識斜截式、兩點式、截距式與一般式。',
    definition:
      '五種常見形式為：點斜式 y − y₁ = k(x − x₁)、斜截式 y = kx + b、兩點式 (y − y₁)/(y₂ − y₁) = (x − x₁)/(x₂ − x₁)、截距式 x/a + y/b = 1、一般式 Ax + By + C = 0，其中 A、B 不同時為 0。',
    examples: [
      {
        title: '點斜式與斜截式',
        statement: '已知斜率 k 與一點 P(x₁, y₁)，可寫 y − y₁ = k(x − x₁)。',
        steps: [
          '把已知點代入點斜式。',
          '展開括號。',
          '移項成 y = kx + b，讀出 y 截距。'
        ],
        conclusion: '點斜式方便建立直線，斜截式方便讀出斜率與截距。',
        explanation:
          '把已知點代入後展開，可得到斜截式 y = kx + b；b 是直線在 y 軸上的截距。'
      },
      {
        title: '兩點式與截距式',
        statement: '已知兩點可先求斜率；已知 x、y 截距可用 x/a + y/b = 1。',
        steps: [
          '兩點式先由兩點求出斜率。',
          '確認兩點橫坐標不同，避免除以零。',
          '截距式需確認 a、b 都不為零。'
        ],
        conclusion: '每一種形式都有使用條件。',
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
      '截距式要求 a、b 不為 0；截距值本身可正可負，但等於 0 時不能使用此形式。',
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
    strategies: [
      '先圈出已知的是斜率、點、兩點還是截距。',
      '垂直線直接寫 x = x₁，水平線直接寫 y = y₁。',
      '最後化為一般式，檢查係數與截距是否一致。'
    ],
    applications: [
      {
        title: '成本模型',
        situation: '每月固定費用加上每件商品的變動成本。',
        connection: '總成本 = 斜率 × 數量 + 固定截距。'
      },
      {
        title: '道路規格',
        situation: '一條路必須經過指定點，並保持固定坡度。',
        connection: '點斜式直接由已知斜率與定點建立方程。'
      }
    ],
    challenges: [
      {
        title: '由點與斜率建方程',
        prompt: '直線過 (4, 1)，斜率為 −1/2，求斜截式。',
        steps: [
          '寫點斜式：y − 1 = −½(x − 4)。',
          '展開：y − 1 = −½x + 2。',
          '移項得到 y = −½x + 3。'
        ],
        solution: 'y − 1 = −½(x − 4)，化簡為 y = −½x + 3。'
      }
    ],
    practiceTopic: 's5-line-forms',
    interactive: 'line-forms'
  },
  {
    id: 's5-line-relations',
    gradeLevel: 'S5',
    order: 6,
    title: '兩直線的位置與夾角',
    shortTitle: '兩線位置',
    summary: '用斜率與一般式係數判斷平行、相交、垂直與重合，再求夾角。',
    definition:
      '兩直線 l₁: A₁x + B₁y + C₁ = 0、l₂: A₂x + B₂y + C₂ = 0；A₁B₂ − A₂B₁ = 0 表示方向相同，再比較常數即可分出平行或重合；垂直條件為 A₁A₂ + B₁B₂ = 0。',
    examples: [
      {
        title: '平行與重合',
        steps: [
          '先比較兩線斜率，判斷方向是否相同。',
          '方向相同時再比較 y 截距。',
          '截距不同為平行，截距相同為重合。'
        ],
        conclusion: '判斷平行或重合，必須看方向與位置兩個資訊。',
        statement: '兩線斜率相等時方向相同；若 y 截距不同則平行，若 y 截距也相等則重合。',
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
    strategies: [
      '平行先比較方向，再用常數判斷是否重合。',
      '垂直先找特殊直線，再套用 k₁k₂ = −1。',
      '求夾角前先排除平行、重合與垂直。'
    ],
    applications: [
      {
        title: '兩條道路相交',
        situation: '兩條道路交會時，要知道交叉口位置與轉角。',
        connection: '交點由聯立方程求，夾角由斜率差求。'
      },
      {
        title: '鐵軌平行性',
        situation: '兩段鐵軌若方向相同且不重疊，就是平行。',
        connection: '方向相同由 A₁B₂ − A₂B₁ = 0 判斷。'
      }
    ],
    challenges: [
      {
        title: '判斷垂直',
        prompt: '兩線斜率分別為 3 與 −1/3，判斷位置關係。',
        steps: [
          '檢查兩線斜率都存在。',
          '計算 3 × (−1/3)。',
          '乘積為 −1，所以兩線垂直。'
        ],
        solution: '3 × (−1/3) = −1，所以兩線垂直。'
      }
    ],
    practiceTopic: 's5-line-relations',
    interactive: 'line-relations'
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
        steps: [
          '把 P 代入一般式左邊：2(−3) + 4(−1) − 3。',
          '分子取絕對值，分母為 √(2² + 4²)。',
          '化簡根式得到距離。'
        ],
        conclusion: '分子絕對值確保距離不為負。',
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
      '距離公式的分子必須取絕對值；法線式則把正負號留給方向。化一般式為法線式時，先除以 √(A² + B²)：C ≠ 0 時取與 C 相反的符號；C = 0 時選擇使 y 係數非負的符號。',
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
    strategies: [
      '距離公式先寫分母 √(A² + B²)。',
      '分子代入後先取絕對值。',
      '平行線距離前，先把兩式 A、B 化成相同倍數。'
    ],
    applications: [
      {
        title: '行車離線距離',
        situation: 'GPS 要計算車輛偏離規劃路線多遠。',
        connection: '點到直線的距離就是最短路徑。'
      },
      {
        title: '兩條平行軌道',
        situation: '計算兩條平行軌道之間的固定距離。',
        connection: '平行線距離由常數差除以 √(A² + B²)。'
      }
    ],
    challenges: [
      {
        title: '原點到直線距離',
        prompt: '求原點到 6x + 8y − 20 = 0 的距離。',
        steps: [
          '代入原點得 6×0 + 8×0 − 20。',
          '分子取絕對值為 20。',
          '分母為 √(36 + 64)。'
        ],
        solution: '|−20| / √(36 + 64) = 20 / 10 = 2。'
      }
    ],
    practiceTopic: 's5-distance-normal',
    interactive: 'distance-normal'
  },
  {
    id: 's5-line-family',
    gradeLevel: 'S5',
    order: 8,
    title: '直線系',
    shortTitle: '直線系',
    summary: '用一個參數描述具有共同方向的直線，或經過同一交點的一族直線。',
    definition:
      '含有一個可變參數，且整組直線具有某一共同性質時，稱為直線系；最常見的是共同方向、共同交點或共同截距。',
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
        steps: [
          '設交點同時滿足 l₁ = 0 與 l₂ = 0。',
          '線性組合在交點處也等於 0。',
          '檢查 λ 任意變化時，l₂ 本身無法單獨取得。'
        ],
        conclusion: '此形式保留 l₁，不包含 l₂，但可表示過交點的其他直線。',
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
    strategies: [
      '先寫出滿足方向或過點條件的直線系。',
      '再用距離、面積或另一點求出 λ。',
      '檢查特例：垂直線是否已由其他形式涵蓋。'
    ],
    applications: [
      {
        title: '道路網規劃',
        situation: '設計所有通過同一個路口的道路。',
        connection: '過交點的直線系可一次描述這些道路。'
      },
      {
        title: '平行路段家族',
        situation: '不同車道維持相同方向，只差偏移距離。',
        connection: 'Ax + By + λ = 0 是平行直線系。'
      }
    ],
    challenges: [
      {
        title: '過交點且水平',
        prompt: '以 l₁ = x + y − 1、l₂ = x − y + 1，寫出過交點 (0, 1) 的直線系，再求水平線對應的 λ。',
        steps: [
          '寫直線系 l₁ + λl₂ = 0。',
          '合併 x 與 y 項：(1 + λ)x + (1 − λ)y + (−1 + λ) = 0。',
          '水平線要求 x 係數為 0，所以 1 + λ = 0，得 λ = −1。'
        ],
        solution: 'λ = −1，代入得 2y − 2 = 0，即 y = 1。'
      }
    ],
    practiceTopic: 's5-line-family',
    interactive: 'line-family'
  }
];

export function s5LessonByTopic(id: string): Lesson | undefined {
  return s5Lessons.find((lesson) => lesson.id === id);
}
