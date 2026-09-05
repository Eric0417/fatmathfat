import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CircleAlert,
  KeyRound,
  Mail,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export function LoginPage() {
  const { login } = useAuth();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const sendCode = async () => {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('請輸入郵箱。');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/auth/request-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });
      setStep('verify');
      setNotice('驗證碼已寄出，請檢查郵箱。');
      setCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : '寄送驗證碼失敗。');
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async () => {
    setError('');
    setNotice('');
    if (code.length !== 6) {
      setError('驗證碼必須是 6 位數字。');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), code);
      window.location.hash = '#/';
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="brand__mark auth-card__mark" aria-hidden="true">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </span>
          <div>
            <strong>集合好好學</strong>
            <small>學校專用學習區</small>
          </div>
        </div>

        <h1>{step === 'request' ? '登入' : '輸入驗證碼'}</h1>
        <p className="auth-card__subtitle">
          {step === 'request'
            ? '輸入你的學校郵箱以取得登入驗證碼。'
            : '我們已將 6 位驗證碼寄到你的郵箱。'}
        </p>

        {error && (
          <div className="auth-message auth-message--error" role="alert">
            <CircleAlert size={17} aria-hidden="true" />
            {error}
          </div>
        )}
        {notice && (
          <div className="auth-message auth-message--notice" role="status">
            <Mail size={17} aria-hidden="true" />
            {notice}
          </div>
        )}

        {step === 'request' ? (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              void sendCode();
            }}
          >
            <label htmlFor="login-email">學校郵箱</label>
            <div className="auth-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@g.puiching.edu.mo"
                required
              />
            </div>
            <button
              className="button button--primary auth-submit"
              type="submit"
              disabled={submitting || cooldown > 0}
            >
              <Send size={17} aria-hidden="true" />
              {cooldown > 0 ? `${cooldown} 秒後可再寄出` : '寄送驗證碼'}
            </button>
          </form>
        ) : (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              void verifyCode();
            }}
          >
            <label htmlFor="login-code">驗證碼</label>
            <div className="auth-input-wrap">
              <KeyRound size={18} aria-hidden="true" />
              <input
                id="login-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="000000"
                autoComplete="one-time-code"
                autoFocus
                required
              />
            </div>
            <button
              className="button button--primary auth-submit"
              type="submit"
              disabled={submitting || code.length !== 6}
            >
              <ShieldCheck size={17} aria-hidden="true" />
              {submitting ? '登入中...' : '登入'}
            </button>
            <button
              className="auth-back"
              type="button"
              onClick={() => {
                setStep('request');
                setError('');
                setNotice('');
              }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              返回輸入郵箱
            </button>
          </form>
        )}

        <p className="auth-card__footnote">
          學生使用 7 位數字-1 位數字的學校郵箱；教師使用 @puiching.edu.mo 學校郵箱。
        </p>
      </div>
    </div>
  );
}
