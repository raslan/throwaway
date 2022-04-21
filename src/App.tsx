import { useLocalStorage } from "usehooks-ts";
import { View } from "src/types";
import IdentityView from "./views/IdentityView";
import MainView from "./views/MainView";
import SettingsView from "./views/SettingsView";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";

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
