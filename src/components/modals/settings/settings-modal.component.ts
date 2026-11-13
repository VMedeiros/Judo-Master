import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { APP_NAME, FONT_SIZE_OPTIONS, QUOTES } from '../../../constants/app.constants';
import { APP_VERSION } from '../../../environments/version';
import { ThemeService } from '../../../services/theme.service';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-settings-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent {
  /** Whether there is anything to restore. */
  public readonly hasChanges = input(false);
  public readonly closed = output<void>();
  public readonly openAbout = output<void>();
  public readonly resetTechniques = output<void>();

  protected readonly theme = inject(ThemeService);
  protected readonly fontSizes = FONT_SIZE_OPTIONS;
  protected readonly appName = APP_NAME;
  protected readonly version = APP_VERSION;
  // Picking a quote to display is not security sensitive.
  // eslint-disable-next-line sonarjs/pseudo-random
  protected readonly quote = QUOTES[Math.floor(Math.random() * QUOTES.length)] ?? '';

  protected readonly indicatorLeft = computed(() => {
    const index = this.fontSizes.findIndex(o => o.value === this.theme.fontSize());
    return `calc(${index * 33.33}% + 2px)`;
  });
}
