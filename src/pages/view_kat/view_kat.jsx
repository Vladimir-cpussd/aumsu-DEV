import React from 'react';
import { createRoot } from 'react-dom/client';
import LeftFilters from './left_filters.jsx'; // Явное указание расширения

const root = createRoot(document.getElementById('LeftMenu'));
root.render(
  <React.StrictMode>
    <LeftFilters />
  </React.StrictMode>
);