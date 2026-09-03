import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  RotateCcw,
  Timer
} from 'lucide-react';
import { useState } from 'react';
import { QuestionRunner } from '../components/QuestionRunner';
import { quizQuestions, topicLabels } from '../data/questions';
import { addQuizResult } from '../lib/storage';
import type { MistakeTag, QuizQuestion, QuizResultRecord, QuizTopic } from '../types';

const mistakeLabels: Record<MistakeTag, string> = {
  'union-intersection-confusion': '交集／聯集混淆',
  'duplicate-elements': '聯集重複列出元素',
  'element-vs-subset': '元素與子集合混淆',
  'forgot-universe': '補集漏看全集',
  'difference-direction': '差集方向錯誤',
  'proper-subset-confusion': '子集合／真子集合混淆',
  'empty-set-confusion': '空集合混淆'
};

const emptyTopicScores = (): Record<QuizTopic, { correct: number; total: number }> => ({
  'set-and-element': { correct: 0, total: 0 },
  membership: { correct: 0, total: 0 },
  representation: { correct: 0, total: 0 },
  'empty-set': { correct: 0, total: 0 },
  subset: { correct: 0, total: 0 },
  'intersection-union': { correct: 0, total: 0 },
  difference: { correct: 0, total: 0 },
  complement: { correct: 0, total: 0 }
});

function QuizSummary({
  result,
  onRetry
}: {
  result: QuizResultRecord;
  onRetry?: () => void;
}) {
  const weakTopics = Object.entries(result.topicScores)
    .filter(([, score]) => score.total > 0 && score.correct < score.total)
    .map(([topic]) => topic as QuizTopic);

  return (
    <div className="panel quiz-summary">
      <div className="quiz-summary__headline">
        <div className="score-ring" aria-label={`得分 ${result.score} 分`}>
          <strong>{result.score}</strong>
          <span>分</span>
        </div>
        <div>
          <span className="panel-kicker">學習表現與建議</span>
          <h2>答對 {result.correct} / {result.total} 題</h2>
          <p>結果已保存在目前裝置，不會與他人比較。</p>
        </div>
      </div>

      <div className="topic-results">
        {Object.entries(result.topicScores).map(([topic, score]) => {
          const label = topicLabels[topic as QuizTopic];
          const percentage = score.total === 0 ? 0 : Math.round((score.correct / score.total) * 100);
          return (
            <div className="topic-result" key={topic}>
              <div className="topic-result__label">
                <strong>{label}</strong>
                <span>{score.correct} / {score.total}</span>
              </div>
              <div className="topic-result__track" aria-hidden="true">
                <span style={{ width: `${percentage}%` }} />
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

      {result.mistakes.length > 0 ? (
        <div className="mistake-section">
          <h3>
            <CircleAlert size={18} aria-hidden="true" />
            需要再看一次
          </h3>
          <ul className="mistake-list">
            {result.mistakes.map((mistake, index) => (
              <li key={`${mistake.questionId}-${index}`}>
                <p>{quizQuestions.find((question) => question.id === mistake.questionId)?.prompt}</p>
                <strong>{index + 1}. 你選了「{mistake.selected}」</strong>
                <p>正確答案：「{mistake.answer}」</p>
                {mistake.tags.length > 0 && (
                  <div className="mistake-tags">
                    {mistake.tags.map((tag) => (
                      <span key={tag}>{mistakeLabels[tag]}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="all-correct">
          <CheckCircle2 size={19} aria-hidden="true" />
          這一組題目全部答對。
        </div>
      )}

      <div className="button-row quiz-summary__actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={onRetry}
          disabled={result.mistakes.length === 0}
        >
          {result.mistakes.length > 0 ? '錯題重做' : '沒有錯題'}
        </button>
        <a className="button button--ghost" href="#/lessons">
          回到學習頁
        </a>
      </div>
    </div>
  );
}

export function QuizPage() {
  const [started, setStarted] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState<QuizResultRecord | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [reviewQuestions, setReviewQuestions] = useState<QuizQuestion[] | null>(null);

  const start = () => {
    setResult(null);
    setStarted(true);
    setRunKey((key) => key + 1);
    setStartedAt(Date.now());
  };

  const complete = (answers: Record<string, string>) => {
    const topicScores = emptyTopicScores();
    const mistakes: QuizResultRecord['mistakes'] = [];
    let correct = 0;

    quizQuestions.forEach((question) => {
      const selected = answers[question.id];
      topicScores[question.topic].total += 1;
      if (selected === question.answer) {
        topicScores[question.topic].correct += 1;
        correct += 1;
      } else {
        mistakes.push({
          questionId: question.id,
          selected,
          answer: question.answer,
          tags: question.mistakeTags
        });
      }
    });

    const nextResult: QuizResultRecord = {
      id: `quiz-${Date.now()}`,
      completedAt: new Date().toISOString(),
      score: Math.round((correct / quizQuestions.length) * 100),
      correct,
      total: quizQuestions.length,
      durationMs: Date.now() - startedAt,
      topicScores,
      mistakes
    };

    addQuizResult(nextResult);
    setResult(nextResult);
    setStarted(false);
  };

  const wrongQuestions =
    result?.mistakes
      .map((mistake) =>
        quizQuestions.find((question) => question.id === mistake.questionId)
      )
      .filter((question): question is QuizQuestion => Boolean(question)) ?? [];

  if (reviewQuestions) {
    return (
      <div className="page-stack">
        <div className="page-heading">
          <div>
            <span className="eyebrow">錯題重做</span>
            <h1>重新練習這一組錯題</h1>
            <p>答題時會立即顯示正確答案、解釋與提示。</p>
          </div>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setReviewQuestions(null)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            返回測驗結果
          </button>
        </div>
        <QuestionRunner
          key={reviewQuestions.map((question) => question.id).join('-')}
          questions={reviewQuestions}
          mode="review"
          onBack={() => setReviewQuestions(null)}
          backLabel="返回測驗結果"
        />
      </div>
    );
  }

  if (started) {
    return (
      <div className="page-stack">
        <div className="page-heading">
          <div>
            <span className="eyebrow">綜合測驗</span>
            <h1>按自己的步調作答</h1>
            <p>完成後會依概念分類顯示結果，不提供排名。</p>
          </div>
          <div className="heading-meta">
            <span>
              <Timer size={16} aria-hidden="true" />
              完成後顯示作答時間
            </span>
          </div>
        </div>
        <QuestionRunner
          key={runKey}
          questions={quizQuestions}
          mode="quiz"
          onComplete={complete}
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">12 題 ・ 8 個概念</span>
          <h1>綜合測驗</h1>
          <p>測驗不以排名為目的，而是幫助你看出哪一類集合關係還需要更多練習。</p>
        </div>
      </div>

      <div className="panel quiz-intro">
        <div className="quiz-intro__icon">
          <ClipboardList size={28} aria-hidden="true" />
        </div>
        <div>
          <h2>準備好就開始</h2>
          <p>題目涵蓋：集合與元素、元素關係、集合表示法、空集合、子集合、交集、聯集、差集與補集。</p>
          <p>作答時不會立即顯示答案；完成後會顯示各概念的分數與錯題類型。</p>
        </div>
        <button className="button button--primary button--large" type="button" onClick={start}>
          開始測驗
        </button>
      </div>

      {result && (
        <QuizSummary
          result={result}
          onRetry={() => setReviewQuestions(wrongQuestions)}
        />
      )}
      {result && (
        <div className="button-row">
          <button className="button button--ghost" type="button" onClick={start}>
            <RotateCcw size={17} aria-hidden="true" />
            再測一次
          </button>
        </div>
      )}
    </div>
  );
}
