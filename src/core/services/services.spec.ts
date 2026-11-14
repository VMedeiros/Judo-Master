import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { STORAGE_KEYS } from '../constants/app.constants';
import { belt, configure, technique } from '../../testing/test-helpers';
import { CelebrationService, celebrationOn } from './celebration.service';
import { ExportService } from './export.service';
import { GlobalErrorHandler } from './global-error-handler';
import { LegacyCacheCleanupService } from './legacy-cache-cleanup.service';
import { ScrollLockService } from './scroll-lock.service';
import { StorageService } from './storage.service';
import { SettingsService } from '../settings.service';
import { ToastService } from '../toast.service';

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(() => {
    configure();
    storage = TestBed.inject(StorageService);
  });

  it('round-trips JSON values', () => {
    expect(storage.write('judo-master:test', { a: 1 })).toBeTrue();
    expect(storage.read('judo-master:test')).toEqual({ a: 1 });
    storage.remove('judo-master:test');
    expect(storage.read('judo-master:test')).toBeNull();
  });

  it('returns null for corrupt JSON', () => {
    localStorage.setItem('judo-master:test', '{oops');
    expect(storage.read('judo-master:test')).toBeNull();
  });

  it('reports a failed write instead of throwing', () => {
    spyOn(Storage.prototype, 'setItem').and.throwError('QuotaExceededError');
    expect(storage.write('judo-master:test', 1)).toBeFalse();
  });

  it('survives storage that throws on every access', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('SecurityError');
    spyOn(Storage.prototype, 'removeItem').and.throwError('SecurityError');
    expect(storage.read('judo-master:test')).toBeNull();
    expect(() => storage.remove('judo-master:test')).not.toThrow();
  });

  it('works without storage at all', () => {
    TestBed.resetTestingModule();
    configure([], [{ provide: DOCUMENT, useValue: { defaultView: null } }]);
    const none = TestBed.inject(StorageService);
    expect(none.write('k', 1)).toBeFalse();
    expect(none.read('k')).toBeNull();
    expect(() => none.remove('k')).not.toThrow();
  });
});

describe('ToastService', () => {
  let toasts: ToastService;

  beforeEach(() => {
    jasmine.clock().install();
    configure();
    toasts = TestBed.inject(ToastService);
  });

  afterEach(() => jasmine.clock().uninstall());

  it('shows and auto-dismisses messages, errors for longer', () => {
    toasts.success('ok');
    toasts.error('bad');
    toasts.info('fyi');
    expect(toasts.toasts().map(t => t.type)).toEqual(['success', 'error', 'info']);

    jasmine.clock().tick(3600);
    expect(toasts.toasts().map(t => t.type)).toEqual(['error']);
    jasmine.clock().tick(3000);
    expect(toasts.toasts()).toEqual([]);
  });

  it('keeps sticky messages and their action until dismissed', () => {
    const run = jasmine.createSpy('run');
    toasts.info('update', { sticky: true, action: { label: 'Go', run } });
    jasmine.clock().tick(60_000);
    expect(toasts.toasts()[0]?.action?.label).toBe('Go');
    toasts.dismiss(toasts.toasts()[0]!.id);
    expect(toasts.toasts()).toEqual([]);
  });

  it('clears pending timers on destroy', () => {
    toasts.success('ok');
    toasts.ngOnDestroy();
    jasmine.clock().tick(10_000);
    expect(toasts.toasts()).toHaveSize(1);
  });
});

describe('SettingsService', () => {
  const root = document.documentElement;

  afterEach(() => {
    root.classList.remove('dark', 'high-contrast');
    root.style.fontSize = '';
    root.style.colorScheme = '';
  });

  function create(): SettingsService {
    const theme = TestBed.inject(SettingsService);
    TestBed.tick();
    return theme;
  }

  it('starts light, as JudoKan does, whatever the system prefers', () => {
    configure();
    const theme = create();
    expect(theme.theme()).toBe('light');
    expect(theme.isDarkMode()).toBeFalse();
    expect(theme.highContrast()).toBeFalse();
    expect(root.classList.contains('dark')).toBeFalse();
  });

  it('applies and stores the chosen theme, contrast and font size', () => {
    configure();
    const theme = create();
    theme.toggleTheme();
    theme.setFontSize('large');
    theme.setHighContrast(true);
    TestBed.tick();

    expect(theme.isDarkMode()).toBeTrue();
    expect(root.classList.contains('dark')).toBeTrue();
    expect(root.classList.contains('high-contrast')).toBeTrue();
    expect(root.style.fontSize).toBe('112.5%');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)!)).toEqual({
      theme: 'dark',
      fontSize: 'large',
      highContrast: true,
    });

    // Back to the defaults: nothing left to store.
    theme.setTheme('light');
    theme.setFontSize('medium');
    theme.setHighContrast(false);
    TestBed.tick();
    expect(root.classList.contains('dark')).toBeFalse();
    expect(root.classList.contains('high-contrast')).toBeFalse();
    expect(root.style.fontSize).toBe('');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)!)).toEqual({});
  });

  it('restores stored settings', () => {
    configure();
    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify({ theme: 'dark', fontSize: 'small', highContrast: true })
    );
    const theme = create();
    expect(theme.theme()).toBe('dark');
    expect(theme.fontSize()).toBe('small');
    expect(theme.highContrast()).toBeTrue();
    expect(root.style.fontSize).toBe('87.5%');
  });

  it('migrates the settings stored before 2.1', () => {
    configure();
    localStorage.setItem('theme', JSON.stringify('dark'));
    localStorage.setItem('fontSize', '18');
    const theme = create();
    expect(theme.theme()).toBe('dark');
    expect(theme.fontSize()).toBe('large');
  });

  it('ignores invalid stored settings and starts light', () => {
    configure();
    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify({ theme: 'purple', fontSize: 'huge' })
    );
    localStorage.setItem('fontSize', '99');
    const theme = create();
    expect(theme.theme()).toBe('light');
    expect(theme.fontSize()).toBe('medium');
    expect(theme.isDarkMode()).toBeFalse();
  });
});

describe('celebrationOn', () => {
  it('knows each commemorative date, without overlaps', () => {
    expect(celebrationOn(new Date(2026, 9, 25))?.name).toBe('Dia do Judô');
    expect(celebrationOn(new Date(2026, 11, 24))?.name).toBe('Natal');
    expect(celebrationOn(new Date(2026, 11, 30))?.name).toBe('Natal');
    expect(celebrationOn(new Date(2026, 11, 31))?.name).toBe('Ano Novo');
    expect(celebrationOn(new Date(2027, 0, 1))?.name).toBe('Ano Novo');
    expect(celebrationOn(new Date(2027, 0, 7))?.name).toBe('Ano Novo');
    expect(celebrationOn(new Date(2027, 0, 8))).toBeNull();
    expect(celebrationOn(new Date(2026, 5, 15))).toBeNull();
  });

  it('is exposed by the service for today', () => {
    configure();
    expect(TestBed.inject(CelebrationService).currentCelebration()).toEqual(
      celebrationOn(new Date())
    );
  });
});

describe('ExportService', () => {
  let downloads: string[];
  // jsPDF starts its download on the next task.
  const nextTask = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 20));

  beforeEach(() => {
    configure();
    downloads = [];
    // Both libraries download through a temporary <a download> element.
    const record = function (this: HTMLAnchorElement): boolean {
      downloads.push(this.download);
      return true;
    };
    spyOn(HTMLAnchorElement.prototype, 'click').and.callFake(function (this: HTMLAnchorElement) {
      record.call(this);
    });
    spyOn(HTMLAnchorElement.prototype, 'dispatchEvent').and.callFake(record);
  });

  const sample = belt({
    techniques: [
      technique(),
      technique({ id: 2, name: 'Seoi-nage', category: 'NAGUE-WAZA - Te-waza' }),
    ],
  });

  it('downloads an Excel sheet named after the belt', async () => {
    await TestBed.inject(ExportService).exportToExcel(sample);
    expect(downloads).toHaveSize(1);
    expect(downloads[0]).toMatch(/^judo-master-11o-kyu-faixa-branca-\d{8}\.xlsx$/);
  });

  it('downloads a PDF named after the belt', async () => {
    await TestBed.inject(ExportService).exportToPdf(sample);
    await nextTask();
    expect(downloads).toHaveSize(1);
    expect(downloads[0]).toMatch(/^judo-master-11o-kyu-faixa-branca-\d{8}\.pdf$/);
  });

  it('paginates long belts', async () => {
    const many = Array.from({ length: 60 }, (_, i) =>
      technique({ id: i + 1, category: `Categoria ${i % 6}`, description: 'x'.repeat(200) })
    );
    await TestBed.inject(ExportService).exportToPdf(
      belt({ name: 'Faixa: [teste]', techniques: many })
    );
    await nextTask();
    expect(downloads).toHaveSize(1);
  });
});

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let toasts: ToastService;
  let reload: jasmine.Spy;
  let session: Map<string, string>;

  beforeEach(() => {
    session = new Map();
    reload = jasmine.createSpy('reload');
    const fakeWindow = {
      location: { reload },
      sessionStorage: {
        getItem: (k: string) => session.get(k) ?? null,
        setItem: (k: string, v: string) => session.set(k, v),
      },
    };
    configure(
      [],
      [GlobalErrorHandler, { provide: DOCUMENT, useValue: { defaultView: fakeWindow } }]
    );
    handler = TestBed.inject(GlobalErrorHandler);
    toasts = TestBed.inject(ToastService);
    spyOn(console, 'error');
  });

  it('logs the error and tells the user, once per quiet period', () => {
    handler.handleError(new Error('boom'));
    handler.handleError(new Error('again'));
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(toasts.toasts()).toHaveSize(1);
  });

  it('reloads once when a lazily loaded chunk of an old version is gone', () => {
    const stale = new Error('Failed to fetch dynamically imported module: chunk-ABC.js');
    handler.handleError(stale);
    expect(reload).toHaveBeenCalledTimes(1);
    handler.handleError(stale);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(toasts.toasts()).toHaveSize(1);
  });

  it('reports instead of reloading when session storage is blocked', () => {
    TestBed.resetTestingModule();
    const blocked = {
      location: { reload },
      sessionStorage: {
        getItem: () => {
          throw new Error('SecurityError');
        },
      },
    };
    configure([], [GlobalErrorHandler, { provide: DOCUMENT, useValue: { defaultView: blocked } }]);
    TestBed.inject(GlobalErrorHandler).handleError('ChunkLoadError');
    expect(reload).not.toHaveBeenCalled();
  });
});

describe('ScrollLockService', () => {
  beforeEach(() => configure());

  it('locks while any lock is held, and releases each lock once', () => {
    const service = TestBed.inject(ScrollLockService);
    const root = document.documentElement;
    const releaseA = service.lock();
    const releaseB = service.lock();
    expect(root.classList.contains('scroll-locked')).toBeTrue();
    releaseA();
    releaseA();
    expect(root.classList.contains('scroll-locked')).toBeTrue();
    releaseB();
    expect(root.classList.contains('scroll-locked')).toBeFalse();
  });

  it('pins the body on iOS, where overflow alone does not stop scrolling', () => {
    spyOnProperty(Navigator.prototype, 'userAgent').and.returnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'
    );
    const service = TestBed.inject(ScrollLockService);
    const release = service.lock();
    expect(document.body.style.position).toBe('fixed');
    release();
    expect(document.body.style.position).toBe('');
  });
});

describe('LegacyCacheCleanupService', () => {
  it('deletes only the caches of the old hand-written worker', async () => {
    const deleted: string[] = [];
    const caches = {
      keys: () =>
        Promise.resolve([
          'judo-master-v3',
          'judo-master-assets-v3',
          'ngsw:/Judo-Master/:db',
          'other',
        ]),
      delete: (name: string) => {
        deleted.push(name);
        return Promise.resolve(true);
      },
    };
    configure([], [{ provide: DOCUMENT, useValue: { defaultView: { caches } } }]);
    await TestBed.inject(LegacyCacheCleanupService).run();
    expect(deleted).toEqual(['judo-master-v3', 'judo-master-assets-v3']);
  });

  it('tolerates missing or failing Cache Storage', async () => {
    configure([], [{ provide: DOCUMENT, useValue: { defaultView: {} } }]);
    await expectAsync(TestBed.inject(LegacyCacheCleanupService).run()).toBeResolved();

    TestBed.resetTestingModule();
    const failing = { keys: () => Promise.reject(new Error('SecurityError')) };
    configure([], [{ provide: DOCUMENT, useValue: { defaultView: { caches: failing } } }]);
    await expectAsync(TestBed.inject(LegacyCacheCleanupService).run()).toBeResolved();
  });
});
