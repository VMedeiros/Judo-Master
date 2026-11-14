/**
 * @fileoverview Routes
 * The home page tells what the app is; the techniques page is the app itself.
 * Both load on demand, so the home page does not carry the techniques data.
 * Each `data.description` feeds the page's meta description (PageTitleStrategy).
 * @module app.routes
 */

import { Routes } from '@angular/router';

import type { PageMeta } from './core/services/page-title.strategy';

const page = (description: string): PageMeta => ({ description });

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Técnicas de judô para cada faixa',
    data: page(
      'As técnicas que cada exame de faixa pede, da branca à preta, com explicação, execução e vídeo. Grátis, funciona no celular e sem internet.'
    ),
  },
  {
    path: 'tecnicas',
    loadComponent: () => import('./layouts/main-layout.component').then(m => m.MainLayoutComponent),
    title: 'Técnicas por faixa',
    data: page(
      'Escolha a faixa e veja as técnicas do exame com tradução, descrição, execução e vídeo de demonstração.'
    ),
  },
  { path: '**', redirectTo: '' },
];
