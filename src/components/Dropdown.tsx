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
