import { ArrowLeft, ArrowRight, Check, CircleHelp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAiTeacher } from '../context/AiTeacherContext';
import { VennDiagram } from './VennDiagram';
import {
  difficultyLabels,
  questionKindLabels,
  topicLabels
} from '../data/questions';
import { formatSet } from '../lib/setMath';
import type { QuizQuestion } from '../types';

interface QuestionRunnerProps {
  questions: QuizQuestion[];
  mode: 'practice' | 'quiz' | 'review';
  quizSessionId?: string | null;
  onComplete?: (answers: Record<string, string>) => void;
  onBack?: () => void;
  backLabel?: string;
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
  quizSessionId = null,
  onComplete,
  onBack,
  backLabel
}: QuestionRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const { setContext, setQuizActive, setQuizSessionId } = useAiTeacher();
  const question = questions[index];
  const isLast = index === questions.length - 1;

  useEffect(() => {
    const route = window.location.hash.replace(/^#/, '').split('?')[0];
    setQuizActive(mode === 'quiz' && !finished);
    setQuizSessionId(mode === 'quiz' && !finished ? quizSessionId : null);
    const currentQuestion = finished ? null : question;
    setContext({
      route,
      lesson_id: currentQuestion?.topic ?? null,
      topic: currentQuestion?.topic ?? null,
      question_id: currentQuestion?.id ?? null,
      prompt: currentQuestion?.prompt ?? null,
      kind: currentQuestion?.kind ?? null,
      difficulty: currentQuestion?.difficulty ?? null,
      choices: currentQuestion?.choices ?? [],
      selected,
      answered: finished ? true : checked,
      allow_answer: !finished && mode !== 'quiz' && checked
    });
  }, [
    checked,
    finished,
    mode,
    question,
    selected,
    setContext,
    setQuizActive,
    setQuizSessionId,
    quizSessionId
  ]);

  useEffect(() => {
    return () => {
      setQuizActive(false);
      setQuizSessionId(null);
      setContext({
        route: '',
        choices: [],
        question_id: null,
        answered: false,
        allow_answer: false
      });
    };
  }, [setContext, setQuizActive, setQuizSessionId]);

  if (finished) {
    return (
      <div className="empty-state" role="status">
        <Check size={28} aria-hidden="true" />
        <h2>
          {mode === 'quiz' ? '測驗完成' : mode === 'review' ? '錯題重做完成' : '練習完成'}
        </h2>
        <p>
          {mode === 'quiz'
            ? '正在整理你的學習結果。'
            : mode === 'review'
              ? '你已完成這一組錯題練習。'
              : '你已經看完這一組練習。'}
        </p>
        {onBack && (
          <button className="button button--ghost" type="button" onClick={onBack}>
            <ArrowLeft size={17} aria-hidden="true" />
            {backLabel ?? '返回'}
          </button>
        )}
      </div>
    );
  }

  if (!question) return null;

  const setAnswer = (value: string) => {
    if (mode !== 'quiz' && checked) return;
    setSelected(value);
    if (mode !== 'quiz') {
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
        const finalAnswers = { ...answers, [question.id]: selected };
        setAnswers(finalAnswers);
        setFinished(true);
        onComplete?.(finalAnswers);
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
          {mode === 'practice'
            ? '基礎練習'
            : mode === 'review'
              ? '錯題重做'
              : '綜合測驗'}
        </span>
        <h2 id="question-title">{question.prompt}</h2>
        <QuestionData question={question} />
        <div className="question-runner__meta" aria-label="題目資訊">
          <span>{topicLabels[question.topic]}</span>
          <span>{questionKindLabels[question.kind]}</span>
          <span>{difficultyLabels[question.difficulty]}</span>
        </div>
        {question.venn && (
          <div className="question-venn">
            <VennDiagram
              state={question.venn}
              operation={question.vennOperation}
              ariaLabel={`Venn 圖：A 為 ${formatSet(question.venn.a)}，B 為 ${formatSet(question.venn.b)}，U 為 ${formatSet(question.venn.universe)}`}
            />
          </div>
        )}

        <div className="choice-list" role="group" aria-label="選擇答案">
          {question.choices.map((choice) => {
            const isSelected = selected === choice;
            const isAnswer = mode !== 'quiz' && checked && choice === question.answer;
            const isWrong = mode !== 'quiz' && checked && isSelected && !isCorrect;
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

        {mode !== 'quiz' && checked && (
          <div
            className={`feedback feedback--${isCorrect ? 'correct' : 'incorrect'}`}
            role="status"
            aria-live="polite"
          >
            <strong>{isCorrect ? '正確' : '再想一次'}</strong>
            <p>{question.explanation}</p>
            {question.hint && <p className="feedback__hint">提示：{question.hint}</p>}
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
              : mode !== 'quiz' && checked
                ? '下一題'
                : '確認答案'}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
