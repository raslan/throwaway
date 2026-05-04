import EmailList from '@/components/email/EmailList';
import NoEmailsComponent from '@/components/email/NoEmailsComponent';
import SearchBox from '@/components/email/SearchBox';
import EmailDialog from '@/components/EmailDialog';
import EmailWithCopy from '@/components/EmailWithCopy';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import useEmail from 'src/hooks/useEmail';
import { useEmailSearch } from 'src/hooks/useEmailSearch';
import { Email } from 'src/types';
import { useCopyToClipboard } from 'usehooks-ts';

const Inbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState<Email | null>(null);
  const [, copy] = useCopyToClipboard();
  const {
    email,
    emails,
    emailAddresses,
    isRefreshing,
    lastCheckedAt,
    refreshEmails,
    selectEmail,
  } = useEmail();
  const { search, setSearch, filteredEmails } = useEmailSearch(emails);

  return (
    <div className='flex flex-col gap-3 w-full h-full pt-9 px-4 pb-20'>
      <div className='view-header card-shell px-5 py-2'>
        <h2>Email Inbox</h2>
      </div>
      <div className='sticky top-0 z-10 flex justify-between items-center gap-3 py-2'>
        <div className='flex items-center min-w-0 gap-3'>
          <EmailWithCopy
            email={email}
            selectEmail={selectEmail}
            emailAddresses={emailAddresses}
            copy={copy}
          />
          <Button
            type='button'
            variant='outline'
            size='icon'
            title='Refresh inbox'
            aria-label='Refresh inbox'
            disabled={isRefreshing}
            onClick={refreshEmails}
            className='h-10 w-10 shrink-0 border-white/20 bg-transparent text-white hover:bg-white hover:text-black'
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
        {!!emails.length && (
          <div className='max-w-[360px]'>
            <SearchBox search={search} setSearch={setSearch} />
          </div>
        )}
      </div>
      {!emails.length && filteredEmails.length === 0 && (
        <NoEmailsComponent
          isRefreshing={isRefreshing}
          lastCheckedAt={lastCheckedAt}
          onRefresh={refreshEmails}
        />
      )}
      {filteredEmails.length > 0 && (
        <EmailList
          filteredEmails={filteredEmails}
          setEmailData={setEmailData}
          setIsOpen={setIsOpen}
          copy={copy}
        />
      )}
      {isOpen && (
        <EmailDialog
          emailData={emailData as Email}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default Inbox;
