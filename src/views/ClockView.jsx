import { pad, DOW, MONTHS } from '../utils/date';

export default function ClockView({ now }) {
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hDeg = (h + m / 60) * 30;
  const mDeg = (m + s / 60) * 6;
  const sDeg = s * 6;
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Right now</div>
          <div className="page-title">Clock</div>
        </div>
      </div>
      <div className="card">
        <div className="clock-wrap">
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="102" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
            <circle cx="110" cy="110" r="94" fill="var(--bg-2)" stroke="var(--border)" strokeWidth="1" />
            {[...Array(12)].map((_, i) => {
              const a = i * 30 * Math.PI / 180;
              const x1 = 110 + 86 * Math.sin(a), y1 = 110 - 86 * Math.cos(a);
              const x2 = 110 + 96 * Math.sin(a), y2 = 110 - 96 * Math.cos(a);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--brass-dim)" strokeWidth="2" strokeLinecap="round" />;
            })}
            <line x1="110" y1="110" x2={110 + 45 * Math.sin(hDeg * Math.PI / 180)} y2={110 - 45 * Math.cos(hDeg * Math.PI / 180)} stroke="var(--text)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="110" y1="110" x2={110 + 68 * Math.sin(mDeg * Math.PI / 180)} y2={110 - 68 * Math.cos(mDeg * Math.PI / 180)} stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
            <line x1="110" y1="110" x2={110 + 74 * Math.sin(sDeg * Math.PI / 180)} y2={110 - 74 * Math.cos(sDeg * Math.PI / 180)} stroke="var(--rose)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="110" cy="110" r="5" fill="var(--brass)" />
          </svg>
          <div>
            <div className="digital-time">
              {pad(now.getHours() % 12 === 0 ? 12 : now.getHours() % 12)}:{pad(m)}:{pad(s)}{' '}
              <span style={{ fontSize: '22px', color: 'var(--text-faint)' }}>{ampm}</span>
            </div>
            <div className="digital-date">
              {DOW[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}, {now.getFullYear()}
            </div>
            <div className="digital-sub">
              Week {Math.ceil((((now - new Date(now.getFullYear(), 0, 1)) / 86400000) + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7)}
              {' · '}
              Day {Math.ceil((now - new Date(now.getFullYear(), 0, 0)) / 86400000)} of {now.getFullYear() % 4 === 0 ? 366 : 365}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
