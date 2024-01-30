import { useEffect } from 'react';
import { useIsFirstRender } from 'usehooks-ts';
import useChromeStorage from './useChromeStorage';

export type advanced = {
  card: boolean;
  cardParams: {
    provider?: 'stripe' | 'paypal' | 'amazon' | 'fawrypay' | 'paymob' | 'none';
    brand?: 'visa' | 'mastercard';
    variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
  };
};

const useAdvancedMode = (): useAdvancedResponse => {
  const [advanced, setAdvanced] = useChromeStorage('throwaway-advanced', {
    card: false,
    cardParams: {},
  });

  const isFirstRender = useIsFirstRender();

  const [, setToUpdate] = useChromeStorage<boolean>(
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
