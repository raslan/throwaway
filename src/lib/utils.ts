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

export const generatePassword = (
  length = 13,
  {
    lowercase = true,
    uppercase = true,
    symbols = true,
    numbers = true,
  }: {
    lowercase?: boolean;
    uppercase?: boolean;
    symbols?: boolean;
    numbers?: boolean;
  } = {}
) => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbolChars = '!@#$%^&*-_=+;:,.?';
  const numberChars = '0123456789';
  let chars = '';
  let password = '';

  // Add characters based on options
  if (lowercase) {
    chars += lowercaseChars;
  }

  if (uppercase) {
    chars += uppercaseChars;
  }

  if (symbols) {
    chars += symbolChars;
  }

  if (numbers) {
    chars += numberChars;
  }

  // If no characters were selected, default to all character sets
  if (!lowercase && !uppercase && !symbols && !numbers) {
    chars = lowercaseChars + uppercaseChars + symbolChars + numberChars;
  }

  // Generate a password with at least one character from each selected character set
  while (
    !password.match(/[a-z]/) ||
    !password.match(/[A-Z]/) ||
    !password.match(/[0-9]/) ||
    !password.match(/[!@#$%^&*-_=+;:,.?]/)
  ) {
    password = Array.from({ length }, () => {
      const randomIndex = Math.floor(Math.random() * chars.length);
      return chars[randomIndex];
    }).join('');
  }

  return password;
};
