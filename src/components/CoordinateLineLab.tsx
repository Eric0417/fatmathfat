import {
  MousePointer2,
  Plus,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useState } from 'react';
import {
  acuteAngleBetweenLines,
  distanceBetween,
  formatLinearEquation,
  formatNumber,
  intersectionOfLines,
  lineAngleDegrees,
  lineFromPoints,
  lineFromSlopeIntercept,
  midpoint,
  relationBetweenLines,
  sectionPoint
} from '../lib/coordinateMath';
import type { CartesianPoint, LinearEquation } from '../types';

interface CoordinateLineLabProps {
  compact?: boolean;
  focus?: 'directed-segment' | 'section-point' | 'slope' | 'line-forms' | 'line-relations';
}

type LabMode = 'points' | 'slope';

const X_MIN = -8;
const X_MAX = 8;
const Y_MIN = -5;
const Y_MAX = 5;
const WIDTH = 720;
const HEIGHT = 440;

function toSvg(point: CartesianPoint): { x: number; y: number } {
  return {
    x: ((point.x - X_MIN) / (X_MAX - X_MIN)) * WIDTH,
    y: ((Y_MAX - point.y) / (Y_MAX - Y_MIN)) * HEIGHT
  };
}

function lineEndpoints(line: LinearEquation) {
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

function RelationText({ relation }: { relation: ReturnType<typeof relationBetweenLines> }) {
  const labels = {
    coincident: '重合',
    parallel: '平行',
    perpendicular: '垂直',
    intersecting: '相交'
  };
  return <strong>{labels[relation]}</strong>;
}

export function CoordinateLineLab({
  compact = false,
  focus
}: CoordinateLineLabProps) {
  const focusSlope =
    focus === 'slope' || focus === 'line-forms' || focus === 'line-relations';
  const [mode, setMode] = useState<LabMode>(focusSlope ? 'slope' : 'points');
  const [pointA, setPointA] = useState<CartesianPoint>({ x: -3, y: -2 });
  const [pointB, setPointB] = useState<CartesianPoint>({ x: 3, y: 4 });
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);
  const [firstSlope, setFirstSlope] = useState(1);
  const [firstIntercept, setFirstIntercept] = useState(0);
  const [secondSlope, setSecondSlope] = useState(-1);
  const [secondIntercept, setSecondIntercept] = useState(2);
  const [showSecond, setShowSecond] = useState(focus === 'line-relations');
  const [ratio, setRatio] = useState(1);
  const [ratioMin, setRatioMin] = useState(-5);
  const [ratioMax, setRatioMax] = useState(5);

  const firstLine =
    mode === 'points'
      ? lineFromPoints(pointA, pointB)
      : lineFromSlopeIntercept(firstSlope, firstIntercept);
  const secondLine = lineFromSlopeIntercept(secondSlope, secondIntercept);
  const ratioInvalid = Math.abs(ratio + 1) < 1e-9;
  const section = firstLine && !ratioInvalid
    ? sectionPoint(pointA, pointB, ratio)
    : null;
  const relation = firstLine ? relationBetweenLines(firstLine, secondLine) : null;
  const intersection = firstLine
    ? intersectionOfLines(firstLine, secondLine)
    : null;
  const acuteAngle = firstLine
    ? acuteAngleBetweenLines(firstLine, secondLine)
    : null;

  const pointFromEvent = (
    event: React.PointerEvent<SVGSVGElement>
  ): CartesianPoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = X_MIN + ((event.clientX - rect.left) / rect.width) * (X_MAX - X_MIN);
    const y = Y_MAX - ((event.clientY - rect.top) / rect.height) * (Y_MAX - Y_MIN);
    const snap = (value: number) => Math.round(value * 4) / 4;
    return {
      x: Math.max(X_MIN, Math.min(X_MAX, snap(x))),
      y: Math.max(Y_MIN, Math.min(Y_MAX, snap(y)))
    };
  };

  const beginDrag = (target: 'a' | 'b') => (
    event: React.PointerEvent<SVGCircleElement>
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(target);
  };

  const movePoint = (target: 'a' | 'b', amountX: number, amountY: number) => {
    const setter = target === 'a' ? setPointA : setPointB;
    setter((current) => ({
      x: Math.max(X_MIN, Math.min(X_MAX, current.x + amountX)),
      y: Math.max(Y_MIN, Math.min(Y_MAX, current.y + amountY))
    }));
  };

  const clampRatio = (value: number, min = ratioMin, max = ratioMax) =>
    Math.max(min, Math.min(max, value));

  const updateRatioRange = (nextMin: number, nextMax: number) => {
    if (
      !Number.isFinite(nextMin) ||
      !Number.isFinite(nextMax) ||
      nextMin >= nextMax
    ) {
      return;
    }
    setRatioMin(nextMin);
    setRatioMax(nextMax);
    setRatio((current) => clampRatio(current, nextMin, nextMax));
  };

  const renderLine = (line: LinearEquation, className: string) => {
    const [start, end] = lineEndpoints(line);
    return (
      <line
        className={className}
        x1={toSvg(start).x}
        y1={toSvg(start).y}
        x2={toSvg(end).x}
        y2={toSvg(end).y}
      />
    );
  };

  const grid = [];
  for (let x = Math.ceil(X_MIN); x <= X_MAX; x += 1) {
    grid.push(
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
    grid.push(
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
    <section className={`coordinate-line-lab${compact ? ' coordinate-line-lab--compact' : ''}`}>
      <div className="line-lab__controls">
        {!focus && (
          <div className="line-lab__modes" aria-label="實驗室模式">
            <button
              className={mode === 'points' ? 'line-lab__mode-button line-lab__mode-button--active' : 'line-lab__mode-button'}
              type="button"
              aria-pressed={mode === 'points'}
              onClick={() => setMode('points')}
            >
              <MousePointer2 size={16} aria-hidden="true" />
              兩點直線
            </button>
            <button
              className={mode === 'slope' ? 'line-lab__mode-button line-lab__mode-button--active' : 'line-lab__mode-button'}
              type="button"
              aria-pressed={mode === 'slope'}
              onClick={() => setMode('slope')}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              y = mx + b
            </button>
          </div>
        )}
        {(focus === 'line-relations' || !focus) && (
          <button
            className="line-lab__second-line-toggle"
            type="button"
            aria-pressed={showSecond}
            onClick={() => setShowSecond((current) => !current)}
          >
            {showSecond ? <X size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            {showSecond ? '關閉第二條線' : '比較第二條線'}
          </button>
        )}
      </div>

      <div className="line-lab__stage">
        <svg
          className="line-lab__svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="可拖動的直線坐標平面實驗室"
          onPointerMove={(event) => {
            if (!dragging) return;
            const point = pointFromEvent(event);
            if (dragging === 'a') setPointA(point);
            if (dragging === 'b') setPointB(point);
          }}
          onPointerUp={() => setDragging(null)}
          onPointerCancel={() => setDragging(null)}
        >
          <rect className="line-lab__plot" width={WIDTH} height={HEIGHT} rx="12" />
          {grid}
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

          {firstLine && renderLine(firstLine, 'line-lab__line line-lab__line--first')}
          {showSecond && renderLine(secondLine, 'line-lab__line line-lab__line--second')}

          {mode === 'points' && firstLine && (
            <>
              <line
                className="line-lab__segment"
                x1={toSvg(pointA).x}
                y1={toSvg(pointA).y}
                x2={toSvg(pointB).x}
                y2={toSvg(pointB).y}
              />
              <circle
                className="line-lab__point line-lab__point--a"
                cx={toSvg(pointA).x}
                cy={toSvg(pointA).y}
                r="10"
                tabIndex={0}
                role="slider"
                aria-label={`A 點，坐標 ${pointA.x}, ${pointA.y}`}
                aria-valuemin={X_MIN}
                aria-valuemax={X_MAX}
                aria-valuetext={`x ${pointA.x}，y ${pointA.y}`}
                onPointerDown={beginDrag('a')}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') movePoint('a', -0.25, 0);
                  if (event.key === 'ArrowRight') movePoint('a', 0.25, 0);
                  if (event.key === 'ArrowUp') movePoint('a', 0, 0.25);
                  if (event.key === 'ArrowDown') movePoint('a', 0, -0.25);
                }}
              />
              <circle
                className="line-lab__point line-lab__point--b"
                cx={toSvg(pointB).x}
                cy={toSvg(pointB).y}
                r="10"
                tabIndex={0}
                role="slider"
                aria-label={`B 點，坐標 ${pointB.x}, ${pointB.y}`}
                aria-valuemin={X_MIN}
                aria-valuemax={X_MAX}
                aria-valuetext={`x ${pointB.x}，y ${pointB.y}`}
                onPointerDown={beginDrag('b')}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') movePoint('b', -0.25, 0);
                  if (event.key === 'ArrowRight') movePoint('b', 0.25, 0);
                  if (event.key === 'ArrowUp') movePoint('b', 0, 0.25);
                  if (event.key === 'ArrowDown') movePoint('b', 0, -0.25);
                }}
              />
              <text className="line-lab__point-label" x={toSvg(pointA).x + 13} y={toSvg(pointA).y + 4}>
                A
              </text>
              <text className="line-lab__point-label" x={toSvg(pointB).x + 13} y={toSvg(pointB).y + 4}>
                B
              </text>
              {section && focus !== 'directed-segment' && (
                <>
                  <circle className="line-lab__section-point" cx={toSvg(section).x} cy={toSvg(section).y} r="6" />
                  <text className="line-lab__point-label" x={toSvg(section).x + 10} y={toSvg(section).y + 4}>
                    P
                  </text>
                </>
              )}
            </>
          )}
        </svg>
      </div>

      <div className="line-lab__readout">
        {mode === 'points' ? (
          <>
            <div className="line-lab__metric">
              <span>AB 有向線段分量</span>
              <strong>{formatNumber(pointB.x - pointA.x)}，{formatNumber(pointB.y - pointA.y)}</strong>
            </div>
            {focus !== 'directed-segment' && (
              <div className="line-lab__metric">
                <span>兩點距離</span>
                <strong>{formatNumber(distanceBetween(pointA, pointB))}</strong>
              </div>
            )}
            {focus !== 'directed-segment' && (
              <div className="line-lab__metric">
                <span>中點</span>
                <strong>
                  ({formatNumber(midpoint(pointA, pointB).x)}, {formatNumber(midpoint(pointA, pointB).y)})
                </strong>
              </div>
            )}
            {focus !== 'directed-segment' && (
              <div className="line-lab__ratio-control">
              <div className="line-lab__ratio-header">
                <span>定比分點 λ</span>
                <strong>{ratioInvalid ? '未定義' : formatNumber(ratio)}</strong>
              </div>
              <input
                type="range"
                aria-label="定比分點 λ 滑桿"
                min={ratioMin}
                max={ratioMax}
                step={Math.max(0.01, (ratioMax - ratioMin) / 200)}
                value={ratio}
                onChange={(event) =>
                  setRatio(clampRatio(Number(event.target.value)))
                }
              />
              <div className="line-lab__ratio-inputs">
                <label>
                  <span>λ 數值</span>
                  <input
                    type="number"
                    min={ratioMin}
                    max={ratioMax}
                    step="0.01"
                    value={ratio}
                    aria-label="λ 數值"
                    onChange={(event) =>
                      setRatio(clampRatio(Number(event.target.value)))
                    }
                  />
                </label>
                <label>
                  <span>下限</span>
                  <input
                    type="number"
                    step="0.25"
                    value={ratioMin}
                    aria-label="λ 下限"
                    onChange={(event) =>
                      updateRatioRange(
                        Number(event.target.value),
                        ratioMax
                      )
                    }
                  />
                </label>
                <label>
                  <span>上限</span>
                  <input
                    type="number"
                    step="0.25"
                    value={ratioMax}
                    aria-label="λ 上限"
                    onChange={(event) =>
                      updateRatioRange(
                        ratioMin,
                        Number(event.target.value)
                      )
                    }
                  />
                </label>
              </div>
              {ratioInvalid && (
                <small>λ = −1 時分母為零，定比分點沒有定義。</small>
              )}
              </div>
            )}
          </>
        ) : (
          <div className="line-lab__sliders">
            <label className="line-lab__slider">
              <span>第一條線斜率 m₁</span>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.1"
                value={firstSlope}
                onChange={(event) => setFirstSlope(Number(event.target.value))}
              />
              <strong>{formatNumber(firstSlope)}</strong>
            </label>
            <label className="line-lab__slider">
              <span>y 截距 b₁</span>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.25"
                value={firstIntercept}
                onChange={(event) => setFirstIntercept(Number(event.target.value))}
              />
              <strong>{formatNumber(firstIntercept)}</strong>
            </label>
          </div>
        )}

        {showSecond && (
          <div className="line-lab__sliders">
            <label className="line-lab__slider">
              <span>第二條線斜率 m₂</span>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.1"
                value={secondSlope}
                onChange={(event) => setSecondSlope(Number(event.target.value))}
              />
              <strong>{formatNumber(secondSlope)}</strong>
            </label>
            <label className="line-lab__slider">
              <span>y 截距 b₂</span>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.25"
                value={secondIntercept}
                onChange={(event) => setSecondIntercept(Number(event.target.value))}
              />
              <strong>{formatNumber(secondIntercept)}</strong>
            </label>
          </div>
        )}

        {firstLine && (
          <div className="line-lab__equation">
            <span>第一條線</span>
            <strong>{formatLinearEquation(firstLine)}</strong>
            <small>傾斜角 {formatNumber(lineAngleDegrees(firstLine))}°</small>
          </div>
        )}
        {showSecond && firstLine && (
          <div className="line-lab__equation line-lab__equation--second">
            <span>第二條線</span>
            <strong>{formatLinearEquation(secondLine)}</strong>
            <small>傾斜角 {formatNumber(lineAngleDegrees(secondLine))}°</small>
          </div>
        )}
        {showSecond && firstLine && relation && (
          <div className="line-lab__relation">
            <span>兩線關係</span>
            <RelationText relation={relation} />
            <span>夾角 {formatNumber(acuteAngle ?? 0)}°</span>
            {intersection && (
              <span>交點 ({formatNumber(intersection.x)}, {formatNumber(intersection.y)})</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
