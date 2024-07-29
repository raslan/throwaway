import { useCallback, useEffect } from 'react';
import {
  generateAddress,
  generateCard,
  generateCode,
  generateDate,
  generateFinancials,
  generateUserData,
} from 'src/lib/utils';
import { useLocalStorage } from 'usehooks-ts';
import useAdvancedMode from './useAdvancedMode';
import useEmail from './useEmail';

const useIdentity = (): {
  identity: Record<string, any>;
  newIdentity: (updateOnlyCard?: boolean) => void;
} => {
  const { email, otp, getNewEmail } = useEmail();
  const [identity, setIdentity] = useLocalStorage<Record<string, any>>(
    'throwaway-identity',
    {}
  );
  const { card: advancedCardMode, cardParams } = useAdvancedMode();
  const [token] = useLocalStorage<string>('throwaway-token', '');

  const newIdentity = useCallback(
    (updateOnlyCard = false) => {
      const card = generateCard(advancedCardMode, cardParams);
      if (updateOnlyCard) {
        setIdentity({
          ...identity,
          ...card,
        });
        return;
      }
      getNewEmail();
      setIdentity({
        email,
        ...card,
        ...generateAddress(),
        ...generateDate(),
        ...generateCode(otp),
        ...generateUserData(email),
        ...generateFinancials(),
      });
    },
    [otp, useAdvancedMode, cardParams, advancedCardMode]
  );

  useEffect(() => {
    if (!identity.name) {
      newIdentity();
    } else {
      setIdentity({ ...identity, email });
    }
  }, [email, otp]);

  useEffect(() => {
    chrome.storage.local.set({
      identity: JSON.stringify(identity),
      throwaway_env: JSON.stringify({
        VITE_API_URL: import.meta.env.VITE_API_URL,
        token,
      }),
    });
  }, [identity, email, otp, token]);

  return {
    identity,
    newIdentity,
  };
};

export default useIdentity;
