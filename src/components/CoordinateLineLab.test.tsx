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

  it('uses a smooth ratio slider and supports a custom lambda range', () => {
    render(<CoordinateLineLab />);
    const ratioSlider = screen.getByRole('slider', {
      name: '定比分點 λ 滑桿'
    });
    expect(Number(ratioSlider.getAttribute('step'))).toBeLessThan(0.5);
    expect(ratioSlider.getAttribute('min')).toBe('-5');
    expect(ratioSlider.getAttribute('max')).toBe('5');

    fireEvent.change(screen.getByLabelText('λ 下限'), {
      target: { value: '-2' }
    });
    fireEvent.change(screen.getByLabelText('λ 上限'), {
      target: { value: '4' }
    });

    expect(ratioSlider.getAttribute('min')).toBe('-2');
    expect(ratioSlider.getAttribute('max')).toBe('4');
  });
});
