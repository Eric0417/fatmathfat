import type { CartesianPoint, LinearEquation } from '../types';

const EPSILON = 1e-9;

export function slopeBetween(
  first: CartesianPoint,
  second: CartesianPoint
): number | null {
  if (Math.abs(second.x - first.x) < EPSILON) return null;
  return (second.y - first.y) / (second.x - first.x);
}

export function distanceBetween(
  first: CartesianPoint,
  second: CartesianPoint
): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

export function midpoint(
  first: CartesianPoint,
  second: CartesianPoint
): CartesianPoint {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2
  };
}

export function sectionPoint(
  first: CartesianPoint,
  second: CartesianPoint,
  ratio: number
): CartesianPoint | null {
  if (Math.abs(ratio + 1) < EPSILON) return null;
  const denominator = 1 + ratio;
  return {
    x: (first.x + ratio * second.x) / denominator,
    y: (first.y + ratio * second.y) / denominator
  };
}

export function triangleArea(
  first: CartesianPoint,
  second: CartesianPoint,
  third: CartesianPoint
): number {
  const crossProduct =
    first.x * (second.y - third.y) +
    second.x * (third.y - first.y) +
    third.x * (first.y - second.y);
  return Math.abs(crossProduct) / 2;
}

export function lineFromSlopeIntercept(
  slope: number,
  yIntercept: number
): LinearEquation {
  return {
    a: -slope,
    b: 1,
    c: -yIntercept,
    slope,
    vertical: false,
    xIntercept: Math.abs(slope) < EPSILON ? null : -yIntercept / slope,
    yIntercept
  };
}

export function lineFromPoints(
  first: CartesianPoint,
  second: CartesianPoint
): LinearEquation | null {
  const slope = slopeBetween(first, second);
  if (slope === null) {
    if (
      Math.abs(first.x - second.x) < EPSILON &&
      Math.abs(first.y - second.y) < EPSILON
    ) {
      return null;
    }
    return {
      a: 1,
      b: 0,
      c: -first.x,
      slope: null,
      vertical: true,
      xIntercept: first.x,
      yIntercept: null
    };
  }
  return lineFromSlopeIntercept(slope, first.y - slope * first.x);
}

export function relationBetweenLines(
  first: LinearEquation,
  second: LinearEquation
): 'coincident' | 'parallel' | 'perpendicular' | 'intersecting' {
  const determinant = first.a * second.b - second.a * first.b;
  if (Math.abs(determinant) < EPSILON) {
    const sameIntercept =
      Math.abs(first.c * second.b - second.c * first.b) < EPSILON &&
      Math.abs(first.a * second.c - second.a * first.c) < EPSILON;
    return sameIntercept ? 'coincident' : 'parallel';
  }
  if (
    first.slope !== null &&
    second.slope !== null &&
    Math.abs(first.slope * second.slope + 1) < EPSILON
  ) {
    return 'perpendicular';
  }
  return 'intersecting';
}

export function intersectionOfLines(
  first: LinearEquation,
  second: LinearEquation
): CartesianPoint | null {
  const determinant = first.a * second.b - second.a * first.b;
  if (Math.abs(determinant) < EPSILON) return null;
  return {
    x: (first.b * second.c - second.b * first.c) / determinant,
    y: (second.a * first.c - first.a * second.c) / determinant
  };
}

export function lineAngleDegrees(
  line: LinearEquation
): number {
  if (line.vertical) return 90;
  const slope = line.slope ?? 0;
  const angle = (Math.atan(slope) * 180) / Math.PI;
  return angle < 0 ? angle + 180 : angle;
}

export function acuteAngleBetweenLines(
  first: LinearEquation,
  second: LinearEquation
): number {
  const relation = relationBetweenLines(first, second);
  if (relation === 'parallel' || relation === 'coincident') return 0;

  if (first.vertical) {
    const otherSlope = second.slope ?? 0;
    return 90 - (Math.atan(Math.abs(otherSlope)) * 180) / Math.PI;
  }
  if (second.vertical) {
    const otherSlope = first.slope ?? 0;
    return 90 - (Math.atan(Math.abs(otherSlope)) * 180) / Math.PI;
  }

  const firstSlope = first.slope ?? 0;
  const secondSlope = second.slope ?? 0;
  if (Math.abs(firstSlope * secondSlope + 1) < EPSILON) return 90;
  const tangent =
    Math.abs((secondSlope - firstSlope) / (1 + firstSlope * secondSlope));
  return (Math.atan(tangent) * 180) / Math.PI;
}

export function distancePointToLine(
  point: CartesianPoint,
  line: LinearEquation
): number {
  const denominator = Math.hypot(line.a, line.b);
  if (denominator < EPSILON) return 0;
  return Math.abs(line.a * point.x + line.b * point.y + line.c) / denominator;
}

export function formatNumber(value: number, digits = 2): string {
  const rounded = Number(value.toFixed(digits));
  return String(rounded === 0 ? 0 : rounded);
}

export function formatLinearEquation(line: LinearEquation): string {
  if (line.vertical) {
    return `x = ${formatNumber(line.xIntercept ?? 0)}`;
  }
  const slope = line.slope ?? 0;
  const yIntercept = line.yIntercept ?? 0;
  if (Math.abs(slope) < EPSILON) {
    return `y = ${formatNumber(yIntercept)}`;
  }
  const interceptText =
    yIntercept > EPSILON
      ? ` + ${formatNumber(yIntercept)}`
      : yIntercept < -EPSILON
        ? ` - ${formatNumber(Math.abs(yIntercept))}`
        : '';
  return `y = ${formatNumber(slope)}x${interceptText}`;
}
