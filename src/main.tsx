import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter out benign Vite HMR edge WebSocket notice in dev server
const _origConsoleError = console.error;
console.error = function (...args) {
  const text = args
    .map((a) => (a && a.message) || (typeof a === 'object' ? JSON.stringify(a) : String(a)))
    .join(' ');
  if (text.includes('[vite]') || text.includes('WebSocket closed without opened')) {
    return;
  }
  _origConsoleError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(<App />);
