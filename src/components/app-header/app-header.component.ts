import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  public readonly openSettings = output<void>();
  protected readonly theme = inject(ThemeService);
}
