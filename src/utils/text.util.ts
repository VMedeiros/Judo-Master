/**
 * Lower case without accents, so a search for "nague", "tê" or "projecao"
 * matches "Nague-waza", "Tê-waza" and "Projeção".
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** A file-name-safe slug: "11º Kyu - Faixa Branca" → "11o-kyu-faixa-branca". */
export function slugify(text: string): string {
  return normalizeForSearch(text.replaceAll('º', 'o').replaceAll('ª', 'a'))
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');
}

/** YYYYMMDD in local time, for file names. */
export function dateStamp(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}${month}${day}`;
}
