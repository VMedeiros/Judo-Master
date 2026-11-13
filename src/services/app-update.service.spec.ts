import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';

import {
  AUTO_APPLY_WINDOW_MS,
  AppUpdateService,
  UPDATE_CHECK_MIN_GAP_MS,
} from './app-update.service';

describe('AppUpdateService', () => {
  let sw: { isEnabled: boolean; checkForUpdate: jasmine.Spy; activateUpdate: jasmine.Spy };
  let reload: jasmine.Spy;

  function create(enabled = true): AppUpdateService {
    sw.isEnabled = enabled;
    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: sw },
        {
          provide: DOCUMENT,
          // The real document, with a reload that does not reload the test page.
          useFactory: () =>
            new Proxy(document, {
              get: (target, prop) => {
                if (prop === 'location') return { reload };
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
    sw = {
      isEnabled: true,
      checkForUpdate: jasmine.createSpy('checkForUpdate').and.resolveTo(false),
      activateUpdate: jasmine.createSpy('activateUpdate').and.resolveTo(true),
    };
  });

  afterEach(() => jasmine.clock().uninstall());

  it('looks for a new version when the app comes back to the foreground, not too often', () => {
    create().start();
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('visibilitychange'));
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(UPDATE_CHECK_MIN_GAP_MS + 1);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('keeps looking while the app stays open', () => {
    create().start();
    jasmine.clock().tick(30 * 60 * 1000);
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(1);
  });

  it('knows the app was just opened or brought back, not when it stayed open', () => {
    const service = create();
    service.start();
    expect(service.justArrived()).toBeTrue();
    jasmine.clock().tick(AUTO_APPLY_WINDOW_MS + 1);
    expect(service.justArrived()).toBeFalse();
    // The half-hour check alone is not an arrival.
    jasmine.clock().tick(30 * 60 * 1000);
    expect(service.justArrived()).toBeFalse();
    document.dispatchEvent(new Event('visibilitychange'));
    expect(service.justArrived()).toBeTrue();
  });

  it('survives a failed check', async () => {
    sw.checkForUpdate.and.rejectWith(new Error('offline'));
    spyOn(console, 'warn');
    await expectAsync(create().check()).toBeResolved();
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
  });
});
