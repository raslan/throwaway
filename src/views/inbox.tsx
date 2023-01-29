import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import EmailDialog from 'src/components/EmailDialog';
import EmailPreview from 'src/components/EmailPreview';
import SearchBar from 'src/components/SearchBar';
import SpinnerIcon from 'src/components/SpinnerIcon';
import { Email } from 'src/types';
import toast from 'react-hot-toast';
import { useCopyToClipboard } from 'usehooks-ts';
import useEmail from 'src/hooks/useEmail';

const MainView = () => {
  const { email, emails, otp } = useEmail();

  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState<Email>();
  const [, copy] = useCopyToClipboard();
  const fuse = useMemo(
    () =>
      new Fuse(emails, {
        keys: ['subject', 'from'],
        minMatchCharLength: 4,
        distance: 4,
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [emails]
  );

  const [search, setSearch] = useState('');
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(emails);

  useEffect(() => {
    setFilteredEmails(emails);
  }, [emails]);

  useEffect(() => {
    if (otp) {
      toast(
        (t) => (
          <div className='flex flex-col bg-white rounded-2xl -ml-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='flex flex-col ml-3'>
                  <div className='font-medium leading-none'>OTP: {otp}</div>
                </div>
              </div>
              <button
                className='flex-no-shrink text-black hover:text-white px-1 ml-2 py-1 text-xs hover:bg-purple-800 font-medium tracking-wider rounded-md'
                onClick={() => {
                  copy(otp);
                  toast.dismiss(t.id);
                  toast.success('Copied to clipboard');
                }}
              >
                <svg
                  width={16}
                  height={16}
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
              </button>
            </div>
          </div>
        ),
        {
          icon: <></>,
          duration: 3000,
          id: 'otp',
          position: 'top-right',
        }
      );
    }
  }, [otp]);

  useEffect(() => {
    if (search)
      setFilteredEmails(fuse.search(search).map(({ item }) => item) as Email[]);
    else setFilteredEmails(emails);
  }, [search]);

  return (
    <div className='flex flex-col w-full'>
      <section className='w-full max-w-md py-4 mx-auto rounded-md'>
        <div className='grid grid-cols-12 w-full justify-between items-center gap-4'>
          <SearchBar
            className='col-span-11'
            search={search}
            setSearch={setSearch}
          />
          {!emails && <SpinnerIcon />}
        </div>
        <div className='flex flex-wrap h-[20rem] max-h-full overflow-y-scroll content-start mt-4 pb-5'>
          {!emails.length && filteredEmails.length === 0 && (
            <div className='flex flex-col w-full h-3/4 items-center justify-center'>
              <div>
                <h1 className='text-3xl text-gray-400'>Inbox is empty</h1>
                <div className='mt-3'>
                  <SpinnerIcon />
                </div>
              </div>
              <p className='text-gray-400 mt-3'>
                Your email is{' '}
                <button
                  onClick={() => {
                    copy(email);
                    toast.success('Copied to clipboard');
                  }}
                  className='text-purple-300 hover:underline'
                >
                  {email}
                </button>
              </p>
            </div>
          )}
          {filteredEmails.map((email, i) => (
            <EmailPreview
              subject={email.subject}
              from={email.from}
              key={i}
              onClick={() => {
                setEmailData(email);
                setIsOpen(true);
              }}
            />
          ))}
        </div>
        {isOpen && (
          <EmailDialog
            emailData={emailData as Email}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </section>
    </div>
  );
};

export default MainView;
