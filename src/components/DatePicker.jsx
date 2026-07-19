import { useState, useRef, useEffect, useMemo } from 'react';
import Icon from './Icon';
import { fmtDate, pad, DOW, MONTHS } from '../utils/date';

export default function DatePicker({ value, onChange, style }) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => {
    if (value && value.includes('-')) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    const d = new Date(); d.setDate(1); return d;
  });
  const wrapRef = useRef(null);

  useEffect(() => {
    if (value && value.includes('-')) {
      const [y, m, d] = value.split('-').map(Number);
      setCursor(new Date(y, m - 1, 1));
    }
  }, [value]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const todayStr = fmtDate(new Date());

  const cells = useMemo(() => {
    const year = cursor.getFullYear(), month = cursor.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const arr = [];
    for (let i = firstDow - 1; i >= 0; i--) arr.push({ date: new Date(year, month - 1, daysInPrev - i), muted: true });
    for (let d = 1; d <= daysInMonth; d++) arr.push({ date: new Date(year, month, d), muted: false });
    while (arr.length % 7 !== 0 || arr.length < 35) arr.push({ date: new Date(year, month + 1, arr.length - daysInMonth - firstDow + 1), muted: true });
    return arr.slice(0, 42);
  }, [cursor]);

  function selectDate(dateStr) {
    onChange(dateStr);
    setOpen(false);
  }

  function prevMonth() {
    setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  function handleToggle() {
    if (!open && value && value.includes('-')) {
      const [y, m, d] = value.split('-').map(Number);
      setCursor(new Date(y, m - 1, 1));
    }
    setOpen(o => !o);
  }

  return (
    <div className="custom-datepicker" ref={wrapRef} style={style}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={handleToggle}
      >
        <span>{value || 'Pick date'}</span>
        <Icon name="calendar" size={14} />
      </button>
      {open && (
        <div className="datepicker-popup">
          <div className="datepicker-nav">
            <button type="button" className="btn-icon" onClick={prevMonth}><Icon name="chevL" size={14} /></button>
            <span className="datepicker-month">{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</span>
            <button type="button" className="btn-icon" onClick={nextMonth}><Icon name="chevR" size={14} /></button>
          </div>
          <div className="datepicker-grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="datepicker-dow">{d}</div>
            ))}
            {cells.map((c, i) => {
              const ds = fmtDate(c.date);
              return (
                <div
                  key={i}
                  className={
                    'datepicker-cell'
                    + (c.muted ? ' muted' : '')
                    + (ds === todayStr ? ' today' : '')
                    + (ds === value ? ' selected' : '')
                  }
                  onClick={() => selectDate(ds)}
                >
                  {c.date.getDate()}
                </div>
              );
            })}
          </div>
          <div className="datepicker-footer">
            <button type="button" className="btn-icon" style={{ fontSize: 12 }} onClick={() => selectDate('')}>Clear</button>
            <button type="button" className="btn-icon" style={{ fontSize: 12 }} onClick={() => selectDate(todayStr)}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
