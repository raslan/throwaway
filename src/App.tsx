import ApplicationTabs from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { useExtensionManagement } from '@/hooks/useExtensionManagement';
import { lazy, Suspense, useEffect } from 'react';
import { View } from 'src/types';
import { useLocalStorage } from 'usehooks-ts';

const Advanced = lazy(() => import('@/views/advanced'));
const Identity = lazy(() => import('@/views/identity'));
const Inbox = lazy(() => import('@/views/inbox'));
const Profiles = lazy(() => import('@/views/profiles'));

function App() {
  const [view] = useLocalStorage<View>('throwaway-view', View.Email);
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  useEffect(() => {
    if (theme !== 'dark') {
      setTheme('dark');
    }
    document.documentElement.className = 'dark';
  }, [theme]);

  // Initialize the management hook to populate the extension state
  useExtensionManagement();

  return (
    <main className={`${theme} h-[600px] w-[800px] flex items-center justify-center m-0 p-2 overflow-hidden animate-shellFade`}>
      <div className='throwaway-shell'>
        <Toaster position='top-right' />
        <Suspense fallback={null}>
          {view === View.Email && <Inbox />}
          {view === View.Identity && <Identity />}
          {view === View.Profiles && <Profiles />}
          {view === View.Advanced && <Advanced />}
        </Suspense>
        <ApplicationTabs />
      </div>
    </main>
  );
}

export default App;
