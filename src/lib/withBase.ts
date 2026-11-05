/**
 * Prefixes a public-folder path with Vite's base URL so assets still load
 * when the site is deployed under a sub-path (e.g. `/icpc2027/`).
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  return base + path.replace(/^\/+/, '');
}
