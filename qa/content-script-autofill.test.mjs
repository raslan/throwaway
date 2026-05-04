import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const repoRoot = process.cwd();
const outDir = join(
  repoRoot,
  'node_modules/.cache/personashell-content-script-test'
);

const compileContentScript = () => {
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
      'content-script.ts',
    ],
    { cwd: repoRoot }
  );

  const candidates = [
    join(outDir, 'content-script.js'),
    join(outDir, 'src/content-script.js'),
  ];
  const compiledPath = candidates.find(existsSync);
  assert.ok(compiledPath, 'compiled content-script.js should exist');
  return compiledPath;
};

class FakeEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = Boolean(options.bubbles);
  }
}

class FakeInput {
  constructor({
    autocomplete = '',
    className = '',
    disabled = false,
    hidden = false,
    id = '',
    label = '',
    name = '',
    parentText = '',
    placeholder = '',
    readOnly = false,
    type = 'text',
    width = 240,
    height = 32,
  } = {}) {
    this.ariaDisabled = false;
    this.autocomplete = autocomplete;
    this.className = className;
    this.dataset = {};
    this.disabled = disabled;
    this.hidden = hidden;
    this.id = id;
    this.inert = false;
    this.isConnected = true;
    this.labels = label ? [{ textContent: label }] : [];
    this.name = name;
    this.parentElement = { textContent: parentText };
    this.placeholder = placeholder;
    this.previousElementSibling = label ? { textContent: label } : null;
    this.readOnly = readOnly;
    this.tagName = 'INPUT';
    this.type = type;
    this.width = width;
    this.height = height;
    this.attributes = new Map();
    this.events = [];
    this.focused = false;
    this.blurred = false;
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
    this._value = `${nextValue}`;
  }

  getAttribute(name) {
    if (name === 'autocomplete') return this.autocomplete || null;
    if (name === 'aria-label') return this.attributes.get(name) || '';
    if (name === 'aria-placeholder') return this.attributes.get(name) || '';
    if (name === 'data-testid') return this.attributes.get(name) || '';
    if (name === 'data-test-id') return this.attributes.get(name) || '';
    if (name === 'maxlength') return this.attributes.get(name) || '';
    if (name === 'inputmode') return this.attributes.get(name) || '';
    if (name === 'aria-describedby') return this.attributes.get(name) || '';
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

  getBoundingClientRect() {
    return { left: 0, top: 0 };
  }
}

class FakeTextArea extends FakeInput {
  constructor(options = {}) {
    super(options);
    this.tagName = 'TEXTAREA';
  }
}

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
    this.selectedIndex = 0;
    this.value = options[0]?.value || '';
  }

  dispatchEvent(event) {
    this.events.push(event.type);
    return true;
  }
}

const installFakeRuntime = ({ fields = [], selects = [], labels = [], fetch } = {}) => {
  let listener;
  const previous = {
    CSS: globalThis.CSS,
    Event: globalThis.Event,
    HTMLInputElement: globalThis.HTMLInputElement,
    HTMLSelectElement: globalThis.HTMLSelectElement,
    HTMLTextAreaElement: globalThis.HTMLTextAreaElement,
    chrome: globalThis.chrome,
    document: globalThis.document,
    fetch: globalThis.fetch,
    window: globalThis.window,
  };

  globalThis.CSS = { escape: (value) => `${value}`.replace(/["\\]/g, '\\$&') };
  globalThis.Event = FakeEvent;
  globalThis.HTMLInputElement = FakeInput;
  globalThis.HTMLSelectElement = FakeSelect;
  globalThis.HTMLTextAreaElement = FakeTextArea;
  globalThis.fetch = fetch || (async () => ({ ok: false, json: async () => ({}) }));
  globalThis.window = {
    getComputedStyle: () => ({ display: 'block', visibility: 'visible' }),
  };
  globalThis.document = {
    getElementById(id) {
      return fields.find((field) => field.id === id) || null;
    },
    querySelectorAll(selector) {
      if (selector === 'input, textarea') return fields;
      if (selector === 'select') return selects;
      if (selector === 'label') return labels;
      if (selector.startsWith('label[for=')) return labels;
      if (selector === 'input[autocomplete="one-time-code"]') {
        return fields.filter(
          (field) => field.getAttribute('autocomplete') === 'one-time-code'
        );
      }
      if (selector === 'input[name*="code"]') {
        return fields.filter((field) => field.name.includes('code'));
      }
      return [];
    },
  };
  globalThis.chrome = {
    runtime: {
      onMessage: {
        addListener(callback) {
          listener = callback;
        },
      },
    },
  };

  return {
    getListener() {
      assert.equal(typeof listener, 'function', 'content script registered listener');
      return listener;
    },
    restore() {
      Object.entries(previous).forEach(([key, value]) => {
        if (value === undefined) {
          delete globalThis[key];
        } else {
          globalThis[key] = value;
        }
      });
    },
  };
};

const loadContentScript = async (runtime) => {
  const compiledPath = compileContentScript();
  await import(`${pathToFileURL(compiledPath).href}?t=${Date.now()}`);
  return runtime.getListener();
};

test('right-click content-script fills by identity keys, not generated values', async () => {
  const first = new FakeInput({ label: 'First name', placeholder: 'Your first name' });
  const last = new FakeInput({ label: 'Last name', placeholder: 'Your last name' });
  const email = new FakeInput({ label: 'Email', placeholder: 'Your email', type: 'email' });
  const company = new FakeInput({ label: 'Company', placeholder: 'Company' });

  const runtime = installFakeRuntime({
    fields: [first, last, email, company],
  });

  try {
    const listener = await loadContentScript(runtime);
    await listener({
      identifier: 'dino@example.com',
      name: 'Wrong Fullname',
      first_name: 'Dino',
      last_name: 'Rosenbaum',
      company: 'Acme Labs',
      email: 'dino@example.com',
      sensitivity: 'medium',
    });

    assert.equal(first.value, 'Dino');
    assert.equal(last.value, 'Rosenbaum');
    assert.equal(email.value, 'dino@example.com');
    assert.equal(company.value, 'Acme Labs');
    assert.deepEqual(first.events, ['input', 'change']);
  } finally {
    runtime.restore();
  }
});

test('right-click content-script fetches latest inbox OTP before filling', async () => {
  const otp = new FakeInput({
    autocomplete: 'one-time-code',
    label: 'Verification code',
    name: 'verification_code',
  });
  const fetchCalls = [];
  const runtime = installFakeRuntime({
    fields: [otp],
    fetch: async (url, options) => {
      fetchCalls.push({ url, options });
      return {
        ok: true,
        json: async () => ({
          emails: [
            {
              body_text: 'Your verification code is 482913.',
            },
          ],
        }),
      };
    },
  });

  try {
    const listener = await loadContentScript(runtime);
    await listener({
      email: 'dino@example.com',
      env: {
        VITE_API_URL: 'https://throwaway.test/api/email',
        token: 'secret-token',
      },
    });

    assert.equal(fetchCalls.length, 1);
    assert.equal(
      fetchCalls[0].url,
      'https://throwaway.test/api/email/dino@example.com'
    );
    assert.equal(otp.value, '482913');
    assert.deepEqual(otp.events, ['input', 'change']);
  } finally {
    runtime.restore();
  }
});
