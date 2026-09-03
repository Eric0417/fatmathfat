import type {
  QuestionDifficulty,
  QuestionKind,
  QuizQuestion,
  QuizTopic
} from '../types';

export const topicLabels: Record<QuizTopic, string> = {
  'set-and-element': '集合與元素',
  membership: '元素關係',
  representation: '集合表示法',
  'empty-set': '空集合與個數',
  subset: '子集合與相等',
  'intersection-union': '交集與聯集',
  difference: '差集',
  complement: '補集'
};

export const difficultyLabels: Record<QuestionDifficulty, string> = {
  basic: '基礎',
  standard: '普通',
  challenge: '挑戰'
};

export const questionKindLabels: Record<QuestionKind, string> = {
  membership: '判斷元素關係',
  equality: '判斷集合相等',
  subset: '判斷子集合',
  intersection: '求交集',
  union: '求聯集',
  difference: '求差集',
  complement: '求補集',
  enumeration: '列舉法',
  'set-builder': '描述法',
  cardinality: '集合個數',
  'empty-set': '空集合',
  venn: 'Venn 圖'
};

export const questions: QuizQuestion[] = [
  {
    id: 'set-01',
    topic: 'set-and-element',
    kind: 'enumeration',
    difficulty: 'basic',
    prompt: '「小於 5 的正整數」可以表示為哪一個集合？',
    choices: ['{1, 2, 3, 4}', '{0, 1, 2, 3, 4}', '{1, 2, 3, 4, 5}', '∅'],
    answer: '{1, 2, 3, 4}',
    explanation: '正整數從 1 開始，小於 5 的正整數是 1、2、3、4。',
    hint: '先確認「正整數」是否包含 0 或 5。',
    mistakeTags: []
  },
  {
    id: 'set-02',
    topic: 'set-and-element',
    kind: 'membership',
    difficulty: 'basic',
    prompt: '「看起來很漂亮的數」可以形成一個集合。',
    choices: ['正確', '錯誤'],
    answer: '錯誤',
    explanation: '「漂亮」沒有明確、一致的判斷標準，因此不能清楚判斷哪些數屬於這個整體。',
    hint: '集合需要「明確條件」。',
    mistakeTags: []
  },
  {
    id: 'set-03',
    topic: 'set-and-element',
    kind: 'membership',
    difficulty: 'basic',
    prompt: '若 A = {1, 2, 3}，判斷「2 ∈ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '2 是 A 中的元素，所以 2 ∈ A。',
    mistakeTags: []
  },
  {
    id: 'set-04',
    topic: 'set-and-element',
    kind: 'membership',
    difficulty: 'basic',
    prompt: '若 A = {1, 2, 3}，判斷「5 ∈ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '錯誤',
    explanation: '5 不在 A 中，應記作 5 ∉ A。',
    mistakeTags: []
  },
  {
    id: 'set-05',
    topic: 'set-and-element',
    kind: 'enumeration',
    difficulty: 'standard',
    prompt: '集合 {2, 2, 3} 可以改寫成 {2, 3}。',
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '集合中的元素不重複計算，因此 {2, 2, 3} 與 {2, 3} 表示同一個集合。',
    hint: '回想集合元素是否會重複列出。',
    mistakeTags: ['duplicate-elements']
  },
  {
    id: 'membership-01',
    topic: 'membership',
    kind: 'membership',
    difficulty: 'basic',
    prompt: '若 A = {1, 2, 3}，判斷「{1} ∈ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '錯誤',
    explanation: '{1} 是一個集合，不是元素。應寫成 {1} ⊆ A，而不是 {1} ∈ A。',
    mistakeTags: ['element-vs-subset']
  },
  {
    id: 'membership-02',
    topic: 'membership',
    kind: 'subset',
    difficulty: 'basic',
    prompt: '若 A = {1, 2, 3}，判斷「{1} ⊆ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '{1} 是集合，且它的唯一元素 1 屬於 A，因此 {1} ⊆ A。',
    mistakeTags: ['element-vs-subset']
  },
  {
    id: 'membership-03',
    topic: 'membership',
    kind: 'membership',
    difficulty: 'standard',
    prompt: '若 A = {1, 2, 3}，下列哪一個表示法正確？',
    setA: [1, 2, 3],
    choices: ['1 ∈ A', '{1} ∈ A', '1 ⊆ A', '{1} ∉ A'],
    answer: '1 ∈ A',
    explanation: '1 是 A 的元素，所以使用 ∈；{1} 是集合，若要表示包含關係應使用 ⊆。',
    mistakeTags: ['element-vs-subset']
  },
  {
    id: 'membership-04',
    topic: 'membership',
    kind: 'subset',
    difficulty: 'standard',
    prompt: '若 A = {1, 2, 3}，判斷「{1, 2} ⊆ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '{1, 2} 的每個元素都在 A 中，因此 {1, 2} ⊆ A。',
    hint: '檢查集合中的每個元素是否都在 A 中。',
    mistakeTags: ['element-vs-subset']
  },
  {
    id: 'membership-05',
    topic: 'membership',
    kind: 'membership',
    difficulty: 'challenge',
    prompt: '若 A = {1, 2, 3}，則「2 ∈ A」與「{2} ⊆ A」都正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '2 是 A 的元素；{2} 是只含 2 的集合，它的元素也都在 A 中。',
    mistakeTags: ['element-vs-subset']
  },
  {
    id: 'representation-01',
    topic: 'representation',
    kind: 'set-builder',
    difficulty: 'basic',
    prompt: '下列哪一個描述法與 {1, 2, 3, 4} 相同？',
    choices: [
      '{x | x 是正整數且 x < 5}',
      '{x | x 是正整數且 x < 3}',
      '{x | x 是整數且 x < 5}',
      '{x | x 是偶數且 x ≤ 4}'
    ],
    answer: '{x | x 是正整數且 x < 5}',
    explanation: '正整數 1、2、3、4 都符合 x < 5；其他條件會漏掉或加入不屬於 A 的元素。',
    hint: '注意條件是否包含邊界值。',
    mistakeTags: []
  },
  {
    id: 'representation-02',
    topic: 'representation',
    kind: 'set-builder',
    difficulty: 'basic',
    prompt: '「{x | x 是小於 10 的正偶數}」等於 {2, 4, 6, 8}。',
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '正偶數且小於 10，正是 2、4、6、8。',
    mistakeTags: []
  },
  {
    id: 'representation-03',
    topic: 'representation',
    kind: 'enumeration',
    difficulty: 'standard',
    prompt: '下列哪一個是列舉法？',
    choices: ['{1, 2, 3}', '{x | x 是正整數且 x < 4}', 'A ∩ B', 'n(A) = 3'],
    answer: '{1, 2, 3}',
    explanation: '列舉法直接把集合中的元素一一列出；描述法則會使用條件表示。',
    mistakeTags: []
  },
  {
    id: 'representation-04',
    topic: 'representation',
    kind: 'set-builder',
    difficulty: 'standard',
    prompt: '若 A = {1, 2, 3, 4}，下列哪一個描述法最適合？',
    setA: [1, 2, 3, 4],
    choices: [
      '{x | x 是正整數且 x ≤ 4}',
      '{x | x 是正整數且 x < 4}',
      '{x | x 是整數且 x < 4}',
      '{x | x 是偶數且 x < 4}'
    ],
    answer: '{x | x 是正整數且 x ≤ 4}',
    explanation: 'A 包含 1 到 4，正整數且 x ≤ 4 是最直接的描述法。',
    mistakeTags: []
  },
  {
    id: 'representation-05',
    topic: 'representation',
    kind: 'equality',
    difficulty: 'basic',
    prompt: '{2, 4, 6} 與 {6, 2, 4} 是相同的集合。',
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '集合不考慮元素順序，兩者含有完全相同的元素。',
    mistakeTags: ['proper-subset-confusion']
  },
  {
    id: 'empty-set-01',
    topic: 'empty-set',
    kind: 'cardinality',
    difficulty: 'basic',
    prompt: '∅ 的元素個數是多少？',
    choices: ['0', '1', '沒有定義', '無限多'],
    answer: '0',
    explanation: '∅ 是空集合，沒有任何元素，所以 n(∅) = 0。',
    mistakeTags: ['empty-set-confusion']
  },
  {
    id: 'empty-set-02',
    topic: 'empty-set',
    kind: 'cardinality',
    difficulty: 'standard',
    prompt: '{∅} 有幾個元素？',
    choices: ['0 個', '1 個', '2 個', '無法判斷'],
    answer: '1 個',
    explanation: '{∅} 裡有一個元素，這個元素是空集合本身。',
    hint: '注意大括號內裝的是什麼。',
    mistakeTags: ['empty-set-confusion']
  },
  {
    id: 'empty-set-03',
    topic: 'empty-set',
    kind: 'subset',
    difficulty: 'standard',
    prompt: '判斷「∅ ⊆ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '空集合沒有任何元素，因此它的每一個元素都「符合」屬於 A 的條件，所以 ∅ ⊆ A。',
    hint: '回想「沒有元素」時，子集合條件是否還成立。',
    mistakeTags: ['empty-set-confusion']
  },
  {
    id: 'empty-set-04',
    topic: 'empty-set',
    kind: 'empty-set',
    difficulty: 'basic',
    prompt: '∅ 與 { } 表示同一個集合。',
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '{ } 與 ∅ 都是沒有元素的空集合。',
    mistakeTags: ['empty-set-confusion']
  },
  {
    id: 'empty-set-05',
    topic: 'empty-set',
    kind: 'empty-set',
    difficulty: 'challenge',
    prompt: 'A = {}，B = {∅}，則 A = B。',
    choices: ['正確', '錯誤'],
    answer: '錯誤',
    explanation: 'A 沒有元素；B 有一個元素，也就是空集合，所以 A ≠ B。',
    mistakeTags: ['empty-set-confusion']
  },
  {
    id: 'subset-01',
    topic: 'subset',
    kind: 'subset',
    difficulty: 'basic',
    prompt: 'A = {1, 2}，B = {1, 2, 3}。下列敘述何者正確？',
    setA: [1, 2],
    setB: [1, 2, 3],
    choices: ['只有 A ⊆ B', '只有 A ⊊ B', 'A ⊆ B 與 A ⊊ B 都正確', '兩者都不正確'],
    answer: 'A ⊆ B 與 A ⊊ B 都正確',
    explanation:
      'A 的每個元素都在 B 中，且 A ≠ B，所以 A ⊆ B 與 A ⊊ B 同時成立。',
    mistakeTags: ['proper-subset-confusion']
  },
  {
    id: 'subset-02',
    topic: 'subset',
    kind: 'equality',
    difficulty: 'basic',
    prompt: 'A = {3, 1, 2}，B = {1, 2, 3}。A 與 B 的關係為何？',
    setA: [3, 1, 2],
    setB: [1, 2, 3],
    choices: ['A ⊊ B', 'B ⊊ A', 'A = B', '沒有關係'],
    answer: 'A = B',
    explanation: '集合不考慮元素順序，兩者含有完全相同的元素，所以 A = B。',
    mistakeTags: ['proper-subset-confusion']
  },
  {
    id: 'subset-03',
    topic: 'subset',
    kind: 'subset',
    difficulty: 'standard',
    prompt: '若 A ⊆ B 且 B ⊆ A，則 A = B。',
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: 'A 的元素都在 B，B 的元素也都在 A，所以兩者是相同集合。',
    hint: '⊆ 包含等號的可能性。',
    mistakeTags: ['proper-subset-confusion']
  },
  {
    id: 'subset-04',
    topic: 'subset',
    kind: 'subset',
    difficulty: 'standard',
    prompt: 'A = {1, 2}，B = {1, 2, 3}。判斷「{1, 2} ⊆ B」是否正確。',
    setA: [1, 2],
    setB: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '{1, 2} 的每個元素都在 B 中，所以它是 B 的子集合。',
    mistakeTags: []
  },
  {
    id: 'subset-05',
    topic: 'subset',
    kind: 'subset',
    difficulty: 'challenge',
    prompt: 'A = {1, 2}，B = {1, 2, 3}，則 A ⊊ B。',
    setA: [1, 2],
    setB: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: 'A ⊆ B 且 A ≠ B，所以 A 是 B 的真子集合。',
    mistakeTags: ['proper-subset-confusion']
  },
  {
    id: 'intersection-01',
    topic: 'intersection-union',
    kind: 'intersection',
    difficulty: 'basic',
    prompt: 'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}。求 A ∩ B。',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    choices: ['{1, 2, 3, 4}', '{3, 4}', '{1, 2, 3, 4, 5, 6}', '∅'],
    answer: '{3, 4}',
    explanation: '交集取同時屬於 A 和 B 的元素，也就是 3 和 4。',
    mistakeTags: ['union-intersection-confusion']
  },
  {
    id: 'union-01',
    topic: 'intersection-union',
    kind: 'union',
    difficulty: 'basic',
    prompt: 'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}。求 A ∪ B。',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    choices: ['{3, 4}', '{1, 2, 3, 4, 5, 6}', '{1, 2, 3, 3, 4}', '{1, 2, 3, 4}'],
    answer: '{1, 2, 3, 4, 5, 6}',
    explanation: '聯集包含 A 或 B 中出現的所有不同元素，不能重複列出。',
    mistakeTags: ['union-intersection-confusion', 'duplicate-elements']
  },
  {
    id: 'intersection-02',
    topic: 'intersection-union',
    kind: 'intersection',
    difficulty: 'basic',
    prompt: 'A = {1, 2}，B = {3, 4}。求 A ∩ B。',
    setA: [1, 2],
    setB: [3, 4],
    choices: ['{1, 2}', '{3, 4}', '∅', '{1, 2, 3, 4}'],
    answer: '∅',
    explanation: 'A 與 B 沒有共同元素，所以交集是空集合。',
    mistakeTags: ['union-intersection-confusion']
  },
  {
    id: 'union-02',
    topic: 'intersection-union',
    kind: 'union',
    difficulty: 'standard',
    prompt: 'A = {1, 2}，B = {2, 3}。求 A ∪ B。',
    setA: [1, 2],
    setB: [2, 3],
    choices: ['{1, 2}', '{2, 3}', '{1, 2, 3}', '{1, 3}'],
    answer: '{1, 2, 3}',
    explanation: '聯集包含 A 或 B 中出現的所有不同元素；2 只列出一次。',
    hint: '數學中的「或」包含同時屬於兩者的情況。',
    mistakeTags: ['union-intersection-confusion', 'duplicate-elements']
  },
  {
    id: 'union-03',
    topic: 'intersection-union',
    kind: 'union',
    difficulty: 'challenge',
    prompt: '若 A ⊆ B，則 A ∪ B 等於哪一個集合？',
    setA: [1, 2],
    setB: [1, 2, 3],
    choices: ['A', 'B', 'A ∩ B', '∅'],
    answer: 'B',
    explanation: 'A 的元素已經全部在 B 中，因此 A ∪ B 不會加入 B 以外的新元素。',
    mistakeTags: ['union-intersection-confusion']
  },
  {
    id: 'venn-01',
    topic: 'intersection-union',
    kind: 'venn',
    difficulty: 'standard',
    prompt: '根據 Venn 圖，A ∩ B 是哪一個集合？',
    venn: {
      universe: [1, 2, 3, 4, 5],
      a: [1, 2, 3],
      b: [2, 3, 4]
    },
    vennOperation: 'intersection',
    choices: ['{2, 3}', '{1, 4}', '{1, 2, 3, 4}', '{5}'],
    answer: '{2, 3}',
    explanation: '兩個圓圈重疊的區域是同時屬於 A 和 B 的元素，因此是 {2, 3}。',
    mistakeTags: ['union-intersection-confusion']
  },
  {
    id: 'difference-01',
    topic: 'difference',
    kind: 'difference',
    difficulty: 'basic',
    prompt: 'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}。求 A − B。',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    choices: ['{5, 6}', '{1, 2}', '{3, 4}', '∅'],
    answer: '{1, 2}',
    explanation: 'A − B 取屬於 A 但不屬於 B 的元素，因此是 1 和 2。',
    mistakeTags: ['difference-direction']
  },
  {
    id: 'difference-02',
    topic: 'difference',
    kind: 'difference',
    difficulty: 'basic',
    prompt: 'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}。求 B − A。',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    choices: ['{1, 2}', '{5, 6}', '{3, 4}', '∅'],
    answer: '{5, 6}',
    explanation: 'B − A 取屬於 B 但不屬於 A 的元素，因此是 5 和 6。',
    mistakeTags: ['difference-direction']
  },
  {
    id: 'difference-03',
    topic: 'difference',
    kind: 'difference',
    difficulty: 'standard',
    prompt: 'A = {1, 2}，B = {1, 2}。求 A − B。',
    setA: [1, 2],
    setB: [1, 2],
    choices: ['{1, 2}', '∅', '{1}', '{2}'],
    answer: '∅',
    explanation: 'A 的每個元素都在 B 中，所以 A − B 沒有元素，是空集合。',
    mistakeTags: ['difference-direction']
  },
  {
    id: 'difference-04',
    topic: 'difference',
    kind: 'difference',
    difficulty: 'standard',
    prompt: 'A = {1, 2, 3}，B = {2, 3, 4}。求 B − A。',
    setA: [1, 2, 3],
    setB: [2, 3, 4],
    choices: ['{1}', '{4}', '{2, 3}', '{1, 4}'],
    answer: '{4}',
    explanation: 'B 中不屬於 A 的元素只有 4。',
    mistakeTags: ['difference-direction']
  },
  {
    id: 'difference-05',
    topic: 'difference',
    kind: 'difference',
    difficulty: 'challenge',
    prompt: 'A − B 與 B − A 一定相等。',
    choices: ['正確', '錯誤'],
    answer: '錯誤',
    explanation: '差集有方向性。A − B 是 A 中不在 B 的元素，B − A 是 B 中不在 A 的元素。',
    mistakeTags: ['difference-direction']
  },
  {
    id: 'venn-02',
    topic: 'difference',
    kind: 'venn',
    difficulty: 'standard',
    prompt: '根據 Venn 圖，B − A 是哪一個集合？',
    venn: {
      universe: [1, 2, 3, 4, 5],
      a: [1, 2, 3],
      b: [2, 3, 4]
    },
    vennOperation: 'reverseDifference',
    choices: ['{4}', '{1}', '{2, 3}', '{5}'],
    answer: '{4}',
    explanation: 'B 中不屬於 A 的元素只有 4，因此 B − A = {4}。',
    mistakeTags: ['difference-direction']
  },
  {
    id: 'complement-01',
    topic: 'complement',
    kind: 'complement',
    difficulty: 'basic',
    prompt: 'U = {1, 2, 3, 4, 5, 6, 7, 8}，A = {1, 2, 3, 4}。求 Aᶜ。',
    universe: [1, 2, 3, 4, 5, 6, 7, 8],
    setA: [1, 2, 3, 4],
    choices: ['{5, 6}', '{5, 6, 7, 8}', '{1, 2, 3, 4}', '∅'],
    answer: '{5, 6, 7, 8}',
    explanation:
      '補集必須從 U 中找出不屬於 A 的所有元素，不能漏掉 7 和 8。',
    mistakeTags: ['forgot-universe']
  },
  {
    id: 'complement-02',
    topic: 'complement',
    kind: 'complement',
    difficulty: 'standard',
    prompt: '若 A = {1, 2, 3, 4}，U₁ = {1, 2, 3, 4, 5}，U₂ = {1, 2, 3, 4, 5, 6, 7, 8}。Aᶜ 為何不相同？',
    universe: [1, 2, 3, 4, 5],
    setA: [1, 2, 3, 4],
    choices: ['因為 A 改變了', '因為全集不同', '因為補集沒有意義', '因為集合不可比較'],
    answer: '因為全集不同',
    explanation: '補集必須相對於全集定義；U₁ 下的補集是 {5}，U₂ 下的補集是 {5, 6, 7, 8}。',
    mistakeTags: ['forgot-universe']
  },
  {
    id: 'complement-03',
    topic: 'complement',
    kind: 'complement',
    difficulty: 'standard',
    prompt: 'U = {1, 2, 3}，A = {1, 2, 3}。求 Aᶜ。',
    universe: [1, 2, 3],
    setA: [1, 2, 3],
    choices: ['{1, 2, 3}', '∅', '{1, 2}', '{3}'],
    answer: '∅',
    explanation: 'A 已經包含 U 的所有元素，因此 U 中沒有不屬於 A 的元素。',
    mistakeTags: ['forgot-universe']
  },
  {
    id: 'complement-04',
    topic: 'complement',
    kind: 'venn',
    difficulty: 'challenge',
    prompt: '根據 Venn 圖，Aᶜ 是哪一個集合？',
    venn: {
      universe: [1, 2, 3, 4, 5, 6],
      a: [1, 2, 3],
      b: [2, 4]
    },
    vennOperation: 'complement',
    choices: ['{4, 5, 6}', '{5, 6}', '{1, 2, 3}', '{2, 4, 5, 6}'],
    answer: '{4, 5, 6}',
    explanation: 'U 中不屬於 A 的元素是 4、5、6；4 雖然屬於 B，仍然屬於 Aᶜ。',
    hint: '補集只看「是否屬於 A」，不需考慮 B。',
    mistakeTags: ['forgot-universe']
  },
  {
    id: 'complement-05',
    topic: 'complement',
    kind: 'complement',
    difficulty: 'challenge',
    prompt: '補集與 U 有關，原因是補集是從 U 中取出不屬於 A 的元素。',
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: 'Aᶜ = U − A。若 U 不同，即使 A 相同，補集也可能不同。',
    mistakeTags: ['forgot-universe']
  }
];

export const quizQuestionIds = [
  'set-01',
  'membership-02',
  'membership-03',
  'representation-01',
  'empty-set-01',
  'subset-01',
  'intersection-01',
  'union-01',
  'difference-01',
  'difference-02',
  'complement-01',
  'complement-02'
];

export const quizQuestions = quizQuestionIds
  .map((id) => questions.find((question) => question.id === id))
  .filter((question): question is QuizQuestion => Boolean(question));

export function questionsForTopic(topic: QuizTopic): QuizQuestion[] {
  return questions.filter((question) => question.topic === topic);
}

const lessonTopics: Record<string, QuizTopic[]> = {
  set: ['set-and-element'],
  membership: ['membership'],
  representation: ['representation'],
  'empty-set': ['empty-set'],
  subset: ['subset'],
  operations: ['intersection-union', 'difference'],
  complement: ['complement']
};

export function questionsForLesson(lessonId: string): QuizQuestion[] {
  const topics = lessonTopics[lessonId];
  if (!topics) return [];
  return questions.filter((question) => topics.includes(question.topic));
}

export function mixedPracticeQuestions(): QuizQuestion[] {
  return questions.slice(0, 10);
}
