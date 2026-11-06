// Copies dist/index.html into each client-side route folder so static hosts serve
// /venue (and refreshes of it) without rewrite rules. Keep ROUTES in sync with
// the <Route> paths in src/AppShell.tsx.
import { access, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const source = path.join(dist, 'index.html');
const ROUTES = ['venue'];

try {
  await access(source);
} catch {
  throw new Error(`${source} not found — run vite build first`);
}

for (const route of ROUTES) {
  const dir = path.join(dist, route);
  await mkdir(dir, { recursive: true });
  const target = path.join(dir, 'index.html');
  await copyFile(source, target);
  console.log(`copied ${path.relative(root, source)} → ${path.relative(root, target)}`);
}
