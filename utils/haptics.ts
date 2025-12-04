import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Centralized haptic feedback patterns for consistent tactile responses
 */
export const hapticFeedback = {
    /**
     * Light impact - for button taps, increment/decrement
     */
    light: () => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    },

    /**
     * Medium impact - for long-press, swipe actions
     */
    medium: () => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    },

    /**
     * Heavy impact - for delete, reset actions
     */
    heavy: () => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    },

    /**
     * Success notification - for goal reached, successful actions
     */
    success: () => {
        if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    },

    /**
     * Warning notification - for approaching limits, caution
     */
    warning: () => {
        if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    },

    /**
     * Error notification - for errors, failed actions
     */
    error: () => {
        if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    },
};
