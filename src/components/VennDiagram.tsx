import { formatSet, regions } from '../lib/setMath';
import type { SetOperation, SetState, VennDropTarget } from '../types';

interface VennDiagramProps {
  state: SetState;
  operation?: SetOperation;
  ariaLabel?: string;
  onDrop?: (value: number, target: VennDropTarget) => void;
  dropReady?: boolean;
  dropTarget?: VennDropTarget | null;
}

const A_CENTER = { x: 245, y: 205 };
const B_CENTER = { x: 395, y: 205 };
const RADIUS = 128;
const VIEWBOX = { width: 640, height: 400 };

function ElementGroup({
  label,
  values,
  x,
  y,
  tone
}: {
  label: string;
  values: number[];
  x: number;
  y: number;
  tone: 'blue' | 'orange' | 'green' | 'neutral';
}) {
  return (
    <g className={`diagram-region diagram-region--${tone}`}>
      <text className="diagram-region__label" x={x} y={y - 14}>
        {label}
      </text>
      <text className="diagram-region__value" x={x} y={y + 16}>
        {values.length > 0 ? values.join('  ') : '無元素'}
      </text>
    </g>
  );
}

export function VennDiagram({
  state,
  operation = 'intersection',
  ariaLabel,
  onDrop,
  dropReady = false,
  dropTarget = null
}: VennDiagramProps) {
  const region = regions(state);
  const result = operation;

  const label =
    ariaLabel ??
    `集合文氏圖：A 為 ${formatSet(state.a)}，B 為 ${formatSet(state.b)}，正在顯示 ${result}。`;

  return (
    <div
      className={`venn-diagram-wrap${dropReady ? ' venn-diagram-wrap--drop-ready' : ''}`}
    >
      <svg
        className="venn-diagram"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        role="img"
        aria-label={label}
      >
      <defs>
        <clipPath id="clip-circle-a">
          <circle cx={A_CENTER.x} cy={A_CENTER.y} r={RADIUS} />
        </clipPath>
        <clipPath id="clip-circle-b">
          <circle cx={B_CENTER.x} cy={B_CENTER.y} r={RADIUS} />
        </clipPath>
        <mask id="mask-a">
          <rect
            x="0"
            y="0"
            width={VIEWBOX.width}
            height={VIEWBOX.height}
            fill="white"
          />
          <circle cx={A_CENTER.x} cy={A_CENTER.y} r={RADIUS} fill="black" />
        </mask>
        <mask id="mask-not-b">
          <rect
            x="0"
            y="0"
            width={VIEWBOX.width}
            height={VIEWBOX.height}
            fill="white"
          />
          <circle cx={B_CENTER.x} cy={B_CENTER.y} r={RADIUS} fill="black" />
        </mask>
        <mask id="mask-not-a">
          <rect
            x="0"
            y="0"
            width={VIEWBOX.width}
            height={VIEWBOX.height}
            fill="white"
          />
          <circle cx={A_CENTER.x} cy={A_CENTER.y} r={RADIUS} fill="black" />
        </mask>
      </defs>

      <rect
        className="diagram-universe"
        x="24"
        y="24"
        width={VIEWBOX.width - 48}
        height={VIEWBOX.height - 48}
        rx="6"
      />
      <text className="diagram-universe__label" x="40" y="54">
        U
      </text>

      {operation === 'complement' && (
        <rect
          className="diagram-highlight diagram-highlight--complement"
          x="24"
          y="24"
          width={VIEWBOX.width - 48}
          height={VIEWBOX.height - 48}
          rx="6"
          mask="url(#mask-a)"
        />
      )}

      {operation === 'intersection' && (
        <circle
          className="diagram-highlight diagram-highlight--intersection"
          cx={A_CENTER.x}
          cy={A_CENTER.y}
          r={RADIUS}
          clipPath="url(#clip-circle-b)"
        />
      )}

      {operation === 'union' && (
        <>
          <circle
            className="diagram-highlight diagram-highlight--union-a"
            cx={A_CENTER.x}
            cy={A_CENTER.y}
            r={RADIUS}
          />
          <circle
            className="diagram-highlight diagram-highlight--union-b"
            cx={B_CENTER.x}
            cy={B_CENTER.y}
            r={RADIUS}
          />
        </>
      )}

      {operation === 'difference' && (
        <circle
          className="diagram-highlight diagram-highlight--difference"
          cx={A_CENTER.x}
          cy={A_CENTER.y}
          r={RADIUS}
          mask="url(#mask-not-b)"
        />
      )}

      {operation === 'reverseDifference' && (
        <circle
          className="diagram-highlight diagram-highlight--reverse"
          cx={B_CENTER.x}
          cy={B_CENTER.y}
          r={RADIUS}
          mask="url(#mask-not-a)"
        />
      )}

      <circle
        className="diagram-set diagram-set--a"
        cx={A_CENTER.x}
        cy={A_CENTER.y}
        r={RADIUS}
      />
      <circle
        className="diagram-set diagram-set--b"
        cx={B_CENTER.x}
        cy={B_CENTER.y}
        r={RADIUS}
      />
      <text className="diagram-set__name diagram-set__name--a" x={A_CENTER.x} y={A_CENTER.y - 90}>
        A
      </text>
      <text className="diagram-set__name diagram-set__name--b" x={B_CENTER.x} y={B_CENTER.y - 90}>
        B
      </text>

        <ElementGroup label="A − B" values={region.onlyA} x={190} y={210} tone="blue" />
        <ElementGroup label="B − A" values={region.onlyB} x={465} y={210} tone="orange" />
        <ElementGroup label="A ∩ B" values={region.intersection} x={320} y={210} tone="green" />
        <ElementGroup label="U 中其他元素" values={region.outside} x={88} y={334} tone="neutral" />
      </svg>
      {onDrop && (
        <div className="venn-drop-zones" aria-hidden="true">
          <div
            className={`venn-drop-zone venn-drop-zone--outside${
              dropTarget === 'outside' ? ' venn-drop-zone--active' : ''
            }`}
            data-drop-zone="outside"
          />
          <div
            className={`venn-drop-zone venn-drop-zone--a${
              dropTarget === 'a' ? ' venn-drop-zone--active' : ''
            }`}
            data-drop-zone="a"
          />
          <div
            className={`venn-drop-zone venn-drop-zone--b${
              dropTarget === 'b' ? ' venn-drop-zone--active' : ''
            }`}
            data-drop-zone="b"
          />
          <div
            className={`venn-drop-zone venn-drop-zone--both${
              dropTarget === 'both' ? ' venn-drop-zone--active' : ''
            }`}
            data-drop-zone="both"
          />
        </div>
      )}
    </div>
  );
}
