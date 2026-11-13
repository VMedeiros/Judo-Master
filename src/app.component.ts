import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

import { AppHeaderComponent } from './components/app-header/app-header.component';
import { BeltTabsComponent } from './components/belt-tabs/belt-tabs.component';
import { CelebrationBannerComponent } from './components/celebration-banner/celebration-banner.component';
import { AboutModalComponent } from './components/modals/about-modal/about-modal.component';
import { ConfirmModalComponent } from './components/modals/confirm/confirm-modal.component';
import { SettingsModalComponent } from './components/modals/settings/settings-modal.component';
import { TechniqueDetailModalComponent } from './components/modals/technique-detail/technique-detail-modal.component';
import { TechniqueFormModalComponent } from './components/modals/technique-form/technique-form-modal.component';
import { VideoPlayerModalComponent } from './components/modals/video-player/video-player-modal.component';
import { TechniqueTableComponent } from './components/technique-table/technique-table.component';
import { ToastComponent } from './components/toast/toast.component';
import { APP_NAME } from './constants/app.constants';
import { AppUpdateService } from './services/app-update.service';
import { CelebrationService } from './services/celebration.service';
import { ExportService } from './services/export.service';
import { LegacyCacheCleanupService } from './services/legacy-cache-cleanup.service';
import { TechniqueStateService } from './services/technique-state.service';
import { ThemeService } from './services/theme.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  imports: [
    AppHeaderComponent,
    BeltTabsComponent,
    CelebrationBannerComponent,
    TechniqueTableComponent,
    ToastComponent,
    AboutModalComponent,
    ConfirmModalComponent,
    SettingsModalComponent,
    TechniqueDetailModalComponent,
    TechniqueFormModalComponent,
    VideoPlayerModalComponent,
  ],
})
export class AppComponent {
  protected readonly state = inject(TechniqueStateService);
  protected readonly celebration = inject(CelebrationService).currentCelebration;
  private readonly exportService = inject(ExportService);
  private readonly toast = inject(ToastService);
  private readonly appUpdate = inject(AppUpdateService);

  protected readonly appName = APP_NAME;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly exporting = signal(false);

  /** Whether the open detail or video dialog can step back or forward. */
  protected readonly navigation = computed(() => {
    const modal = this.state.modal();
    if (modal.kind !== 'detail' && modal.kind !== 'video') return { previous: false, next: false };
    const withVideo = modal.kind === 'video';
    return {
      previous: this.state.neighbor(modal.technique, -1, withVideo) !== null,
      next: this.state.neighbor(modal.technique, 1, withVideo) !== null,
    };
  });

  constructor() {
    // Applies the saved theme as soon as the app starts.
    inject(ThemeService);
    void inject(LegacyCacheCleanupService).run();
    this.offerUpdates(inject(SwUpdate), inject(DestroyRef));
    this.appUpdate.start();
  }

  protected async export(format: 'excel' | 'pdf'): Promise<void> {
    const belt = this.state.selectedBelt();
    if (!belt || this.exporting()) return;
    this.exporting.set(true);
    try {
      if (format === 'excel') await this.exportService.exportToExcel(belt);
      else await this.exportService.exportToPdf(belt);
    } catch (error: unknown) {
      console.error(error);
      this.toast.error('Não foi possível gerar o arquivo. Verifique a conexão e tente novamente.');
    } finally {
      this.exporting.set(false);
    }
  }

  protected watchVideoFromDetail(): void {
    const modal = this.state.modal();
    if (modal.kind === 'detail') this.state.openVideo(modal.technique);
  }

  /**
   * When a new version has been downloaded in the background, switch to it
   * right away if the app was just opened and nothing is in progress;
   * otherwise offer it, so a reload never interrupts the person.
   */
  private offerUpdates(updates: SwUpdate, destroyRef: DestroyRef): void {
    if (!updates.isEnabled) return;
    updates.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(() => {
        if (this.appUpdate.justArrived() && this.state.modal().kind === 'none') {
          void this.appUpdate.apply();
          return;
        }
        this.toast.info('Uma nova versão do Judô Master está disponível.', {
          sticky: true,
          action: { label: 'Atualizar', run: () => void this.appUpdate.apply() },
        });
      });
    updates.unrecoverable.pipe(takeUntilDestroyed(destroyRef)).subscribe(() =>
      this.toast.info('Esta versão do app ficou desatualizada. Recarregue para continuar.', {
        sticky: true,
        action: { label: 'Recarregar', run: () => globalThis.location.reload() },
      })
    );
  }
}
