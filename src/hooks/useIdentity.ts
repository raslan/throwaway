import useAdvancedMode from '@/hooks/useAdvancedMode';
import useEmail from '@/hooks/useEmail';
import useIdentityStore from '@/store/identity';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useRef } from 'react';

const useIdentity = () => {
  const {
    identity,
    setIdentity,
    newIdentity: createNewIdentity,
    addCustomIdentityField,
    removeCustomIdentityField,
    removeAllCustomIdentityFields,
  } = useIdentityStore();

  const { email, otp, token, getNewEmail } = useEmail();
  const {
    localeIndex,
    sensitivity,
    advancedCardMode,
    cardParams,
    controlSensitivity,
  } = useAdvancedMode();

  const updating = useRef(false);

  const newIdentity = useCallback(
    (keepEmail = false) => {
      if (updating.current) return;
      updating.current = true;
      createNewIdentity(
        keepEmail,
        getNewEmail,
        advancedCardMode,
        cardParams,
        controlSensitivity,
        sensitivity,
        localeIndex
      );
      updating.current = false;
    },
    [
      createNewIdentity,
      getNewEmail,
      advancedCardMode,
      cardParams,
      controlSensitivity,
      sensitivity,
      localeIndex,
      updating,
    ]
  );

  useEffect(() => {
    if (!identity['throwaway-version']) {
      newIdentity(false);
    } else {
      setIdentity({ email });
    }
  }, [email, otp]);

  useEffect(() => {
    if (
      identity['throwaway-version'] &&
      (!isEqual(advancedCardMode, identity.metadata.advancedCardMode) ||
        !isEqual(identity.metadata.cardParams, cardParams))
    ) {
      newIdentity(true);
    }
  }, [advancedCardMode, cardParams]);

  useEffect(() => {
    if (
      identity['throwaway-version'] &&
      (!isEqual(controlSensitivity, identity.metadata.controlSensitivity) ||
        !isEqual(sensitivity, identity.metadata.sensitivity))
    ) {
      newIdentity(true);
    }
  }, [controlSensitivity, sensitivity]);

  useEffect(() => {
    if (
      identity['throwaway-version'] &&
      !isEqual(localeIndex, identity.metadata.localeIndex)
    ) {
      newIdentity(true);
    }
  }, [localeIndex]);

  useEffect(() => {
    chrome.storage.local.set({
      identity: JSON.stringify({
        ...identity,
        ...identity.extra,
        sensitivity,
        metadata: {},
      }),
      throwaway_env: JSON.stringify({
        VITE_API_URL: import.meta.env.VITE_API_URL,
        token,
      }),
    });
  }, [identity, email, otp, token]);

  return {
    identity,
    setIdentity,
    newIdentity,
    addCustomIdentityField,
    removeCustomIdentityField,
    removeAllCustomIdentityFields,
  };
};

export default useIdentity;
