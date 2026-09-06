import { describe, expect, it } from 'vitest';
import { s5Lessons } from './s5Curriculum';

describe('S5 curriculum depth', () => {
  it('keeps all eight lessons detailed with multiple examples', () => {
    expect(s5Lessons).toHaveLength(8);
    s5Lessons.forEach((lesson) => {
      expect(lesson.gradeLevel).toBe('S5');
      expect(lesson.examples.length).toBeGreaterThanOrEqual(3);
      expect(lesson.detailedNotes.length).toBeGreaterThanOrEqual(4);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyPoints.length).toBeGreaterThanOrEqual(4);
      expect(lesson.definition.trim().length).toBeGreaterThan(20);
      expect(lesson.explanation.trim().length).toBeGreaterThan(40);
      lesson.examples.forEach((example) => {
        expect(example.title.trim()).not.toBe('');
        expect(example.statement.trim()).not.toBe('');
        expect(example.explanation.trim()).not.toBe('');
      });
    });
  });
});
