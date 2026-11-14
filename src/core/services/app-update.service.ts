import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { Subject } from 'rxjs';

import { STORAGE_KEYS } from '../constants/app.constants';
import { APP_VERSION } from '../../environments/version';

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

/** Published next to index.html by every build (scripts/generate-version.mjs). */
export const PUBLISHED_VERSION_URL = 'version.json';

/** Whether version `a` is newer than `b` (both `major.minor.patch`). */
export function isNewerVersion(a: string, b: string): boolean {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (Number.isNaN(x) || Number.isNaN(y)) return false;
    if (x !== y) return x > y;
  }
  return false;
}

/**
 * Keeps the app on the latest version.
 *
 * The service worker only looks for a new version when the app starts, and an
 * installed app (home-screen PWA, notably on iOS) is mostly resumed rather
 * than started. So the app also looks whenever it comes back to the
 * foreground, and every half hour while it stays open.
 *
 * The service worker can also get stuck: after a failed download it keeps
 * serving the version it has and stops updating, without telling anyone. So
 * each check also asks the server which version is out (version.json, never
 * cached). If it is newer and the worker could not deliver it, `stalled`
 * emits, and `recover` drops this app's worker and caches and loads the new
 * version straight from the network.
 */
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly updates = inject(SwUpdate);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  /** Emits the published version when the service worker cannot deliver it. */
  public readonly stalled = new Subject<string>();

  private lastCheck = 0;
  private arrivedAt = Date.now();
  private started = false;
  private versionReady = false;

  public start(): void {
    if (this.started || !this.updates.isEnabled) return;
    this.started = true;
    this.forgetRecoveryQuery();

    this.updates.versionUpdates.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event.type === 'VERSION_READY') this.versionReady = true;
    });

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
    // The app has just been opened.
    onArrive();
  }

  /** Whether the app was opened or brought back a moment ago. */
  public justArrived(): boolean {
    return Date.now() - this.arrivedAt <= AUTO_APPLY_WINDOW_MS;
  }

  /**
   * Looks for a new version now, unless it just did. When the server has a
   * newer one that the service worker could not download, `stalled` emits.
   */
  public async check(): Promise<void> {
    const now = Date.now();
    if (!this.updates.isEnabled || now - this.lastCheck < UPDATE_CHECK_MIN_GAP_MS) return;
    this.lastCheck = now;
    let found = false;
    try {
      // Resolves once the new version, if any, has been downloaded.
      found = await this.updates.checkForUpdate();
    } catch (error: unknown) {
      console.warn('Could not check for a new version.', error);
    }
    if (found || this.versionReady) return;

    const published = await this.publishedVersion();
    if (published && isNewerVersion(published, APP_VERSION) && !this.recoveredTo(published)) {
      this.stalled.next(published);
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

  /**
   * Drops this app's service worker and caches, then loads the published
   * version from the network. Other projects on the same origin are left
   * alone: only the registration and caches under this app's path go.
   */
  public async recover(version: string): Promise<void> {
    const scope = new URL('./', this.document.baseURI);
    try {
      this.document.defaultView?.sessionStorage.setItem(STORAGE_KEYS.UPDATE_RECOVERY, version);
    } catch {
      // Storage unavailable: recovering again later is harmless.
    }
    try {
      const container = this.document.defaultView?.navigator.serviceWorker;
      const registration = await container?.getRegistration(scope.href);
      if (registration?.scope === scope.href) await registration.unregister();
      const cacheStorage = this.document.defaultView?.caches;
      if (cacheStorage) {
        const names = await cacheStorage.keys();
        const ours = names.filter(name => name.startsWith(`ngsw:${scope.pathname}`));
        await Promise.all(ours.map(name => cacheStorage.delete(name)));
      }
    } catch (error: unknown) {
      console.warn('Could not fully reset the service worker.', error);
    }
    // A new URL, so neither the browser nor the CDN can answer with an old page.
    const target = new URL(scope.href);
    target.searchParams.set('v', version);
    this.document.location.replace(target.href);
  }

  /** The version on the server, asked past every cache; null when offline. */
  private async publishedVersion(): Promise<string | null> {
    const view = this.document.defaultView;
    if (!view) return null;
    try {
      const url = new URL(PUBLISHED_VERSION_URL, this.document.baseURI);
      url.searchParams.set('ngsw-bypass', 'true');
      url.searchParams.set('t', String(Date.now()));
      const response = await view.fetch(url.href, { cache: 'no-store' });
      if (!response.ok) return null;
      const body = (await response.json()) as { version?: unknown };
      return typeof body.version === 'string' ? body.version : null;
    } catch {
      return null;
    }
  }

  /** Whether this tab already recovered to that version: never loop. */
  private recoveredTo(version: string): boolean {
    try {
      return (
        this.document.defaultView?.sessionStorage.getItem(STORAGE_KEYS.UPDATE_RECOVERY) === version
      );
    } catch {
      return false;
    }
  }

  /** Removes the `?v=` a recovery added to the address. */
  private forgetRecoveryQuery(): void {
    const view = this.document.defaultView;
    if (!view) return;
    const url = new URL(view.location.href);
    if (!url.searchParams.has('v')) return;
    url.searchParams.delete('v');
    view.history.replaceState(view.history.state, '', url.href);
  }
}
