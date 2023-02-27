import { useEffect } from 'react';
import { useIsFirstRender, useLocalStorage } from 'usehooks-ts';

export type Settings = { useSafeProvider: boolean };

const useSettings = (): useSettingsResponse => {
  const [settings, setSettings] = useLocalStorage('throwaway-settings', {
    useSafeProvider: true,
  });

  const isFirstRender = useIsFirstRender();

  const [, setToUpdate] = useLocalStorage<boolean>(
    'throwaway-email-toupdate',
    false
  );

  useEffect(() => {
    if (!isFirstRender) setToUpdate(true);
  }, [settings.useAlternateProvider]);

  return { ...settings, setSettings };
};

type useSettingsResponse = Settings & {
  setSettings: (val: Settings) => void;
};

export default useSettings;
