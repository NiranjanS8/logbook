export default function Icon({ name, size = 18 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'clock':
      return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>;
    case 'timer':
      return <svg {...p}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/><path d="M9 2h6"/><path d="M12 2v3"/></svg>;
    case 'check':
      return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>;
    case 'flame':
      return <svg {...p}><path d="M12 2c1 4-4 5-4 9a4 4 0 0 0 8 0c0-1.5-1-2.5-1-2.5s2 1 2 4a5 5 0 0 1-10 0C7 8 12 6 12 2z"/></svg>;
    case 'calendar':
      return <svg {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>;
    case 'note':
      return <svg {...p}><path d="M6 3.5h9l4.5 4.5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14.5 3.5V8H19"/><path d="M8.5 12.5h7M8.5 16h5"/></svg>;
    case 'planner':
      return <svg {...p}><rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M3.5 9.5h17"/><path d="M8 4v-1.2M16 4v-1.2"/><path d="M7.5 13.5h2M7.5 17h2M11.5 13.5h5M11.5 17h5"/></svg>;
    case 'play':
      return <svg {...p} fill="currentColor" stroke="none"><path d="M7 4.5v15l13-7.5z"/></svg>;
    case 'pause':
      return <svg {...p} fill="currentColor" stroke="none"><rect x="6" y="4.5" width="4.5" height="15" rx="1"/><rect x="13.5" y="4.5" width="4.5" height="15" rx="1"/></svg>;
    case 'reset':
      return <svg {...p}><path d="M4 12a8 8 0 1 1 2.6 5.9"/><path d="M4 17v-5h5"/></svg>;
    case 'skip':
      return <svg {...p}><path d="M6 5v14l10-7z"/><path d="M17 5v14"/></svg>;
    case 'plus':
      return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'trash':
      return <svg {...p}><path d="M4.5 7h15"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l1 13a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9l1-13"/></svg>;
    case 'chevL':
      return <svg {...p}><path d="M14.5 5.5L8 12l6.5 6.5"/></svg>;
    case 'chevR':
      return <svg {...p}><path d="M9.5 5.5L16 12l-6.5 6.5"/></svg>;
    default:
      return null;
  }
}
