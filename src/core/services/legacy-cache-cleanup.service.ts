import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { LEGACY_CACHE_PREFIX } from '../constants/app.constants';

/**
 * Versions before 2.1 shipped a hand-written service worker at the same URL
 * as Angular's (`ngsw-worker.js`); the browser replaces it on its own. Its
 * caches are left behind, though, and keep old files on the device: this
 * removes them.
 *
 * Service worker registrations are deliberately not touched: GitHub Pages
 * serves every project of the account from one origin, so a registration
 * that is not ours belongs to a sibling project.
 */
@Injectable({ providedIn: 'root' })
export class LegacyCacheCleanupService {
  private readonly document = inject(DOCUMENT);

  public async run(): Promise<void> {
    try {
      const cacheStorage = this.document.defaultView?.caches;
      if (!cacheStorage) return;
      const names = await cacheStorage.keys();
      await Promise.all(
        names.filter(n => n.startsWith(LEGACY_CACHE_PREFIX)).map(n => cacheStorage.delete(n))
      );
    } catch {
      // Cache Storage unavailable (private mode, insecure origin): nothing to clean.
    }
  }
}
