<div align="center">
   <h1>🏯 Judô Master</h1>
   <p>Aplicação Angular para estudo, organização e gerenciamento de técnicas de Judô por faixa.</p>
   
   [![Deploy to GitHub Pages](https://github.com/VMedeiros/Judo-Master/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/VMedeiros/Judo-Master/actions)
   
   <p><strong><a href="https://vmedeiros.github.io/Judo-Master/">🔗 Acessar Aplicação</a></strong></p>
   <br/>
</div>

## 🎯 Visão Geral

O **Judô Master** auxilia praticantes e instrutores a acompanhar conteúdos de graduação: técnicas, categorias, descrições, execução e aplicação. A interface permite filtrar, adicionar, editar e remover técnicas, ajustar fonte, tamanho e alternar entre tema claro e escuro com persistência.

## 🧪 Tecnologias

- **Angular 21** (Standalone Components & Signals)
- **TypeScript 5**
- **Tailwind CSS** (utilização de classes utilitárias e modo escuro via classe `dark`)
- **RxJS** para reatividade em serviços

## 📁 Estrutura Simplificada

```
src/
   app.component.*        # Componente raiz e template
   assets/judo-data.json  # Dados de faixas e técnicas
   models/judo.model.ts   # Tipagens (Belt, Technique)
   services/judo-data.service.ts # Operações CRUD em memória
```

## 🔧 Configuração & Execução

Pré-requisito: **Node.js 18+**

```bash
npm install       # instala dependências
npm run dev       # inicia servidor de desenvolvimento (porta 3000)
npm run build     # build produção em dist/
npm run preview   # servir build de produção
npm run deploy    # deploy para GitHub Pages
```

## 🚀 Deploy

### GitHub Pages (Automático)

A aplicação é automaticamente implantada no GitHub Pages via GitHub Actions quando há push na branch `main`.

### Deploy Manual

```bash
npm run deploy
```

## 🌓 Tema Claro/Escuro

O tema alterna entre claro e escuro através de um toggle nas Configurações. A seleção é persistida em `localStorage` e, na ausência de preferência salva, respeita o `prefers-color-scheme` do sistema. Variáveis CSS e a classe `dark` em `<html>` controlam a paleta.

## ✍️ Funcionalidades Principais

- Listagem de faixas com informações (pré-requisitos, faixa etária)
- Agrupamento de técnicas por categoria
- Filtro textual por nome ou tradução
- Modal de detalhes de técnica
- CRUD (Adicionar / Editar / Remover) em memória
- Ajustes de acessibilidade: tamanho e família da fonte
- Alternância de tema persistente

## 🛠 Scripts

- `npm run dev` – Servidor de desenvolvimento
- `npm run build` – Build otimizado
- `npm run preview` – Servir build de produção

## 🚀 Próximas Melhorias (Sugestões)

- Persistência real (API / IndexedDB)
- Upload de mídia demonstrativa
- Busca avançada multi-campos
- Internacionalização (i18n)

## 🤝 Contribuição

1. Faça um fork
2. Crie uma branch: `git checkout -b feat/minha-melhoria`
3. Commit: `git commit -m "feat: adiciona ..."`
4. Push: `git push origin feat/minha-melhoria`
5. Abra um Pull Request

## 📄 Licença

Definir licença explícita (ex.: MIT). Caso nenhuma seja adicionada, o código permanece sem licença aberta formal.

---

Feito com dedicação para apoiar estudos de Judô. Oss! 🥋
