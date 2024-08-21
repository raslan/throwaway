import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeftCircleIcon } from 'lucide-react';
import { useRef } from 'react';
import { Email } from 'src/types';
import { useOnClickOutside } from 'usehooks-ts';

const EmailDialog = ({
  emailData,
  isOpen,
  setIsOpen,
}: {
  emailData: Email;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dialogRef, () => setIsOpen(false));
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTitle className='sr-only'>
        Email from {emailData.from} - Subject is {emailData.subject}
      </DialogTitle>
      <DialogContent className='top-[50%] max-w-[45rem] w-full m-0 overflow-y-auto max-h-[35rem] p-0 bg-primary text-primary-foreground'>
        <DialogClose asChild>
          <Button
            type='button'
            className='z-[9999] sticky top-0 p-6 w-full cursor-pointer opacity-85 group hover:underline'
          >
            <ArrowLeftCircleIcon className='mr-2 group-hover:mr-3 ease-in-out transition-all duration-150' />{' '}
            Back to Throwaway
          </Button>
        </DialogClose>
        <div className='w-full px-2'>
          <div
            ref={dialogRef}
            dangerouslySetInnerHTML={{
              __html: emailData?.body_html
                ? emailData?.body_html
                : (emailData?.body_text as string),
            }}
          ></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
