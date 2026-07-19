# Logbook

A personal productivity console built with React and Vite. Seven tools in one clean, dark-themed interface.

## Features

- **Clock** -- Analog and digital clock with week/day-of-year info
- **Pomodoro Timer** -- Configurable focus/break sessions with a progress ring and audio chime
- **To-Do** -- Task list with priority levels, due dates, and filtering (all / active / completed)
- **Habit Tracker** -- 7-day grid with streak counting and color-coded habits
- **Calendar** -- Monthly view with per-day event management
- **Notes** -- Sidebar list with a live editor and debounced auto-save
- **Daily Planner** -- Hourly slots covering all 24 hours (AM/PM) with date navigation

All data is persisted in `localStorage`.

## Tech Stack

- React 18
- Vite
- Vanilla CSS (custom design tokens, no framework)
- Ubuntu + Ubuntu Mono (Google Fonts)

## Project Structure

```
src/
  main.jsx                Entry point
  App.jsx                 Root component (tab routing, clock tick)
  index.css               Design tokens and all component styles
  utils/
    storage.js            localStorage read/write helpers
    date.js               Date formatting, uid generation, constants
  components/
    Icon.jsx              Inline SVG icon library (18 icons)
    Sidebar.jsx           Navigation sidebar with live clock
    Select.jsx            Custom themed dropdown component
    DatePicker.jsx        Custom themed date picker with calendar popup
  views/
    ClockView.jsx          
    PomodoroView.jsx       
    TodoView.jsx           
    HabitsView.jsx         
    CalendarView.jsx       
    NotesView.jsx          
    PlannerView.jsx        
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

Output goes to the `dist/` directory.
