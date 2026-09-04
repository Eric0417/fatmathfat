import {
  Bot,
  CircleAlert,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAiTeacher } from '../context/AiTeacherContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export function AiTeacherPanel() {
  const { apiFetch } = useAuth();
  const { context, quizActive } = useAiTeacher();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const send = async () => {
    const message = input.trim();
    if (!message || loading || quizActive) return;
    setError('');
    setMessages((current) => [...current, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);
    try {
      const response = await apiFetch<{ message: string }>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          context,
          quiz_active: quizActive
        })
      });
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: response.message }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 老師回應失敗。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`ai-teacher${open ? ' ai-teacher--open' : ''}`}>
      <button
        className="ai-teacher__launcher"
        type="button"
        aria-label="開啟 AI 老師"
        onClick={() => setOpen((current) => !current)}
      >
        <Sparkles size={21} aria-hidden="true" />
        <span>AI 老師</span>
      </button>

      {open && (
        <section
          className="ai-teacher__panel"
          aria-label="AI 老師對話"
        >
          <header className="ai-teacher__header">
            <div>
              <span className="ai-teacher__icon" aria-hidden="true">
                <Bot size={20} />
              </span>
              <div>
                <strong>AI 老師</strong>
                <small>{quizActive ? '測驗進行中' : '集合學習助手'}</small>
              </div>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="關閉 AI 老師"
              onClick={() => setOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="ai-teacher__body">
            {quizActive ? (
              <div className="ai-teacher__disabled" role="status">
                <CircleAlert size={19} aria-hidden="true" />
                測驗進行中不能使用 AI 老師。
              </div>
            ) : messages.length === 0 ? (
              <p className="ai-teacher__empty">
                你可以問集合的定義、符號或目前題目的提示。
              </p>
            ) : (
              <div className="ai-teacher__messages" aria-live="polite">
                {messages.map((item, index) => (
                  <div
                    className={`ai-message ai-message--${item.role}`}
                    key={`${item.role}-${index}`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ai-teacher__footer">
            {error && (
              <p className="ai-teacher__error" role="alert">
                <CircleAlert size={15} aria-hidden="true" />
                {error}
              </p>
            )}
            <div className="ai-teacher__input">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder="問問集合概念..."
                disabled={quizActive || loading}
                rows={2}
              />
              <button
                className="icon-button ai-teacher__send"
                type="button"
                aria-label="送出問題"
                disabled={!input.trim() || loading || quizActive}
                onClick={send}
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
