import {
  useState,
  type Dispatch,
  type SetStateAction
} from 'react';
import {
  distancePointToLine,
  formatLinearEquation,
  formatNumber,
  lineFromPoints,
  lineFromSlopeIntercept,
  triangleArea
} from '../lib/coordinateMath';
import type {
  CartesianPoint,
  LinearEquation,
  S5LessonVisual as S5LessonVisualType
} from '../types';
import { CoordinateLineLab } from './CoordinateLineLab';

const WIDTH = 640;
const HEIGHT = 400;
const X_MIN = -8;
const X_MAX = 8;
const Y_MIN = -5;
const Y_MAX = 5;

function toSvg(point: CartesianPoint) {
  return {
    x: ((point.x - X_MIN) / (X_MAX - X_MIN)) * WIDTH,
    y: ((Y_MAX - point.y) / (Y_MAX - Y_MIN)) * HEIGHT
  };
}

function endpoints(line: LinearEquation) {
  if (line.vertical) {
    const x = line.xIntercept ?? 0;
    return [
      { x, y: Y_MIN },
      { x, y: Y_MAX }
    ];
  }
  const slope = line.slope ?? 0;
  const intercept = line.yIntercept ?? 0;
  return [
    { x: X_MIN, y: slope * X_MIN + intercept },
    { x: X_MAX, y: slope * X_MAX + intercept }
  ];
}

function Grid() {
  const lines = [];
  for (let x = Math.ceil(X_MIN); x <= X_MAX; x += 1) {
    lines.push(
      <line
        key={`v-${x}`}
        className="line-lab__grid"
        x1={toSvg({ x, y: Y_MIN }).x}
        y1={toSvg({ x, y: Y_MIN }).y}
        x2={toSvg({ x, y: Y_MAX }).x}
        y2={toSvg({ x, y: Y_MAX }).y}
      />
    );
  }
  for (let y = Math.ceil(Y_MIN); y <= Y_MAX; y += 1) {
    lines.push(
      <line
        key={`h-${y}`}
        className="line-lab__grid"
        x1={toSvg({ x: X_MIN, y }).x}
        y1={toSvg({ x: X_MIN, y }).y}
        x2={toSvg({ x: X_MAX, y }).x}
        y2={toSvg({ x: X_MAX, y }).y}
      />
    );
  }
  return (
    <>
      {lines}
      <line
        className="line-lab__axis"
        x1={toSvg({ x: X_MIN, y: 0 }).x}
        y1={toSvg({ x: X_MIN, y: 0 }).y}
        x2={toSvg({ x: X_MAX, y: 0 }).x}
        y2={toSvg({ x: X_MAX, y: 0 }).y}
      />
      <line
        className="line-lab__axis"
        x1={toSvg({ x: 0, y: Y_MIN }).x}
        y1={toSvg({ x: 0, y: Y_MIN }).y}
        x2={toSvg({ x: 0, y: Y_MAX }).x}
        y2={toSvg({ x: 0, y: Y_MAX }).y}
      />
    </>
  );
}

function PlotLine({ line, className }: { line: LinearEquation; className: string }) {
  const [start, end] = endpoints(line);
  return (
    <line
      className={className}
      x1={toSvg(start).x}
      y1={toSvg(start).y}
      x2={toSvg(end).x}
      y2={toSvg(end).y}
    />
  );
}

function PolygonAreaVisual() {
  const [third, setThird] = useState<CartesianPoint>({ x: 6, y: 4 });
  const first = { x: 0, y: 0 };
  const second = { x: 8, y: 0 };
  const area = triangleArea(first, second, third);

  return (
    <section className="s5-topic-visual s5-topic-visual--polygon-area">
      <div className="line-lab__stage">
        <svg className="line-lab__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="三角形面積視覺化">
          <rect className="line-lab__plot" width={WIDTH} height={HEIGHT} rx="12" />
          <Grid />
          <polygon
            className="line-lab__line line-lab__line--first"
            points={`${toSvg(first).x},${toSvg(first).y} ${toSvg(second).x},${toSvg(second).y} ${toSvg(third).x},${toSvg(third).y}`}
          />
          {[first, second, third].map((point, index) => (
            <text
              className="line-lab__point-label"
              x={toSvg(point).x + 12}
              y={toSvg(point).y + 4}
              key={`${index}-${point.x}-${point.y}`}
            >
              {String.fromCharCode(65 + index)}
            </text>
          ))}
        </svg>
      </div>
      <div className="line-lab__readout">
        <div className="line-lab__sliders">
          <label className="line-lab__slider">
            <span>C 的 x 坐標</span>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={third.x}
              onChange={(event) => setThird((current) => ({ ...current, x: Number(event.target.value) }))}
            />
            <strong>{formatNumber(third.x)}</strong>
          </label>
          <label className="line-lab__slider">
            <span>C 的 y 坐標</span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={third.y}
              onChange={(event) => setThird((current) => ({ ...current, y: Number(event.target.value) }))}
            />
            <strong>{formatNumber(third.y)}</strong>
          </label>
        </div>
        <div className="line-lab__metric">
          <span>底 AB</span>
          <strong>{formatNumber(second.x - first.x)}</strong>
        </div>
        <div className="line-lab__metric">
          <span>高</span>
          <strong>{formatNumber(third.y)}</strong>
        </div>
        <div className="line-lab__metric">
          <span>三角形面積</span>
          <strong>{formatNumber(area)}</strong>
        </div>
      </div>
    </section>
  );
}

function DistanceNormalVisual() {
  const [point, setPoint] = useState<CartesianPoint>({ x: 3, y: 4 });
  const [slope, setSlope] = useState(0.5);
  const [intercept, setIntercept] = useState(1);
  const line = lineFromSlopeIntercept(slope, intercept);
  const distance = distancePointToLine(point, line);
  const foot: CartesianPoint = {
    x:
      (line.b * (line.b * point.x - line.a * point.y) - line.a * line.c) /
      (line.a * line.a + line.b * line.b),
    y:
      (line.a * (-line.b * point.x + line.a * point.y) - line.b * line.c) /
      (line.a * line.a + line.b * line.b)
  };

  return (
    <section className="s5-topic-visual s5-topic-visual--distance">
      <div className="line-lab__stage">
        <svg className="line-lab__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="點到直線距離視覺化">
          <rect className="line-lab__plot" width={WIDTH} height={HEIGHT} rx="12" />
          <Grid />
          <PlotLine line={line} className="line-lab__line line-lab__line--first" />
          <line
            className="line-lab__segment"
            x1={toSvg(point).x}
            y1={toSvg(point).y}
            x2={toSvg(foot).x}
            y2={toSvg(foot).y}
          />
          <circle className="line-lab__point line-lab__point--a" cx={toSvg(point).x} cy={toSvg(point).y} r="8" />
          <circle className="line-lab__section-point" cx={toSvg(foot).x} cy={toSvg(foot).y} r="5" />
          <text className="line-lab__point-label" x={toSvg(point).x + 12} y={toSvg(point).y + 4}>
            P
          </text>
        </svg>
      </div>
      <div className="line-lab__readout">
        <div className="line-lab__sliders">
          <label className="line-lab__slider">
            <span>P 的 x 坐標</span>
            <input type="range" min="-6" max="6" step="0.5" value={point.x} onChange={(event) => setPoint((current) => ({ ...current, x: Number(event.target.value) }))} />
            <strong>{formatNumber(point.x)}</strong>
          </label>
          <label className="line-lab__slider">
            <span>P 的 y 坐標</span>
            <input type="range" min="-4" max="5" step="0.5" value={point.y} onChange={(event) => setPoint((current) => ({ ...current, y: Number(event.target.value) }))} />
            <strong>{formatNumber(point.y)}</strong>
          </label>
          <label className="line-lab__slider">
            <span>直線斜率 m</span>
            <input type="range" min="-3" max="3" step="0.1" value={slope} onChange={(event) => setSlope(Number(event.target.value))} />
            <strong>{formatNumber(slope)}</strong>
          </label>
          <label className="line-lab__slider">
            <span>y 截距 b</span>
            <input type="range" min="-4" max="4" step="0.5" value={intercept} onChange={(event) => setIntercept(Number(event.target.value))} />
            <strong>{formatNumber(intercept)}</strong>
          </label>
        </div>
        <div className="line-lab__equation">
          <span>直線方程</span>
          <strong>{formatLinearEquation(line)}</strong>
        </div>
        <div className="line-lab__metric">
          <span>點到直線距離</span>
          <strong>{formatNumber(distance)}</strong>
        </div>
      </div>
    </section>
  );
}

function LineFormsVisual() {
  const [form, setForm] = useState<'point-slope' | 'slope-intercept' | 'two-point' | 'intercept' | 'general'>('point-slope');
  const [slope, setSlope] = useState(1);
  const [pointX, setPointX] = useState(2);
  const [pointY, setPointY] = useState(3);
  const [yIntercept, setYIntercept] = useState(0);
  const [xIntercept, setXIntercept] = useState(3);
  const [interceptY, setInterceptY] = useState(2);
  const [pointA, setPointA] = useState<CartesianPoint>({ x: -4, y: -2 });
  const [pointB, setPointB] = useState<CartesianPoint>({ x: 4, y: 3 });
  const line = (() => {
    if (form === 'point-slope') {
      return lineFromSlopeIntercept(slope, pointY - slope * pointX);
    }
    if (form === 'slope-intercept' || form === 'general') {
      return lineFromSlopeIntercept(slope, yIntercept);
    }
    if (form === 'two-point') {
      return lineFromPoints(pointA, pointB) ?? lineFromSlopeIntercept(0, 0);
    }
    if (Math.abs(xIntercept) < 1e-9 || Math.abs(interceptY) < 1e-9) {
      return null;
    }
    return lineFromPoints(
      { x: xIntercept, y: 0 },
      { x: 0, y: interceptY }
    ) ?? lineFromSlopeIntercept(0, 0);
  })();

  return (
    <section className="s5-topic-visual s5-topic-visual--line-forms">
      <div className="line-lab__controls">
        <div className="line-lab__modes" aria-label="直線方程形式">
          {(
            [
              ['point-slope', '點斜式'],
              ['slope-intercept', '斜截式'],
              ['two-point', '兩點式'],
              ['intercept', '截距式'],
              ['general', '一般式']
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={form === value ? 'line-lab__mode-button line-lab__mode-button--active' : 'line-lab__mode-button'}
              aria-pressed={form === value}
              onClick={() => setForm(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="line-lab__stage">
        <svg className="line-lab__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="直線方程形式轉換視覺化">
          <rect className="line-lab__plot" width={WIDTH} height={HEIGHT} rx="12" />
          <Grid />
          {line && <PlotLine line={line} className="line-lab__line line-lab__line--first" />}
        </svg>
      </div>
      <div className="line-lab__readout">
        <div className="line-lab__sliders">
          {(form === 'point-slope' || form === 'slope-intercept' || form === 'general') && (
            <label className="line-lab__slider">
              <span>斜率 m</span>
              <input type="range" min="-3" max="3" step="0.1" value={slope} onChange={(event) => setSlope(Number(event.target.value))} />
              <strong>{formatNumber(slope)}</strong>
            </label>
          )}
          {form === 'point-slope' && (
            <>
              <label className="line-lab__slider">
                <span>點 P 的 x 坐標</span>
                <input type="range" min="-6" max="6" step="0.5" value={pointX} onChange={(event) => setPointX(Number(event.target.value))} />
                <strong>{formatNumber(pointX)}</strong>
              </label>
              <label className="line-lab__slider">
                <span>點 P 的 y 坐標</span>
                <input type="range" min="-4" max="5" step="0.5" value={pointY} onChange={(event) => setPointY(Number(event.target.value))} />
                <strong>{formatNumber(pointY)}</strong>
              </label>
            </>
          )}
          {(form === 'slope-intercept' || form === 'general') && (
            <label className="line-lab__slider">
              <span>y 截距 b</span>
              <input type="range" min="-4" max="4" step="0.5" value={yIntercept} onChange={(event) => setYIntercept(Number(event.target.value))} />
              <strong>{formatNumber(yIntercept)}</strong>
            </label>
          )}
          {form === 'two-point' && (
            <>
              {(
                [
                  ['A', pointA, setPointA],
                  ['B', pointB, setPointB]
                ] as Array<[string, CartesianPoint, Dispatch<SetStateAction<CartesianPoint>>]>
              ).map(([label, value, setter]) => (
                <div className="line-lab__point-inputs" key={String(label)}>
                  <strong>{label}</strong>
                  <label className="line-lab__slider">
                    <span>x</span>
                    <input type="range" min="-6" max="6" step="0.5" value={value.x} onChange={(event) => setter((current) => ({ ...current, x: Number(event.target.value) }))} />
                    <strong>{formatNumber(value.x)}</strong>
                  </label>
                  <label className="line-lab__slider">
                    <span>y</span>
                    <input type="range" min="-4" max="5" step="0.5" value={value.y} onChange={(event) => setter((current) => ({ ...current, y: Number(event.target.value) }))} />
                    <strong>{formatNumber(value.y)}</strong>
                  </label>
                </div>
              ))}
            </>
          )}
          {form === 'intercept' && (
            <>
              <label className="line-lab__slider">
                <span>x 截距 a</span>
                <input type="range" min="-6" max="6" step="0.5" value={xIntercept} onChange={(event) => setXIntercept(Number(event.target.value))} />
                <strong>{formatNumber(xIntercept)}</strong>
              </label>
              <label className="line-lab__slider">
                <span>y 截距 b</span>
                <input type="range" min="-5" max="5" step="0.5" value={interceptY} onChange={(event) => setInterceptY(Number(event.target.value))} />
                <strong>{formatNumber(interceptY)}</strong>
              </label>
            </>
          )}
        </div>
        {line ? (
          <>
            <div className="line-lab__equation">
              <span>斜截式</span>
              <strong>{formatLinearEquation(line)}</strong>
            </div>
            <div className="line-lab__equation">
              <span>一般式</span>
              <strong>{formatNumber(line.a)}x + {formatNumber(line.b)}y + {formatNumber(line.c)} = 0</strong>
            </div>
            {form === 'intercept' && (
              <div className="line-lab__metric">
                <span>截距式</span>
                <strong>x/{formatNumber(xIntercept)} + y/{formatNumber(interceptY)} = 1</strong>
              </div>
            )}
          </>
        ) : (
          <p className="line-lab__metric">截距式要求 a、b 都不為 0。</p>
        )}
      </div>
    </section>
  );
}

function LineFamilyVisual() {
  const [kind, setKind] = useState<'parallel' | 'perpendicular' | 'through'>('parallel');
  const [lambda, setLambda] = useState(1);
  const base = lineFromSlopeIntercept(1, 0);
  const l2 = lineFromSlopeIntercept(-1, 2);
  const familyLine = (() => {
    if (kind === 'parallel') {
      return lineFromSlopeIntercept(1, lambda);
    }
    if (kind === 'perpendicular') {
      return lineFromSlopeIntercept(-1, lambda);
    }
    return {
      a: base.a + lambda * l2.a,
      b: base.b + lambda * l2.b,
      c: base.c + lambda * l2.c,
      slope:
        base.b + lambda * l2.b !== 0
          ? -(base.a + lambda * l2.a) / (base.b + lambda * l2.b)
          : null,
      vertical: Math.abs(base.b + lambda * l2.b) < 1e-9,
      xIntercept:
        Math.abs(base.a + lambda * l2.a) < 1e-9
          ? null
          : -(base.c + lambda * l2.c) / (base.a + lambda * l2.a),
      yIntercept:
        Math.abs(base.b + lambda * l2.b) < 1e-9
          ? null
          : -(base.c + lambda * l2.c) / (base.b + lambda * l2.b)
    };
  })();

  return (
    <section className="s5-topic-visual s5-topic-visual--line-family">
      <div className="line-lab__controls">
        <div className="line-lab__modes" aria-label="直線系類型">
          {(
            [
              ['parallel', '平行系'],
              ['perpendicular', '垂直系'],
              ['through', '過交點系']
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={kind === value ? 'line-lab__mode-button line-lab__mode-button--active' : 'line-lab__mode-button'}
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="line-lab__stage">
        <svg className="line-lab__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="直線系視覺化">
          <rect className="line-lab__plot" width={WIDTH} height={HEIGHT} rx="12" />
          <Grid />
          {kind !== 'through' &&
            [-4, -2, 0, 2, 4].map((offset) => {
              const line =
                kind === 'parallel'
                  ? lineFromSlopeIntercept(1, offset)
                  : lineFromSlopeIntercept(-1, offset);
              return (
                <PlotLine
                  key={offset}
                  line={line}
                  className="line-lab__grid-line line-lab__grid-line--family"
                />
              );
            })}
          <PlotLine line={familyLine} className="line-lab__line line-lab__line--first" />
        </svg>
      </div>
      <div className="line-lab__readout">
        <div className="line-lab__sliders">
          <label className="line-lab__slider">
            <span>參數 λ</span>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={lambda}
              onChange={(event) => setLambda(Number(event.target.value))}
            />
            <strong>{formatNumber(lambda)}</strong>
          </label>
        </div>
        <div className="line-lab__equation">
          <span>目前直線</span>
          <strong>{formatLinearEquation(familyLine)}</strong>
        </div>
        {kind === 'through' && (
          <div className="line-lab__metric">
            <span>保留直線</span>
            <strong>l₁ + λl₂</strong>
          </div>
        )}
      </div>
    </section>
  );
}

export function S5LessonVisual({ lessonId }: { lessonId: S5LessonVisualType }) {
  if (lessonId === 'polygon-area') return <PolygonAreaVisual />;
  if (lessonId === 'distance-normal') return <DistanceNormalVisual />;
  if (lessonId === 'line-forms') return <LineFormsVisual />;
  if (lessonId === 'line-family') return <LineFamilyVisual />;
  return <CoordinateLineLab compact focus={lessonId} />;
}
