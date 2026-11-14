import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

import { AppUpdateService } from './core/services/app-update.service';
import { LegacyCacheCleanupService } from './core/services/legacy-cache-cleanup.service';
import { NavigationHistoryService } from './core/services/navigation-history.service';
import { SettingsService } from './core/settings.service';
import { ToastService } from './core/toast.service';
import { ToastComponent } from './shared/ui/toast.component';

/**
 * What every page shares, as in JudoKan: the skip link, the page itself, the
 * notifications and the offer to switch to a new version.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, ToastComponent],
})
export class AppComponent {
  private readonly toast = inject(ToastService);
  private readonly appUpdate = inject(AppUpdateService);
  private readonly document = inject(DOCUMENT);

  constructor() {
    // Applies the saved theme, contrast and text size as soon as the app starts.
    inject(SettingsService);
    // Started now, so the "Voltar" button knows the first page too.
    inject(NavigationHistoryService);
    void inject(LegacyCacheCleanupService).run();
    this.offerUpdates(inject(SwUpdate), inject(DestroyRef));
    this.appUpdate.start();
  }

  /** Moves focus to the page itself, so the next Tab starts there. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main-content')?.focus();
  }

  /**
   * When a new version is out, switch to it: right away if the app was just
   * opened and nothing is in progress, otherwise once the person agrees, so a
   * reload never interrupts them. The new version normally comes through the
   * service worker; when the worker is stuck, the app recovers on its own.
   */
  private offerUpdates(updates: SwUpdate, destroyRef: DestroyRef): void {
    if (!updates.isEnabled) return;
    updates.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(() => this.switchVersion(() => this.appUpdate.apply()));
    this.appUpdate.stalled
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(version => this.switchVersion(() => this.appUpdate.recover(version)));
    updates.unrecoverable.pipe(takeUntilDestroyed(destroyRef)).subscribe(() =>
      this.toast.info('Esta versão do app ficou desatualizada. Recarregue para continuar.', {
        sticky: true,
        action: { label: 'Recarregar', run: () => globalThis.location.reload() },
      })
    );
  }

  private switchVersion(run: () => Promise<void>): void {
    // An open dialog means something is in progress, on any page.
    const busy = this.document.querySelector('dialog[open]') !== null;
    if (this.appUpdate.justArrived() && !busy) {
      void run();
      return;
    }
    this.toast.info('Uma nova versão do Judô Master está disponível.', {
      sticky: true,
      action: { label: 'Atualizar', run: () => void run() },
    });
  }
}
