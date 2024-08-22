import AddressCountryOptions from '@/components/advanced/AddressCountryOptions';
import CardControlOptions from '@/components/advanced/CardControlOptions';
import IdentityFieldsOptions from '@/components/advanced/IdentityFieldsOptions';
import ResetExtensionData from '@/components/advanced/ResetExtensionData';
import SensitivityOptions from '@/components/advanced/SensitivityOptions';
import SwitchToggle from '@/components/advanced/SwitchToggle';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from 'usehooks-ts';

const AdvancedMode = () => {
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  return (
    <div className='grid w-full max-h-[90%] p-6 grid-cols-1 space-y-1 gap-3 overflow-y-auto'>
      {/* Address Country */}
      <AddressCountryOptions />

      <Separator className='bg-primary/20' />

      {/* Testing Cards */}
      <CardControlOptions />

      <Separator className='bg-primary/20' />

      {/* Autofill Sensitivity */}
      <SensitivityOptions />

      <Separator className='bg-primary/20' />

      {/* Custom Identity Fields */}
      <IdentityFieldsOptions />

      <Separator className='bg-primary/20' />

      {/* Misc */}

      {/* Dark Mode */}
      <SwitchToggle
        label='Dark Mode'
        id='dark-mode'
        checked={theme === 'dark'}
        onCheckedChange={() => {
          setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'));
        }}
      />

      {/* Reset Extension Data */}
      <ResetExtensionData />
    </div>
  );
};

export default AdvancedMode;
