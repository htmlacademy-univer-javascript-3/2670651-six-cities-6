import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/ui/main';
import { offers } from './mock/offers-set-for-main';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App rentSuggestionCounter={offers.length} />
  </React.StrictMode>
);
