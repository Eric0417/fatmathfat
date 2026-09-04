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
  examples: LessonExample[];
  explanation: string;
  keyPoints: string[];
  color: 'blue' | 'orange' | 'green' | 'red' | 'teal' | 'navy' | 'slate';
  detailedNotes: string[];
  commonMistakes: string[];
  practiceTopic: QuizTopic;
  universe?: number[];
  setA?: number[];
  setB?: number[];
}

export interface LessonExample {
  title: string;
  statement: string;
  explanation: string;
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

export type UserRole = 'student' | 'teacher';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  student_number?: string | null;
  last_login_at?: string | null;
  last_seen_at?: string | null;
  last_lesson?: string | null;
  created_at: string;
}

export interface QuizAttemptResponse {
  id: number | string;
  completed_at: string;
  score: number;
  correct: number;
  total: number;
  duration_ms: number;
  topic_scores: Record<QuizTopic, { correct: number; total: number }>;
  mistakes: Array<{
    question_id: string;
    selected: string;
    answer: string;
    tags: MistakeTag[];
  }>;
}

export interface PracticeProgressResponse {
  id: number;
  source: 'topic' | 'ai_generated' | 'review';
  topic: string;
  correct: number;
  total: number;
  duration_ms: number;
  completed_at: string;
}

export interface ProgressResponse {
  user: User;
  completed_lessons: Array<{
    lesson_id: string;
    completed_at: string;
  }>;
  last_lesson: string | null;
  practice_progress: PracticeProgressResponse[];
  quiz_attempts: QuizAttemptResponse[];
}

export interface AiQuestionContext {
  route: string;
  lesson_id?: string | null;
  topic?: string | null;
  question_id?: string | null;
  prompt?: string | null;
  kind?: string | null;
  difficulty?: string | null;
  choices: string[];
  selected?: string | null;
  answered: boolean;
  allow_answer: boolean;
}
