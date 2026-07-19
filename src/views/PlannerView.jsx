import { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import DatePicker from '../components/DatePicker';
import { fmtDate } from '../utils/date';
import { loadKey, saveKey } from '../utils/storage';

const PLAN_HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h) {
  const ap = h >= 12 ? 'PM' : 'AM';
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${hh}:00 ${ap}`;
}

export default function PlannerView() {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [date, setDate] = useState(fmtDate(new Date()));
  const saveTimer = useRef(null);

  useEffect(() => {
    setData(loadKey('plannerData', {}));
    setLoaded(true);
  }, []);

  function updateSlot(hour, val) {
    setData(d => {
      const dayData = { ...(d[date] || {}), [hour]: val };
      const next = { ...d, [date]: dayData };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveKey('plannerData', next), 350);
      return next;
    });
  }

  const dayData = data[date] || {};

  function shift(n) {
    const d = new Date(date + 'T00:00');
    d.setDate(d.getDate() + n);
    setDate(fmtDate(d));
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Hour by hour</div>
          <div className="page-title">Daily Planner</div>
        </div>
      </div>
      <div className="card">
        <div className="planner-head">
          <div className="planner-day">{new Date(date + 'T00:00').toDateString()}</div>
          <div className="row">
            <button className="btn-icon" onClick={() => shift(-1)}><Icon name="chevL" /></button>
            <button className="btn btn-ghost" onClick={() => setDate(fmtDate(new Date()))}>Today</button>
            <button className="btn-icon" onClick={() => shift(1)}><Icon name="chevR" /></button>
            <DatePicker value={date} onChange={setDate} style={{ width: 160 }} />
          </div>
        </div>
        <div>
          {PLAN_HOURS.map(h => (
            <div className="plan-row" key={h}>
              <div className="plan-hour">{hourLabel(h)}</div>
              <input type="text" placeholder="—" value={dayData[h] || ''} onChange={e => updateSlot(h, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
