import { IdentityDetails } from '@/components/identity/IdentityDetails';
import { IdentityHeader } from '@/components/identity/IdentityHeader';

const Identity = () => {
  return (
    <div className='flex flex-col w-full h-full p-6 space-y-4 pb-12'>
      <IdentityHeader />
      <IdentityDetails />
    </div>
  );
};

export default Identity;
