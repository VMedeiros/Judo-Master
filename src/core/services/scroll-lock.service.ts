import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Freezes the page behind dialogs. Reference counted, so nested dialogs
 * release the lock only when the last one closes.
 */
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private readonly document = inject(DOCUMENT);
  private locks = 0;
  private savedScrollY = 0;

  /** Locks scrolling; call the returned function to release (extra calls are ignored). */
  public lock(): () => void {
    if (this.locks++ === 0) this.apply();
    let released = false;
    return () => {
      if (released) return;
      released = true;
      if (--this.locks === 0) this.restore();
    };
  }

  private apply(): void {
    const root = this.document.documentElement;
    const view = this.document.defaultView;
    // Keep the layout from shifting when the scrollbar disappears.
    const scrollbar = (view?.innerWidth ?? 0) - root.clientWidth;
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    root.classList.add('scroll-locked');

    // iOS Safari keeps scrolling the body under `overflow: hidden`; pinning
    // it in place is the only reliable lock there.
    if (this.isIOS()) {
      this.savedScrollY = view?.scrollY ?? 0;
      const body = this.document.body;
      body.style.position = 'fixed';
      body.style.top = `-${this.savedScrollY}px`;
      body.style.width = '100%';
    }
  }

  private restore(): void {
    const root = this.document.documentElement;
    root.classList.remove('scroll-locked');
    root.style.paddingRight = '';

    const body = this.document.body;
    if (body.style.position === 'fixed') {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      this.document.defaultView?.scrollTo({ top: this.savedScrollY, behavior: 'instant' });
    }
  }

  private isIOS(): boolean {
    const nav = this.document.defaultView?.navigator;
    if (!nav) return false;
    return (
      /iP(hone|ad|od)/.test(nav.userAgent) ||
      (nav.userAgent.includes('Mac') && nav.maxTouchPoints > 1)
    );
  }
}
