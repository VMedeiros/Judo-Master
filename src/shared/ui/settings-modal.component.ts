import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { APP_NAME, JUDOKAN_URL, QUOTES } from '../../core/constants/app.constants';
import { SettingsService } from '../../core/settings.service';
import { APP_VERSION } from '../../environments/version';
import { DisplayPreferencesComponent } from './display-preferences.component';
import { ModalComponent } from './modal.component';

/**
 * The settings menu, laid out as JudoKan's: display preferences, the app's own
 * data, the sibling app and what this one is.
 */
@Component({
  selector: 'app-settings-modal',
  imports: [ModalComponent, DisplayPreferencesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent {
  /** Whether there is anything to restore. */
  public readonly hasChanges = input(false);
  public readonly closed = output<void>();
  public readonly openAbout = output<void>();
  public readonly resetTechniques = output<void>();

  protected readonly settings = inject(SettingsService);
  protected readonly appName = APP_NAME;
  protected readonly version = APP_VERSION;
  protected readonly judokanUrl = JUDOKAN_URL;
  // Picking a quote to display is not security sensitive.
  // eslint-disable-next-line sonarjs/pseudo-random
  protected readonly quote = QUOTES[Math.floor(Math.random() * QUOTES.length)] ?? QUOTES[0]!;
}
