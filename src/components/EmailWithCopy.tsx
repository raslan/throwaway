import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FALLBACK_PROVIDER_NAME } from '@/config/brand';
import { ThrowawayEmail } from 'src/types';

export default function EmailWithCopy({
  email,
  selectEmail,
  emailAddresses,
  copy,
  displayOnly,
}: {
  email: string;
  selectEmail: (index: number) => void;
  emailAddresses: ThrowawayEmail[];
  copy: (text: string) => Promise<boolean>;
  displayOnly?: boolean;
}) {
  return (
    <div className='email-with-copy'>
      <Combobox
        displayOnly={displayOnly}
        value={email}
        setValue={(value) =>
          selectEmail(
            emailAddresses.findIndex((email) => email.email === value)
          )
        }
        options={emailAddresses.map((emailEntry) => ({
          label: `${emailEntry?.email} (${emailEntry?.provider || FALLBACK_PROVIDER_NAME})`,
          value: emailEntry.email,
        }))}
      />
      <Button
        variant='outline'
        onClick={() => {
          copy(email);
          toast.success('Copied to clipboard');
        }}
        className='copy-button instrument-button h-11 shrink-0'
      >
        <CopyIcon className='w-4 h-4' strokeWidth={1.6} />
        <span>Copy</span>
      </Button>
    </div>
  );
}
