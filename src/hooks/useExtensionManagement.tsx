import { useEffect, useCallback } from 'react';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useIdentity from '@/hooks/useIdentity';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';
import useEmailStore from '@/store/email';
import useEmail from '@/hooks/useEmail';
import useErrorBoundary from '@/hooks/useErrorBoundary';

export const useExtensionManagement = () => {
  const { setAdvanced } = useAdvancedMode();
  const { newIdentity, removeAllCustomIdentityFields } = useIdentity();
  const { reset } = useEmailStore();
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');
  const [, setView] = useLocalStorage('throwaway-view', '');
  useErrorBoundary();

  useEffect(() => {
    if (!theme) setTheme('dark');
    document.documentElement.className = theme;
  }, [theme]);

  const resetExtension = useCallback(() => {
    // Remove deprecated flags
    window?.localStorage?.removeItem?.('throwaway-identity');
    window?.localStorage?.removeItem?.('throwaway-advanced');
    window?.localStorage?.removeItem?.('throwaway-email');
    window?.localStorage?.removeItem?.('throwaway-email-lastupdate');
    window?.localStorage?.removeItem?.('throwaway-identity-toupdate');
    window?.localStorage?.removeItem?.('throwaway-token');
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
    setView('advanced');
    removeAllCustomIdentityFields();
    newIdentity();
    toast.success('Extension fully reset, new identity created.');
    window.location.reload();
  }, [
    newIdentity,
    setAdvanced,
    setTheme,
    reset,
    setView,
    removeAllCustomIdentityFields,
  ]);

  useEffect(() => {
    window.onerror = () => {
      resetExtension();
    };
  }, []);

  return { resetExtension };
};
