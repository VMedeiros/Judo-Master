import { Injectable, OnDestroy, signal } from '@angular/core';

import { TOAST_DURATION_MS, TOAST_ERROR_DURATION_MS } from './constants/app.constants';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  readonly label: string;
  readonly run: () => void;
}

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly type: ToastType;
  readonly action?: ToastAction;
}

export interface ToastOptions {
  readonly action?: ToastAction;
  /** Stays until dismissed: for messages that ask the user to act. */
  readonly sticky?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService implements OnDestroy {
  public readonly toasts = signal<readonly Toast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  public success(message: string): void {
    this.show(message, 'success');
  }

  public error(message: string): void {
    this.show(message, 'error');
  }

  public info(message: string, options: ToastOptions = {}): void {
    this.show(message, 'info', options);
  }

  public show(message: string, type: ToastType = 'info', options: ToastOptions = {}): void {
    const id = this.nextId++;
    const toast: Toast = options.action
      ? { id, message, type, action: options.action }
      : { id, message, type };
    this.toasts.update(list => [...list, toast]);
    if (options.sticky) return;
    // Problems stay on screen longer: they need to be read, not just noticed.
    const duration = type === 'error' ? TOAST_ERROR_DURATION_MS : TOAST_DURATION_MS;
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), duration)
    );
  }

  public dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts.update(list => list.filter(toast => toast.id !== id));
  }

  public ngOnDestroy(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}
