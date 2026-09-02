import type { QuizQuestion } from '../types';

export const questions: QuizQuestion[] = [
  {
    id: 'set-and-element-01',
    topic: 'set-and-element',
    prompt: '若 A = {1, 2, 3}，判斷「1 ∈ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '1 是 A 中的元素，所以 1 ∈ A。',
    mistakeTags: []
  },
  {
    id: 'membership-01',
    topic: 'membership',
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
    prompt: '若 A = {1, 2, 3}，判斷「{1} ⊆ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '{1} 是集合，且它的唯一元素 1 屬於 A，因此 {1} ⊆ A。',
    mistakeTags: ['element-vs-subset']
  },
  {
    id: 'subset-01',
    topic: 'subset',
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
    prompt: 'A = {3, 1, 2}，B = {1, 2, 3}。A 與 B 的關係為何？',
    setA: [3, 1, 2],
    setB: [1, 2, 3],
    choices: ['A ⊊ B', 'B ⊊ A', 'A = B', '沒有關係'],
    answer: 'A = B',
    explanation: '集合不考慮元素順序，兩者含有完全相同的元素，所以 A = B。',
    mistakeTags: ['proper-subset-confusion']
  },
  {
    id: 'intersection-union-01',
    topic: 'intersection-union',
    prompt: 'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}。求 A ∩ B。',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    choices: ['{1, 2, 3, 4}', '{3, 4}', '{1, 2, 3, 4, 5, 6}', '∅'],
    answer: '{3, 4}',
    explanation: '交集取同時屬於 A 和 B 的元素，也就是 3 和 4。',
    mistakeTags: ['union-intersection-confusion']
  },
  {
    id: 'intersection-union-02',
    topic: 'intersection-union',
    prompt: 'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}。求 A ∪ B。',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    choices: ['{3, 4}', '{1, 2, 3, 4, 5, 6}', '{1, 2, 3, 3, 4}', '{1, 2, 3, 4}'],
    answer: '{1, 2, 3, 4, 5, 6}',
    explanation: '聯集包含 A 或 B 中出現的所有不同元素，不能重複列出。',
    mistakeTags: ['union-intersection-confusion', 'duplicate-elements']
  },
  {
    id: 'difference-01',
    topic: 'difference',
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
    prompt: 'A = {1, 2, 3, 4}，B = {3, 4, 5, 6}。求 B − A。',
    setA: [1, 2, 3, 4],
    setB: [3, 4, 5, 6],
    choices: ['{1, 2}', '{5, 6}', '{3, 4}', '∅'],
    answer: '{5, 6}',
    explanation: 'B − A 取屬於 B 但不屬於 A 的元素，因此是 5 和 6。',
    mistakeTags: ['difference-direction']
  },
  {
    id: 'complement-01',
    topic: 'complement',
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
    prompt: '若 A = {1, 2, 3, 4}，U₁ = {1, 2, 3, 4, 5}，U₂ = {1, 2, 3, 4, 5, 6, 7, 8}。Aᶜ 為何不相同？',
    universe: [1, 2, 3, 4, 5],
    setA: [1, 2, 3, 4],
    choices: ['因為 A 改變了', '因為全集不同', '因為補集沒有意義', '因為集合不可比較'],
    answer: '因為全集不同',
    explanation: '補集必須相對於全集定義；U₁ 下的補集是 {5}，U₂ 下的補集是 {5, 6, 7, 8}。',
    mistakeTags: ['forgot-universe']
  },
  {
    id: 'empty-set-01',
    topic: 'subset',
    prompt: '判斷「∅ ⊆ A」是否正確。',
    setA: [1, 2, 3],
    choices: ['正確', '錯誤'],
    answer: '正確',
    explanation: '空集合沒有元素，因此每一個元素都"符合"屬於 A 的條件，所以 ∅ ⊆ A。',
    mistakeTags: ['empty-set-confusion']
  },
  {
    id: 'empty-set-02',
    topic: 'set-and-element',
    prompt: '判斷「∅ = {∅}」是否正確。',
    choices: ['正確', '錯誤'],
    answer: '錯誤',
    explanation: '∅ 沒有元素；{∅} 有一個元素，也就是空集合，所以兩者不同。',
    mistakeTags: ['empty-set-confusion']
  }
];

export const quizQuestions = questions.slice(0, 12);
