export enum View {
  Email = 'email',
  Identity = 'identity',
  Settings = 'settings',
  Profiles = 'profiles',
  Advanced = 'advanced',
}

export type EmailProvider = 'throwaway' | 'gmailnator' | 'emailnator' | 'custom';

export type EmailProviderSecret = {
  apiHost?: string;
  apiKey?: string;
};

export type EmailProviderSecrets = {
  gmailnator?: EmailProviderSecret;
  emailnator?: EmailProviderSecret;
};

export type ThrowawayEmail = {
  email: string;
  token: string;
  provider: EmailProvider;
  createdAt?: number;
  created_at?: string;
  lastUsedAt?: number;
  phone?: string;
  customDomain?: string;
  label?: string;
};

export type ThrowawayProfile = {
  id: string;
  label: string;
  email: string;
  token: string;
  provider: EmailProvider;
  createdAt: number;
  lastUsedAt: number;
  phone?: string;
  customDomain?: string;
  notes?: string;
};

export type Email = {
  from: string;
  to: string;
  subject: string;
  body_text: string;
  body_html: string;
  created_at?: string;
  createdAt?: string;
};
