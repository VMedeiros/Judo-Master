import {
    Injectable,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { TECHNIQUE_CATEGORIES } from '../constants/app.constants';
import { STORAGE_KEYS } from '../constants/storage-keys.constants';
import { FormMode, FormSaveEvent, GroupedTechnique, Technique } from '../models/judo.model';
import { JudoDataService } from './judo-data.service';
import { NotificationService } from './notification.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TechniqueStateService {
    private readonly dataService = inject(JudoDataService);
    private readonly notification = inject(NotificationService);
    private readonly storage = inject(StorageService);
    private readonly sanitizer = inject(DomSanitizer);

    public readonly belts = this.dataService.belts;
    public readonly selectedBeltIndex = signal(
        this.storage.get<number>(STORAGE_KEYS.SELECTED_BELT, 0),
    );
    public readonly filterTerm = signal('');

    // Modal state
    public readonly techniqueForDetail = signal<Technique | null>(null);
    public readonly techniqueForForm = signal<Technique | null>(null);
    public readonly formMode = signal<FormMode>('add');
    public readonly techniqueToDelete = signal<Technique | null>(null);
    public readonly techniqueForVideo = signal<Technique | null>(null);
    public readonly isAboutOpen = signal(false);

    public readonly selectedBelt = computed(() => this.belts()[this.selectedBeltIndex()]);

    public readonly groupedTechniques = computed<GroupedTechnique[]>(() => {
        const belt = this.selectedBelt();
        if (!belt?.techniques?.length) return [];

        const term = this.filterTerm().trim().toLowerCase();
        const filtered = term
            ? belt.techniques.filter(
                t =>
                    t.name.toLowerCase().includes(term) ||
                    t.translation.toLowerCase().includes(term),
            )
            : belt.techniques;

        if (!filtered.length) return [];

        const groups = new Map<string, Technique[]>();
        for (const tech of filtered) {
            const existing = groups.get(tech.category);
            if (existing) {
                existing.push(tech);
            } else {
                groups.set(tech.category, [tech]);
            }
        }
        return Array.from(groups.entries()).map(([category, techniques]) => ({
            category,
            techniques,
        }));
    });

    public readonly safeVideoUrl = computed<SafeResourceUrl | null>(() => {
        const tech = this.techniqueForVideo();
        if (!tech?.demoUrl || tech.demoUrl === '#') return null;

        const embedUrl = this.toYouTubeEmbedUrl(tech.demoUrl);
        if (!embedUrl) return null;
        // URL is constructed from a validated YouTube video ID — safe to bypass Angular sanitization
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl); // NOSONAR
    });

    public readonly hasAnyModalOpen = computed(() =>
        this.techniqueForDetail() !== null ||
        this.techniqueForForm() !== null ||
        this.techniqueToDelete() !== null ||
        this.techniqueForVideo() !== null ||
        this.isAboutOpen(),
    );

    public selectBelt(index: number): void {
        this.selectedBeltIndex.set(index);
        this.filterTerm.set('');
        this.storage.set(STORAGE_KEYS.SELECTED_BELT, index);
    }

    public openAddForm(): void {
        this.formMode.set('add');
        this.techniqueForForm.set({
            id: 0,
            name: '',
            translation: '',
            description: '',
            execution: '',
            application: '',
            demoUrl: '',
            category: TECHNIQUE_CATEGORIES[0],
        });
    }

    public openEditForm(technique: Technique): void {
        this.formMode.set('edit');
        this.techniqueForForm.set({ ...technique });
    }

    public onSaveTechnique(event: FormSaveEvent): void {
        const belt = this.selectedBelt();
        if (!belt) {
            this.notification.showError('Erro ao identificar a faixa selecionada.');
            return;
        }
        try {
            if (event.mode === 'edit' && event.data.id) {
                this.dataService.updateTechnique(belt.id, event.data as Technique);
                this.notification.showSuccess('Técnica atualizada com sucesso!');
            } else {
                const { id: _omit, ...rest } = event.data;
                this.dataService.addTechnique(belt.id, rest);
                this.notification.showSuccess('Técnica adicionada com sucesso!');
            }
            this.techniqueForForm.set(null);
        } catch {
            this.notification.showError('Erro ao salvar. Tente novamente.');
        }
    }

    public onConfirmDelete(): void {
        const technique = this.techniqueToDelete();
        const belt = this.selectedBelt();
        if (!technique || !belt) {
            this.notification.showError('Erro ao identificar técnica ou faixa.');
            return;
        }
        try {
            this.dataService.deleteTechnique(belt.id, technique.id);
            this.notification.showSuccess('Técnica removida com sucesso!');
            this.techniqueToDelete.set(null);
        } catch {
            this.notification.showError('Erro ao remover. Tente novamente.');
        }
    }

    public closeAllModals(): void {
        if (this.techniqueForDetail()) { this.techniqueForDetail.set(null); return; }
        if (this.techniqueForForm()) { this.techniqueForForm.set(null); return; }
        if (this.techniqueToDelete()) { this.techniqueToDelete.set(null); return; }
        if (this.techniqueForVideo()) { this.techniqueForVideo.set(null); return; }
        if (this.isAboutOpen()) { this.isAboutOpen.set(false); }
    }

    public goToNextDetail(): void { this.navigate(this.techniqueForDetail, 1); }
    public goToPrevDetail(): void { this.navigate(this.techniqueForDetail, -1); }
    public goToNextVideo(): void { this.navigate(this.techniqueForVideo, 1); }
    public goToPrevVideo(): void { this.navigate(this.techniqueForVideo, -1); }

    private navigate(target: WritableSignal<Technique | null>, delta: number): void {
        const current = target();
        if (!current) return;
        const all = this.getAllTechniques();
        const idx = all.findIndex(t => t.id === current.id);
        const next = all[idx + delta];
        if (next) target.set(next);
    }

    private toYouTubeEmbedUrl(rawUrl: string): string | null {
        const ytIdPattern = /^[A-Za-z0-9_-]{11}$/;
        try {
            if (rawUrl.includes('youtube.com/watch')) {
                const videoId = new URL(rawUrl).searchParams.get('v');
                if (videoId && ytIdPattern.test(videoId)) {
                    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                }
            } else if (rawUrl.includes('youtu.be/')) {
                const id = rawUrl.split('youtu.be/')[1]?.split('?')[0];
                if (id && ytIdPattern.test(id)) {
                    return `https://www.youtube.com/embed/${id}?autoplay=1`;
                }
            }
        } catch {
            return null;
        }
        return null;
    }

    private getAllTechniques(): Technique[] {
        const belt = this.selectedBelt();
        if (!belt?.techniques) return [];
        const term = this.filterTerm().trim().toLowerCase();
        return term
            ? belt.techniques.filter(
                t => t.name.toLowerCase().includes(term) || t.translation.toLowerCase().includes(term),
            )
            : [...belt.techniques];
    }
}
