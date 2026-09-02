import { ListChecks, Target } from 'lucide-react';
import { QuestionRunner } from '../components/QuestionRunner';
import { questions } from '../data/questions';

export function PracticePage() {
  const practiceQuestions = questions.slice(0, 10);

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">即時回饋</span>
          <h1>基礎練習</h1>
          <p>選完答案立即看到正確答案與錯誤原因，練習過程不會寫入任何成績。</p>
        </div>
        <div className="heading-meta">
          <span>
            <ListChecks size={16} aria-hidden="true" />
            10 題
          </span>
          <span>
            <Target size={16} aria-hidden="true" />
            全域：集合與元素、子集合、集合運算
          </span>
        </div>
      </div>
      <QuestionRunner questions={practiceQuestions} mode="practice" />
    </div>
  );
}
