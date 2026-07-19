import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../components/Icon';
import { pad } from '../utils/date';
import { loadKey, saveKey } from '../utils/storage';

const POMO_DEFAULT = { work: 25, short: 5, long: 15, longEvery: 4 };

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 740;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.start();
    o.stop(ctx.currentTime + 0.55);
  } catch {
    /* audio not available */
  }
}

export default function PomodoroView() {
  const [settings, setSettings] = useState(POMO_DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(POMO_DEFAULT.work * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const stored = loadKey('pomodoroSettings', POMO_DEFAULT);
    setSettings(stored);
    setSecondsLeft(stored.work * 60);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveKey('pomodoroSettings', settings);
  }, [settings, loaded]);

  const durationFor = useCallback(
    (m, s = settings) => (m === 'work' ? s.work * 60 : m === 'short' ? s.short * 60 : s.long * 60),
    [settings],
  );

  const switchMode = useCallback((next, newSessions) => {
    setMode(next);
    setSecondsLeft(durationFor(next));
    setRunning(false);
    if (newSessions !== undefined) setSessions(newSessions);
  }, [durationFor]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          beep();
          if (mode === 'work') {
            const ns = sessions + 1;
            const next = ns % settings.longEvery === 0 ? 'long' : 'short';
            switchMode(next, ns);
          } else {
            switchMode('work');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode, sessions, settings, switchMode]);

  const total = durationFor(mode);
  const progress = 1 - secondsLeft / total;
  const r = 88;
  const circ = 2 * Math.PI * r;
  const modeColor = mode === 'work' ? 'var(--brass)' : mode === 'short' ? 'var(--teal)' : 'var(--rose)';

  function updateSetting(key, val) {
    const v = Math.max(1, Math.min(180, Number(val) || 1));
    setSettings(s => ({ ...s, [key]: v }));
  }

  useEffect(() => {
    if (!running) setSecondsLeft(durationFor(mode));
  }, [settings.work, settings.short, settings.long]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Deep work</div>
          <div className="page-title">Pomodoro Timer</div>
        </div>
      </div>
      <div className="grid2">
        <div className="card">
          <div className="pomo-wrap">
            <div className="pomo-modes">
              <div className={'pomo-mode-btn' + (mode === 'work' ? ' active' : '')} onClick={() => switchMode('work')}>Focus</div>
              <div className={'pomo-mode-btn' + (mode === 'short' ? ' active' : '')} onClick={() => switchMode('short')}>Short Break</div>
              <div className={'pomo-mode-btn' + (mode === 'long' ? ' active' : '')} onClick={() => switchMode('long')}>Long Break</div>
            </div>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle cx="110" cy="110" r={r} fill="none" stroke={modeColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} transform="rotate(-90 110 110)"
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
              <text x="110" y="118" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="38" fontWeight="700" fill="var(--text)">
                {pad(Math.floor(secondsLeft / 60))}:{pad(secondsLeft % 60)}
              </text>
            </svg>
            <div className="pomo-session">Session {sessions + 1} · {mode === 'work' ? 'Stay focused' : 'Recharge time'}</div>
            <div className="pomo-controls">
              <button className="btn btn-ghost" onClick={() => switchMode(mode)}>
                <Icon name="reset" size={16} /> Reset
              </button>
              <button className="btn btn-brass" onClick={() => setRunning(r => !r)}>
                <Icon name={running ? 'pause' : 'play'} size={16} /> {running ? 'Pause' : 'Start'}
              </button>
              <button className="btn btn-ghost" onClick={() => {
                if (mode === 'work') {
                  const ns = sessions + 1;
                  switchMode(ns % settings.longEvery === 0 ? 'long' : 'short', ns);
                } else {
                  switchMode('work');
                }
              }}>
                <Icon name="skip" size={16} /> Skip
              </button>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14, fontFamily: 'IBM Plex Mono, monospace', fontSize: 16 }}>Durations (minutes)</div>
          <div className="row wrap" style={{ marginBottom: 12, gap: 14 }}>
            <div style={{ flex: 1, minWidth: 90 }}>
              <div className="faint" style={{ fontSize: 11.5, marginBottom: 5 }}>Focus</div>
              <input type="number" value={settings.work} onChange={e => updateSetting('work', e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 90 }}>
              <div className="faint" style={{ fontSize: 11.5, marginBottom: 5 }}>Short break</div>
              <input type="number" value={settings.short} onChange={e => updateSetting('short', e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 90 }}>
              <div className="faint" style={{ fontSize: 11.5, marginBottom: 5 }}>Long break</div>
              <input type="number" value={settings.long} onChange={e => updateSetting('long', e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 4 }}>
            <div className="faint" style={{ fontSize: 11.5, marginBottom: 5 }}>Long break every N sessions</div>
            <input type="number" value={settings.longEvery} onChange={e => updateSetting('longEvery', e.target.value)} />
          </div>
          <hr className="divider" />
          <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.6 }}>
            Completed focus sessions today: <b style={{ color: 'var(--text)' }}>{sessions}</b><br />
            A chime plays when a session ends, and the timer moves to the next mode automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
