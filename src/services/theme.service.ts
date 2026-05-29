import { Injectable, effect, inject, signal } from '@angular/core';

import { DEFAULT_FONT_SIZE, FONT_OPTIONS, FontOption } from '../constants/app.constants';
import { STORAGE_KEYS } from '../constants/storage-keys.constants';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly storage = inject(StorageService);
    public readonly fontOptions: ReadonlyArray<FontOption> = FONT_OPTIONS;
    public readonly isDarkMode = signal(false);
    public readonly selectedFont = signal<FontOption>(FONT_OPTIONS[0]);
    public readonly fontSize = signal<number>(DEFAULT_FONT_SIZE);

    constructor() {
        this.restoreFromStorage();
        effect(() => { this.applyTheme(); });
    }

    public toggleTheme(): void {
        this.isDarkMode.update(v => !v);
    }

    public changeFontSize(size: string): void {
        const parsed = Number(size);
        if (!Number.isNaN(parsed) && parsed > 0) {
            this.fontSize.set(parsed);
        }
    }

    public changeFont(fontClass: string): void {
        const font = this.fontOptions.find(f => f.class === fontClass);
        if (font) this.selectedFont.set(font);
    }

    private restoreFromStorage(): void {
        const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
        const storedTheme = this.storage.get<string | null>(STORAGE_KEYS.THEME, null);
        const isDark = storedTheme === null ? prefersDark : storedTheme === 'dark';
        this.isDarkMode.set(isDark);
        // Apply synchronously to prevent FOUC
        document.documentElement.classList.toggle('dark', isDark);

        const storedFont = this.storage.get<string | null>(STORAGE_KEYS.FONT_FAMILY, null);
        if (storedFont) {
            const font = this.fontOptions.find(f => f.class === storedFont);
            if (font) this.selectedFont.set(font);
        }

        const storedSize = this.storage.get<number | null>(STORAGE_KEYS.FONT_SIZE, null);
        if (storedSize !== null && storedSize > 0) this.fontSize.set(storedSize);
    }

    private applyTheme(): void {
        const root = document.documentElement;
        const dark = this.isDarkMode();
        root.classList.toggle('dark', dark);
        this.storage.set(STORAGE_KEYS.THEME, dark ? 'dark' : 'light');

        const size = this.fontSize();
        root.style.fontSize = `${size}px`;
        this.storage.set(STORAGE_KEYS.FONT_SIZE, size);

        const font = this.selectedFont();
        this.fontOptions.forEach(f => root.classList.remove(f.class));
        root.classList.add(font.class);
        this.storage.set(STORAGE_KEYS.FONT_FAMILY, font.class);
    }
}