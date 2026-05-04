import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useProfiles from '@/hooks/useProfiles';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import { useState } from 'react';
import { APP_NAME } from '@/config/brand';

const Profiles = () => {
  const {
    profiles,
    activeProfileId,
    currentEmail,
    currentProvider,
    saveCurrentProfile,
    restoreProfile,
    recoverProfileFromCredentials,
    deleteProfileById,
    renameProfile,
    recoverableProviders,
  } = useProfiles();

  const [label, setLabel] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [recoveryProvider, setRecoveryProvider] = useState(
    recoverableProviders?.[0] || 'throwaway'
  );
  const { emailProvider } = useAdvancedMode();

  return (
    <div className='flex flex-col gap-4 w-full h-full pt-9 px-4 pb-16 overflow-y-auto'>
      <div className='view-header card-shell px-5 py-2'>
        <h1>{APP_NAME} Profiles</h1>
      </div>
      <div className='grid gap-4'>
        <div className='card-shell p-5 space-y-3'>
          <Label>Save current inbox identity as a profile</Label>
          <div className='grid gap-2'>
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder={`Profile name for ${currentEmail || 'current email'}`}
            />
            <Button
              className='w-full instrument-button'
              onClick={() => {
                if (saveCurrentProfile(label || '')) {
                  setLabel('');
                }
              }}
            >
              Save current as profile
            </Button>
          </div>
          <div className='technical-label text-white/60'>
            Current source: {currentProvider || emailProvider}
          </div>
        </div>

        <div className='card-shell p-5 space-y-3'>
          <Label>Recover past profile manually</Label>
          <p className='text-sm text-white/65'>
            Paste an email and token if you lost access to this browser profile.
          </p>
          <div className='grid gap-2'>
            <Select
              defaultValue={recoveryProvider}
              onValueChange={(value) => setRecoveryProvider(value as typeof recoveryProvider)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recoverableProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={recoveryEmail}
              onChange={(event) => setRecoveryEmail(event.target.value)}
              placeholder='Recovered email'
            />
            <Input
              value={recoveryToken}
              onChange={(event) => setRecoveryToken(event.target.value)}
              placeholder='Recovery token'
            />
            <Button
              variant='secondary'
              className='w-full instrument-button'
              onClick={() => {
                const restoredId = recoverProfileFromCredentials(
                  recoveryEmail.trim(),
                  recoveryToken.trim(),
                  recoveryProvider
                );
                if (restoredId) {
                  setRecoveryEmail('');
                  setRecoveryToken('');
                }
              }}
            >
              Recover and save profile
            </Button>
          </div>
        </div>
      </div>

          <div className='space-y-2'>
        <h2 className='technical-label'>Saved Profiles</h2>
        {!profiles.length && <p className='technical-label text-slate-600'>No profiles yet.</p>}
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className='card-shell px-5 py-4 flex flex-col gap-2'
          >
            <div className='flex justify-between items-center'>
              <div>
                <p className='font-semibold text-white'>{profile.label}</p>
                <p className='technical-label text-white/60'>
                  {profile.email} / {profile.provider}
                </p>
                {profile.phone ? (
                  <p className='technical-label text-white/50'>Phone: {profile.phone}</p>
                ) : null}
              </div>
              <span className='technical-label text-white/50'>
                {profile === undefined
                  ? ''
                  : new Date(profile.lastUsedAt).toLocaleString()}
              </span>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <Button
                variant={activeProfileId === profile.id ? 'secondary' : 'default'}
                className='instrument-button'
                onClick={() => restoreProfile(profile.id)}
              >
                Use profile
              </Button>
              <Button
                variant='ghost'
                className='instrument-button border-white/40 text-white'
                onClick={() => {
                  const nextLabel = window.prompt('Rename profile', profile.label);
                  if (nextLabel) {
                    renameProfile(profile.id, nextLabel);
                  }
                }}
              >
                Rename
              </Button>
              <Button
                variant='destructive'
                className='mission-critical col-span-2'
                onClick={() => deleteProfileById(profile.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
