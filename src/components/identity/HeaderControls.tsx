import { Button } from '@/components/ui/button';
import { fill, generateCode } from '@/lib/autofill-client';
import { Dice6Icon, PaintBucketIcon } from 'lucide-react';
import { useState } from 'react';

export default function HeaderControls({
  newIdentity,
  identity,
  otp,
}: {
  newIdentity: (keepEmail?: boolean) => void;
  identity: Record<string, any>;
  otp: string;
}) {
  const [status, setStatus] = useState('');

  return (
    <div className='pt-4 flex flex-wrap items-center gap-3'>
      <div className='flex gap-2'>
        <Button
          onClick={() => {
            void newIdentity();
            setStatus('[GENERATED]');
          }}
          className='gap-2 group mission-critical h-11 px-5'
        >
          <Dice6Icon className='w-4 h-4' strokeWidth={1.7} />
          <span>Generate</span>
        </Button>
        <Button
          variant='outline'
          className='gap-2 group instrument-button h-11 px-5'
          onClick={async () => {
            setStatus('[FILLING]');
            const result = await fill({
              ...identity,
              metadata: {},
              ...generateCode(otp),
            });
            if (result.ok && result.filled > 0) {
              setStatus(`[FILLED ${result.filled}]`);
              return;
            }

            setStatus(`[ERROR: ${result.error || 'NO MATCH'}]`);
          }}
        >
          <PaintBucketIcon className='w-4 h-4' strokeWidth={1.7} />
          <span>Autofill</span>
        </Button>
      </div>
      {status && <span className='inline-status'>{status}</span>}
    </div>
  );
}
