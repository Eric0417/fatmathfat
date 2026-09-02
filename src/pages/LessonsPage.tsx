import { Check, ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { lessons, lessonByTopic } from '../data/curriculum';
import { loadCompletedLessons, saveCompletedLesson } from '../lib/storage';
import { VennDiagram } from '../components/VennDiagram';
import type { Lesson, SetOperation, SetState } from '../types';

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

function LessonDetail({ lesson }: { lesson: Lesson }) {
  const [completed, setCompleted] = useState(() =>
    loadCompletedLessons().includes(lesson.id)
  );
  const state = lessonDiagramState(lesson);
  const nextLesson = lessons.find((item) => item.order === lesson.order + 1);
  const previousLesson = lessons.find((item) => item.order === lesson.order - 1);

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
                {loadCompletedLessons().includes(item.id) && (
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
            <span className="panel-kicker">先看定義</span>
            <h2>用一句話抓住重點</h2>
          </div>
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
              onClick={() => {
                saveCompletedLesson(lesson.id);
                setCompleted(true);
              }}
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
  const [currentLessonId, setCurrentLessonId] = useState(
    lessonId ?? lessons[0]?.id
  );

  useEffect(() => {
    if (lessonId) setCurrentLessonId(lessonId);
  }, [lessonId]);

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

  return <LessonDetail key={lesson.id} lesson={lesson} />;
}
