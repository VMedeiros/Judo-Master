# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem
[SemVer](https://semver.org/lang/pt-BR/).

## [3.0.0] — 2026-11-14

O mesmo design e a mesma estrutura do JudoKan.

### Alterado

- Visual do JudoKan: os mesmos tokens e componentes em `src/styles.css` (botões, campos, cards,
  tabela, modais, tooltip), o mesmo cabeçalho com a marca, o mesmo rodapé e o mesmo fundo (foto só
  a partir do tablet; no celular, superfície lisa e mais leve).
- A faixa escolhida aparece no banner do painel do JudoKan; as técnicas, num card com a barra de
  ferramentas e a tabela do JudoKan, que vira cartões empilhados no celular.
- Configurações no formato do JudoKan: tema claro/escuro, alto contraste e tamanho da fonte; a
  restauração das técnicas; o atalho para o JudoKan; e o "Sobre".
- O tema começa claro, como no JudoKan, em vez de seguir o sistema (quem já escolheu um tema o
  mantém).
- A tabela de técnicas segue a do JudoKan: avatar com as iniciais, ordenação por nome ou tradução,
  barra com a cor da faixa (as mesmas cores do JudoKan) e mensagens quando a busca não encontra nada.
- Os ícones do app são os do JudoKan (o kanji 柔), gerados agora pelo Chromium a partir dos SVGs.
- Os nomes das faixas usam "·" ("11º Kyu · Faixa Branca") e os textos da interface foram
  reescritos num tom mais natural.
- O app instalado abre direto nas técnicas (`start_url` em `/tecnicas`), e todos os pedaços do app
  são baixados na instalação, para funcionar sem internet em qualquer página.
- Pastas reorganizadas como as do JudoKan: `core/`, `features/techniques/`, `layouts/`,
  `shared/ui/` e `shared/utils/`. `ThemeService` passou a se chamar `SettingsService`.

### Adicionado

- Modo de alto contraste, aplicado antes da primeira pintura e verificado com axe nos dois temas.
- Botão "Voltar ao topo" e dicas (tooltips) nos botões de ícone, como no JudoKan.
- Rodapé com a versão, "Sobre o Judô" e o link para o JudoKan.
- Página inicial em `/`, no formato da do JudoKan: o que o app faz, as faixas (cada uma abre as
  técnicas já nela), como funciona, privacidade e dúvidas frequentes. As técnicas foram para
  `/tecnicas`, com botão de voltar para a página de onde se veio.
- Título, descrição, Open Graph e endereço canônico próprios para cada página.
- `404.html` igual ao `index.html` no build, para links diretos funcionarem no GitHub Pages, e uma
  cópia por rota (`tecnicas.html`), para a página de técnicas responder 200 e poder ser indexada.
- `sitemap.xml` com as duas páginas.
- Lighthouse no CI, no celular e no desktop, como no JudoKan: acessibilidade, boas práticas e SEO
  precisam de 100.
- O banner da faixa ganhou o símbolo de fundo (道) dos banners do JudoKan, desenhado igual: a fonte
  japonesa vem no mesmo peso do JudoKan.
- O dependency review volta a valer no CI: o grafo de dependências e os alertas do Dependabot foram
  ligados no repositório.

### Corrigido

- O endereço das técnicas acompanha a faixa na tela (`?faixa=`): recarregar a página ou compartilhar
  o link abre a mesma faixa, e trocar de faixa não enche o histórico do navegador.
- O "Voltar" segue o histórico do navegador de verdade: entende quando uma página substitui a atual
  e, quando não tem certeza do que veio antes, vai para a página inicial em vez de chutar.
- A página não se mexe mais quando as fontes chegam (CLS 0): os ícones têm o espaço reservado e a
  Inter tem uma fonte reserva com as mesmas medidas.
- A fonte japonesa vem só com os caracteres que o app mostra, em vez da fonte inteira;
  `npm run check:icons` acusa um caractere novo que falte.
- Dependências de desenvolvimento (`glob` e `minimatch`) fixadas em versões sem as falhas
  conhecidas; `npm audit` não aponta nenhuma.
- O app podia ficar preso numa versão antiga sem nenhum aviso: quando o download de uma versão nova
  falhava (por exemplo, um arquivo desatualizado no cache do GitHub Pages durante a publicação), o
  service worker parava de buscar atualizações. Agora cada build publica um `version.json`, e o
  app, ao abrir, ao voltar para a tela e a cada meia hora, compara a própria versão com a publicada.
  Se a publicada é mais nova e o service worker não conseguiu entregá-la, o app descarta o próprio
  service worker e cache (só os dele, não os de outros projetos do mesmo domínio) e carrega a
  versão nova direto da rede.
- O app passa a procurar uma versão nova assim que abre, sem esperar o service worker ficar ocioso.

### Removido

- A fonte Noto Serif JP, usada só pelo logotipo antigo.

## [2.2.1] — 2026-11-13

### Corrigido

- O app continuava na versão antiga depois de cada publicação: baixava a nova em segundo plano e
  esperava um toque em "Atualizar". Agora, se a versão nova chega logo depois de o app ser aberto
  ou trazido de volta, ele troca sozinho. O aviso só aparece quando a pessoa já está usando o app
  ou está com um diálogo aberto, para não interromper nada.

## [2.2.0] — 2026-11-13

### Corrigido

- O app instalado na tela inicial (principalmente no iOS) podia ficar dias numa versão antiga, porque
  só procurava atualizações ao ser aberto do zero. Agora procura também ao voltar para a tela e a
  cada meia hora enquanto está aberto.
- "Atualizar" ativa a nova versão antes de recarregar a página.
- Quando a versão em cache quebra, a mensagem oferece o botão "Recarregar" em vez de pedir que a
  página seja recarregada manualmente.
- Citações e título da página sem travessão.

### Dependências

- Angular 22 e TypeScript 6.0.
- ESLint 10.14, typescript-eslint 8.72.2, jasmine-core 7 e @types/jasmine 7.
- Dependabot agrupa as atualizações do Angular e não propõe mais versões incompatíveis com o
  compilador.

## [2.1.0] — 2026-11-12

Auditoria completa com base nos padrões do JudoKan.

### Corrigido

- Editar qualquer técnica trocava a categoria dela: o formulário só oferecia categorias que não
  existiam nos dados. Agora oferece as categorias em uso, sempre incluindo a da técnica.
- Técnicas novas de uma versão não apareciam para quem já tinha editado algo, porque o app guardava
  uma cópia completa dos dados. Agora só as alterações do usuário são guardadas (com migração
  automática dos dados antigos).
- Vídeos em links `youtube.com/shorts/…` apareciam como "não disponível".
- As abas das faixas apontavam para painéis inexistentes (índice × id), quebrando a relação para
  leitores de tela; com teclas repetidas, a navegação por setas pulava abas.
- O botão "Sim, remover" não ficava vermelho: os estilos próprios sobrepunham os do Tailwind.
- A tela de abertura ficava no mínimo 2 segundos na tela, mesmo com o app pronto.
- Natal e Ano Novo disputavam os mesmos dias.
- Mensagens de sucesso e erro se apagavam umas às outras.
- Escolher uma faixa salva fora do intervalo deixava a tela vazia.
- Conteúdo do "Sobre": kanji de Seiryoku Zen'yō (精力善用), "máxima eficiência" e a sequência das
  faixas coloridas.
- Contraste insuficiente no rodapé e em textos secundários.

### Segurança

- Dependências de produção sem vulnerabilidades conhecidas (antes: 56, incluindo _high_ no SheetJS
  e no jsPDF). SheetJS 0.20.3 (CDN oficial) e jsPDF 4.
- Content Security Policy; nenhum script inline; player do YouTube no modo `youtube-nocookie`.
- Removidos o import map de CDNs externas e a foto de fundo carregada do Unsplash.
- Chaves do `localStorage` com prefixo próprio (o GitHub Pages compartilha a origem entre projetos).

### Desempenho

- JavaScript inicial de 1,48 MB para ~290 kB (transferência de 408 kB para ~85 kB): sem o
  compilador JIT, e com Excel/PDF carregados só no primeiro download.
- Ícones pedidos ao Google Fonts só os usados (antes, uma fonte de 5,2 MB); `dist/` de 47 MB para
  2,4 MB.
- Foto de fundo em WebP responsivo, servida pelo próprio app.

### Acessibilidade

- Diálogos com `<dialog>` nativo: foco preso no diálogo, Escape, retorno do foco e bloqueio de
  rolagem; folha inferior no celular.
- Erros do formulário ao lado de cada campo, anunciados para leitores de tela.
- Configurações num diálogo acessível; tema como `switch`; tamanhos de fonte relativos (respeitam o
  tamanho configurado no navegador).
- Auditoria WCAG 2.1 AA com axe nos testes E2E, nos dois temas.

### Novo

- Restaurar técnicas originais; busca também por descrição e categoria, sem acentos; contador de
  resultados; link "Abrir no YouTube"; aviso de nova versão com botão Atualizar; versão do app nas
  configurações.

### Engenharia

- Service worker do Angular no lugar do escrito à mão.
- TypeScript `strict` e `strictTemplates`; signals (`input`/`output`/`viewChild`) em todos os
  componentes; Tailwind CSS 4.
- ESLint 10 com SonarJS e regras de acessibilidade de templates, Prettier, Husky + lint-staged.
- 100+ testes unitários (cobertura mínima de 95%) e testes E2E com Playwright em desktop e celular.
- CI com lint, tipos, testes, verificação dos dados e ícones, auditoria de dependências, E2E e
  orçamento de bundle; deploy só depois do CI verde; Dependabot.
