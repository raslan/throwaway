import EmailListItem from '@/components/email/EmailListItem';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import parse from 'parse-otp-message';
import { toast } from 'sonner';
import { Email } from 'src/types';

export default function EmailList({
  filteredEmails,
  setEmailData,
  setIsOpen,
  copy,
}: {
  filteredEmails: Email[];
  setEmailData: (email: Email) => void;
  setIsOpen: (isOpen: boolean) => void;
  copy: (text: string) => void;
}) {
  return (
    <ScrollArea className='h-[80%] w-full px-4 mt-12'>
      <ScrollBar forceMount />
      {filteredEmails.map((entry: Email, index) => (
        <ContextMenu>
          <ContextMenuTrigger>
            <EmailListItem
              key={`${entry.from}-${index}`}
              entry={entry}
              onClick={() => {
                setEmailData(entry);
                setIsOpen(true);
              }}
            />
          </ContextMenuTrigger>
          <ContextMenuContent className='w-64'>
            <ContextMenuItem asChild>
              <Button
                onClick={() => {
                  const { code } = parse(entry.body_text || entry.body_html);
                  // If code isn't the current year copy it, otherwise it's just a mismatch
                  if (code && code !== new Date().getFullYear().toString()) {
                    copy(code);
                    toast.success('Copied OTP to clipboard');
                  } else {
                    toast.error('No OTP found in email');
                  }
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                Copy OTP
              </Button>
            </ContextMenuItem>
            <ContextMenuItem asChild>
              <Button
                onClick={() => {
                  const content = entry.body_text || entry.body_html;
                  if (content) {
                    copy(content);
                    toast.success('Copied email content to clipboard');
                  } else {
                    toast.error('No content found in email');
                  }
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                Copy Email Content
              </Button>
            </ContextMenuItem>
            <ContextMenuItem asChild>
              <Button
                onClick={() => {
                  const element = document.createElement('a');
                  const content = entry.body_text || entry.body_html;
                  if (content) {
                    const file = new Blob([content], {
                      type: 'text/plain',
                    });
                    element.href = URL.createObjectURL(file);
                    element.download = 'email.txt';
                    document.body.appendChild(element);
                    element.click();
                    toast.success('Downloaded email as text file');
                  } else {
                    toast.error('No content found in email');
                  }
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                Download Email as Text
              </Button>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </ScrollArea>
  );
}
