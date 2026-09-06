// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CoordinateLineLab } from './CoordinateLineLab';

afterEach(cleanup);

describe('CoordinateLineLab', () => {
  it('shows initial point calculations and equation', () => {
    render(<CoordinateLineLab />);
    expect(screen.getByText('兩點距離')).toBeTruthy();
    expect(screen.getByText('8.49')).toBeTruthy();
    expect(screen.getByText(/1x/)).toBeTruthy();
  });

  it('switches to slope-intercept mode', () => {
    render(<CoordinateLineLab />);
    fireEvent.click(screen.getByRole('button', { name: /y = mx \+ b/ }));
    expect(screen.getByRole('slider', { name: /第一條線斜率 m₁/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /y = mx \+ b/ }).getAttribute('aria-pressed')).toBe('true');
  });

  it('compares two perpendicular lines', () => {
    render(<CoordinateLineLab />);
    fireEvent.click(screen.getByRole('button', { name: '比較第二條線' }));
    expect(screen.getByText('兩線關係')).toBeTruthy();
    expect(screen.getByText('垂直')).toBeTruthy();
  });
});
