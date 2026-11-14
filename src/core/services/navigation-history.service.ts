/**
 * @fileoverview Where the person came from, inside the app
 * Backs the "Back" buttons: they return to the page that led here, or, when
 * the page was opened directly (a link, a bookmark), to a sensible place.
 * @module core/services/navigation-history
 */

import { Location } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  /**
   * The pages visited in this tab, oldest first, mirroring the browser's
   * history. When the app cannot be sure what lies behind the current page,
   * the list starts again from it: "Back" then takes the fallback instead of
   * guessing.
   */
  private readonly stack = signal<string[]>([]);

  /** The page before this one, inside the app; null when this is the first. */
  public readonly previousUrl = computed(() => {
    const stack = this.stack();
    return stack.length > 1 ? stack[stack.length - 2] : null;
  });

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart || e instanceof NavigationEnd))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          // The browser's Back and Forward have moved through its history already,
          // whatever the router makes of the page (a guard may still redirect).
          if (event.navigationTrigger === 'popstate') this.browserMovedTo(event.url);
          return;
        }
        const extras = this.router.currentNavigation()?.extras;
        if (extras?.skipLocationChange) return;
        this.record((event as NavigationEnd).urlAfterRedirects, extras?.replaceUrl === true);
      });
  }

  /**
   * Goes back to the page that led here, the way the browser's own Back button
   * would (scroll position included). With nowhere to go back to inside the
   * app, it goes to `fallback` instead of leaving the site.
   */
  public back(fallback: string): void {
    if (this.previousUrl() !== null) {
      this.location.back();
    } else {
      void this.router.navigateByUrl(fallback);
    }
  }

  /**
   * Starts the history again from the next page, as when the session ends: the
   * pages behind it belong to a session that is over and must not be offered.
   */
  public forget(): void {
    this.stack.set([]);
  }

  /** Back, when it lands on the page before; anything else (Forward, a jump) is unknown ground. */
  private browserMovedTo(url: string): void {
    this.stack.update(stack => (stack.at(-2) === url ? stack.slice(0, -1) : [url]));
  }

  /** A new page; one that replaced the current entry takes its place. */
  private record(url: string, replaced: boolean): void {
    this.stack.update(stack => {
      if (replaced && stack.length > 0) return [...stack.slice(0, -1), url];
      return stack.at(-1) === url ? stack : [...stack, url];
    });
  }
}
