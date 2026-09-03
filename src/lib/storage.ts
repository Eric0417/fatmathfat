import type { QuizResultRecord } from '../types';

const QUIZ_HISTORY_KEY = 'collection-tool:quiz-history:v1';
const PROGRESS_KEY = 'collection-tool:progress:v1';

interface StoredProgress {
  completedLessons: string[];
  lastLesson?: string;
  updatedAt?: string;
}

function readProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { completedLessons: [] };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return { completedLessons: [] };
    const progress = parsed as Partial<StoredProgress>;
    const completedLessons = Array.isArray(progress.completedLessons)
      ? progress.completedLessons.filter(
          (item): item is string => typeof item === 'string'
        )
      : [];
    return {
      completedLessons,
      lastLesson:
        typeof progress.lastLesson === 'string' ? progress.lastLesson : undefined,
      updatedAt:
        typeof progress.updatedAt === 'string' ? progress.updatedAt : undefined
    };
  } catch {
    return { completedLessons: [] };
  }
}

function writeProgress(progress: StoredProgress): void {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      ...progress,
      updatedAt: new Date().toISOString()
    })
  );
}

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
  return readProgress().completedLessons;
}

export function saveCompletedLesson(lessonId: string): string[] {
  const progress = readProgress();
  const completed = [...new Set([...progress.completedLessons, lessonId])];
  writeProgress({ ...progress, completedLessons: completed, lastLesson: lessonId });
  return completed;
}

export function loadLastLesson(): string | null {
  return readProgress().lastLesson ?? null;
}

export function saveLastLesson(lessonId: string): void {
  const progress = readProgress();
  writeProgress({ ...progress, lastLesson: lessonId });
}

export function clearAllProgress(): void {
  localStorage.removeItem(QUIZ_HISTORY_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}
