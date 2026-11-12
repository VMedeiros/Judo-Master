export const APP_NAME = 'Judô Master';

/**
 * localStorage keys. GitHub Pages serves every project of an account from the
 * same origin (vmedeiros.github.io), so all keys carry the app's prefix to
 * keep them apart from the other projects' storage.
 */
export const STORAGE_KEYS = {
  /** Theme and font size. Read before the first paint by src/assets/theme-init.js. */
  SETTINGS: 'judo-master:settings',
  CHANGES: 'judo-master:changes',
  SELECTED_BELT: 'judo-master:selected-belt',
} as const;

/** Keys written by versions before 2.1, migrated on first load and then removed. */
export const LEGACY_STORAGE_KEYS = {
  BELTS: 'judokan_belts',
  SELECTED_BELT_INDEX: 'selectedBeltIndex',
  THEME: 'theme',
  FONT_SIZE: 'fontSize',
  FONT_FAMILY: 'fontFamily',
} as const;

/** Cache names used by the hand-written service worker shipped before 2.1. */
export const LEGACY_CACHE_PREFIX = 'judo-master-';

/** Ids for techniques the user creates start here, far above any seed id. */
export const USER_TECHNIQUE_ID_START = 100_000;

export const TOAST_DURATION_MS = 3500;
export const TOAST_ERROR_DURATION_MS = 6000;

export type FontSize = 'small' | 'medium' | 'large';

/** Root font size per option. Relative, so the browser's own setting still applies. */
export const FONT_SIZE_SCALE: Readonly<Record<FontSize, string>> = {
  small: '87.5%',
  medium: '100%',
  large: '112.5%',
};

export const FONT_SIZE_OPTIONS: ReadonlyArray<{
  readonly value: FontSize;
  readonly short: string;
  readonly label: string;
}> = [
  { value: 'small', short: 'P', label: 'Pequena' },
  { value: 'medium', short: 'M', label: 'Média' },
  { value: 'large', short: 'G', label: 'Grande' },
];

/** theme-color of the browser UI, per theme. Kept in sync with theme-init.js. */
export const THEME_COLORS = { light: '#e8f0f7', dark: '#0a1422' } as const;

export const QUOTES: readonly string[] = [
  '"A prática do judô é um processo de aprendizado contínuo; a luta é apenas um meio para o aperfeiçoamento da pessoa." — Jigoro Kano',
  '"Ceder é o meio mais eficiente de utilizar a energia. Resistir à força com força é fútil; use a flexibilidade para controlar a força." — Jigoro Kano',
  '"Dominar-se para triunfar. Conhecer-se para se dominar." — Jigoro Kano',
  '"A gentileza sempre vence a força." — Kyuzo Mifune',
  '"Se caíres sete vezes, levanta-te oito." — Provérbio Japonês',
  '"O judô é a arte de usar o mínimo de força para o máximo de efeito." — Yasuhiro Yamashita',
  '"Não te curves perante as dificuldades, mas sim adapta-te a elas." — Jigoro Kano',
  '"O judô começa e termina com respeito. O respeito é a base de tudo." — Mitsuyo Maeda',
  '"A jornada de mil quilômetros começa com o primeiro passo." — Lao-Tzu',
];
