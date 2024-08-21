import { Button } from '@/components/ui/button';
import { Email } from 'src/types';

interface EmailListItemProps {
  entry: Email;
  onClick: () => void;
}

const EmailListItem = ({ entry, onClick }: EmailListItemProps) => {
  return (
    <Button
      variant='outline'
      className='h-max justify-start transition-all hover:bg-accent border-primary/50 flex flex-col items-start gap-2 rounded-sm p-3 text-left w-full max-w-[95vw] mt-4'
      onClick={onClick}
    >
      <div className='flex justify-between w-full'>
        <span className='text-lg font-bold truncate'>{entry.from}</span>
        <span className='text-base text-muted-foreground'>
          {entry?.created_at ?? ''}
        </span>
      </div>
      <span className='text-lg font-semibold text-primary'>
        {entry?.subject ?? ''}
      </span>
      <p className='line-clamp-3 text-base text-muted-foreground whitespace-normal max-w-full'>
        {entry?.body_text?.substring?.(0, 300) ?? ''}
      </p>
    </Button>
  );
};

export default EmailListItem;
