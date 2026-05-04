import { Button } from '@/components/ui/button';
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
  const cardNumber = identity?.card_number ?? '';
  const groupedNumber = cardNumber.replace(/(.{4})/g, '$1 ').trim();

  return (
    <>
      {identity?.card_number &&
      identity?.card_expiry &&
      identity.card_verification ? (
        <ContextMenu>
          <ContextMenuTrigger>
            <div className='instrument-card' role='button'>
              <div>
                <p className='technical-label'>Disposable card</p>
                <p className='instrument-card-number'>{groupedNumber}</p>
              </div>
              <div className='instrument-card-footer'>
                <span>Right click to copy</span>
                <span>Exp {identity?.card_expiry}</span>
                <span>CVC {identity?.card_verification}</span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className='w-64'>
            <ContextMenuItem asChild>
              <Button
                onClick={() => {
                  if (identity?.card_number) {
                    copy(identity?.card_number);
                    toast.success('Copied to clipboard');
                  }
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
                  if (identity?.card_expiry) {
                    copy(identity?.card_expiry);
                    toast.success('Copied to clipboard');
                  }
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
                  if (identity?.card_expiry) {
                    copy(identity?.card_expiry?.split?.('/')?.[0]);
                    toast.success('Copied to clipboard');
                  }
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
                  if (identity?.card_expiry) {
                    copy(identity?.card_expiry?.split?.('/')?.[1]);
                    toast.success('Copied to clipboard');
                  }
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
                  if (identity?.card_verification) {
                    copy(identity?.card_verification);
                    toast.success('Copied to clipboard');
                  }
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                Copy CVC
              </Button>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) : null}
    </>
  );
};

export default CardWithControls;
