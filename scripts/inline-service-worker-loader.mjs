import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const loaderPath = join(distDir, 'service-worker-loader.js');
const manifestPath = join(distDir, 'manifest.json');

if (!existsSync(loaderPath)) {
  throw new Error('dist/service-worker-loader.js does not exist');
}

const loader = readFileSync(loaderPath, 'utf8');
const match = loader.match(/^import\s+['"]\.\/(.+?)['"];?\s*$/);

if (!match) {
  process.exit(0);
}

const workerRelativePath = match[1];
const workerPath = join(distDir, workerRelativePath);

if (!existsSync(workerPath)) {
  throw new Error(`Service worker chunk does not exist: ${workerRelativePath}`);
}

writeFileSync(loaderPath, readFileSync(workerPath, 'utf8'));
rmSync(workerPath);

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const zipName = `${manifest.short_name || manifest.name}-${manifest.version}.zip`;
const zipPath = join(distDir, zipName);

if (existsSync(zipPath)) rmSync(zipPath);
execFileSync('zip', ['-qr', basename(zipPath), '.'], {
  cwd: dirname(zipPath),
});
