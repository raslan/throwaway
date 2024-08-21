import { useEffect, useCallback } from 'react';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useIdentity from '@/hooks/useIdentity';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';

export const useExtensionManagement = () => {
  const { setAdvanced, ...advanced } = useAdvancedMode();
  const { newIdentity, identity } = useIdentity();
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  useEffect(() => {
    if (!theme) setTheme('dark');
    // Set the theme class on the document element
    document.documentElement.className = theme;
  }, [theme]);

  const resetExtension = useCallback(() => {
    window?.localStorage?.removeItem('throwaway-identity');
    window?.localStorage?.removeItem('throwaway-email');
    window?.localStorage?.removeItem('throwaway-advanced');
    window?.localStorage?.removeItem('throwaway-email-addresses');
    window?.localStorage?.removeItem('throwaway-email-lastupdate');
    setAdvanced({
      card: false,
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
    setTheme('dark');
    newIdentity();
    toast.success('Extension fully reset, new identity created.');
  }, [newIdentity, setAdvanced, setTheme]);

  useEffect(() => {
    const deprecated = identity['throwaway-version'] !== '4.0.0';
    if (deprecated) {
      window?.localStorage?.clear();
      resetExtension();
    }
  }, [identity]);

  useEffect(() => {
    newIdentity(true);
  }, [
    advanced.card,
    advanced.controlSensitivity,
    advanced.addIdentityFields,
    advanced.localeIndex,
    advanced.sensitivity,
    advanced.cardParams,
  ]);

  return { resetExtension };
};
