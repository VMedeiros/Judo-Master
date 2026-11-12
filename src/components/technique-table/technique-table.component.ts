import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Belt, GroupedTechnique, Technique } from '../../models/judo.model';
import { isYouTubeUrl } from '../../utils/youtube.util';

@Component({
  selector: 'app-technique-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './technique-table.component.html',
})
export class TechniqueTableComponent {
  public readonly belt = input.required<Belt>();
  public readonly groupedTechniques = input.required<readonly GroupedTechnique[]>();
  public readonly filterTerm = input('');
  public readonly visibleCount = input(0);
  /** True while a download is being prepared. */
  public readonly exporting = input(false);

  public readonly filterChange = output<string>();
  public readonly showDetail = output<Technique>();
  public readonly showVideo = output<Technique>();
  public readonly editTechnique = output<Technique>();
  public readonly deleteTechnique = output<Technique>();
  public readonly addTechnique = output<void>();
  public readonly exportExcel = output<void>();
  public readonly exportPdf = output<void>();

  protected hasVideo(technique: Technique): boolean {
    return isYouTubeUrl(technique.demoUrl);
  }

  protected initials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }

  protected onFilterInput(event: Event): void {
    this.filterChange.emit((event.target as HTMLInputElement).value);
  }

  protected onImageError(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }
}
