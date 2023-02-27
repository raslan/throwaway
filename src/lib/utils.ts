import { Settings } from 'src/hooks/useSettings';

const SETTING_NAMES = {
  useSafeProvider: 'Use safe email provider',
};

const SETTING_DESCRIPTIONS = {
  useSafeProvider:
    'Always available, turn this on if you get blank email addresses without it.',
};

export const getSettingName = (setting: keyof Settings): string =>
  SETTING_NAMES?.[setting];

export const getSettingDescription = (setting: keyof Settings): string =>
  SETTING_DESCRIPTIONS?.[setting];
