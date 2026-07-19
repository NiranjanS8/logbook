import { useState, useEffect, useMemo } from 'react';
import Icon from '../components/Icon';
import { fmtDate, uid, DOW } from '../utils/date';
import { loadKey, saveKey } from '../utils/storage';

const HABIT_COLORS = ['#76ABAE', '#EEEEEE', '#9CC5C7', '#5c8b8e', '#345b5d'];

function last7Dates() {
  const arr = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d);
  }
  return arr;
}

function streakFor(history) {
  let count = 0;
  const d = new Date();
  while (history[fmtDate(d)]) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export default function HabitsView() {
  const [habits, setHabits] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const days = useMemo(last7Dates, []);
  const today = fmtDate(new Date());

  useEffect(() => {
    setHabits(loadKey('habits', []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveKey('habits', habits);
  }, [habits, loaded]);

  function addHabit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const color = HABIT_COLORS[habits.length % HABIT_COLORS.length];
    setHabits(h => [...h, { id: uid(), name: name.trim(), color, history: {} }]);
    setName('');
  }

  function toggleDay(id, dateStr) {
    setHabits(h =>
      h.map(x =>
        x.id !== id ? x : { ...x, history: { ...x.history, [dateStr]: !x.history[dateStr] } },
      ),
    );
  }

  function remove(id) {
    setHabits(h => h.filter(x => x.id !== id));
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Small daily wins</div>
          <div className="page-title">Habit Tracker</div>
        </div>
      </div>
      <div className="card">
        <form onSubmit={addHabit} className="row" style={{ marginBottom: 16, gap: 10 }}>
          <input type="text" placeholder="Add a habit, e.g. Read 10 pages" value={name} onChange={e => setName(e.target.value)} />
          <button type="submit" className="btn btn-brass"><Icon name="plus" size={15} /> Add</button>
        </form>
        <hr className="divider" style={{ marginTop: 0 }} />
        {habits.length === 0 ? (
          <div className="empty"><b>No habits yet</b>Add one above and start building your streak.</div>
        ) : habits.map(h => {
          const streak = streakFor(h.history);
          return (
            <div className="habit-row" key={h.id}>
              <div className="habit-dot" style={{ background: h.color }} />
              <div>
                <div className="habit-name">{h.name}</div>
                <div className="habit-streak">
                  <Icon name="flame" size={11} /> {streak} day{streak !== 1 ? 's' : ''} streak
                </div>
              </div>
              <div className="week-grid">
                {days.map(d => {
                  const ds = fmtDate(d);
                  const on = !!h.history[ds];
                  return (
                    <div
                      key={ds}
                      className={'day-box' + (on ? ' filled' : '') + (ds === today ? ' today' : '')}
                      style={on ? { background: h.color } : {}}
                      onClick={() => toggleDay(h.id, ds)}
                      title={ds}
                    >
                      {DOW[d.getDay()][0]}
                    </div>
                  );
                })}
              </div>
              <button className="btn-icon" onClick={() => remove(h.id)}><Icon name="trash" size={16} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
