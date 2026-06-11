import React from 'react';
import ReactDOM from 'react-dom/client';
import { BaseUiFixture } from './BaseUiFixture';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BaseUiFixture />
    </React.StrictMode>,
  );
}
