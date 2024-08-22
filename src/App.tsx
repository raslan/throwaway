import ApplicationTabs from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { useExtensionManagement } from '@/hooks/useExtensionManagement';
import Advanced from '@/views/advanced';
import Identity from '@/views/identity';
import Inbox from '@/views/inbox';
import { useEffect } from 'react';
import { View } from 'src/types';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

function App() {
  const view = useReadLocalStorage<View>('throwaway-view');
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  useEffect(() => {
    if (!theme) setTheme('dark');
    document.documentElement.className = theme;
  }, [theme]);

  // Initialize the management hook to populate the extension state
  useExtensionManagement();

  return (
    <main className={`${theme} m-0 p-0 flex`}>
      <div className='bg-background w-[800px] h-[600px] text-foreground flex flex-col text-lg'>
        <Toaster position='top-right' />
        {view === View.Email && <Inbox />}
        {view === View.Identity && <Identity />}
        {view === View.Advanced && <Advanced />}
        <ApplicationTabs />
      </div>
    </main>
  );
}

export default App;
