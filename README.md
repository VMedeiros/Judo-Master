<p align="center">
  <img src="src/assets/icons/icon-192x192.png" width="96" height="96" alt="Judô Master">
</p>

<h1 align="center">🥋 Judô Master</h1>

<p align="center">
  <strong>As técnicas de Judô de cada faixa — com descrição, execução, aplicação e vídeo</strong>
</p>

<p align="center">
  <a href="https://vmedeiros.github.io/Judo-Master/"><strong>🔗 Acessar o app</strong></a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-desenvolvimento">Desenvolvimento</a> •
  <a href="#-qualidade">Qualidade</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-estrutura">Estrutura</a>
</p>

<p align="center">
  <a href="https://github.com/VMedeiros/Judo-Master/actions/workflows/ci.yml"><img src="https://github.com/VMedeiros/Judo-Master/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white" alt="Angular 22">
  <img src="https://img.shields.io/badge/TypeScript-5.9_strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript strict">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/WCAG-2.1_AA-2E7D32" alt="WCAG 2.1 AA">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT">
</p>

---

## 📋 Sobre

O **Judô Master** organiza o conteúdo de exame de cada graduação, da faixa branca à preta: o nome
japonês de cada técnica, a tradução, a descrição, como executar, quando aplicar e um vídeo de
demonstração. É um app instalável (PWA) que funciona sem internet depois da primeira visita, e o
aluno ou professor pode adicionar, corrigir e remover técnicas — as mudanças ficam salvas no próprio
aparelho.

Faz parte da mesma família visual do [JudoKan](https://judokan-app.web.app/), o sistema de
gestão de academias, e segue os mesmos padrões de engenharia.

## 🚀 Funcionalidades

- **Página inicial** — apresenta o app, mostra as faixas com o número de técnicas de cada uma e leva direto à faixa escolhida
- **Faixas** — 8 graduações com faixa etária, pré-requisitos e as técnicas do exame, agrupadas por categoria
- **Busca** — por nome, tradução, descrição ou categoria, sem distinguir acentos ("projecao" encontra "Projeção")
- **Detalhes** — execução e aplicação de cada técnica, com navegação para a anterior e a próxima
- **Vídeos** — player do YouTube no modo de privacidade reforçada (`youtube-nocookie.com`), com links de vídeos, Shorts e youtu.be
- **Edição** — adicionar, editar e remover técnicas; "Restaurar técnicas originais" desfaz tudo
- **Downloads** — a faixa em Excel (com filtros) ou PDF
- **Aparência** — o mesmo visual do JudoKan: tema claro (padrão) ou escuro, alto contraste e três tamanhos de fonte
- **Offline e instalável** — service worker do Angular; avisa quando há uma versão nova
- **Acessível** — WCAG 2.1 AA verificado com axe nos dois temas, navegação completa por teclado

O manual de uso está em [docs/MANUAL.md](docs/MANUAL.md).

### Dados no aparelho

Nada sai do navegador: não há servidor nem conta. As técnicas que vêm com o app ficam no código
([src/core/data/belts.data.ts](src/core/data/belts.data.ts)) e só as **alterações do usuário** são gravadas no
`localStorage`. Por isso, técnicas incluídas numa versão nova aparecem para todos — inclusive para
quem já editou alguma coisa. Os dados gravados por versões anteriores à 2.1 são migrados
automaticamente na primeira abertura.

## 🛠 Tecnologias

| Área       | Escolha                                                                              |
| ---------- | ------------------------------------------------------------------------------------ |
| Framework  | Angular 22 — componentes standalone, signals, zoneless, controle de fluxo nativo     |
| Linguagem  | TypeScript 6.0 em modo `strict` + `strictTemplates`                                  |
| Estilo     | Tailwind CSS 4, tokens de tema em CSS, modo escuro por classe                        |
| PWA        | `@angular/service-worker` (cache do app, das fontes e das imagens)                   |
| Exportação | SheetJS (Excel) e jsPDF + AutoTable (PDF), carregados só no primeiro download        |
| Testes     | Jasmine + Karma (unitários, cobertura mínima de 95%) e Playwright + axe-core (E2E)   |
| Qualidade  | ESLint 10 (angular-eslint, typescript-eslint, SonarJS), Prettier, Husky, lint-staged |

## 💻 Desenvolvimento

Pré-requisito: **Node.js 22.22.3+** (veja `.nvmrc`).

```bash
npm install        # instala as dependências e o hook de pre-commit
npm start          # http://localhost:3000
npm run build      # build de produção em dist/ (base /Judo-Master/)
npm run preview    # serve o build de produção
```

| Script                            | O que faz                                                             |
| --------------------------------- | --------------------------------------------------------------------- |
| `npm test`                        | Testes unitários em modo watch                                        |
| `npm run test:ci`                 | Testes unitários uma vez, headless, com cobertura                     |
| `npm run test:e2e`                | Playwright (desktop e celular) + auditoria de acessibilidade com axe  |
| `npm run lint` / `lint:ci`        | ESLint (corrige / falha em qualquer aviso)                            |
| `npm run format` / `format:check` | Prettier                                                              |
| `npm run typecheck`               | `tsc --noEmit` do app e dos testes                                    |
| `npm run check:data`              | Valida os dados das faixas: ids, campos obrigatórios, links e imagens |
| `npm run check:icons`             | Confere os ícones usados × os pedidos ao Google Fonts                 |
| `npm run check:bundle`            | Limites de tamanho do JavaScript (rode depois do build)               |
| `npm run icons`                   | Regera os ícones PNG do PWA a partir dos SVGs do JudoKan (Chromium)   |
| `npm run lighthouse`              | Lighthouse no celular e no desktop (rode depois do build)             |

### Adicionando técnicas ao conteúdo original

Edite [src/core/data/belts.data.ts](src/core/data/belts.data.ts) e rode `npm run check:data`. Cada técnica
precisa de um `id` inteiro e único (abaixo de 100000 — acima disso ficam as criadas pelos usuários),
`name`, `description` e `category`. O `demoUrl` aceita links do YouTube ou fica vazio.

### Ícones

O Google Fonts entrega só os ícones do Material Symbols listados em `icon_names=` no `index.html`
(em ordem alfabética). Ao usar um ícone novo, inclua-o ali — `npm run check:icons` acusa o esquecimento.
O ícone `judo` não vem da fonte: é o kanji 柔, desenhado como no JudoKan.

Os ícones do app (PWA, favicons, Apple) são os mesmos do JudoKan: `npm run icons` renderiza
`src/assets/icons/icon-app-{light,dark}.svg` no Chromium do Playwright, para o kanji sair com a
mesma fonte. Se a arte mudar no JudoKan, copie os SVGs e rode o comando de novo.

## ✅ Qualidade

Todo push e pull request passa pelo [CI](.github/workflows/ci.yml):

| Job           | Verifica                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| Lint & format | ESLint sem avisos e Prettier                                             |
| TypeScript    | Compilação estrita do app e dos testes                                   |
| Unit tests    | Karma headless, com piso de cobertura (95% linhas/funções, 85% branches) |
| Data & icons  | Integridade dos dados das faixas e dos ícones                            |
| Security      | `npm audit`: bloqueia _high_ em produção e _critical_ em tudo            |
| E2E           | Fluxos reais, teclado e WCAG 2.1 AA (axe), em desktop e celular          |
| Build         | Build de produção e orçamento de tamanho do bundle                       |

Localmente, o pre-commit roda ESLint e Prettier nos arquivos alterados.

## 🚀 Deploy

O [deploy](.github/workflows/deploy.yml) roda **só depois que o CI passa** num push para `main`:
gera o build de produção e publica `dist/` no branch `gh-pages`, servido pelo GitHub Pages em
<https://vmedeiros.github.io/Judo-Master/>. Detalhes, segurança (CSP) e o funcionamento offline estão
em [docs/DEPLOY.md](docs/DEPLOY.md).

São duas rotas: `/` (página inicial) e `/tecnicas` (aceita `?faixa=<id>`). Como o GitHub Pages não
conhece rotas de SPA, o `postbuild` copia `dist/index.html` para `dist/<rota>.html` (cada rota de
`src/app.routes.ts`, servida com status 200 e, portanto, indexável) e para `dist/404.html` (qualquer
outro endereço). O app instalado abre em `/tecnicas`.

O `sitemap.xml` vai junto no build. Num site de projeto do GitHub Pages os buscadores não leem um
`robots.txt` fora da raiz do domínio: envie o sitemap pelo Search Console.

## 📁 Estrutura

A mesma organização do [JudoKan](https://judokan-app.web.app/):

```
src/
├── main.ts                  # bootstrap: zoneless, rotas, service worker, tratamento global de erros
├── app.routes.ts            # "/" (início) e "/tecnicas", com título e descrição de cada página
├── app.component.*          # o que é global: link "pular para o conteúdo", toasts, aviso de versão nova
├── layouts/
│   └── main-layout.*        # moldura das técnicas: cabeçalho com a marca e o voltar, fundo, rodapé e menus
├── features/
│   ├── home/                # página inicial e a visão geral das faixas
│   └── techniques/          # a página de técnicas: abas das faixas, tabela e diálogos da técnica
├── core/
│   ├── judo-data.service.ts       # técnicas originais + alterações do usuário (e a migração)
│   ├── technique-state.service.ts # estado da tela: faixa, busca, diálogo aberto
│   ├── settings.service.ts        # tema, alto contraste e tamanho da fonte
│   ├── toast.service.ts
│   ├── services/            # armazenamento, exportação, título das páginas, histórico, erros…
│   ├── domain/  constants/  data/belts.data.ts (conteúdo original das faixas e técnicas)
├── shared/
│   ├── ui/                  # componentes do JudoKan: moldura pública, modal, preferências, rodapé…
│   └── utils/               # texto, YouTube, ordenação da tabela e links para seções
├── environments/
├── assets/                  # ícones, faixas, theme-init.js (tema antes da primeira pintura)
└── images/                  # foto de fundo (WebP em 3 tamanhos)
e2e/                         # testes Playwright
scripts/                     # verificações de qualidade e geradores
```

O visual também é o do JudoKan: `src/styles.css` traz os mesmos tokens e componentes (`btn`,
`icon-btn`, `field-input`, `card`, `page-title`, `data-table`, `badge`…). Mudanças no design devem
ser feitas nos dois projetos.

## 🔒 Segurança

Veja [SECURITY.md](SECURITY.md).

## 📄 Licença

[MIT](LICENSE) © Victor Medeiros

---

<p align="center">Feito com dedicação para apoiar os estudos de Judô. Oss! 🥋</p>
