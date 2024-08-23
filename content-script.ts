/// <reference types="chrome"/>

import Fuse from 'fuse.js';
import parse from 'parse-otp-message';

// Utility function to check if an input can be filled
const isFillable = (element: HTMLInputElement, value: string) => {
  return (
    element &&
    [
      'text',
      'email',
      'password',
      'search',
      'tel',
      'url',
      'number',
      'date',
    ].includes(element?.type) &&
    element.value !== value &&
    !element?.getAttribute?.('autocomplete')?.includes?.('search') &&
    !element?.disabled &&
    !element?.ariaDisabled
  );
};

// Utility function to fill select elements based on state or randomly
const fillSelects = (state: Record<string, string>) => {
  [...document.querySelectorAll('select')].forEach((select) => {
    if (select?.disabled) return;

    const options = [...select.options];

    // Create a Fuse instance for fuzzy searching the options
    const fuse = new Fuse(options, {
      keys: ['textContent', 'value'],
      isCaseSensitive: false,
      ...fusePresets['high'],
    });

    let matchedOptionIndex = -1;

    // Try to match an option based on the state
    Object.keys(state).some((key) => {
      const results = fuse.search(state[key]);
      if (results.length) {
        matchedOptionIndex = results[0].refIndex; // refIndex corresponds to the option's index
        return true; // Break out of loop if a match is found
      }
      return false;
    });

    // If a match is found, select that option, otherwise pick a random option
    if (matchedOptionIndex >= 0) {
      select.selectedIndex = matchedOptionIndex;
    } else {
      select.selectedIndex = Math.floor(Math.random() * select.length);
    }

    dispatchEvent(select, 'change');
  });
};

// Utility function to dispatch events
const dispatchEvent = (element: HTMLElement, eventType: string) => {
  const event = new Event(eventType, { bubbles: true });
  element.dispatchEvent(event);
};

// Preset configurations for Fuse.js
const fusePresets = {
  low: {
    minMatchCharLength: 2,
    distance: 100,
    threshold: 0.4,
    ignoreLocation: true,
  },
  medium: {
    minMatchCharLength: 3,
    distance: 30,
    threshold: 0.3,
    ignoreLocation: true,
  },
  high: {
    minMatchCharLength: 4,
    distance: 10,
    threshold: 0.2,
    ignoreLocation: true,
  },
};

// Function to fill inputs based on matching label text
const fillInputsBasedOnLabel = (state: Record<string, string>) => {
  const labels = [...document.querySelectorAll('label')];

  const fuse = new Fuse(labels, {
    keys: ['textContent'],
    isCaseSensitive: false,
    ...fusePresets[state.sensitivity || 'medium'],
  });

  Object.keys(state).forEach((key) => {
    fuse.search(key).forEach(({ item: label }) => {
      const inputId = label.getAttribute('for');
      if (inputId) {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (isFillable(input, state[key])) {
          input.value = state[key];
          dispatchEvent(input, 'input');
        }
      } else {
        const input = label.querySelector(
          'input, textarea'
        ) as HTMLInputElement;
        if (isFillable(input, state[key])) {
          input.value = state[key];
          dispatchEvent(input, 'input');
        }
      }
    });
  });
};

chrome.runtime.onMessage.addListener(async (state) => {
  if (state?.env) {
    try {
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
        const content = lastEmail?.body_text || lastEmail?.body_html;
        const currentYear = new Date().getFullYear().toString();
        const { code } =
          parse(content?.replace?.(currentYear, '')) ?? {
            code: '',
          } ??
          {};
        if (code) {
          state.otp = code;
          state.code = code;
          state.verification_code = code;
        }
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  }

  // Get all inputs
  const inputs = [
    ...document.querySelectorAll('input, textarea'),
  ] as HTMLInputElement[];

  // Get all data attribute keys to spread below
  const dataAttributes = new Set<string>(
    inputs.reduce((acc: string[], input) => {
      const attributes = Object.keys(input.dataset);
      return [...acc, ...attributes];
    }, [])
  );

  // Choose sensitivity for input search
  const fuse = new Fuse(inputs, {
    keys: [
      'placeholder',
      'aria-label',
      'autocomplete',
      'name',
      'class',
      'id',
      ...dataAttributes,
    ],
    isCaseSensitive: false,
    ...fusePresets[state.sensitivity || 'medium'],
  });

  // Fill select elements
  fillSelects(state);

  // Handle radio and checkbox inputs
  inputs.forEach((input) => {
    if (input.disabled) return;
    if (['radio', 'checkbox'].includes(input.type)) {
      input.click();
    }
  });

  // Search and fill input fields based on state
  Object.keys(state).forEach((key) => {
    fuse.search(key).forEach(({ item: input }) => {
      if (isFillable(input, state?.[key])) {
        input.value = state[key];
        dispatchEvent(input, 'input');
      }
    });
  });

  // Fill inputs based on labels
  fillInputsBasedOnLabel(state);

  return true;
});

export default {};
