import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance monitoring setup
if (import.meta.env.DEV) {
  import('@welldone-software/why-did-you-render').then((whyDidYouRender) => {
    whyDidYouRender.default(React, {
      trackAllPureComponents: true,
      trackHooks: true,
      logOnDifferentValues: true,
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
