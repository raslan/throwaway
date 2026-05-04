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
  const { removeAllCustomIdentityFields } = useIdentity();
  const { reset } = useEmailStore();
  const [theme, setTheme] = useLocalStorage('throwaway-theme', '');
  const [, setView] = useLocalStorage('throwaway-view', '');
  useErrorBoundary();

  useEffect(() => {
    if (!theme) setTheme('dark');
    document.documentElement.className = theme;
  }, [theme]);

  const clearPersistentState = useCallback(() => {
    // Clear legacy localStorage keys
    [
      'throwaway-identity',
      'throwaway-advanced',
      'throwaway-email',
      'throwaway-email-lastupdate',
      'throwaway-identity-toupdate',
      'throwaway-token',
      'throwaway-profiles-storage',
      'throwaway-identity-storage',
      'throwaway-advanced-storage',
      'throwaway-email-storage',
      'throwaway-theme',
      'throwaway-view',
    ].forEach((key) => window?.localStorage?.removeItem?.(key));

    // Clear extension runtime storage used by service worker messages
    if (chrome?.storage?.local) {
      chrome.storage.local.clear();
    }
  }, []);

  const resetExtension = useCallback(() => {
    try {
      clearPersistentState();
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
        emailProvider: 'throwaway',
        customEmailDomain: '',
        defaultSmsNumber: '',
        gmailnatorApiHost: 'https://gmailnator.p.rapidapi.com',
        gmailnatorApiKey: '',
        emailnatorApiHost: 'https://emailnator.p.rapidapi.com',
        emailnatorApiKey: '',
      } as any);

      reset();
      setTheme('dark');
      setView('advanced');
      removeAllCustomIdentityFields();
      toast.success('Extension fully reset. Reloading...');
      window.location.reload();
    } catch (error) {
      console.error('Failed to fully reset extension state.', error);
      toast.error('Could not clear all state, forcing reload.');
      window.location.reload();
    }

  }, [
    setAdvanced,
    clearPersistentState,
    reset,
    setTheme,
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
