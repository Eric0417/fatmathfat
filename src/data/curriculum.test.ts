import { describe, expect, it } from 'vitest';
import { lessons } from './curriculum';

describe('curriculum depth', () => {
  it('keeps all seven lessons detailed with multiple examples', () => {
    expect(lessons).toHaveLength(7);
    lessons.forEach((lesson) => {
      expect(lesson.examples.length).toBeGreaterThanOrEqual(3);
      expect(lesson.detailedNotes.length).toBeGreaterThanOrEqual(4);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyPoints.length).toBeGreaterThanOrEqual(4);
      expect(lesson.definition.trim().length).toBeGreaterThan(40);
      expect(lesson.explanation.trim().length).toBeGreaterThan(40);
      lesson.examples.forEach((example) => {
        expect(example.title.trim()).not.toBe('');
        expect(example.statement.trim()).not.toBe('');
        expect(example.explanation.trim()).not.toBe('');
      });
    });
  });
});
