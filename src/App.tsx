import { useReadLocalStorage } from 'usehooks-ts';
import Navigation from './components/Navigation';
import Inbox from './views/inbox';
import { View } from 'src/types';
import Identity from './views/identity';
import Settings from './views/settings';
import { Toaster } from 'react-hot-toast';
import useIdentity from './hooks/useIdentity';

function App() {
  const view = useReadLocalStorage<View>('throwaway-view');
  useIdentity();
  return (
    <div className='bg-app w-[640px] h-[450px] text-white flex flex-col items-center'>
      <Toaster />
      {view === View.Email && <Inbox />}
      {view === View.Identity && <Identity />}
      {view === View.Settings && <Settings />}
      <Navigation />
    </div>
  );
}

export default App;
