// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { quizQuestions } from '../data/questions';
import { AiTeacherProvider, useAiTeacher } from '../context/AiTeacherContext';
import { QuestionRunner } from './QuestionRunner';

function Probe() {
  const { context, quizActive } = useAiTeacher();
  return (
    <output data-testid="ai-teacher-state">
      {JSON.stringify({
        quizActive,
        route: context.route,
        questionId: context.question_id
      })}
    </output>
  );
}

function Harness() {
  const [mounted, setMounted] = useState(true);
  return (
    <AiTeacherProvider>
      {mounted && (
        <QuestionRunner questions={[quizQuestions[0]]} mode="quiz" />
      )}
      <Probe />
      <button type="button" onClick={() => setMounted(false)}>
        unmount
      </button>
    </AiTeacherProvider>
  );
}

afterEach(cleanup);

describe('QuestionRunner AI state', () => {
  it('clears stale quiz state from AI teacher context on unmount', async () => {
    window.location.hash = '#/quiz';
    render(<Harness />);

    await screen.findByText(
      JSON.stringify({
        quizActive: true,
        route: '/quiz',
        questionId: quizQuestions[0].id
      })
    );

    fireEvent.click(screen.getByRole('button', { name: 'unmount' }));

    await screen.findByText(
      '{"quizActive":false,"route":"","questionId":null}'
    );
  });
});
