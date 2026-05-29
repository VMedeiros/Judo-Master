import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';

import { Belt } from '../../models/judo.model';

@Component({
    selector: 'app-belt-tabs',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './belt-tabs.component.html',
    styleUrl: './belt-tabs.component.scss',
})
export class BeltTabsComponent {
    @Input({ required: true }) public belts: Belt[] = [];
    @Input() public selectedIndex = 0;
    @Output() public readonly beltSelected = new EventEmitter<number>();

    @ViewChildren('tabBtn') private readonly tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

    protected onSelectChange(event: Event): void {
        this.beltSelected.emit(Number((event.target as HTMLSelectElement).value));
    }

    protected onTablistKeydown(event: KeyboardEvent): void {
        let next: number | null = null;
        if (event.key === 'ArrowRight') {
            next = Math.min(this.selectedIndex + 1, this.belts.length - 1);
        } else if (event.key === 'ArrowLeft') {
            next = Math.max(this.selectedIndex - 1, 0);
        } else if (event.key === 'Home') {
            next = 0;
        } else if (event.key === 'End') {
            next = this.belts.length - 1;
        }
        if (next !== null) {
            event.preventDefault();
            this.beltSelected.emit(next);
            this.tabButtons.get(next)?.nativeElement.focus();
        }
    }
}
