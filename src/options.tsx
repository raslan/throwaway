import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdvancedMode from '@/views/advanced';
import { useLocalStorage } from 'usehooks-ts';

const OptionsApp = () => {
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  useEffect(() => {
    if (!theme) setTheme('dark');
    // Set the theme class on the document element
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div
      className={`w-screen min-h-screen bg-background text-primary ${theme} p-16`}
    >
      <h1 className='text-3xl p-4 font-extrabold tracking-tight lg:text-5xl items-center'>
        Throwaway Options
      </h1>
      <AdvancedMode />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
);
