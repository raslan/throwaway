import { useInterval } from "@refolded/use-timing";
import { differenceInHours } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Email } from "src/types";
import { useLocalStorage } from "usehooks-ts";
import useFetch from "./useFetch";
import parse from "parse-otp-message";

const eFetch = (url: string) => fetch(url).then((res) => res.json());

const useEmail = () => {
  const [lastUpdated, setLastUpdated] = useLocalStorage<Date>(
    "throwaway-email-lastupdate",
    new Date()
  );
  const [email, setEmail] = useLocalStorage("throwaway-email", "");
  const [emails, setMail] = useState<Email[]>([]);
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);

  //   Utility functions to generate new email and read an inbox
  const getNewEmail = useCallback(() => {
    eFetch(`${import.meta.env.VITE_API_URL}`).then((data) => {
      setEmail(data.email);
    });
  }, []);

  const { data, error, refresh } = useFetch<any>(
    `${import.meta.env.VITE_API_URL}/${email}`
  );

  //   Periodically update the mail
  const { start: watch } = useInterval(() => {
    refresh();
  }, 7000);

  //   Initially make sure the email is still valid and fetch mail
  useEffect(() => {
    if (!email) {
      getNewEmail();
    }
    watch();
  }, []);

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
    setOtp("");
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
