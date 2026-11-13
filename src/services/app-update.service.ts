import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

/** How often an app left open looks for a new version. */
export const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;

/** Coming back to the app checks again, but no more often than this. */
export const UPDATE_CHECK_MIN_GAP_MS = 60 * 1000;

/**
 * A new version that finishes downloading this soon after the app is opened or
 * brought back is switched to right away: the person has barely started, so a
 * reload loses nothing. Later on, the app asks first.
 */
export const AUTO_APPLY_WINDOW_MS = 30 * 1000;

/**
 * Keeps the app looking for new versions. The service worker only looks when
 * the app starts, and an installed app (home-screen PWA, notably on iOS) is
 * mostly resumed rather than started: it could keep an old version for days.
 * So it also looks whenever the app comes back to the foreground, and every
 * half hour while it stays open.
 */
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly updates = inject(SwUpdate);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private lastCheck = 0;
  private arrivedAt = Date.now();
  private started = false;

  public start(): void {
    if (this.started || !this.updates.isEnabled) return;
    this.started = true;

    const view = this.document.defaultView;
    const onArrive = (): void => {
      if (this.document.visibilityState !== 'visible') return;
      this.arrivedAt = Date.now();
      void this.check();
    };
    this.document.addEventListener('visibilitychange', onArrive);
    view?.addEventListener('pageshow', onArrive);
    const timer = view?.setInterval(() => void this.check(), UPDATE_CHECK_INTERVAL_MS);
    this.destroyRef.onDestroy(() => {
      this.document.removeEventListener('visibilitychange', onArrive);
      view?.removeEventListener('pageshow', onArrive);
      if (timer !== undefined) view?.clearInterval(timer);
    });
  }

  /** Whether the app was opened or brought back a moment ago. */
  public justArrived(): boolean {
    return Date.now() - this.arrivedAt <= AUTO_APPLY_WINDOW_MS;
  }

  /** Looks for a new version now, unless it just did. */
  public async check(): Promise<void> {
    const now = Date.now();
    if (!this.updates.isEnabled || now - this.lastCheck < UPDATE_CHECK_MIN_GAP_MS) return;
    this.lastCheck = now;
    try {
      await this.updates.checkForUpdate();
    } catch (error: unknown) {
      // Offline, or the worker is not registered yet: the next check will do.
      console.warn('Could not check for a new version.', error);
    }
  }

  /** Switches to the new version: the page reloads on it. */
  public async apply(): Promise<void> {
    try {
      if (this.updates.isEnabled) await this.updates.activateUpdate();
    } catch (error: unknown) {
      console.warn('Could not activate the new version; reloading anyway.', error);
    }
    this.document.location.reload();
  }
}
