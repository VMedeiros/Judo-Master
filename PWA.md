# PWA - Progressive Web App

## ✅ Recursos PWA Implementados

A aplicação **Judô Master** agora é uma PWA completa com os seguintes recursos:

### 📱 Instalável

- Pode ser instalada em dispositivos móveis (Android/iOS)
- Pode ser instalada em desktop (Chrome/Edge)
- Ícone personalizado na tela inicial
- Aparece como app nativo

### 🚀 Funciona Offline

- Service Worker configurado
- Cache de recursos estáticos
- Funciona sem conexão de internet

### 🎨 Visual Nativo

- Splash screen personalizado
- Barra de status temática (#c8102e)
- Modo standalone (sem barra do navegador)
- Ícone baseado no logo da aplicação

## 🔧 Arquivos PWA

### Manifest (manifest.webmanifest)

```json
{
  "name": "Judô Master",
  "short_name": "Judô Master",
  "theme_color": "#c8102e",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/Judo-Master/"
}
```

### Service Worker (ngsw-worker.js)

- Cache de recursos estáticos
- Estratégia cache-first
- Atualização automática de cache

### Ícones

8 tamanhos de ícones gerados:

- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

Todos baseados no logo SVG do header da aplicação.

## 📲 Como Instalar

### Android (Chrome)

1. Acesse https://vmedeiros.github.io/Judo-Master/
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### iOS (Safari)

1. Acesse https://vmedeiros.github.io/Judo-Master/
2. Toque no botão compartilhar (□↑)
3. Selecione "Adicionar à Tela de Início"
4. Confirme

### Desktop (Chrome/Edge)

1. Acesse https://vmedeiros.github.io/Judo-Master/
2. Clique no ícone de instalação na barra de endereço (+)
3. Clique em "Instalar"

## 🛠️ Desenvolvimento

### Gerar Ícones

```bash
node generate-png-icons.mjs
```

### Testar PWA Localmente

```bash
npm run build
npx http-server dist -p 8080
```

Acesse: http://localhost:8080

### Validar PWA

Use o Lighthouse no Chrome DevTools:

1. F12 > Lighthouse
2. Selecione "Progressive Web App"
3. Clique em "Generate report"

## ✨ Checklist PWA

- ✅ Manifest configurado
- ✅ Service Worker registrado
- ✅ Ícones em múltiplos tamanhos
- ✅ Theme color definido
- ✅ Display standalone
- ✅ Start URL configurado
- ✅ HTTPS (GitHub Pages)
- ✅ Responsivo
- ✅ Funciona offline

## 🎯 Melhorias Futuras

- [ ] Notificações push
- [ ] Sincronização em background
- [ ] Compartilhamento nativo
- [ ] Shortcuts no ícone
- [ ] Update prompt customizado
