import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { CounterItem } from "../hooks/useCounters";
import { hapticFeedback } from "../utils/haptics";
import Counter from "./Counter";

interface SwipeableCounterProps {
    counter: CounterItem;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onDelete: (id: string) => void;
    onReset: (id: string) => void;
    onEdit: () => void;
    onLongPressIncrement?: (id: string) => void;
    onLongPressDecrement?: (id: string) => void;
    onLongPressCount?: (id: string) => void;
    drag?: () => void;
    isActive?: boolean;
    isSelectionMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    isDark: boolean;
    isCompact?: boolean;
}

export function SwipeableCounter({
    counter,
    onDelete,
    onEdit,
    isDark,
    onIncrement,
    ...counterProps
}: SwipeableCounterProps) {
    const swipeableRef = useRef<Swipeable>(null);

    const renderLeftActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const trans = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [-100, 0],
            extrapolate: "clamp",
        });

        return (
            <Animated.View
                style={[
                    styles.editAction,
                    {
                        transform: [{ translateX: trans }],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                        hapticFeedback.medium();
                        swipeableRef.current?.close();
                        onEdit();
                    }}
                >
                    <Ionicons name="create" size={24} color="#FFFFFF" />
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: "clamp",
        });

        return (
            <Animated.View
                style={[
                    styles.deleteAction,
                    {
                        transform: [{ translateX: trans }],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        hapticFeedback.heavy();
                        swipeableRef.current?.close();
                        onDelete(counter.id);
                    }}
                >
                    <Ionicons name="trash" size={24} color="#FFFFFF" />
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            overshootLeft={false}
            overshootRight={false}
            onSwipeableOpen={() => hapticFeedback.medium()}
        >
            <Animated.View>
                <Counter
                    id={counter.id}
                    name={counter.name}
                    count={counter.count}
                    target={counter.target}
                    color={counter.color}
                    history={counter.history}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onIncrement={onIncrement}
                    {...counterProps}
                />
            </Animated.View>
        </Swipeable>
    );
}



const styles = StyleSheet.create({
    editAction: {
        justifyContent: "center",
        alignItems: "flex-start",
        marginVertical: 8,
    },
    editButton: {
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        width: 90,
        height: "100%",
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        paddingHorizontal: 16,
    },
    editText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        marginTop: 4,
    },
    deleteAction: {
        justifyContent: "center",
        alignItems: "flex-end",
        marginVertical: 8,
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
        justifyContent: "center",
        alignItems: "center",
        width: 90,
        height: "100%",
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        paddingHorizontal: 16,
    },
    deleteText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        marginTop: 4,
    },
});
