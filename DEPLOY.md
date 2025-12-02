# Judô Master - GitHub Pages Deployment

## ✅ Configuração Completa

A aplicação está configurada para deploy automático no GitHub Pages.

## 📋 Passos para Ativar GitHub Pages

1. **Fazer push do código para o GitHub:**

   ```bash
   git add .
   git commit -m "feat: configurar GitHub Pages deployment"
   git push origin main
   ```

2. **Configurar GitHub Pages no repositório:**

   - Acesse: `https://github.com/VMedeiros/Judo-Master/settings/pages`
   - Em **Source**, selecione: `GitHub Actions`
   - Salve as configurações

3. **Aguardar o deploy:**
   - O GitHub Actions executará automaticamente
   - Acompanhe em: `https://github.com/VMedeiros/Judo-Master/actions`
   - Após conclusão, acesse: `https://vmedeiros.github.io/Judo-Master/`

## 🔧 Configurações Aplicadas

### Angular.json

- ✅ `baseHref: "/Judo-Master/"` configurado para produção
- ✅ Paths relativos ajustados para GitHub Pages

### Package.json

- ✅ Script `deploy` adicionado: `npm run deploy`
- ✅ Dependência `angular-cli-ghpages` instalada

### GitHub Actions

- ✅ Workflow `.github/workflows/deploy.yml` criado
- ✅ Deploy automático em push para `main`
- ✅ Permissões configuradas para GitHub Pages

### Build

- ✅ Build de produção testado e funcionando
- ✅ BaseHref aplicado corretamente no index.html
- ✅ Assets com paths corretos

## 🚀 Deploy Manual (Alternativo)

Se preferir fazer deploy manual:

```bash
npm run deploy
```

Este comando irá:

1. Build de produção
2. Deploy para branch `gh-pages`
3. Publicar no GitHub Pages

## 🌐 URLs

- **Produção:** https://vmedeiros.github.io/Judo-Master/
- **Repositório:** https://github.com/VMedeiros/Judo-Master
- **Actions:** https://github.com/VMedeiros/Judo-Master/actions

## ⚙️ Troubleshooting

### Página em branco após deploy

- Verifique se o `baseHref` está correto em `angular.json`
- Confirme que GitHub Pages está usando "GitHub Actions" como source

### Erro 404 em assets

- Certifique-se que o build foi executado antes do deploy
- Verifique se todos os arquivos estão em `dist/`

### Deploy não executa

- Verifique permissões em Settings > Actions > General
- Habilite "Read and write permissions" para workflows
