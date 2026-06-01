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

import { focusFirstFocusable } from '../../../utils/modal-focus.util';
import { ThemeService } from '../../../services/theme.service';

@Component({
    selector: 'app-about-modal',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './about-modal.component.html',
    styleUrl: './about-modal.component.scss',
})
export class AboutModalComponent implements OnChanges {
    private readonly elementRef = inject(ElementRef);
    private readonly injector = inject(Injector);
    protected readonly theme = inject(ThemeService);

    @Input() public isOpen = false;
    @Output() public readonly closed = new EventEmitter<void>();

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen']?.currentValue === true) {
            afterNextRender(() => { this.focusFirst(); }, { injector: this.injector });
        }
    }

    private focusFirst(): void {
        focusFirstFocusable(this.elementRef.nativeElement as HTMLElement);
    }

    protected readonly benefits: readonly string[] = [
        'Desenvolvimento físico e força',
        'Coordenação motora e equilíbrio',
        'Disciplina e respeito (Rei)',
        'Confiança e autoestima',
        'Amizade e camaradagem',
        'Concentração e foco mental',
        'Autocontrole e paciência',
        'Resolução de conflitos',
    ];

    protected readonly values: ReadonlyArray<{ key: string; description: string }> = [
        { key: 'Rei (礼)', description: 'Respeito e cortesia' },
        { key: 'Yu (勇)', description: 'Coragem e bravura' },
        { key: 'Meiyo (名誉)', description: 'Honra e reputação' },
        { key: 'Makoto (誠)', description: 'Sinceridade e honestidade' },
    ];

    protected readonly techniqueCategories: ReadonlyArray<{ name: string; description: string }> = [
        { name: 'Nage-waza (投げ技)', description: 'Técnicas de projeção e arremesso' },
        { name: 'Katame-waza (固め技)', description: 'Técnicas de controle no solo' },
        { name: 'Shime-waza (締め技)', description: 'Técnicas de estrangulamento' },
        { name: 'Kansetsu-waza (関節技)', description: 'Técnicas de articulação de membros' },
    ];
}