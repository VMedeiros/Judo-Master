import { DOCUMENT } from '@angular/common';
import { ErrorHandler, Injectable, inject } from '@angular/core';

import { ToastService } from '../toast.service';
import {
  QUIET_PERIOD_MS,
  RELOAD_FLAG,
  STALE_CHUNK,
} from '../constants/global-error-handler.constants';

/** Last line of defence: tells the user something went wrong instead of failing silently. */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);
  private readonly document = inject(DOCUMENT);
  private lastReported = 0;

  public handleError(error: unknown): void {
    if (this.reloadForNewVersion(error)) return;
    console.error(error);
    const now = Date.now();
    if (now - this.lastReported < QUIET_PERIOD_MS) return;
    this.lastReported = now;
    this.toast.error('Algo deu errado. Se o problema continuar, recarregue a página.');
  }

  /** A stale page loads the new version once, instead of showing an error. */
  private reloadForNewVersion(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    const view = this.document.defaultView;
    if (!view || !STALE_CHUNK.test(message)) return false;
    try {
      if (view.sessionStorage.getItem(RELOAD_FLAG)) return false;
      view.sessionStorage.setItem(RELOAD_FLAG, '1');
    } catch {
      return false;
    }
    view.location.reload();
    return true;
  }
}
