import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailWithCopy({
  email,
  selectEmail,
  emailAddresses,
  copy,
  displayOnly,
}: {
  email: string;
  selectEmail: (index: number) => void;
  emailAddresses: { email: string; token: string }[];
  copy: (text: string) => Promise<boolean>;
  displayOnly?: boolean;
}) {
  return (
    <>
      <Combobox
        displayOnly={displayOnly}
        value={email}
        setValue={(value) =>
          selectEmail(
            emailAddresses.findIndex((email) => email.email === value)
          )
        }
        options={emailAddresses.map((email) => ({
          label: email.email,
          value: email.email,
        }))}
      />
      <Button
        variant='expandIcon'
        iconPlacement='right'
        Icon={() => <span>Copy</span>}
        onClick={() => {
          copy(email);
          toast.success('Copied to clipboard');
        }}
        className='flex gap-2'
      >
        <CopyIcon className='w-5 h-5 opacity-70' />
      </Button>
    </>
  );
}
