import { IdentityDetails } from '@/components/identity/IdentityDetails';
import { IdentityHeader } from '@/components/identity/IdentityHeader';

const Identity = () => {
  return (
    <div className='flex flex-col w-full h-full pt-8 px-5 gap-3 pb-[68px] overflow-hidden'>
      <IdentityHeader />
      <IdentityDetails />
    </div>
  );
};

export default Identity;
