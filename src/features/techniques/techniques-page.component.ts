/**
 * @fileoverview The techniques page
 * The belts, the techniques of the chosen one, and the dialogs that show,
 * play, edit and remove a technique.
 * @module features/techniques/techniques-page
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CelebrationService } from '../../core/services/celebration.service';
import { ExportService } from '../../core/services/export.service';
import { TechniqueStateService } from '../../core/technique-state.service';
import { ToastService } from '../../core/toast.service';
import { ConfirmModalComponent } from '../../shared/ui/confirm-modal.component';
import { BeltTabsComponent } from './belt-tabs.component';
import { CelebrationBannerComponent } from './celebration-banner.component';
import { TechniqueDetailModalComponent } from './technique-detail-modal.component';
import { TechniqueFormModalComponent } from './technique-form-modal.component';
import { TechniqueTableComponent } from './technique-table.component';
import { VideoPlayerModalComponent } from './video-player-modal.component';

@Component({
  selector: 'app-techniques-page',
  imports: [
    BeltTabsComponent,
    CelebrationBannerComponent,
    TechniqueTableComponent,
    TechniqueDetailModalComponent,
    TechniqueFormModalComponent,
    VideoPlayerModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './techniques-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechniquesPageComponent {
  protected readonly state = inject(TechniqueStateService);
  protected readonly celebration = inject(CelebrationService).currentCelebration;
  private readonly exportService = inject(ExportService);
  private readonly toast = inject(ToastService);

  protected readonly exporting = signal(false);

  constructor() {
    const route = inject(ActivatedRoute, { optional: true });
    const router = inject(Router, { optional: true });

    // Opened on a belt (/tecnicas?faixa=3, from the home page or a shared link): start on it.
    const id = Number(route?.snapshot.queryParamMap.get('faixa'));
    const index = id ? this.state.belts().findIndex(belt => belt.id === id) : -1;
    if (index >= 0) this.state.selectBelt(index);

    // The address names the belt on screen, so a reload or a shared link opens
    // the same one. It takes the place of the current entry: switching belts
    // does not pile up pages for "Back" to go through.
    effect(() => {
      const belt = this.state.selectedBelt()?.id;
      // Only on its own page: outside a route (a test, say) there is no address to keep.
      if (belt === undefined || !route?.snapshot.routeConfig || !router) return;
      if (route.snapshot.queryParamMap.get('faixa') === String(belt)) return;
      untracked(
        () =>
          void router.navigate([], {
            relativeTo: route,
            queryParams: { faixa: belt },
            replaceUrl: true,
          })
      );
    });
  }

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
}
