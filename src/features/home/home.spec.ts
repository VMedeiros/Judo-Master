import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, TitleStrategy, provideRouter } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';

import { beltFillOf, beltKeyOf } from '../../core/constants/belt.constants';
import { INITIAL_BELTS } from '../../core/data/belts.data';
import { NavigationHistoryService } from '../../core/services/navigation-history.service';
import { PageTitleStrategy } from '../../core/services/page-title.strategy';
import { SettingsService } from '../../core/settings.service';
import { TechniqueStateService } from '../../core/technique-state.service';
import { PreferencesMenuComponent } from '../../shared/ui/preferences-menu.component';
import { button, configure, query, settle } from '../../testing/test-helpers';
import { TechniquesPageComponent } from '../techniques/techniques-page.component';
import { BeltsOverviewComponent } from './belts-overview.component';
import { HomeComponent } from './home.component';

@Component({ changeDetection: ChangeDetectionStrategy.OnPush, template: '' })
class EmptyPage {}

describe('HomeComponent', () => {
  async function create() {
    configure([HomeComponent], [provideRouter([])]);
    TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Manual });
    const fixture = TestBed.createComponent(HomeComponent);
    const root = fixture.nativeElement as HTMLElement;
    document.body.appendChild(root);
    await settle(fixture);
    return { fixture, root };
  }

  afterEach(() => document.querySelectorAll('app-home').forEach(el => el.remove()));

  it('leads with one heading and the way into the techniques, in JudoKan frame', async () => {
    const { root } = await create();
    expect(root.querySelectorAll('h1')).toHaveSize(1);
    expect(query(root, 'h1').textContent).toContain('Chegue preparado');
    expect(root.querySelectorAll('main')).toHaveSize(1);
    expect(root.querySelectorAll('a[href="/tecnicas"]').length).toBeGreaterThanOrEqual(3);
    expect(query(root, 'header').textContent).toContain('Judô Master');
    expect(query(root, 'footer nav').getAttribute('aria-label')).toBe('Links do rodapé');
  });

  it('has every section the header links to, each named by its heading', async () => {
    const { fixture, root } = await create();
    for (const item of fixture.componentInstance.nav) {
      const section = query(root, `section#${item.id}`);
      const heading = query(section, 'h2');
      expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
      expect(root.querySelector(`header a[href="#${item.id}"]`)).not.toBeNull();
    }
  });

  it('moves focus to the section a link points at', async () => {
    const { root } = await create();
    const section = query(root, '#duvidas');
    const scroll = spyOn(section, 'scrollIntoView');
    query<HTMLAnchorElement>(root, 'header a[href="#duvidas"]').click();
    expect(scroll).toHaveBeenCalled();
    expect(document.activeElement).toBe(query(section, 'h2'));
  });

  it('describes the illustration instead of exposing its example rows', async () => {
    const { root } = await create();
    const figure = query(root, 'figure');
    expect(query(figure, 'figcaption').textContent).toContain('Ilustração');
    expect(query(figure, ':scope > div').getAttribute('aria-hidden')).toBe('true');
  });

  it('opens the about dialog from the footer', async () => {
    const { fixture, root } = await create();
    button(query(root, 'footer'), 'Sobre o Judô').click();
    await settle(fixture);
    expect(query(document, 'dialog h2').textContent).toContain('Sobre o Judô');
  });

  it('loads the belts only when their section comes into view', async () => {
    const { fixture, root } = await create();
    const [belts] = await fixture.getDeferBlocks();
    expect(root.querySelector('app-belts-overview')).toBeNull();
    await belts!.render(DeferBlockState.Complete);
    expect(root.querySelector('app-belts-overview')).not.toBeNull();
  });
});

describe('BeltsOverviewComponent', () => {
  it('shows each belt with its count and opens the techniques on it', async () => {
    configure([BeltsOverviewComponent], [provideRouter([])]);
    const fixture = TestBed.createComponent(BeltsOverviewComponent);
    await settle(fixture);
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('a'));
    expect(links).toHaveSize(INITIAL_BELTS.length);
    const first = INITIAL_BELTS[0]!;
    expect(links[0]!.getAttribute('href')).toBe(`/tecnicas?faixa=${first.id}`);
    expect(links[0]!.textContent).toContain(`${first.techniques.length} técnicas`);
    // A belt with a single technique says so in the singular.
    const single = INITIAL_BELTS.findIndex(b => b.techniques.length === 1);
    if (single >= 0) expect(links[single]!.textContent).toContain('1 técnica ');
  });
});

describe('belt colours', () => {
  it('match JudoKan, read from the belt name', () => {
    expect(beltKeyOf('11º Kyu · Faixa Branca')).toBe('branca');
    expect(beltKeyOf('Faixa Marrom')).toBe('marrom');
    expect(beltFillOf('Faixa Marrom')).toBe('bg-[#795548]');
    expect(beltFillOf('Faixa Desconhecida')).toBe('bg-gray-300');
    expect(beltFillOf('sem faixa')).toBe('bg-gray-300');
  });
});

describe('PreferencesMenuComponent', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark', 'high-contrast');
    document.documentElement.style.fontSize = '';
    document.querySelectorAll('app-preferences-menu').forEach(el => el.remove());
  });

  it('opens on the gear, moves focus in, and closes on Escape, outside clicks and Tab away', async () => {
    configure([PreferencesMenuComponent]);
    const fixture = TestBed.createComponent(PreferencesMenuComponent);
    const root = fixture.nativeElement as HTMLElement;
    document.body.appendChild(root);
    await settle(fixture);
    const trigger = button(root, 'Opções de exibição');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    await settle(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const panel = query(root, `#${trigger.getAttribute('aria-controls')}`);
    expect(panel.contains(document.activeElement)).toBeTrue();
    button(panel, 'Escuro').click();
    expect(TestBed.inject(SettingsService).isDarkMode()).toBeTrue();

    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);

    trigger.click();
    await settle(fixture);
    document.body.click();
    await settle(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    await settle(fixture);
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    query(root, `#${trigger.getAttribute('aria-controls')}`).dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: outside })
    );
    await settle(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    outside.remove();

    // A second click on the open gear closes it too.
    trigger.click();
    await settle(fixture);
    trigger.click();
    await settle(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('PageTitleStrategy and NavigationHistoryService', () => {
  beforeEach(() => {
    configure(
      [],
      [
        provideRouter([
          {
            path: '',
            component: EmptyPage,
            title: 'Início',
            data: { description: 'Página inicial' },
          },
          { path: 'tecnicas', component: EmptyPage, title: 'Técnicas por faixa' },
        ]),
        provideLocationMocks(),
        { provide: TitleStrategy, useClass: PageTitleStrategy },
      ]
    );
  });

  it('titles each page, describes it and names its canonical address', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/tecnicas?faixa=2');
    expect(TestBed.inject(Title).getTitle()).toBe('Técnicas por faixa · Judô Master');
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')!;
    expect(canonical.href).toBe('https://vmedeiros.github.io/Judo-Master/tecnicas');

    await router.navigateByUrl('/');
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe('Página inicial');
    expect(canonical.href).toBe('https://vmedeiros.github.io/Judo-Master/');
  });

  it('knows the page that led here, goes back to it, or to the fallback', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    const history = TestBed.inject(NavigationHistoryService);
    router.setUpLocationChangeListener();
    await router.navigateByUrl('/');
    expect(history.previousUrl()).toBeNull();
    const navigate = spyOn(router, 'navigateByUrl').and.callThrough();
    history.back('/tecnicas');
    expect(navigate).toHaveBeenCalledWith('/tecnicas');
    await new Promise(resolve => setTimeout(resolve));

    expect(history.previousUrl()).toBe('/');
    const arrived = firstValueFrom(router.events.pipe(filter(e => e instanceof NavigationEnd)));
    history.back('/');
    await arrived;
    expect(router.url).toBe('/');
    expect(location.path()).toBe('/');
    expect(history.previousUrl()).toBeNull();
  });

  it('lets a page that replaced the current one take its place, and forgets on request', async () => {
    const router = TestBed.inject(Router);
    const history = TestBed.inject(NavigationHistoryService);
    await router.navigateByUrl('/');
    await router.navigateByUrl('/tecnicas');
    await router.navigateByUrl('/tecnicas?faixa=2', { replaceUrl: true });
    expect(history.previousUrl()).toBe('/');
    await router.navigateByUrl('/', { skipLocationChange: true });
    expect(history.previousUrl()).toBe('/');
    history.forget();
    await router.navigateByUrl('/');
    expect(history.previousUrl()).toBeNull();
  });

  it('starts again from the page when the browser jumps somewhere it cannot place', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    const history = TestBed.inject(NavigationHistoryService);
    router.setUpLocationChangeListener();
    await router.navigateByUrl('/');
    await router.navigateByUrl('/tecnicas');
    let arrived = firstValueFrom(router.events.pipe(filter(e => e instanceof NavigationEnd)));
    location.back();
    await arrived;
    expect(history.previousUrl()).toBeNull();
    // Forward: what lay behind is no longer known for sure.
    arrived = firstValueFrom(router.events.pipe(filter(e => e instanceof NavigationEnd)));
    location.forward();
    await arrived;
    expect(router.url).toBe('/tecnicas');
    expect(history.previousUrl()).toBeNull();
  });
});

describe('TechniquesPageComponent', () => {
  it('opens on the belt chosen on the home page', async () => {
    const target = INITIAL_BELTS[2]!;
    configure(
      [TechniquesPageComponent],
      [provideRouter([{ path: 'tecnicas', component: TechniquesPageComponent }])]
    );
    await TestBed.inject(Router).navigateByUrl(`/tecnicas?faixa=${target.id}`);
    const fixture = TestBed.createComponent(TechniquesPageComponent);
    await settle(fixture);
    expect(TestBed.inject(TechniqueStateService).selectedBelt()?.id).toBe(target.id);
  });
});
