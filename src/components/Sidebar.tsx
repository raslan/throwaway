import toast from "react-hot-toast";
import useEmail from "src/hooks/useEmail";
import useIdentity from "src/hooks/useIdentity";
import { View } from "src/types";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import FillIcon from "./FillIcon";
import IconButton from "./IconButton";
import IdentityIcon from "./IdentityIcon";
import InboxIcon from "./InboxIcon";
import SettingsIcon from "./SettingsIcon";

const fill = (message: any) => chrome?.runtime?.sendMessage(message);

const Sidebar = () => {
  const [view, setView] = useLocalStorage<View>("throwaway-view", View.Main);
  const [, copy] = useCopyToClipboard();
  const { identity } = useIdentity();
  const { email } = useEmail();
  return (
    <div className='flex flex-col w-40 h-screen py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600'>
      <div className='flex flex-col items-center -mx-2'>
        <a href={identity?.avatar} target='_blank' rel='noopener noreferrer'>
          <img
            className='object-cover w-24 h-24 mx-2 rounded-full'
            src={identity?.avatar}
            alt='avatar'
          />
        </a>
        <h4 className='mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200 hover:underline'>
          {identity?.name}
        </h4>
        <button
          onClick={() => {
            copy(email);
            toast.success("Copied to clipboard");
          }}
          className='mx-2 mt-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:underline flex flex-col text-center items-center'
        >
          <h5 className='mx-2 mt-2 font-medium text-gray-800 dark:text-gray-400 hover:underline'>
            {email.split("@")[0]}
          </h5>
          <p>Copy Email</p>
        </button>
      </div>
      <div className='flex flex-col justify-between flex-1 mt-6'>
        <nav>
          <IconButton
            onClick={() => {
              fill(identity);
              toast.success("Forms filled!");
            }}
            active={false}
            component={<FillIcon />}
            label='Fill Form'
          />
          <IconButton
            onClick={() => setView(View.Main)}
            active={view === View.Main}
            component={<InboxIcon />}
            label='Inbox'
          />
          <IconButton
            onClick={() => setView(View.Identity)}
            active={view === View.Identity}
            component={<IdentityIcon />}
            label='Identity'
          />
          {/* <IconButton
            onClick={() => setView(View.Settings)}
            active={view === View.Settings}
            component={<SettingsIcon />}
            label='Settings'
          /> */}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
