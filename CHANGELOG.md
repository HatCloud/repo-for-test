# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- **Workout record sync with backend API** - Training records now persist to the server
  - HistoryScreen fetches records and stats from backend on mount
  - Pull-to-refresh support for history list
  - Auto-saves workout record when timer completes
  - Files affected: `client/src/screens/HistoryScreen.tsx`, `client/src/screens/HomeScreen.tsx`

- **Template sync with backend API** - Custom templates now persist to the server
  - Loads templates from backend on screen mount
  - Creates new templates via `POST /api/templates`
  - Supports deleting custom templates via long-press
  - Cloud icon indicates server-synced templates
  - Files affected: `client/src/screens/TemplatesScreen.tsx`

- **Audio playback for timer phase transitions** - Added sound effects for work/rest/complete/countdown events
  - Uses `expo-av` with background audio mode enabled
  - Sounds preloaded on app start for better performance
  - Supports background playback on iOS
  - Files affected: `client/src/utils/sound.ts`, `client/App.tsx`

### Fixed
- **Critical: App crash on startup** - Fixed `TypeError: expected dynamic type 'boolean', but had type 'string'` error
  - Root cause: `react-native-screens@4.19.0` incompatible with Expo SDK 54
  - Solution: Downgraded `react-native-screens` to `~4.16.0` and `react-native-svg` to `15.12.1`
  - Files affected: `client/package.json`

- **Progress ring updates smoothly every second** - Replaced View-based progress ring with SVG implementation
  - Previous implementation only showed 0%, 25%, 50%, 75%, 100% increments
  - New implementation uses `react-native-svg` for smooth circular progress
  - Files affected: `client/src/components/ProgressRing.tsx`

### Changed
- Refactored component syntax from `React.FC` to direct props typing (React 19 best practice)
  - Files affected: `TimerContext.tsx`, `HomeScreen.tsx`, `TemplatesScreen.tsx`, `HistoryScreen.tsx`, `ProgressRing.tsx`
- Updated `App.tsx` to use per-screen `options` instead of global `screenOptions` for navigation

