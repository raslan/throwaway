import AddressCountryOptions from '@/components/advanced/AddressCountryOptions';
import CardControlOptions from '@/components/advanced/CardControlOptions';
import IdentityFieldsOptions from '@/components/advanced/IdentityFieldsOptions';
import ResetExtensionData from '@/components/advanced/ResetExtensionData';
import SensitivityOptions from '@/components/advanced/SensitivityOptions';
import SwitchToggle from '@/components/advanced/SwitchToggle';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import useAdvancedMode from 'src/hooks/useAdvancedMode';
import useIdentity from 'src/hooks/useIdentity';
import { useLocalStorage } from 'usehooks-ts';

const AdvancedMode = () => {
  const { setAdvanced, ...advanced } = useAdvancedMode();
  const {
    identity,
    newIdentity,
    addCustomIdentityField,
    removeCustomIdentityField,
  } = useIdentity();
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  useEffect(() => {
    if (advanced.card && !advanced.cardParams.provider) {
      setAdvanced({
        ...advanced,
        cardParams: {
          provider: 'stripe',
          brand: 'visa',
          variant: 'basic',
        },
      });
    }
  }, [advanced.card]);

  useEffect(() => {
    newIdentity(true);
  }, [advanced]);

  return (
    <div className='grid w-full max-h-[90%] p-6 grid-cols-1 space-y-1 gap-3 overflow-y-auto'>
      {/* Address Country */}
      <AddressCountryOptions advanced={advanced} setAdvanced={setAdvanced} />
      <Separator className='bg-primary/20' />

      {/* Testing Cards */}
      <CardControlOptions
        advanced={advanced}
        setAdvanced={setAdvanced}
        identity={identity}
      />
      <Separator className='bg-primary/20' />

      {/* Autofill Sensitivity */}
      <SensitivityOptions advanced={advanced} setAdvanced={setAdvanced} />
      <Separator className='bg-primary/20' />

      {/* Custom Identity Fields */}
      <IdentityFieldsOptions
        advanced={advanced}
        setAdvanced={setAdvanced}
        identity={identity}
        addCustomIdentityField={addCustomIdentityField}
        removeCustomIdentityField={removeCustomIdentityField}
      />
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
