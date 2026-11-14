import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ModalComponent } from './modal.component';

/** Asks before a destructive action. The safe choice has focus. */
@Component({
  selector: 'app-confirm-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [title]="title()" size="sm" [alert]="true" (closed)="closed.emit()">
      <span
        modalIcon
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40"
        aria-hidden="true"
      >
        <span class="material-symbols-rounded text-red-600 dark:text-red-300">warning</span>
      </span>
      <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <ng-content />
      </p>
      <ng-container modalFooter>
        <button type="button" class="btn btn-secondary" data-autofocus (click)="closed.emit()">
          Cancelar
        </button>
        <button type="button" class="btn btn-danger" (click)="confirmed.emit()">
          <span class="material-symbols-rounded" aria-hidden="true">{{ icon() }}</span>
          {{ confirmLabel() }}
        </button>
      </ng-container>
    </app-modal>
  `,
})
export class ConfirmModalComponent {
  public readonly title = input.required<string>();
  public readonly confirmLabel = input.required<string>();
  public readonly icon = input('delete');
  public readonly closed = output<void>();
  public readonly confirmed = output<void>();
}
