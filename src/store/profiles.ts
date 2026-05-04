import { EmailProvider, ThrowawayProfile } from 'src/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

interface ProfileState {
  profiles: ThrowawayProfile[];
  activeProfileId: string | null;
  saveProfile: (
    profile: Omit<ThrowawayProfile, 'id' | 'createdAt' | 'lastUsedAt'>
  ) => string;
  deleteProfile: (id: string) => void;
  setActiveProfileId: (id: string | null) => void;
  renameProfile: (id: string, label: string) => void;
  touchProfile: (id: string) => void;
}

const nextProfileId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() :
  `profile-${Math.random().toString(36).slice(2, 10)}`;

const useProfileStore = create<ProfileState>()(
  persist(
    immer((set, get) => ({
      profiles: [],
      activeProfileId: null,

      saveProfile: (profile) => {
        const id = nextProfileId();
        const now = Date.now();
        set((state) => {
          const existingIndex = state.profiles.findIndex(
            (item) => item.email === profile.email
          );
          const nextProfile: ThrowawayProfile = {
            ...profile,
            id,
            createdAt: now,
            lastUsedAt: now,
          };

          if (existingIndex >= 0) {
            const existing = state.profiles[existingIndex];
            state.profiles[existingIndex] = {
              ...existing,
              ...profile,
              provider: profile.provider || existing.provider,
              lastUsedAt: now,
            };
            state.activeProfileId = state.profiles[existingIndex].id;
            return;
          }

          state.profiles.unshift(nextProfile);
          state.activeProfileId = id;
        });
        return id;
      },

      renameProfile: (id, label) =>
        set((state) => {
          const profile = state.profiles.find((item) => item.id === id);
          if (profile) {
            profile.label = label;
          }
        }),

      setActiveProfileId: (id) =>
        set((state) => {
          state.activeProfileId = id;
        }),

      touchProfile: (id) =>
        set((state) => {
          const profile = state.profiles.find((item) => item.id === id);
          if (profile) {
            profile.lastUsedAt = Date.now();
          }
          if (state.activeProfileId === id) {
            state.activeProfileId = id;
          }
        }),

      deleteProfile: (id) =>
        set((state) => {
          state.profiles = state.profiles.filter((item) => item.id !== id);
          if (state.activeProfileId === id) {
            state.activeProfileId = state.profiles[0]?.id ?? null;
          }
        }),
    })),
    {
      name: 'throwaway-profiles-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);

export default useProfileStore;
