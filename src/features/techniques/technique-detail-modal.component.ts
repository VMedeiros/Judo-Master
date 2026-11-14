import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Technique } from '../../core/domain/judo.model';
import { isYouTubeUrl } from '../../shared/utils/youtube.util';
import { ModalComponent } from '../../shared/ui/modal.component';

@Component({
  selector: 'app-technique-detail-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './technique-detail-modal.component.html',
})
export class TechniqueDetailModalComponent {
  public readonly technique = input.required<Technique>();
  public readonly hasPrevious = input(false);
  public readonly hasNext = input(false);

  public readonly closed = output<void>();
  public readonly previous = output<void>();
  public readonly next = output<void>();
  public readonly watchVideo = output<void>();

  protected readonly hasVideo = computed(() => isYouTubeUrl(this.technique().demoUrl));
}
