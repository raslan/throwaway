import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';

export type AdvancedPropType = {
  advanced: advanced;
  setAdvanced: (val: advanced) => void;
};

export type advanced = {
  card: boolean;
  cardParams: {
    provider?: 'stripe' | 'paypal' | 'amazon' | 'fawrypay' | 'paymob' | 'none';
    brand?: 'visa' | 'mastercard';
    variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
  };
  localeIndex: number;
  controlSensitivity: boolean;
  sensitivity: string;
  addIdentityFields: boolean;
};

const useAdvancedMode = (): useAdvancedResponse => {
  const [advanced, setAdvanced] = useLocalStorage('throwaway-advanced', {
    card: false,
    cardParams: {},
    localeIndex: 0,
    controlSensitivity: false,
    sensitivity: 'medium',
    addIdentityFields: false,
  });

  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    const existing = Object.keys(advanced);
    if (!existing.length) {
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
      });
    }
  }, [isFirstRender, advanced]);

  return { ...advanced, setAdvanced };
};

type useAdvancedResponse = advanced & {
  setAdvanced: (val: advanced) => void;
};

export default useAdvancedMode;
