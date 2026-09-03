import {
  ArrowLeft,
  BarChart3,
  CircleAlert,
  Download,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { QuestionRunner } from '../components/QuestionRunner';
import { lessons, lessonByTopic } from '../data/curriculum';
import { quizQuestions, topicLabels } from '../data/questions';
import {
  clearAllProgress,
  loadCompletedLessons,
  loadLastLesson,
  loadQuizHistory
} from '../lib/storage';
import type { QuizQuestion, QuizResultRecord, QuizTopic } from '../types';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-Hant', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function ResultTable({ results }: { results: QuizResultRecord[] }) {
  return (
    <div className="panel result-table-panel">
      <div className="panel-heading">
        <span className="panel-kicker">本機歷史紀錄</span>
        <h2>最近測驗</h2>
      </div>
      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>得分</th>
              <th>答對</th>
              <th>作答時間</th>
              <th>錯題類型</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{formatDate(result.completedAt)}</td>
                <td>{result.score} 分</td>
                <td>{result.correct} / {result.total}</td>
                <td>{Math.round(result.durationMs / 1000)} 秒</td>
                <td>
                  {result.mistakes.length > 0
                    ? `${result.mistakes.length} 題`
                    : '無'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ResultsPage() {
  const [results, setResults] = useState<QuizResultRecord[]>(() => loadQuizHistory());
  const [confirmClear, setConfirmClear] = useState(false);
  const [retryQuestions, setRetryQuestions] = useState<QuizQuestion[] | null>(null);
  const completedLessons = loadCompletedLessons();
  const lastLesson = loadLastLesson();
  const latest = results[0];
  const highest = results.length > 0 ? Math.max(...results.map((result) => result.score)) : null;
  const recentScore = latest?.score ?? null;
  const weakTopics = latest
    ? Object.entries(latest.topicScores)
        .filter(([, score]) => score.total > 0 && score.correct < score.total)
        .map(([topic]) => topic as QuizTopic)
    : [];
  const recentQuestions =
    latest?.mistakes
      .map((mistake) =>
        quizQuestions.find((question) => question.id === mistake.questionId)
      )
      .filter((question): question is QuizQuestion => Boolean(question)) ?? [];

  const clear = () => {
    clearAllProgress();
    setResults([]);
    setConfirmClear(false);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `集合好好學-學習紀錄-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (retryQuestions) {
    return (
      <div className="page-stack">
        <div className="page-heading">
          <div>
            <span className="eyebrow">錯題重做</span>
            <h1>重新練習最近一次的錯題</h1>
            <p>答題後會立即顯示正確答案與原因，這次練習不會重新計分。</p>
          </div>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setRetryQuestions(null)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            返回學習結果
          </button>
        </div>
        <QuestionRunner
          key={retryQuestions.map((question) => question.id).join('-')}
          questions={retryQuestions}
          mode="review"
          onBack={() => setRetryQuestions(null)}
          backLabel="返回學習結果"
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">只保留在目前裝置</span>
          <h1>我的學習結果</h1>
          <p>成績按概念分開顯示，不會比較或排名；換裝置不會自動同步。</p>
        </div>
        {results.length > 0 && (
          <div className="button-row">
            <button className="button button--ghost" type="button" onClick={download}>
              <Download size={17} aria-hidden="true" />
              下載 JSON
            </button>
            {confirmClear ? (
              <>
                <button className="button button--danger" type="button" onClick={clear}>
                  確認清除
                </button>
                <button className="button button--ghost" type="button" onClick={() => setConfirmClear(false)}>
                  取消
                </button>
              </>
            ) : (
              <button className="button button--ghost" type="button" onClick={() => setConfirmClear(true)}>
                <Trash2 size={17} aria-hidden="true" />
                清除本機紀錄
              </button>
            )}
          </div>
        )}
      </div>

      {latest ? (
        <>
          <section className="results-overview" aria-label="最近一次測驗">
            <div className="panel result-overview-card">
              <div className="result-overview-card__head">
                <div className="score-ring score-ring--large" aria-label={`得分 ${latest.score} 分`}>
                  <strong>{latest.score}</strong>
                  <span>分</span>
                </div>
                <div>
                  <span className="panel-kicker">最近一次</span>
                  <h2>答對 {latest.correct} / {latest.total} 題</h2>
                  <p>{formatDate(latest.completedAt)}</p>
                </div>
              </div>
              <div className="result-overview-card__topics">
                {Object.entries(latest.topicScores).map(([topic, score]) => {
                  const label = topicLabels[topic as QuizTopic];
                  if (!label || score.total === 0) return null;
                  return (
                    <div className="topic-result" key={topic}>
                      <div className="topic-result__label">
                        <strong>{label}</strong>
                        <span>{score.correct} / {score.total}</span>
                      </div>
                      <div className="topic-result__track" aria-hidden="true">
                        <span
                          style={{
                            width: `${(score.correct / score.total) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {weakTopics.length > 0 && (
                <div className="recommendation-section">
                  <h3>
                    <CircleAlert size={18} aria-hidden="true" />
                    建議重學內容
                  </h3>
                  <ul>
                    {weakTopics.map((topic) => (
                      <li key={topic}>
                        <a href={`#/practice/${topic}`}>
                          {topicLabels[topic]} 練習
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="button-row results-actions">
                <button
                  type="button"
                  className="button button--secondary"
                  disabled={recentQuestions.length === 0}
                  onClick={() => setRetryQuestions(recentQuestions)}
                >
                  {recentQuestions.length > 0 ? '錯題重做' : '沒有錯題'}
                </button>
                <a className="button button--ghost" href="#/lessons">
                  回到學習頁
                </a>
              </div>
            </div>
            <div className="panel result-count-card">
              <span className="panel-kicker">目前本機</span>
              <h2>{results.length} 次測驗紀錄</h2>
              <p>最多保留最近 30 次，可隨時下載或清除。</p>
              <div className="learning-stats">
                <div>
                  <strong>{highest ?? '—'}</strong>
                  <span>最高分</span>
                </div>
                <div>
                  <strong>{recentScore ?? '—'}</strong>
                  <span>最近分數</span>
                </div>
                <div>
                  <strong>{completedLessons.length} / {lessons.length}</strong>
                  <span>完成單元</span>
                </div>
              </div>
              <a href="#/quiz" className="button button--primary">
                再做一次
              </a>
            </div>
          </section>

          <section className="panel unit-progress-panel" aria-labelledby="unit-progress-title">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">單元完成狀態</span>
                <h2 id="unit-progress-title">各單元進度</h2>
              </div>
              <p className="learning-location">
                最近學習位置：
                {lastLesson ? lessonByTopic(lastLesson)?.title ?? '已離開課程' : '尚未開始'}
              </p>
            </div>
            <div className="unit-progress-list">
              {lessons.map((lesson) => {
                const completed = completedLessons.includes(lesson.id);
                return (
                  <div className={`unit-progress-row${completed ? ' unit-progress-row--completed' : ''}`} key={lesson.id}>
                    <span className="unit-progress-row__number">{String(lesson.order).padStart(2, '0')}</span>
                    <span>{lesson.title}</span>
                    <strong>{completed ? '已完成' : '未完成'}</strong>
                  </div>
                );
              })}
            </div>
          </section>

          <ResultTable results={results} />
        </>
      ) : (
        <div className="panel empty-state">
          <BarChart3 size={30} aria-hidden="true" />
          <h2>還沒有學習結果</h2>
          <p>完成一次綜合測驗後，這裡會顯示各概念的表現與錯題類型。</p>
          <a href="#/quiz" className="button button--primary">
            前往測驗
          </a>
        </div>
      )}

      {confirmClear && (
        <p className="confirmation-note" role="alert">
          <CircleAlert size={17} aria-hidden="true" />
          清除後將刪除這台裝置上的學習紀錄，且無法復原。
        </p>
      )}
    </div>
  );
}
