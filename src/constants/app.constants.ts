export const APP_NAME = 'Judô Master' as const;
export const APP_VERSION = '2.0.0' as const;

export const NOTIFICATION_TIMEOUT_SUCCESS = 3000 as const;
export const NOTIFICATION_TIMEOUT_ERROR = 4000 as const;

export interface FontOption {
    readonly name: string;
    readonly class: string;
}

export const FONT_OPTIONS: ReadonlyArray<FontOption> = [
    { name: 'Inter', class: 'font-sans' },
    { name: 'Serifada', class: 'font-serif' },
    { name: 'Monoespaçada', class: 'font-mono' },
] as const;

export const FONT_SIZE_OPTIONS: ReadonlyArray<{ readonly name: string; readonly value: number }> = [
    { name: 'Pequena', value: 14 },
    { name: 'Padrão', value: 16 },
    { name: 'Grande', value: 18 },
] as const;

export const DEFAULT_FONT_SIZE = 16 as const;

export const TECHNIQUE_CATEGORIES: ReadonlyArray<string> = [
    'Fundamentos (Kihon)',
    'NAGUE-WAZA - Koshi-waza',
    'NAGUE-WAZA - Ashi-waza',
    'NAGUE-WAZA - Te-waza',
    'NAGUE-WAZA - Ma-sutemi-waza',
    'NAGUE-WAZA - Yoko-sutemi-waza',
    'KATAME-WAZA - Ossae-komi-waza',
    'KATAME-WAZA - Shime-waza',
    'KATAME-WAZA - Kansetsu-waza',
    'Técnicas de Projeção (Nage-waza)',
    'Técnicas de Controle no Solo (Katame-waza)',
    'Técnicas de Estrangulamento (Shime-waza)',
    'Técnicas de Articulação (Kansetsu-waza)',
] as const;

export const QUOTES: ReadonlyArray<string> = [
    '"A prática do judô é um processo de aprendizado contínuo; a luta é apenas um meio para o aperfeiçoamento da pessoa." — Jigoro Kano',
    '"Ceder é o meio mais eficiente de utilizar a energia. Resistir à força com força é fútil; use a flexibilidade para controlar a força." — Jigoro Kano',
    '"Dominar-se para triunfar. Conhecer-se para se dominar." — Jigoro Kano',
    '"A gentileza sempre vence a força." — Kyuzo Mifune',
    '"Se caíres sete vezes, levanta-te oito." — Provérbio Japonês',
    '"O judô é a arte de usar o mínimo de força para o máximo de efeito." — Yasuhiro Yamashita',
    '"Não te curves perante as dificuldades, mas sim adapta-te a elas." — Jigoro Kano',
    '"O judô começa e termina com respeito. O respeito é a base de tudo." — Mitsuyo Maeda',
    '"A jornada de mil quilômetros começa com o primeiro passo." — Lao-Tzu',
] as const;
