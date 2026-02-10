# MovieLandia Mobile App

A mobile application for the MovieLandia platform built with Expo and React Native.

## Features

- 🎬 Browse Movies and TV Series
- 🔍 Search for Movies, Series, and Actors
- ⭐ Rate and Review Content
- 📝 Create and Manage Lists
- ❤️ Favorites and Watchlist
- 💬 Community Forum
- 👤 User Profiles
- 🌓 Dark Mode Support

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **Expo Router** for navigation
- **React Native Paper** for Material Design UI
- **TanStack Query** for data fetching and caching
- **Zustand** for state management
- **Axios** for HTTP requests
- **Expo Secure Store** for secure token storage

## Prerequisites

- Node.js >= 18
- npm >= 9
- Expo CLI

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `EXPO_PUBLIC_API_URL` variable with your backend API URL:

```
EXPO_PUBLIC_API_URL=http://your-backend-url:3000
```

For local development with an emulator or physical device, you may need to use your computer's local IP address instead of `localhost`.

### 3. Start the development server

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
movielandia-expo-mobile/
├── app/                    # App screens and navigation
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation screens
│   ├── movies/            # Movie detail screens
│   ├── series/            # Series detail screens
│   ├── actors/            # Actor detail screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── config/               # App configuration
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Libraries and utilities
│   └── api/              # API service layer
├── providers/            # App providers
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS (macOS only)
- `npm run web` - Start on web
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Backend Integration

This mobile app connects to the MovieLandia NestJS backend. Make sure the backend server is running before using the app.

The backend should be available at the URL specified in your `.env` file.

## Features Implementation Status

- ✅ Authentication (Sign In, Sign Up, Forgot Password)
- ✅ Movies Browsing and Search
- ✅ TV Series Browsing and Search
- ✅ Actor and Crew Search
- ✅ Genre Filtering
- ✅ User Profile
- ✅ Movie/Series/Actor Detail Pages
- 🚧 Reviews and Ratings (In Progress)
- 🚧 Lists Management (In Progress)
- 🚧 Favorites and Watchlist (In Progress)
- 🚧 Forum (In Progress)

## API Services

The app includes service layers for:

- Authentication (sign in, sign up, password reset)
- Movies (browse, search, details, related movies)
- TV Series (browse, search, details, seasons)
- Actors & Crew (browse, search, details)
- Genres (list, filter by genre)
- Reviews (create, read, update, delete)
- Lists (user collections, add/remove items)
- User (profile, favorites, watchlist)

## State Management

- **Zustand** for global state (auth, app settings)
- **TanStack Query** for server state (API data, caching)
- **Expo Secure Store** for secure token storage
