import useSWR from 'swr';
import { differenceInHours } from 'date-fns';
import parse from 'parse-otp-message';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Email } from 'src/types';
import { useLocalStorage } from 'usehooks-ts';

const fetcher = async ([url, token]: [url: string, token: string]) => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const error = new Error('Error fetching emails.');
    throw error;
  }
  return res.json();
};

const eFetch = (url: string) =>
  fetch(url, {
    body: JSON.stringify({
      // provider: provider,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then((res) => res.json());

const useEmail = (retainCount = 5) => {
  const [lastUpdated, setLastUpdated] = useLocalStorage<Date>(
    'throwaway-email-lastupdate',
    new Date()
  );

  const [emailAddresses, setEmailAddresses] = useLocalStorage<
    { email: string; token: string }[]
  >('throwaway-email-addresses', []);

  const [currentEmailIndex, setCurrentEmailIndex] = useLocalStorage<number>(
    'throwaway-email',
    0
  );
  const [emails, setMail] = useState<Email[]>([]);
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getNewEmail = useCallback(() => {
    eFetch(`${import.meta.env.VITE_API_URL}`).then((data) => {
      setEmailAddresses((prev) => {
        const updated = [{ email: data.email, token: data.token }, ...prev];
        setCurrentEmailIndex(0);
        return updated.slice(0, retainCount);
      });
      setLastUpdated(new Date());
    });
  }, [retainCount]);

  const fetchUrl = useMemo(
    () =>
      `${import.meta.env.VITE_API_URL}/${
        emailAddresses?.[currentEmailIndex ?? 0]?.email || ''
      }`,
    [emailAddresses, currentEmailIndex]
  );

  const { data, error, mutate } = useSWR(
    fetchUrl && emailAddresses?.[currentEmailIndex ?? 0]?.token
      ? [fetchUrl, emailAddresses?.[currentEmailIndex ?? 0]?.token]
      : null,
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  useEffect(() => {
    if (!emailAddresses.length) {
      getNewEmail();
    }
  }, []);

  useEffect(() => {
    if (!data && !error) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (data?.emails) {
      if (
        data.emails.length &&
        data.emails?.[0]?.to === emailAddresses?.[currentEmailIndex]?.email
      ) {
        setMail(data.emails);
      }
    } else if (error && differenceInHours(lastUpdated, new Date()) > 1) {
      getNewEmail();
      setLastUpdated(new Date());
    }
  }, [data, error]);

  // OTP Detection
  useEffect(() => {
    setOtp('');
    if (emails.length) {
      const lastEmail = emails?.[0];
      const currentYear = new Date().getFullYear().toString();
      const content = lastEmail.body_text || lastEmail.body_html;
      if (content) {
        const { code } = parse(content.replace(currentYear, ''));
        if (code) {
          setOtp(code);
        }
      }
    }
  }, [emails]);

  const selectEmail = useCallback(
    (index: number) => {
      if (index >= 0 && index < emailAddresses.length) {
        setCurrentEmailIndex(index);
        mutate(); // Trigger a revalidation for the selected email
      }
    },
    [emailAddresses, mutate]
  );

  useEffect(() => {
    setMail([]);
    mutate(); // Manual Revalidate when the email index changes
  }, [currentEmailIndex]);

  const currentEmail = useMemo(
    () => emailAddresses?.[currentEmailIndex]?.email,
    [currentEmailIndex, emailAddresses]
  );

  return {
    emailAddresses,
    emails,
    otp,
    loading,
    getNewEmail,
    selectEmail,
    email: currentEmail,
    token: emailAddresses?.[currentEmailIndex]?.token,
  };
};

export default useEmail;
