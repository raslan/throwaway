import { useEffect, useCallback } from 'react';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useIdentity from '@/hooks/useIdentity';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';
import useEmailStore from '@/store/email';

export const useExtensionManagement = () => {
  const { setAdvanced } = useAdvancedMode();
  const { newIdentity, removeAllCustomIdentityFields } = useIdentity();
  const { reset } = useEmailStore();
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  useEffect(() => {
    if (!theme) setTheme('dark');
    document.documentElement.className = theme;
  }, [theme]);

  const resetExtension = useCallback(() => {
    setAdvanced({
      advancedCardMode: false,
      cardParams: {
        provider: 'stripe',
        brand: 'visa',
        variant: 'basic',
      },
      localeIndex: 0,
      controlSensitivity: false,
      sensitivity: 'medium',
      addIdentityFields: false,
    } as any);
    reset();
    setTheme('dark');
    removeAllCustomIdentityFields();
    newIdentity();
    toast.success('Extension fully reset, new identity created.');
  }, [newIdentity, setAdvanced, setTheme, reset]);

  return { resetExtension };
};
