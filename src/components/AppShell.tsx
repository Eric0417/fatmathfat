import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Home,
  ListChecks,
  LogOut,
  ShieldCheck,
  Shapes
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AiTeacherPanel } from './AiTeacherPanel';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: string;
}

const navItems: NavItem[] = [
  { href: '#/', label: '首頁', icon: Home, match: '/' },
  { href: '#/lessons', label: '課程', icon: BookOpen, match: '/lessons' },
  { href: '#/explorer', label: '集合工具', icon: Shapes, match: '/explorer' },
  { href: '#/practice', label: '練習', icon: ListChecks, match: '/practice' },
  { href: '#/quiz', label: '測驗', icon: ClipboardList, match: '/quiz' },
  { href: '#/results', label: '學習結果', icon: BarChart3, match: '/results' }
];

interface AppShellProps {
  route: string;
  children: React.ReactNode;
}

export function AppShell({ route, children }: AppShellProps) {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isActive = (item: NavItem) => {
    if (item.match === '/') return route === '/' || route === '';
    return route.startsWith(item.match);
  };
  const itemsForRole = [
    ...navItems,
    ...(user?.role === 'teacher'
      ? [{ href: '#/admin', label: '管理', icon: ShieldCheck, match: '/admin' }]
      : [])
  ];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <a className="brand" href="#/" aria-label="集合好好學首頁">
            <span className="brand__mark" aria-hidden="true">
              <Shapes size={22} strokeWidth={2.2} />
            </span>
            <span className="brand__text">
              <strong>集合好好學</strong>
              <small>集合概念視覺化與基礎解題</small>
            </span>
          </a>
          <nav className="main-nav" aria-label="主要導覽">
            {itemsForRole.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.match}
                  className="main-nav__link"
                  href={item.href}
                  aria-current={isActive(item) ? 'page' : undefined}
                  aria-label={item.label}
                >
                  <Icon size={17} strokeWidth={2} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              );
            })}
            <div className="main-nav__account" aria-label="帳號">
              <span className="main-nav__email">{user?.email}</span>
              <button type="button" className="main-nav__logout" onClick={logout}>
                <LogOut size={16} aria-hidden="true" />
                <span>登出</span>
              </button>
            </div>
          </nav>
          <button
            className="mobile-account-logout"
            type="button"
            onClick={logout}
            aria-label="登出"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>登出</span>
          </button>
        </div>
      </header>

      <nav
        className={`mobile-nav${user?.role === 'teacher' ? ' mobile-nav--teacher' : ''}`}
        aria-label="手機主要導覽"
      >
        {itemsForRole.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.match}
              className="mobile-nav__link"
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {!isOnline && (
        <div className="offline-banner" role="status" aria-live="polite">
          目前離線。本網站需要連線才能登入與同步學習資料。
        </div>
      )}

      <main className="app-main">{children}</main>
      <AiTeacherPanel />

      <footer className="app-footer">
        <div className="app-footer__inner">
          <p>學校專用學習區，登入後會同步學習紀錄。</p>
          <p>本網站統一使用 ⊆ 表示子集合，⊊ 表示真子集合；A ⊂ B 表示同義的子集合關係。</p>
          <p className="site-credit">developed by Eric Wong</p>
        </div>
      </footer>
    </div>
  );
}
