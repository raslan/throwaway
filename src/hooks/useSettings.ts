import { useEffect } from 'react';
import { useIsFirstRender } from 'usehooks-ts';
import useChromeStorage from './useChromeStorage';

export type Settings = {};

const useSettings = (): useSettingsResponse => {
  const [settings, setSettings] = useChromeStorage('throwaway-settings', {});

  const isFirstRender = useIsFirstRender();

  const [, setToUpdate] = useChromeStorage<boolean>(
    'throwaway-email-toupdate',
    false
  );

  useEffect(() => {
    const existing = Object.keys(settings);
    if (!existing.length || existing.includes('useAlternateProvider')) {
      setSettings({});
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) setToUpdate(true);
  }, [settings]);

  return { ...settings, setSettings };
};

type useSettingsResponse = Settings & {
  setSettings: (val: Settings) => void;
};

export default useSettings;
