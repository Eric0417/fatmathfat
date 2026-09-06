import { describe, expect, it } from 'vitest';
import { s5Lessons } from './s5Curriculum';

describe('S5 curriculum depth', () => {
  it('keeps all eight lessons detailed with multiple examples', () => {
    expect(s5Lessons).toHaveLength(8);
    s5Lessons.forEach((lesson) => {
      expect(lesson.gradeLevel).toBe('S5');
      expect(lesson.examples.length).toBeGreaterThanOrEqual(4);
      expect(lesson.detailedNotes.length).toBeGreaterThanOrEqual(5);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyPoints.length).toBeGreaterThanOrEqual(4);
      expect(lesson.strategies?.length).toBeGreaterThanOrEqual(3);
      expect(lesson.applications?.length).toBeGreaterThanOrEqual(2);
      expect(lesson.challenges?.length).toBeGreaterThanOrEqual(1);
      expect(lesson.interactive).toBeTruthy();
      expect(lesson.interactive).not.toBe('venn');
      expect(lesson.definition.trim().length).toBeGreaterThan(20);
      expect(lesson.explanation.trim().length).toBeGreaterThan(40);
      expect(
        lesson.examples.some((example) => example.steps?.length)
      ).toBe(true);
      lesson.examples.forEach((example) => {
        expect(example.title.trim()).not.toBe('');
        expect(example.statement.trim()).not.toBe('');
        expect(example.explanation.trim()).not.toBe('');
      });
    });
  });

  it('does not retain the known S5 mathematical wording errors', () => {
    const text = s5Lessons.map((lesson) => JSON.stringify(lesson)).join('\n');
    expect(text).not.toContain('且截距可正、可負、可零');
    expect(text).not.toContain('二階行列式的幾何意義');
    expect(text).not.toContain('兩線斜率相等時平行');
  });
});
