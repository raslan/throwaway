import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useIsFirstRender } from './useIsFirstRender';

export type advanced = {
  card: boolean;
  cardParams: {
    provider?: 'stripe' | 'paypal' | 'amazon' | 'fawrypay' | 'paymob' | 'none';
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
    if (!existing.length) {
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
