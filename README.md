# Real-Time Notification System

A modern, real-time notification system built with Next.js 16, featuring WebSocket integration, Google OAuth authentication, and a beautiful UI with Tailwind CSS and shadcn/ui.

## 🚀 Features

- ✅ **Real-time notifications** via WebSocket (Socket.IO)
- ✅ **Google OAuth authentication** with JWT
- ✅ **Beautiful UI** with shadcn/ui components and Tailwind CSS
- ✅ **Toast notifications** with Sonner
- ✅ **State management** with Zustand
- ✅ **Data fetching** with TanStack Query
- ✅ **TypeScript** for type safety
- ✅ **Responsive design** with fuchsia color palette

## 📋 Prerequisites

- Node.js 20+
- Google OAuth Client ID ([Get one here](https://console.cloud.google.com/apis/credentials))

## 🛠️ Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Google Client ID:

```env
NEXT_PUBLIC_API_URL=hapi-url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain
7. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain
8. Copy the Client ID and paste it in `.env.local`

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard page
│   ├── login/               # Login page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects)
├── components/
│   ├── notifications/       # Notification components
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationItem.tsx
│   │   └── NotificationList.tsx
│   ├── providers/           # React providers
│   │   └── Providers.tsx
│   └── ui/                  # shadcn/ui components
├── hooks/
│   └── useNotifications.ts  # Notification hook
├── lib/
│   ├── api.ts               # API client with axios
│   ├── socket.ts            # WebSocket service
│   └── utils.ts             # Utility functions
├── store/
│   ├── useAuthStore.ts      # Auth state management
│   └── useNotificationStore.ts # Notification state
└── types/
    └── index.ts             # TypeScript types
```

## 🎯 How It Works

### Authentication Flow

1. User clicks "Sign in with Google"
2. Google OAuth popup appears
3. User authorizes the app
4. Frontend receives Google access token
5. Token is sent to backend `/auth/google` endpoint
6. Backend validates token and returns JWT
7. JWT is stored in localStorage and Zustand store
8. User is redirected to dashboard

### Real-Time Notifications

1. On login, WebSocket connection is established with JWT
2. Backend sends notifications via `notification` event
3. Frontend receives notification and:
   - Adds it to the notification store
   - Shows a toast notification
   - Updates the notification bell badge
4. User can view all notifications in the dropdown
5. Clicking a notification marks it as read

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start dev server

# Build
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript type checking
```

## 🎨 Customization

### Change Color Palette

The app uses the **fuchsia** color palette. To change it:

1. Update Tailwind classes in components (e.g., `bg-fuchsia-600` → `bg-blue-600`)
2. Update the badge color in `NotificationBell.tsx`
3. Update gradient backgrounds in pages

### Add More Features

- **Mark all as read**: Add a button in `NotificationList.tsx`
- **Delete notifications**: Add delete functionality to API and UI
- **Filter notifications**: Add tabs for "All", "Unread", "Read"
- **Notification settings**: Add user preferences for notification types

## 🌐 API Endpoints

### Backend URL

- **Production**: `https://real-time-notification-system-nl.up.railway.app`
- **Swagger Docs**: `https://real-time-notification-system-nl.up.railway.app/api`

### Endpoints

- `POST /auth/google` - Authenticate with Google
- `GET /notifications` - Get all notifications
- `POST /notifications` - Create a notification

### WebSocket Events

- `notification` - Receive new notification

## 🐛 Troubleshooting

### WebSocket Connection Issues

- Check that the backend is running
- Verify JWT token is valid
- Check browser console for errors
- Backend may be in cold start (wait 30 seconds)

### Google OAuth Issues

- Verify Client ID is correct
- Check authorized origins in Google Console
- Clear browser cache and cookies
- Try incognito mode

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

## 📚 Technologies Used

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **HTTP Client**: Axios
- **WebSocket**: Socket.IO Client
- **Authentication**: Google OAuth + JWT
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📄 License

MIT
