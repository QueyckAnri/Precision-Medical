import React from 'react';
import { createRoot } from 'react-dom/client';
import SurgeonsSection from './components/SurgeonsSection.jsx';

const el = document.getElementById('surgeons-root');
if (el) {
  createRoot(el).render(
    <React.StrictMode>
      <SurgeonsSection />
    </React.StrictMode>
  );
}
