import { Component, ChangeDetectionStrategy, signal, computed, effect, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JudoDataService } from './services/judo-data.service';
import { Belt, Technique } from './models/judo.model';

type FormMode = 'add' | 'edit';
type FontOption = { name: string; class: string; };
type FontSizeOption = { name: string; value: number };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  private dataService = inject(JudoDataService);

  // State Signals
  belts = this.dataService.belts;
  selectedBeltIndex = signal(0);
  filterTerm = signal('');

  // UI & Settings Signals
  // Tema (inicializado no construtor para permitir leitura de localStorage)
  isDarkMode = signal(false);
  isSettingsOpen = signal(false);

  fontSize = signal(16); // base font size in px
  fontSizeOptions: FontSizeOption[] = [
    { name: 'Pequeno', value: 14 },
    { name: 'Médio', value: 16 },
    { name: 'Grande', value: 18 },
  ];

  fontOptions: FontOption[] = [
    { name: 'Sans-Serif', class: 'font-sans' },
    { name: 'Serifada', class: 'font-serif' },
    { name: 'Monoespaçada', class: 'font-mono' }
  ];
  selectedFont = signal<FontOption>(this.fontOptions[0]);

  // Dialog/Modal Signals
  techniqueForDetail = signal<Technique | null>(null);
  techniqueForForm = signal<Technique | null>(null);
  formMode = signal<FormMode>('add');
  techniqueToDelete = signal<Technique | null>(null);

  techniqueCategories = [
    'Fundamentos (Kihon)',
    'Técnicas de Projeção (Nage-waza)',
    'Técnicas de Controle no Solo (Katame-waza)',
    'Técnicas de Estrangulamento (Shime-waza)',
    'Técnicas de Articulação (Kansetsu-waza)',
    'Técnicas de Sacrifício (Sutemi-waza)',
    'Técnicas de Contra-ataque (Kaeshi-waza)',
    'Técnicas Combinadas (Renraku-waza)'
  ];

  // Computed Signals
  selectedBelt = computed(() => this.belts()[this.selectedBeltIndex()]);

  groupedTechniques = computed(() => {
    const belt = this.selectedBelt();
    if (!belt || !belt.techniques) {
      return [];
    }

    const term = this.filterTerm().toLowerCase();
    const filteredTechniques = !term
      ? belt.techniques
      : belt.techniques.filter(tech =>
        tech.name.toLowerCase().includes(term) ||
        tech.translation.toLowerCase().includes(term)
      );

    if (!filteredTechniques.length) {
      return [];
    }

    const groups = new Map<string, Technique[]>();

    for (const tech of filteredTechniques) {
      if (!groups.has(tech.category)) {
        groups.set(tech.category, []);
      }
      groups.get(tech.category)!.push(tech);
    }

    return Array.from(groups.entries()).map(([category, techniques]) => ({ category, techniques }));
  });

  constructor() {
    // Inicialização de tema com persistência
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(stored ? stored === 'dark' : prefersDark);

      // Restaurar fonte
      const storedFont = localStorage.getItem('fontFamily');
      if (storedFont) {
        const font = this.fontOptions.find(f => f.class === storedFont);
        if (font) this.selectedFont.set(font);
      }

      // Restaurar tamanho
      const storedSize = localStorage.getItem('fontSize');
      if (storedSize) {
        this.fontSize.set(Number(storedSize));
      }

      // Restaurar aba
      const storedBelt = localStorage.getItem('selectedBeltIndex');
      if (storedBelt) {
        this.selectedBeltIndex.set(Number(storedBelt));
      }
    }

    effect(() => {
      const root = document.documentElement;
      const dark = this.isDarkMode();
      root.classList.toggle('dark', dark);
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
      }

      // Font Size
      const size = this.fontSize();
      root.style.fontSize = `${size}px`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('fontSize', String(size));
      }

      // Font Family
      const font = this.selectedFont();
      this.fontOptions.forEach(f => root.classList.remove(f.class));
      root.classList.add(font.class);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fontFamily', font.class);
      }
    });
  }

  // Methods
  selectBelt(index: number): void {
    this.selectedBeltIndex.set(index);
    this.filterTerm.set('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedBeltIndex', String(index));
    }
  }

  updateFilter(event: Event): void {
    this.filterTerm.set((event.target as HTMLInputElement).value);
  }

  toggleTheme(): void {
    this.isDarkMode.update(value => !value);
  }

  toggleSettings(): void {
    this.isSettingsOpen.update(value => !value);
  }

  changeFontSize(size: string): void {
    this.fontSize.set(Number(size));
  }

  changeFont(fontClass: string): void {
    const font = this.fontOptions.find(f => f.class === fontClass);
    if (font) {
      this.selectedFont.set(font);
    }
  }

  showDetail(technique: Technique): void {
    this.techniqueForDetail.set(technique);
  }

  closeDetail(): void {
    this.techniqueForDetail.set(null);
  }

  openForm(mode: FormMode, technique: Technique | null = null): void {
    this.formMode.set(mode);
    this.techniqueForForm.set(technique ? { ...technique } : {
      id: 0,
      name: '',
      translation: '',
      description: '',
      execution: '',
      application: '',
      demoUrl: '',
      category: this.techniqueCategories[0]
    });
  }

  closeForm(): void {
    this.techniqueForForm.set(null);
  }

  saveTechnique(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const beltId = this.selectedBelt()?.id;
    if (!beltId) return;

    const techniqueData: Omit<Technique, 'id'> & { id?: number } = {
      name: formData.get('name') as string,
      translation: formData.get('translation') as string,
      description: formData.get('description') as string,
      execution: formData.get('execution') as string,
      application: formData.get('application') as string,
      demoUrl: formData.get('demoUrl') as string,
      category: formData.get('category') as string,
    };

    if (this.formMode() === 'edit' && this.techniqueForForm()?.id) {
      this.dataService.updateTechnique(beltId, { ...techniqueData, id: this.techniqueForForm()!.id });
    } else {
      this.dataService.addTechnique(beltId, techniqueData);
    }

    this.closeForm();
  }

  deleteTechnique(technique: Technique): void {
    this.techniqueToDelete.set(technique);
  }

  confirmDelete(): void {
    const technique = this.techniqueToDelete();
    if (technique) {
      const beltId = this.selectedBelt()?.id;
      if (beltId) {
        this.dataService.deleteTechnique(beltId, technique.id);
      }
      this.techniqueToDelete.set(null);
    }
  }

  cancelDelete(): void {
    this.techniqueToDelete.set(null);
  }

  // Helper to prevent form submission and call our method
  handleSubmit(event: Event) {
    event.preventDefault();
    this.saveTechnique(event.target as HTMLFormElement);
  }

  // Acessibilidade: fechar modais com tecla Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (this.techniqueForDetail()) {
      this.closeDetail();
    }
    if (this.techniqueForForm()) {
      this.closeForm();
    }
    if (this.techniqueToDelete()) {
      this.cancelDelete();
    }
    if (this.isSettingsOpen()) {
      this.isSettingsOpen.set(false);
    }
  }

  // Fechar settings ao clicar fora
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isSettingsOpen() && !target.closest('.settings-container')) {
      this.isSettingsOpen.set(false);
    }
  }
}
