import {
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardList,
  ListChecks,
  Shapes
} from 'lucide-react';
import { lessons, lessonByTopic } from '../data/curriculum';
import {
  loadCompletedLessons,
  loadLastLesson,
  loadQuizHistory
} from '../lib/storage';
import { VennDiagram } from '../components/VennDiagram';

const previewState = {
  universe: [1, 2, 3, 4, 5, 6, 7, 8],
  a: [1, 2, 3, 4],
  b: [3, 4, 5, 6]
};

export function HomePage() {
  const completed = loadCompletedLessons().length;
  const latestResult = loadQuizHistory()[0];
  const lastLesson = loadLastLesson();
  const lastLessonTitle = lastLesson ? lessonByTopic(lastLesson)?.title : undefined;

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">有限集合 ・ 圖形 ・ 符號 ・ 語言</span>
          <h1>集合概念視覺化與基礎解題</h1>
          <p>
            先操作元素，再看 Venn 圖，最後對照數學符號與中文解釋。
          </p>
        </div>
        <a className="button button--primary button--large" href="#/lessons/set">
          <BookOpen size={18} aria-hidden="true" />
          開始學習
          <ChevronRight size={18} aria-hidden="true" />
        </a>
      </div>

      <div className="home-notice" role="note" aria-label="使用說明">
        <span>不需要登入，學習紀錄只保存在目前這台裝置。</span>
        <span>可以依序學習，也可以直接操作集合工具。</span>
      </div>

      <section className="home-overview" aria-label="學習入口">
        <div className="panel home-overview__intro">
          <div className="home-metrics" aria-label="目前進度">
            <div className="metric">
              <span className="metric__value">{completed}</span>
              <span className="metric__label">已完成單元</span>
            </div>
            <div className="metric">
              <span className="metric__value">{lessons.length}</span>
              <span className="metric__label">總單元數</span>
            </div>
            <div className="metric">
              <span className="metric__value">{latestResult ? `${latestResult.score} 分` : '—'}</span>
              <span className="metric__label">最近測驗</span>
            </div>
          </div>
          <div className="home-overview__links">
            <a className="quick-link" href="#/explorer">
              <Shapes size={18} aria-hidden="true" />
              <span>
                <strong>集合工具</strong>
                <small>自己放元素、切換運算</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </a>
            <a className="quick-link" href="#/practice">
              <ListChecks size={18} aria-hidden="true" />
              <span>
                <strong>基礎練習</strong>
                <small>即時看錯誤解釋</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </a>
            <a className="quick-link" href="#/quiz">
              <ClipboardList size={18} aria-hidden="true" />
              <span>
                <strong>綜合測驗</strong>
                <small>按概念看學習結果</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </a>
            <a className="quick-link" href="#/results">
              <BarChart3 size={18} aria-hidden="true" />
              <span>
                <strong>學習結果</strong>
                <small>{lastLessonTitle ? `上次看到：${lastLessonTitle}` : '查看分數與單元進度'}</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="panel home-overview__visual">
          <div className="panel-heading">
            <span className="panel-kicker">實際操作預覽</span>
            <h2>A ∩ B 與 A ∪ B</h2>
          </div>
          <VennDiagram state={previewState} operation="intersection" />
          <div className="legend-row" aria-label="顏色圖例">
            <span className="legend-item legend-item--blue">集合 A</span>
            <span className="legend-item legend-item--orange">集合 B</span>
            <span className="legend-item legend-item--green">交集區域</span>
          </div>
        </div>
      </section>

      <section className="concept-strip" aria-labelledby="concept-heading">
        <div className="section-heading">
          <h2 id="concept-heading">從哪裡開始</h2>
          <p>七個單元，每個都保持「例子 → 操作 → 定義 → 練習」的節奏。</p>
        </div>
        <div className="concept-list">
          {lessons.map((lesson) => (
            <a className="concept-card" href={`#/lessons/${lesson.id}`} key={lesson.id}>
              <span className={`concept-card__number concept-card__number--${lesson.color}`}>
                {String(lesson.order).padStart(2, '0')}
              </span>
              <span>
                <strong>{lesson.title}</strong>
                <small>{lesson.summary}</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
