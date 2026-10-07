import { fileURLToPath } from 'node:url';

const trackingParameter =
  /^(?:utm_.*|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|igshid|gbraid|wbraid|_ga|_gl)$/i;

export function normalizeSourceUrl(source) {
  const url = new URL(source.trim());
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('A recipe source must use HTTP or HTTPS.');
  }
  if (url.username || url.password) {
    throw new Error('A recipe source must not contain credentials.');
  }
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (trackingParameter.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.href;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const source of process.argv.slice(2)) {
    console.log(normalizeSourceUrl(source));
  }
}
