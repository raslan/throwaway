import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface NoEmailsComponentProps {
  isRefreshing?: boolean;
  lastCheckedAt?: Date | null;
  onRefresh?: () => void;
}

const formatCheckedAt = (value?: Date | null) => {
  if (!value) return 'Not checked yet';
  return `Last checked ${value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`;
};

const NoEmailsComponent = ({
  isRefreshing = false,
  lastCheckedAt,
  onRefresh,
}: NoEmailsComponentProps) => {
  return (
    <div className='NoEmailsComponent card-shell flex flex-col w-full h-full items-start justify-center gap-5 px-12'>
      <h1>00</h1>
      <div className='flex flex-wrap items-center gap-3'>
        <span
          className={`h-2 w-2 rounded-full ${
            isRefreshing ? 'bg-white' : 'bg-[var(--urgency-red)]'
          }`}
        />
        <p className='technical-label text-white/80'>
          {isRefreshing ? 'Checking inbox' : 'Polling every 3 seconds'}
        </p>
        <p className='technical-label text-white/45'>
          {formatCheckedAt(lastCheckedAt)}
        </p>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='technical-label gap-2 border-white/20 bg-transparent text-white hover:bg-white hover:text-black'
          disabled={isRefreshing}
          onClick={onRefresh}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default NoEmailsComponent;
