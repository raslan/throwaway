/// <reference types="chrome"/>

import Fuse from 'fuse.js';
import parse from 'parse-otp-message';

type FillableField = HTMLInputElement | HTMLTextAreaElement;
type FieldState = Record<string, unknown>;

const normalize = (value: string) => (value || '').toLowerCase().trim();

const dispatchEvent = (element: HTMLElement, eventType: string) => {
  const event = new Event(eventType, { bubbles: true });
  element.dispatchEvent(event);
};

const trim = (value: unknown) =>
  typeof value === 'string' ? value.trim() : `${value ?? ''}`.trim();

const setFieldValue = (element: FillableField, value: string) => {
  if (element.value === value) return;
  element.focus();
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  valueSetter?.call(element, value);
  dispatchEvent(element, 'input');
  dispatchEvent(element, 'change');
  element.blur();
};

const isFillable = (element: FillableField) => {
  if (!element || !element.isConnected) return false;
  if (element.readOnly || element.disabled || element.hidden || element.ariaDisabled) return false;

  if (element instanceof HTMLInputElement) {
    if (
      element.type === 'file' ||
      element.type === 'range' ||
      element.type === 'color' ||
      element.type === 'checkbox' ||
      element.type === 'radio' ||
      element.type === 'button' ||
      element.type === 'submit' ||
      element.type === 'reset' ||
      element.type === 'hidden'
    ) {
      return false;
    }
    if (element.type === 'email' && !element.value.includes('@') && element.value.includes(' ')) {
      return false;
    }
  }

  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none') return false;
  if (!element.offsetWidth || !element.offsetHeight) return false;
  if (element.inert) return false;
  return true;
};

const collectFillableFields = (): FillableField[] =>
  [...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')]
    .filter(isFillable) as FillableField[];

const collectStateTokens = (state: FieldState) =>
  Object.values(state || {})
    .map(trim)
    .filter((value) => value.length > 0 && value.length <= 40)
    .map(normalize);

const FIELD_KEY_ALIASES: Record<string, string[]> = {
  first_name: ['first', 'firstname', 'first name', 'given'],
  last_name: ['last', 'lastname', 'last name', 'family name', 'surname'],
  email: ['email', 'email address', 'e-mail'],
  identifier: ['email', 'email address', 'e-mail'],
  name: ['name', 'full name', 'your name', 'legal name', 'display name'],
  phone: ['phone', 'telephone', 'mobile', 'cell', 'contact'],
  tel: ['phone', 'telephone', 'mobile', 'cell', 'contact'],
  mobile: ['phone', 'mobile', 'telephone'],
  website: ['website', 'web site', 'site', 'url', 'company website', 'website url'],
  url: ['url', 'website', 'web site', 'site', 'company website', 'website url'],
  homepage: ['homepage', 'home page', 'website', 'url'],
  company_website: ['company website', 'website', 'url', 'company url'],
  organization: ['company', 'organization', 'organisation'],
  organization_url: ['organization url', 'organization website', 'company website', 'website'],
  domain: ['domain', 'website domain', 'company domain'],
  date: ['date', 'birth date', 'birthday', 'date of birth'],
  dateofbirth: ['dob', 'date of birth', 'birth date'],
  job_title: ['job title', 'job', 'role', 'title'],
  user_name: ['username', 'user', 'handle'],
  zip: ['zip', 'zipcode', 'postal', 'postcode'],
  zipcode: ['zip', 'zipcode', 'postal', 'postcode'],
  street_address: ['street', 'address', 'street address'],
  apartment: ['unit', 'apt', 'apartment', 'suite'],
  suite: ['suite', 'unit', 'apt'],
  city: ['city', 'town'],
  state: ['state', 'province', 'region'],
  country: ['country', 'nation'],
  card_number: ['card', 'cc', 'credit card', 'card number'],
  card_expiry: ['expiry', 'exp', 'expiration', 'expiration date'],
  card_verification: ['cvc', 'cvv', 'security code', 'verification'],
};

const isUrlLikeField = (element: FillableField, key = '') => {
  const search = normalize(`${key} ${getSearchText(element)}`);
  return (
    element instanceof HTMLInputElement &&
      element.type === 'url'
  ) ||
    [
      'url',
      'website',
      'web site',
      'homepage',
      'home page',
      'company website',
      'company url',
      'domain',
    ].some((token) => search.includes(token));
};

const normalizeUrlValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

const normalizeValueForField = (
  element: FillableField,
  key: string,
  value: string
) => {
  if (isUrlLikeField(element, key)) return normalizeUrlValue(value);
  return value;
};

const aliasSetFromStateKey = (key: string) => {
  const normalized = normalize(key);
  const compact = normalized.replace(/[^a-z0-9]/g, '');
  const aliases = new Set([
    normalized,
    compact,
    normalized.replace(/[_-]/g, ' '),
  ]);
  FIELD_KEY_ALIASES[key]?.forEach((alias) =>
    aliases.add(normalize(alias))
  );
  FIELD_KEY_ALIASES[compact]?.forEach((alias) =>
    aliases.add(normalize(alias))
  );
  return [...aliases];
};

const parseOtpCode = (rawValue: string) => {
  if (!rawValue) return '';
  const currentYear = new Date().getFullYear().toString();
  const clean = rawValue.replace(new RegExp(currentYear, 'g'), '');
  const parsed = parse(clean) ?? {};
  if (typeof parsed?.code === 'string' && parsed.code.trim()) {
    return parsed.code.trim();
  }
  const compact = clean.replace(/[\s\-_]/g, '');
  const candidates = [
    ...(clean.match(/\b\d{4,8}\b/g) || []),
    ...(compact.match(/\b\d{4,8}\b/g) || []),
  ];
  const exact = candidates.find((value) => value && value.length >= 4 && value.length <= 8 && value !== '000000');
  if (exact) return exact;
  return '';
};

const FIELD_FILL_PRIORITY = [
  'first_name',
  'last_name',
  'email',
  'identifier',
  'phone',
  'tel',
  'mobile',
  'city',
  'state',
  'zip',
  'zipcode',
  'street_address',
  'country',
  'company',
  'organization',
  'website',
  'url',
  'homepage',
  'company_website',
  'organization_url',
  'name',
];

const priorityIndex = (key: string) => {
  const index = FIELD_FILL_PRIORITY.indexOf(key);
  return index === -1 ? FIELD_FILL_PRIORITY.length : index;
};

const matchesAlias = (key: string, haystack: string, alias: string) => {
  if (key !== 'name' || alias !== 'name') return haystack.includes(alias);
  return (
    /\bname\b/.test(haystack) &&
    !/\b(first|last|given|family|sur|user|company|card)\b/.test(haystack)
  );
};

const matchAliases = (key: string, haystack: string, aliases: string[]) =>
  aliases.some((alias) => matchesAlias(key, haystack, alias));

const cssEscape = (value: string) =>
  CSS?.escape ? CSS.escape(value) : value.replace(/["\\]/g, '\\$&');

const getRelatedText = (element: Element) => {
  const field = element as FillableField;
  const labelText = 'labels' in field
    ? [...(field.labels || [])].map((label) => label.textContent)
    : [];
  const explicitLabels = field.id
    ? [
        ...document.querySelectorAll<HTMLLabelElement>(
          `label[for="${cssEscape(field.id)}"]`
        ),
      ].map((label) => label.textContent)
    : [];
  const describedBy = (element.getAttribute('aria-describedby') || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent);

  return [
    ...labelText,
    ...explicitLabels,
    ...describedBy,
    element.previousElementSibling?.textContent?.slice(0, 80),
    element.parentElement?.textContent?.slice(0, 120),
  ]
    .filter(Boolean)
    .join(' ');
};

const getSearchText = (element: Element) =>
  [
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? element.name
      : '',
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? element.id
      : '',
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? element.placeholder
      : '',
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? element.getAttribute('aria-label')
      : '',
    element.getAttribute('autocomplete'),
    element.getAttribute('aria-describedby'),
    element.getAttribute('aria-placeholder'),
    element.getAttribute('data-testid'),
    element.getAttribute('data-test-id'),
    element.className,
    getRelatedText(element),
    ...(
      Object.values(
        element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
          ? element.dataset || {}
          : {}
      ) as string[]
    ),
  ]
    .filter(Boolean)
    .join(' ');

const fillByKeys = (
  inputs: FillableField[],
  state: FieldState,
  sensitivity: 'low' | 'medium' | 'high' = 'medium'
) => {
  const filled = new Set<FillableField>();
  const fusePresets = {
    low: {
      minMatchCharLength: 2,
      distance: 100,
      threshold: 0.45,
      ignoreLocation: true,
    },
    medium: {
      minMatchCharLength: 3,
      distance: 40,
      threshold: 0.3,
      ignoreLocation: true,
    },
    high: {
      minMatchCharLength: 4,
      distance: 14,
      threshold: 0.22,
      ignoreLocation: true,
    },
  };

  const haystack = inputs
    .filter(isFillable)
    .map((input) => ({
      input,
      attrs: normalize(
        [
          input.name,
          input.id,
          input.placeholder,
          input.getAttribute('aria-label'),
          input.getAttribute('autocomplete'),
          input.getAttribute('data-testid'),
          input.getAttribute('data-test-id'),
          ...Object.values(input.dataset || {}),
        ]
          .filter(Boolean)
          .join(' ')
      ),
      text: normalize(getSearchText(input)),
    }))
    .filter((entry) => entry.text);

  const fuse = new Fuse(haystack, {
    keys: ['text'],
    isCaseSensitive: false,
    ...fusePresets[sensitivity],
  });

  Object.entries(state)
    .filter(([, value]) => typeof value === 'string' && value.length > 0)
    .sort(([left], [right]) => priorityIndex(left) - priorityIndex(right))
    .forEach(([key, rawValue]) => {
      const needle = normalize(String(rawValue));
      const normalizedKey = normalize(key);
      const aliases = aliasSetFromStateKey(normalizedKey).filter(Boolean);
      if (!needle) return;

      const exact = haystack.find((entry) =>
        matchAliases(key, normalize(entry.attrs) + ' ' + entry.text, aliases)
      );
      const fuzzy =
        aliases
          .map((alias) => fuse.search(alias)?.[0]?.item)
          .find(Boolean) || fuse.search(normalizedKey)?.[0]?.item;
      const input = exact || fuzzy;

      if (!input?.input || filled.has(input.input)) return;
      setFieldValue(
        input.input,
        normalizeValueForField(input.input, key, String(rawValue))
      );
      filled.add(input.input);
    });

  return filled;
};

const fillInputsFromLabels = (state: FieldState) => {
  const labels = [...document.querySelectorAll('label')];
  const fuse = new Fuse(Object.keys(state), {
    isCaseSensitive: false,
  });
  labels.forEach((label) => {
    const inputId = label.getAttribute('for');
    const relatedInput = inputId
      ? (document.getElementById(inputId) as FillableField | null)
      : (label.querySelector('input, textarea') as FillableField | null);

    if (!relatedInput || !isFillable(relatedInput)) return;

    const matches = fuse.search(label.textContent || '');
    if (!matches?.[0]) return;
    const key = matches[0].item;
    const value = trim(state[key]);
    if (!value) return;
    setFieldValue(relatedInput, normalizeValueForField(relatedInput, key, value));
  });
};

const isOtpField = (element: FillableField) => {
  const search = normalize(
    [
      element.name,
      element.id,
      element.placeholder,
      element.getAttribute('aria-label'),
      element.getAttribute('autocomplete'),
      element.getAttribute('data-testid'),
    ]
      .filter(Boolean)
      .join(' ')
  );

  const tokens = [
    'otp',
    'one-time',
    'verification',
    'verification code',
    'confirm',
    'pin',
    'security code',
    'code',
  ];

  return tokens.some((token) => search.includes(token));
};

const isSegmentField = (field: FillableField) => {
  const maxLength = Number.parseInt(field.getAttribute('maxlength') || '', 10);
  const inputMode = normalize(field.getAttribute('inputmode') || '');
  return (
    maxLength === 1 ||
    maxLength === 6 ||
    inputMode === 'numeric' ||
    field.getAttribute('autocomplete') === 'one-time-code'
  );
};

const fillOtpField = (input: FillableField, code: string) => {
  if (!code) return;
  if (!isFillable(input) || !isOtpField(input)) return;
  if (input.value?.length === code.length) return;
  setFieldValue(input, code);
};

const fillOtpSegments = (inputs: FillableField[], code: string) => {
  const digits = code.replace(/\D/g, '');
  if (!digits) return;
  const candidates = [...new Set(inputs)]
    .filter(isFillable)
    .filter(isOtpField)
    .filter(isSegmentField);

  if (!candidates.length) return;

  const ordered = [...candidates].sort((left, right) => {
    const leftRect = left.getBoundingClientRect();
    const rightRect = right.getBoundingClientRect();
    if (leftRect.top === rightRect.top) {
      return leftRect.left - rightRect.left;
    }
    return leftRect.top - rightRect.top;
  });

  if (ordered.length > 1 && ordered[0].getAttribute('maxlength') === '1') {
    ordered.slice(0, digits.length).forEach((field, index) => {
      const next = digits[index];
      if (next) setFieldValue(field, next);
    });
    return;
  }

  setFieldValue(ordered[0], digits);
};

const fillSelects = (selects: HTMLSelectElement[], state: FieldState) => {
  const optionKeys = collectStateTokens(state);
  if (!optionKeys.length) return;

  selects.forEach((select) => {
    if (select.disabled) return;
    const options = [...select.options];
    if (!options.length) return;

    const normalizedCurrent = normalize((select.value || '').trim());
    const exactMatch = options.findIndex(
      (option) => normalize(option.value || option.textContent || '') === normalizedCurrent
    );
    if (exactMatch >= 0) return;

    const index = optionKeys.reduce((found, token) => {
      if (found >= 0) return found;
      return options.findIndex((option) => {
        const candidate = normalize(
          `${option.textContent || option.value || ''} ${option.value}`.replace(/\s+/g, ' ')
        );
        return candidate.includes(token);
      });
    }, -1);

    if (index >= 0 && index !== select.selectedIndex) {
      select.selectedIndex = index;
      dispatchEvent(select, 'change');
    }
  });
};

const otpFieldSelectors = [
  'input[autocomplete="one-time-code"]',
  'input[name*="code"]',
];

const sanitizeFillState = (state: FieldState) => {
  const sanitized = {
    ...(state || {}),
  } as Record<string, unknown>;

  delete sanitized.env;
  delete sanitized.metadata;
  delete sanitized['throwaway-version'];

  return sanitized as FieldState;
};

const registerAutofillListener = () => {
  const globalWindow = window as typeof window & {
    __personashellAutofillListenerRegistered?: boolean;
  };
  if (globalWindow.__personashellAutofillListenerRegistered) return;
  globalWindow.__personashellAutofillListenerRegistered = true;

  chrome.runtime.onMessage.addListener(async (state: FieldState) => {
  const fillState = sanitizeFillState(state);
  const env = (state?.env || {}) as {
    VITE_API_URL?: string;
    token?: string;
    email?: string;
  };
  const apiUrl = (env?.VITE_API_URL || '').replace(/\/$/, '');
  const email = ((state?.email as string) || env?.email || '').trim();

      if (env?.VITE_API_URL && email && env?.token) {
    try {
      const response = await fetch(`${apiUrl}/${email}`, {
        body: JSON.stringify({
          token: env?.token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      if (response.ok) {
        const payload = await response.json();
        const emails = payload?.emails || payload?.messages || [];
        if (emails?.length) {
          const lastEmail = emails[0];
          const content = lastEmail?.body_text || lastEmail?.body_html;
          const code = parseOtpCode(content || '');
          if (code) {
            fillState.otp = code;
            fillState.code = code;
            fillState.verification_code = code;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  }

  const inputs = collectFillableFields();
  const selects = [...document.querySelectorAll('select')] as HTMLSelectElement[];
  const code = parseOtpCode(
    [fillState?.otp, fillState?.code, fillState?.verification_code]
      .map(trim)
      .filter(Boolean)
      .join(' ')
  );

  fillSelects(selects, fillState);

  const otpInputs = [
    ...inputs.filter((input) => isOtpField(input)),
    ...otpFieldSelectors.flatMap((selector) =>
      [...document.querySelectorAll(selector)] as FillableField[]
    ),
  ];

  if (code) {
    otpInputs.forEach((input) => fillOtpField(input, code));
    fillOtpSegments(otpInputs, code);
  }

  fillByKeys(
    inputs.filter((input) => !otpInputs.includes(input)),
    fillState,
    (state?.sensitivity as 'low' | 'medium' | 'high') || 'medium'
  );

  fillInputsFromLabels(fillState);

  return true;
  });
};

registerAutofillListener();

export default {};
