import { DOCUMENT } from '@angular/common';
import { ErrorHandler, Injectable, inject } from '@angular/core';

import { ToastService } from '../toast.service';

/** How long to stay quiet after reporting, so an error loop cannot flood the screen. */
const QUIET_PERIOD_MS = 5000;

/**
 * What browsers say when a lazily loaded part of the app is gone: the page was
 * opened before a new version was published.
 */
const STALE_CHUNK =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i;

/** Set while reloading for a new version, so a broken deploy cannot loop. */
const RELOAD_FLAG = 'judo-master:stale-chunk-reload';

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
