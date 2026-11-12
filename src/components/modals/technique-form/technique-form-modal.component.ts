import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { FormMode, FormSaveEvent, TechniqueDraft } from '../../../models/judo.model';
import { isYouTubeUrl } from '../../../utils/youtube.util';
import { ModalComponent } from '../../modal/modal.component';

type Field =
  'name' | 'translation' | 'category' | 'description' | 'execution' | 'application' | 'demoUrl';
type Errors = Partial<Record<Field, string>>;

export const FIELD_LIMITS = {
  name: 120,
  translation: 120,
  description: 500,
  execution: 1000,
  application: 500,
  demoUrl: 300,
} as const;

@Component({
  selector: 'app-technique-form-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './technique-form-modal.component.html',
})
export class TechniqueFormModalComponent {
  public readonly technique = input.required<TechniqueDraft>();
  public readonly mode = input<FormMode>('add');
  /** The categories to choose from. */
  public readonly categories = input<readonly string[]>([]);

  public readonly closed = output<void>();
  public readonly saved = output<FormSaveEvent>();

  protected readonly limits = FIELD_LIMITS;
  protected readonly errors = signal<Errors>({});
  protected readonly title = computed(() =>
    this.mode() === 'add' ? 'Adicionar técnica' : 'Editar técnica'
  );

  /** The technique's own category is always offered, even if no other technique uses it. */
  protected readonly categoryOptions = computed(() => {
    const current = this.technique().category;
    const list = this.categories();
    return current && !list.includes(current) ? [current, ...list] : list;
  });

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const value = (field: Field): string => String(data.get(field) ?? '').trim();

    const draft: TechniqueDraft = {
      ...(this.mode() === 'edit' && this.technique().id !== undefined
        ? { id: this.technique().id }
        : {}),
      name: value('name'),
      translation: value('translation'),
      category: value('category'),
      description: value('description'),
      execution: value('execution'),
      application: value('application'),
      demoUrl: value('demoUrl'),
    };

    const errors = validate(draft);
    this.errors.set(errors);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    this.saved.emit({ data: draft, mode: this.mode() });
  }

  /** Clears a field's error as soon as the user changes it. */
  protected clearError(field: Field): void {
    if (!this.errors()[field]) return;
    this.errors.update(({ [field]: _removed, ...rest }) => rest);
  }

  protected describedBy(field: Field, hint?: string): string | null {
    const ids = [hint, this.errors()[field] ? `${field}-error` : undefined].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : null;
  }
}

function validate(draft: TechniqueDraft): Errors {
  const errors: Errors = {};
  if (draft.name.length < 2) errors.name = 'Informe o nome da técnica (ao menos 2 caracteres).';
  if (!draft.category) errors.category = 'Escolha uma categoria.';
  if (!draft.description) errors.description = 'Descreva a técnica.';
  if (draft.demoUrl && !isYouTubeUrl(draft.demoUrl)) {
    errors.demoUrl = 'Use um link do YouTube (youtube.com ou youtu.be).';
  }
  return errors;
}
