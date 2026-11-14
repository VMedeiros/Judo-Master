import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { ScrollLockService } from '../../core/services/scroll-lock.service';

let nextId = 0;

/**
 * Modal dialog on the native `<dialog>` element. Rendering the component
 * opens it; removing it closes it:
 *
 *   @if (isOpen()) {
 *     <app-modal title="..." (closed)="isOpen.set(false)">
 *       ...body...
 *       <ng-container modalFooter>...buttons...</ng-container>
 *     </app-modal>
 *   }
 *
 * `showModal()` puts the dialog in the top layer and makes the rest of the
 * page inert, so focus stays inside and Escape closes it. The page behind is
 * scroll-locked, and focus returns to whatever opened the dialog.
 */
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="app-modal"
      [class]="'app-modal--' + size()"
      [attr.role]="alert() ? 'alertdialog' : null"
      [attr.aria-labelledby]="titleId"
      [attr.aria-describedby]="subtitle() ? subtitleId : null"
      (cancel)="onCancel($event)"
    >
      <div class="app-modal__panel">
        <header class="app-modal__header">
          <div class="flex min-w-0 items-start gap-3">
            <ng-content select="[modalIcon]" />
            <div class="min-w-0">
              <h2 #heading [id]="titleId" class="app-modal__title" tabindex="-1">{{ title() }}</h2>
              @if (subtitle()) {
                <p [id]="subtitleId" class="app-modal__subtitle">{{ subtitle() }}</p>
              }
            </div>
          </div>
          <button
            type="button"
            class="icon-btn -mt-1.5 -mr-2"
            [attr.aria-label]="'Fechar ' + title()"
            title="Fechar"
            (click)="requestClose()"
          >
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </header>
        <!-- Focusable so keyboard users can scroll a body that has no fields. -->
        <div class="app-modal__body" tabindex="0">
          <ng-content />
        </div>
        <footer class="app-modal__footer"><ng-content select="[modalFooter]" /></footer>
      </div>
    </dialog>
  `,
})
export class ModalComponent implements OnDestroy {
  public readonly title = input.required<string>();
  public readonly subtitle = input('');
  /** `popover` is a card anchored under the header's settings button. */
  public readonly size = input<'sm' | 'md' | 'lg' | 'xl' | 'popover'>('md');
  /** Announced as an alert dialog: for confirmations of destructive actions. */
  public readonly alert = input(false);
  /** Emitted when the user asks to close: Escape, backdrop click or the close button. */
  public readonly closed = output<void>();

  protected readonly titleId = `app-modal-title-${nextId}`;
  protected readonly subtitleId = `app-modal-subtitle-${nextId++}`;

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly heading = viewChild.required<ElementRef<HTMLElement>>('heading');
  private readonly releaseScroll = inject(ScrollLockService).lock();
  /** What had focus when the dialog opened: focus goes back there on close. */
  private opener: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => this.open());
  }

  public ngOnDestroy(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
    this.releaseScroll();
    // Browsers do not restore focus when the dialog is removed from the DOM.
    if (this.opener?.isConnected) this.opener.focus();
  }

  public requestClose(): void {
    this.closed.emit();
  }

  protected onCancel(event: Event): void {
    // Stay open until the owner removes the dialog from the template.
    event.preventDefault();
    this.requestClose();
  }

  private open(): void {
    const dialog = this.dialog().nativeElement;
    const active = dialog.ownerDocument.activeElement;
    this.opener = active instanceof HTMLElement ? active : null;
    // The dialog fills the viewport; a click on it (not on its panel) is the
    // backdrop. A pointer-only shortcut: Escape and the close button do the same.
    dialog.addEventListener('click', event => {
      if (event.target === dialog) this.requestClose();
    });
    if (!dialog.open) dialog.showModal();
    this.focusInitial(dialog);
  }

  /**
   * Focus an element marked `data-autofocus`, else the first field — except
   * on touch screens, where that would pop the keyboard over the dialog before
   * it is read; there the title takes focus instead.
   */
  private focusInitial(dialog: HTMLDialogElement): void {
    const marked = dialog.querySelector<HTMLElement>('[data-autofocus]');
    const touch = globalThis.matchMedia?.('(pointer: coarse)').matches ?? false;
    const field = touch
      ? null
      : dialog.querySelector<HTMLElement>(
          '.app-modal__body :is(input, select, textarea):not([disabled])'
        );
    (marked ?? field ?? this.heading().nativeElement).focus();
  }
}
