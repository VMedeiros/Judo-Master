/**
 * Table sorting, as JudoKan's (src/shared/utils/table.ts there): the same
 * arrows, the same aria-sort, the same second-click-reverses behaviour.
 * Here a table may start unsorted, in the order its data comes in.
 */
import { signal } from '@angular/core';

export type SortDirection = 'asc' | 'desc';
export type AriaSort = 'ascending' | 'descending' | 'none';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/** Three-way comparison: numbers numerically, everything else as text. */
export function compareValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return collator.compare(String(a), String(b));
}

/** Sorted copy of `items` — never mutates the input (it may be signal state). */
export function sortedBy<T>(
  items: readonly T[],
  value: (item: T) => string | number,
  direction: SortDirection
): T[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => compareValues(value(a), value(b)) * factor);
}

/** Sorting state of a data table. Judô Master has no pagination: a belt's techniques are listed whole, by category. */
export class TableState<Column extends string> {
  public readonly sortCol;
  public readonly sortDir;

  constructor(initialColumn: Column | null, initialDirection: SortDirection = 'asc') {
    this.sortCol = signal<Column | null>(initialColumn);
    this.sortDir = signal<SortDirection>(initialDirection);
  }

  /** Sorts by `col`; a second click on the same column reverses the order. */
  public sortBy(col: Column): void {
    if (this.sortCol() === col) {
      this.sortDir.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortCol.set(col);
      this.sortDir.set('asc');
    }
  }

  public icon(col: Column): string {
    if (this.sortCol() !== col) return 'unfold_more';
    return this.sortDir() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  public ariaSort(col: Column): AriaSort {
    if (this.sortCol() !== col) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }
}
