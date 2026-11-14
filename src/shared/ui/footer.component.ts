/**
 * @fileoverview App footer
 * The same footer as JudoKan's (src/shared/ui/footer.component.ts there):
 * brand, copyright and version on one side, links and credits on the other.
 * @module shared/ui/footer
 */

import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { APP_NAME, AUTHOR, JUDOKAN_URL } from '../../core/constants/app.constants';
import { SettingsService } from '../../core/settings.service';
import { APP_VERSION } from '../../environments/version';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Same surface as the header; the inner row matches <main>'s width and
         padding, so the footer lines up with the page content above it. -->
    <footer
      class="dark:bg-canvas-dark/95 border-t border-gray-200 bg-white/95 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] dark:border-gray-800"
    >
      <div
        class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-3 text-sm text-gray-600 sm:px-4 lg:flex-row lg:px-8 dark:text-gray-400"
      >
        <div class="flex flex-wrap items-center justify-center gap-2">
          <img
            [src]="
              settings.isDarkMode()
                ? 'assets/icons/icon-app-dark.svg'
                : 'assets/icons/icon-app-light.svg'
            "
            class="h-7 w-7 rounded-lg"
            alt=""
            width="28"
            height="28"
          />
          <p>&copy; {{ currentYear }} {{ appName }}. Todos os direitos reservados.</p>
          <span
            class="badge rounded-full bg-gray-100 font-bold tracking-wide text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            v{{ version }}
          </span>
        </div>
        <nav aria-label="Links do rodapé">
          <ul class="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <li>
              <button
                type="button"
                class="hover:text-primary-600 dark:hover:text-accent-300 inline-flex min-h-6 cursor-pointer items-center underline-offset-2 hover:underline"
                aria-haspopup="dialog"
                (click)="openAbout.emit()"
              >
                Sobre o Judô
              </button>
            </li>
            <li>
              <a
                [href]="judokanUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-primary-600 dark:hover:text-accent-300 inline-flex min-h-6 items-center underline-offset-2 hover:underline"
              >
                JudoKan
                <span class="sr-only">(abre em nova aba)</span>
              </a>
            </li>
            <li>
              Desenvolvido por
              <a
                [href]="author.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-gray-900 underline-offset-2 hover:underline dark:text-white"
              >
                {{ author.name }}
                <span class="sr-only">(abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  public readonly settings = inject(SettingsService);
  public readonly openAbout = output<void>();

  public readonly appName = APP_NAME;
  public readonly version = APP_VERSION;
  public readonly author = AUTHOR;
  /** The dojo management system this app is the companion of. */
  public readonly judokanUrl = JUDOKAN_URL;
  public readonly currentYear = new Date().getFullYear();
}
