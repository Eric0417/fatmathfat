// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
  addQuizResult,
  clearQuizHistory,
  loadCompletedLessons,
  loadQuizHistory,
  saveCompletedLesson
} from './storage';
import type { QuizResultRecord } from '../types';

const result: QuizResultRecord = {
  id: 'result-1',
  completedAt: '2026-09-02T10:00:00.000Z',
  score: 90,
  correct: 9,
  total: 10,
  durationMs: 120000,
  topicScores: {
    'set-and-element': { correct: 2, total: 2 },
    membership: { correct: 2, total: 2 },
    subset: { correct: 2, total: 2 },
    'intersection-union': { correct: 2, total: 2 },
    difference: { correct: 1, total: 1 },
    complement: { correct: 0, total: 1 }
  },
  mistakes: []
};

describe('local storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores quiz history newest first', () => {
    addQuizResult(result);
    expect(loadQuizHistory()).toHaveLength(1);
    expect(loadQuizHistory()[0]?.id).toBe('result-1');
  });

  it('clears quiz history', () => {
    addQuizResult(result);
    clearQuizHistory();
    expect(loadQuizHistory()).toEqual([]);
  });

  it('stores completed lesson ids without duplicates', () => {
    saveCompletedLesson('set');
    saveCompletedLesson('set');
    expect(loadCompletedLessons()).toEqual(['set']);
  });

  it('ignores malformed stored data', () => {
    localStorage.setItem('collection-tool:quiz-history:v1', '{bad json');
    localStorage.setItem('collection-tool:progress:v1', '[]');
    expect(loadQuizHistory()).toEqual([]);
    expect(loadCompletedLessons()).toEqual([]);
  });
});
