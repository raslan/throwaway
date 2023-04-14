import { useEffect } from 'react';
import { useIsFirstRender, useLocalStorage } from 'usehooks-ts';

export type advanced = {
  card: boolean;
  cardParams: {
    provider?: 'stripe' | 'paypal' | 'amazon' | 'fawrypay' | 'none';
    brand?: 'visa' | 'mastercard';
    variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
  };
};

const useAdvancedMode = (): useAdvancedResponse => {
  const [advanced, setAdvanced] = useLocalStorage('throwaway-advanced', {
    card: false,
    cardParams: {},
  });

  const isFirstRender = useIsFirstRender();

  const [, setToUpdate] = useLocalStorage<boolean>(
    'throwaway-identity-toupdate',
    false
  );

  useEffect(() => {
    const existing = Object.keys(advanced);
    if (!existing.length || existing.includes('useAlternateProvider')) {
      setAdvanced({
        card: false,
        cardParams: {},
      });
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) setToUpdate(true);
  }, [advanced.card]);

  return { ...advanced, setAdvanced };
};

type useAdvancedResponse = advanced & {
  setAdvanced: (val: advanced) => void;
};

export default useAdvancedMode;
