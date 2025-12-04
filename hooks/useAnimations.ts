import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";

/**
 * Custom hook for counter value animations
 */
export function useCounterAnimation(count: number) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const prevCount = useRef(count);

    useEffect(() => {
        if (count !== prevCount.current) {
            // Trigger haptic feedback
            if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            // Bounce animation
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1.15,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 3,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 7,
                }),
            ]).start();

            prevCount.current = count;
        }
    }, [count, scaleAnim]);

    return { scaleAnim };
}

/**
 * Custom hook for goal completion celebration
 */
export function useGoalCelebration(count: number, target?: number) {
    const celebrationAnim = useRef(new Animated.Value(0)).current;
    const prevGoalReached = useRef(false);

    useEffect(() => {
        if (target && target > 0) {
            const goalReached = count >= target;

            // Trigger celebration when goal is newly reached
            if (goalReached && !prevGoalReached.current) {
                if (Platform.OS !== "web") {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    );
                }

                // Celebration animation
                Animated.sequence([
                    Animated.timing(celebrationAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(celebrationAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            }

            prevGoalReached.current = goalReached;
        }
    }, [count, target, celebrationAnim]);

    return { celebrationAnim, goalReached: count >= (target || Infinity) };
}

/**
 * Custom hook for button press animations
 */
export function useButtonAnimation() {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 5,
            }),
        ]).start();
    };

    return { scaleAnim, animatePress };
}
