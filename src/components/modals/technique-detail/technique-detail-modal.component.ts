import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    afterNextRender,
    inject,
} from '@angular/core';

import { Technique } from '../../../models/judo.model';
import { focusFirstFocusable } from '../../../utils/modal-focus.util';

@Component({
    selector: 'app-technique-detail-modal',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './technique-detail-modal.component.html',
    styleUrl: './technique-detail-modal.component.scss',
})
export class TechniqueDetailModalComponent implements OnChanges {
    private readonly elementRef = inject(ElementRef);
    private readonly injector = inject(Injector);

    @Input() public technique: Technique | null = null;
    @Output() public readonly closed = new EventEmitter<void>();
    @Output() public readonly nextTechnique = new EventEmitter<void>();
    @Output() public readonly previousTechnique = new EventEmitter<void>();

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['technique'] && this.technique !== null) {
            afterNextRender(() => { this.focusFirst(); }, { injector: this.injector });
        }
    }

    private focusFirst(): void {
        focusFirstFocusable(this.elementRef.nativeElement as HTMLElement);
    }
}
