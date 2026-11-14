import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';

import { ToastAction, ToastService, ToastType } from '../../core/toast.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
  private readonly region = viewChild.required<ElementRef<HTMLElement>>('region');

  protected readonly classes: Readonly<Record<ToastType, string>> = {
    success:
      'bg-green-50 text-green-900 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
    error:
      'bg-red-50 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
    info: 'bg-sky-50 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800',
  };

  protected readonly icons: Readonly<Record<ToastType, string>> = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  constructor() {
    // Re-enter the top layer on every change, so toasts stay above any modal
    // dialog opened in the meantime (a modal makes everything else inert).
    effect(() => {
      const hasToasts = this.toastService.toasts().length > 0;
      const el = this.region().nativeElement;
      if (typeof el.showPopover !== 'function') return;
      if (el.matches(':popover-open')) el.hidePopover();
      if (hasToasts) el.showPopover();
    });
  }

  protected runAction(id: number, action: ToastAction): void {
    this.toastService.dismiss(id);
    action.run();
  }
}
