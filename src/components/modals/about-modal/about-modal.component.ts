import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { ModalComponent } from '../../modal/modal.component';

interface Term {
  readonly name: string;
  readonly kanji: string;
  readonly description: string;
}

@Component({
  selector: 'app-about-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-modal.component.html',
})
export class AboutModalComponent {
  public readonly closed = output<void>();
  protected readonly theme = inject(ThemeService);

  protected readonly benefits: readonly string[] = [
    'Desenvolvimento físico e força',
    'Coordenação motora e equilíbrio',
    'Disciplina e respeito (rei)',
    'Confiança e autoestima',
    'Amizade e camaradagem',
    'Concentração e foco mental',
    'Autocontrole e paciência',
    'Resolução de conflitos',
  ];

  protected readonly values: readonly Term[] = [
    { name: 'Rei', kanji: '礼', description: 'Respeito e cortesia' },
    { name: 'Yū', kanji: '勇', description: 'Coragem e bravura' },
    { name: 'Meiyo', kanji: '名誉', description: 'Honra e reputação' },
    { name: 'Makoto', kanji: '誠', description: 'Sinceridade e honestidade' },
  ];

  protected readonly techniqueCategories: readonly Term[] = [
    { name: 'Nage-waza', kanji: '投げ技', description: 'técnicas de projeção' },
    { name: 'Katame-waza', kanji: '固め技', description: 'técnicas de controle no solo' },
    { name: 'Shime-waza', kanji: '締め技', description: 'técnicas de estrangulamento' },
    { name: 'Kansetsu-waza', kanji: '関節技', description: 'técnicas de chave de articulação' },
  ];
}
