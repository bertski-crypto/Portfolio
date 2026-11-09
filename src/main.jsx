import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initBackgroundActivity } from './utils/background-activity';
import './index.css';

/* Starts the idle-settle watcher for the fixed background layers. */
initBackgroundActivity();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
