import { Check, ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { lessons, lessonByTopic } from '../data/curriculum';
import { questionsForLesson } from '../data/questions';
import { VennDiagram } from '../components/VennDiagram';
import type { Lesson, ProgressResponse, SetOperation, SetState } from '../types';

function lessonDiagramState(lesson: Lesson): SetState {
  return {
    universe: lesson.universe ?? lesson.setA ?? [],
    a: lesson.setA ?? [],
    b: lesson.setB ?? []
  };
}

function lessonOperation(lesson: Lesson): SetOperation {
  if (lesson.id === 'operations') return 'union';
  if (lesson.id === 'complement') return 'complement';
  if (lesson.id === 'subset') return 'intersection';
  return 'union';
}

function EmptySetVisual() {
  return (
    <div className="empty-set-visual" aria-label="空集合示意">
      <div className="empty-set-visual__item">
        <span className="empty-set-visual__symbol">∅</span>
        <span>沒有元素</span>
      </div>
      <span className="empty-set-visual__equals">≠</span>
      <div className="empty-set-visual__item">
        <span className="empty-set-visual__symbol">{'{∅}'}</span>
        <span>有一個元素</span>
      </div>
    </div>
  );
}

function LessonDetail({
  lesson,
  completedLessons,
  onComplete,
  onVisit
}: {
  lesson: Lesson;
  completedLessons: string[];
  onComplete: (lessonId: string) => void;
  onVisit: (lessonId: string) => void;
}) {
  const completed = completedLessons.includes(lesson.id);
  const practiceQuestions = questionsForLesson(lesson.id);
  const state = lessonDiagramState(lesson);
  const nextLesson = lessons.find((item) => item.order === lesson.order + 1);
  const previousLesson = lessons.find((item) => item.order === lesson.order - 1);

  useEffect(() => {
    onVisit(lesson.id);
  }, [lesson.id, onVisit]);

  return (
    <div className="lesson-layout">
      <aside className="lesson-rail panel" aria-label="單元清單">
        <div className="panel-heading panel-heading--compact">
          <span className="panel-kicker">單元</span>
          <h2>七個學習主題</h2>
        </div>
        <ol className="lesson-list">
          {lessons.map((item) => (
            <li key={item.id}>
              <a
                className={`lesson-list__item${item.id === lesson.id ? ' lesson-list__item--active' : ''}`}
                href={`#/lessons/${item.id}`}
                aria-current={item.id === lesson.id ? 'page' : undefined}
              >
                <span className="lesson-list__number">{String(item.order).padStart(2, '0')}</span>
                <span>{item.title}</span>
                {completedLessons.includes(item.id) && (
                  <Check size={16} aria-label="已完成" />
                )}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <article className="lesson-content" aria-labelledby="lesson-title">
        <div className="lesson-content__heading">
          <div>
            <span className="eyebrow">單元 {String(lesson.order).padStart(2, '0')}</span>
            <h1 id="lesson-title">{lesson.title}</h1>
            <p>{lesson.summary}</p>
          </div>
          {completed && (
            <span className="complete-badge">
              <CircleCheck size={17} aria-hidden="true" />
              已標記完成
            </span>
          )}
        </div>

        <section className="panel lesson-definition">
          <div className="panel-heading panel-heading--compact">
            <span className="panel-kicker">先看初學者版本與正式定義</span>
            <h2>從直覺語言進入數學語言</h2>
          </div>
          <p className="lesson-summary">
            <strong>初學者版本：</strong>
            {lesson.summary}
          </p>
          <p className="definition-quote">{lesson.definition}</p>
          <div className="lesson-keypoints">
            {lesson.keyPoints.map((point) => (
              <span className="keypoint" key={point}>
                <Check size={15} aria-hidden="true" />
                {point}
              </span>
            ))}
          </div>
        </section>

        <section className="panel lesson-example">
          <div className="panel-heading panel-heading--compact">
            <span className="panel-kicker">再對照例子</span>
            <h2>圖形與符號同步出現</h2>
          </div>
          {lesson.id === 'empty-set' ? (
            <EmptySetVisual />
          ) : (
            <VennDiagram
              state={state}
              operation={lessonOperation(lesson)}
              ariaLabel={`${lesson.title}的集合示意圖`}
            />
          )}
          <p className="lesson-example__text">
            <strong>例子：</strong>
            {lesson.example}
          </p>
          <p className="lesson-example__text">
            <strong>解釋：</strong>
            {lesson.explanation}
          </p>
          <div className="lesson-mistake-card">
            <h3>常見錯誤</h3>
            <p>{lesson.commonMistake}</p>
          </div>
        </section>

        <section className="panel lesson-practice">
          <div>
            <span className="panel-kicker">單元練習</span>
            <h2>現在試一題</h2>
            <p>題目會直接對應這個單元的概念，答完立刻看到解釋。</p>
          </div>
          <div className="lesson-practice__actions">
            <span>{practiceQuestions.length} 題</span>
            <a
              className="button button--primary"
              href={`#/practice/${lesson.id === 'operations' ? 'operations' : lesson.practiceTopic}`}
            >
              開始練習
              <ChevronRight size={17} aria-hidden="true" />
            </a>
          </div>
        </section>

        <div className="lesson-actions">
          <div>
            {previousLesson && (
              <a className="button button--ghost" href={`#/lessons/${previousLesson.id}`}>
                <ChevronLeft size={17} aria-hidden="true" />
                上一單元
              </a>
            )}
          </div>
          <div className="lesson-actions__right">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => onComplete(lesson.id)}
              disabled={completed}
            >
              <Check size={17} aria-hidden="true" />
              {completed ? '已完成' : '標記完成'}
            </button>
            {nextLesson ? (
              <a className="button button--primary" href={`#/lessons/${nextLesson.id}`}>
                下一單元
                <ChevronRight size={17} aria-hidden="true" />
              </a>
            ) : (
              <a className="button button--primary" href="#/practice">
                開始練習
                <ChevronRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        {!completed && (
          <p className="lesson-completion-hint">
            完成後按「標記完成」，進度會留在目前這台裝置。
          </p>
        )}
      </article>
    </div>
  );
}

export function LessonsPage({ lessonId }: { lessonId?: string }) {
  const { apiFetch } = useAuth();
  const [currentLessonId, setCurrentLessonId] = useState(
    lessonId ?? lessons[0]?.id
  );
  const [progress, setProgress] = useState<ProgressResponse | null>(null);

  const loadProgress = () => {
    void apiFetch<ProgressResponse>('/api/progress')
      .then(setProgress)
      .catch(() => setProgress(null));
  };

  useEffect(() => {
    if (lessonId) setCurrentLessonId(lessonId);
  }, [lessonId]);

  useEffect(() => {
    loadProgress();
  }, [apiFetch, currentLessonId]);

  const visitLesson = useCallback((id: string) => {
    void apiFetch<ProgressResponse>('/api/progress/lessons', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: id, mark_complete: false })
    })
      .then(setProgress)
      .catch(() => undefined);
  }, [apiFetch]);

  const completeLesson = useCallback((id: string) => {
    void apiFetch<ProgressResponse>('/api/progress/lessons', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: id, mark_complete: true })
    })
      .then(setProgress)
      .catch(() => undefined);
  }, [apiFetch]);

  const lesson = lessonByTopic(currentLessonId ?? '');

  if (!lesson) {
    return (
      <div className="page-heading">
        <div>
          <span className="eyebrow">找不到單元</span>
          <h1>請選擇一個課程主題</h1>
        </div>
        <a className="button button--primary" href="#/lessons">
          回到課程
        </a>
      </div>
    );
  }

  return (
    <LessonDetail
      key={lesson.id}
      lesson={lesson}
      completedLessons={
        progress?.completed_lessons.map((item) => item.lesson_id) ?? []
      }
      onComplete={completeLesson}
      onVisit={visitLesson}
    />
  );
}
