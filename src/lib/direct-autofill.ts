export function directAutofillPage(rawState: Record<string, unknown>) {
  const normalize = (value: unknown) => `${value ?? ''}`.toLowerCase().trim();
  const textValue = (value: unknown) => `${value ?? ''}`.trim();
  const dispatch = (element: HTMLElement, type: string) =>
    element.dispatchEvent(new Event(type, { bubbles: true }));
  const setValue = (
    element: HTMLInputElement | HTMLTextAreaElement,
    value: string
  ) => {
    if (!value || element.value === value) return false;
    element.focus();
    const prototype =
      element instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    valueSetter?.call(element, value);
    dispatch(element, 'input');
    dispatch(element, 'change');
    element.blur();
    return true;
  };
  const aliases: Record<string, string[]> = {
    first_name: ['first name', 'firstname', 'given name', 'given-name', 'first'],
    last_name: ['last name', 'lastname', 'family name', 'family-name', 'surname', 'last'],
    name: ['name', 'full name', 'your name', 'legal name', 'display name'],
    email: ['email', 'email address', 'e-mail'],
    identifier: ['email', 'email address', 'e-mail'],
    phone: ['phone', 'telephone', 'mobile', 'cell'],
    tel: ['phone', 'telephone', 'mobile', 'cell'],
    city: ['city', 'town'],
    state: ['state', 'province', 'region'],
    zipcode: ['zip', 'zipcode', 'postal', 'postal code', 'postcode'],
    street: ['address', 'street', 'street address', 'address line'],
    street_address: ['address', 'street', 'street address', 'address line'],
    country: ['country', 'nation'],
    company: ['company', 'organization', 'organisation'],
    organization: ['company', 'organization', 'organisation'],
    website: ['website', 'company website', 'url', 'site'],
    url: ['website', 'company website', 'url', 'site'],
    company_website: ['website', 'company website', 'url', 'site'],
    domain: ['domain', 'website domain', 'company domain'],
    card_number: ['credit card', 'card number', 'card', 'cc-number'],
    otp: ['otp', 'code', 'verification', 'verification code'],
    code: ['otp', 'code', 'verification', 'verification code'],
    verification_code: ['otp', 'code', 'verification', 'verification code'],
  };
  const cssEscape = (value: string) =>
    CSS?.escape ? CSS.escape(value) : value.replace(/["\\]/g, '\\$&');
  const relatedText = (element: HTMLInputElement | HTMLTextAreaElement) => {
    const labelText = [...(element.labels || [])]
      .map((label) => label.textContent)
      .filter(Boolean);
    const explicitLabels = element.id
      ? [
          ...document.querySelectorAll<HTMLLabelElement>(
            `label[for="${cssEscape(element.id)}"]`
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
      element.parentElement?.textContent?.slice(0, 140),
    ]
      .filter(Boolean)
      .join(' ');
  };
  const fieldText = (element: HTMLInputElement | HTMLTextAreaElement) =>
    normalize(
      [
        element.name,
        element.id,
        element.placeholder,
        element.autocomplete,
        element.getAttribute('aria-label'),
        element.getAttribute('aria-placeholder'),
        element.getAttribute('data-testid'),
        element.getAttribute('data-test-id'),
        relatedText(element),
      ]
        .filter(Boolean)
        .join(' ')
    );
  const normalizeUrl = (element: HTMLInputElement, value: string) => {
    const search = fieldText(element);
    const isUrl =
      element.type === 'url' ||
      ['url', 'website', 'site', 'domain'].some((token) =>
        search.includes(token)
      );
    if (!isUrl || /^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return value;
    return /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)
      ? `https://${value}`
      : value;
  };
  const isFillable = (element: HTMLInputElement | HTMLTextAreaElement) =>
    !element.disabled &&
    !element.readOnly &&
    !element.hidden &&
    element.type !== 'hidden' &&
    element.type !== 'file' &&
    element.type !== 'checkbox' &&
    element.type !== 'radio' &&
    element.type !== 'button' &&
    element.type !== 'submit' &&
    element.type !== 'reset' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0;
  const priority = [
    'first_name',
    'last_name',
    'email',
    'identifier',
    'phone',
    'tel',
    'city',
    'state',
    'zipcode',
    'street_address',
    'street',
    'country',
    'company',
    'organization',
    'website',
    'url',
    'company_website',
    'name',
  ];
  const priorityIndex = (key: string) => {
    const index = priority.indexOf(key);
    return index === -1 ? priority.length : index;
  };
  const matchesTerm = (key: string, text: string, term: string) => {
    if (key !== 'name' || term !== 'name') return text.includes(term);
    return (
      /\bname\b/.test(text) &&
      !/\b(first|last|given|family|sur|user|company|card)\b/.test(text)
    );
  };

  const state = { ...(rawState || {}) };
  delete state.env;
  delete state.metadata;
  delete state['throwaway-version'];

  const fields = [
    ...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input, textarea'
    ),
  ].filter(isFillable);
  const used = new Set<Element>();
  let filled = 0;

  Object.entries(state).sort(
    ([left], [right]) => priorityIndex(left) - priorityIndex(right)
  ).forEach(([key, rawValue]) => {
    const value = textValue(rawValue);
    if (!value) return;
    const terms = [
      normalize(key).replace(/[_-]/g, ' '),
      normalize(key).replace(/[^a-z0-9]/g, ''),
      ...(aliases[key] || []),
    ];
    const field = fields.find(
      (candidate) =>
        !used.has(candidate) &&
        terms.some((term) => matchesTerm(key, fieldText(candidate), term))
    );
    if (!field) return;
    const nextValue =
      field instanceof HTMLInputElement ? normalizeUrl(field, value) : value;
    if (setValue(field, nextValue)) {
      used.add(field);
      filled += 1;
    }
  });

  const country = textValue(state.country);
  if (country) {
    [...document.querySelectorAll<HTMLSelectElement>('select')].forEach(
      (select) => {
        if (select.disabled) return;
        const option = [...select.options].find((candidate) =>
          normalize(`${candidate.textContent} ${candidate.value}`).includes(
            normalize(country)
          )
        );
        if (option && select.value !== option.value) {
          select.value = option.value;
          dispatch(select, 'change');
          filled += 1;
        }
      }
    );
  }

  return filled;
}
