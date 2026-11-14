/**
 * @fileoverview Scroll-to-top button, the same as JudoKan's
 * Floating button that appears once the page has scrolled away from the top
 * @module shared/ui/scroll-to-top
 */

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

/** How far down the page has to be before the button shows up. */
export const SCROLL_TOP_THRESHOLD_PX = 320;

@Component({
  selector: 'app-scroll-to-top',
  imports: [TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:scroll)': 'onScroll()' },
  // z-30, the header's layer: under the mobile drawer and its backdrop (z-40/50)
  // and under the toasts, which can stack in the same corner.
  template: `
    @if (visible()) {
      <button
        type="button"
        class="scroll-top-btn no-print bg-primary-600 hover:bg-primary-700 dark:bg-accent-400 dark:text-primary-900 dark:hover:bg-accent-300 fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-white shadow-lg sm:right-6 sm:bottom-6"
        (click)="scrollToTop()"
        aria-label="Voltar ao topo"
        appTooltip="Voltar ao topo"
        tooltipPosition="left"
      >
        <span class="material-symbols-rounded text-xl" aria-hidden="true">arrow_upward</span>
      </button>
    }
  `,
})
export class ScrollToTopComponent {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;

  public readonly visible = signal(this.scrolledPastThreshold());

  protected onScroll(): void {
    this.visible.set(this.scrolledPastThreshold());
  }

  public scrollToTop(): void {
    const reduceMotion = this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.window?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    // The button disappears at the top: keyboard and screen-reader users carry
    // on from the start of the page instead of from nowhere.
    this.document.getElementById('main-content')?.focus({ preventScroll: true });
  }

  private scrolledPastThreshold(): boolean {
    return (this.window?.scrollY ?? 0) > SCROLL_TOP_THRESHOLD_PX;
  }
}
