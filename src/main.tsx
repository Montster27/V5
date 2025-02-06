import React from 'react';
import ReactDOM from 'react-dom/client';
import { GameRoot } from './presentation/GameRoot';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameRoot />
  </React.StrictMode>
);