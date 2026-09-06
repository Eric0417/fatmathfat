import { describe, expect, it } from 'vitest';
import {
  isLessonForGrade,
  lessonsForGrade,
  mixedPracticeQuestions,
  normalizedRouteForGrade,
  questionsForTopic,
  quizQuestionsForGrade,
  topicsForGrade
} from './contentRegistry';

describe('grade content registry', () => {
  it('keeps S4 and S5 content separated', () => {
    expect(lessonsForGrade('S4')).toHaveLength(7);
    expect(lessonsForGrade('S5')).toHaveLength(8);
    expect(isLessonForGrade('set', 'S4')).toBe(true);
    expect(isLessonForGrade('set', 'S5')).toBe(false);
    expect(isLessonForGrade('s5-slope', 'S4')).toBe(false);
    expect(isLessonForGrade('s5-slope', 'S5')).toBe(true);
  });

  it('provides at least five questions for every S5 topic', () => {
    topicsForGrade('S5').forEach((topic) => {
      expect(questionsForTopic('S5', topic).length).toBeGreaterThanOrEqual(5);
    });
  });

  it('provides grade-specific mixed practice and quizzes', () => {
    expect(mixedPracticeQuestions('S4')[0].topic).not.toContain('s5-');
    expect(mixedPracticeQuestions('S5')[0].topic).toContain('s5-');
    expect(quizQuestionsForGrade('S4')).toHaveLength(12);
    expect(quizQuestionsForGrade('S5')).toHaveLength(12);
  });

  it('normalizes routes that belong to another grade', () => {
    expect(normalizedRouteForGrade('/explorer', 'S5')).toBe('/s5-lab');
    expect(normalizedRouteForGrade('/s5-lab', 'S4')).toBe('/explorer');
    expect(normalizedRouteForGrade('/lessons/set', 'S5')).toBe('/lessons');
    expect(normalizedRouteForGrade('/practice/operations', 'S4')).toBe(
      '/practice/operations'
    );
    expect(normalizedRouteForGrade('/lessons/s5-slope', 'S5')).toBe(
      '/lessons/s5-slope'
    );
  });
});
