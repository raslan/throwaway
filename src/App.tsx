import { useReadLocalStorage } from 'usehooks-ts';
import Navigation from './components/Navigation';
import Inbox from './views/inbox';
import { View } from 'src/types';
import Identity from './views/identity';
import { Toaster } from 'react-hot-toast';
import useIdentity from './hooks/useIdentity';
import AdvancedMode from './views/advanced';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

function App() {
  const view = useReadLocalStorage<View>('throwaway-view');
  useIdentity();
  return (
    <div className='bg-app w-[640px] h-[450px] text-white flex flex-col'>
      <Toaster />
      {view === View.Email && <Inbox />}
      {view === View.Identity && <Identity />}
      {view === View.Advanced && <AdvancedMode />}
      <Navigation />
    </div>
  );
}

export default App;
