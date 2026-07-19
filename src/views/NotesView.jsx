import { useState, useEffect, useRef, useMemo } from 'react';
import Icon from '../components/Icon';
import { uid } from '../utils/date';
import { loadKey, saveKey } from '../utils/storage';

export default function NotesView() {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    const n = loadKey('notes', []);
    setNotes(n);
    setLoaded(true);
    if (n.length) setActiveId(n[0].id);
  }, []);

  function persist(next) {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveKey('notes', next), 400);
  }

  function addNote() {
    const n = { id: uid(), title: 'Untitled note', body: '', updated: Date.now() };
    const next = [n, ...notes];
    setNotes(next);
    setActiveId(n.id);
    persist(next);
  }

  function updateNote(id, patch) {
    const next = notes.map(n => (n.id === id ? { ...n, ...patch, updated: Date.now() } : n));
    setNotes(next);
    persist(next);
  }

  function removeNote(id) {
    const next = notes.filter(n => n.id !== id);
    setNotes(next);
    persist(next);
    if (activeId === id) setActiveId(next.length ? next[0].id : null);
  }

  const active = notes.find(n => n.id === activeId);
  const sorted = useMemo(() => notes.slice().sort((a, b) => b.updated - a.updated), [notes]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Capture your thoughts</div>
          <div className="page-title">Notes</div>
        </div>
        <button className="btn btn-brass" onClick={addNote}><Icon name="plus" size={15} /> New note</button>
      </div>
      <div className="card">
        {notes.length === 0 ? (
          <div className="empty"><b>No notes yet</b>Create your first note to get started.</div>
        ) : (
          <div className="notes-layout">
            <div className="notes-list">
              {sorted.map(n => (
                <div key={n.id} className={'note-item' + (n.id === activeId ? ' active' : '')} onClick={() => setActiveId(n.id)}>
                  <div className="note-item-title">{n.title || 'Untitled note'}</div>
                  <div className="note-item-sub">{new Date(n.updated).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
            {active && (
              <div className="notes-editor">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <input type="text" value={active.title} onChange={e => updateNote(active.id, { title: e.target.value })} placeholder="Title" />
                  <button className="btn-icon" onClick={() => removeNote(active.id)}><Icon name="trash" size={16} /></button>
                </div>
                <textarea value={active.body} onChange={e => updateNote(active.id, { body: e.target.value })} placeholder="Start writing…" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
