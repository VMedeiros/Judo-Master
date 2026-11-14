import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import {
  FONT_SIZE_SCALE,
  FontSize,
  LEGACY_STORAGE_KEYS,
  STORAGE_KEYS,
  THEME_COLORS,
} from './constants/app.constants';
import { StorageService } from './services/storage.service';

export type ThemeChoice = 'light' | 'dark';

interface StoredSettings {
  readonly theme?: ThemeChoice;
  readonly fontSize?: FontSize;
  readonly highContrast?: boolean;
}

const LEGACY_FONT_SIZES: Readonly<Record<number, FontSize>> = {
  14: 'small',
  16: 'medium',
  18: 'large',
};

/**
 * Theme, contrast and text size, as in JudoKan: light until someone picks
 * dark, whatever the system says. src/assets/theme-init.js applies the same
 * settings before Angular boots, so the page never flashes the wrong theme;
 * keep the two in sync.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = inject(StorageService);
  private readonly document = inject(DOCUMENT);

  public readonly theme = signal<ThemeChoice>('light');
  public readonly fontSize = signal<FontSize>('medium');
  /** Stronger text and borders, opaque surfaces, a thicker focus ring. */
  public readonly highContrast = signal(false);
  public readonly isDarkMode = computed(() => this.theme() === 'dark');

  constructor() {
    this.restore();
    effect(() => this.apply(this.isDarkMode(), this.fontSize(), this.highContrast()));
    effect(() => this.persist(this.theme(), this.fontSize(), this.highContrast()));
  }

  public setTheme(theme: ThemeChoice): void {
    this.theme.set(theme);
  }

  public toggleTheme(): void {
    this.theme.set(this.isDarkMode() ? 'light' : 'dark');
  }

  public setFontSize(size: FontSize): void {
    this.fontSize.set(size);
  }

  public setHighContrast(highContrast: boolean): void {
    this.highContrast.set(highContrast);
  }

  private restore(): void {
    const stored = this.storage.read(STORAGE_KEYS.SETTINGS);
    if (isStoredSettings(stored)) {
      this.theme.set(stored.theme ?? 'light');
      this.fontSize.set(stored.fontSize ?? 'medium');
      this.highContrast.set(stored.highContrast === true);
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

  private apply(dark: boolean, size: FontSize, highContrast: boolean): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark', dark);
    root.classList.toggle('high-contrast', highContrast);
    root.style.colorScheme = dark ? 'dark' : 'light';
    root.style.fontSize = size === 'medium' ? '' : FONT_SIZE_SCALE[size];
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
  }

  /** Only what differs from the defaults is saved. */
  private persist(theme: ThemeChoice, fontSize: FontSize, highContrast: boolean): void {
    const settings: StoredSettings = {
      ...(theme === 'light' ? {} : { theme }),
      ...(fontSize === 'medium' ? {} : { fontSize }),
      ...(highContrast ? { highContrast } : {}),
    };
    this.storage.write(STORAGE_KEYS.SETTINGS, settings);
  }
}

function isStoredSettings(value: unknown): value is StoredSettings {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const { theme, fontSize, highContrast } = value as Record<string, unknown>;
  return (
    (theme === undefined || theme === 'light' || theme === 'dark') &&
    (fontSize === undefined || (typeof fontSize === 'string' && fontSize in FONT_SIZE_SCALE)) &&
    (highContrast === undefined || typeof highContrast === 'boolean')
  );
}
