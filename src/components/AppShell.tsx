import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Home,
  ListChecks,
  Shapes
} from 'lucide-react';

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
  const isActive = (item: NavItem) => {
    if (item.match === '/') return route === '/' || route === '';
    return route.startsWith(item.match);
  };

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
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.match}
                  className="main-nav__link"
                  href={item.href}
                  aria-current={isActive(item) ? 'page' : undefined}
                >
                  <Icon size={17} strokeWidth={2} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <p>免登入、免後端。學習紀錄只保存在目前使用中的裝置。</p>
          <p>本網站統一使用 ⊆ 表示子集合，⊊ 表示真子集合；A ⊂ B 表示同義的子集合關係。</p>
        </div>
      </footer>
    </div>
  );
}
