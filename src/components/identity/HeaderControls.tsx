import { Button } from '@/components/ui/button';
import { fill, generateCode } from '@/lib/utils';
import { Dice6Icon, PaintBucketIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function HeaderControls({
  newIdentity,
  identity,
  otp,
}: {
  newIdentity: (keepEmail?: boolean) => void;
  identity: Record<string, any>;
  otp: string;
}) {
  return (
    <div className='pt-6 flex gap-3'>
      <Button
        onClick={() => {
          newIdentity();
          toast.success('Created a new identity!');
        }}
        className='gap-1 group text-base'
      >
        <Dice6Icon className='w-5 h-5 group-hover:rotate-90 motion-safe:duration-500' />
        <span>Generate New Identity</span>
      </Button>
      <Button
        variant='outline'
        className='border-primary/60 gap-1 group text-base'
        onClick={() => {
          fill({ ...identity, ...generateCode(otp) });
          toast.success('Page autofilled!');
        }}
      >
        <PaintBucketIcon className='w-5 h-5 group-hover:rotate-[20deg] motion-safe:duration-300' />
        <span>Autofill</span>
      </Button>
    </div>
  );
}
