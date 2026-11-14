import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Belt, GroupedTechnique, Technique, TechniqueDraft } from '../../core/domain/judo.model';
import { SettingsService } from '../../core/settings.service';
import { ToastService } from '../../core/toast.service';
import { belt, button, configure, query, settle, technique } from '../../testing/test-helpers';
import { BeltTabsComponent } from '../../features/techniques/belt-tabs.component';
import { CelebrationBannerComponent } from '../../features/techniques/celebration-banner.component';
import { ModalComponent } from './modal.component';
import { AboutModalComponent } from './about-modal.component';
import { ConfirmModalComponent } from './confirm-modal.component';
import { SettingsModalComponent } from './settings-modal.component';
import { TechniqueDetailModalComponent } from '../../features/techniques/technique-detail-modal.component';
import { TechniqueFormModalComponent } from '../../features/techniques/technique-form-modal.component';
import { VideoPlayerModalComponent } from '../../features/techniques/video-player-modal.component';
import { TechniqueTableComponent } from '../../features/techniques/technique-table.component';
import { ToastComponent } from './toast.component';
import { DisplayPreferencesComponent } from './display-preferences.component';
import { FooterComponent } from './footer.component';
import { ScrollToTopComponent, SCROLL_TOP_THRESHOLD_PX } from './scroll-to-top.component';
import { TooltipDirective } from './tooltip.directive';
import { JUDOKAN_URL } from '../../core/constants/app.constants';
import { APP_VERSION } from '../../environments/version';

describe('ModalComponent', () => {
  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalComponent],
    template: `
      <button id="opener" type="button" (click)="open.set(true)">open</button>
      @if (open()) {
        <app-modal
          title="Título"
          subtitle="Sub"
          [alert]="alert()"
          (closed)="closes = closes + 1; open.set(false)"
        >
          <input id="field" />
          <ng-container modalFooter><button type="button">ok</button></ng-container>
        </app-modal>
      }
    `,
  })
  class HostComponent {
    public readonly open = signal(false);
    public readonly alert = signal(false);
    public closes = 0;
  }

  beforeEach(() => configure([HostComponent]));

  async function openModal(): Promise<{
    host: HostComponent;
    root: HTMLElement;
    dialog: HTMLDialogElement;
  }> {
    const fixture = TestBed.createComponent(HostComponent);
    const root = fixture.nativeElement as HTMLElement;
    document.body.appendChild(root);
    await settle(fixture);
    const opener = query<HTMLButtonElement>(root, '#opener');
    opener.focus();
    opener.click();
    await settle(fixture);
    return {
      host: fixture.componentInstance,
      root,
      dialog: query<HTMLDialogElement>(root, 'dialog'),
    };
  }

  it('opens as a modal, labelled by its title, with focus on the first field', async () => {
    const { root, dialog } = await openModal();
    expect(dialog.open).toBeTrue();
    expect(dialog.matches(':modal')).toBeTrue();
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe(
      'Título'
    );
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(dialog.getAttribute('role')).toBeNull();
    expect(document.activeElement).toBe(query(root, '#field'));
    expect(document.documentElement.classList.contains('scroll-locked')).toBeTrue();
    root.remove();
  });

  it('asks to close on Escape, the close button and the backdrop, and returns focus', async () => {
    const { host, root, dialog } = await openModal();
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(host.closes).toBe(1);
    TestBed.tick();
    expect(document.activeElement).toBe(query(root, '#opener'));
    expect(document.documentElement.classList.contains('scroll-locked')).toBeFalse();

    query<HTMLButtonElement>(root, '#opener').click();
    TestBed.tick();
    await new Promise(r => setTimeout(r));
    button(root, 'Fechar Título').click();
    expect(host.closes).toBe(2);
    TestBed.tick();

    query<HTMLButtonElement>(root, '#opener').click();
    TestBed.tick();
    await new Promise(r => setTimeout(r));
    const reopened = query<HTMLDialogElement>(root, 'dialog');
    reopened.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(host.closes).toBe(3);
    root.remove();
  });

  it('is announced as an alert dialog when asked', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.alert.set(true);
    fixture.componentInstance.open.set(true);
    await settle(fixture);
    expect(query(fixture.nativeElement, 'dialog').getAttribute('role')).toBe('alertdialog');
  });
});

describe('ToastComponent', () => {
  it('lists toasts in the top layer, runs actions and dismisses', async () => {
    configure([ToastComponent]);
    const fixture = TestBed.createComponent(ToastComponent);
    document.body.appendChild(fixture.nativeElement);
    const toasts = TestBed.inject(ToastService);
    const run = jasmine.createSpy('run');
    toasts.info('Nova versão', { sticky: true, action: { label: 'Atualizar', run } });
    toasts.error('Falhou');
    await settle(fixture);

    const region = query(fixture.nativeElement, '.app-toasts');
    expect(region.matches(':popover-open')).toBeTrue();
    expect(region.textContent).toContain('Nova versão');
    expect(query(fixture.nativeElement, '[role="alert"]').textContent).toContain('Falhou');

    button(fixture.nativeElement, 'Atualizar').click();
    expect(run).toHaveBeenCalled();
    for (const close of fixture.nativeElement.querySelectorAll(
      '[aria-label="Fechar notificação"]'
    )) {
      (close as HTMLButtonElement).click();
    }
    await settle(fixture);
    expect(toasts.toasts()).toEqual([]);
    expect(region.matches(':popover-open')).toBeFalse();
    fixture.nativeElement.remove();
  });
});

describe('DisplayPreferencesComponent', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark', 'high-contrast');
    document.documentElement.style.fontSize = '';
  });

  it('picks the theme, the contrast and the text size, marking each choice', async () => {
    configure([DisplayPreferencesComponent]);
    const fixture = TestBed.createComponent(DisplayPreferencesComponent);
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;
    const settings = TestBed.inject(SettingsService);

    expect(button(root, 'Claro').getAttribute('aria-pressed')).toBe('true');
    button(root, 'Escuro').click();
    await settle(fixture);
    expect(settings.isDarkMode()).toBeTrue();
    expect(button(root, 'Escuro').getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();

    const contrast = query<HTMLInputElement>(root, 'input[type="checkbox"]');
    expect(contrast.closest('label')?.textContent?.trim()).toBe('Alto contraste');
    contrast.click();
    await settle(fixture);
    expect(settings.highContrast()).toBeTrue();
    expect(document.documentElement.classList.contains('high-contrast')).toBeTrue();

    button(root, 'Fonte grande').click();
    await settle(fixture);
    expect(settings.fontSize()).toBe('large');
    expect(button(root, 'Fonte grande').getAttribute('aria-pressed')).toBe('true');
    expect(button(root, 'Fonte média').getAttribute('aria-pressed')).toBe('false');
  });
});

describe('FooterComponent', () => {
  it('credits, versions and links like JudoKan, and asks for the about dialog', async () => {
    configure([FooterComponent]);
    const fixture = TestBed.createComponent(FooterComponent);
    const opened = jasmine.createSpy('openAbout');
    fixture.componentInstance.openAbout.subscribe(opened);
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain(`© ${new Date().getFullYear()} Judô Master`);
    expect(root.textContent).toContain(`v${APP_VERSION}`);
    const nav = query(root, 'footer nav');
    expect(nav.getAttribute('aria-label')).toBe('Links do rodapé');
    for (const link of nav.querySelectorAll<HTMLAnchorElement>('a')) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    }
    expect(query<HTMLAnchorElement>(nav, `a[href="${JUDOKAN_URL}"]`)).toBeTruthy();
    button(root, 'Sobre o Judô').click();
    expect(opened).toHaveBeenCalled();
  });
});

describe('ScrollToTopComponent', () => {
  it('appears past the threshold and goes back to the top, focusing the page', async () => {
    const main = document.createElement('main');
    main.id = 'main-content';
    main.tabIndex = -1;
    document.body.appendChild(main);
    const scrollY = spyOnProperty(window, 'scrollY').and.returnValue(0);
    const scrollTo = spyOn(window, 'scrollTo');
    configure([ScrollToTopComponent]);
    const fixture = TestBed.createComponent(ScrollToTopComponent);
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;
    const scrollBy = async (y: number) => {
      scrollY.and.returnValue(y);
      window.dispatchEvent(new Event('scroll'));
      await settle(fixture);
    };

    expect(root.querySelector('button')).toBeNull();
    await scrollBy(SCROLL_TOP_THRESHOLD_PX + 1);
    button(root, 'Voltar ao topo').click();
    expect(scrollTo.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ top: 0 }));
    expect(document.activeElement).toBe(main);
    await scrollBy(0);
    expect(root.querySelector('button')).toBeNull();
    main.remove();
  });
});

describe('TooltipDirective', () => {
  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TooltipDirective],
    template: `<button type="button" aria-label="Editar Seiza" appTooltip="Editar">x</button>
      <button type="button" appTooltip="Ver detalhes" tooltipPosition="bottom">y</button>`,
  })
  class HostComponent {}

  it('shows the hint on hover and keyboard focus, and hides it after', async () => {
    configure([HostComponent]);
    const fixture = TestBed.createComponent(HostComponent);
    const root = fixture.nativeElement as HTMLElement;
    document.body.appendChild(root);
    await settle(fixture);
    const [edit, details] = Array.from(root.querySelectorAll('button'));

    edit!.dispatchEvent(new MouseEvent('mouseenter'));
    const tip = document.querySelector('[role="tooltip"]');
    expect(tip?.textContent).toBe('Editar');
    // The name already says it: no description on top.
    expect(edit!.hasAttribute('aria-describedby')).toBeFalse();
    edit!.dispatchEvent(new MouseEvent('mouseleave'));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    details!.dispatchEvent(new MouseEvent('mouseenter'));
    expect(details!.getAttribute('aria-describedby')).toBe(
      document.querySelector('[role="tooltip"]')?.id ?? ''
    );
    details!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    root.remove();
  });
  it('opens on a long press, not on a tap, and swallows the click that ends the press', async () => {
    jasmine.clock().install();
    configure([HostComponent]);
    const fixture = TestBed.createComponent(HostComponent);
    const root = fixture.nativeElement as HTMLElement;
    document.body.appendChild(root);
    await settle(fixture);
    const edit = root.querySelector('button')!;
    const tip = () => document.querySelector('[role="tooltip"]');

    // A tap: nothing.
    edit.dispatchEvent(new Event('touchstart'));
    edit.dispatchEvent(new Event('touchend', { cancelable: true }));
    jasmine.clock().tick(600);
    expect(tip()).toBeNull();

    // A press that turns into a scroll: nothing.
    edit.dispatchEvent(new Event('touchstart'));
    edit.dispatchEvent(new Event('touchmove'));
    jasmine.clock().tick(600);
    expect(tip()).toBeNull();

    // A long press: the hint, and the click that ends it does not run.
    edit.dispatchEvent(new Event('touchstart'));
    jasmine.clock().tick(500);
    expect(tip()?.textContent).toBe('Editar');
    const end = new Event('touchend', { cancelable: true });
    edit.dispatchEvent(end);
    expect(end.defaultPrevented).toBeTrue();
    jasmine.clock().tick(1500);
    expect(tip()).toBeNull();

    jasmine.clock().uninstall();
    fixture.destroy();
    root.remove();
  });

  it('places the hint on the side asked, inside the screen', async () => {
    @Component({
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TooltipDirective],
      template: ` <button
          type="button"
          style="position: fixed; top: 0; left: 200px"
          appTooltip="Topo"
          tooltipPosition="top"
        >
          a
        </button>
        <button
          type="button"
          style="position: fixed; top: 200px; left: 200px"
          appTooltip="Esquerda"
          tooltipPosition="left"
        >
          b
        </button>
        <button
          type="button"
          style="position: fixed; top: 200px; left: 300px"
          appTooltip="Direita"
          tooltipPosition="right"
        >
          c
        </button>
        <button
          type="button"
          style="position: fixed; bottom: 0; left: 200px"
          appTooltip="Baixo"
          tooltipPosition="bottom"
        >
          d
        </button>
        <button type="button" appTooltip="">e</button>`,
    })
    class PlacesComponent {}
    configure([PlacesComponent]);
    const fixture = TestBed.createComponent(PlacesComponent);
    const root = fixture.nativeElement as HTMLElement;
    document.body.appendChild(root);
    await settle(fixture);
    const [top, left, right, bottom, empty] = Array.from(root.querySelectorAll('button'));
    const show = (host: HTMLElement) => {
      host.dispatchEvent(new MouseEvent('mouseenter'));
      const tip = document.querySelector<HTMLElement>('[role="tooltip"]');
      const box = { tip: tip?.getBoundingClientRect(), host: host.getBoundingClientRect() };
      host.dispatchEvent(new MouseEvent('mouseleave'));
      return box;
    };

    // No room above the top one: it goes below.
    const t = show(top!);
    expect(t.tip!.top).toBeGreaterThanOrEqual(t.host.bottom);
    const l = show(left!);
    expect(l.tip!.right).toBeLessThanOrEqual(l.host.left);
    const r = show(right!);
    expect(r.tip!.left).toBeGreaterThanOrEqual(r.host.right);
    // No room below the bottom one: it goes above.
    const b = show(bottom!);
    expect(b.tip!.bottom).toBeLessThanOrEqual(b.host.top);
    // Nothing to say, nothing shown.
    expect(show(empty!).tip).toBeUndefined();

    fixture.destroy();
    root.remove();
  });
});

describe('BeltTabsComponent', () => {
  const belts: Belt[] = [
    belt({ id: 1, name: 'Branca' }),
    belt({ id: 2, name: 'Cinza' }),
    belt({ id: 3, name: 'Azul' }),
  ];

  async function create(selected = 0) {
    configure([BeltTabsComponent]);
    const fixture = TestBed.createComponent(BeltTabsComponent);
    fixture.componentRef.setInput('belts', belts);
    fixture.componentRef.setInput('selectedIndex', selected);
    const emitted: number[] = [];
    fixture.componentInstance.beltSelected.subscribe(i => emitted.push(i));
    await settle(fixture);
    return { root: fixture.nativeElement as HTMLElement, emitted };
  }

  it('wires each tab to its panel by belt id', async () => {
    const { root } = await create();
    const tabs = root.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveSize(3);
    expect(tabs[1]!.id).toBe('belt-tab-2');
    expect(tabs[1]!.getAttribute('aria-controls')).toBe('belt-panel-2');
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    expect(tabs[1]!.getAttribute('tabindex')).toBe('-1');
  });

  it('moves with the arrow keys, wrapping around, and Home/End', async () => {
    const { root, emitted } = await create(0);
    const list = query(root, '[role="tablist"]');
    for (const key of ['ArrowLeft', 'ArrowRight', 'End', 'Home', 'Tab']) {
      list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }
    expect(emitted).toEqual([2, 1, 2, 0]);
  });

  it('selects from clicks and from the phone select', async () => {
    const { root, emitted } = await create();
    (root.querySelectorAll('[role="tab"]')[2] as HTMLButtonElement).click();
    const select = query<HTMLSelectElement>(root, 'select');
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    expect(emitted).toEqual([2, 1]);
  });
});

describe('CelebrationBannerComponent', () => {
  it('renders only on a commemorative date', async () => {
    configure([CelebrationBannerComponent]);
    const fixture = TestBed.createComponent(CelebrationBannerComponent);
    await settle(fixture);
    expect(fixture.nativeElement.textContent.trim()).toBe('');
    fixture.componentRef.setInput('celebration', { name: 'Natal', icon: '🎄' });
    await settle(fixture);
    expect(query(fixture.nativeElement, 'h2').textContent).toContain('Natal');
  });
});

describe('TechniqueTableComponent', () => {
  const withVideo = technique({ id: 1 });
  const withoutVideo = technique({ id: 2, name: 'Seiza', demoUrl: '', category: 'POSTURAS' });
  const sample = belt({ techniques: [withVideo, withoutVideo] });
  const groups: GroupedTechnique[] = [
    { category: withVideo.category, techniques: [withVideo] },
    { category: 'POSTURAS', techniques: [withoutVideo] },
  ];

  async function create(inputs: Record<string, unknown> = {}) {
    configure([TechniqueTableComponent]);
    const fixture = TestBed.createComponent(TechniqueTableComponent);
    fixture.componentRef.setInput('belt', sample);
    fixture.componentRef.setInput('groupedTechniques', groups);
    fixture.componentRef.setInput('visibleCount', 2);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    await settle(fixture);
    return {
      fixture,
      root: fixture.nativeElement as HTMLElement,
      component: fixture.componentInstance,
    };
  }

  it('sorts by name or translation inside each category, as JudoKan tables do', async () => {
    const a = technique({ id: 11, name: 'Uchi-mata', translation: 'Ceifa interna da coxa' });
    const b = technique({ id: 12, name: 'Harai-goshi', translation: 'Varrida de quadril' });
    const c = technique({ id: 13, name: 'O-goshi', translation: 'Grande quadril' });
    const { fixture, root } = await create({
      groupedTechniques: [{ category: a.category, techniques: [a, b, c] }],
    });
    const names = () =>
      Array.from(root.querySelectorAll('tbody td:first-child button')).map(el =>
        el.textContent?.trim()
      );
    const header = (label: string) =>
      query(root, `th[aria-sort] button`)
        .closest('tr')!
        .querySelector<HTMLButtonElement>(`th:nth-child(${label === 'Nome' ? 1 : 2}) button`)!;

    // In the order the exam lists them until someone asks otherwise.
    expect(names()).toEqual(['Uchi-mata', 'Harai-goshi', 'O-goshi']);
    expect(header('Nome').closest('th')!.getAttribute('aria-sort')).toBe('none');
    expect(header('Nome').textContent).toContain('unfold_more');

    header('Nome').click();
    await settle(fixture);
    expect(names()).toEqual(['Harai-goshi', 'O-goshi', 'Uchi-mata']);
    expect(header('Nome').closest('th')!.getAttribute('aria-sort')).toBe('ascending');
    expect(header('Nome').textContent).toContain('arrow_upward');

    header('Nome').click();
    await settle(fixture);
    expect(names()).toEqual(['Uchi-mata', 'O-goshi', 'Harai-goshi']);
    expect(header('Nome').closest('th')!.getAttribute('aria-sort')).toBe('descending');
    expect(header('Nome').textContent).toContain('arrow_downward');

    header('Tradução').click();
    await settle(fixture);
    expect(names()).toEqual(['Uchi-mata', 'O-goshi', 'Harai-goshi']);
    expect(header('Tradução').closest('th')!.getAttribute('aria-sort')).toBe('ascending');
    expect(header('Nome').closest('th')!.getAttribute('aria-sort')).toBe('none');
  });

  it('draws JudoKan avatars: first and last word, hyphens included', async () => {
    const { root } = await create({
      groupedTechniques: [
        {
          category: 'X',
          techniques: [
            technique({ id: 21, name: 'O-soto-gari' }),
            technique({ id: 22, name: 'Sensei' }),
            technique({ id: 23, name: 'Tabi-rei ou Ritsu-rei' }),
          ],
        },
      ],
    });
    const avatars = Array.from(
      root.querySelectorAll('tbody td:first-child span[aria-hidden="true"]')
    ).map(el => el.textContent?.trim());
    expect(avatars).toEqual(['OG', 'SE', 'TR']);
  });

  it('is the tab panel of its belt and lists techniques by category', async () => {
    const { root } = await create();
    const panel = query(root, '[role="tabpanel"]');
    expect(panel.id).toBe('belt-panel-1');
    expect(panel.getAttribute('aria-labelledby')).toBe('belt-tab-1');
    expect(root.querySelectorAll('th[scope="colgroup"]')).toHaveSize(2);
    expect(root.textContent).toContain('2 técnicas');
  });

  it('offers the video only where there is one', async () => {
    const { root, component } = await create();
    const watched: Technique[] = [];
    component.showVideo.subscribe(t => watched.push(t));
    button(root, 'Assistir à demonstração de O-soto-gari').click();
    expect(watched).toEqual([withVideo]);
    expect(root.querySelector('[aria-label="Assistir à demonstração de Seiza"]')).toBeNull();
    expect(root.textContent).toContain('Esta técnica ainda não tem vídeo');
  });

  it('emits the row actions, the search and the downloads', async () => {
    const { root, component } = await create();
    const events: string[] = [];
    component.showDetail.subscribe(t => events.push(`detail:${t.id}`));
    component.editTechnique.subscribe(t => events.push(`edit:${t.id}`));
    component.deleteTechnique.subscribe(t => events.push(`delete:${t.id}`));
    component.addTechnique.subscribe(() => events.push('add'));
    component.exportExcel.subscribe(() => events.push('excel'));
    component.exportPdf.subscribe(() => events.push('pdf'));
    component.filterChange.subscribe(term => events.push(`filter:${term}`));

    button(root, 'Ver detalhes de Seiza').click();
    button(root, 'Editar Seiza').click();
    button(root, 'Remover Seiza').click();
    button(root, 'Excel').click();
    button(root, 'PDF').click();
    const search = query<HTMLInputElement>(root, 'input[type="search"]');
    search.value = 'gari';
    search.dispatchEvent(new Event('input'));

    expect(events).toEqual(['detail:2', 'edit:2', 'delete:2', 'excel', 'pdf', 'filter:gari']);
  });

  it('disables the downloads while one is being prepared', async () => {
    const { root } = await create({ exporting: true });
    expect(button(root, 'Excel').disabled).toBeTrue();
    expect(button(root, 'PDF').disabled).toBeTrue();
  });

  it('explains an empty search and clears it', async () => {
    const { root, component } = await create({
      groupedTechniques: [],
      filterTerm: 'zzz',
      visibleCount: 0,
    });
    expect(root.textContent).toContain('Nada encontrado');
    expect(root.textContent).toContain('0 de 2 técnicas');
    const terms: string[] = [];
    component.filterChange.subscribe(t => terms.push(t));
    button(root, 'Limpar busca').click();
    expect(terms).toEqual(['']);
  });

  it('invites to add the first technique of an empty belt', async () => {
    const { root, component } = await create({
      belt: belt({ techniques: [] }),
      groupedTechniques: [],
    });
    const added = jasmine.createSpy('add');
    component.addTechnique.subscribe(added);
    button(root, 'Adicionar a primeira técnica').click();
    expect(added).toHaveBeenCalled();
    expect(button(root, 'Excel').disabled).toBeTrue();
  });

  it('shows the belt as the JudoKan dashboard banner: name, count, then the details', async () => {
    const { root } = await create();
    const banner = query(root, '.bg-primary-800');
    expect(query(banner, 'h2').textContent).toContain('Faixa');
    expect(banner.textContent).toContain(' no exame');
    expect(banner.querySelectorAll('dt')).toHaveSize(2);
    expect(banner.querySelector('img')).toBeNull();
  });
});

describe('TechniqueFormModalComponent', () => {
  async function create(draft: TechniqueDraft, mode: 'add' | 'edit' = 'add') {
    configure([TechniqueFormModalComponent]);
    const fixture = TestBed.createComponent(TechniqueFormModalComponent);
    fixture.componentRef.setInput('technique', draft);
    fixture.componentRef.setInput('mode', mode);
    fixture.componentRef.setInput('categories', ['A', 'B']);
    const saved: unknown[] = [];
    fixture.componentInstance.saved.subscribe(e => saved.push(e));
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;
    const set = (name: string, value: string): void => {
      const field = query<HTMLInputElement>(root, `[name="${name}"]`);
      field.value = value;
      field.dispatchEvent(new Event('input'));
      field.dispatchEvent(new Event('change'));
    };
    const submit = async (): Promise<void> => {
      query<HTMLFormElement>(root, 'form').requestSubmit();
      await settle(fixture);
    };
    return { fixture, root, saved, set, submit };
  }

  const empty: TechniqueDraft = {
    name: '',
    translation: '',
    description: '',
    execution: '',
    application: '',
    demoUrl: '',
    category: 'A',
  };

  it('shows each problem next to its field and focuses the first one', async () => {
    const { root, saved, set, submit } = await create(empty);
    set('name', '   ');
    set('demoUrl', 'https://vimeo.com/123');
    await submit();

    expect(saved).toEqual([]);
    expect(query(root, '#name-error').textContent).toContain('nome');
    expect(query(root, '#description-error')).toBeTruthy();
    expect(query(root, '#demoUrl-error').textContent).toContain('YouTube');
    expect(query(root, '[name="name"]').getAttribute('aria-invalid')).toBe('true');
    expect(query(root, '[name="demoUrl"]').getAttribute('aria-describedby')).toBe(
      'demoUrl-hint demoUrl-error'
    );
    expect(document.activeElement?.getAttribute('name')).toBe('name');
  });

  it('clears an error when the field changes', async () => {
    const { root, set, submit, fixture } = await create(empty);
    await submit();
    set('name', 'Osoto');
    set('translation', 'x');
    await settle(fixture);
    expect(root.querySelector('#name-error')).toBeNull();
    expect(root.querySelector('#description-error')).not.toBeNull();
  });

  it('saves the trimmed values of a new technique', async () => {
    const { saved, set, submit } = await create(empty);
    set('name', '  Uki-goshi ');
    set('description', ' Projeção de quadril ');
    set('category', 'B');
    set('demoUrl', 'https://www.youtube.com/shorts/I_IGzpziW2A');
    await submit();
    expect(saved).toEqual([
      {
        mode: 'add',
        data: {
          name: 'Uki-goshi',
          translation: '',
          category: 'B',
          description: 'Projeção de quadril',
          execution: '',
          application: '',
          demoUrl: 'https://www.youtube.com/shorts/I_IGzpziW2A',
        },
      },
    ]);
  });

  it('keeps the id and the original category when editing', async () => {
    const existing = technique({ id: 7, category: 'Só desta técnica' });
    const { root, saved, submit } = await create(existing, 'edit');
    expect(query(root, 'h2').textContent).toContain('Editar técnica');
    expect(query<HTMLSelectElement>(root, 'select').value).toBe('Só desta técnica');
    await submit();
    expect(saved).toEqual([{ mode: 'edit', data: existing }]);
  });

  it('asks to close from Cancelar', async () => {
    const { fixture, root } = await create(empty);
    const closed = jasmine.createSpy('closed');
    fixture.componentInstance.closed.subscribe(closed);
    button(root, 'Cancelar').click();
    expect(closed).toHaveBeenCalled();
  });
});

describe('detail, video, confirm, settings and about dialogs', () => {
  it('detail: shows the technique, its video and the navigation', async () => {
    configure([TechniqueDetailModalComponent]);
    const fixture = TestBed.createComponent(TechniqueDetailModalComponent);
    fixture.componentRef.setInput('technique', technique());
    fixture.componentRef.setInput('hasNext', true);
    const events: string[] = [];
    const c = fixture.componentInstance;
    c.next.subscribe(() => events.push('next'));
    c.previous.subscribe(() => events.push('previous'));
    c.watchVideo.subscribe(() => events.push('video'));
    c.closed.subscribe(() => events.push('closed'));
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Execução');
    expect(button(root, 'Técnica anterior').disabled).toBeTrue();
    button(root, 'Próxima técnica').click();
    button(root, 'Assistir à demonstração').click();
    button(root, 'Fechar').click();
    expect(events).toEqual(['next', 'video', 'closed']);

    fixture.componentRef.setInput(
      'technique',
      technique({ demoUrl: '', execution: '', application: '' })
    );
    await settle(fixture);
    expect(root.textContent).not.toContain('Assistir à demonstração');
    expect(root.textContent).not.toContain('Execução');
  });

  it('video: embeds the privacy-enhanced player, or explains there is none', async () => {
    configure([VideoPlayerModalComponent]);
    const fixture = TestBed.createComponent(VideoPlayerModalComponent);
    fixture.componentRef.setInput('technique', technique());
    fixture.componentRef.setInput('hasPrevious', true);
    const events: string[] = [];
    fixture.componentInstance.previous.subscribe(() => events.push('previous'));
    fixture.componentInstance.next.subscribe(() => events.push('next'));
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;

    expect(query<HTMLIFrameElement>(root, 'iframe').src).toBe(
      'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1&rel=0'
    );
    expect(query<HTMLAnchorElement>(root, 'a[target="_blank"]').href).toBe(
      'https://www.youtube.com/watch?v=abcdefghijk'
    );
    button(root, 'Vídeo anterior').click();
    expect(button(root, 'Próximo vídeo').disabled).toBeTrue();
    expect(events).toEqual(['previous']);

    fixture.componentRef.setInput('technique', technique({ demoUrl: 'https://example.com' }));
    await settle(fixture);
    expect(root.querySelector('iframe')).toBeNull();
    expect(root.textContent).toContain('não disponível');
  });

  it('confirm: focuses the safe choice and reports the decision', async () => {
    configure([ConfirmModalComponent]);
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    fixture.componentRef.setInput('title', 'Remover técnica');
    fixture.componentRef.setInput('confirmLabel', 'Sim, remover');
    document.body.appendChild(fixture.nativeElement);
    const events: string[] = [];
    fixture.componentInstance.confirmed.subscribe(() => events.push('confirmed'));
    fixture.componentInstance.closed.subscribe(() => events.push('closed'));
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;

    expect(query(root, 'dialog').getAttribute('role')).toBe('alertdialog');
    expect(document.activeElement?.textContent?.trim()).toBe('Cancelar');
    button(root, 'Sim, remover').click();
    button(root, 'Cancelar').click();
    expect(events).toEqual(['confirmed', 'closed']);
    root.remove();
  });

  it('settings: the JudoKan layout - display options, the restore, JudoKan and about', async () => {
    configure([SettingsModalComponent]);
    const fixture = TestBed.createComponent(SettingsModalComponent);
    const events: string[] = [];
    fixture.componentInstance.openAbout.subscribe(() => events.push('about'));
    fixture.componentInstance.resetTechniques.subscribe(() => events.push('reset'));
    await settle(fixture);
    const root = fixture.nativeElement as HTMLElement;
    const settings = TestBed.inject(SettingsService);

    button(root, 'Escuro').click();
    await settle(fixture);
    expect(settings.isDarkMode()).toBeTrue();
    button(root, 'Fonte grande').click();
    expect(settings.fontSize()).toBe('large');

    expect(button(root, 'Restaurar técnicas originais').disabled).toBeTrue();
    expect(root.textContent).toContain('como vieram com o Judô Master');
    fixture.componentRef.setInput('hasChanges', true);
    await settle(fixture);
    expect(root.textContent).toContain('Você alterou técnicas');
    button(root, 'Restaurar técnicas originais').click();
    button(root, 'Sobre o Judô').click();
    expect(events).toEqual(['reset', 'about']);
    expect(root.textContent).toContain(`Versão ${APP_VERSION}`);

    const judokan = query<HTMLAnchorElement>(document, `dialog a[href="${JUDOKAN_URL}"]`);
    expect(judokan.rel).toContain('noopener');

    document.documentElement.classList.remove('dark');
    document.documentElement.style.fontSize = '';
  });

  it('about: renders the judo reference with correct kanji', async () => {
    configure([AboutModalComponent]);
    const fixture = TestBed.createComponent(AboutModalComponent);
    await settle(fixture);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('精力善用');
    expect(text).toContain('自他共栄');
    expect(text).toContain('Kansetsu-waza');
  });
});
