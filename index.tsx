
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Ready:', reg.scope))
      .catch(err => console.log('PWA Failed:', err));
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
