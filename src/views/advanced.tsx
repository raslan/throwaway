import AddressCountryOptions from '@/components/advanced/AddressCountryOptions';
import CardControlOptions from '@/components/advanced/CardControlOptions';
import IdentityFieldsOptions from '@/components/advanced/IdentityFieldsOptions';
import ResetExtensionData from '@/components/advanced/ResetExtensionData';
import SensitivityOptions from '@/components/advanced/SensitivityOptions';
import EmailProviderOptions from '@/components/advanced/EmailProviderOptions';
import SwitchToggle from '@/components/advanced/SwitchToggle';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from 'usehooks-ts';

const AdvancedMode = () => {
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  return (
    <div className='grid w-full h-full pt-9 px-4 pb-16 grid-cols-1 gap-4 overflow-y-auto'>
      <div className='view-header card-shell px-5 py-2'>
        <h1>Configuration</h1>
      </div>

      <div className='card-shell p-5 space-y-4'>
        <EmailProviderOptions />
      </div>

      <div className='card-shell p-5 space-y-4'>
        <AddressCountryOptions />
        <Separator className='bg-white/20' />
        <CardControlOptions />
        <Separator className='bg-white/20' />
        <SensitivityOptions />
        <Separator className='bg-white/20' />
        <IdentityFieldsOptions />
      </div>

      <div className='card-shell p-5 space-y-4'>
        <SwitchToggle
          label='Dark Chassis Mode'
          id='dark-mode'
          checked={theme === 'dark'}
          onCheckedChange={() => {
            setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'));
          }}
        />
        <ResetExtensionData />
      </div>
    </div>
  );
};

export default AdvancedMode;
