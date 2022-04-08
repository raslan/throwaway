import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { View } from "src/types";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import IconButton from "./IconButton";
import IdentityIcon from "./IdentityIcon";
import InboxIcon from "./InboxIcon";
import SettingsIcon from "./SettingsIcon";

const Sidebar = () => {
  const [view, setView] = useLocalStorage<View>("throwaway-view", View.Main);
  const [email, setEmail] = useState("");
  const [, copy] = useCopyToClipboard();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}`)
      .then((res) => res.json())
      .then(({ email }) => setEmail(email));
  }, []);

  return (
    <div className='flex flex-col w-40 h-screen py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600'>
      <div className='flex flex-col items-center -mx-2'>
        <img
          className='object-cover w-24 h-24 mx-2 rounded-full'
          src='https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
          alt='avatar'
        />
        <h4 className='mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200 hover:underline'>
          John Doe
        </h4>
        <button
          onClick={() => {
            copy(email);
            toast.success("Copied to clipboard");
          }}
          className='mx-2 mt-1 text-xs font-medium text-left text-gray-600 dark:text-gray-400 hover:underline'
        >
          Copy Email
        </button>
      </div>
      <div className='flex flex-col justify-between flex-1 mt-6'>
        <nav>
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
          <IconButton
            onClick={() => setView(View.Settings)}
            active={view === View.Settings}
            component={<SettingsIcon />}
            label='Settings'
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
