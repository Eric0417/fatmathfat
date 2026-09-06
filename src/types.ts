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

export type GradeLevel = 'S4' | 'S5';

export interface CartesianPoint {
  x: number;
  y: number;
}

export interface LinearEquation {
  a: number;
  b: number;
  c: number;
  slope: number | null;
  vertical: boolean;
  xIntercept: number | null;
  yIntercept: number | null;
}

export type S4QuizTopic =
  | 'set-and-element'
  | 'membership'
  | 'representation'
  | 'empty-set'
  | 'subset'
  | 'intersection-union'
  | 'difference'
  | 'complement';

export type S5QuizTopic =
  | 's5-directed-segment'
  | 's5-section-point'
  | 's5-polygon-area'
  | 's5-slope'
  | 's5-line-forms'
  | 's5-line-relations'
  | 's5-distance-normal'
  | 's5-line-family';

export type QuizTopic = S4QuizTopic | S5QuizTopic;

export type S4QuestionKind =
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

export type S5QuestionKind =
  | 'coordinate'
  | 'slope'
  | 'line-equation'
  | 'line-relation'
  | 'distance'
  | 'angle'
  | 'area';

export type QuestionKind = S4QuestionKind | S5QuestionKind;

export type QuestionDifficulty = 'basic' | 'standard' | 'challenge';

export type S4LessonTopic =
  | 'set'
  | 'membership'
  | 'representation'
  | 'empty-set'
  | 'subset'
  | 'operations'
  | 'complement';

export type S5LessonTopic =
  | 's5-directed-segment'
  | 's5-section-point'
  | 's5-polygon-area'
  | 's5-slope'
  | 's5-line-forms'
  | 's5-line-relations'
  | 's5-distance-normal'
  | 's5-line-family';

export type LessonTopic = S4LessonTopic | S5LessonTopic;

export interface Lesson {
  id: LessonTopic;
  gradeLevel: GradeLevel;
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
  interactive?: 'venn' | 'line-lab';
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
  | 'empty-set-confusion'
  | 'directed-length-sign'
  | 'section-ratio-order'
  | 'slope-angle-confusion'
  | 'intercept-sign'
  | 'parallel-perpendicular-condition'
  | 'distance-absolute-value'
  | 'line-form-domain'
  | 'normal-form-sign';

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
  grade_level?: GradeLevel | null;
  student_number?: string | null;
  last_login_at?: string | null;
  last_seen_at?: string | null;
  last_lesson?: string | null;
  created_at: string;
}

export interface QuizAttemptResponse {
  id: number | string;
  grade_level?: GradeLevel | null;
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

export interface QuizSessionResponse {
  quiz_session_id: string;
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
