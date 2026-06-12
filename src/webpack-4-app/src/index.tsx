import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BaseUiFixture } from './BaseUiFixture';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BaseUiFixture />
  </React.StrictMode>,
);
