import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

import { Belt, GroupedTechnique, Technique } from '../../models/judo.model';

@Component({
    selector: 'app-technique-table',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './technique-table.component.html',
    styleUrl: './technique-table.component.scss',
})
export class TechniqueTableComponent {
    @Input({ required: true }) public belt!: Belt;
    @Input({ required: true }) public groupedTechniques: GroupedTechnique[] = [];
    @Input() public filterTerm = '';

    @Output() public readonly filterChange = new EventEmitter<string>();
    @Output() public readonly showDetail = new EventEmitter<Technique>();
    @Output() public readonly showVideo = new EventEmitter<Technique>();
    @Output() public readonly editTechnique = new EventEmitter<Technique>();
    @Output() public readonly deleteTechnique = new EventEmitter<Technique>();
    @Output() public readonly addTechnique = new EventEmitter<void>();
    @Output() public readonly exportExcel = new EventEmitter<void>();
    @Output() public readonly exportPdf = new EventEmitter<void>();

    protected onFilterInput(event: Event): void {
        this.filterChange.emit((event.target as HTMLInputElement).value);
    }

    protected onImageError(event: Event): void {
        (event.target as HTMLImageElement).style.display = 'none';
    }
}
