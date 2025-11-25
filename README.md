# Tallies 🔢

A powerful, customizable tally counter app built with [Expo](https://expo.dev) and React Native. Track anything with style!

## ✨ Features

- **Multiple Tallies**: Create and manage unlimited counters
- **Drag to Reorder**: Long-press and drag counters to rearrange them
- **Edit Counters**: Modify counter name, target, and color anytime
- **Bulk Operations**: Select multiple counters for batch delete/reset
- **Quick Actions Menu**: Long-press counters for quick edit/delete/reset options
- **Undo Delete**: Accidentally deleted? Undo within 5 seconds
- **Pull to Refresh**: Swipe down to reload your counters
- **Custom Colors**: Choose from preset colors or create custom colors with a color wheel picker
- **Goal Tracking**: Set optional targets and track progress visually
- **History**: View timestamp history for each increment
- **Theme Switching**: Toggle between light and dark mode with a single tap
- **Neobrutal Design**: Bold, eye-catching aesthetic with thick borders and hard shadows
- **Haptic Feedback**: Tactile responses on iOS and Android
- **Cross-Platform**: Works seamlessly on iOS, Android, and Web
- **Data Persistence**: All counters are saved locally using AsyncStorage

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 🎯 Quality of Life Features

### ↕️ Drag to Reorder
- **Long-press** any counter to activate drag mode
- **Drag** the counter up or down to reorder
- **Release** to drop it in the new position
- Order is automatically saved

### ⚡ Quick Actions Menu
Long-press any counter (when not dragging) to open the quick actions menu:
- ✏️ **Edit Counter** - Quick access to edit modal
- 🕐 **View History** - See all your increments
- 🔄 **Reset Counter** - Zero out the count
- 🗑️ **Delete Counter** - Remove the counter

### ↩️ Undo Delete
- Delete a counter by mistake? No problem!
- **Undo button** appears at the bottom for 5 seconds
- Tap **UNDO** to restore the deleted counter
- Counter, count, and history all come back

### 🔄 Pull to Refresh
- Swipe down on the counter list to refresh
- Reloads data from storage
- Visual refresh indicator

### ☑️ Bulk Operations
Enter selection mode to manage multiple counters at once:
- Tap the **list icon** in the header to enter selection mode
- **Tap counters** to select/deselect them
- **Select All** button to choose all counters
- **Bulk Reset** - Reset multiple counters to 0 at once
- **Bulk Delete** - Delete multiple counters in one action
- **Cancel** to exit selection mode

**Selection Mode Features:**
- Visual checkbox overlay on each counter
- Selected counter count in header
- Blue border highlights selected counters
- Increment/decrement buttons disabled during selection
- Quick actions for managing large numbers of counters

## ✏️ Edit Counters

Each counter has an edit button (pencil icon) that allows you to:
- **Change the name**: Update the counter label
- **Modify the target**: Add, change, or remove goal numbers
- **Pick a new color**: Choose any color from the picker
- **Preserve count and history**: Your progress is never lost

Simply tap the pencil icon on any counter to open the edit modal!

## 🌓 Theme Switching

Toggle between light and dark mode instantly using the theme button in the header:
- **Light Mode**: Bright, clean aesthetic with white backgrounds
- **Dark Mode**: Easy on the eyes with dark backgrounds
- **Persistent**: Your theme preference is automatically remembered
- **Available Everywhere**: Theme toggle appears on both Home and Explore screens

Tap the ☀️ (sun) or 🌙 (moon) icon to switch themes!

## 🎨 Neobrutal Design

The app features a bold **neobrutal** (neobrutalism) design aesthetic:
- **Thick Black Borders**: 4-5px solid borders on all elements
- **Hard Drop Shadows**: Offset shadows with no blur for dramatic depth
- **Bold Typography**: 900-weight fonts with uppercase text
- **Square Corners**: Zero border radius for geometric shapes
- **High Contrast**: Black borders and shadows on vibrant colors
- **Playful Colors**: Yellow add button, pink theme toggle, colorful counters

This design style is energetic, accessible, and Instagram-worthy!

## 🎨 Custom Color Picker

The app features a sophisticated color picker system:

- **12 Preset Colors**: Quick selection from carefully curated colors
- **Custom Color Wheel**: 
  - **Native (iOS/Android)**: Full-featured color picker with interactive panel, hue slider, and swatches
  - **Web**: HTML5 color picker with hex input for precise color selection
- **Live Preview**: See your color choice in real-time
- **Dark Mode Optimized**: All color interfaces adapt to your theme
- **Smart Contrast**: Button text automatically adjusts (black/white) for readability

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
