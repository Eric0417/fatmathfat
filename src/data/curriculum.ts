import type { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'set',
    order: 1,
    title: '什麼是集合？',
    shortTitle: '集合',
    summary: '先學會用明確的條件把物件分類成一個整體。',
    definition:
      '集合是由一些可以明確判斷是否屬於其中的物件所組成的整體。集合中的每一個物件稱為元素。',
    example: '小於 5 的正整數，可以形成集合 {1, 2, 3, 4}。',
    explanation:
      '"漂亮的數字"沒有清楚一致的判斷標準，因此不適合當作集合；"大於 0 的偶數"則是明確條件。',
    keyPoints: ['元素不重複計算', '元素沒有順序', '判斷標準必須明確'],
    color: 'blue',
    commonMistake:
      '常見錯誤：把「看起來像集合的敘述」直接當作集合。要先確認是否有明確條件，並能清楚判斷每個物件是否屬於它。',
    practiceTopic: 'set-and-element',
    setA: [2, 4, 8],
    universe: [-3, -1, 0, 1, 2, 4, 5, 8]
  },
  {
    id: 'membership',
    order: 2,
    title: '元素與集合的關係',
    shortTitle: '屬於',
    summary: '區分元素屬於集合，與集合被另一個集合包含。',
    definition:
      '若元素 a 是集合 A 中的元素，記作 a ∈ A；若 a 不在 A 中，記作 a ∉ A。',
    example: '若 A = {1, 2, 3}，則 2 ∈ A，4 ∉ A。',
    explanation:
      '2 ∈ A 表示元素關係；{2} ⊆ A 表示集合包含關係。不要只因為看到大括號就認為兩者相同。',
    keyPoints: ['∈ 比較的是元素與集合', '⊆ 比較的是集合與集合', '{1} 是一個集合'],
    color: 'orange',
    commonMistake:
      '常見錯誤：把 {2} ∈ A 當成正確寫法。∈ 的左右兩邊必須分別是「元素」與「集合」，而 {2} 本身是集合。',
    practiceTopic: 'membership',
    setA: [1, 2, 3],
    universe: [1, 2, 3, 4]
  },
  {
    id: 'representation',
    order: 3,
    title: '集合的三種表示法',
    shortTitle: '表示法',
    summary: '同一個集合可以列出元素、寫出條件，或畫成圖形。',
    definition:
      '列舉法直接列出元素；描述法寫出共同條件；圖示法用圓圈或文氏圖表示集合與元素的關係。',
    example: '{2, 4, 6, 8} = {x | x 是小於 10 的正偶數}。',
    explanation:
      '條件描述法中的"|"與"："在這裡都表示分隔條件，但不代表兩個集合不同。',
    keyPoints: ['列舉法適合有限集合', '描述法適合規則清楚的集合', '圖示法幫助觀察關係'],
    color: 'green',
    commonMistake:
      '常見錯誤：只記住集合的樣子，卻沒有注意到描述法必須先確認論域或明確條件。例如「大於 5 的數」若沒有限定數系，就會不夠清楚。',
    practiceTopic: 'representation',
    setA: [2, 4, 6, 8],
    universe: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 'empty-set',
    order: 4,
    title: '空集合與集合個數',
    shortTitle: '空集合',
    summary: '認識 ∅、有限集合，以及 n(A) 表示元素個數。',
    definition:
      '不含任何元素的集合稱為空集合，記作 ∅ 或 { }。含有有限個元素的集合稱為有限集合。',
    example: 'A = {1, 2, 3, 4} 是有限集合，n(A) = 4；∅ 沒有元素，n(∅) = 0。',
    explanation:
      '∅ 與 {∅} 不同：∅ 沒有元素，{∅} 有一個元素，而這個元素是空集合。',
    keyPoints: ['n(A) 表示 A 的元素個數', '∅ 與 {∅} 不是同一個集合', '有些教材也會寫 |A|'],
    color: 'red',
    commonMistake:
      '常見錯誤：把 ∅ 與 {∅} 看成同一個集合。∅ 沒有元素；{∅} 裡有一個元素，就是空集合本身。',
    practiceTopic: 'empty-set',
    setA: [],
    universe: []
  },
  {
    id: 'subset',
    order: 5,
    title: '子集合、真子集合與相等',
    shortTitle: '子集合',
    summary: '逐一檢查元素，分辨 ⊆、⊊ 與 =。',
    definition:
      '若 A 的每一個元素都屬於 B，則 A ⊆ B。若 A ⊆ B 且 A ≠ B，則 A ⊊ B。',
    example: 'A = {1, 2}，B = {1, 2, 3}，所以 A ⊆ B 且 A ⊊ B。',
    explanation:
      '本網站統一使用 ⊆ 表示子集合、⊊ 表示真子集合。有些教材使用 A ⊂ B 表示包含相等，因此網站在題目旁會同時標註 A ⊂ B 是 A ⊆ B 的同義表示。',
    keyPoints: ['檢查 A 的每個元素', 'A ⊆ B 可與 A = B 同時成立', '真子集合一定不相等'],
    color: 'teal',
    commonMistake:
      '常見錯誤：以為 ⊆ 一定表示 A 比 B 少一個元素。其實 A ⊆ B 可以同時 A = B；要強調「不相等」時才用 ⊊。',
    practiceTopic: 'subset',
    setA: [1, 2],
    setB: [1, 2, 3],
    universe: [1, 2, 3]
  },
  {
    id: 'operations',
    order: 6,
    title: '交集、聯集與差集',
    shortTitle: '集合運算',
    summary: 'A ∩ B、A ∪ B、A − B 分別從兩個集合取出不同的部分。',
    definition:
      '交集取同時屬於 A 和 B 的元素；聯集取屬於 A 或 B 的所有不同元素；差集取屬於 A 但不屬於 B 的元素。',
    example:
      'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}，則 A ∩ B = {3, 4}，A ∪ B = {1, 2, 3, 4, 5, 6}，A − B = {1, 2}。',
    explanation:
      '聯集中的"或"包含兩者都符合的情況，所以 3 和 4 不能漏掉。差集有方向，A − B 通常不等於 B − A。',
    keyPoints: ['交集找共同元素', '聯集不能重複列出', '差集注意方向'],
    color: 'navy',
    commonMistake:
      '常見錯誤：把交集與聯集寫反，或把 A − B 直接改成 B − A。交集只留共同元素；聯集要包含所有出現過的不同元素；差集方向不能隨意交換。',
    practiceTopic: 'intersection-union',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    universe: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 'complement',
    order: 7,
    title: '全集與補集',
    shortTitle: '補集',
    summary: '補集必須從指定的全集中取出不在 A 裡面的元素。',
    definition:
      '若 U 是討論範圍中的全集（宇集），Aᶜ 表示 U 中所有不屬於 A 的元素，也稱為 A 的補集（餘集）。',
    example:
      '若 U = {1, 2, 3, 4, 5, 6, 7, 8}，A = {1, 2, 3, 4}，則 Aᶜ = {5, 6, 7, 8}。',
    explanation:
      '沒有指定全集（宇集）時，補集（餘集）通常無法唯一決定。部分教材也會使用 A′、A^c 或 Ā；本網站主要使用 Aᶜ，並在符號旁附中文解釋。切換 U 可以觀察同一個 A 的補集發生變化。',
    keyPoints: ['補集有相對性', '先確定 U 有哪些元素', 'Aᶜ 與 U 有關'],
    color: 'slate',
    commonMistake:
      '常見錯誤：沒有先看 U 就直接求補集。補集是「U 中不屬於 A 的元素」，U 改變時，同樣的 A 也會得到不同的補集。',
    practiceTopic: 'complement',
    setA: [1, 2, 3, 4],
    universe: [1, 2, 3, 4, 5, 6, 7, 8]
  }
];

export function lessonByTopic(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
