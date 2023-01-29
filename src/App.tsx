import { useReadLocalStorage } from 'usehooks-ts';
import Navigation from './components/Navigation';
import Inbox from './views/inbox';
import { View } from 'src/types';
import Identity from './views/identity';
import Settings from './views/settings';
import { Toaster } from 'react-hot-toast';

function App() {
  const [view] = useLocalStorage<View>("throwaway-view", View.Main);

  return (
    <div className='bg-slate-900 w-[640px] h-[400px] text-white flex flex-col overflow-hidden'>
      <div className='flex w-full'>
        <div className='w-max'>
          <Sidebar />
        </div>
        {view === View.Main && <MainView />}
        {view === View.Identity && <IdentityView />}
        {view === View.Settings && <SettingsView />}
        <Toaster position='top-right' />
      </div>
    </div>
  );
}

export default App;
