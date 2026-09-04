import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AiTeacherProvider } from './context/AiTeacherContext';
import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { PracticePage } from './pages/PracticePage';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

function currentRoute(): string {
  const hash = window.location.hash || '#/';
  return hash.replace(/^#/, '').split('?')[0];
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (user && route === '/login') {
      window.location.hash = '#/';
    }
  }, [user, route]);

  let content: React.ReactNode;

  if (loading) {
    return (
      <div className="auth-loading" role="status">
        正在載入...
      </div>
    );
  }

  if (!user || route === '/login') {
    return <LoginPage />;
  }

  if (route === '/' || route === '') {
    content = <HomePage />;
  } else if (route === '/lessons') {
    content = <LessonsPage />;
  } else if (route.startsWith('/lessons/')) {
    content = <LessonsPage lessonId={route.split('/')[2]} />;
  } else if (route === '/explorer') {
    content = <ExplorerPage />;
  } else if (route === '/practice') {
    content = <PracticePage />;
  } else if (route.startsWith('/practice/')) {
    content = <PracticePage topic={route.split('/')[2]} />;
  } else if (route === '/quiz') {
    content = <QuizPage />;
  } else if (route === '/results') {
    content = <ResultsPage />;
  } else if (route === '/admin') {
    if (user.role !== 'teacher') {
      return (
        <AppShell route={route}>
          <div className="page-stack">
            <div className="page-heading">
              <div>
                <span className="eyebrow">權限不足</span>
                <h1>管理員專區</h1>
                <p>只有管理員可以查看學生學習數據。</p>
              </div>
            </div>
          </div>
        </AppShell>
      );
    }
    content = <AdminPage />;
  } else {
    content = <HomePage />;
  }

  return <AppShell route={route}>{content}</AppShell>;
}

export function App() {
  return (
    <AuthProvider>
      <AiTeacherProvider>
        <AppRoutes />
      </AiTeacherProvider>
    </AuthProvider>
  );
}
