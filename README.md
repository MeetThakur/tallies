# Tallies 🔢
A simple, elegant tally counter app built with Expo and React Native.

## Features
- **Multiple Counters** - Track unlimited tallies
- **Custom Increment/Decrement** - Long-press +/- buttons for custom amounts
- **Goal Tracking** - Set targets and visualize progress
- **Swipe Gestures** - Swipe to delete or edit
- **Drag to Reorder** - Long-press to rearrange counters
- **Bulk Operations** - Select multiple counters to reset or delete
- **Negative Numbers** - Support for negative counts
- **Dark Mode** - Toggle between light and dark themes
- **Undo Delete** - 5-second window to restore deleted counters
- **Custom Colors** - Choose from presets or pick any color

## Quick Start

```bash
# Install dependencies
npm install

# Start the app
npx expo start
```

## Build APK

```bash
# Cloud build (recommended)
npx eas-cli build --platform android --profile preview

# Download from: https://expo.dev
```

## Tech Stack

- **Expo SDK 54** - React Native framework
- **TypeScript** - Type-safe development
- **AsyncStorage** - Local data persistence
- **Expo Router** - File-based navigation
- **React Native Gesture Handler** - Swipe and drag interactions

## License

MIT
