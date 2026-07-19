import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

export default function Select({ value, onChange, options, style }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className="custom-select" ref={wrapRef} style={style}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setOpen(o => !o)}
      >
        <span>{selected ? selected.label : ''}</span>
        <Icon name="chevR" size={13} />
      </button>
      {open && (
        <div className="custom-select-menu">
          {options.map(o => (
            <div
              key={o.value}
              className={'custom-select-option' + (o.value === value ? ' selected' : '')}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
