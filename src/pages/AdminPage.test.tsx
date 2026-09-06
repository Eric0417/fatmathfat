// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { AdminPage } from './AdminPage';

const mocks = vi.hoisted(() => ({
  apiFetch: vi.fn()
}));

mocks.apiFetch.mockImplementation(async (path: string) => {
  if (path === '/api/admin/students') {
    return {
      total_students: 2,
      students: [
        {
          id: 1,
          email: 's4-student@g.puiching.edu.mo',
          role: 'student',
          grade_level: 'S4',
          last_login_at: null,
          last_seen_at: null,
          completed_lessons: [],
          practice_count: 0,
          quiz_count: 0,
          latest_quiz: null
        },
        {
          id: 2,
          email: 's5-student@g.puiching.edu.mo',
          role: 'student',
          grade_level: 'S5',
          last_login_at: null,
          last_seen_at: null,
          completed_lessons: [],
          practice_count: 0,
          quiz_count: 0,
          latest_quiz: null
        }
      ]
    };
  }
  if (path === '/api/admin/teachers') return [];
  throw new Error(`Unexpected path ${path}`);
});

vi.mock('../lib/api', () => ({
  apiFetch: mocks.apiFetch,
  ApiError: class ApiError extends Error {},
  clearToken: vi.fn(),
  getToken: vi.fn(() => null),
  setToken: vi.fn()
}));

describe('AdminPage grade filter', () => {
  it('can view students by S4, S5, or all grades', async () => {
    render(
      <AuthProvider>
        <AdminPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('s4-student@g.puiching.edu.mo')).toBeTruthy();
      expect(screen.getByText('s5-student@g.puiching.edu.mo')).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: /S5 1/ }));
    expect(screen.queryByText('s4-student@g.puiching.edu.mo')).toBeNull();
    expect(screen.getByText('s5-student@g.puiching.edu.mo')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /全部 2/ }));
    expect(screen.getByText('s4-student@g.puiching.edu.mo')).toBeTruthy();
    expect(screen.getByText('s5-student@g.puiching.edu.mo')).toBeTruthy();
  });
});
