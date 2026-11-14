/**
 * @fileoverview Home page
 * What Judô Master is, before anyone opens the techniques: what it offers,
 * the belts, how to start, privacy and accessibility, questions and the way in.
 * Built from the same pieces as JudoKan's home page.
 * @module features/home
 */

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicNavItem, PublicShellComponent } from '../../shared/ui/public-shell.component';
import { goToSection } from '../../shared/utils/in-page';
import { BeltsOverviewComponent } from './belts-overview.component';

interface Item {
  icon: string;
  text: string;
}

interface Card {
  icon: string;
  title: string;
  text: string;
}

/** Only what the app does is promised here. The preview is an illustration, hidden from assistive technology. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, PublicShellComponent, BeltsOverviewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly document = inject(DOCUMENT);

  public readonly nav: readonly PublicNavItem[] = [
    { id: 'recursos', label: 'Recursos' },
    { id: 'faixas', label: 'Faixas' },
    { id: 'como-funciona', label: 'Como funciona' },
    { id: 'privacidade', label: 'Privacidade' },
    { id: 'duvidas', label: 'Dúvidas' },
  ];

  public readonly highlights: readonly Item[] = [
    { icon: 'wifi_off', text: 'Funciona sem internet' },
    { icon: 'devices', text: 'Celular, tablet e computador' },
    { icon: 'verified_user', text: 'Sem cadastro' },
  ];

  public readonly strip: readonly Item[] = [
    { icon: 'military_tech', text: 'Da faixa branca à preta' },
    { icon: 'play_circle', text: 'Vídeo de cada movimento' },
    { icon: 'wifi_off', text: 'Abre mesmo sem internet' },
    { icon: 'lock', text: 'Suas técnicas ficam no aparelho' },
  ];

  public readonly features: readonly Card[] = [
    {
      icon: 'menu_book',
      title: 'Cada técnica explicada',
      text: 'Nome em japonês, tradução, para que serve, como executar e quando aplicar.',
    },
    {
      icon: 'play_circle',
      title: 'Vídeos de demonstração',
      text: 'Veja o movimento antes de tentar no tatame. O vídeo abre ali mesmo, sem sair do app.',
    },
    {
      icon: 'search',
      title: 'Busca sem complicação',
      text: 'Procure pelo nome, pela tradução ou pela categoria. Pode digitar sem acento.',
    },
    {
      icon: 'edit',
      title: 'Do jeito do seu dojo',
      text: 'Adicione, corrija ou tire técnicas para seguir exatamente o que o seu professor pede.',
    },
    {
      icon: 'download',
      title: 'Para imprimir ou revisar',
      text: 'Baixe as técnicas da faixa em Excel ou em PDF e estude onde preferir.',
    },
    {
      icon: 'install_mobile',
      title: 'Instale no celular',
      text: 'Coloque o app na tela inicial. Depois da primeira visita, ele abre até sem sinal.',
    },
  ];

  public readonly steps: readonly Card[] = [
    {
      icon: 'military_tech',
      title: 'Escolha sua faixa',
      text: 'Comece pela faixa do seu próximo exame. Cada uma mostra a idade mínima e os pré-requisitos.',
    },
    {
      icon: 'menu_book',
      title: 'Estude cada técnica',
      text: 'Leia a explicação, veja o vídeo e passe para a próxima sem voltar à lista.',
    },
    {
      icon: 'judo',
      title: 'Leve para o treino',
      text: 'Revise antes da aula e na véspera do exame. O app fica no bolso, mesmo offline.',
    },
  ];

  public readonly trustGroups: ReadonlyArray<{ icon: string; title: string; items: Item[] }> = [
    {
      icon: 'shield',
      title: 'Seus dados ficam com você',
      items: [
        { icon: 'lock', text: 'Não precisa de conta nem de senha.' },
        { icon: 'devices', text: 'As técnicas que você muda ficam guardadas só no seu navegador.' },
        { icon: 'play_circle', text: 'Os vídeos usam o modo de privacidade reforçada do YouTube.' },
        { icon: 'restart_alt', text: 'Quer voltar ao original? É só restaurar nas configurações.' },
      ],
    },
    {
      icon: 'accessibility_new',
      title: 'Feito para todo mundo usar',
      items: [
        { icon: 'dark_mode', text: 'Tema claro e escuro, você escolhe.' },
        { icon: 'contrast', text: 'Alto contraste e três tamanhos de texto.' },
        { icon: 'keyboard', text: 'Dá para usar só com o teclado ou com leitor de tela.' },
        { icon: 'devices', text: 'Se adapta ao celular, ao tablet e ao computador.' },
      ],
    },
  ];

  public readonly faqs: ReadonlyArray<{ question: string; answer: string }> = [
    {
      question: 'Preciso pagar ou criar uma conta?',
      answer: 'Não. O Judô Master é gratuito e abre direto, sem cadastro.',
    },
    {
      question: 'Funciona sem internet?',
      answer:
        'Funciona. Depois que você abre o app uma vez, ele fica guardado no aparelho. Só os vídeos precisam de conexão.',
    },
    {
      question: 'Posso mudar as técnicas?',
      answer:
        'Pode. Você adiciona, edita ou remove técnicas, e tudo fica salvo no seu aparelho. Se quiser o conteúdo original de volta, use "Restaurar técnicas originais" nas configurações.',
    },
    {
      question: 'De onde vem o conteúdo de cada faixa?',
      answer:
        'Cada faixa traz as técnicas do exame, a idade mínima e os pré-requisitos. Se o seu dojo pede algo diferente, você ajusta.',
    },
    {
      question: 'Qual a diferença para o JudoKan?',
      answer:
        'O JudoKan é o sistema que o dojo usa para cuidar de alunos, turmas e presença. O Judô Master é o seu companheiro de estudo: as técnicas que cada faixa pede.',
    },
  ];

  public readonly ctaPoints: readonly Card[] = [
    { icon: 'bolt', title: 'Abre na hora', text: 'Sem cadastro e sem senha.' },
    { icon: 'devices', title: 'Em qualquer aparelho', text: 'Celular, tablet ou computador.' },
    { icon: 'judo', title: 'Da família JudoKan', text: 'O mesmo cuidado do sistema do dojo.' },
  ];

  /** The hero's illustration: example rows of the techniques page, never data. */
  public readonly previewRows: ReadonlyArray<{
    initials: string;
    name: string;
    translation: string;
  }> = [
    { initials: 'OG', name: 'O-soto-gari', translation: 'Grande ceifa externa' },
    { initials: 'OG', name: 'O-uchi-gari', translation: 'Grande ceifa interna' },
    { initials: 'KG', name: 'Koshi-guruma', translation: 'Roda de quadril' },
  ];

  /** The hero's and the closing banner's in-page links. */
  public goTo(event: Event, id: string): void {
    goToSection(this.document, event, id);
  }
}
