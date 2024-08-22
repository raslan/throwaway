import { Email } from 'src/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface EmailState {
  lastUpdated: Date;
  emailAddresses: { email: string; token: string }[];
  currentEmailIndex: number;
  emails: Email[];
  otp: string;
  loading: boolean;
  grabbingNewEmail: boolean;
  setLastUpdated: (date: Date) => void;
  setEmailAddresses: (addresses: { email: string; token: string }[]) => void;
  setCurrentEmailIndex: (index: number) => void;
  setEmails: (emails: Email[]) => void;
  setOtp: (otp: string) => void;
  setLoading: (loading: boolean) => void;
  setGrabbingNewEmail: (grabbing: boolean) => void;
  getNewEmail: (retainCount: number) => void;
  selectEmail: (index: number) => void;
  reset: () => void;
}

export const fetcher = async ([url, token]: [url: string, token: string]) => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Error fetching emails.');
  }
  return res.json();
};

const eFetch = (url: string) =>
  fetch(url, {
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then((res) => res.json());

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

      getNewEmail: async (retainCount) => {
        if (get().grabbingNewEmail) {
          return;
        }
        get().setGrabbingNewEmail(true);
        const data = await eFetch(`${import.meta.env.VITE_API_URL}`);
        set((state) => {
          const updated = [
            { email: data.email, token: data.token },
            ...state.emailAddresses,
          ];
          state.currentEmailIndex = 0;
          state.emailAddresses = updated.slice(0, retainCount);
          state.lastUpdated = new Date();
          state.grabbingNewEmail = false;
        });
      },

      selectEmail: (index) => {
        if (index >= 0 && index < get().emailAddresses.length) {
          set((state) => {
            state.currentEmailIndex = index;
            state.emails = []; // Clear emails on selection
          });
        }
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
