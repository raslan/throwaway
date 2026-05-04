import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const repoRoot = process.cwd();
const outDir = join(tmpdir(), 'personashell-email-response-test');

const compileEmailResponseModule = async () => {
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
      'src/lib/email-response.ts',
    ],
    { cwd: repoRoot }
  );

  const candidates = [
    join(outDir, 'email-response.js'),
    join(outDir, 'src/lib/email-response.js'),
  ];
  const compiledPath = candidates.find(existsSync);
  assert.ok(compiledPath, 'compiled email-response.js should exist');
  return import(pathToFileURL(compiledPath).href);
};

const {
  inferEmailFromInboxUrl,
  normalizeInboxResponse,
} = await compileEmailResponseModule();

test('infers the recipient from inbox URLs', () => {
  assert.equal(
    inferEmailFromInboxUrl(
      'https://throwaway.raslan.dev/api/email/ofthybtt7jm8td%40yzcalo.com'
    ),
    'ofthybtt7jm8td@yzcalo.com'
  );
});

test('normalizes provider inbox entries without a to field', () => {
  const payload = normalizeInboxResponse(
    {
      emails: [
        {
          from: 'me',
          subject: 'nice try',
          body_text: 'hello',
        },
      ],
    },
    'ofthybtt7jm8td@yzcalo.com'
  );

  assert.equal(payload.email, 'ofthybtt7jm8td@yzcalo.com');
  assert.equal(payload.emails.length, 1);
  assert.equal(payload.emails[0].to, 'ofthybtt7jm8td@yzcalo.com');
  assert.equal(payload.emails[0].body_text, 'hello');
  assert.equal(payload.emails[0].body_html, '');
});
