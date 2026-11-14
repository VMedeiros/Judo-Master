import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CommemorativeDate } from '../../core/services/celebration.service';

@Component({
  selector: 'app-celebration-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './celebration-banner.component.html',
})
export class CelebrationBannerComponent {
  public readonly celebration = input<CommemorativeDate | null>(null);
}
