/// <reference types="chrome"/>

import Fuse from 'fuse.js';
import parse from 'parse-otp-message';

const isFillable = (element: HTMLInputElement, value: string) => {
  if (element.type) {
    return (
      [
        'text',
        'email',
        'password',
        'search',
        'tel',
        'url',
        'number',
        'date',
      ].includes(element.type) &&
      !(element?.value === value) &&
      !element?.getAttribute?.('autocomplete')?.includes('search') &&
      !element?.disabled &&
      !element?.ariaDisabled
    );
  }
};

chrome.runtime.onMessage.addListener(async (state) => {
  if (state?.env) {
    const res = await fetch(
      `${state?.env?.VITE_API_URL || ''}/${state?.email}`,
      {
        body: JSON.stringify({
          token: state?.env?.token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    );
    const { emails } = await res.json();
    if (emails.length) {
      const lastEmail = emails?.[0];
      const { code } = parse(lastEmail.body_text || lastEmail.body_html) ?? {
        code: '',
      };
      if (code) {
        state.otp = code;
        state.code = code;
        state.verification_code = code;
      }
    }
  }
  // Get all inputs
  const inputs = [...document.querySelectorAll('input')];
  // Map searchable properties in Fuse
  const fuse = new Fuse(inputs, {
    keys: [
      'name',
      'class',
      'id',
      'type',
      'placeholder',
      'aria-label',
      'autocomplete',
    ],
    // Add settings to adjust these
    minMatchCharLength: 4,
    distance: 4,
    threshold: 0.25,
    ignoreLocation: true,
  });

  [...document.querySelectorAll('select')].forEach((select) => {
    select.selectedIndex = Math.floor(Math.random() * select.length);
    const newEvent = new Event('change', { bubbles: true });
    select.dispatchEvent(newEvent);
  });

  inputs.forEach((input: any) => {
    if (input.type === 'radio' || input.type === 'checkbox') {
      input.click();
    }
  });

  // Search for each property given by the frontend and fill any matching input fields
  Object.keys(state).forEach((key) => {
    fuse.search(key).forEach(({ item: input }) => {
      if (isFillable(input, state?.[key])) {
        input.value = state[key];
        const newEvent = new Event('input', { bubbles: true });
        input.dispatchEvent(newEvent);
      }
    });
  });

  return true;
});

export default {};
