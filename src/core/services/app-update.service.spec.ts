import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';

import { STORAGE_KEYS } from '../constants/app.constants';
import { APP_VERSION } from '../../environments/version';
import {
  AUTO_APPLY_WINDOW_MS,
  AppUpdateService,
  UPDATE_CHECK_INTERVAL_MS,
  UPDATE_CHECK_MIN_GAP_MS,
  isNewerVersion,
} from './app-update.service';

const BASE = 'https://vmedeiros.github.io/Judo-Master/';
const [major = 0, minor = 0, patch = 0] = APP_VERSION.split('.').map(Number);
const NEXT_VERSION = `${major}.${minor}.${patch + 1}`;

describe('AppUpdateService', () => {
  let sw: {
    isEnabled: boolean;
    versionUpdates: Subject<VersionEvent>;
    checkForUpdate: jasmine.Spy;
    activateUpdate: jasmine.Spy;
  };
  let reload: jasmine.Spy;
  let replace: jasmine.Spy;
  let fetchSpy: jasmine.Spy;
  let getRegistration: jasmine.Spy;
  let unregister: jasmine.Spy;
  let cacheNames: string[];
  let deleteCache: jasmine.Spy;
  let replaceState: jasmine.Spy;
  let pageUrl: string;

  function publish(version: string | null): void {
    fetchSpy.and.callFake(() =>
      version === null
        ? Promise.reject(new TypeError('offline'))
        : Promise.resolve(new Response(JSON.stringify({ version }), { status: 200 }))
    );
  }

  function create(enabled = true): AppUpdateService {
    sw.isEnabled = enabled;
    // The real window, with the network, workers, caches and address faked.
    const view = new Proxy(window, {
      get: (target, prop) => {
        if (prop === 'fetch') return fetchSpy;
        if (prop === 'caches')
          return { keys: () => Promise.resolve(cacheNames), delete: deleteCache };
        if (prop === 'navigator') return { serviceWorker: { getRegistration } };
        if (prop === 'location') return { href: pageUrl };
        if (prop === 'history') return { state: null, replaceState };
        const value = Reflect.get(target, prop, target) as unknown;
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: sw },
        {
          provide: DOCUMENT,
          useFactory: () =>
            new Proxy(document, {
              get: (target, prop) => {
                if (prop === 'location') return { reload, replace };
                if (prop === 'defaultView') return view;
                if (prop === 'baseURI') return BASE;
                const value = Reflect.get(target, prop, target) as unknown;
                return typeof value === 'function' ? value.bind(target) : value;
              },
            }),
        },
      ],
    });
    return TestBed.inject(AppUpdateService);
  }

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 10, 13, 12));
    reload = jasmine.createSpy('reload');
    replace = jasmine.createSpy('replace');
    fetchSpy = jasmine.createSpy('fetch');
    publish(APP_VERSION);
    unregister = jasmine.createSpy('unregister').and.resolveTo(true);
    getRegistration = jasmine
      .createSpy('getRegistration')
      .and.callFake((scope: string) => Promise.resolve({ scope, unregister }));
    cacheNames = [
      'ngsw:/Judo-Master/:db:control',
      'ngsw:/Judo-Master/:1:assets:app:cache',
      'ngsw:/Other/:db:control',
    ];
    deleteCache = jasmine.createSpy('delete').and.resolveTo(true);
    replaceState = jasmine.createSpy('replaceState');
    pageUrl = BASE;
    sessionStorage.removeItem(STORAGE_KEYS.UPDATE_RECOVERY);
    sw = {
      isEnabled: true,
      versionUpdates: new Subject(),
      checkForUpdate: jasmine.createSpy('checkForUpdate').and.resolveTo(false),
      activateUpdate: jasmine.createSpy('activateUpdate').and.resolveTo(true),
    };
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    sessionStorage.removeItem(STORAGE_KEYS.UPDATE_RECOVERY);
  });

  it('looks for a new version on opening and on coming back, not too often', () => {
    create().start();
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(1);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(UPDATE_CHECK_MIN_GAP_MS + 1);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('keeps looking while the app stays open', () => {
    create().start();
    jasmine.clock().tick(UPDATE_CHECK_INTERVAL_MS);
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('knows the app was just opened or brought back, not when it stayed open', () => {
    const service = create();
    service.start();
    expect(service.justArrived()).toBeTrue();
    jasmine.clock().tick(AUTO_APPLY_WINDOW_MS + 1);
    expect(service.justArrived()).toBeFalse();
    // The half-hour check alone is not an arrival.
    jasmine.clock().tick(UPDATE_CHECK_INTERVAL_MS);
    expect(service.justArrived()).toBeFalse();
    document.dispatchEvent(new Event('visibilitychange'));
    expect(service.justArrived()).toBeTrue();
  });

  it('survives a failed check while offline', async () => {
    sw.checkForUpdate.and.rejectWith(new Error('offline'));
    publish(null);
    spyOn(console, 'warn');
    const service = create();
    const stalled = jasmine.createSpy('stalled');
    service.stalled.subscribe(stalled);
    await expectAsync(service.check()).toBeResolved();
    expect(stalled).not.toHaveBeenCalled();
  });

  it('reports a stuck worker: the server has a newer version it did not download', async () => {
    publish(NEXT_VERSION);
    const service = create();
    const stalled = jasmine.createSpy('stalled');
    service.stalled.subscribe(stalled);
    await service.check();
    expect(stalled).toHaveBeenCalledOnceWith(NEXT_VERSION);
    const asked = new URL(fetchSpy.calls.mostRecent().args[0] as string);
    expect(asked.pathname).toBe('/Judo-Master/version.json');
    expect(asked.searchParams.has('ngsw-bypass')).toBeTrue();
  });

  it('does not report a worker that delivers, nor a version that is not newer', async () => {
    const service = create();
    const stalled = jasmine.createSpy('stalled');
    service.stalled.subscribe(stalled);

    await service.check();
    publish(NEXT_VERSION);
    sw.checkForUpdate.and.resolveTo(true);
    jasmine.clock().tick(UPDATE_CHECK_MIN_GAP_MS + 1);
    await service.check();
    expect(stalled).not.toHaveBeenCalled();
  });

  it('does not report again a version this tab already recovered to', async () => {
    publish(NEXT_VERSION);
    sessionStorage.setItem(STORAGE_KEYS.UPDATE_RECOVERY, NEXT_VERSION);
    const service = create();
    const stalled = jasmine.createSpy('stalled');
    service.stalled.subscribe(stalled);
    await service.check();
    expect(stalled).not.toHaveBeenCalled();
  });

  it('recovers by dropping only its own worker and caches, then loading the new version', async () => {
    await create().recover(NEXT_VERSION);
    expect(getRegistration).toHaveBeenCalledWith(BASE);
    expect(unregister).toHaveBeenCalled();
    expect(deleteCache.calls.allArgs().flat()).toEqual([
      'ngsw:/Judo-Master/:db:control',
      'ngsw:/Judo-Master/:1:assets:app:cache',
    ]);
    expect(sessionStorage.getItem(STORAGE_KEYS.UPDATE_RECOVERY)).toBe(NEXT_VERSION);
    expect(replace).toHaveBeenCalledOnceWith(`${BASE}?v=${NEXT_VERSION}`);
  });

  it('leaves a sibling project’s worker alone, and loads the new version even if resetting fails', async () => {
    getRegistration.and.resolveTo({ scope: 'https://vmedeiros.github.io/', unregister });
    deleteCache.and.rejectWith(new Error('denied'));
    spyOn(console, 'warn');
    await create().recover(NEXT_VERSION);
    expect(unregister).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalled();
  });

  it('removes the recovery mark from the address', () => {
    pageUrl = `${BASE}?v=${NEXT_VERSION}`;
    create().start();
    expect(replaceState).toHaveBeenCalledOnceWith(null, '', BASE);
  });

  it('switches to the new version and reloads, even if activating fails', async () => {
    const service = create();
    await service.apply();
    expect(sw.activateUpdate).toHaveBeenCalled();
    expect(reload).toHaveBeenCalledTimes(1);

    sw.activateUpdate.and.rejectWith(new Error('no worker'));
    spyOn(console, 'warn');
    await service.apply();
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('does nothing without a service worker', async () => {
    const service = create(false);
    service.start();
    await service.check();
    expect(sw.checkForUpdate).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('compares versions number by number', () => {
    expect(isNewerVersion('2.2.10', '2.2.9')).toBeTrue();
    expect(isNewerVersion('3.0.0', '2.9.9')).toBeTrue();
    expect(isNewerVersion('2.2.1', '2.2.1')).toBeFalse();
    expect(isNewerVersion('2.2.0', '2.2.1')).toBeFalse();
    expect(isNewerVersion('x', '2.2.1')).toBeFalse();
  });
});
