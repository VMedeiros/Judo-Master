import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';

import { AppComponent } from './app.component';
import { INITIAL_BELTS } from './data/belts.data';
import { ExportService } from './services/export.service';
import { ToastService } from './services/toast.service';
import { button, configure, query, settle } from './testing/test-helpers';

describe('AppComponent', () => {
  let versionUpdates: Subject<VersionEvent>;
  let unrecoverable: Subject<unknown>;

  async function create(swEnabled = true) {
    versionUpdates = new Subject();
    unrecoverable = new Subject();
    configure(
      [AppComponent],
      [
        {
          provide: SwUpdate,
          useValue: {
            isEnabled: swEnabled,
            versionUpdates,
            unrecoverable,
            checkForUpdate: jasmine.createSpy('checkForUpdate').and.resolveTo(false),
            activateUpdate: jasmine.createSpy('activateUpdate').and.resolveTo(true),
          },
        },
      ]
    );
    const fixture = TestBed.createComponent(AppComponent);
    const root = fixture.nativeElement as HTMLElement;
    document.body.appendChild(root);
    await settle(fixture);
    return { fixture, root };
  }

  afterEach(() => {
    document.querySelectorAll('app-root').forEach(el => el.remove());
    document.documentElement.classList.remove('dark', 'scroll-locked');
  });

  it('shows the first belt with its techniques and a skip link', async () => {
    const { root } = await create();
    expect(query(root, '.skip-link').getAttribute('href')).toBe('#main-content');
    expect(query(root, '[role="tabpanel"] h2').textContent).toContain(INITIAL_BELTS[0]!.name);
    expect(root.querySelectorAll('tbody tr:not(:first-child)')).toHaveSize(
      INITIAL_BELTS[0]!.techniques.length
    );
  });

  it('switches belts and filters techniques', async () => {
    const { fixture, root } = await create();
    (root.querySelectorAll('[role="tab"]')[2] as HTMLButtonElement).click();
    await settle(fixture);
    expect(query(root, '[role="tabpanel"]').id).toBe(`belt-panel-${INITIAL_BELTS[2]!.id}`);

    const search = query<HTMLInputElement>(root, 'input[type="search"]');
    search.value = 'zzzz-nada';
    search.dispatchEvent(new Event('input'));
    await settle(fixture);
    expect(root.textContent).toContain('Nenhum resultado');
  });

  it('adds, edits and removes a technique through the dialogs', async () => {
    const { fixture, root } = await create();
    const count = INITIAL_BELTS[0]!.techniques.length;

    button(root, 'Adicionar técnica').click();
    await settle(fixture);
    const form = query<HTMLFormElement>(document, '#technique-form');
    query<HTMLInputElement>(form, '[name="name"]').value = 'Técnica de teste';
    query<HTMLTextAreaElement>(form, '[name="description"]').value = 'Criada no teste';
    form.requestSubmit();
    await settle(fixture);
    expect(root.textContent).toContain('Técnica de teste');
    expect(root.textContent).toContain(`${count + 1} técnicas`);

    button(root, 'Editar Técnica de teste').click();
    await settle(fixture);
    const editForm = query<HTMLFormElement>(document, '#technique-form');
    query<HTMLInputElement>(editForm, '[name="name"]').value = 'Técnica editada';
    editForm.requestSubmit();
    await settle(fixture);
    expect(root.textContent).toContain('Técnica editada');

    button(root, 'Remover Técnica editada').click();
    await settle(fixture);
    button(document.body, 'Sim, remover').click();
    await settle(fixture);
    expect(query(root, 'table').textContent).not.toContain('Técnica editada');
    expect(root.textContent).toContain(`${count} técnicas`);
  });

  it('opens details, steps to the next technique and on to its video', async () => {
    const { fixture, root } = await create();
    const [first, second] = INITIAL_BELTS[0]!.techniques;
    button(root, `Ver detalhes de ${first!.name}`).click();
    await settle(fixture);
    expect(query(document, 'dialog h2').textContent).toContain(first!.name);

    button(document.body, 'Próxima técnica').click();
    await settle(fixture);
    expect(query(document, 'dialog h2').textContent).toContain(second!.name);

    const withVideo = INITIAL_BELTS[0]!.techniques.find(t => t.demoUrl)!;
    button(root, `Assistir demonstração de ${withVideo.name}`).click();
    await settle(fixture);
    expect(query(document, 'dialog iframe')).toBeTruthy();
  });

  it('goes from the details to the video of the same technique', async () => {
    const { fixture, root } = await create();
    const withVideo = INITIAL_BELTS[0]!.techniques.find(t => t.demoUrl)!;
    button(root, `Ver detalhes de ${withVideo.name}`).click();
    await settle(fixture);
    button(document.body, 'Assistir demonstração').click();
    await settle(fixture);
    expect(query<HTMLIFrameElement>(document, 'dialog iframe').title).toContain(withVideo.name);
  });

  it('opens settings, about and the restore confirmation', async () => {
    const { fixture, root } = await create();
    button(root, `Remover ${INITIAL_BELTS[0]!.techniques[0]!.name}`).click();
    await settle(fixture);
    button(document.body, 'Sim, remover').click();
    await settle(fixture);

    button(root, 'Configurações').click();
    await settle(fixture);
    button(document.body, 'Restaurar técnicas originais').click();
    await settle(fixture);
    button(document.body, 'Restaurar').click();
    await settle(fixture);
    expect(root.textContent).toContain(INITIAL_BELTS[0]!.techniques[0]!.name);

    button(root, 'Configurações').click();
    await settle(fixture);
    button(document.body, 'Sobre o').click();
    await settle(fixture);
    expect(query(document, 'dialog h2').textContent).toContain('Sobre o Judô');
  });

  it('downloads through the export service and reports failures', async () => {
    const { fixture, root } = await create();
    const exporter = TestBed.inject(ExportService);
    const excel = spyOn(exporter, 'exportToExcel').and.resolveTo();
    spyOn(exporter, 'exportToPdf').and.rejectWith(new Error('offline'));
    const toasts = TestBed.inject(ToastService);
    spyOn(console, 'error');

    button(root, 'Excel').click();
    await settle(fixture);
    expect(excel).toHaveBeenCalledWith(jasmine.objectContaining({ id: INITIAL_BELTS[0]!.id }));

    button(root, 'PDF').click();
    await settle(fixture);
    expect(toasts.toasts().some(t => t.type === 'error')).toBeTrue();
    expect(button(root, 'PDF').disabled).toBeFalse();
  });

  it('offers to reload when a new version is ready, and warns when the version broke', async () => {
    await create();
    const toasts = TestBed.inject(ToastService);
    versionUpdates.next({ type: 'VERSION_DETECTED', version: { hash: 'b' } });
    expect(toasts.toasts()).toEqual([]);
    versionUpdates.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'a' },
      latestVersion: { hash: 'b' },
    });
    expect(toasts.toasts()[0]?.action?.label).toBe('Atualizar');
    unrecoverable.next({ type: 'UNRECOVERABLE_STATE', reason: 'x' });
    expect(toasts.toasts()[1]?.action?.label).toBe('Recarregar');
  });

  it('works without a service worker', async () => {
    const { root } = await create(false);
    versionUpdates.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'a' },
      latestVersion: { hash: 'b' },
    });
    expect(TestBed.inject(ToastService).toasts()).toEqual([]);
    expect(root.textContent).toContain('Judô');
  });
});
