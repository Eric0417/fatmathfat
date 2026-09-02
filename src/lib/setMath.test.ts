import { describe, expect, it } from 'vitest';
import {
  checkSetRelations,
  complement,
  difference,
  formatSet,
  intersection,
  isProperSubset,
  isSubset,
  membershipFor,
  operationResult,
  union
} from './setMath';
import type { SetState } from '../types';

describe('set math', () => {
  it('calculates intersections, unions, differences and complements', () => {
    const a = [1, 2, 3, 4];
    const b = [3, 4, 5, 6];
    const universe = [1, 2, 3, 4, 5, 6, 7, 8];

    expect(intersection(a, b)).toEqual([3, 4]);
    expect(union(a, b)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(difference(a, b)).toEqual([1, 2]);
    expect(difference(b, a)).toEqual([5, 6]);
    expect(complement(universe, a)).toEqual([5, 6, 7, 8]);
  });

  it('normalizes duplicate and unordered values', () => {
    expect(union([3, 1, 1], [2, 3, 1])).toEqual([1, 2, 3]);
    expect(formatSet([])).toBe('∅');
    expect(formatSet([3, 1, 2])).toBe('{1, 2, 3}');
  });

  it('distinguishes subset, proper subset and equality', () => {
    expect(isSubset([1, 2], [1, 2, 3])).toBe(true);
    expect(isProperSubset([1, 2], [1, 2, 3])).toBe(true);
    expect(checkSetRelations([1, 2], [1, 2, 3])).toEqual({
      subset: true,
      properSubset: true,
      equal: false,
      reverseSubset: false
    });
    expect(checkSetRelations([1, 2], [2, 1])).toEqual({
      subset: true,
      properSubset: false,
      equal: true,
      reverseSubset: true
    });
  });

  it('classifies Venn membership and operation results', () => {
    const state: SetState = {
      universe: [1, 2, 3, 4, 5],
      a: [1, 2, 3],
      b: [2, 3, 4]
    };

    expect(membershipFor(1, state)).toBe('a');
    expect(membershipFor(4, state)).toBe('b');
    expect(membershipFor(2, state)).toBe('both');
    expect(membershipFor(5, state)).toBe('outside');
    expect(operationResult('intersection', state)).toEqual([2, 3]);
    expect(operationResult('union', state)).toEqual([1, 2, 3, 4]);
    expect(operationResult('complement', state)).toEqual([4, 5]);
  });
});
