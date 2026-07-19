import { useState, useEffect, useMemo } from 'react';
import Icon from '../components/Icon';
import Select from '../components/Select';
import DatePicker from '../components/DatePicker';
import { uid } from '../utils/date';
import { loadKey, saveKey } from '../utils/storage';

export default function TodoView() {
  const [todos, setTodos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('med');
  const [due, setDue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTodos(loadKey('todos', []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveKey('todos', todos);
  }, [todos, loaded]);

  function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos(t => [...t, { id: uid(), text: text.trim(), done: false, priority, due, created: Date.now() }]);
    setText('');
    setDue('');
  }

  function toggle(id) {
    setTodos(t => t.map(x => (x.id === id ? { ...x, done: !x.done } : x)));
  }

  function remove(id) {
    setTodos(t => t.filter(x => x.id !== id));
  }

  const filtered = useMemo(() => {
    let list = todos.slice();
    if (filter === 'active') list = list.filter(t => !t.done);
    if (filter === 'completed') list = list.filter(t => t.done);
    const pw = { high: 0, med: 1, low: 2 };
    list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (pw[a.priority] !== pw[b.priority]) return pw[a.priority] - pw[b.priority];
      return (a.due || '9999').localeCompare(b.due || '9999');
    });
    return list;
  }, [todos, filter]);

  const activeCount = todos.filter(t => !t.done).length;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Stay on top of it</div>
          <div className="page-title">To-Do</div>
        </div>
        <div className="filter-tabs">
          {['all', 'active', 'completed'].map(f => (
            <div key={f} className={'filter-tab' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
              {f[0].toUpperCase() + f.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <form onSubmit={addTodo} className="row wrap" style={{ marginBottom: 16, gap: 10 }}>
          <input type="text" placeholder="Add a task…" value={text} onChange={e => setText(e.target.value)} style={{ flex: '2 1 200px' }} />
          <Select
            value={priority}
            onChange={setPriority}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'med', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            style={{ flex: '0 0 120px' }}
          />
          <DatePicker value={due} onChange={setDue} style={{ flex: '0 0 160px' }} />
          <button type="submit" className="btn btn-brass"><Icon name="plus" size={15} /> Add</button>
        </form>
        <hr className="divider" style={{ marginTop: 0 }} />
        {filtered.length === 0 ? (
          <div className="empty"><b>Nothing here</b>Add a task above to get your list going.</div>
        ) : filtered.map(t => (
          <div className="todo-item" key={t.id}>
            <div className={'check' + (t.done ? ' done' : '')} onClick={() => toggle(t.id)}>{t.done ? '✓' : ''}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={'todo-text' + (t.done ? ' done' : '')}>{t.text}</div>
              {t.due && <div className="todo-meta">Due {t.due}</div>}
            </div>
            <span className={'chip chip-' + t.priority}>{t.priority}</span>
            <button className="btn-icon" onClick={() => remove(t.id)}><Icon name="trash" size={16} /></button>
          </div>
        ))}
        <div className="faint" style={{ marginTop: 14, fontSize: 12 }}>
          {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
        </div>
      </div>
    </div>
  );
}
