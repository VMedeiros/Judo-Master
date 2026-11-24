# Judô Master: instruções para o Claude Code

App Angular 22 (zoneless, signals, standalone, Tailwind 4) para estudar e organizar técnicas de judô por faixa, com filtros, edição e temas claro e escuro. Os dados ficam no aparelho (sem backend) e o app é uma PWA. Use também a skill de usuário **angular-moderno**; este arquivo e o README vencem quando divergirem.

## Leia antes de mexer

- [README.md](README.md): funcionalidades, "Dados no aparelho", como adicionar técnicas ao conteúdo original, qualidade e estrutura.
- [docs/MANUAL.md](docs/MANUAL.md) e [docs/DEPLOY.md](docs/DEPLOY.md).

## Regras

- **Dados do usuário ficam no aparelho**: mudança no formato salvo precisa de migração que preserve o que já existe; nunca apague dados do usuário numa atualização.
- **Conteúdo original** (técnicas por faixa) segue o processo do README e é validado por `npm run check:data`.
- **Service worker**: o app já teve problema de atualização (release 2.2.2); qualquer mudança em `ngsw-config.json` ou no registro do SW precisa ser testada com build de produção.
- **Bundle**: `npm run check:bundle` define o limite; não o aumente para caber uma dependência.
- Testes unitários usam **Karma + Jasmine** (não Vitest); e2e com Playwright.
- O README aponta para o app JudoKan, não para o repositório privado dele.

## Comandos

| Comando                                             | Quando                                    |
| --------------------------------------------------- | ----------------------------------------- |
| `npm start`                                         | Desenvolvimento                           |
| `npm run lint:ci`, `npm run typecheck`              | Lint sem avisos e tipos                   |
| `npm run test:ci`                                   | Unitários com cobertura (Chrome headless) |
| `npm run test:e2e`                                  | Playwright                                |
| `npm run check:data`, `check:icons`, `check:bundle` | Conteúdo, ícones e tamanho do bundle      |
| `npm run build`                                     | Build de produção                         |

**Antes de dizer que terminou**: `lint:ci`, `typecheck`, `test:ci`, os `check:*` afetados e `build`.

## Git

- Branch e PR para `main`; o pre-commit roda lint-staged. Releases são registradas no `CHANGELOG.md` ("Release X.Y.Z: ...").
- Mensagens no estilo do histórico: frase no imperativo, em inglês, dizendo o efeito.
- Commits só como VMedeiros, sem coautoria do Claude.
