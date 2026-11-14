import { Injectable, computed, inject, signal } from '@angular/core';

import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from './constants/app.constants';
import { ActiveModal, Belt, FormSaveEvent, GroupedTechnique, Technique } from './domain/judo.model';
import { normalizeForSearch } from '../shared/utils/text.util';
import { isYouTubeUrl } from '../shared/utils/youtube.util';
import { JudoDataService } from './judo-data.service';
import { StorageService } from './services/storage.service';
import { ToastService } from './toast.service';

const SAVE_FAILED =
  'Não foi possível salvar neste dispositivo. Verifique o espaço de armazenamento do navegador.';

/** Screen state: the selected belt, the search, the open dialog and the actions on techniques. */
@Injectable({ providedIn: 'root' })
export class TechniqueStateService {
  private readonly data = inject(JudoDataService);
  private readonly toast = inject(ToastService);
  private readonly storage = inject(StorageService);

  public readonly belts = this.data.belts;
  public readonly hasChanges = this.data.hasChanges;
  public readonly filterTerm = signal('');
  public readonly modal = signal<ActiveModal>({ kind: 'none' });

  private readonly selectedBeltId = signal(this.restoreSelectedBelt());

  public readonly selectedBeltIndex = computed(() =>
    Math.max(
      0,
      this.belts().findIndex(belt => belt.id === this.selectedBeltId())
    )
  );
  public readonly selectedBelt = computed<Belt | undefined>(
    () => this.belts()[this.selectedBeltIndex()]
  );

  /** The selected belt's techniques that match the search, grouped by category in order of first appearance. */
  public readonly groupedTechniques = computed<readonly GroupedTechnique[]>(() => {
    const techniques = this.selectedBelt()?.techniques ?? [];
    const term = normalizeForSearch(this.filterTerm());
    const groups = new Map<string, Technique[]>();
    for (const technique of techniques) {
      if (term && !matches(technique, term)) continue;
      const group = groups.get(technique.category);
      if (group) group.push(technique);
      else groups.set(technique.category, [technique]);
    }
    return Array.from(groups, ([category, list]) => ({ category, techniques: list }));
  });

  /** The techniques in the order they are shown, for previous/next navigation. */
  public readonly visibleTechniques = computed(() =>
    this.groupedTechniques().flatMap(g => g.techniques)
  );

  public readonly visibleCount = computed(() => this.visibleTechniques().length);

  /** Every category in use, for the form. Sorted, without duplicates. */
  public readonly categories = computed(() =>
    [...new Set(this.belts().flatMap(b => b.techniques.map(t => t.category)))].sort((a, b) =>
      a.localeCompare(b, 'pt-BR')
    )
  );

  public selectBelt(index: number): void {
    const belt = this.belts()[index];
    if (!belt) return;
    this.selectedBeltId.set(belt.id);
    this.filterTerm.set('');
    this.storage.write(STORAGE_KEYS.SELECTED_BELT, belt.id);
  }

  // ── Dialogs ────────────────────────────────────────────────────────────────

  public openSettings(): void {
    this.modal.set({ kind: 'settings' });
  }

  public openAbout(): void {
    this.modal.set({ kind: 'about' });
  }

  public openReset(): void {
    this.modal.set({ kind: 'reset' });
  }

  public openDetail(technique: Technique): void {
    this.modal.set({ kind: 'detail', technique });
  }

  public openVideo(technique: Technique): void {
    if (isYouTubeUrl(technique.demoUrl)) this.modal.set({ kind: 'video', technique });
  }

  public openDelete(technique: Technique): void {
    this.modal.set({ kind: 'delete', technique });
  }

  public openAddForm(): void {
    const belt = this.selectedBelt();
    const category = belt?.techniques[0]?.category ?? this.categories()[0] ?? '';
    this.modal.set({
      kind: 'form',
      mode: 'add',
      technique: {
        name: '',
        translation: '',
        description: '',
        execution: '',
        application: '',
        demoUrl: '',
        category,
      },
    });
  }

  public openEditForm(technique: Technique): void {
    this.modal.set({ kind: 'form', mode: 'edit', technique });
  }

  public closeModal(): void {
    this.modal.set({ kind: 'none' });
  }

  // ── Previous / next inside the detail and video dialogs ─────────────────────

  /** The technique before or after `current` in the visible list; videos skip techniques without one. */
  public neighbor(current: Technique, delta: 1 | -1, withVideo = false): Technique | null {
    const list = withVideo
      ? this.visibleTechniques().filter(t => t.id === current.id || isYouTubeUrl(t.demoUrl))
      : this.visibleTechniques();
    const index = list.findIndex(t => t.id === current.id);
    return index === -1 ? null : (list[index + delta] ?? null);
  }

  public goTo(delta: 1 | -1): void {
    const modal = this.modal();
    if (modal.kind !== 'detail' && modal.kind !== 'video') return;
    const next = this.neighbor(modal.technique, delta, modal.kind === 'video');
    if (next) this.modal.set({ kind: modal.kind, technique: next });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  public saveTechnique(event: FormSaveEvent): void {
    const belt = this.selectedBelt();
    if (!belt) return;
    const { id, ...fields } = event.data;
    if (event.mode === 'edit' && id !== undefined) {
      if (!this.data.updateTechnique(belt.id, { ...fields, id })) {
        this.toast.error(SAVE_FAILED);
        return;
      }
      this.toast.success('Técnica atualizada.');
    } else {
      if (!this.data.addTechnique(belt.id, fields)) {
        this.toast.error(SAVE_FAILED);
        return;
      }
      // A search that hides the new technique would make it look lost.
      this.filterTerm.set('');
      this.toast.success('Técnica adicionada.');
    }
    this.closeModal();
  }

  public confirmDelete(): void {
    const modal = this.modal();
    const belt = this.selectedBelt();
    if (modal.kind !== 'delete' || !belt) return;
    if (!this.data.deleteTechnique(belt.id, modal.technique.id)) {
      this.toast.error(SAVE_FAILED);
      return;
    }
    this.toast.success(`"${modal.technique.name}" removida.`);
    this.closeModal();
  }

  public confirmReset(): void {
    this.data.resetToDefaults();
    this.toast.success('Técnicas originais restauradas.');
    this.closeModal();
  }

  private restoreSelectedBelt(): number {
    const belts = this.data.belts();
    const stored = this.storage.read(STORAGE_KEYS.SELECTED_BELT);
    if (typeof stored === 'number' && belts.some(b => b.id === stored)) return stored;
    // Versions before 2.1 stored the tab index instead of the belt id.
    const legacyIndex = this.storage.read(LEGACY_STORAGE_KEYS.SELECTED_BELT_INDEX);
    if (typeof legacyIndex === 'number' && belts[legacyIndex]) return belts[legacyIndex].id;
    return belts[0]?.id ?? 0;
  }
}

function matches(technique: Technique, term: string): boolean {
  return [technique.name, technique.translation, technique.description, technique.category].some(
    field => normalizeForSearch(field).includes(term)
  );
}
