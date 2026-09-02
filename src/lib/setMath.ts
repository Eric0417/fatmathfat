import type {
  Membership,
  SetOperation,
  SetState
} from '../types';

export function normalizeNumbers(values: number[]): number[] {
  return [...new Set(values)].filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
}

export function formatSet(values: number[]): string {
  const normalized = normalizeNumbers(values);
  return normalized.length === 0 ? '∅' : `{${normalized.join(', ')}}`;
}

export function membershipFor(value: number, state: SetState): Membership {
  const inA = state.a.includes(value);
  const inB = state.b.includes(value);

  if (inA && inB) return 'both';
  if (inA) return 'a';
  if (inB) return 'b';
  return 'outside';
}

export function isSubset(a: number[], b: number[]): boolean {
  return a.every((value) => b.includes(value));
}

export function isProperSubset(a: number[], b: number[]): boolean {
  return isSubset(a, b) && !isSubset(b, a);
}

export function areEqualSets(a: number[], b: number[]): boolean {
  return isSubset(a, b) && isSubset(b, a);
}

export function intersection(a: number[], b: number[]): number[] {
  return normalizeNumbers(a.filter((value) => b.includes(value)));
}

export function union(a: number[], b: number[]): number[] {
  return normalizeNumbers([...a, ...b]);
}

export function difference(a: number[], b: number[]): number[] {
  return normalizeNumbers(a.filter((value) => !b.includes(value)));
}

export function complement(universe: number[], source: number[]): number[] {
  return normalizeNumbers(universe.filter((value) => !source.includes(value)));
}

export function operationResult(operation: SetOperation, state: SetState): number[] {
  switch (operation) {
    case 'intersection':
      return intersection(state.a, state.b);
    case 'union':
      return union(state.a, state.b);
    case 'difference':
      return difference(state.a, state.b);
    case 'reverseDifference':
      return difference(state.b, state.a);
    case 'complement':
      return complement(state.universe, state.a);
  }
}

export function operationSymbol(operation: SetOperation): string {
  switch (operation) {
    case 'intersection':
      return 'A ∩ B';
    case 'union':
      return 'A ∪ B';
    case 'difference':
      return 'A − B';
    case 'reverseDifference':
      return 'B − A';
    case 'complement':
      return 'Aᶜ';
  }
}

export function operationLabel(operation: SetOperation): string {
  switch (operation) {
    case 'intersection':
      return 'A 和 B 的交集';
    case 'union':
      return 'A 和 B 的聯集';
    case 'difference':
      return '屬於 A 但不屬於 B';
    case 'reverseDifference':
      return '屬於 B 但不屬於 A';
    case 'complement':
      return 'U（宇集）中不屬於 A 的元素';
  }
}

export function operationExplanation(
  operation: SetOperation,
  state: SetState
): string {
  const values = operationResult(operation, state);
  const symbol = operationSymbol(operation);

  if (values.length === 0) {
    return `${symbol} 為空集合。目前沒有元素同時符合這個條件。`;
  }

  return `${symbol} 包含 ${formatSet(values)}。${operationLabel(operation)}。`;
}

export function regions(state: SetState): {
  outside: number[];
  onlyA: number[];
  onlyB: number[];
  intersection: number[];
} {
  return {
    outside: complement(state.universe, union(state.a, state.b)),
    onlyA: difference(state.a, state.b),
    onlyB: difference(state.b, state.a),
    intersection: intersection(state.a, state.b)
  };
}

export function regionNames(): Record<
  keyof ReturnType<typeof regions>,
  string
> {
  return {
    outside: 'U 中其他元素',
    onlyA: '只屬於 A',
    onlyB: '只屬於 B',
    intersection: '同時屬於 A 和 B'
  };
}

export function describeSetRelation(a: number[], b: number[]): string {
  if (areEqualSets(a, b)) {
    return '兩集合含有完全相同的元素，因此 A = B。';
  }
  if (isProperSubset(a, b)) {
    return 'A 的元素都在 B 中，且 B 至少多一個元素，因此 A ⊊ B。';
  }
  if (isSubset(a, b)) {
    return 'A 的元素都在 B 中，因此 A ⊆ B。';
  }
  return 'A 有元素不在 B 中，因此 A 不是 B 的子集合。';
}

export interface SetRelationCheck {
  subset: boolean;
  properSubset: boolean;
  equal: boolean;
  reverseSubset: boolean;
}

export function checkSetRelations(a: number[], b: number[]): SetRelationCheck {
  return {
    subset: isSubset(a, b),
    properSubset: isProperSubset(a, b),
    equal: areEqualSets(a, b),
    reverseSubset: isSubset(b, a)
  };
}
