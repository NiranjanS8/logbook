import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ClockView from './views/ClockView';
import PomodoroView from './views/PomodoroView';
import TodoView from './views/TodoView';
import HabitsView from './views/HabitsView';
import CalendarView from './views/CalendarView';
import NotesView from './views/NotesView';
import PlannerView from './views/PlannerView';

export default function App() {
  const [tab, setTab] = useState('clock');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="app">
      <Sidebar tab={tab} setTab={setTab} now={now} />
      <div className="main">
        {tab === 'clock' && <ClockView now={now} />}
        {tab === 'pomodoro' && <PomodoroView />}
        {tab === 'todo' && <TodoView />}
        {tab === 'habits' && <HabitsView />}
        {tab === 'calendar' && <CalendarView />}
        {tab === 'notes' && <NotesView />}
        {tab === 'planner' && <PlannerView />}
      </div>
    </div>
  );
}
