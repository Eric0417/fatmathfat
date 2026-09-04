import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { AiQuestionContext } from '../types';

interface AiTeacherContextValue {
  context: AiQuestionContext;
  quizActive: boolean;
  setContext: (context: AiQuestionContext) => void;
  setQuizActive: (active: boolean) => void;
}

const AiTeacherContext = createContext<AiTeacherContextValue | null>(null);

export function AiTeacherProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<AiQuestionContext>({
    route: '',
    choices: [],
    answered: false,
    allow_answer: false
  });
  const [quizActive, setQuizActive] = useState(false);

  const value = useMemo(
    () => ({
      context,
      quizActive,
      setContext,
      setQuizActive
    }),
    [context, quizActive]
  );

  return (
    <AiTeacherContext.Provider value={value}>
      {children}
    </AiTeacherContext.Provider>
  );
}

export function useAiTeacher(): AiTeacherContextValue {
  const context = useContext(AiTeacherContext);
  if (!context) {
    throw new Error('useAiTeacher must be used inside AiTeacherProvider.');
  }
  return context;
}
