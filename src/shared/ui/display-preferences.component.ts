/**
 * @fileoverview Display preferences
 * Theme and contrast, and text size: the same controls, in the same layout,
 * as JudoKan's (src/shared/ui/display-preferences.component.ts there). Judô
 * Master is in Portuguese only, so it has no language row.
 * @module shared/ui/display-preferences
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FONT_SIZE_OPTIONS } from '../../core/constants/app.constants';
import { SettingsService } from '../../core/settings.service';
import { TooltipDirective } from './tooltip.directive';

let nextId = 0;

@Component({
  selector: 'app-display-preferences',
  imports: [TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-6' },
  template: `
    <!-- Theme, and contrast beside it -->
    <div>
      <p
        [id]="id + '-theme'"
        class="text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400"
      >
        Tema
      </p>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <div
          class="flex min-w-32 flex-1 items-center rounded-full border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-900"
          role="group"
          [attr.aria-labelledby]="id + '-theme'"
        >
          @for (option of themes; track option.dark) {
            @let active = settings.isDarkMode() === option.dark;
            <button
              type="button"
              class="flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-full transition-colors"
              [class]="
                active
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              "
              [attr.aria-pressed]="active"
              [attr.aria-label]="option.label"
              [appTooltip]="option.label"
              (click)="settings.setTheme(option.dark ? 'dark' : 'light')"
            >
              <span class="material-symbols-rounded" aria-hidden="true">{{ option.icon }}</span>
            </button>
          }
        </div>
        <label
          class="flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 select-none dark:text-gray-300"
        >
          <input
            type="checkbox"
            class="accent-accent-600 h-4 w-4"
            [checked]="settings.highContrast()"
            (change)="settings.setHighContrast($any($event.target).checked)"
          />
          Alto contraste
        </label>
      </div>
    </div>

    <!-- Text size -->
    <div>
      <p
        [id]="id + '-font'"
        class="text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400"
      >
        Tamanho da fonte
      </p>
      <div
        class="mt-2 flex w-fit items-center rounded-full border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-900"
        role="group"
        [attr.aria-labelledby]="id + '-font'"
      >
        @for (option of fontSizes; track option.value) {
          @let active = settings.fontSize() === option.value;
          <button
            type="button"
            class="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-colors"
            [class]="
              active
                ? 'bg-primary-600 dark:bg-accent-400 dark:text-primary-900 text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            "
            [attr.aria-pressed]="active"
            [attr.aria-label]="'Fonte ' + option.label.toLowerCase()"
            [appTooltip]="'Fonte ' + option.label.toLowerCase()"
            (click)="settings.setFontSize(option.value)"
          >
            {{ option.short }}
          </button>
        }
      </div>
    </div>
  `,
})
export class DisplayPreferencesComponent {
  public readonly settings = inject(SettingsService);

  /** Prefix of this instance's ids, so two of them never clash. */
  public readonly id = `display-prefs-${nextId++}`;

  public readonly themes: ReadonlyArray<{ dark: boolean; icon: string; label: string }> = [
    { dark: false, icon: 'light_mode', label: 'Claro' },
    { dark: true, icon: 'dark_mode', label: 'Escuro' },
  ];

  public readonly fontSizes = FONT_SIZE_OPTIONS;
}
