import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();

test('production service worker loader is self-contained', () => {
  const loaderPath = join(repoRoot, 'dist/service-worker-loader.js');
  const manifestPath = join(repoRoot, 'dist/manifest.json');

  assert.ok(
    existsSync(loaderPath),
    'run npm run build before qa/build-output.test.mjs'
  );

  const loader = readFileSync(loaderPath, 'utf8');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  assert.equal(
    manifest.background.service_worker,
    'service-worker-loader.js'
  );
  assert.equal(manifest.background.type, 'module');
  assert.doesNotMatch(loader, /^\s*import\s+['"]/m);
  assert.match(loader, /chrome\.runtime\.onMessage\.addListener/);
});
