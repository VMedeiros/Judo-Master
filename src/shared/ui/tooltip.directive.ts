import { Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';

let nextId = 0;
const GAP = 8;
/** How long a finger must rest on the control before its hint appears. */
const LONG_PRESS_MS = 500;
/** How long a hint opened by touch stays up after the finger lifts. */
const TOUCH_LINGER_MS = 1500;

/**
 * The same tooltip as JudoKan's (src/shared/ui/tooltip.directive.ts there).
 *
 * Text hint shown on hover (pointer devices), on keyboard focus and on a long
 * press (touch). Rendered in the top layer via the Popover API so it is never
 * clipped and stays above modal dialogs. A plain tap shows nothing: a hint
 * popping up then would cover the control being used.
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'onHover()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'onFocus()',
    '(focusout)': 'hide()',
    '(keydown.escape)': 'hide()',
    '(click)': 'hide()',
    '(touchstart)': 'onTouchStart()',
    '(touchmove)': 'cancelLongPress()',
    '(touchcancel)': 'cancelLongPress()',
    '(touchend)': 'onTouchEnd($event)',
  },
})
export class TooltipDirective implements OnDestroy {
  public readonly text = input('', { alias: 'appTooltip' });
  public readonly tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly id = `app-tooltip-${nextId++}`;
  private tooltipEl: HTMLElement | null = null;
  private pressTimer: ReturnType<typeof setTimeout> | null = null;
  private lingerTimer: ReturnType<typeof setTimeout> | null = null;
  private openedByTouch = false;

  public ngOnDestroy(): void {
    this.cancelLongPress();
    this.hide();
  }

  protected onTouchStart(): void {
    this.cancelLongPress();
    this.pressTimer = setTimeout(() => {
      this.pressTimer = null;
      this.show();
      this.openedByTouch = this.tooltipEl !== null;
    }, LONG_PRESS_MS);
  }

  protected cancelLongPress(): void {
    if (this.pressTimer) clearTimeout(this.pressTimer);
    this.pressTimer = null;
  }

  protected onTouchEnd(event: Event): void {
    this.cancelLongPress();
    if (!this.openedByTouch) return;
    // The press asked what the control does, not to run it: swallow the click.
    if (event.cancelable) event.preventDefault();
    this.openedByTouch = false;
    this.lingerTimer = setTimeout(() => this.hide(), TOUCH_LINGER_MS);
  }

  protected onHover(): void {
    if (globalThis.matchMedia?.('(hover: hover)').matches ?? true) this.show();
  }

  protected onFocus(): void {
    // Only for keyboard focus; a mouse or touch press already has its own feedback.
    if (this.host.matches(':focus-visible')) this.show();
  }

  protected hide(): void {
    if (this.lingerTimer) clearTimeout(this.lingerTimer);
    this.lingerTimer = null;
    this.openedByTouch = false;
    if (!this.tooltipEl) return;
    this.tooltipEl.remove();
    this.tooltipEl = null;
    this.host.removeAttribute('aria-describedby');
  }

  private show(): void {
    const text = this.text();
    if (!text || this.tooltipEl) return;

    const tip = document.createElement('div');
    tip.id = this.id;
    tip.className = 'app-tooltip';
    tip.textContent = text;
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('popover', 'manual');
    // Inside the dialog that contains the host, when there is one, so it is not made inert.
    (this.host.closest('dialog') ?? document.body).appendChild(tip);
    if (typeof tip.showPopover === 'function') tip.showPopover();
    this.tooltipEl = tip;
    // Skip when the control's name already says it ("Edit" on "Edit: Ana").
    if (!(this.host.getAttribute('aria-label') ?? '').includes(text)) {
      this.host.setAttribute('aria-describedby', this.id);
    }

    const { top, left } = this.place(
      this.host.getBoundingClientRect(),
      tip.getBoundingClientRect()
    );
    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
  }

  /** Viewport coordinates for the tip, kept inside the screen edges. */
  private place(host: DOMRect, tip: DOMRect): { top: number; left: number } {
    let top = host.top + (host.height - tip.height) / 2;
    let left = host.left + (host.width - tip.width) / 2;
    switch (this.tooltipPosition()) {
      case 'top':
        top = host.top - tip.height - GAP;
        // No room above (a control at the top of the screen): go below instead.
        if (top < GAP) top = host.bottom + GAP;
        break;
      case 'bottom':
        top = host.bottom + GAP;
        if (top + tip.height > window.innerHeight - GAP) top = host.top - tip.height - GAP;
        break;
      case 'left':
        left = host.left - tip.width - GAP;
        break;
      case 'right':
        left = host.right + GAP;
        break;
    }
    const maxLeft = Math.max(GAP, window.innerWidth - tip.width - GAP);
    const maxTop = Math.max(GAP, window.innerHeight - tip.height - GAP);
    return {
      top: Math.min(Math.max(GAP, top), maxTop),
      left: Math.min(Math.max(GAP, left), maxLeft),
    };
  }
}
