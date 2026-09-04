import {
  Bot,
  CircleAlert,
  LoaderCircle,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAiTeacher } from '../context/AiTeacherContext';

interface ChatMessage {
  id: number;
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
  const [revealing, setRevealing] = useState(false);
  const [revealedText, setRevealedText] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messageIdRef = useRef(1);
  const revealTimerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && !loading && !quizActive) {
      inputRef.current?.focus();
    }
  }, [open, loading, quizActive]);

  useEffect(() => {
    const element = messagesEndRef.current;
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, loading, revealing, revealedText]);

  useEffect(
    () => () => {
      if (revealTimerRef.current !== null) {
        window.clearInterval(revealTimerRef.current);
      }
    },
    []
  );

  const startRevealing = (text: string) => {
    setRevealing(true);
    setRevealedText('');
    let index = 0;
    const step = Math.max(1, Math.ceil(text.length / 70));
    revealTimerRef.current = window.setInterval(() => {
      index = Math.min(text.length, index + step);
      setRevealedText(text.slice(0, index));
      if (index >= text.length) {
        if (revealTimerRef.current !== null) {
          window.clearInterval(revealTimerRef.current);
          revealTimerRef.current = null;
        }
        setRevealing(false);
        setRevealedText('');
        setMessages((current) => [
          ...current,
          {
            id: messageIdRef.current++,
            role: 'assistant',
            text
          }
        ]);
      }
    }, 18);
  };

  const send = async () => {
    const message = input.trim();
    if (!message || loading || revealing || quizActive) return;
    setError('');
    setMessages((current) => [
      ...current,
      {
        id: messageIdRef.current++,
        role: 'user',
        text: message
      }
    ]);
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
      startRevealing(response.message);
    } catch (err) {
      setRevealing(false);
      setRevealedText('');
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
            ) : messages.length === 0 && !loading && !revealing ? (
              <p className="ai-teacher__empty">
                你可以問集合的定義、符號或目前題目的提示。
              </p>
            ) : (
              <div className="ai-teacher__messages" aria-live="polite">
                {messages.map((item) => (
                  <div
                    className={`ai-message ai-message--${item.role}`}
                    key={item.id}
                  >
                    {item.text}
                  </div>
                ))}
                {loading && (
                  <div className="ai-message ai-message--assistant ai-teacher__typing" role="status">
                    <span className="ai-teacher__typing-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>AI 正在回答...</span>
                  </div>
                )}
                {revealing && (
                  <div className="ai-message ai-message--assistant ai-teacher__streaming" aria-live="polite">
                    <span>{revealedText}</span>
                    <span className="ai-teacher__streaming-caret" aria-hidden="true" />
                  </div>
                )}
                <div ref={messagesEndRef} />
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
            <div className={`ai-teacher__status${loading ? ' ai-teacher__status--loading' : ''}`} aria-live="polite">
              {loading && (
                <span>
                  <LoaderCircle size={14} className="ai-teacher__status-icon" aria-hidden="true" />
                  AI 正在整理回答...
                </span>
              )}
            </div>
            <div className="ai-teacher__input" aria-busy={loading}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (error) setError('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder={loading ? 'AI 正在回答...' : '問問集合概念...'}
                aria-label="向 AI 老師提問"
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
