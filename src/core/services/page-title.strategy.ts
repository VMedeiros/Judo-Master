import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { APP_NAME, SITE_URL } from '../constants/app.constants';

/** Route `data` read for search engines and link previews. */
export interface PageMeta {
  description?: string;
}

/**
 * As JudoKan's TranslatedTitleStrategy: the page's name followed by the app's
 * in the title, and the description, canonical URL and link preview tags kept
 * in step with the route. Judô Master is in Portuguese only, so no translation.
 */
@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  public override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    const title = page ? `${page} · ${APP_NAME}` : APP_NAME;
    const description = deepestData(snapshot.root).description;
    const path = snapshot.url.split(/[?#]/)[0]!.replace(/^\//, '');
    const url = SITE_URL + path;

    this.title.setTitle(title);
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.canonical().href = url;
  }

  private canonical(): HTMLLinkElement {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    return link;
  }
}

/** The data of the deepest active route, where a page's own settings live. */
function deepestData(route: ActivatedRouteSnapshot): PageMeta {
  let current = route;
  while (current.firstChild) current = current.firstChild;
  return current.data as PageMeta;
}
