import { Menu, Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Email } from 'src/types';
import { useCopyToClipboard } from 'usehooks-ts';
import urlRegex from 'url-regex';

export default function Dropdown({
  otp,
  email,
}: {
  otp: string;
  email: Email;
}) {
  const [, copy] = useCopyToClipboard();
  const [link, setLink] = useState('');

  useEffect(() => {
    const htmlFound = email?.body_html
      ?.match?.(urlRegex())
      ?.filter?.((el: string) => el?.startsWith('http'))?.[0];
    const textFound = email?.body_text
      ?.match?.(urlRegex())
      ?.filter?.((el: string) => el?.startsWith('http'))?.[0];
    if (htmlFound) setLink(htmlFound);
    if (textFound) setLink(textFound);
  }, [email]);
