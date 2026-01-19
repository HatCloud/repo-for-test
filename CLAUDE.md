# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Fitness Timer App** (HIIT countdown timer) with:
- **Client**: React Native (Expo SDK 54) mobile app
- **Backend**: Node.js + Express + SQLite (sql.js) API server
- **Containerization**: Docker for backend only (mobile apps run locally)

## Common Commands

### Backend
```bash
cd backend
npm run dev          # Start dev server with hot reload (tsx watch)
npm run build        # Compile TypeScript + copy sql-wasm.wasm to dist/
npm start            # Run compiled production server
```

### Client (React Native/Expo)
```bash
cd client
npm start            # Start Expo dev server
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
```

### Docker
```bash
docker compose up --build    # Build and start backend (port 8000)
docker compose config        # Validate docker-compose.yml
```

### CI Validation
GitHub Actions runs on every push:
1. Checks for `docker-compose.yml` existence
2. Validates Docker Compose config
3. Tests Docker build

## Architecture

### Client Structure
```
client/src/
├── screens/          # HomeScreen (timer), TemplatesScreen, HistoryScreen
├── components/       # ProgressRing (View-based circular progress)
├── hooks/useTimer.ts # Core timer state machine (idle→work→rest→complete)
├── context/          # TimerContext for global timer config state
├── services/api.ts   # Axios HTTP client for backend
├── utils/sound.ts    # Audio feedback (expo-av)
└── config.ts         # API_BASE_URL, DEFAULT_TEMPLATES, COLORS theme
```

### Backend Structure
```
backend/src/
├── index.ts              # Express server entry, routes mounting
├── db/database.ts        # sql.js initialization, tables: templates, records
└── routes/
    ├── templates.ts      # CRUD for workout templates
    └── records.ts        # Workout history + stats endpoint
```

### Timer State Machine
The `useTimer` hook manages phases: `idle` → `work` → `rest` → (repeat) → `set_rest` → (next set) → `complete`

### API Authentication
All API endpoints require `X-Device-ID` header for multi-device support.

### Network Configuration
The client auto-detects the correct backend URL based on platform:
- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://localhost:8000`
- Physical device: Must manually set LAN IP in `config.ts`

## Key Technical Decisions

- **sql.js** instead of better-sqlite3 (avoids native compilation issues in Docker)
- **View-based ProgressRing** instead of SVG (compatibility with Expo SDK 54)
- Backend persists SQLite database to `/app/data/fitness.db` (volume-mounted)

## Development Rules

### Changelog Management
After completing any feature implementation or bug fix, you MUST update `CHANGELOG.md` in the project root:
1. Add entries under `## [Unreleased]` section
2. Use appropriate subsections: `### Added`, `### Changed`, `### Fixed`, `### Removed`
3. Include brief description and affected files
4. Follow [Keep a Changelog](https://keepachangelog.com/) format
