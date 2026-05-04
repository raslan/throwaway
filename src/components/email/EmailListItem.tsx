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
      className='h-max justify-start transition-all hover:bg-[#11161c] flex flex-col items-start gap-2 p-4 text-left w-full mt-3 card-shell'
      onClick={onClick}
    >
      <div className='flex justify-between w-full'>
        <span className='technical-label truncate text-white'>{entry.from}</span>
        <span className='technical-label text-white/50'>
          {entry?.created_at ?? ''}
        </span>
      </div>
      <span className='text-base font-semibold text-white'>
        {entry?.subject ?? ''}
      </span>
      <p className='line-clamp-3 text-sm text-white/65 whitespace-normal max-w-full'>
        {entry?.body_text?.substring?.(0, 300) ?? ''}
      </p>
    </Button>
  );
};

export default EmailListItem;
