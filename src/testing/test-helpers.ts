import { EnvironmentProviders, Provider, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Belt, Technique } from '../models/judo.model';

/** Every key the app writes starts with this prefix. */
const APP_KEY_PREFIX = 'judo-master:';
const LEGACY_KEYS = ['judokan_belts', 'selectedBeltIndex', 'theme', 'fontSize'];

/** Removes what the app (and earlier versions) stored, so each test starts clean. */
export function clearAppStorage(): void {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(APP_KEY_PREFIX) || LEGACY_KEYS.includes(key)) localStorage.removeItem(key);
  }
}

export function configure(
  imports: unknown[] = [],
  providers: (Provider | EnvironmentProviders)[] = []
): void {
  clearAppStorage();
  TestBed.configureTestingModule({
    imports,
    providers: [provideZonelessChangeDetection(), ...providers],
  });
}

/** Runs change detection and waits for effects and after-render hooks. */
export async function settle<T>(fixture: ComponentFixture<T>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

export function query<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`No element matches ${selector}`);
  return element;
}

/** The button whose accessible label or text contains `label`. */
export function button(root: ParentNode, label: string): HTMLButtonElement {
  const match = Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
    b => b.getAttribute('aria-label')?.includes(label) || b.textContent?.includes(label)
  );
  if (!match) throw new Error(`No button labelled "${label}"`);
  return match;
}

export function technique(overrides: Partial<Technique> = {}): Technique {
  return {
    id: 1,
    name: 'O-soto-gari',
    translation: 'Grande ceifada externa',
    description: 'Projeção ceifando a perna de apoio.',
    execution: 'Desequilibrar para trás e ceifar.',
    application: 'Quando o uke recua.',
    demoUrl: 'https://www.youtube.com/watch?v=abcdefghijk',
    category: 'NAGUE-WAZA - Ashi-waza',
    ...overrides,
  };
}

export function belt(overrides: Partial<Belt> = {}): Belt {
  return {
    id: 1,
    name: '11º Kyu - Faixa Branca',
    color: 'bg-white',
    textColor: 'text-gray-800',
    ageGroup: 'Idade mínima 4 anos',
    prerequisites: 'Carência de 3 meses',
    information: 'Primeira graduação.',
    beltImage: 'assets/belts/branca.png',
    techniques: [technique()],
    ...overrides,
  };
}
