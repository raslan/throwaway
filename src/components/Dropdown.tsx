import { Menu, Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Email } from 'src/types';
import { useCopyToClipboard } from 'usehooks-ts';
import urlRegex from 'url-regex';

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

  const copyOtp = () => {
    copy(otp);
    toast.success('Copied to clipboard');
  };

  const copyEmailText = () => {
    copy(email?.body_text);
    toast.success('Copied to clipboard');
  };

  const copyEmailHTML = () => {
    copy(email?.body_text);
    toast.success('Copied to clipboard');
  };

            <Menu.Item>
              {email?.body_text ? (
                <button
                  onClick={copyEmailText}
                  className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M13 7H7V5H13V7Z' fill='currentColor' />
                    <path d='M13 11H7V9H13V11Z' fill='currentColor' />
                    <path d='M7 15H13V13H7V15Z' fill='currentColor' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z'
                      fill='currentColor'
                    />
                  </svg>
                  Copy Email Text
                </button>
              ) : null}
            </Menu.Item>
            <Menu.Item>
              {email?.body_html ? (
                <button
                  onClick={copyEmailHTML}
                  className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M13 7H7V5H13V7Z' fill='currentColor' />
                    <path d='M13 11H7V9H13V11Z' fill='currentColor' />
                    <path d='M7 15H13V13H7V15Z' fill='currentColor' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z'
                      fill='currentColor'
                    />
                  </svg>
                  Copy Email HTML
                </button>
              ) : null}
            </Menu.Item>
            <Menu.Item>
              {otp ? (
                <button
                  onClick={copyOtp}
                  className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M13 7H7V5H13V7Z' fill='currentColor' />
                    <path d='M13 11H7V9H13V11Z' fill='currentColor' />
                    <path d='M7 15H13V13H7V15Z' fill='currentColor' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z'
                      fill='currentColor'
                    />
                  </svg>
                  Copy OTP
                </button>
              ) : null}
            </Menu.Item>
            <Menu.Item>
              {link ? (
                <a
                  className={`hover:bg-teal-700 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  href={link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M13 7H7V5H13V7Z' fill='currentColor' />
                    <path d='M13 11H7V9H13V11Z' fill='currentColor' />
                    <path d='M7 15H13V13H7V15Z' fill='currentColor' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z'
                      fill='currentColor'
                    />
                  </svg>
                  Open Link In Email
                </a>
              ) : null}
            </Menu.Item>
