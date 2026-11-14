/**
 * @fileoverview The frame of the home page, as JudoKan's public pages
 * The backdrop, the header with the brand, the section links, the display
 * options and the way into the app, then the page, the footer and the way back
 * to the top.
 * @module shared/ui/public-shell
 */

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_NAME } from '../../core/constants/app.constants';
import { SettingsService } from '../../core/settings.service';
import { goToSection } from '../utils/in-page';
import { AboutModalComponent } from './about-modal.component';
import { FooterComponent } from './footer.component';
import { PreferencesMenuComponent } from './preferences-menu.component';
import { ScrollToTopComponent } from './scroll-to-top.component';

/** A header link to a section of the page, by element id. */
export interface PublicNavItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-public-shell',
  imports: [
    RouterLink,
    FooterComponent,
    PreferencesMenuComponent,
    ScrollToTopComponent,
    AboutModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative flex min-h-dvh flex-col' },
  template: `
    <!-- JudoKan's backdrop: the dojo on desktop, a flat surface on phones. -->
    <div
      class="app-backdrop pointer-events-none fixed inset-0 -z-10 hidden md:block"
      aria-hidden="true"
    ></div>
    <div
      class="dark:bg-canvas-dark md:dark:bg-canvas-dark/92 pointer-events-none fixed inset-0 -z-10 bg-gray-50 md:bg-gray-50/95"
      aria-hidden="true"
    ></div>

    <header
      class="pt-safe dark:bg-canvas-dark/95 sticky top-0 z-30 border-b border-gray-200 bg-white/95 dark:border-gray-800"
    >
      <div class="flex h-16 items-center justify-between gap-3 px-3 sm:px-4 lg:px-8">
        <div class="flex min-w-0 items-center gap-2">
          <a
            routerLink="/"
            class="flex min-h-11 min-w-0 items-center gap-3 rounded-xl"
            [attr.aria-label]="appName + ' Técnicas por faixa, página inicial'"
          >
            <img
              [src]="
                settings.isDarkMode()
                  ? 'assets/icons/icon-app-dark.svg'
                  : 'assets/icons/icon-app-light.svg'
              "
              class="h-10 w-10 rounded-xl"
              alt=""
              width="40"
              height="40"
            />
            <!-- The name always shows, as in JudoKan's header; the subtitle from sm up. -->
            <span class="block min-w-0" aria-hidden="true">
              <span
                class="block truncate text-lg leading-tight font-bold text-gray-900 dark:text-white"
                >{{ appName }}</span
              >
              <span
                class="text-accent-700 dark:text-accent-300 hidden text-[11px] font-bold tracking-widest uppercase sm:block"
              >
                Técnicas por faixa
              </span>
            </span>
          </a>

          @if (nav().length > 0) {
            <nav class="ml-4 hidden lg:block" aria-label="Seções da página">
              <ul class="flex items-center gap-1">
                @for (item of nav(); track item.id) {
                  <li>
                    <a
                      [href]="'#' + item.id"
                      (click)="goTo($event, item.id)"
                      class="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      {{ item.label }}
                    </a>
                  </li>
                }
              </ul>
            </nav>
          }
        </div>

        <!-- The way in, then the settings at the right end, where JudoKan has them. -->
        <div class="flex shrink-0 items-center gap-2">
          <a routerLink="/tecnicas" class="btn btn-primary">Ver técnicas</a>
          <app-preferences-menu />
        </div>
      </div>
    </header>

    <main
      id="main-content"
      tabindex="-1"
      class="mx-auto w-full max-w-7xl flex-1 p-3 outline-none sm:p-4 lg:p-8"
    >
      <ng-content />
    </main>

    <app-footer (openAbout)="aboutOpen.set(true)" />
    <app-scroll-to-top />

    @if (aboutOpen()) {
      <app-about-modal (closed)="aboutOpen.set(false)" />
    }
  `,
})
export class PublicShellComponent {
  private readonly document = inject(DOCUMENT);
  public readonly settings = inject(SettingsService);
  public readonly appName = APP_NAME;

  /** Sections of the page the header links to. */
  public readonly nav = input<readonly PublicNavItem[]>([]);

  protected readonly aboutOpen = signal(false);

  public goTo(event: Event, id: string): void {
    goToSection(this.document, event, id);
  }
}
