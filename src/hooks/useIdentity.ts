import { useCallback, useEffect } from 'react';
import {
  generateAddress,
  generateCard,
  generateCode,
  generateDate,
  generateFinancials,
  generateUserData,
} from '@/lib/utils';
import { useLocalStorage } from 'usehooks-ts';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useEmail from '@/hooks/useEmail';

const useIdentity = (): {
  identity: Record<string, any>;
  newIdentity: (updateOnlyCard?: boolean) => void;
  addCustomIdentityField: (field: string, value: string) => void;
  removeCustomIdentityField: (field: string) => void;
} => {
  const { email, otp, getNewEmail, emailAddresses, token } = useEmail();
  const [identity, setIdentity] = useLocalStorage<Record<string, any>>(
    'throwaway-identity',
    {}
  );
  const {
    card: advancedCardMode,
    cardParams,
    localeIndex,
    sensitivity,
  } = useAdvancedMode();

  const addCustomIdentityField = useCallback(
    (field: string, value: string) => {
      setIdentity((state) => ({
        ...state,
        extra: {
          ...state.extra,
          [field]: value,
        },
      }));
    },
    [identity]
  );

  const removeCustomIdentityField = useCallback(
    (field: string) => {
      setIdentity((state) => {
        const { [field]: _, ...rest } = state.extra;
        return {
          ...state,
          extra: rest,
        };
      });
    },
    [identity]
  );

  const newIdentity = useCallback(
    (keepEmail = false) => {
      const card = generateCard(advancedCardMode, cardParams);
      const address = generateAddress(localeIndex);
      const financials = generateFinancials(address.country_code);
      const date = generateDate();
      const otpFields = generateCode(otp);
      const userData = generateUserData(email);
      const baseFields = {
        ...identity,
        ...card,
        ...address,
        ...financials,
        ...date,
        ...otpFields,
        ...userData,
        sensitivity,
        extra: identity.extra,
        'throwaway-version': '4.0.0',
      };
      if (keepEmail) {
        setIdentity(baseFields);
        return;
      } else {
        getNewEmail();
        setIdentity({
          ...baseFields,
          email,
        });
      }
    },
    [
      otp,
      cardParams,
      advancedCardMode,
      email,
      emailAddresses.length,
      localeIndex,
      sensitivity,
    ]
  );

  useEffect(() => {
    const address = generateAddress(localeIndex);

    setIdentity({
      ...identity,
      ...generateFinancials(address.country_code),
    });
  }, [localeIndex]);

  useEffect(() => {
    if (!identity.name) {
      newIdentity();
    } else {
      setIdentity({ ...identity, email });
    }
  }, [email, otp]);

  useEffect(() => {
    chrome.storage.local.set({
      identity: JSON.stringify({ ...identity, ...identity.extra, sensitivity }),
      throwaway_env: JSON.stringify({
        VITE_API_URL: import.meta.env.VITE_API_URL,
        token,
      }),
    });
  }, [identity, email, otp, token, localeIndex, sensitivity]);

  return {
    identity,
    newIdentity,
    addCustomIdentityField,
    removeCustomIdentityField,
  };
};

export default useIdentity;
