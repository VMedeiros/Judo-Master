# Deploy, PWA e segurança

## Como o deploy acontece

1. Um push em `main` dispara o [CI](../.github/workflows/ci.yml).
2. Se **todos** os jobs passarem, o workflow [Deploy to GitHub Pages](../.github/workflows/deploy.yml)
   faz o checkout exatamente do commit aprovado, gera o build de produção e publica `dist/` no branch
   `gh-pages` (com `.nojekyll`).
3. O GitHub Pages serve o branch em <https://vmedeiros.github.io/Judo-Master/>.

Configuração esperada do repositório: **Settings → Pages → Source: Deploy from a branch →
`gh-pages` / `(root)`**. Para publicar de novo sem um commit novo, use **Actions → Deploy to GitHub
Pages → Run workflow**.

O build de produção usa `baseHref` `/Judo-Master/`; `npm start` serve em `/` para desenvolvimento.

## PWA e funcionamento offline

O app usa o service worker do Angular (`ngsw-worker.js`, configurado em
[ngsw-config.json](../ngsw-config.json)):

| Grupo   | Conteúdo                                                   | Quando é baixado |
| ------- | ---------------------------------------------------------- | ---------------- |
| `app`   | `index.html`, CSS, `main-*.js`, manifesto, `theme-init.js` | Na instalação    |
| `lazy`  | Chunks (Excel/PDF), imagens das faixas e a foto de fundo   | No primeiro uso  |
| `fonts` | Google Fonts (Inter, Noto, Material Symbols)               | No primeiro uso  |

Depois da primeira visita o app abre sem internet. Os vídeos do YouTube, naturalmente, precisam de
conexão. Quando uma versão nova é publicada, o service worker a baixa em segundo plano e o app
mostra "Uma nova versão do Judô Master está disponível" com o botão **Atualizar**.

### Migração do service worker antigo

Até a 2.0 o app tinha um service worker escrito à mão, publicado com o mesmo nome
(`ngsw-worker.js`). O navegador o substitui pelo do Angular na próxima visita; os caches antigos
(`judo-master-*`) são apagados pelo `LegacyCacheCleanupService`. Os registros de service worker de
outros projetos **não** são tocados: o GitHub Pages serve todos os projetos da conta na mesma origem
(`vmedeiros.github.io`).

Pelo mesmo motivo, todas as chaves do `localStorage` usam o prefixo `judo-master:`.

## Segurança

O GitHub Pages não permite cabeçalhos HTTP próprios, então a Content Security Policy está numa
meta tag no [index.html](../index.html):

- `script-src 'self'` — nenhum script inline; o tema é aplicado antes da primeira pintura por
  `assets/theme-init.js`, um arquivo externo
- `frame-src https://www.youtube-nocookie.com` — o único iframe é o player do YouTube, e a URL é
  montada a partir de um id validado (`/^[\w-]{11}$/`)
- `style-src` e `font-src` liberam apenas o Google Fonts; `object-src 'none'`, `base-uri 'self'`

`style-src` precisa de `'unsafe-inline'` porque o Angular injeta os estilos dos componentes em tags
`<style>`. Diretivas que só funcionam como cabeçalho (`frame-ancestors`, por exemplo) não têm efeito
numa meta tag.

## Checklist de release

1. Atualize `version` no `package.json` (o `src/environments/version.ts` é regerado no build).
2. Registre as mudanças no [CHANGELOG.md](../CHANGELOG.md).
3. Abra um PR para `main`; com o CI verde, faça o merge — o deploy é automático.
