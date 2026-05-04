import useAdvancedStore from '@/store/advanced';

const useAdvancedMode = () => {
  const {
    advancedCardMode,
    cardParams,
    localeIndex,
    controlSensitivity,
    sensitivity,
    addIdentityFields,
    emailProvider,
    customEmailDomain,
    defaultSmsNumber,
    gmailnatorApiHost,
    gmailnatorApiKey,
    emailnatorApiHost,
    emailnatorApiKey,
    setAdvanced,
  } = useAdvancedStore();

  return {
    advancedCardMode,
    cardParams,
    localeIndex,
    controlSensitivity,
    sensitivity,
    addIdentityFields,
    emailProvider,
    customEmailDomain,
    defaultSmsNumber,
    gmailnatorApiHost,
    gmailnatorApiKey,
    emailnatorApiHost,
    emailnatorApiKey,
    setAdvanced,
  };
};

export default useAdvancedMode;
