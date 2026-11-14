/**
 * Belt colours, the same as JudoKan's (src/core/constants/belt.constants.ts
 * there), so a belt looks the same in both apps. Change them together.
 */

/** Solid fill for each belt (lowercase name): bars, dots and avatars. */
const BELT_FILL: Readonly<Record<string, string>> = {
  branca: 'bg-white border border-gray-300 dark:bg-gray-100',
  cinza: 'bg-gray-400',
  azul: 'bg-blue-600',
  amarela: 'bg-yellow-400',
  laranja: 'bg-orange-500',
  verde: 'bg-green-600',
  roxa: 'bg-purple-600',
  marrom: 'bg-[#795548]',
  preta: 'bg-gray-900 dark:bg-black dark:border dark:border-gray-600',
};

/** "branca" from "11º Kyu · Faixa Branca". */
export function beltKeyOf(beltName: string): string {
  return (/faixa\s+(\S+)/i.exec(beltName)?.[1] ?? '').toLowerCase();
}

/** The belt's colour classes, as JudoKan draws it. */
export function beltFillOf(beltName: string): string {
  return BELT_FILL[beltKeyOf(beltName)] ?? 'bg-gray-300';
}
