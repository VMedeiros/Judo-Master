/**
 * @fileoverview The belts on the home page
 * One card per belt, each opening the techniques page on that belt. Deferred
 * by the home page, so the techniques data only loads when this is about to be
 * seen.
 * @module features/home/belts-overview
 */

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { beltFillOf } from '../../core/constants/belt.constants';
import { JudoDataService } from '../../core/judo-data.service';
import { isYouTubeUrl } from '../../shared/utils/youtube.util';

@Component({
  selector: 'app-belts-overview',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // A block, so the spacing of the page around it applies.
  host: { class: 'block' },
  template: `
    <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      @for (belt of belts(); track belt.id) {
        <li>
          <a
            routerLink="/tecnicas"
            [queryParams]="{ faixa: belt.id }"
            class="card group flex h-full flex-col gap-3 p-4 transition-colors hover:border-accent-300 dark:hover:border-accent-700"
          >
            <span class="h-2.5 w-10 rounded-full" [class]="belt.fill" aria-hidden="true"></span>
            <span
              class="group-hover:text-primary-600 dark:group-hover:text-accent-300 font-bold text-gray-900 dark:text-white"
            >
              {{ belt.name }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ belt.count }} {{ belt.count === 1 ? 'técnica' : 'técnicas' }}
              @if (belt.videos > 0) {
                · {{ belt.videos }} com vídeo
              }
            </span>
            <span class="mt-auto text-xs text-gray-600 dark:text-gray-400">{{
              belt.ageGroup
            }}</span>
          </a>
        </li>
      }
    </ul>
  `,
})
export class BeltsOverviewComponent {
  private readonly data = inject(JudoDataService);

  /** The belts as this device has them, with what each one holds. */
  protected readonly belts = computed(() =>
    this.data.belts().map(belt => ({
      id: belt.id,
      name: belt.name,
      ageGroup: belt.ageGroup,
      fill: beltFillOf(belt.name),
      count: belt.techniques.length,
      videos: belt.techniques.filter(t => isYouTubeUrl(t.demoUrl)).length,
    }))
  );
}
