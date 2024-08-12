import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import EmailDialog from 'src/components/EmailDialog';
import EmailPreview from 'src/components/EmailPreview';
import SearchBar from 'src/components/SearchBar';
import SpinnerIcon from 'src/components/SpinnerIcon';
import useEmail from 'src/hooks/useEmail';
import { useEmailSearch } from 'src/hooks/useEmailSearch';
import { Email } from 'src/types';
import { useCopyToClipboard } from 'usehooks-ts';

const Inbox = ({ isFullscreen = false }: { isFullscreen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState<Email | null>(null);
  const [, copy] = useCopyToClipboard();
  const { email, emails } = useEmail();
  const { search, setSearch, filteredEmails } = useEmailSearch(emails);

  return (
    <div
      className={`flex flex-col w-full ${isFullscreen && 'scale-110 pt-32'}`}
    >
      <section className='w-full max-w-md py-4 mx-auto rounded-md'>
        <div className='grid grid-cols-12 w-full justify-between items-center gap-4'>
          <SearchBar
            className={`${!isFullscreen ? 'col-span-11' : 'col-span-12'}`}
            search={search}
            setSearch={setSearch}
          />
          {!isFullscreen && (
            <button
              className='text-gray-200 duration-500 hover:scale-110 hover:text-white font-bold'
              onClick={() => chrome.runtime.openOptionsPage()}
            >
              Fullscreen
            </button>
          )}
        </div>
        <div
          className={`flex flex-wrap ${
            isFullscreen ? 'h-96' : 'h-[20rem]'
          } max-h-full overflow-y-scroll content-start mt-4 pb-5`}
        >
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
                  className='text-teal-300 hover:underline'
                >
                  {email}
                </button>
              </p>
            </div>
          )}
          {filteredEmails.map((email, i) => (
            <Fragment key={`${i}-${email.from}`}>
              <div className='flex justify-between items-center w-full'>
                <div className='w-5/6'>
                  <EmailPreview
                    subject={email.subject}
                    from={email.from}
                    onClick={() => {
                      setEmailData(email);
                      setIsOpen(true);
                    }}
                  />
                </div>
                {/* <div className='w-1/6'>
                  <Dropdown otp={otp} email={email} />
                </div> */}
              </div>
            </Fragment>
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

export default Inbox;
