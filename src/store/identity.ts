import {
  generateAddress,
  generateCard,
  generateCode,
  generateDate,
  generateFinancials,
  generateUserData,
} from '@/lib/utils';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface IdentityState {
  identity: Record<string, any>;
  setIdentity: (newIdentity: Partial<Record<string, any>>) => void;
  newIdentity: (
    keepEmail: boolean,
    getNewEmail: () => void,
    advancedCardMode: boolean,
    cardParams: {
      provider?:
        | 'stripe'
        | 'paypal'
        | 'amazon'
        | 'fawrypay'
        | 'paymob'
        | 'none';
      brand?: 'visa' | 'mastercard';
      variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
    },
    controlSensitivity: boolean,
    sensitivity: string,
    localeIndex: number
  ) => void;
  addCustomIdentityField: (field: string, value: string) => void;
  removeCustomIdentityField: (field: string) => void;
  removeAllCustomIdentityFields: () => void;
}

const useIdentityStore = create<IdentityState>()(
  persist(
    immer((set, get) => ({
      identity: {},

      setIdentity: (newIdentity) =>
        set((state) => {
          Object.assign(state.identity, newIdentity);
        }),

      newIdentity: (
        keepEmail = false,
        getNewEmail: () => void,
        advancedCardMode: boolean,
        cardParams: {
          provider?:
            | 'stripe'
            | 'paypal'
            | 'amazon'
            | 'fawrypay'
            | 'paymob'
            | 'none';
          brand?: 'visa' | 'mastercard';
          variant?: 'basic' | 'debit' | 'declined' | 'expired' | 'secure';
        },
        controlSensitivity: boolean,
        sensitivity: string,
        localeIndex: number
      ) => {
        const { identity } = get();
        const card = generateCard(advancedCardMode, cardParams);
        const address = generateAddress(localeIndex);
        const financials = generateFinancials(address?.country_code);
        const date = generateDate();
        const otpFields = generateCode(identity?.otp);
        const userData = generateUserData(identity?.email);

        if (!keepEmail) {
          getNewEmail();
        }

        set((state) => {
          Object.assign(state.identity, {
            email: identity?.email,
            ...card,
            ...address,
            ...financials,
            ...date,
            ...otpFields,
            ...userData,
            metadata: {
              advancedCardMode,
              cardParams,
              controlSensitivity,
              sensitivity,
              localeIndex,
            },
            sensitivity,
            extra: identity?.extra,
            'throwaway-version': '4.0.0',
          });
        });
      },

      addCustomIdentityField: (field, value) =>
        set((state) => {
          if (!state?.identity?.extra) {
            state.identity.extra = {};
          }
          state.identity.extra[field] = value;
        }),

      removeCustomIdentityField: (field) =>
        set((state) => {
          if (state?.identity?.extra) {
            delete state.identity.extra[field];
          }
        }),

      removeAllCustomIdentityFields: () =>
        set((state) => {
          delete state.identity.extra;
        }),
    })),
    {
      name: 'throwaway-identity-storage',
    }
  )
);

export default useIdentityStore;
