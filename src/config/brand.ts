export const APP_NAME = 'PersonaShell';
export const EXTENSION_ICON_NAME = 'PersonaShell';

const DEFAULT_API_URL = 'https://throwaway.raslan.dev/api/email';

export const resolveApiBaseUrl = (): string => {
  const configured = `${import.meta.env.VITE_API_URL || ''}`.trim().replace(/\/$/, '');
  return configured.length ? configured : DEFAULT_API_URL;
};

export const resolveApiRootUrl = (): string => {
  const base = resolveApiBaseUrl().trim().replace(/\/$/, '');
  if (base.endsWith('/api/email')) return base.slice(0, -'/api/email'.length);
  if (base.endsWith('/api')) return base.slice(0, -'/api'.length);
  return base;
};

export const resolveEmailApiUrl = (): string => {
  const base = resolveApiBaseUrl().trim().replace(/\/$/, '');
  if (!base) return '';
  if (base.endsWith('/api/email')) return base;
  if (base.endsWith('/api')) return `${base}/email`;
  return `${base}/api/email`;
};

export const resolvePhoneApiUrl = (): string => {
  const root = resolveApiRootUrl();
  return root ? `${root}/api/phone` : '';
};

export const FALLBACK_PROVIDER_NAME: 'throwaway' = 'throwaway';
