import { useEffect } from 'react';
import { useIsFirstRender, useLocalStorage } from 'usehooks-ts';

export type Settings = {
  useSafeProvider: boolean;
  activateAdvancedMode: boolean;
};

const useSettings = (): useSettingsResponse => {
  const [settings, setSettings] = useLocalStorage('throwaway-settings', {
    useSafeProvider: true,
    activateAdvancedMode: true,
  });

  const isFirstRender = useIsFirstRender();

  const [, setToUpdate] = useLocalStorage<boolean>(
    'throwaway-email-toupdate',
    false
  );

  useEffect(() => {
    const existing = Object.keys(settings);
    if (!existing.length || existing.includes('useAlternateProvider')) {
      setSettings({
        useSafeProvider: true,
        activateAdvancedMode: false,
      });
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) setToUpdate(true);
  }, [settings.useSafeProvider]);

  return { ...settings, setSettings };
};

type useSettingsResponse = Settings & {
  setSettings: (val: Settings) => void;
};

export default useSettings;
