import { ArrowLeft, ArrowRight, Check, CircleHelp } from 'lucide-react';
import { useState } from 'react';
import { formatSet } from '../lib/setMath';
import type { QuizQuestion } from '../types';

interface QuestionRunnerProps {
  questions: QuizQuestion[];
  mode: 'practice' | 'quiz';
  onComplete?: (answers: Record<string, string>) => void;
}

function QuestionData({ question }: { question: QuizQuestion }) {
  const rows = [
    question.universe ? ['U', formatSet(question.universe)] : null,
    question.setA ? ['A', formatSet(question.setA)] : null,
    question.setB ? ['B', formatSet(question.setB)] : null
  ].filter((row): row is [string, string] => Boolean(row));

  if (rows.length === 0) return null;

  return (
    <div className="question-data" aria-label="題目使用的集合">
      {rows.map(([label, value]) => (
        <div className="question-data__row" key={label}>
          <span>{label}</span>
          <code>{value}</code>
        </div>
      ))}
    </div>
  );
}

export function QuestionRunner({
  questions,
  mode,
  onComplete
}: QuestionRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  if (finished) {
    return (
      <div className="empty-state" role="status">
        <Check size={28} aria-hidden="true" />
        <h2>{mode === 'practice' ? '練習完成' : '測驗完成'}</h2>
        <p>{mode === 'practice' ? '你已經看完這一組練習。' : '正在整理你的學習結果。'}</p>
      </div>
    );
  }

  if (!question) return null;

  const setAnswer = (value: string) => {
    if (mode === 'practice' && checked) return;
    setSelected(value);
    if (mode === 'practice') {
      setChecked(true);
      setAnswers((current) => ({ ...current, [question.id]: value }));
    }
  };

  const next = () => {
    if (mode === 'quiz') {
      const nextAnswers = { ...answers, [question.id]: selected };
      setAnswers(nextAnswers);
      if (isLast) {
        setFinished(true);
        onComplete?.(nextAnswers);
      } else {
        setIndex((current) => current + 1);
      }
    } else {
      if (isLast) {
        setFinished(true);
      } else {
        setIndex((current) => current + 1);
      }
      setChecked(false);
    }
    setSelected('');
  };

  const isCorrect = selected === question.answer;

  return (
    <section className="question-runner" aria-labelledby="question-title">
      <div className="question-runner__progress">
        <div className="progress-track" aria-hidden="true">
          <span
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span>
          第 {index + 1} / {questions.length} 題
        </span>
      </div>

      <div className="question-runner__body">
        <span className="question-runner__kicker">
          <CircleHelp size={16} aria-hidden="true" />
          {mode === 'practice' ? '基礎練習' : '綜合測驗'}
        </span>
        <h2 id="question-title">{question.prompt}</h2>
        <QuestionData question={question} />

        <div className="choice-list" role="group" aria-label="選擇答案">
          {question.choices.map((choice) => {
            const isSelected = selected === choice;
            const isAnswer = mode === 'practice' && checked && choice === question.answer;
            const isWrong = mode === 'practice' && checked && isSelected && !isCorrect;
            return (
              <button
                key={choice}
                className={`choice-button${isSelected ? ' choice-button--selected' : ''}${
                  isAnswer ? ' choice-button--correct' : ''
                }${isWrong ? ' choice-button--wrong' : ''}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setAnswer(choice)}
              >
                <span className="choice-button__index">
                  {String.fromCharCode(65 + question.choices.indexOf(choice))}
                </span>
                <span>{choice}</span>
                {isAnswer && <Check size={18} aria-label="正確答案" />}
                {isWrong && <span aria-label="你選的答案">你選的</span>}
              </button>
            );
          })}
        </div>

        {mode === 'practice' && checked && (
          <div
            className={`feedback feedback--${isCorrect ? 'correct' : 'incorrect'}`}
            role="status"
            aria-live="polite"
          >
            <strong>{isCorrect ? '正確' : '再想一次'}</strong>
            <p>{question.explanation}</p>
          </div>
        )}

        <div className="question-runner__actions">
          <button
            type="button"
            className="button button--ghost"
            disabled={index === 0}
            onClick={() => {
              setIndex((current) => Math.max(0, current - 1));
              setSelected('');
              setChecked(false);
            }}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            上一題
          </button>
          <button
            type="button"
            className="button button--primary"
            disabled={!selected}
            onClick={next}
          >
            {mode === 'quiz' && isLast
              ? '完成測驗'
              : mode === 'practice' && checked
                ? '下一題'
                : '確認答案'}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
