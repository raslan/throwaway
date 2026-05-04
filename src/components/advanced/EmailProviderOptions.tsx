import SubLabel from '@/components/advanced/SubLabel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import { EmailProvider } from 'src/types';

const providerConfig: {
  value: EmailProvider;
  label: string;
  description: string;
}[] = [
  {
    value: 'throwaway',
    label: 'Built-in',
    description: 'Generate ephemeral addresses from the built-in email service.',
  },
  {
    value: 'gmailnator',
    label: 'Gmailnator',
    description:
      'API-based disposable Gmail aliases via RapidAPI-style endpoints like /api/emails/generate.',
  },
  {
    value: 'emailnator',
    label: 'Emailnator',
    description:
      'Uses dedicated/private Gmail variants when supported by your backend endpoint.',
  },
  {
    value: 'custom',
    label: 'Custom domain',
    description: 'Use a custom throwaway domain your backend provides.',
  },
];

const EmailProviderOptions = () => {
  const {
    emailProvider,
    customEmailDomain,
    defaultSmsNumber,
    gmailnatorApiHost,
    gmailnatorApiKey,
    emailnatorApiHost,
    emailnatorApiKey,
    setAdvanced,
  } = useAdvancedMode();

  const isRapidProvider = emailProvider === 'gmailnator' || emailProvider === 'emailnator';

  return (
    <div className='space-y-3'>
      <div>
        <Label className='text-lg'>Email Source</Label>
        <SubLabel>
          Pick which provider this profile should draw from before generating
          emails.
        </SubLabel>
      </div>

      <div className='grid grid-cols-1 gap-2'>
        {providerConfig.map((provider) => (
          <button
            key={provider.value}
            type='button'
            className={`provider-card flex flex-col text-left p-3 transition ${
              emailProvider === provider.value
                ? 'provider-card-active'
                : ''
            }`}
            onClick={() =>
              setAdvanced({
                emailProvider: provider.value,
              })
            }
          >
            <span className='text-base font-semibold'>{provider.label}</span>
            <span className='text-sm text-current opacity-70'>{provider.description}</span>
          </button>
        ))}
      </div>

      {emailProvider === 'custom' && (
        <div className='grid grid-cols-1 gap-2'>
          <Label>Custom Domain</Label>
          <Input
            value={customEmailDomain}
            placeholder='mail.example.com'
            onChange={(e) =>
              setAdvanced({
                customEmailDomain: e.target.value,
              })
            }
          />
          <SubLabel>
            Domain is sent as-is to the backend and should be returned with a valid
            alias.
          </SubLabel>
        </div>
      )}

      {isRapidProvider && (
        <div className='grid grid-cols-1 gap-2'>
          <Label>Provider API Host</Label>
          <Input
            value={
              emailProvider === 'gmailnator' ? gmailnatorApiHost : emailnatorApiHost
            }
            placeholder='https://api.example.com'
            onChange={(event) =>
              setAdvanced({
                ...(emailProvider === 'gmailnator'
                  ? { gmailnatorApiHost: event.target.value }
                  : { emailnatorApiHost: event.target.value }),
              })
            }
          />
          <Label>Provider API Key</Label>
          <Input
            type='password'
            value={
              emailProvider === 'gmailnator' ? gmailnatorApiKey : emailnatorApiKey
            }
            placeholder='Paste API key'
            onChange={(event) =>
              setAdvanced({
                ...(emailProvider === 'gmailnator'
                  ? { gmailnatorApiKey: event.target.value }
                  : { emailnatorApiKey: event.target.value }),
              })
            }
          />
          <SubLabel>
            Keep credentials per provider; they are used by the backend for generation and inbox calls.
          </SubLabel>
          {!(
            emailProvider === 'gmailnator'
              ? gmailnatorApiHost
              : emailnatorApiHost
          ) ||
            !(
              emailProvider === 'gmailnator'
                ? gmailnatorApiKey
                : emailnatorApiKey
            ) ? (
            <SubLabel className='text-destructive'>
              API host + key are required for both Gmailnator and Emailnator.
            </SubLabel>
          ) : null}
        </div>
      )}

      <div className='grid grid-cols-1 gap-2'>
        <Label>Default Recovery Number (optional)</Label>
        <Input
          value={defaultSmsNumber}
          placeholder='+1234567890'
          onChange={(e) => setAdvanced({ defaultSmsNumber: e.target.value })}
        />
        <SubLabel>
          Stored and reused across profiles to help you keep recovery phone numbers
          grouped with accounts.
        </SubLabel>
      </div>
    </div>
  );
};

export default EmailProviderOptions;
