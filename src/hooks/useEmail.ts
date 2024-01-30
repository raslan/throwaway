import { useDebounce, useImmediateInterval } from '@refolded/hooks';
import { differenceInHours } from 'date-fns';
import parse from 'parse-otp-message';
import { useCallback, useEffect, useState } from 'react';
import { Email } from 'src/types';
import useChromeStorage from './useChromeStorage';
import useFetch from './useFetch';

const eFetch = (url: string, token?: string) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then((res) => res.json());

const useEmail = () => {
  const debounce = useDebounce();
  const [lastUpdated, setLastUpdated] = useChromeStorage<Date>(
    'throwaway-email-lastupdate',
    new Date()
  );
  const [toUpdate, setToUpdate] = useChromeStorage<boolean>(
    'throwaway-email-toupdate',
    false
  );
  const [token, setToken] = useChromeStorage<string>('throwaway-token', '');
  const [email, setEmail] = useChromeStorage('throwaway-email', '');

  const [emails, setMail] = useState<Email[]>([]);
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  //   Utility functions to generate new email and read an inbox
  const getNewEmail = useCallback(() => {
    debounce(() => {
      eFetch(`${import.meta.env.VITE_API_URL}`).then((data) => {
        setEmail(data.email);
        setToken(data.token);
        setLastUpdated(new Date());
      });
    }, 100);
  }, []);

  const { data, error, refresh } = useFetch<any>(
    `${import.meta.env.VITE_API_URL}/${email}`,
    {
      method: 'POST',
      body: JSON.stringify({
        token: token,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  //   Periodically update the mail
  const { start: watch } = useImmediateInterval(() => {
    refresh();
  }, 5000);

  //   Initially make sure the email is still valid and fetch mail
  useEffect(() => {
    if (!email || !token) {
      getNewEmail();
    }
    watch();
  }, []);

  useEffect(() => {
    if (toUpdate) {
      getNewEmail();
      setToUpdate(false);
    }
  }, [toUpdate]);

  useEffect(() => {
    if (!email) getNewEmail();
  }, [email]);

  useEffect(() => {
    if (!data && !error) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (data?.emails) {
      setMail(data.emails);
    } else if (error && differenceInHours(lastUpdated, new Date()) > 1) {
      getNewEmail();
      setLastUpdated(new Date());
    }
  }, [data, error]);

  useEffect(() => {
    setOtp('');
    if (emails.length) {
      const lastEmail = emails?.[0];
      const { code } = parse(lastEmail.body_text || lastEmail.body_html) || {
        code: '',
      };
      if (code) {
        setOtp(code);
      }
    }
  }, [emails]);

  return { email, emails, otp, loading, getNewEmail };
};

export default useEmail;
