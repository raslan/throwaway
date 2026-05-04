import { useCallback } from 'react';
import { EmailProvider } from 'src/types';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useEmail from '@/hooks/useEmail';
import useProfileStore from '@/store/profiles';

const useProfiles = () => {
  const {
    profiles,
    activeProfileId,
    saveProfile,
    deleteProfile,
    renameProfile,
    setActiveProfileId,
    touchProfile,
  } = useProfileStore();
  const { currentEmailRecord, restoreEmailAddress, email } = useEmail();
  const { emailProvider, customEmailDomain, defaultSmsNumber } = useAdvancedMode();

  const recoverableProviders: EmailProvider[] = [
    'throwaway',
    'gmailnator',
    'emailnator',
    'custom',
  ];

  const saveCurrentProfile = useCallback(
    (label: string) => {
      if (!currentEmailRecord?.email || !currentEmailRecord?.token) {
        return null;
      }

      return saveProfile({
        label: label || currentEmailRecord.email,
        email: currentEmailRecord.email,
        token: currentEmailRecord.token,
        provider: currentEmailRecord.provider || emailProvider,
        phone: currentEmailRecord.phone || defaultSmsNumber,
        customDomain: currentEmailRecord.customDomain || customEmailDomain,
      });
    },
    [currentEmailRecord, emailProvider, customEmailDomain, defaultSmsNumber, saveProfile]
  );

  const restoreProfile = useCallback(
    (id: string) => {
      const profile = profiles.find((entry) => entry.id === id);
      if (!profile) return;

      restoreEmailAddress({
        email: profile.email,
        token: profile.token,
        provider: profile.provider,
        customDomain: profile.customDomain,
        phone: profile.phone,
        label: profile.label,
        createdAt: profile.createdAt,
        lastUsedAt: profile.lastUsedAt,
      });
      setActiveProfileId(id);
      touchProfile(id);
    },
    [profiles, restoreEmailAddress, setActiveProfileId, touchProfile]
  );

  const recoverProfileFromCredentials = useCallback(
    (
      profileEmail: string,
      profileToken: string,
      profileProvider: EmailProvider | 'gmail'
    ) => {
      if (!profileEmail || !profileToken) {
        return null;
      }
      const normalizedProvider =
        profileProvider === 'gmail' ? 'gmailnator' : profileProvider;

      restoreEmailAddress({
        email: profileEmail,
        token: profileToken,
        provider: normalizedProvider,
        customDomain: customEmailDomain,
        phone: defaultSmsNumber,
        label: profileEmail,
      });

      return saveProfile({
        label: profileEmail,
        email: profileEmail,
        token: profileToken,
        provider: normalizedProvider,
        customDomain: customEmailDomain,
        phone: defaultSmsNumber,
      });
    },
    [customEmailDomain, defaultSmsNumber, restoreEmailAddress, saveProfile]
  );

  return {
    profiles,
    activeProfileId,
    recoverableProviders,
    saveCurrentProfile,
    restoreProfile,
    recoverProfileFromCredentials,
    deleteProfileById: deleteProfile,
    renameProfile,
    setActiveProfileId,
    currentProfile: profiles.find((profile) => profile.id === activeProfileId),
    currentEmail: email,
    currentProvider: currentEmailRecord?.provider || emailProvider,
  };
};

export default useProfiles;
