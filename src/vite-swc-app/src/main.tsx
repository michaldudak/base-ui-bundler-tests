import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BaseUiFixture } from './BaseUiFixture';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BaseUiFixture />
  </StrictMode>,
);
