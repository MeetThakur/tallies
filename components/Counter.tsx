import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
    useColorScheme,
    View,
} from "react-native";

interface HistoryEntry {
    timestamp: number;
    action: "increment" | "decrement";
}

// Helper function to get contrasting text color
const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000" : "#FFF";
};

interface CounterProps {
    id: string;
    name: string;
    count: number;
    target?: number;
    color?: string;
    history: HistoryEntry[];
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onDelete: (id: string) => void;
    onReset: (id: string) => void;
    onEdit: () => void;
    onLongPressIncrement?: (id: string) => void;
    drag?: () => void;
    isActive?: boolean;
    isSelectionMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}

const Counter: React.FC<CounterProps> = ({
    id,
    name,
    count,
    target,
    color = "#007AFF",
    history,
    onIncrement,
    onDecrement,
    onDelete,
    onReset,
    onEdit,
    onLongPressIncrement,
    drag,
    isActive = false,
    isSelectionMode = false,
    isSelected = false,
    onSelect,
}) => {
    const [historyVisible, setHistoryVisible] = useState(false);
    const [quickMenuVisible, setQuickMenuVisible] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    // Animation refs
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleAction = (action: () => void) => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        action();
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

    const progress = target && target > 0 ? Math.min(count / target, 1) : 0;
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
    }, [progress, count, target]);

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
                                        name="ellipsis-horizontal"
                                        size={20}
                                        color={subTextColor}
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

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
                        disabled={isSelectionMode}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="remove" size={24} color={textColor} />
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.countValue,
                            {
                                color:
                                    count >= (target || Infinity)
                                        ? color
                                        : textColor,
                            },
                        ]}
                    >
                        {count}
                    </Text>

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
                            name="add"
                            size={24}
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
                                                    ? "+1"
                                                    : "-1"}
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
                                name="pencil"
                                size={24}
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
                                name="time"
                                size={24}
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
                                name="refresh"
                                size={24}
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
                                name="trash"
                                size={24}
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
        fontWeight: "600",
        letterSpacing: 0,
    },
    targetLabel: {
        fontSize: 13,
        marginTop: 2,
        fontWeight: "500",
        opacity: 0.7,
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
        fontSize: 48,
        fontWeight: "700",
        minWidth: 100,
        textAlign: "center",
        fontVariant: ["tabular-nums"],
        letterSpacing: -1,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
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
        maxHeight: "70%",
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
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
        width: "85%",
        maxWidth: 360,
        borderRadius: 20,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    quickMenuTitle: {
        fontSize: 20,
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
        fontSize: 17,
        fontWeight: "600",
        letterSpacing: 0.2,
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
