// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AiTeacherPanel } from './AiTeacherPanel';
import { AuthProvider } from '../context/AuthContext';
import { AiTeacherProvider } from '../context/AiTeacherContext';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('AiTeacherPanel', () => {
  it('shows a waiting state while the AI is responding', async () => {
    let resolveResponse: (() => void) | undefined;
    const fetchMock = vi.fn(() => {
      return new Promise<Response>((resolve) => {
        resolveResponse = () => {
          resolve({
            ok: true,
            status: 200,
            json: async () => ({ message: '交集是兩個集合共同擁有的元素。' })
          } as Response);
        };
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <AuthProvider>
        <AiTeacherProvider>
          <AiTeacherPanel />
        </AiTeacherProvider>
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: '開啟 AI 老師' }));
    fireEvent.change(screen.getByLabelText('向 AI 老師提問'), {
      target: { value: '交集是什麼？' }
    });
    fireEvent.click(screen.getByRole('button', { name: '送出問題' }));

    await screen.findByRole('status');
    expect(screen.getByRole('status').textContent).toContain('AI 正在回答...');
    expect(screen.getByLabelText('向 AI 老師提問').hasAttribute('disabled')).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveResponse?.();
    await screen.findByText('交集是兩個集合共同擁有的元素。');
    expect(screen.queryByText('AI 正在回答...')).toBeNull();
  });
});
