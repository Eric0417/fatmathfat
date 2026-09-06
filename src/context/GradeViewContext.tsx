import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { useAuth } from './AuthContext';
import { gradeOrDefault } from '../data/contentRegistry';
import type { GradeLevel } from '../types';

const TEACHER_GRADE_KEY = 'mathfatfat:teacher-grade-view';

interface GradeViewContextValue {
  grade: GradeLevel;
  isTeacherView: boolean;
  changeGrade: (grade: GradeLevel) => Promise<void>;
}

const GradeViewContext = createContext<GradeViewContextValue | null>(null);

function storedTeacherGrade(): GradeLevel {
  try {
    return localStorage.getItem(TEACHER_GRADE_KEY) === 'S5' ? 'S5' : 'S4';
  } catch {
    return 'S4';
  }
}

export function GradeViewProvider({ children }: { children: ReactNode }) {
  const { user, setGrade } = useAuth();
  const [grade, setGradeView] = useState<GradeLevel>('S4');
  const isTeacherView = user?.role === 'teacher';

  useEffect(() => {
    if (!user) {
      setGradeView('S4');
      return;
    }
    setGradeView(
      isTeacherView ? storedTeacherGrade() : gradeOrDefault(user.grade_level)
    );
  }, [isTeacherView, user]);

  const changeGrade = async (nextGrade: GradeLevel) => {
    if (isTeacherView) {
      setGradeView(nextGrade);
      try {
        localStorage.setItem(TEACHER_GRADE_KEY, nextGrade);
      } catch {
        // The current view still works until the next reload.
      }
      return;
    }
    const updatedUser = await setGrade(nextGrade);
    setGradeView(gradeOrDefault(updatedUser.grade_level));
  };

  const value = useMemo(
    () => ({
      grade,
      isTeacherView,
      changeGrade
    }),
    [grade, isTeacherView]
  );

  return (
    <GradeViewContext.Provider value={value}>
      {children}
    </GradeViewContext.Provider>
  );
}

export function useGradeView(): GradeViewContextValue {
  const context = useContext(GradeViewContext);
  if (!context) {
    throw new Error('useGradeView must be used inside GradeViewProvider.');
  }
  return context;
}
