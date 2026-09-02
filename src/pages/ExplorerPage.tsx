import {
  ArrowDown,
  ArrowUp,
  CircleOff,
  Plus,
  RotateCcw,
  Shuffle,
  Trash2
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { VennDiagram } from '../components/VennDiagram';
import {
  formatSet,
  membershipFor,
  normalizeNumbers,
  operationExplanation,
  operationLabel,
  operationResult,
  operationSymbol,
  regions
} from '../lib/setMath';
import type { SetOperation, SetState, VennDropTarget } from '../types';

const cases: Array<{ label: string; state: SetState }> = [
  {
    label: '範例一：相交集合',
    state: {
      universe: [1, 2, 3, 4, 5, 6, 7, 8],
      a: [1, 2, 3, 4],
      b: [3, 4, 5, 6]
    }
  },
  {
    label: '範例二：奇偶數',
    state: {
      universe: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      a: [1, 3, 5, 7, 9],
      b: [2, 4, 6, 8, 10]
    }
  },
  {
    label: '範例三：包含關係',
    state: {
      universe: [1, 2, 3, 4, 5, 6],
      a: [1, 2],
      b: [1, 2, 3, 4]
    }
  }
];

const operations: Array<{ value: SetOperation; short: string; title: string }> = [
  { value: 'intersection', short: 'A ∩ B', title: '交集' },
  { value: 'union', short: 'A ∪ B', title: '聯集' },
  { value: 'difference', short: 'A − B', title: '差集' },
  { value: 'reverseDifference', short: 'B − A', title: '反向差集' },
  { value: 'complement', short: 'Aᶜ', title: '補集' }
];

export function ExplorerPage() {
  const [state, setState] = useState<SetState>(cases[0].state);
  const [operation, setOperation] = useState<SetOperation>('intersection');
  const [selected, setSelected] = useState<number | null>(null);
  const [nextValue, setNextValue] = useState(9);
  const [caseIndex, setCaseIndex] = useState(0);
  const [draggingValue, setDraggingValue] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<VennDropTarget | null>(null);
  const pointerDragValue = useRef<number | null>(null);

  const result = operationResult(operation, state);
  const region = regions(state);
  const statusFor = (value: number) => membershipFor(value, state);

  const setUniverseValue = (value: number) => {
    setState((current) => ({
      ...current,
      universe: normalizeNumbers([...current.universe, value])
    }));
    setSelected(value);
  };

  const assign = (target: 'a' | 'b', add: boolean) => {
    if (selected === null) return;
    setState((current) => {
      const source = target === 'a' ? current.a : current.b;
      const next = add
        ? normalizeNumbers([...source, selected])
        : source.filter((value) => value !== selected);
      return {
        ...current,
        [target]: next
      };
    });
  };

  const removeFromUniverse = () => {
    if (selected === null) return;
    setState((current) => ({
      universe: current.universe.filter((value) => value !== selected),
      a: current.a.filter((value) => value !== selected),
      b: current.b.filter((value) => value !== selected)
    }));
    setSelected(null);
  };

  const moveCase = () => {
    const next = (caseIndex + 1) % cases.length;
    setCaseIndex(next);
    setState(cases[next].state);
    setSelected(null);
    setNextValue(cases[next].state.universe.at(-1)! + 1);
  };

  const reset = () => {
    setCaseIndex(0);
    setState(cases[0].state);
    setSelected(null);
    setNextValue(9);
    setOperation('intersection');
  };

  const addFromInput = () => {
    if (Number.isInteger(nextValue) && Number.isFinite(nextValue)) {
      setUniverseValue(nextValue);
      setNextValue((value) => value + 1);
    }
  };

  const applyDrop = (value: number, target: VennDropTarget) => {
    setState((current) => {
      if (!current.universe.includes(value)) return current;
      const a =
        target === 'a' || target === 'both'
          ? normalizeNumbers([...current.a, value])
          : current.a.filter((item) => item !== value);
      const b =
        target === 'b' || target === 'both'
          ? normalizeNumbers([...current.b, value])
          : current.b.filter((item) => item !== value);
      return { ...current, a, b };
    });
    setSelected(value);
  };

  const startPointerDrag = (
    event: ReactPointerEvent<HTMLButtonElement>,
    value: number
  ) => {
    pointerDragValue.current = value;
    setDraggingValue(value);
    setSelected(value);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateDropTarget = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (pointerDragValue.current === null) return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const zone = target?.closest<HTMLElement>('[data-drop-zone]');
    setDropTarget((zone?.dataset.dropZone as VennDropTarget | undefined) ?? null);
  };

  const finishPointerDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const value = pointerDragValue.current;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const zone = target?.closest<HTMLElement>('[data-drop-zone]');
    if (value !== null && zone?.dataset.dropZone) {
      applyDrop(value, zone.dataset.dropZone as VennDropTarget);
    }
    pointerDragValue.current = null;
    setDraggingValue(null);
    setDropTarget(null);
  };

  const cancelPointerDrag = () => {
    pointerDragValue.current = null;
    setDraggingValue(null);
    setDropTarget(null);
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{cases[caseIndex].label}</span>
          <h1>集合操作工具</h1>
          <p>選擇元素，放入 A 或 B；圖形、集合式與中文解釋會同步更新。</p>
        </div>
        <div className="button-row">
          <button className="button button--ghost" type="button" onClick={moveCase}>
            <Shuffle size={17} aria-hidden="true" />
            下一組
          </button>
          <button className="button button--ghost" type="button" onClick={reset}>
            <RotateCcw size={17} aria-hidden="true" />
            重設
          </button>
        </div>
      </div>

      <section className="explorer-grid" aria-label="集合工具工作區">
        <div className="panel explorer-controls">
          <div className="panel-heading">
            <span className="panel-kicker">元素與操作</span>
            <h2>先選元素，再放到集合</h2>
          </div>

          <div className="control-group">
            <span className="control-label">加入 U</span>
            <div className="input-with-button">
              <label className="visually-hidden" htmlFor="new-universe-value">
                要加入全集的整數
              </label>
              <input
                id="new-universe-value"
                type="number"
                step="1"
                value={nextValue}
                onChange={(event) => setNextValue(Number(event.target.value))}
              />
              <button className="button button--secondary" type="button" onClick={addFromInput}>
                <Plus size={17} aria-hidden="true" />
                加入
              </button>
            </div>
          </div>

          <div className="control-group">
            <span className="control-label">U 中的元素</span>
            <div className="element-grid" aria-label="可選擇元素">
              {state.universe.map((value) => {
                const status = statusFor(value);
                const isSelected = selected === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`element-chip element-chip--${status}${
                      isSelected ? ' element-chip--selected' : ''
                    }${draggingValue === value ? ' element-chip--dragging' : ''}`}
                    aria-label={`元素 ${value}，目前${status === 'outside' ? '在 U 中但不屬於 A 或 B' : status === 'a' ? '只屬於 A' : status === 'b' ? '只屬於 B' : '同時屬於 A 和 B'}${isSelected ? '，已選取' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelected(value)}
                    onPointerDown={(event) => startPointerDrag(event, value)}
                    onPointerMove={updateDropTarget}
                    onPointerUp={finishPointerDrag}
                    onPointerCancel={cancelPointerDrag}
                  >
                    <strong>{value}</strong>
                    <small>{status === 'outside' ? 'U' : status === 'both' ? 'A·B' : status.toUpperCase()}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="assignment-controls" aria-label="指派元素到集合">
            <button
              type="button"
              className="button button--blue"
              disabled={selected === null}
              onClick={() => assign('a', true)}
            >
              <ArrowUp size={17} aria-hidden="true" />
              加入 A
            </button>
            <button
              type="button"
              className="button button--orange"
              disabled={selected === null}
              onClick={() => assign('b', true)}
            >
              <ArrowDown size={17} aria-hidden="true" />
              加入 B
            </button>
            <button
              type="button"
              className="button button--ghost"
              disabled={selected === null}
              onClick={() => {
                assign('a', false);
                assign('b', false);
              }}
            >
              <CircleOff size={17} aria-hidden="true" />
              移出 A/B
            </button>
            <button
              type="button"
              className="button button--danger"
              disabled={selected === null}
              onClick={removeFromUniverse}
            >
              <Trash2 size={17} aria-hidden="true" />
              移出 U
            </button>
          </div>

          <div className="region-summary" aria-label="目前區域統計">
            <span>只屬 A：{formatSet(region.onlyA)}</span>
            <span>只屬 B：{formatSet(region.onlyB)}</span>
            <span>交集：{formatSet(region.intersection)}</span>
            <span>U 外：{formatSet(region.outside)}</span>
          </div>
        </div>

        <div className="panel explorer-visual">
          <div className="panel-heading">
            <span className="panel-kicker">目前運算</span>
            <h2>{operationSymbol(operation)}：{operationLabel(operation)}</h2>
          </div>
          <VennDiagram
            state={state}
            operation={operation}
            onDrop={applyDrop}
            dropReady={draggingValue !== null}
            dropTarget={dropTarget}
            ariaLabel={`目前顯示 ${operationLabel(operation)}，結果為 ${formatSet(result)}`}
          />
          <div className="explorer-diagram-note">
            <span>高亮區域隨運算切換</span>
            <span>拖曳元素到 A、B、交集或 U 外可改變成員關係</span>
          </div>
        </div>

        <aside className="panel explorer-result" aria-live="polite">
          <div className="panel-heading">
            <span className="panel-kicker">同步表示</span>
            <h2>集合式與解釋</h2>
          </div>
          <div className="expression-list">
            <div className="expression-row">
              <span>U</span>
              <code>{formatSet(state.universe)}</code>
            </div>
            <div className="expression-row">
              <span>A</span>
              <code>{formatSet(state.a)}</code>
            </div>
            <div className="expression-row">
              <span>B</span>
              <code>{formatSet(state.b)}</code>
            </div>
            <div className="expression-row expression-row--result">
              <span>{operationSymbol(operation)}</span>
              <code>{formatSet(result)}</code>
            </div>
          </div>
          <p className="explanation-box">{operationExplanation(operation, state)}</p>
          <div className="relation-check">
            <h3>關係檢查</h3>
            <p>
              <code>A ⊆ B</code>
              <span>{state.a.every((value) => state.b.includes(value)) ? '成立' : '不成立'}</span>
            </p>
            <p>
              <code>B ⊆ A</code>
              <span>{state.b.every((value) => state.a.includes(value)) ? '成立' : '不成立'}</span>
            </p>
            <p>
              <code>A = B</code>
              <span>
                {state.a.length === state.b.length &&
                state.a.every((value) => state.b.includes(value))
                  ? '成立'
                  : '不成立'}
              </span>
            </p>
          </div>
        </aside>
      </section>

      <section className="explorer-tabs" aria-label="選擇集合運算">
        {operations.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`operation-tab${operation === item.value ? ' operation-tab--active' : ''}`}
            aria-pressed={operation === item.value}
            onClick={() => setOperation(item.value)}
          >
            <strong>{item.short}</strong>
            <span>{item.title}</span>
          </button>
        ))}
      </section>
    </div>
  );
}
