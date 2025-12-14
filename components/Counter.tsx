import { useColorScheme } from "@/hooks/use-color-scheme";
import { getContrastColor } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface HistoryEntry {
    timestamp: number;
    action: "increment" | "decrement";
    amount: number;
}

interface CounterProps {
    id: string;
    name: string;
    count: number;
    target?: number;
    color?: string;
    createdAt?: number;
    history: HistoryEntry[];
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
    isCompact?: boolean;
}

const Counter: React.FC<CounterProps> = ({
    id,
    name,
    count,
    target,
    color = "#007AFF",
    createdAt,
    history,
    onIncrement,
    onDecrement,
    onDelete,
    onReset,
    onEdit,
    onLongPressIncrement,
    onLongPressDecrement,
    onLongPressCount,
    drag,
    isActive = false,
    isSelectionMode = false,
    isSelected = false,
    onSelect,
    isCompact = false,
}) => {
    const [historyVisible, setHistoryVisible] = useState(false);
    const [quickMenuVisible, setQuickMenuVisible] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    // Animation refs
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleAction = (action: () => void) => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        action();
    };

    const handleLongPressCount = () => {
        if (!isSelectionMode && onLongPressCount) {
            if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            onLongPressCount(id);
        }
    };

    const handleReset = () => {
        Alert.alert(
            "Reset Counter",
            `Are you sure you want to reset "${name}" to 0?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: () => onReset(id),
                },
            ],
        );
    };

    const progress = target && target > 0 ? Math.max(0, Math.min(count / target, 1)) : 0;
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const subTextColor = isDark ? "#ABABAB" : "#666666";

    // Animate progress bar
    useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: progress,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress, count, target]);

    // Very subtle scale animation on count change
    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.05,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            }),
        ]).start();
    }, [count]);

    const handleLongPress = () => {
        if (isSelectionMode) return;

        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        if (drag) {
            drag();
        } else {
            setQuickMenuVisible(true);
        }
    };

    const handlePress = () => {
        if (isSelectionMode && onSelect) {
            onSelect(id);
        }
    };

    return (
        <TouchableOpacity
            onLongPress={handleLongPress}
            onPress={handlePress}
            activeOpacity={isSelectionMode ? 0.7 : 1}
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                        borderColor: isDark ? "#2C2C2C" : "rgba(0,0,0,0.05)",
                        transform: [{ scale: isActive ? 0.98 : 1 }],
                    },
                    isSelected && {
                        borderColor: isDark ? "#0A84FF" : "#007AFF",
                        borderWidth: 2,
                    },
                ]}
            >
                {isSelectionMode && (
                    <View style={styles.selectionOverlay}>
                        <Ionicons
                            name={isSelected ? "checkbox" : "square-outline"}
                            size={28}
                            color={
                                isSelected
                                    ? isDark
                                        ? "#0A84FF"
                                        : "#007AFF"
                                    : subTextColor
                            }
                        />
                    </View>
                )}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <View
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: color },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.counterLabel,
                                    { color: textColor },
                                ]}
                                numberOfLines={1}
                            >
                                {name || `Counter ${id.slice(-4)}`}
                            </Text>
                        </View>
                        {target && target > 0 && (
                            <Text
                                style={[
                                    styles.targetLabel,
                                    { color: subTextColor },
                                ]}
                            >
                                {count} / {target}
                            </Text>
                        )}
                    </View>
                    <View style={styles.headerActions}>
                        {!isSelectionMode && (
                            <>
                                <TouchableOpacity
                                    onPress={() => setQuickMenuVisible(true)}
                                    style={styles.iconButton}
                                >
                                    <Ionicons
                                        name="ellipsis-vertical"
                                        size={20}
                                        color={subTextColor}
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {createdAt && (
                    <Text
                        style={[
                            styles.dateLabel,
                            { color: subTextColor },
                        ]}
                    >
                        Created {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                )}

                {target && target > 0 && (
                    <View
                        style={[
                            styles.progressBarContainer,
                            {
                                backgroundColor: isDark ? "#2A2A2A" : "#F2F2F7",
                            },
                        ]}
                    >
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0%", "100%"],
                                    }),
                                    backgroundColor: color,
                                },
                            ]}
                        />
                    </View>
                )}

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: isDark ? "#2A2A2A" : "#F2F2F7",
                            },
                            isSelectionMode && { opacity: 0.5 },
                        ]}
                        onPress={() => handleAction(() => onDecrement(id))}
                        onLongPress={() => {
                            if (!isSelectionMode && onLongPressDecrement) {
                                if (Platform.OS !== "web") {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Heavy,
                                    );
                                }
                                onLongPressDecrement(id);
                            }
                        }}
                        disabled={isSelectionMode}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="remove-circle"
                            size={32}
                            color={textColor}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onLongPress={handleLongPressCount}
                        activeOpacity={0.8}
                        disabled={isSelectionMode}
                    >
                        <Animated.Text
                            style={[
                                styles.countValue,
                                isCompact && styles.compactCount,
                                {
                                    color:
                                        count >= (target || Infinity)
                                            ? color
                                            : textColor,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            {count}
                        </Animated.Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: color },
                            isSelectionMode && { opacity: 0.5 },
                        ]}
                        onPress={() => handleAction(() => onIncrement(id))}
                        onLongPress={() => {
                            if (!isSelectionMode && onLongPressIncrement) {
                                if (Platform.OS !== "web") {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Heavy,
                                    );
                                }
                                onLongPressIncrement(id);
                            }
                        }}
                        disabled={isSelectionMode}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="add-circle"
                            size={32}
                            color={getContrastColor(color)}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={historyVisible}
                onRequestClose={() => setHistoryVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                                borderColor: isDark ? "#2C2C2C" : "#E5E5EA",
                            },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text
                                style={[
                                    styles.modalTitle,
                                    { color: textColor },
                                ]}
                            >
                                History: {name}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setHistoryVisible(false)}
                            >
                                <Ionicons
                                    name="close"
                                    size={28}
                                    color={subTextColor}
                                />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.historyList}>
                            {history.length === 0 ? (
                                <Text
                                    style={[
                                        styles.emptyHistory,
                                        { color: subTextColor },
                                    ]}
                                >
                                    No history yet
                                </Text>
                            ) : (
                                history
                                    .slice()
                                    .reverse()
                                    .map((entry, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.historyItem,
                                                {
                                                    borderBottomColor: isDark
                                                        ? "#2C2C2C"
                                                        : "#E5E5EA",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.historyTime,
                                                    { color: textColor },
                                                ]}
                                            >
                                                {new Date(
                                                    entry.timestamp,
                                                ).toLocaleString()}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.historyAction,
                                                    {
                                                        color:
                                                            entry.action ===
                                                                "increment"
                                                                ? isDark
                                                                    ? "#32D74B"
                                                                    : "#34C759"
                                                                : isDark
                                                                    ? "#FF9F0A"
                                                                    : "#FF9500",
                                                    },
                                                ]}
                                            >
                                                {entry.action === "increment"
                                                    ? `+${entry.amount || 1}`
                                                    : `-${entry.amount || 1}`}
                                            </Text>
                                        </View>
                                    ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={quickMenuVisible}
                onRequestClose={() => setQuickMenuVisible(false)}
            >
                <Pressable
                    style={styles.quickMenuOverlay}
                    onPress={() => setQuickMenuVisible(false)}
                >
                    <View
                        style={[
                            styles.quickMenu,
                            {
                                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.quickMenuTitle,
                                {
                                    color: textColor,
                                    borderBottomColor: isDark
                                        ? "#2C2C2C"
                                        : "#E5E5EA",
                                },
                            ]}
                        >
                            Quick Actions
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.quickMenuItem,
                                {
                                    borderBottomColor: isDark
                                        ? "#2C2C2C"
                                        : "#E5E5EA",
                                },
                            ]}
                            onPress={() => {
                                setQuickMenuVisible(false);
                                onEdit();
                            }}
                        >
                            <Ionicons
                                name="create-outline"
                                size={26}
                                color={isDark ? "#0A84FF" : "#007AFF"}
                            />
                            <Text
                                style={[
                                    styles.quickMenuItemText,
                                    { color: textColor },
                                ]}
                            >
                                Edit Counter
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.quickMenuItem,
                                {
                                    borderBottomColor: isDark
                                        ? "#2C2C2C"
                                        : "#E5E5EA",
                                },
                            ]}
                            onPress={() => {
                                setQuickMenuVisible(false);
                                setHistoryVisible(true);
                            }}
                        >
                            <Ionicons
                                name="time-outline"
                                size={26}
                                color={isDark ? "#32D74B" : "#34C759"}
                            />
                            <Text
                                style={[
                                    styles.quickMenuItemText,
                                    { color: textColor },
                                ]}
                            >
                                View History
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.quickMenuItem,
                                {
                                    borderBottomColor: isDark
                                        ? "#2C2C2C"
                                        : "#E5E5EA",
                                },
                            ]}
                            onPress={() => {
                                setQuickMenuVisible(false);
                                handleReset();
                            }}
                        >
                            <Ionicons
                                name="reload-circle-outline"
                                size={26}
                                color={isDark ? "#FF9F0A" : "#FF9500"}
                            />
                            <Text
                                style={[
                                    styles.quickMenuItemText,
                                    { color: textColor },
                                ]}
                            >
                                Reset Counter
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickMenuItem}
                            onPress={() => {
                                setQuickMenuVisible(false);
                                onDelete(id);
                            }}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={26}
                                color={isDark ? "#FF453A" : "#FF3B30"}
                            />
                            <Text
                                style={[
                                    styles.quickMenuItemText,
                                    { color: textColor },
                                ]}
                            >
                                Delete Counter
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.quickMenuCancel,
                                {
                                    backgroundColor: isDark
                                        ? "#2A2A2A"
                                        : "#F2F2F7",
                                    borderColor: isDark ? "#2C2C2C" : "#E5E5EA",
                                },
                            ]}
                            onPress={() => setQuickMenuVisible(false)}
                        >
                            <Text
                                style={[
                                    styles.quickMenuCancelText,
                                    { color: textColor },
                                ]}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </TouchableOpacity>
    );
};

export default Counter;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    selectionOverlay: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
    },
    titleContainer: {
        flex: 1,
    },
    counterLabel: {
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    targetLabel: {
        fontSize: 13,
        marginTop: 4,
        fontWeight: "600",
        opacity: 0.65,
        letterSpacing: 0.2,
    },
    dateLabel: {
        fontSize: 11,
        marginBottom: 8,
        fontWeight: "500",
        opacity: 0.6,
        letterSpacing: 0.2,
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        padding: 4,
    },
    progressBarContainer: {
        height: 4,
        borderRadius: 2,
        marginBottom: 16,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 2,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    countValue: {
        fontSize: 52,
        fontWeight: "800",
        minWidth: 100,
        textAlign: "center",
        fontVariant: ["tabular-nums"],
        letterSpacing: -1.5,
    },
    compactCount: {
        fontSize: 36,
        minWidth: 80,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: "80%",
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    historyList: {
        marginBottom: 20,
    },
    historyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    historyTime: {
        fontSize: 14,
        fontWeight: "600",
    },
    historyAction: {
        fontWeight: "700",
        fontSize: 14,
    },
    emptyHistory: {
        textAlign: "center",
        marginTop: 20,
        fontWeight: "600",
        fontSize: 15,
    },
    quickMenuOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    quickMenu: {
        width: "90%",
        maxWidth: 320,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
    },
    quickMenuTitle: {
        fontSize: 18,
        fontWeight: "800",
        padding: 16,
        textAlign: "center",
        borderBottomWidth: 1,
        letterSpacing: 0.5,
    },
    quickMenuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        gap: 12,
        borderBottomWidth: 1,
    },
    quickMenuItemText: {
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    quickMenuCancel: {
        padding: 16,
        alignItems: "center",
        margin: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    quickMenuCancelText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
