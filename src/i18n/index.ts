/**
 * UI strings (SRS FR-90). English only at launch; to add Punjabi later, create
 * pa.json with the same shape, add it to `dictionaries` and to the i18n locales
 * in astro.config.mjs.
 */
import en from './en.json';

export type UIStrings = typeof en;

const dictionaries = { en } satisfies Record<string, UIStrings>;

export type Lang = keyof typeof dictionaries;
export const defaultLang: Lang = 'en';

/** BCP 47 tag for <html lang> (NFR-24). */
export const htmlLang: Record<Lang, string> = { en: 'en-CA' };

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first && first in dictionaries ? (first as Lang) : defaultLang;
}

export function useTranslations(lang: Lang = defaultLang): UIStrings {
  return dictionaries[lang];
}

/**
 * Fill `{name}` slots in a UI string. Unknown slots are left untouched, so
 * business {{PLACEHOLDER}} values pass through unchanged.
 */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
