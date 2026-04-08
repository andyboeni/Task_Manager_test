import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TaskManagerPage } from '../pages/TaskManagerPage';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TaskManagerPage />
    </BrowserRouter>
  </React.StrictMode>
);
