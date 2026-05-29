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
import { SafeResourceUrl } from '@angular/platform-browser';

import { Technique } from '../../../models/judo.model';
import { focusFirstFocusable } from '../../../utils/modal-focus.util';

@Component({
    selector: 'app-video-player-modal',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './video-player-modal.component.html',
    styleUrl: './video-player-modal.component.scss',
})
export class VideoPlayerModalComponent implements OnChanges {
    private readonly elementRef = inject(ElementRef);
    private readonly injector = inject(Injector);

    @Input() public technique: Technique | null = null;
    @Input() public safeUrl: SafeResourceUrl | null = null;
    @Output() public readonly closed = new EventEmitter<void>();
    @Output() public readonly nextVideo = new EventEmitter<void>();
    @Output() public readonly previousVideo = new EventEmitter<void>();

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['technique'] && this.technique !== null) {
            afterNextRender(() => { this.focusFirst(); }, { injector: this.injector });
        }
    }

    private focusFirst(): void {
        focusFirstFocusable(this.elementRef.nativeElement as HTMLElement);
    }
}
