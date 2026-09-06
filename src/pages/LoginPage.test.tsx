// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from './LoginPage';

vi.mock('../lib/api', () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {},
  clearToken: vi.fn(),
  getToken: vi.fn(() => null),
  setToken: vi.fn()
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('LoginPage grade selection', () => {
  it('shows S4 and S5 for a student email', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    fireEvent.change(screen.getByLabelText('學校郵箱'), {
      target: { value: '1234567-1@g.puiching.edu.mo' }
    });
    expect(screen.getByText('你的年級')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'S4' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'S5' })).toBeTruthy();
  });

  it('hides grade selection for a teacher email', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    fireEvent.change(screen.getByLabelText('學校郵箱'), {
      target: { value: 'teacher@puiching.edu.mo' }
    });
    expect(screen.queryByText('你的年級')).toBeNull();
  });
});
