import React from 'react';
import ReactDOM from 'react-dom/client';
import Inbox from './views/inbox';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className='w-screen min-h-screen bg-app text-white'>
      <Toaster />
      <Inbox isFullscreen />
    </div>
  </React.StrictMode>
);
