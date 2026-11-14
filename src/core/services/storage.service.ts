import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * localStorage that never throws. Storage can be missing (private mode in
 * some browsers), full, or hold corrupt JSON; callers get `null` or `false`
 * and decide what to do, and they validate the shape of what they read.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage: Storage | null = this.resolveStorage();

  /** The parsed value, or null when absent, unreadable or not JSON. */
  public read(key: string): unknown {
    try {
      const raw = this.storage?.getItem(key) ?? null;
      return raw === null ? null : (JSON.parse(raw) as unknown);
    } catch {
      return null;
    }
  }

  /** Returns false when the value could not be stored. */
  public write(key: string, value: unknown): boolean {
    if (!this.storage) return false;
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  public remove(...keys: string[]): void {
    for (const key of keys) {
      try {
        this.storage?.removeItem(key);
      } catch {
        // Unavailable: nothing to remove.
      }
    }
  }

  private resolveStorage(): Storage | null {
    try {
      return inject(DOCUMENT).defaultView?.localStorage ?? null;
    } catch {
      // Accessing localStorage throws when the browser blocks site data.
      return null;
    }
  }
}
