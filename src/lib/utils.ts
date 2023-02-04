import { Settings } from 'src/hooks/useSettings';

const SETTING_NAMES = {
  useAlternateProvider: 'Use alternative email provider',
};

const SETTING_DESCRIPTIONS = {
  useAlternateProvider:
    'Less secure but can sometimes solve issues with websites blocking the extension.',
};

export const getSettingName = (setting: keyof Settings): string =>
  SETTING_NAMES?.[setting];

export const getSettingDescription = (setting: keyof Settings): string =>
  SETTING_DESCRIPTIONS?.[setting];
