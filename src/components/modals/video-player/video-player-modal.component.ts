import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Technique } from '../../../models/judo.model';
import { youTubeEmbedUrl, youTubeWatchUrl } from '../../../utils/youtube.util';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-video-player-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-player-modal.component.html',
})
export class VideoPlayerModalComponent {
  private readonly sanitizer = inject(DomSanitizer);

  public readonly technique = input.required<Technique>();
  public readonly hasPrevious = input(false);
  public readonly hasNext = input(false);

  public readonly closed = output<void>();
  public readonly previous = output<void>();
  public readonly next = output<void>();

  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const url = youTubeEmbedUrl(this.technique().demoUrl);
    // Safe: built from a fixed YouTube origin and an id validated against
    // /^[\w-]{11}$/ — nothing from the user reaches the URL unchecked.
    // eslint-disable-next-line sonarjs/no-angular-bypass-sanitization
    return url === null ? null : this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  protected readonly watchUrl = computed(() => youTubeWatchUrl(this.technique().demoUrl));
}
