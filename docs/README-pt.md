# Sistema de Notificação em Tempo Real

Um sistema moderno de notificação em tempo real construído com Next.js 16, apresentando integração com WebSocket, autenticação Google OAuth e uma interface bonita com Tailwind CSS e shadcn/ui.

## 🚀 Funcionalidades

- ✅ **Notificações em tempo real** via WebSocket (Socket.IO)
- ✅ **Autenticação Google OAuth** com JWT
- ✅ **Interface bonita** com componentes shadcn/ui e Tailwind CSS
- ✅ **Notificações toast** com Sonner
- ✅ **Gerenciamento de estado** com Zustand
- ✅ **Busca de dados** com TanStack Query
- ✅ **TypeScript** para segurança de tipos
- ✅ **Design responsivo** com paleta de cores fuchsia

## 📋 Pré-requisitos

- Node.js 20+
- ID do Cliente Google OAuth ([Obtenha um aqui](https://console.cloud.google.com/apis/credentials))

## 🛠️ Configuração

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione seu ID de Cliente do Google:

```env
NEXT_PUBLIC_API_URL=hapi-url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu-google-client-id-aqui
```

### 3. Obter ID do Cliente Google OAuth

1. Vá para o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API Google+
4. Vá para **Credenciais** → **Criar Credenciais** → **ID do Cliente OAuth 2.0**
5. Configure a tela de consentimento OAuth
6. Adicione origens JavaScript autorizadas:
   - `http://localhost:3000` (para desenvolvimento)
   - Seu domínio de produção
7. Adicione URIs de redirecionamento autorizados:
   - `http://localhost:3000/api/auth/callback/google` (para desenvolvimento)
   - Seu domínio de produção
8. Copie o ID do Cliente e cole-o em `.env.local`

### 4. Executar Servidor de Desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Página de Dashboard
│   ├── login/               # Página de Login
│   ├── layout.tsx           # Layout Raiz
│   └── page.tsx             # Página Inicial (redireciona)
├── components/
│   ├── notifications/       # Componentes de Notificação
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationItem.tsx
│   │   └── NotificationList.tsx
│   ├── providers/           # Provedores React
│   │   └── Providers.tsx
│   └── ui/                  # Componentes shadcn/ui
├── hooks/
│   └── useNotifications.ts  # Hook de Notificação
├── lib/
│   ├── api.ts               # Cliente API com axios
│   ├── socket.ts            # Serviço WebSocket
│   └── utils.ts             # Funções utilitárias
├── store/
│   ├── useAuthStore.ts      # Gerenciamento de estado de Auth
│   └── useNotificationStore.ts # Estado de Notificação
└── types/
    └── index.ts             # Tipos TypeScript
```

## 🎯 Como Funciona

### Fluxo de Autenticação

1. Usuário clica em "Entrar com Google"
2. Popup do Google OAuth aparece
3. Usuário autoriza o aplicativo
4. Frontend recebe token de acesso do Google
5. Token é enviado para o endpoint `/auth/google` do backend
6. Backend valida o token e retorna JWT
7. JWT é armazenado no localStorage e na store do Zustand
8. Usuário é redirecionado para o dashboard

### Notificações em Tempo Real

1. No login, a conexão WebSocket é estabelecida com JWT
2. Backend envia notificações via evento `notification`
3. Frontend recebe notificação e:
   - Adiciona à store de notificações
   - Mostra uma notificação toast
   - Atualiza o emblema do sino de notificação
4. Usuário pode ver todas as notificações no menu suspenso
5. Clicar em uma notificação a marca como lida

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Iniciar servidor de desenvolvimento

# Build
pnpm build        # Build para produção
pnpm start        # Iniciar servidor de produção

# Qualidade de Código
pnpm lint         # Executar ESLint
pnpm typecheck    # Executar verificação de tipos TypeScript
```

## 🎨 Personalização

### Mudar Paleta de Cores

O aplicativo usa a paleta de cores **fuchsia**. Para mudar:

1. Atualize as classes Tailwind nos componentes (ex: `bg-fuchsia-600` → `bg-blue-600`)
2. Atualize a cor do emblema em `NotificationBell.tsx`
3. Atualize os fundos de gradiente nas páginas

### Adicionar Mais Funcionalidades

- **Marcar tudo como lido**: Adicione um botão em `NotificationList.tsx`
- **Excluir notificações**: Adicione funcionalidade de exclusão à API e UI
- **Filtrar notificações**: Adicione abas para "Todas", "Não Lidas", "Lidas"
- **Configurações de notificação**: Adicione preferências de usuário para tipos de notificação

## 🌐 Endpoints da API

### URL do Backend

- **Produção**: `https://real-time-notification-system-nl.up.railway.app`
- **Documentação Swagger**: `https://real-time-notification-system-nl.up.railway.app/api`

### Endpoints

- `POST /auth/google` - Autenticar com Google
- `GET /notifications` - Obter todas as notificações
- `POST /notifications` - Criar uma notificação

### Eventos WebSocket

- `notification` - Receber nova notificação

## 🐛 Solução de Problemas

### Problemas de Conexão WebSocket

- Verifique se o backend está rodando
- Verifique se o token JWT é válido
- Verifique o console do navegador para erros
- Backend pode estar em inicialização a frio (aguarde 30 segundos)

### Problemas com Google OAuth

- Verifique se o ID do Cliente está correto
- Verifique as origens autorizadas no Console do Google
- Limpe o cache e cookies do navegador
- Tente no modo anônimo

### Erros de Build

```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
pnpm install
pnpm build
```

## 📚 Tecnologias Utilizadas

- **Framework**: Next.js 16 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **Componentes de UI**: shadcn/ui
- **Gerenciamento de Estado**: Zustand
- **Busca de Dados**: TanStack Query
- **Cliente HTTP**: Axios
- **WebSocket**: Socket.IO Client
- **Autenticação**: Google OAuth + JWT
- **Notificações**: Sonner
- **Ícones**: Lucide React
- **Formatação de Data**: date-fns

## 📄 Licença

MIT
