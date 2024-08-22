import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export type AdvancedPropType = {
  advanced: advanced;
  setAdvanced: (val: advanced) => void;
};

export type advanced = {
  advancedCardMode: boolean;
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

interface AdvancedState extends advanced {
  setAdvanced: (newAdvanced: Partial<advanced>) => void;
}

const useAdvancedStore = create<AdvancedState>()(
  persist(
    immer((set) => ({
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

      setAdvanced: (newAdvanced) =>
        set((state) => {
          Object.assign(state, newAdvanced);
        }),
    })),
    {
      name: 'throwaway-advanced-storage',
      partialize: (state) => ({
        advancedCardMode: state.advancedCardMode,
        cardParams: state.cardParams,
        localeIndex: state.localeIndex,
        controlSensitivity: state.controlSensitivity,
        sensitivity: state.sensitivity,
        addIdentityFields: state.addIdentityFields,
      }),
    }
  )
);

export default useAdvancedStore;
