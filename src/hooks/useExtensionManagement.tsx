import { useEffect, useCallback } from 'react';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useIdentity from '@/hooks/useIdentity';
import { toast } from 'sonner';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import useEmailStore from '@/store/email';

export const useExtensionManagement = () => {
  const { setAdvanced } = useAdvancedMode();
  const { newIdentity, removeAllCustomIdentityFields } = useIdentity();
  const { reset } = useEmailStore();
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');

  // Add a flag to update old extension versions
  const legacy = useReadLocalStorage('throwaway-identity');

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

  useEffect(() => {
    if ((legacy as any)?.email) {
      window?.localStorage?.removeItem('throwaway-identity');
      window?.localStorage?.removeItem('throwaway-email');
      window?.localStorage?.clear();
      resetExtension();
    }
  }, [legacy]);

  return { resetExtension };
};
