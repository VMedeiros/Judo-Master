/**
 * @fileoverview Main layout
 * The frame of the app, as JudoKan's: the backdrop, the header with the brand
 * and the settings, the page, the footer and the way back to the top. The
 * menus it opens (settings, about, restore) live here too.
 * @module layouts/main-layout
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_NAME } from '../core/constants/app.constants';
import { NavigationHistoryService } from '../core/services/navigation-history.service';
import { SettingsService } from '../core/settings.service';
import { TechniqueStateService } from '../core/technique-state.service';
import { TechniquesPageComponent } from '../features/techniques/techniques-page.component';
import { AboutModalComponent } from '../shared/ui/about-modal.component';
import { ConfirmModalComponent } from '../shared/ui/confirm-modal.component';
import { FooterComponent } from '../shared/ui/footer.component';
import { ScrollToTopComponent } from '../shared/ui/scroll-to-top.component';
import { SettingsModalComponent } from '../shared/ui/settings-modal.component';
import { TooltipDirective } from '../shared/ui/tooltip.directive';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    TechniquesPageComponent,
    FooterComponent,
    ScrollToTopComponent,
    SettingsModalComponent,
    AboutModalComponent,
    ConfirmModalComponent,
    TooltipDirective,
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  protected readonly state = inject(TechniqueStateService);
  protected readonly settings = inject(SettingsService);
  protected readonly history = inject(NavigationHistoryService);
  protected readonly appName = APP_NAME;
}
