import { Component, ChangeDetectionStrategy, signal, computed, effect, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { JudoDataService } from './services/judo-data.service';
import { Technique } from './models/judo.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FormMode = 'add' | 'edit';
type FontOption = { name: string; class: string; };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  private dataService = inject(JudoDataService);
  private sanitizer = inject(DomSanitizer);

  // State Signals
  belts = this.dataService.belts;
  selectedBeltIndex = signal(0);
  filterTerm = signal('');

  // UI & Settings Signals
  // Tema (inicializado no construtor para permitir leitura de localStorage)
  isDarkMode = signal(false);
  isSettingsOpen = signal(false);

  fontSize = signal(16); // base font size in px
  fontSizeOptions = [
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

  // Current year for footer
  currentYear = new Date().getFullYear();

  // Dialog/Modal Signals
  techniqueForDetail = signal<Technique | null>(null);
  techniqueForForm = signal<Technique | null>(null);
  formMode = signal<FormMode>('add');
  techniqueToDelete = signal<Technique | null>(null);
  techniqueForVideo = signal<Technique | null>(null);

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

  safeVideoUrl = computed(() => {
    const tech = this.techniqueForVideo();
    if (!tech?.demoUrl) return null;

    let embedUrl = tech.demoUrl;

    // Converter URLs do YouTube para formato embed
    if (embedUrl.includes('youtube.com/watch?v=')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    } else if (embedUrl.includes('youtube.com/embed/') && !embedUrl.includes('autoplay=')) {
      embedUrl += embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1';
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  });

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

  showVideo(technique: Technique): void {
    this.techniqueForVideo.set(technique);
  }

  closeVideo(): void {
    this.techniqueForVideo.set(null);
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
    // Validar formulário antes de processar
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

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
    if (this.techniqueForVideo()) {
      this.closeVideo();
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

  // Export methods
  exportToExcel(): void {
    const belt = this.selectedBelt();
    if (!belt || !belt.techniques.length) {
      console.warn('Nenhuma técnica disponível para exportar');
      return;
    }

    try {
      const data = belt.techniques.map(tech => ({
        'Nome': tech.name,
        'Tradução': tech.translation,
        'Categoria': tech.category,
        'Descrição': tech.description,
        'Execução': tech.execution,
        'Aplicação': tech.application,
        'URL Demo': tech.demoUrl
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, belt.name);

      const fileName = `${belt.name.replace(/\s+/g, '_')}_tecnicas.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
    }
  }

  exportToPDF(): void {
    const belt = this.selectedBelt();
    if (!belt || !belt.techniques.length) {
      console.warn('Nenhuma técnica disponível para exportar');
      return;
    }

    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.text(`Judô Master - ${belt.name}`, 14, 20);
      doc.setFontSize(10);
      doc.text(`Faixa Etária: ${belt.ageGroup}`, 14, 28);
      doc.text(`Pré-requisitos: ${belt.prerequisites}`, 14, 34);

      // Table
      const tableData = belt.techniques.map(tech => [
        tech.name,
        tech.translation,
        tech.category,
        tech.description
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Nome', 'Tradução', 'Categoria', 'Descrição']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [200, 16, 46] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 35 },
          2: { cellWidth: 45 },
          3: { cellWidth: 75 }
        }
      });

      const fileName = `${belt.name.replace(/\s+/g, '_')}_tecnicas.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  }
}
