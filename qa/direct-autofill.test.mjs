import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const repoRoot = process.cwd();
const outDir = join(tmpdir(), 'personashell-direct-autofill-test');

const compileAutofillModule = async () => {
  rmSync(outDir, { force: true, recursive: true });
  execFileSync(
    join(repoRoot, 'node_modules/.bin/tsc'),
    [
      '--target',
      'ES2022',
      '--module',
      'ES2022',
      '--moduleResolution',
      'Node',
      '--lib',
      'DOM,DOM.Iterable,ES2022',
      '--skipLibCheck',
      '--outDir',
      outDir,
      '--noEmit',
      'false',
      'src/lib/direct-autofill.ts',
    ],
    { cwd: repoRoot }
  );

  const candidates = [
    join(outDir, 'direct-autofill.js'),
    join(outDir, 'src/lib/direct-autofill.js'),
  ];
  const compiledPath = candidates.find(existsSync);
  assert.ok(compiledPath, 'compiled direct-autofill.js should exist');
  return import(pathToFileURL(compiledPath).href);
};

const { directAutofillPage } = await compileAutofillModule();

class FakeEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = Boolean(options.bubbles);
  }
}

class FakeInput {
  constructor({
    autocomplete = '',
    disabled = false,
    hidden = false,
    id = '',
    name = '',
    parentText = '',
    placeholder = '',
    readOnly = false,
    type = 'text',
    width = 240,
    height = 32,
  } = {}) {
    this.autocomplete = autocomplete;
    this.disabled = disabled;
    this.hidden = hidden;
    this.id = id;
    this.name = name;
    this.parentElement = { textContent: parentText };
    this.placeholder = placeholder;
    this.readOnly = readOnly;
    this.type = type;
    this.width = width;
    this.height = height;
    this.attributes = new Map();
    this.events = [];
    this.focused = false;
    this.blurred = false;
    this.setterCalls = 0;
    this._value = '';
  }

  get offsetWidth() {
    return this.width;
  }

  get offsetHeight() {
    return this.height;
  }

  get value() {
    return this._value;
  }

  set value(nextValue) {
    this.setterCalls += 1;
    this._value = String(nextValue);
  }

  getAttribute(name) {
    if (name === 'aria-label') return this.attributes.get(name) || '';
    if (name === 'aria-placeholder') return this.attributes.get(name) || '';
    if (name === 'data-testid') return this.attributes.get(name) || '';
    if (name === 'data-test-id') return this.attributes.get(name) || '';
    return this.attributes.get(name) || null;
  }

  focus() {
    this.focused = true;
  }

  blur() {
    this.blurred = true;
  }

  dispatchEvent(event) {
    this.events.push(event.type);
    return true;
  }
}

class FakeTextArea extends FakeInput {}

class FakeOption {
  constructor(textContent, value = textContent) {
    this.textContent = textContent;
    this.value = value;
  }
}

class FakeSelect {
  constructor(options = []) {
    this.disabled = false;
    this.events = [];
    this.options = options;
    this.value = '';
  }

  dispatchEvent(event) {
    this.events.push(event.type);
    return true;
  }
}

const withFakeDom = (fields, selects, run) => {
  const previous = {
    document: globalThis.document,
    Event: globalThis.Event,
    HTMLInputElement: globalThis.HTMLInputElement,
    HTMLSelectElement: globalThis.HTMLSelectElement,
    HTMLTextAreaElement: globalThis.HTMLTextAreaElement,
  };

  globalThis.Event = FakeEvent;
  globalThis.HTMLInputElement = FakeInput;
  globalThis.HTMLSelectElement = FakeSelect;
  globalThis.HTMLTextAreaElement = FakeTextArea;
  globalThis.document = {
    querySelectorAll(selector) {
      if (selector === 'input, textarea') return fields;
      if (selector === 'select') return selects;
      return [];
    },
  };

  try {
    return run();
  } finally {
    Object.entries(previous).forEach(([key, value]) => {
      if (value === undefined) {
        delete globalThis[key];
      } else {
        globalThis[key] = value;
      }
    });
  }
};

test('fills the OpenComputer signup fields with native setter events', () => {
  const first = new FakeInput({
    parentText: 'First name',
    placeholder: 'Your first name',
  });
  const last = new FakeInput({
    parentText: 'Last name',
    placeholder: 'Your last name',
  });
  const email = new FakeInput({
    parentText: 'Email',
    placeholder: 'Your email address',
    type: 'email',
  });

  const filled = withFakeDom([first, last, email], [], () =>
    directAutofillPage({
      first_name: 'Dino',
      last_name: 'Rosenbaum',
      email: 'ofthybtt7jm8td@yzcalo.com',
    })
  );

  assert.equal(filled, 3);
  assert.equal(first.value, 'Dino');
  assert.equal(last.value, 'Rosenbaum');
  assert.equal(email.value, 'ofthybtt7jm8td@yzcalo.com');
  assert.deepEqual(first.events, ['input', 'change']);
  assert.deepEqual(last.events, ['input', 'change']);
  assert.deepEqual(email.events, ['input', 'change']);
  assert.equal(first.setterCalls, 1);
  assert.equal(email.focused, true);
  assert.equal(email.blurred, true);
});

test('prioritizes first and last name over the generic full name field', () => {
  const first = new FakeInput({
    parentText: 'First name',
    placeholder: 'Your first name',
  });
  const last = new FakeInput({
    parentText: 'Last name',
    placeholder: 'Your last name',
  });
  const email = new FakeInput({
    parentText: 'Email',
    placeholder: 'Your email address',
    type: 'email',
  });

  const filled = withFakeDom([first, last, email], [], () =>
    directAutofillPage({
      identifier: 'dino@example.com',
      avatar: 'https://picsum.photos/500',
      job_title: 'Security Analyst',
      name: 'Wrong Fullname',
      first_name: 'Dino',
      last_name: 'Rosenbaum',
      phone: '(555) 010-1111',
      email: 'dino@example.com',
    })
  );

  assert.equal(filled, 3);
  assert.equal(first.value, 'Dino');
  assert.equal(last.value, 'Rosenbaum');
  assert.equal(email.value, 'dino@example.com');
});

test('treats identifier as email for signup forms', () => {
  const first = new FakeInput({
    parentText: 'First name',
    placeholder: 'Your first name',
  });
  const last = new FakeInput({
    parentText: 'Last name',
    placeholder: 'Your last name',
  });
  const email = new FakeInput({
    parentText: 'Email',
    placeholder: 'Your email',
    type: 'email',
  });

  const filled = withFakeDom([first, last, email], [], () =>
    directAutofillPage({
      first_name: 'Hermann',
      last_name: 'Mertz',
      identifier: 'ofthybtt7jm8td@yzcalo.com',
    })
  );

  assert.equal(filled, 3);
  assert.equal(first.value, 'Hermann');
  assert.equal(last.value, 'Mertz');
  assert.equal(email.value, 'ofthybtt7jm8td@yzcalo.com');
});

test('normalizes website fields and changes matching country selects only', () => {
  const website = new FakeInput({
    name: 'company_website',
    parentText: 'Company website',
    type: 'url',
  });
  const hiddenEmail = new FakeInput({
    hidden: true,
    name: 'email',
    type: 'email',
  });
  const country = new FakeSelect([
    new FakeOption('Select', ''),
    new FakeOption('United States', 'US'),
    new FakeOption('Canada', 'CA'),
  ]);

  const filled = withFakeDom([website, hiddenEmail], [country], () =>
    directAutofillPage({
      company_website: 'example.test',
      country: 'United States',
      email: 'should-not-fill@example.com',
    })
  );

  assert.equal(filled, 2);
  assert.equal(website.value, 'https://example.test');
  assert.equal(country.value, 'US');
  assert.deepEqual(country.events, ['change']);
  assert.equal(hiddenEmail.value, '');
});
