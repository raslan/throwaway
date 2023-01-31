import { useInterval, useDebounce } from '@refolded/use-timing';
import { differenceInHours } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Email } from 'src/types';
import { useLocalStorage } from 'usehooks-ts';
import useFetch from './useFetch';
import parse from 'parse-otp-message';
import useSettings from './useSettings';

const eFetch = (url: string) => fetch(url).then((res) => res.json());

const useEmail = () => {
  const debounce = useDebounce();
  const [lastUpdated, setLastUpdated] = useLocalStorage<Date>(
    'throwaway-email-lastupdate',
    new Date()
  );
  const [toUpdate, setToUpdate] = useLocalStorage<boolean>(
    'throwaway-email-toupdate',
    false
  );
  const { useAlternateProvider } = useSettings();
  const [email, setEmail] = useLocalStorage('throwaway-email', '');
  const [emails, setMail] = useState<Email[]>([]);
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  //   Utility functions to generate new email and read an inbox
  const getNewEmail = useCallback(() => {
    debounce(() => {
      eFetch(
        `${import.meta.env.VITE_API_URL}${
          !useAlternateProvider ? '' : `?provider=true`
        }`
      ).then((data) => {
        setEmail(data.email);
        setLastUpdated(new Date());
      });
    }, 100);
  }, [useAlternateProvider]);

  const { data, error, refresh } = useFetch<any>(
    `${import.meta.env.VITE_API_URL}/${email}${
      useAlternateProvider ? '?provider=true' : ''
    }`
  );

  //   Periodically update the mail
  const { start: watch } = useInterval(() => {
    refresh();
  }, 5000);

  //   Initially make sure the email is still valid and fetch mail
  useEffect(() => {
    if (!email) {
      getNewEmail();
    }
    refresh();
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
      const { code } = parse(lastEmail.body_text || lastEmail.body_html);
      if (code) {
        setOtp(code);
      }
    }
  }, [emails]);

  return { email, emails, otp, loading, getNewEmail };
};

export default useEmail;
