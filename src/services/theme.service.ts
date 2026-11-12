import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';

import {
  FONT_SIZE_SCALE,
  FontSize,
  LEGACY_STORAGE_KEYS,
  STORAGE_KEYS,
  THEME_COLORS,
} from '../constants/app.constants';
import { StorageService } from './storage.service';

export type ThemeChoice = 'light' | 'dark' | 'system';

interface StoredSettings {
  readonly theme?: 'light' | 'dark';
  readonly fontSize?: FontSize;
}

const LEGACY_FONT_SIZES: Readonly<Record<number, FontSize>> = {
  14: 'small',
  16: 'medium',
  18: 'large',
};

/**
 * Theme and font size. src/assets/theme-init.js applies the same settings
 * before Angular boots, so the page never flashes the wrong theme; keep the
 * two in sync.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly document = inject(DOCUMENT);
  private readonly darkQuery = this.document.defaultView?.matchMedia?.(
    '(prefers-color-scheme: dark)'
  );
  private readonly systemDark = signal(this.darkQuery?.matches ?? false);

  public readonly theme = signal<ThemeChoice>('system');
  public readonly fontSize = signal<FontSize>('medium');
  public readonly isDarkMode = computed(() =>
    this.theme() === 'system' ? this.systemDark() : this.theme() === 'dark'
  );

  constructor() {
    this.restore();

    const onSystemChange = (event: MediaQueryListEvent): void => this.systemDark.set(event.matches);
    this.darkQuery?.addEventListener?.('change', onSystemChange);
    inject(DestroyRef).onDestroy(() =>
      this.darkQuery?.removeEventListener?.('change', onSystemChange)
    );

    effect(() => this.apply(this.isDarkMode(), this.fontSize()));
    effect(() => this.persist(this.theme(), this.fontSize()));
  }

  public toggleTheme(): void {
    this.theme.set(this.isDarkMode() ? 'light' : 'dark');
  }

  public setFontSize(size: FontSize): void {
    this.fontSize.set(size);
  }

  private restore(): void {
    const stored = this.storage.read(STORAGE_KEYS.SETTINGS);
    if (isStoredSettings(stored)) {
      this.theme.set(stored.theme ?? 'system');
      this.fontSize.set(stored.fontSize ?? 'medium');
      return;
    }
    // Versions before 2.1 used generic keys. They are read once but left in
    // place: on a shared GitHub Pages origin another project may use them too.
    const legacyTheme = this.storage.read(LEGACY_STORAGE_KEYS.THEME);
    if (legacyTheme === 'light' || legacyTheme === 'dark') this.theme.set(legacyTheme);
    const legacySize = this.storage.read(LEGACY_STORAGE_KEYS.FONT_SIZE);
    if (typeof legacySize === 'number' && LEGACY_FONT_SIZES[legacySize]) {
      this.fontSize.set(LEGACY_FONT_SIZES[legacySize]);
    }
  }

  private apply(dark: boolean, size: FontSize): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
    root.style.fontSize = size === 'medium' ? '' : FONT_SIZE_SCALE[size];
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
  }

  private persist(theme: ThemeChoice, fontSize: FontSize): void {
    const settings: StoredSettings = {
      ...(theme === 'system' ? {} : { theme }),
      ...(fontSize === 'medium' ? {} : { fontSize }),
    };
    this.storage.write(STORAGE_KEYS.SETTINGS, settings);
  }
}

function isStoredSettings(value: unknown): value is StoredSettings {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const { theme, fontSize } = value as Record<string, unknown>;
  return (
    (theme === undefined || theme === 'light' || theme === 'dark') &&
    (fontSize === undefined || (typeof fontSize === 'string' && fontSize in FONT_SIZE_SCALE))
  );
}
