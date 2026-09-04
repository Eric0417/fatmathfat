import {
  ArrowLeft,
  ChevronRight,
  ListChecks,
  RefreshCw,
  Sparkles,
  Target
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { QuestionRunner } from '../components/QuestionRunner';
import {
  mixedPracticeQuestions,
  questionsForLesson,
  questionsForTopic,
  topicLabels
} from '../data/questions';
import type {
  PracticeProgressResponse,
  QuizQuestion,
  QuizTopic
} from '../types';

const practiceTopics = Object.keys(topicLabels) as QuizTopic[];

function isQuizTopic(value: string | undefined): value is QuizTopic {
  return Boolean(value && value in topicLabels);
}

export function PracticePage({ topic }: { topic?: string }) {
  const { apiFetch } = useAuth();
  const selectedTopic =
    topic && topic !== 'mixed' && (isQuizTopic(topic) || topic === 'operations')
      ? topic
      : undefined;
  const initialQuestions = selectedTopic
    ? selectedTopic === 'operations'
      ? questionsForLesson('operations')
      : questionsForTopic(selectedTopic)
    : mixedPracticeQuestions();
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setQuestions(initialQuestions);
    setGenerated(false);
    setError('');
  }, [selectedTopic]);
  const title =
    selectedTopic === 'operations'
      ? '交集、聯集與差集'
      : selectedTopic
        ? topicLabels[selectedTopic]
        : '綜合練習';

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {selectedTopic ? '單元練習' : '先選單元，也可直接做綜合練習'}
          </span>
          <h1>{title}</h1>
          <p>
            {selectedTopic
              ? '這一組題目會緊扣目前單元，答完立刻看正確答案與原因。'
              : '依概念挑選單元練習，或直接做一組跨單元的綜合練習。'}
          </p>
        </div>
        <div className="heading-meta">
          <span>
            <ListChecks size={16} aria-hidden="true" />
            {questions.length} 題
          </span>
          <span>
            <Target size={16} aria-hidden="true" />
            即時回饋
          </span>
          <button
            className="button button--ghost ai-practice-button"
            type="button"
            disabled={generating}
            onClick={() => {
              setGenerating(true);
              setError('');
              const aiTopic =
                selectedTopic === 'operations'
                  ? 'intersection-union'
                  : selectedTopic;
              void apiFetch<{ questions: QuizQuestion[] }>(
                '/api/ai/generate-practice',
                {
                  method: 'POST',
                  body: JSON.stringify({
                    topics: aiTopic ? [aiTopic] : [],
                    difficulty: 'standard',
                    count: 5
                  })
                }
              )
                .then((response) => {
                  setQuestions(response.questions);
                  setGenerated(true);
                })
                .catch((err) => {
                  setError(
                    err instanceof Error ? err.message : 'AI 練習生成失敗。'
                  );
                })
                .finally(() => setGenerating(false));
            }}
          >
            {generating ? (
              <RefreshCw className="spin" size={17} aria-hidden="true" />
            ) : (
              <Sparkles size={17} aria-hidden="true" />
            )}
            {generating ? '生成中...' : '生成弱點練習'}
          </button>
        </div>
      </div>

      {error && (
        <p className="confirmation-note" role="alert">
          {error}
        </p>
      )}

      {selectedTopic && (
        <a className="button button--ghost back-link" href="#/practice">
          <ArrowLeft size={17} aria-hidden="true" />
          回到綜合練習
        </a>
      )}

      <section className="practice-topic-picker" aria-label="選擇練習單元">
        <div className="section-heading">
          <h2>選擇單元</h2>
          <p>至少 5 題一組，題目難度以基礎與普通為主。</p>
        </div>
        <div className="practice-topic-list">
          {practiceTopics.map((topic) => {
            const count = questionsForTopic(topic).length;
            return (
              <a
                className={`practice-topic-card${selectedTopic === topic ? ' practice-topic-card--active' : ''}`}
                href={`#/practice/${topic}`}
                key={topic}
                aria-current={selectedTopic === topic ? 'page' : undefined}
              >
                <span>
                  <strong>{topicLabels[topic]}</strong>
                  <small>{count} 題</small>
                </span>
                <ChevronRight size={17} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>

      <QuestionRunner
        key={selectedTopic ?? 'mixed'}
        questions={questions}
        mode="practice"
        backLabel="回到練習選單"
        onComplete={(answers) => {
          const correct = questions.filter(
            (question) => answers[question.id] === question.answer
          ).length;
          void apiFetch<PracticeProgressResponse>('/api/progress/practice', {
            method: 'POST',
            body: JSON.stringify({
              source: generated ? 'ai_generated' : 'topic',
              topic: selectedTopic ?? 'mixed',
              correct,
              total: questions.length,
              duration_ms: 0
            })
          }).catch(() => undefined);
        }}
        onBack={() => {
          if (selectedTopic) window.location.hash = '#/practice';
        }}
      />
    </div>
  );
}
