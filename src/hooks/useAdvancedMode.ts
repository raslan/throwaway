import useAdvancedStore from '@/store/advanced';

const useAdvancedMode = () => {
  const {
    advancedCardMode,
    cardParams,
    localeIndex,
    controlSensitivity,
    sensitivity,
    addIdentityFields,
    setAdvanced,
  } = useAdvancedStore();

  return {
    advancedCardMode,
    cardParams,
    localeIndex,
    controlSensitivity,
    sensitivity,
    addIdentityFields,
    setAdvanced,
  };
};

export default useAdvancedMode;
