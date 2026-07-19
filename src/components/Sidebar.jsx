import Icon from './Icon';
import { pad, DOW, MONTHS } from '../utils/date';

const NAV = [
  { id: 'clock',    label: 'Clock',    icon: 'clock' },
  { id: 'pomodoro', label: 'Pomodoro', icon: 'timer' },
  { id: 'todo',     label: 'To-Do',    icon: 'check' },
  { id: 'habits',   label: 'Habits',   icon: 'flame' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'notes',    label: 'Notes',    icon: 'note' },
  { id: 'planner',  label: 'Day Plan', icon: 'planner' },
];

export default function Sidebar({ tab, setTab, now }) {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-text">Logbook</div>
      </div>
      <div className="nav">
        {NAV.map(item => (
          <div
            key={item.id}
            className={'nav-item' + (tab === item.id ? ' active' : '')}
            onClick={() => setTab(item.id)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') setTab(item.id); }}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-foot">
        <div className="sidebar-clock">
          {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
        </div>
        <div className="sidebar-date">
          {DOW[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
        </div>
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-dim)' }}>
          <span>built by <a href="https://niranjans.tech/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brass)', textDecoration: 'none', fontWeight: 600 }}>Niranjan</a></span>
          <a href="https://github.com/NiranjanS8/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dim)', display: 'inline-flex', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--brass)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>
            <Icon name="github" size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
