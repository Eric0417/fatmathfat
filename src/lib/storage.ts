import type { QuizResultRecord } from '../types';

const QUIZ_HISTORY_KEY = 'collection-tool:quiz-history:v1';
const PROGRESS_KEY = 'collection-tool:progress:v1';

export function loadQuizHistory(): QuizResultRecord[] {
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as QuizResultRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveQuizHistory(results: QuizResultRecord[]): void {
  localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(results));
}

export function addQuizResult(result: QuizResultRecord): QuizResultRecord[] {
  const next = [result, ...loadQuizHistory()].slice(0, 30);
  saveQuizHistory(next);
  return next;
}

export function clearQuizHistory(): void {
  localStorage.removeItem(QUIZ_HISTORY_KEY);
}

export function loadCompletedLessons(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return [];
    const lessons = (parsed as { completedLessons?: unknown }).completedLessons;
    return Array.isArray(lessons)
      ? lessons.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function saveCompletedLesson(lessonId: string): string[] {
  const completed = [...new Set([...loadCompletedLessons(), lessonId])];
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ completedLessons: completed, updatedAt: new Date().toISOString() })
  );
  return completed;
}

export function clearAllProgress(): void {
  localStorage.removeItem(QUIZ_HISTORY_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}
