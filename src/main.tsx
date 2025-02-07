// /Users/montysharma/Documents/V5/mmv_clean/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import GameRoot from './presentation/GameRoot';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GameRoot />
  </React.StrictMode>
);
