import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { PracticePage } from './pages/PracticePage';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';

function currentRoute(): string {
  const hash = window.location.hash || '#/';
  return hash.replace(/^#/, '').split('?')[0];
}

export function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  let content: React.ReactNode;

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
  } else {
    content = <HomePage />;
  }

  return <AppShell route={route}>{content}</AppShell>;
}
