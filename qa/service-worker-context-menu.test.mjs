import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const repoRoot = process.cwd();
const outDir = join(
  repoRoot,
  'node_modules/.cache/personashell-service-worker-test'
);

const compileServiceWorker = () => {
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
      'service-worker.ts',
    ],
    { cwd: repoRoot }
  );

  const candidates = [
    join(outDir, 'service-worker.js'),
    join(outDir, 'src/service-worker.js'),
  ];
  const compiledPath = candidates.find(existsSync);
  assert.ok(compiledPath, 'compiled service-worker.js should exist');
  return compiledPath;
};

const installFakeChrome = () => {
  const previousChrome = globalThis.chrome;
  let contextMenuListener;
  const executeCalls = [];
  const messages = [];

  globalThis.chrome = {
    contextMenus: {
      create(_details, callback) {
        callback?.();
      },
      remove(_id, callback) {
        callback?.();
      },
      onClicked: {
        addListener(callback) {
          contextMenuListener = callback;
        },
      },
    },
    runtime: {
      getManifest() {
        return {
          content_scripts: [
            {
              js: ['assets/content-script-loader.js'],
            },
          ],
        };
      },
      lastError: undefined,
      onInstalled: { addListener() {} },
      onMessage: { addListener() {} },
      onStartup: { addListener() {} },
    },
    scripting: {
      executeScript(details, callback) {
        executeCalls.push(details);
        callback?.([]);
      },
    },
    storage: {
      local: {
        get(_keys, callback) {
          callback({
            identity: JSON.stringify({
              first_name: 'Dino',
              last_name: 'Rosenbaum',
            }),
            throwaway_env: JSON.stringify({
              token: 'secret-token',
            }),
          });
        },
      },
    },
    tabs: {
      sendMessage(tabId, message, callback) {
        messages.push({ tabId, message });
        callback?.();
      },
    },
  };

  return {
    executeCalls,
    messages,
    triggerContextMenuClick() {
      assert.equal(
        typeof contextMenuListener,
        'function',
        'context-menu listener registered'
      );
      contextMenuListener({ menuItemId: 'autofill' }, { id: 123 });
    },
    restore() {
      if (previousChrome === undefined) {
        delete globalThis.chrome;
      } else {
        globalThis.chrome = previousChrome;
      }
    },
  };
};

test('context-menu autofill uses content-script messaging, not direct popup injection', async () => {
  const chrome = installFakeChrome();

  try {
    const compiledPath = compileServiceWorker();
    await import(`${pathToFileURL(compiledPath).href}?t=${Date.now()}`);
    chrome.triggerContextMenuClick();

    assert.equal(chrome.executeCalls.length, 1);
    assert.deepEqual(chrome.executeCalls[0], {
      target: { tabId: 123, allFrames: true },
      files: ['assets/content-script-loader.js'],
    });
    assert.equal('func' in chrome.executeCalls[0], false);
    assert.equal(chrome.messages.length, 1);
    assert.equal(chrome.messages[0].tabId, 123);
    assert.equal(chrome.messages[0].message.first_name, 'Dino');
    assert.equal(chrome.messages[0].message.env.token, 'secret-token');
  } finally {
    chrome.restore();
  }
});
