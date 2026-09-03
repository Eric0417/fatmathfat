import { describe, expect, it } from 'vitest';
import {
  questions,
  questionsForLesson,
  questionsForTopic,
  quizQuestions,
  topicLabels
} from './questions';
import { lessons } from './curriculum';

describe('question bank', () => {
  it('has unique ids and valid answers', () => {
    const ids = questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    questions.forEach((question) => {
      expect(question.choices).toContain(question.answer);
      expect(question.kind).toBeTruthy();
      expect(question.difficulty).toBeTruthy();
    });
  });

  it('provides at least five questions for every topic', () => {
    Object.keys(topicLabels).forEach((topic) => {
      expect(questionsForTopic(topic as keyof typeof topicLabels).length).toBeGreaterThanOrEqual(5);
    });
  });

  it('provides at least five questions for every lesson', () => {
    lessons.forEach((lesson) => {
      expect(questionsForLesson(lesson.id).length).toBeGreaterThanOrEqual(5);
    });
  });

  it('keeps the quiz at the requested minimum', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(10);
    expect(new Set(quizQuestions.map((question) => question.id)).size).toBe(
      quizQuestions.length
    );
  });
});
