import { lessons as s4Lessons } from './curriculum';
import {
  questionKindLabels as s4QuestionKindLabels,
  questions as s4Questions,
  questionsForLesson as s4QuestionsForLesson,
  quizQuestions as s4QuizQuestions,
  topicLabels as s4TopicLabels
} from './questions';
import { s5Lessons } from './s5Curriculum';
import {
  s5QuestionKindLabels,
  s5Questions,
  s5QuestionsForTopic,
  s5QuizQuestions,
  s5TopicLabels
} from './s5Questions';
import type {
  GradeLevel,
  Lesson,
  QuestionKind,
  QuizQuestion,
  QuizTopic
} from '../types';

export const allLessons: Lesson[] = [...s4Lessons, ...s5Lessons];

export const allTopicLabels: Record<QuizTopic, string> = {
  ...s4TopicLabels,
  ...s5TopicLabels
};

export const allQuestionKindLabels: Record<QuestionKind, string> = {
  ...s4QuestionKindLabels,
  ...s5QuestionKindLabels
};

export function gradeOrDefault(
  grade: GradeLevel | null | undefined
): GradeLevel {
  return grade === 'S5' ? 'S5' : 'S4';
}

export function lessonsForGrade(grade: GradeLevel): Lesson[] {
  return grade === 'S5' ? s5Lessons : s4Lessons;
}

export function lessonByTopic(id: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.id === id);
}

export function lessonForGrade(
  id: string,
  grade: GradeLevel
): Lesson | undefined {
  const lesson = lessonByTopic(id);
  return lesson?.gradeLevel === grade ? lesson : undefined;
}

export function isLessonForGrade(
  id: string,
  grade: GradeLevel
): boolean {
  return Boolean(lessonForGrade(id, grade));
}

export function lessonIdsForGrade(grade: GradeLevel): string[] {
  return lessonsForGrade(grade).map((lesson) => lesson.id);
}

export function topicsForGrade(grade: GradeLevel): QuizTopic[] {
  const labels =
    grade === 'S5'
      ? s5TopicLabels
      : (s4TopicLabels as Record<QuizTopic, string>);
  return Object.keys(labels) as QuizTopic[];
}

export function topicLabelsForGrade(
  grade: GradeLevel
): Record<QuizTopic, string> {
  return allTopicLabels;
}

export function topicLabelFor(
  topic: QuizTopic | string
): string {
  return allTopicLabels[topic as QuizTopic] ?? topic;
}

export function questionKindLabelFor(
  kind: QuestionKind | string
): string {
  return allQuestionKindLabels[kind as QuestionKind] ?? kind;
}

export function questionsForGrade(grade: GradeLevel): QuizQuestion[] {
  return grade === 'S5' ? s5Questions : s4Questions;
}

export function questionsForTopic(
  grade: GradeLevel,
  topic: QuizTopic
): QuizQuestion[] {
  return questionsForGrade(grade).filter(
    (question) => question.topic === topic
  );
}

export function questionsForLesson(
  grade: GradeLevel,
  lessonId: string
): QuizQuestion[] {
  if (grade === 'S4') return s4QuestionsForLesson(lessonId);
  const lesson = lessonForGrade(lessonId, 'S5');
  return lesson
    ? s5QuestionsForTopic(lesson.practiceTopic as Parameters<typeof s5QuestionsForTopic>[0])
    : [];
}

export function mixedPracticeQuestions(
  grade: GradeLevel
): QuizQuestion[] {
  const source = grade === 'S5' ? s5Questions : s4Questions;
  const topics = Object.keys(
    grade === 'S5' ? s5TopicLabels : s4TopicLabels
  ) as QuizTopic[];
  const selected: QuizQuestion[] = [];

  for (let round = 0; round < 2 && selected.length < 10; round += 1) {
    for (const topic of topics) {
      const next = source.find(
        (question) =>
          question.topic === topic &&
          !selected.some((item) => item.id === question.id)
      );
      if (next) selected.push(next);
      if (selected.length >= 10) break;
    }
  }

  return selected;
}

export function quizQuestionsForGrade(
  grade: GradeLevel
): QuizQuestion[] {
  return grade === 'S5' ? s5QuizQuestions() : s4QuizQuestions;
}

export function questionById(
  grade: GradeLevel,
  id: string
): QuizQuestion | undefined {
  return questionsForGrade(grade).find((question) => question.id === id);
}

export function isTopicForGrade(
  topic: string,
  grade: GradeLevel
): boolean {
  return grade === 'S5'
    ? topic in s5TopicLabels
    : topic in s4TopicLabels;
}

export function toolRoute(grade: GradeLevel): string {
  return grade === 'S5' ? '#/s5-lab' : '#/explorer';
}

export function normalizedRouteForGrade(
  route: string,
  grade: GradeLevel
): string {
  if (route === '/explorer' && grade === 'S5') return '/s5-lab';
  if (route === '/s5-lab' && grade === 'S4') return '/explorer';

  if (route.startsWith('/lessons/')) {
    const lessonId = route.split('/')[2];
    return isLessonForGrade(lessonId, grade) ? route : '/lessons';
  }

  if (route.startsWith('/practice/')) {
    const topic = route.split('/')[2];
    if (topic === 'operations') {
      return grade === 'S4' ? route : '/practice';
    }
    return isTopicForGrade(topic, grade) ? route : '/practice';
  }

  return route;
}
