import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { beltFillOf } from '../../core/constants/belt.constants';
import { Belt, GroupedTechnique, Technique } from '../../core/domain/judo.model';
import { TooltipDirective } from '../../shared/ui/tooltip.directive';
import { TableState, sortedBy } from '../../shared/utils/table';
import { isYouTubeUrl } from '../../shared/utils/youtube.util';

type SortColumn = 'name' | 'translation';

/**
 * The belt and its techniques, laid out as JudoKan's lists: the banner, the
 * toolbar and the search above, then the table alone in its card. Categories
 * keep the curriculum order; inside each one the columns sort on request.
 */
@Component({
  selector: 'app-technique-table',
  imports: [TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // A block, so the spacing of the page around it applies.
  host: { class: 'block' },
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

  /** Unsorted at first: the techniques come in the order the exam lists them. */
  protected readonly table = new TableState<SortColumn>(null);

  /** The groups, each sorted by the chosen column when there is one. */
  protected readonly groups = computed(() => {
    const column = this.table.sortCol();
    const direction = this.table.sortDir();
    if (!column) return this.groupedTechniques();
    return this.groupedTechniques().map(group => ({
      ...group,
      techniques: sortedBy(group.techniques, t => t[column], direction),
    }));
  });

  protected readonly beltFill = computed(() => beltFillOf(this.belt().name));

  protected hasVideo(technique: Technique): boolean {
    return isYouTubeUrl(technique.demoUrl);
  }

  /** As JudoKan's avatars: the first letter of the first and the last word ("O-soto-gari" is OG). */
  protected initials(name: string): string {
    const words = name.split(/[\s-]+/).filter(Boolean);
    if (words.length === 1) return name.slice(0, 2).toUpperCase();
    return `${words[0]![0]}${words.at(-1)![0]}`.toUpperCase();
  }

  protected onFilterInput(event: Event): void {
    this.filterChange.emit((event.target as HTMLInputElement).value);
  }
}
