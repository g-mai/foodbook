/** Only web URLs become links; other source descriptions remain plain text. */
export function getSourceHref(source?: string): string | undefined {
  if (!source || !URL.canParse(source)) return undefined;
  const { protocol } = new URL(source);
  return protocol === 'http:' || protocol === 'https:' ? source : undefined;
}
