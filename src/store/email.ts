import { Email, EmailProvider, ThrowawayEmail } from 'src/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { resolveApiBaseUrl, resolveEmailApiUrl, resolvePhoneApiUrl } from '@/config/brand';
import { inferEmailFromInboxUrl, normalizeInboxResponse } from '@/lib/email-response';

interface NewEmailRequest {
  provider?: EmailProvider | 'gmail';
  customDomain?: string;
  phone?: string;
  label?: string;
  providerCredentials?: {
    apiHost?: string;
    apiKey?: string;
  };
}

interface EmailState {
  lastUpdated: Date;
  emailAddresses: ThrowawayEmail[];
  currentEmailIndex: number;
  emails: Email[];
  otp: string;
  loading: boolean;
  grabbingNewEmail: boolean;
  setLastUpdated: (date: Date) => void;
  setEmailAddresses: (addresses: ThrowawayEmail[]) => void;
  setCurrentEmailIndex: (index: number) => void;
  setEmails: (emails: Email[]) => void;
  setOtp: (otp: string) => void;
  setLoading: (loading: boolean) => void;
  setGrabbingNewEmail: (grabbing: boolean) => void;
  getNewEmail: (
    retainCount: number,
    request?: NewEmailRequest
  ) => Promise<void>;
  selectEmail: (index: number) => void;
  restoreEmailAddress: (address: ThrowawayEmail) => void;
  reset: () => void;
}

export const fetcher = async ([url, token]: [url: string, token: string]) => {
  const safeUrl = `${url || resolveApiBaseUrl()}`.trim();
  const res = await fetch(safeUrl, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Error fetching emails.');
  }
  return normalizeInboxResponse(await res.json(), inferEmailFromInboxUrl(safeUrl));
};

const eFetch = (
  url: string,
  body: Record<string, unknown> = {}
) =>
  fetch(url, {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(async (res) => {
    const raw = await res.text();
    if (!res.ok) {
      throw new Error(raw || 'Error creating new email.');
    }
    return raw ? JSON.parse(raw) : {};
  });

const withTimestamps = (record: ThrowawayEmail) => ({
  ...record,
  createdAt: record.createdAt || Date.now(),
  lastUsedAt: Date.now(),
  created_at:
    record.created_at || (record.createdAt ? String(record.createdAt) : ''),
});

const normalizePhone = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const fetchPhoneFromBackend = async (): Promise<string> => {
  const phoneUrl = resolvePhoneApiUrl();
  if (!phoneUrl) return '';

  try {
    const payload = await eFetch(phoneUrl, {});
    const phone =
      payload && typeof payload === 'object' ? payload?.phone : '';
    return normalizePhone(phone);
  } catch {
    return '';
  }
};

const normalizeProvider = (provider?: NewEmailRequest['provider']) =>
  provider === 'gmail' ? 'gmailnator' : (provider || 'throwaway');

const normalizeEmailApiBase = () => resolveEmailApiUrl();

const useEmailStore = create<EmailState>()(
  persist(
    immer((set, get) => ({
      lastUpdated: new Date(),
      emailAddresses: [],
      currentEmailIndex: 0,
      emails: [],
      otp: '',
      loading: false,
      grabbingNewEmail: false,

      setLastUpdated: (date) =>
        set((state) => {
          state.lastUpdated = date;
        }),
      setEmailAddresses: (addresses) =>
        set((state) => {
          state.emailAddresses = addresses;
        }),
      setCurrentEmailIndex: (index) =>
        set((state) => {
          state.currentEmailIndex = index;
        }),
      setEmails: (emails) =>
        set((state) => {
          state.emails = emails;
        }),
      setOtp: (otp) =>
        set((state) => {
          state.otp = otp;
        }),
      setLoading: (loading) =>
        set((state) => {
          state.loading = loading;
        }),
      setGrabbingNewEmail: (grabbing) =>
        set((state) => {
          state.grabbingNewEmail = grabbing;
        }),

      getNewEmail: async (retainCount, request = {}) => {
        if (get().grabbingNewEmail) {
          return;
        }

        get().setGrabbingNewEmail(true);

        try {
          const payloadProvider = normalizeProvider(request.provider);
          const requestPhone = normalizePhone(request.phone);
          const phone =
            requestPhone || (await fetchPhoneFromBackend());

          const payload: Record<string, unknown> = {
            ...(payloadProvider ? { provider: payloadProvider } : {}),
            ...(request?.customDomain
              ? { customDomain: request.customDomain }
              : {}),
            ...(phone ? { phone } : {}),
            ...(request?.label ? { label: request.label } : {}),
            ...(request?.providerCredentials
              ? { providerCredentials: request.providerCredentials }
              : {}),
          };

          let data: { email: string; token: string };
          try {
            data = await eFetch(
              `${normalizeEmailApiBase() || 'https://throwaway.raslan.dev/api/email'}`,
              payload
            );
          } catch (firstError) {
            if (Object.keys(payload).length) {
              data = await eFetch(
                `${normalizeEmailApiBase() || 'https://throwaway.raslan.dev/api/email'}`
              );
            } else {
              throw firstError;
            }
          }

          const newAddress: ThrowawayEmail = withTimestamps({
            email: data.email,
            token: data.token,
            provider: normalizeProvider(request.provider) as EmailProvider,
            customDomain: request.customDomain,
            phone: request.phone,
            label: request.label,
            ...(data as Partial<ThrowawayEmail>),
          });

          set((state) => {
            const deduped = state.emailAddresses.filter(
              (address) => address.email !== newAddress.email
            );
            const updated = [newAddress, ...deduped];
            state.currentEmailIndex = 0;
            state.emailAddresses = updated.slice(0, retainCount);
            state.lastUpdated = new Date();
          });
        } catch (error) {
          console.error('Error getting new email:', error);
          throw error;
        } finally {
          set((state) => {
            state.grabbingNewEmail = false;
          });
        }
      },

      selectEmail: (index) => {
        if (index >= 0 && index < get().emailAddresses.length) {
          set((state) => {
            state.currentEmailIndex = index;
            state.emailAddresses[index] = {
              ...state.emailAddresses[index],
              lastUsedAt: Date.now(),
            };
            state.emails = [];
          });
        }
      },

      restoreEmailAddress: (address) => {
        set((state) => {
          const restored = withTimestamps(address);
          const deduped = state.emailAddresses.filter(
            (entry) => entry.email !== restored.email
          );
          const updated = [restored, ...deduped];
          state.currentEmailIndex = 0;
          state.emailAddresses = updated;
          state.emails = [];
          state.lastUpdated = new Date();
        });
      },

      reset: () => {
        set((state) => {
          state.lastUpdated = new Date();
          state.emailAddresses = [];
          state.currentEmailIndex = 0;
          state.emails = [];
          state.otp = '';
          state.loading = false;
        });
      },
    })),
    {
      name: 'throwaway-email-storage',
      partialize: (state) => ({
        lastUpdated: state.lastUpdated,
        emailAddresses: state.emailAddresses,
        currentEmailIndex: state.currentEmailIndex,
      }),
    }
  )
);

export default useEmailStore;
