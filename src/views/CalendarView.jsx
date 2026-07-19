import { useState, useEffect, useMemo } from 'react';
import Icon from '../components/Icon';
import { fmtDate, uid, DOW, MONTHS } from '../utils/date';
import { loadKey, saveKey } from '../utils/storage';

export default function CalendarView() {
  const [events, setEvents] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState(fmtDate(new Date()));
  const [text, setText] = useState('');
  const [jumpText, setJumpText] = useState(selected);

  useEffect(() => {
    setEvents(loadKey('calendarEvents', {}));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveKey('calendarEvents', events);
  }, [events, loaded]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear(), month = cursor.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const arr = [];
    for (let i = firstDow - 1; i >= 0; i--) arr.push({ date: new Date(year, month - 1, daysInPrev - i), muted: true });
    for (let d = 1; d <= daysInMonth; d++) arr.push({ date: new Date(year, month, d), muted: false });
    while (arr.length % 7 !== 0 || arr.length < 42) arr.push({ date: new Date(year, month + 1, arr.length - daysInMonth - firstDow + 1), muted: true });
    return arr.slice(0, 42);
  }, [cursor]);

  const todayStr = fmtDate(new Date());
  const dayEvents = events[selected] || [];

  function addEvent(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setEvents(ev => ({ ...ev, [selected]: [...(ev[selected] || []), { id: uid(), text: text.trim() }] }));
    setText('');
  }

  function removeEvent(id) {
    setEvents(ev => ({ ...ev, [selected]: (ev[selected] || []).filter(x => x.id !== id) }));
  }

  function goToToday() {
    const today = new Date();
    const todayFormatted = fmtDate(today);
    setSelected(todayFormatted);
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setJumpText(todayFormatted);
  }

  function handleJump(textValue) {
    setJumpText(textValue);
    if (/^\d{4}-\d{2}-\d{2}$/.test(textValue)) {
      const [y, m, d] = textValue.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      if (!isNaN(dateObj.getTime())) {
        setSelected(textValue);
        setCursor(new Date(y, m - 1, 1));
      }
    }
  }

  return (
    <div className="calendar-page">
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Plan ahead</div>
          <div className="page-title">Calendar</div>
        </div>
      </div>
      <div className="grid2" style={{ flex: 1, minHeight: 0 }}>
        <div className="card">
          <div className="cal-head" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <div className="row" style={{ gap: '4px' }}>
              <button type="button" className="btn-icon" onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1))}>
                <Icon name="chevL" />
              </button>
              <div className="cal-title" style={{ minWidth: '130px', textAlign: 'center' }}>
                {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
              </div>
              <button type="button" className="btn-icon" onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1))}>
                <Icon name="chevR" />
              </button>
            </div>
            <div className="row" style={{ gap: '8px', marginLeft: 'auto' }}>
              <button type="button" className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={goToToday}>Today</button>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={jumpText}
                onChange={e => handleJump(e.target.value)}
                style={{ width: 140 }}
              />
            </div>
          </div>
          <div className="cal-grid">
            {DOW.map(d => <div className="cal-dow" key={d}>{d}</div>)}
            {cells.map((c, i) => {
              const ds = fmtDate(c.date);
              const has = (events[ds] || []).length > 0;
              return (
                <div
                  key={i}
                  className={'cal-cell' + (c.muted ? ' muted' : '') + (ds === todayStr ? ' today' : '') + (ds === selected ? ' selected' : '')}
                  onClick={() => { setSelected(ds); setJumpText(ds); }}
                >
                  {c.date.getDate()}
                  {has && <span className="cal-evt-dot" />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4, fontFamily: 'IBM Plex Mono, monospace', fontSize: 16 }}>
            {new Date(selected + 'T00:00').toDateString()}
          </div>
          <div className="faint" style={{ fontSize: 12, marginBottom: 14 }}>{selected === todayStr ? 'Today' : ''}</div>
          <form onSubmit={addEvent} className="row" style={{ marginBottom: 14, gap: 8 }}>
            <input type="text" placeholder="Add an event or reminder…" value={text} onChange={e => setText(e.target.value)} />
            <button className="btn btn-brass" type="submit"><Icon name="plus" size={15} /></button>
          </form>
          <hr className="divider" style={{ marginTop: 0 }} />
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {dayEvents.length === 0 ? (
              <div className="empty" style={{ padding: '18px 6px' }}><b>Nothing planned</b>Add an event for this day above.</div>
            ) : dayEvents.map(ev => (
              <div className="evt-item" key={ev.id}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>{ev.text}</div>
                <button className="btn-icon" onClick={() => removeEvent(ev.id)}><Icon name="trash" size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
