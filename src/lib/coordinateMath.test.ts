import { describe, expect, it } from 'vitest';
import {
  acuteAngleBetweenLines,
  distanceBetween,
  distancePointToLine,
  formatLinearEquation,
  intersectionOfLines,
  lineAngleDegrees,
  lineFromPoints,
  lineFromSlopeIntercept,
  midpoint,
  relationBetweenLines,
  sectionPoint,
  slopeBetween,
  triangleArea
} from './coordinateMath';

describe('coordinate math', () => {
  it('calculates slope, distance, midpoint and section point', () => {
    const a = { x: -3, y: -2 };
    const b = { x: 5, y: 4 };
    expect(slopeBetween(a, b)).toBe(0.75);
    expect(distanceBetween(a, b)).toBe(10);
    expect(midpoint(a, b)).toEqual({ x: 1, y: 1 });
    expect(sectionPoint(a, b, 2)).toEqual({ x: 7 / 3, y: 2 });
    expect(sectionPoint(a, b, -1)).toBeNull();
  });

  it('returns undefined slope and vertical line for equal x values', () => {
    const line = lineFromPoints({ x: 2, y: -1 }, { x: 2, y: 5 });
    expect(line?.vertical).toBe(true);
    expect(line?.slope).toBeNull();
    expect(formatLinearEquation(line!)).toBe('x = 2');
  });

  it('builds and formats a line from two points', () => {
    const line = lineFromPoints({ x: -3, y: -2 }, { x: 5, y: 4 });
    expect(line).not.toBeNull();
    expect(lineAngleDegrees(line!)).toBeCloseTo(36.87, 2);
    expect(formatLinearEquation(line!)).toContain('0.75x');
  });

  it('classifies line relationships and finds intersections', () => {
    const base = lineFromSlopeIntercept(1, 0);
    const parallel = lineFromSlopeIntercept(1, 3);
    const perpendicular = lineFromSlopeIntercept(-1, 2);
    expect(relationBetweenLines(base, parallel)).toBe('parallel');
    expect(relationBetweenLines(base, perpendicular)).toBe('perpendicular');
    expect(intersectionOfLines(base, perpendicular)).toEqual({ x: 1, y: 1 });
    expect(acuteAngleBetweenLines(base, perpendicular)).toBe(90);
  });

  it('calculates triangle area and point-line distance', () => {
    expect(
      triangleArea({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 })
    ).toBe(6);
    expect(distancePointToLine({ x: 0, y: 0 }, lineFromSlopeIntercept(0, 2))).toBe(2);
  });
});
