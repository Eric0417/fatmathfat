import {
  ArrowLeft,
  ChevronRight,
  ListChecks,
  Target
} from 'lucide-react';
import { QuestionRunner } from '../components/QuestionRunner';
import {
  mixedPracticeQuestions,
  questionsForLesson,
  questionsForTopic,
  topicLabels
} from '../data/questions';
import type { QuizTopic } from '../types';

const practiceTopics = Object.keys(topicLabels) as QuizTopic[];

function isQuizTopic(value: string | undefined): value is QuizTopic {
  return Boolean(value && value in topicLabels);
}

export function PracticePage({ topic }: { topic?: string }) {
  const selectedTopic =
    topic && topic !== 'mixed' && (isQuizTopic(topic) || topic === 'operations')
      ? topic
      : undefined;
  const practiceQuestions = selectedTopic
    ? selectedTopic === 'operations'
      ? questionsForLesson('operations')
      : questionsForTopic(selectedTopic)
    : mixedPracticeQuestions();
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
            {practiceQuestions.length} 題
          </span>
          <span>
            <Target size={16} aria-hidden="true" />
            即時回饋
          </span>
        </div>
      </div>

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
        questions={practiceQuestions}
        mode="practice"
        backLabel="回到練習選單"
        onBack={() => {
          if (selectedTopic) window.location.hash = '#/practice';
        }}
      />
    </div>
  );
}
