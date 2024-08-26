import useEmailStore, { fetcher } from '@/store/email';
import { differenceInHours } from 'date-fns';
import parse from 'parse-otp-message';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';

const useEmail = (retainCount = 5) => {
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
  } = useEmailStore();

  const current = useMemo(
    () => emailAddresses?.[currentEmailIndex ?? 0],
    [emailAddresses, currentEmailIndex]
  );

  const fetchUrl = useMemo(
    () => `${import.meta.env.VITE_API_URL}/${current?.email || ''}`,
    [current?.email]
  );

  const { data, error, mutate } = useSWR(
    fetchUrl && current?.token ? [fetchUrl, current.token] : null,
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      revalidateOnMount: true,
      refreshWhenHidden: true,
      revalidateIfStale: true,
    }
  );

  useEffect(() => {
    if (!emailAddresses.length) {
      getNewEmail(retainCount);
    }
  }, [getNewEmail, emailAddresses.length, retainCount]);

  useEffect(() => {
    setLoading(!data && !error);

    if (data?.emails?.length && data?.emails?.[0]?.to === current?.email) {
      setEmails(data.emails);
    } else if (error && differenceInHours(lastUpdated, new Date()) > 1) {
      getNewEmail(retainCount);
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
    if (current?.email && data?.emails?.[0]?.to !== current?.email) {
      setEmails([]);
    }
    mutate();
  }, [current, mutate, setEmails]);

  return {
    emailAddresses,
    emails,
    otp,
    loading,
    getNewEmail: () => getNewEmail(retainCount),
    selectEmail,
    email: current?.email,
    token: current?.token,
  };
};

export default useEmail;
