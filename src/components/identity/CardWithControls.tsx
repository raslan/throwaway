import { Button } from '@/components/ui/button';
import ReactCreditCard from 'react-credit-cards-2';
import { toast } from 'sonner';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

const CardWithControls = ({
  identity,
  copy,
}: {
  identity: Record<string, any>;
  copy: (text: string) => Promise<boolean>;
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ReactCreditCard
          number={identity?.card_number}
          expiry={identity?.card_expiry}
          cvc={identity?.card_verification}
          name='Right Click To Copy'
          acceptedCards={['']}
        />
      </ContextMenuTrigger>
      <ContextMenuContent className='w-64'>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              copy(identity?.card_number);
              toast.success('Copied to clipboard');
            }}
            variant='ghost'
            className='w-full justify-start'
          >
            Copy Credit Card Number
          </Button>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              copy(identity?.card_expiry);
              toast.success('Copied to clipboard');
            }}
            variant='ghost'
            className='w-full justify-start'
          >
            Copy Expiry Date
          </Button>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              copy(identity?.card_expiry.split('/')[0]);
              toast.success('Copied to clipboard');
            }}
            variant='ghost'
            className='w-full justify-start'
          >
            Copy Expiry Month
          </Button>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              copy(identity?.card_expiry.split('/')[1]);
              toast.success('Copied to clipboard');
            }}
            variant='ghost'
            className='w-full justify-start'
          >
            Copy Expiry Year
          </Button>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              copy(identity?.card_verification);
              toast.success('Copied to clipboard');
            }}
            variant='ghost'
            className='w-full justify-start'
          >
            Copy CVC
          </Button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CardWithControls;
