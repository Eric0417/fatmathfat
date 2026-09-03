export type SetOperation =
  | 'intersection'
  | 'union'
  | 'difference'
  | 'reverseDifference'
  | 'complement';

export type Membership = 'outside' | 'a' | 'b' | 'both';

export type VennDropTarget = 'outside' | 'a' | 'b' | 'both';

export interface SetState {
  universe: number[];
  a: number[];
  b: number[];
}

export type QuizTopic =
  | 'set-and-element'
  | 'membership'
  | 'representation'
  | 'empty-set'
  | 'subset'
  | 'intersection-union'
  | 'difference'
  | 'complement';

export type QuestionKind =
  | 'membership'
  | 'equality'
  | 'subset'
  | 'intersection'
  | 'union'
  | 'difference'
  | 'complement'
  | 'enumeration'
  | 'set-builder'
  | 'cardinality'
  | 'empty-set'
  | 'venn';

export type QuestionDifficulty = 'basic' | 'standard' | 'challenge';

export type LessonTopic =
  | 'set'
  | 'membership'
  | 'representation'
  | 'empty-set'
  | 'subset'
  | 'operations'
  | 'complement';

export interface Lesson {
  id: LessonTopic;
  order: number;
  title: string;
  shortTitle: string;
  summary: string;
  definition: string;
  example: string;
  explanation: string;
  keyPoints: string[];
  color: 'blue' | 'orange' | 'green' | 'red' | 'teal' | 'navy' | 'slate';
  commonMistake: string;
  practiceTopic: QuizTopic;
  universe?: number[];
  setA?: number[];
  setB?: number[];
}

export type MistakeTag =
  | 'union-intersection-confusion'
  | 'duplicate-elements'
  | 'element-vs-subset'
  | 'forgot-universe'
  | 'difference-direction'
  | 'proper-subset-confusion'
  | 'empty-set-confusion';

export interface QuizQuestion {
  id: string;
  topic: QuizTopic;
  kind: QuestionKind;
  difficulty: QuestionDifficulty;
  prompt: string;
  universe?: number[];
  setA?: number[];
  setB?: number[];
  venn?: SetState;
  vennOperation?: SetOperation;
  choices: string[];
  answer: string;
  explanation: string;
  hint?: string;
  mistakeTags: MistakeTag[];
}

export interface QuizResultRecord {
  id: string;
  completedAt: string;
  score: number;
  correct: number;
  total: number;
  durationMs: number;
  topicScores: Record<QuizTopic, { correct: number; total: number }>;
  mistakes: Array<{
    questionId: string;
    selected: string;
    answer: string;
    tags: MistakeTag[];
  }>;
}
