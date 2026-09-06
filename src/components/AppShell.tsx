import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Home,
  ListChecks,
  LogOut,
  Ruler,
  ShieldCheck,
  Shapes
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGradeView } from '../context/GradeViewContext';
import { AiTeacherPanel } from './AiTeacherPanel';
import type { GradeLevel } from '../types';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: string;
}

function navItemsForGrade(grade: GradeLevel): NavItem[] {
  const tool =
    grade === 'S5'
      ? { href: '#/s5-lab', label: '直線實驗室', icon: Ruler, match: '/s5-lab' }
      : { href: '#/explorer', label: '集合工具', icon: Shapes, match: '/explorer' };
  return [
    { href: '#/', label: '首頁', icon: Home, match: '/' },
    { href: '#/lessons', label: '課程', icon: BookOpen, match: '/lessons' },
    tool,
    { href: '#/practice', label: '練習', icon: ListChecks, match: '/practice' },
    { href: '#/quiz', label: '測驗', icon: ClipboardList, match: '/quiz' },
    { href: '#/results', label: '學習結果', icon: BarChart3, match: '/results' }
  ];
}

interface AppShellProps {
  route: string;
  children: React.ReactNode;
}

export function AppShell({ route, children }: AppShellProps) {
  const { user, logout } = useAuth();
  const { grade, changeGrade: switchGrade } = useGradeView();
  const [switchingGrade, setSwitchingGrade] = useState(false);
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
    ...navItemsForGrade(grade),
    ...(user?.role === 'teacher'
      ? [{ href: '#/admin', label: '管理', icon: ShieldCheck, match: '/admin' }]
      : [])
  ];

  const changeGrade = async (nextGrade: GradeLevel) => {
    if (switchingGrade || nextGrade === grade) return;
    setSwitchingGrade(true);
    try {
      await switchGrade(nextGrade);
      window.location.hash = '#/';
    } finally {
      setSwitchingGrade(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <a className="brand" href="#/" aria-label="數學好好學首頁">
            <span className="brand__mark" aria-hidden="true">
              {grade === 'S5' ? (
                <Ruler size={22} strokeWidth={2.2} />
              ) : (
                <Shapes size={22} strokeWidth={2.2} />
              )}
            </span>
            <span className="brand__text">
              <strong>數學好好學</strong>
              <small>
                {grade === 'S5'
                  ? 'S5 直線坐標幾何與互動解題'
                  : '集合概念視覺化與基礎解題'}
              </small>
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
              {user && (
                <div className="grade-switch" aria-label="切換年級">
                  {(['S4', 'S5'] as GradeLevel[]).map((level) => {
                    const Icon = level === 'S5' ? Ruler : Shapes;
                    return (
                      <button
                        key={level}
                        type="button"
                        data-grade={level}
                        className={`grade-switch__option${grade === level ? ' grade-switch__option--active' : ''}`}
                        disabled={switchingGrade}
                        aria-pressed={grade === level}
                        aria-label={`切換至 ${level} ${level === 'S5' ? '直線幾何' : '集合課程'}`}
                        title={`${level}：${level === 'S5' ? '直線坐標幾何' : '有限集合'}`}
                        onClick={() => void changeGrade(level)}
                      >
                        <Icon size={13} aria-hidden="true" />
                        <span>{level}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <button type="button" className="main-nav__logout" onClick={logout}>
                <LogOut size={16} aria-hidden="true" />
                <span>登出</span>
              </button>
            </div>
          </nav>
          {user && (
            <div className="mobile-grade-switch" aria-label="切換年級">
              {(['S4', 'S5'] as GradeLevel[]).map((level) => {
                const Icon = level === 'S5' ? Ruler : Shapes;
                return (
                  <button
                    key={level}
                    type="button"
                    data-grade={level}
                    className={`grade-switch__option${grade === level ? ' grade-switch__option--active' : ''}`}
                    disabled={switchingGrade}
                    aria-pressed={grade === level}
                    aria-label={`切換至 ${level} ${level === 'S5' ? '直線幾何' : '集合課程'}`}
                    title={`${level}：${level === 'S5' ? '直線坐標幾何' : '有限集合'}`}
                    onClick={() => void changeGrade(level)}
                  >
                    <Icon size={13} aria-hidden="true" />
                    <span>{level}</span>
                  </button>
                );
              })}
            </div>
          )}
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
          <p>
            {grade === 'S5'
              ? 'S5 專區：直線坐標幾何、互動實驗室與練習測驗。'
              : 'S4 專區：集合概念、互動 Venn 圖與練習測驗。'}
          </p>
          {grade === 'S4' && (
            <p>本網站統一使用 ⊆ 表示子集合，⊊ 表示真子集合；A ⊂ B 表示同義的子集合關係。</p>
          )}
          <p className="site-credit">developed by Eric Wong</p>
        </div>
      </footer>
    </div>
  );
}
