import EmailWithCopy from '@/components/EmailWithCopy';
import CardWithControls from '@/components/identity/CardWithControls';
import HeaderControls from '@/components/identity/HeaderControls';
import Heading from '@/components/identity/Heading';
import useEmail from 'src/hooks/useEmail';
import useIdentity from '@/hooks/useIdentity';
import { useCopyToClipboard } from 'usehooks-ts';
import ThrowawayIcon from '@/components/ThrowawayIcon';
import { FALLBACK_PROVIDER_NAME } from '@/config/brand';

export function IdentityHeader() {
  const { identity, newIdentity } = useIdentity();
  const { email, emailAddresses, selectEmail, otp, provider } = useEmail();
  const [, copy] = useCopyToClipboard();

  return (
    <div className='identity-header card-shell px-5 py-4 grid grid-cols-[minmax(0,1fr)_252px] gap-5'>
      <div className='flex-1 min-w-0'>
        <div className='technical-label mb-3'>Active Persona</div>
        <div className='flex items-center'>
          <Heading>
            <div className='identity-mark'>
              <ThrowawayIcon className='w-5 h-5' />
            </div>
            <span>{identity?.name}</span>
          </Heading>
        </div>
        <div className='identity-email-row pt-4 min-w-0 max-w-[456px]'>
          <EmailWithCopy
            email={email}
            selectEmail={selectEmail}
            emailAddresses={emailAddresses}
            copy={copy}
            displayOnly
          />
          <span className='provider-chip'>
            {provider || FALLBACK_PROVIDER_NAME}
          </span>
        </div>
        <HeaderControls
          newIdentity={newIdentity}
          identity={identity}
          otp={otp}
        />
      </div>
      <div className='flex items-stretch justify-end min-w-0'>
        <CardWithControls identity={identity} copy={copy} />
      </div>
    </div>
  );
}
