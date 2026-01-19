# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed
- **Critical: App crash on startup** - Fixed `TypeError: expected dynamic type 'boolean', but had type 'string'` error
  - Root cause: `react-native-screens@4.19.0` incompatible with Expo SDK 54
  - Solution: Downgraded `react-native-screens` to `~4.16.0` and `react-native-svg` to `15.12.1`
  - Files affected: `client/package.json`

### Changed
- Refactored component syntax from `React.FC` to direct props typing (React 19 best practice)
  - Files affected: `TimerContext.tsx`, `HomeScreen.tsx`, `TemplatesScreen.tsx`, `HistoryScreen.tsx`, `ProgressRing.tsx`
- Updated `App.tsx` to use per-screen `options` instead of global `screenOptions` for navigation
