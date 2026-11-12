import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChildren,
} from '@angular/core';

import { Belt } from '../../models/judo.model';

@Component({
  selector: 'app-belt-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './belt-tabs.component.html',
})
export class BeltTabsComponent {
  public readonly belts = input.required<readonly Belt[]>();
  public readonly selectedIndex = input(0);
  public readonly beltSelected = output<number>();

  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  protected onSelectChange(event: Event): void {
    this.beltSelected.emit(Number((event.target as HTMLSelectElement).value));
  }

  /** WAI-ARIA tabs: arrows move (and wrap), Home and End jump to the ends. */
  protected onTablistKeydown(event: KeyboardEvent): void {
    const count = this.belts().length;
    if (count === 0) return;
    // Start from the focused tab, not the input: with key repeat the next
    // keydown can arrive before the new selection has been rendered.
    const focused = this.tabButtons().findIndex(tab => tab.nativeElement === event.target);
    const current = focused === -1 ? this.selectedIndex() : focused;
    const targets: Partial<Record<string, number>> = {
      ArrowRight: (current + 1) % count,
      ArrowLeft: (current - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.beltSelected.emit(next);
    this.tabButtons()[next]?.nativeElement.focus();
  }
}
