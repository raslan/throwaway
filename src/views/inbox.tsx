import EmailList from '@/components/email/EmailList';
import NoEmailsComponent from '@/components/email/NoEmailsComponent';
import SearchBox from '@/components/email/SearchBox';
import EmailDialog from '@/components/EmailDialog';
import EmailWithCopy from '@/components/EmailWithCopy';
import { useState } from 'react';
import useEmail from 'src/hooks/useEmail';
import { useEmailSearch } from 'src/hooks/useEmailSearch';
import { Email } from 'src/types';
import { useCopyToClipboard } from 'usehooks-ts';

const Inbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState<Email | null>(null);
  const [, copy] = useCopyToClipboard();
  const { email, emails, emailAddresses, selectEmail } = useEmail();
  const { search, setSearch, filteredEmails } = useEmailSearch(emails);

  return (
    <div className='flex flex-col gap-3 w-full h-full pt-4 px-1'>
      <div className='flex justify-between items-center absolute w-full pr-2 py-1'>
        <div className='pl-4 flex items-center'>
          <EmailWithCopy
            email={email}
            selectEmail={selectEmail}
            emailAddresses={emailAddresses}
            copy={copy}
          />
        </div>
        {!!emails.length && (
          <div className='px-4'>
            <SearchBox search={search} setSearch={setSearch} />
          </div>
        )}
      </div>
      {!emails.length && filteredEmails.length === 0 && <NoEmailsComponent />}
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
