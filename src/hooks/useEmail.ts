import useAdvancedMode from '@/hooks/useAdvancedMode';
import useEmailStore, { fetcher } from '@/store/email';
import { differenceInHours } from 'date-fns';
import parse from 'parse-otp-message';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { APP_NAME, resolveEmailApiUrl } from '@/config/brand';

const useEmail = (retainCount = 5) => {
  const pollInFlightRef = useRef(false);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const {
    lastUpdated,
    emailAddresses,
    currentEmailIndex,
    emails,
    otp,
    loading,
    setEmails,
    setOtp,
    setLoading,
    getNewEmail,
    selectEmail,
    restoreEmailAddress,
  } = useEmailStore();

  const {
    emailProvider,
    customEmailDomain,
    defaultSmsNumber,
    gmailnatorApiHost,
    gmailnatorApiKey,
    emailnatorApiHost,
    emailnatorApiKey,
  } = useAdvancedMode();

  const providerCredentials = useMemo(
    () =>
      emailProvider === 'gmailnator'
        ? { apiHost: gmailnatorApiHost, apiKey: gmailnatorApiKey }
        : emailProvider === 'emailnator'
          ? { apiHost: emailnatorApiHost, apiKey: emailnatorApiKey }
          : {},
    [
      emailProvider,
      gmailnatorApiHost,
      gmailnatorApiKey,
      emailnatorApiHost,
      emailnatorApiKey,
    ]
  );

  const newEmailRequest = useMemo(
    () => ({
      provider: emailProvider,
      customDomain: customEmailDomain,
      phone: defaultSmsNumber,
      ...(providerCredentials?.apiHost || providerCredentials?.apiKey
        ? { providerCredentials }
        : {}),
    }),
    [emailProvider, customEmailDomain, defaultSmsNumber, providerCredentials]
  );

  const current = useMemo(
    () => emailAddresses?.[currentEmailIndex ?? 0],
    [emailAddresses, currentEmailIndex]
  );

  const resolveFetchUrl = useMemo(() => {
    const apiBase = resolveEmailApiUrl();
    if (!apiBase || !current?.email) return null;
    return `${apiBase}/${current.email}`;
  }, [current?.email]);

  const { data, error, isValidating, mutate } = useSWR(
    resolveFetchUrl && current?.token ? [resolveFetchUrl, current.token] : null,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      revalidateOnMount: true,
      refreshWhenHidden: true,
      revalidateIfStale: true,
    }
  );

  const refreshEmailInbox = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (!resolveFetchUrl || !current?.token) return;
      if (pollInFlightRef.current && !force) return;

      pollInFlightRef.current = true;
      setManualRefreshing(force);
      try {
        await mutate();
      } finally {
        setLastCheckedAt(new Date());
        setManualRefreshing(false);
        pollInFlightRef.current = false;
      }
    },
    [current?.token, mutate, resolveFetchUrl]
  );

  useEffect(() => {
    if (!resolveFetchUrl || !current?.token) return;

    const intervalId = window.setInterval(() => {
      void refreshEmailInbox();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [current?.token, refreshEmailInbox, resolveFetchUrl]);

  useEffect(() => {
    if (!emailAddresses.length) {
      getNewEmail(retainCount, newEmailRequest).catch((err: unknown) => {
        console.error('Failed to initialize new email', err);
        toast.error(
          `${APP_NAME} could not fetch a new identity email. Check API URL and credentials.`
        );
        setLoading(false);
      });
    }
  }, [
    getNewEmail,
    emailAddresses.length,
    retainCount,
    newEmailRequest,
    setLoading,
  ]);

  useEffect(() => {
    setLoading(!data && !error);

    if (data || error) {
      setLastCheckedAt(new Date());
    }

    if (data?.emails?.length && data?.emails?.[0]?.to === current?.email) {
      setEmails(data.emails);
    } else if (error && differenceInHours(lastUpdated, new Date()) > 1) {
      getNewEmail(retainCount, newEmailRequest).catch((err: unknown) => {
        console.error('Failed to rotate email after stale fetch error', err);
        toast.error('Unable to refresh identity email; retrying...');
      });
    }
  }, [
    data,
    error,
    current?.email,
    lastUpdated,
    getNewEmail,
    retainCount,
    setLoading,
    setEmails,
    newEmailRequest,
  ]);

  useEffect(() => {
    setOtp('');
    if (emails.length) {
      const lastEmail = emails?.[0];
      const currentYear = new Date().getFullYear().toString();
      const content = lastEmail?.body_text || lastEmail?.body_html;
      if (content) {
        const { code } = parse(content?.replace?.(currentYear, '')) ?? {};
        if (code) {
          setOtp(code);
        }
      }
    }
  }, [emails, setOtp]);

  useEffect(() => {
    if (
      current?.email &&
      data?.emails?.length &&
      data.emails[0]?.to !== current.email
    ) {
      setEmails([]);
    }
  }, [current?.email, data?.emails, setEmails]);

  useEffect(() => {
    void refreshEmailInbox({ force: true });
  }, [current?.email, current?.token, refreshEmailInbox]);

  return {
    emailAddresses,
    emails,
    otp,
    loading,
    getNewEmail: () =>
      getNewEmail(retainCount, newEmailRequest),
    refreshEmails: () => refreshEmailInbox({ force: true }),
    isRefreshing: isValidating || manualRefreshing,
    lastCheckedAt,
    selectEmail,
    restoreEmailAddress,
    email: current?.email,
    token: current?.token,
    provider: current?.provider,
    currentEmailRecord: current,
  };
};

export default useEmail;
