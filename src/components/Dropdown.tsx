import { Menu, Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Email } from 'src/types';
import { useCopyToClipboard } from 'usehooks-ts';
import urlRegex from 'url-regex';
import CopyIcon from './CopyIcon';

export default function Dropdown({
  otp,
  email,
}: {
  otp: string;
  email: Email;
}) {
  const [, copy] = useCopyToClipboard();
  const [link, setLink] = useState('');

  useEffect(() => {
    const htmlFound = email?.body_html
      ?.match?.(urlRegex())
      ?.filter?.((el: string) => el?.startsWith('http'))?.[0];
    const textFound = email?.body_text
      ?.match?.(urlRegex())
      ?.filter?.((el: string) => el?.startsWith('http'))?.[0];
    if (htmlFound) setLink(htmlFound);
    if (textFound) setLink(textFound);
  }, [email]);

  const copyAndToast = (text: string) => {
    copy(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Menu as='div' className='inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex w-full justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
          <svg
            width={24}
            height={24}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6Z'
              fill='currentColor'
            />
            <path
              d='M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z'
              fill='currentColor'
            />
            <path
              d='M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18Z'
              fill='currentColor'
            />
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as='div'
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute z-30 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-800 border border-gray-400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='px-1 py-1'>
            <Menu.Item>
              <span>
                {email?.body_text ? (
                  <button
                    onClick={() => copyAndToast(email?.body_text)}
                    className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <CopyIcon />
                    Copy Email Text
                  </button>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item>
              <span>
                {email?.body_html ? (
                  <button
                    onClick={() => copyAndToast(email?.body_html)}
                    className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <CopyIcon />
                    Copy Email HTML
                  </button>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item>
              <span>
                {otp ? (
                  <button
                    onClick={() => copyAndToast(otp)}
                    className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <CopyIcon />
                    Copy OTP
                  </button>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item>
              <span>
                {link ? (
                  <a
                    className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    href={link}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <CopyIcon />
                    Open Link In Email
                  </a>
                ) : null}
              </span>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
