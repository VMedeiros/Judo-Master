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
