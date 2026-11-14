/**
 * @fileoverview Display options menu for the public pages, as JudoKan's
 * A gear button that opens the display preferences (theme, contrast and text
 * size) on the home page.
 * @module shared/ui/preferences-menu
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { DisplayPreferencesComponent } from './display-preferences.component';
import { TooltipDirective } from './tooltip.directive';

let nextId = 0;

/**
 * A disclosure: the button says whether the panel is open; Escape and a click
 * outside close it, and Escape hands focus back to the button. Focus moves into
 * the panel when it opens; leaving it with Tab closes it.
 */
@Component({
  selector: 'app-preferences-menu',
  imports: [TooltipDirective, DisplayPreferencesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative block',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'closeAndReturnFocus()',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    <button
      #trigger
      type="button"
      class="header-btn"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-controls]="panelId"
      aria-label="Opções de exibição"
      appTooltip="Opções de exibição"
      tooltipPosition="bottom"
      (click)="toggle()"
    >
      <span class="material-symbols-rounded" aria-hidden="true">settings</span>
    </button>

    @if (isOpen()) {
      <section
        [id]="panelId"
        class="absolute top-full right-0 z-50 mt-2 max-h-[calc(100dvh-6rem)] w-80 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-2xl dark:border-gray-800 dark:bg-surface-dark"
        aria-label="Opções de exibição"
      >
        <app-display-preferences />
      </section>
    }
  `,
})
export class PreferencesMenuComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  public readonly isOpen = signal(false);
  public readonly panelId = `preferences-menu-${nextId++}`;

  public toggle(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      return;
    }
    this.isOpen.set(true);
    // The panel exists once this change is rendered: then focus its first control.
    afterNextRender(
      () =>
        this.host
          .querySelector<HTMLElement>(`#${this.panelId} button, #${this.panelId} input`)
          ?.focus(),
      { injector: this.injector }
    );
  }

  public closeAndReturnFocus(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.host.querySelector<HTMLButtonElement>('button')?.focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.host.contains(event.target as Node)) this.isOpen.set(false);
  }

  /** Tabbing out of the menu closes it, so it never hangs open over the page. */
  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this.isOpen() && next && !this.host.contains(next)) this.isOpen.set(false);
  }
}
