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

import { TECHNIQUE_CATEGORIES } from '../../../constants/app.constants';
import { focusFirstFocusable } from '../../../utils/modal-focus.util';
import { FormMode, FormSaveEvent, Technique, TechniqueFormData } from '../../../models/judo.model';

@Component({
    selector: 'app-technique-form-modal',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './technique-form-modal.component.html',
    styleUrl: './technique-form-modal.component.scss',
})
export class TechniqueFormModalComponent implements OnChanges {
    private readonly elementRef = inject(ElementRef);
    private readonly injector = inject(Injector);

    @Input() public technique: Technique | null = null;
    @Input() public mode: FormMode = 'add';
    @Output() public readonly closed = new EventEmitter<void>();
    @Output() public readonly saved = new EventEmitter<FormSaveEvent>();

    protected readonly categories: ReadonlyArray<string> = TECHNIQUE_CATEGORIES;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['technique'] && this.technique !== null) {
            afterNextRender(() => { this.focusFirst(); }, { injector: this.injector });
        }
    }

    private focusFirst(): void {
        focusFirstFocusable(this.elementRef.nativeElement as HTMLElement);
    }

    protected onSubmit(event: Event): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const fd = new FormData(form);
        const demoUrl = (fd.get('demoUrl') as string).trim();

        if (demoUrl && !this.isYouTubeUrl(demoUrl)) {
            form.elements.namedItem('demoUrl') instanceof HTMLInputElement &&
                (form.elements.namedItem('demoUrl') as HTMLInputElement).setCustomValidity(
                    'URL deve ser do YouTube (youtube.com ou youtu.be)',
                );
            form.reportValidity();
            return;
        }

        const data: TechniqueFormData = {
            id: this.technique?.id,
            name: (fd.get('name') as string).trim(),
            translation: (fd.get('translation') as string).trim(),
            description: (fd.get('description') as string).trim(),
            execution: (fd.get('execution') as string).trim(),
            application: (fd.get('application') as string).trim(),
            demoUrl,
            category: fd.get('category') as string,
        };
        this.saved.emit({ data, mode: this.mode });
    }

    private isYouTubeUrl(url: string): boolean {
        try {
            const { hostname } = new URL(url);
            return hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'youtu.be';
        } catch {
            return false;
        }
    }

    protected clearUrlValidity(event: Event): void {
        (event.target as HTMLInputElement).setCustomValidity('');
    }
}