import { BarChart3, CircleAlert, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { clearQuizHistory, loadQuizHistory } from '../lib/storage';
import type { QuizResultRecord, QuizTopic } from '../types';

const topicLabels: Record<QuizTopic, string> = {
  'set-and-element': '集合與元素',
  membership: '元素關係',
  subset: '子集合與相等',
  'intersection-union': '交集與聯集',
  difference: '差集',
  complement: '補集'
};

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
  const latest = results[0];

  const clear = () => {
    clearQuizHistory();
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
              <button className="button button--danger" type="button" onClick={clear}>
                確認清除
              </button>
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
                {Object.entries(latest.topicScores).map(([topic, score]) => (
                  <div className="topic-result" key={topic}>
                    <div className="topic-result__label">
                      <strong>{topicLabels[topic as QuizTopic]}</strong>
                      <span>{score.correct} / {score.total}</span>
                    </div>
                    <div className="topic-result__track" aria-hidden="true">
                      <span
                        style={{
                          width: `${score.total === 0 ? 0 : (score.correct / score.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel result-count-card">
              <span className="panel-kicker">目前本機</span>
              <h2>{results.length} 次測驗紀錄</h2>
              <p>最多保留最近 30 次，可隨時下載或清除。</p>
              <a href="#/quiz" className="button button--primary">
                再做一次
              </a>
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
          清除後無法復原。請確認已下載需要的紀錄。
        </p>
      )}
    </div>
  );
}
