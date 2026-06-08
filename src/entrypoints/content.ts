import Fuse from 'fuse.js';
import parse from 'parse-otp-message';

const isFillable = (element: HTMLInputElement, value: string) => {
  return (
    element &&
    element.isConnected &&
    (element.tagName === 'TEXTAREA' ||
      [
        'text',
        'textarea',
        'email',
        'password',
        'search',
        'tel',
        'url',
        'number',
        'date',
      ]?.includes?.(element?.type)) &&
    element.value !== value &&
    !element?.getAttribute?.('autocomplete')?.includes?.('search') &&
    !element?.disabled &&
    !element?.hidden &&
    element?.style?.display !== 'none' &&
    element?.offsetWidth > 0 &&
    element?.offsetHeight > 0 &&
    !element?.inert &&
    !element?.ariaDisabled &&
    !element?.readOnly
  );
};

const fillSelects = (state: Record<string, string>) => {
  [...document.querySelectorAll('select')].forEach((select) => {
    if (select?.disabled) return;

    const options = [...select.options];

    const fuse = new Fuse(options, {
      keys: ['textContent', 'value'],
      isCaseSensitive: false,
      ...fusePresets['high'],
    });

    let matchedOptionIndex = -1;

    Object.keys(state).some((key) => {
      const results = fuse.search(state[key]);
      if (results.length) {
        matchedOptionIndex = results[0].refIndex;
        return true;
      }
      return false;
    });

    if (matchedOptionIndex >= 0) {
      select.selectedIndex = matchedOptionIndex;
    } else {
      select.selectedIndex = Math.floor(Math.random() * select.length);
    }

    dispatchChangeEvent(select, 'change');
  });
};

const dispatchChangeEvent = (element: HTMLElement, eventType: string) => {
  const event = new Event(eventType, { bubbles: true });
  element.dispatchEvent(event);
};

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
          dispatchChangeEvent(input, 'input');
        }
      } else {
        const input = label.querySelector(
          'input, textarea'
        ) as HTMLInputElement;
        if (isFillable(input, state[key])) {
          input.value = state[key];
          dispatchChangeEvent(input, 'input');
        }
      }
    });
  });
};

export default defineContentScript({
  matches: ['https://*/*', 'http://*/*'],
  allFrames: true,
  main() {
    browser.runtime.onMessage.addListener(async (state) => {
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

      const inputs = [
        ...document.querySelectorAll('input, textarea'),
      ] as HTMLInputElement[];

      const dataAttributes = new Set<string>(
        inputs.reduce((acc: string[], input) => {
          const attributes = Object.keys(input.dataset);
          return [...acc, ...attributes];
        }, [])
      );

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

      fillSelects(state);

      inputs.forEach((input) => {
        if (input.disabled) return;
        if (['radio', 'checkbox']?.includes?.(input.type)) {
          input.click();
        }
      });

      Object.keys(state).forEach((key) => {
        fuse.search(key).forEach(({ item: input }) => {
          if (isFillable(input, state?.[key])) {
            if (typeof state[key] !== 'string') {
              input.value = `${state[key]}`;
            } else {
              input.value = state[key];
            }
            dispatchChangeEvent(input, 'input');
          }
        });
      });

      fillInputsBasedOnLabel(state);

      return true;
    });
  },
});
