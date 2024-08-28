import EmailWithCopy from '@/components/EmailWithCopy';
import CardWithControls from '@/components/identity/CardWithControls';
import HeaderControls from '@/components/identity/HeaderControls';
import Heading from '@/components/identity/Heading';
import useEmail from 'src/hooks/useEmail';
import useIdentity from 'src/hooks/useIdentity';
import { useCopyToClipboard } from 'usehooks-ts';
import ThrowawayIcon from '@/components/ThrowawayIcon';

export function IdentityHeader() {
  const { identity, newIdentity } = useIdentity();
  const { email, emailAddresses, selectEmail, otp } = useEmail();
  const [, copy] = useCopyToClipboard();

  return (
    <div className='flex justify-between pr-3'>
      <div className='pt-3'>
        <div className='flex items-center'>
          <Heading>
            <div className='bg-primary dark:bg-background p-1 rounded-md'>
              <ThrowawayIcon className='w-8 h-8' />
            </div>
            <span>{identity?.name}</span>
          </Heading>
        </div>
        <div className='flex items-center pt-6'>
          <EmailWithCopy
            email={email}
            selectEmail={selectEmail}
            emailAddresses={emailAddresses}
            copy={copy}
            displayOnly
          />
        </div>
        <HeaderControls
          newIdentity={newIdentity}
          identity={identity}
          otp={otp}
        />
      </div>
      <div>
        <CardWithControls identity={identity} copy={copy} />
      </div>
    </div>
  );
}
