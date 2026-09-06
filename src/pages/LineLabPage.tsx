import { BookOpen, MousePointer2, Ruler } from 'lucide-react';
import { CoordinateLineLab } from '../components/CoordinateLineLab';

export function LineLabPage() {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">S5 ・ 直線坐標幾何 ・ 可拖動實驗</span>
          <h1>直線實驗室</h1>
          <p>
            拖動 A、B 兩點或調整斜率與截距，觀察直線方程式、距離、夾角與兩線位置。
          </p>
        </div>
        <a className="button button--primary button--large" href="#/lessons/s5-slope">
          <BookOpen size={18} aria-hidden="true" />
          從斜率單元開始
        </a>
      </div>

      <section className="panel line-lab-page-intro">
        <div className="panel-heading">
          <span className="panel-kicker">操作方法</span>
          <h2>先拖動，再對照公式</h2>
        </div>
        <div className="line-lab-page-intro__grid">
          <div>
            <MousePointer2 size={20} aria-hidden="true" />
            <strong>兩點直線</strong>
            <p>移動 A 或 B，即時計算距離、中點、定比分點與方程式。</p>
          </div>
          <div>
            <Ruler size={20} aria-hidden="true" />
            <strong>斜率截距</strong>
            <p>調整 m、b，觀察傾斜角與直線平移的變化。</p>
          </div>
        </div>
      </section>

      <section className="panel line-lab-formula-panel" aria-labelledby="formula-title">
        <div className="panel-heading">
          <span className="panel-kicker">S5 速查</span>
          <h2 id="formula-title">直線坐標幾何常用公式</h2>
        </div>
        <div className="line-lab-formula-grid">
          <article>
            <strong>斜率</strong>
            <code>k = (y₂ − y₁) / (x₂ − x₁)</code>
            <small>垂直線斜率不存在</small>
          </article>
          <article>
            <strong>兩點距離</strong>
            <code>d = √((x₂ − x₁)² + (y₂ − y₁)²)</code>
          </article>
          <article>
            <strong>中點與定比分點</strong>
            <code>P = ((x₁ + λx₂)/(1 + λ), (y₁ + λy₂)/(1 + λ))</code>
          </article>
          <article>
            <strong>兩線夾角</strong>
            <code>tan θ = |(k₂ − k₁)/(1 + k₁k₂)|</code>
          </article>
          <article>
            <strong>點線距離</strong>
            <code>d = |Ax₀ + By₀ + C| / √(A² + B²)</code>
          </article>
          <article>
            <strong>三角形面積</strong>
            <code>S = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|</code>
          </article>
        </div>
      </section>

      <CoordinateLineLab />
    </div>
  );
}
