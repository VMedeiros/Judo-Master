import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  effect,
  inject,
} from '@angular/core';

import { AppHeaderComponent } from './components/app-header/app-header.component';
import { BeltTabsComponent } from './components/belt-tabs/belt-tabs.component';
import { CelebrationBannerComponent } from './components/celebration-banner/celebration-banner.component';
import { AboutModalComponent } from './components/modals/about-modal/about-modal.component';
import { DeleteConfirmModalComponent } from './components/modals/delete-confirm/delete-confirm-modal.component';
import { TechniqueDetailModalComponent } from './components/modals/technique-detail/technique-detail-modal.component';
import { TechniqueFormModalComponent } from './components/modals/technique-form/technique-form-modal.component';
import { VideoPlayerModalComponent } from './components/modals/video-player/video-player-modal.component';
import { TechniqueTableComponent } from './components/technique-table/technique-table.component';
import { ToastComponent } from './components/toast/toast.component';
import { CelebrationService } from './services/celebration.service';
import { ExportService } from './services/export.service';
import { TechniqueStateService } from './services/technique-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AppHeaderComponent,
    BeltTabsComponent,
    TechniqueTableComponent,
    CelebrationBannerComponent,
    AboutModalComponent,
    TechniqueDetailModalComponent,
    TechniqueFormModalComponent,
    DeleteConfirmModalComponent,
    VideoPlayerModalComponent,
    ToastComponent,
  ],
})
export class AppComponent {
  protected readonly state = inject(TechniqueStateService);
  private readonly exportService = inject(ExportService);
  private readonly celebrationService = inject(CelebrationService);

  public readonly currentYear = new Date().getFullYear();
  public readonly currentCelebration = this.celebrationService.currentCelebration;

  constructor() {
    effect(() => { this.syncBodyScroll(); });
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.state.closeAllModals();
  }

  public onExportExcel(): void {
    const belt = this.state.selectedBelt();
    if (belt) this.exportService.exportToExcel(belt);
  }

  public onExportPdf(): void {
    const belt = this.state.selectedBelt();
    if (belt) this.exportService.exportToPDF(belt);
  }

  private syncBodyScroll(): void {
    document.body.style.overflow = this.state.hasAnyModalOpen() ? 'hidden' : '';
  }
}