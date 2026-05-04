import useAdvancedMode from '@/hooks/useAdvancedMode';
import useEmail from '@/hooks/useEmail';
import useIdentityStore from '@/store/identity';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useRef } from 'react';
import { resolveApiBaseUrl } from '@/config/brand';

const useIdentity = () => {
  const {
    identity,
    setIdentity,
    newIdentity: createNewIdentity,
    addCustomIdentityField,
    removeCustomIdentityField,
    removeAllCustomIdentityFields,
  } = useIdentityStore();

  const {
    email,
    otp,
    token,
    getNewEmail,
    currentEmailRecord,
  } = useEmail();
  const {
    localeIndex,
    sensitivity,
    advancedCardMode,
    cardParams,
    controlSensitivity,
    gmailnatorApiHost,
    gmailnatorApiKey,
    emailnatorApiHost,
    emailnatorApiKey,
  } = useAdvancedMode();

  const updating = useRef(false);

  const newIdentity = useCallback(
    async (keepEmail = false) => {
      if (updating.current) return;
      updating.current = true;
      try {
        await createNewIdentity(
          keepEmail,
          getNewEmail,
          advancedCardMode,
          cardParams,
          controlSensitivity,
          sensitivity,
          localeIndex
        );
      } finally {
        updating.current = false;
      }
    },
    [
      createNewIdentity,
      getNewEmail,
      advancedCardMode,
      cardParams,
      controlSensitivity,
      sensitivity,
      localeIndex,
    ]
  );

  useEffect(() => {
    if (!identity?.['throwaway-version']) {
      void newIdentity(false);
    } else {
      const currentPhone = currentEmailRecord?.phone;
      setIdentity({
        email,
        ...(currentEmailRecord?.provider
          ? { email_provider: currentEmailRecord.provider }
          : {}),
        ...(currentPhone
          ? {
              phone: currentPhone,
              tel: currentPhone,
              phone_number: currentPhone,
              mobile: currentPhone,
            }
          : {}),
      });
    }
  }, [email, otp, currentEmailRecord?.provider, currentEmailRecord?.phone]);

  useEffect(() => {
    if (
      identity?.['throwaway-version'] &&
      (!isEqual(advancedCardMode, identity?.metadata.advancedCardMode) ||
        !isEqual(identity?.metadata.cardParams, cardParams))
    ) {
      void newIdentity(true);
    }
  }, [advancedCardMode, cardParams]);

  useEffect(() => {
    if (
      identity?.['throwaway-version'] &&
      (!isEqual(controlSensitivity, identity?.metadata?.controlSensitivity) ||
        !isEqual(identity?.metadata?.sensitivity, sensitivity))
    ) {
      void newIdentity(true);
    }
  }, [controlSensitivity, sensitivity]);

  useEffect(() => {
    if (
      identity?.['throwaway-version'] &&
      !isEqual(localeIndex, identity?.metadata.localeIndex)
    ) {
      void newIdentity(true);
    }
  }, [localeIndex]);

  useEffect(() => {
    chrome.storage.local.set({
      identity: JSON.stringify({
        ...identity,
        ...(identity?.extra ? identity?.extra : {}),
        sensitivity,
        metadata: {},
      }),
      throwaway_env: JSON.stringify({
        VITE_API_URL: resolveApiBaseUrl(),
        token,
        emailProvider: currentEmailRecord?.provider || 'throwaway',
        providerCredentials: {
          gmailnator: {
            apiHost: gmailnatorApiHost,
            apiKey: gmailnatorApiKey,
          },
          emailnator: {
            apiHost: emailnatorApiHost,
            apiKey: emailnatorApiKey,
          },
        },
      }),
    });
  }, [
    identity,
    email,
    otp,
    token,
    sensitivity,
    currentEmailRecord?.provider,
    gmailnatorApiHost,
    gmailnatorApiKey,
    emailnatorApiHost,
    emailnatorApiKey,
  ]);

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
