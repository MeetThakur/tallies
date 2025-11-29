import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    RefreshControl,
    Alert,
} from "react-native";
import DraggableFlatList, {
    ScaleDecorator,
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ColorPickerWrapper } from "../../components/ColorPickerWrapper";
import Counter from "../../components/Counter";
import { useTheme } from "../../contexts/ThemeContext";

interface HistoryEntry {
    timestamp: number;
    action: "increment" | "decrement";
}

interface CounterItem {
    id: string;
    name: string;
    count: number;
    target?: number;
    color?: string;
    history: HistoryEntry[];
}

const COLORS = [
    "#007AFF",
    "#34C759",
    "#FF9500",
    "#FF3B30",
    "#5856D6",
    "#AF52DE",
    "#FF2D55",
    "#5AC8FA",
];

const COUNTER_TEMPLATES = [
    { name: "Water Glasses", icon: "💧", target: 8, color: "#5AC8FA" },
    { name: "Coffee Cups", icon: "☕", target: 3, color: "#8B4513" },
    { name: "Steps", icon: "👟", target: 10000, color: "#FF9500" },
    { name: "Push-ups", icon: "💪", target: 50, color: "#FF3B30" },
    { name: "Pages Read", icon: "📖", target: 30, color: "#5856D6" },
    { name: "Meditation", icon: "🧘", target: 1, color: "#34C759" },
    { name: "Tasks Done", icon: "✅", target: 10, color: "#007AFF" },
    { name: "Calls Made", icon: "📞", target: 5, color: "#AF52DE" },
];

// Helper function to get contrasting text color
const getContrastColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? "#000" : "#FFF";
};

export default function HomeScreen() {
    const [counters, setCounters] = useState<CounterItem[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingCounter, setEditingCounter] = useState<CounterItem | null>(
        null,
    );
    const [newCounterName, setNewCounterName] = useState("");
    const [newCounterTarget, setNewCounterTarget] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [refreshing, setRefreshing] = useState(false);
    const [recentlyDeleted, setRecentlyDeleted] = useState<CounterItem | null>(
        null,
    );
    const [showUndo, setShowUndo] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedCounters, setSelectedCounters] = useState<string[]>([]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [customIncrementValue, setCustomIncrementValue] = useState("");
    const [showCustomIncrement, setShowCustomIncrement] = useState(false);
    const [currentCounterId, setCurrentCounterId] = useState<string | null>(
        null,
    );
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        loadCounters();
    }, []);

    useEffect(() => {
        saveCounters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counters]);

    const loadCounters = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@counters");
            if (jsonValue != null) {
                setCounters(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Failed to load counters", e);
        }
    };

    const saveCounters = async () => {
        try {
            await AsyncStorage.setItem("@counters", JSON.stringify(counters));
        } catch (e) {
            console.error("Failed to save counters", e);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCounters();
        setTimeout(() => setRefreshing(false), 500);
    };

    const openAddModal = () => {
        setNewCounterName("");
        setNewCounterTarget("");
        setSelectedColor(COLORS[0]);
        setShowTemplates(false);
        setModalVisible(true);
    };

    const applyTemplate = (template: (typeof COUNTER_TEMPLATES)[0]) => {
        setNewCounterName(template.name);
        setNewCounterTarget(template.target.toString());
        setSelectedColor(template.color);
        setShowTemplates(false);
    };

    const saveCounter = () => {
        const newCounter: CounterItem = {
            id: Date.now().toString(),
            name: newCounterName,
            count: 0,
            target: newCounterTarget ? parseInt(newCounterTarget) : undefined,
            color: selectedColor,
            history: [],
        };
        setCounters([...counters, newCounter]);
        setModalVisible(false);
    };

    const openEditModal = (counter: CounterItem) => {
        setEditingCounter(counter);
        setNewCounterName(counter.name);
        setNewCounterTarget(counter.target?.toString() || "");
        setSelectedColor(counter.color || COLORS[0]);
        setEditModalVisible(true);
    };

    const saveEditCounter = () => {
        if (!editingCounter) return;

        setCounters(
            counters.map((counter) =>
                counter.id === editingCounter.id
                    ? {
                          ...counter,
                          name: newCounterName,
                          target: newCounterTarget
                              ? parseInt(newCounterTarget)
                              : undefined,
                          color: selectedColor,
                      }
                    : counter,
            ),
        );
        setEditModalVisible(false);
        setEditingCounter(null);
    };

    const updateCounter = (id: string, updates: Partial<CounterItem>) => {
        setCounters(
            counters.map((counter) =>
                counter.id === id ? { ...counter, ...updates } : counter,
            ),
        );
    };

    const incrementCounter = (id: string, amount: number = 1) => {
        setCounters(
            counters.map((counter) =>
                counter.id === id
                    ? {
                          ...counter,
                          count: counter.count + amount,
                          history: [
                              ...counter.history,
                              {
                                  timestamp: Date.now(),
                                  action: "increment" as const,
                              },
                          ],
                      }
                    : counter,
            ),
        );
    };

    const decrementCounter = (id: string) => {
        setCounters(
            counters.map((counter) =>
                counter.id === id
                    ? {
                          ...counter,
                          count: Math.max(0, counter.count - 1),
                          history: [
                              ...counter.history,
                              {
                                  timestamp: Date.now(),
                                  action: "decrement" as const,
                              },
                          ],
                      }
                    : counter,
            ),
        );
    };

    const handleCustomIncrement = () => {
        const amount = parseInt(customIncrementValue);
        if (currentCounterId && amount && amount > 0) {
            incrementCounter(currentCounterId, amount);
            setShowCustomIncrement(false);
            setCustomIncrementValue("");
            setCurrentCounterId(null);
        }
    };

    const resetCounter = (id: string) => {
        updateCounter(id, { count: 0, history: [] });
    };

    const deleteCounter = (id: string) => {
        const counterToDelete = counters.find((c) => c.id === id);
        if (counterToDelete) {
            setRecentlyDeleted(counterToDelete);
            setCounters(counters.filter((counter) => counter.id !== id));
            setShowUndo(true);

            // Hide undo after 5 seconds
            setTimeout(() => {
                setShowUndo(false);
                setRecentlyDeleted(null);
            }, 5000);
        }
    };

    const undoDelete = () => {
        if (recentlyDeleted) {
            setCounters([...counters, recentlyDeleted]);
            setRecentlyDeleted(null);
            setShowUndo(false);
        }
    };

    const toggleColorScheme = () => {
        toggleTheme();
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedCounters([]);
    };

    const toggleCounterSelection = (id: string) => {
        if (selectedCounters.includes(id)) {
            setSelectedCounters(selectedCounters.filter((cId) => cId !== id));
        } else {
            setSelectedCounters([...selectedCounters, id]);
        }
    };

    const selectAll = () => {
        if (selectedCounters.length === counters.length) {
            setSelectedCounters([]);
        } else {
            setSelectedCounters(counters.map((c) => c.id));
        }
    };

    const deleteSelected = () => {
        Alert.alert(
            "Delete Selected",
            `Are you sure you want to delete ${selectedCounters.length} counters?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setCounters(
                            counters.filter(
                                (c) => !selectedCounters.includes(c.id),
                            ),
                        );
                        setIsSelectionMode(false);
                        setSelectedCounters([]);
                    },
                },
            ],
        );
    };

    const resetSelected = () => {
        Alert.alert(
            "Reset Selected",
            `Are you sure you want to reset ${selectedCounters.length} counters to 0?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: () => {
                        setCounters(
                            counters.map((c) =>
                                selectedCounters.includes(c.id)
                                    ? { ...c, count: 0, history: [] }
                                    : c,
                            ),
                        );
                        setIsSelectionMode(false);
                        setSelectedCounters([]);
                    },
                },
            ],
        );
    };

    const renderItem = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<CounterItem>) => {
        return (
            <ScaleDecorator>
                <Counter
                    id={item.id}
                    name={item.name}
                    count={item.count}
                    target={item.target}
                    color={item.color}
                    history={item.history}
                    onIncrement={incrementCounter}
                    onDecrement={decrementCounter}
                    onDelete={deleteCounter}
                    onReset={resetCounter}
                    onEdit={() => openEditModal(item)}
                    onLongPressIncrement={(id) => {
                        setCurrentCounterId(id);
                        setShowCustomIncrement(true);
                    }}
                    drag={drag}
                    isActive={isActive}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedCounters.includes(item.id)}
                    onSelect={toggleCounterSelection}
                />
            </ScaleDecorator>
        );
    };

    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#000000" : "#F2F2F7";
    const headerBg = isDark ? "#1E1E1E" : "#FFFFFF";
    const borderColor = isDark ? "#2C2C2C" : "#E5E5EA";
    const subtleTextColor = isDark ? "#ABABAB" : "#666666";

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView
                style={[styles.container, { backgroundColor: bgColor }]}
            >
                <StatusBar
                    barStyle={isDark ? "light-content" : "dark-content"}
                />
                <View
                    style={[
                        styles.header,
                        {
                            backgroundColor: headerBg,
                            borderBottomColor: borderColor,
                        },
                    ]}
                >
                    {isSelectionMode ? (
                        <>
                            <TouchableOpacity
                                onPress={toggleSelectionMode}
                                style={styles.cancelButton}
                            >
                                <Text
                                    style={[
                                        styles.cancelButtonText,
                                        { color: "#007AFF" },
                                    ]}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        fontSize: 18,
                                        fontWeight: "700",
                                        color: textColor,
                                    },
                                ]}
                            >
                                {selectedCounters.length} Selected
                            </Text>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    onPress={selectAll}
                                    style={[
                                        styles.compactButton,
                                        {
                                            backgroundColor: isDark
                                                ? "#0A84FF"
                                                : "#007AFF",
                                        },
                                    ]}
                                    disabled={counters.length === 0}
                                >
                                    <Ionicons
                                        name="checkmark-done-outline"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={resetSelected}
                                    style={[
                                        styles.compactButton,
                                        {
                                            backgroundColor: isDark
                                                ? "#FF9F0A"
                                                : "#FF9500",
                                        },
                                    ]}
                                    disabled={selectedCounters.length === 0}
                                >
                                    <Ionicons
                                        name="reload-outline"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={deleteSelected}
                                    style={[
                                        styles.compactButton,
                                        {
                                            backgroundColor: isDark
                                                ? "#FF453A"
                                                : "#FF3B30",
                                        },
                                    ]}
                                    disabled={selectedCounters.length === 0}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.title, { color: textColor }]}>
                                Tallies
                            </Text>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.compactButton,
                                        {
                                            backgroundColor: isDark
                                                ? "rgba(255, 255, 255, 0.1)"
                                                : "transparent",
                                            borderWidth: isDark ? 0 : 1,
                                            borderColor: isDark
                                                ? "transparent"
                                                : borderColor,
                                        },
                                    ]}
                                    onPress={toggleSelectionMode}
                                >
                                    <Ionicons
                                        name="checkbox-outline"
                                        size={20}
                                        color={isDark ? textColor : "#007AFF"}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.compactButton,
                                        {
                                            backgroundColor: isDark
                                                ? "rgba(255, 255, 255, 0.1)"
                                                : "transparent",
                                            borderWidth: isDark ? 0 : 1,
                                            borderColor: isDark
                                                ? "transparent"
                                                : borderColor,
                                        },
                                    ]}
                                    onPress={toggleColorScheme}
                                >
                                    <Ionicons
                                        name={isDark ? "sunny" : "moon"}
                                        size={20}
                                        color={isDark ? "#FFF" : "#007AFF"}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.addButton,
                                        {
                                            backgroundColor: isDark
                                                ? "#0A84FF"
                                                : "#007AFF",
                                        },
                                    ]}
                                    onPress={openAddModal}
                                >
                                    <Ionicons
                                        name="add-circle"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                    <Text style={styles.addButtonText}>
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>

                <DraggableFlatList
                    data={counters}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onDragEnd={({ data }) => setCounters(data)}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={isDark ? "#0A84FF" : "#007AFF"}
                            colors={[isDark ? "#0A84FF" : "#007AFF"]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateEmoji}>📊</Text>
                            <Text
                                style={[
                                    styles.emptyStateText,
                                    { color: isDark ? "#98989D" : "#8E8E93" },
                                ]}
                            >
                                No counters yet
                            </Text>
                            <Text
                                style={[
                                    styles.emptyStateSubtext,
                                    { color: subtleTextColor },
                                ]}
                            >
                                Create your first counter to start tracking
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.emptyStateButton,
                                    {
                                        backgroundColor: isDark
                                            ? "#0A84FF"
                                            : "#007AFF",
                                    },
                                ]}
                                onPress={openAddModal}
                            >
                                <Ionicons
                                    name="add-circle"
                                    size={24}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.emptyStateButtonText}>
                                    Create Counter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalOverlay}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                    >
                        <View
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor: isDark
                                        ? "#1C1C1E"
                                        : "#FFF",
                                },
                            ]}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.modalHeader}>
                                    <Text
                                        style={[
                                            styles.modalTitle,
                                            { color: textColor },
                                        ]}
                                    >
                                        New Counter
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={24}
                                            color={subtleTextColor}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {!showTemplates ? (
                                    <TouchableOpacity
                                        style={[
                                            styles.templateButton,
                                            {
                                                backgroundColor: isDark
                                                    ? "rgba(255, 255, 255, 0.1)"
                                                    : "rgba(0, 122, 255, 0.1)",
                                                borderColor: isDark
                                                    ? "#3A3A3C"
                                                    : "#007AFF",
                                            },
                                        ]}
                                        onPress={() => setShowTemplates(true)}
                                    >
                                        <Ionicons
                                            name="grid-outline"
                                            size={22}
                                            color={
                                                isDark ? "#0A84FF" : "#007AFF"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.templateButtonText,
                                                {
                                                    color: isDark
                                                        ? "#0A84FF"
                                                        : "#007AFF",
                                                },
                                            ]}
                                        >
                                            Use Template
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <>
                                        <View style={styles.templateHeader}>
                                            <Text
                                                style={[
                                                    styles.inputLabel,
                                                    { color: subtleTextColor },
                                                ]}
                                            >
                                                Choose a Template
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setShowTemplates(false)
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.templateCloseText,
                                                        {
                                                            color: isDark
                                                                ? "#0A84FF"
                                                                : "#007AFF",
                                                        },
                                                    ]}
                                                >
                                                    Cancel
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.templateGrid}>
                                            {COUNTER_TEMPLATES.map(
                                                (template, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={[
                                                            styles.templateCard,
                                                            {
                                                                backgroundColor:
                                                                    isDark
                                                                        ? "#2C2C2E"
                                                                        : "#F2F2F7",
                                                                borderColor:
                                                                    isDark
                                                                        ? "#3A3A3C"
                                                                        : "#E5E5EA",
                                                            },
                                                        ]}
                                                        onPress={() =>
                                                            applyTemplate(
                                                                template,
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.templateIcon
                                                            }
                                                        >
                                                            {template.icon}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.templateName,
                                                                {
                                                                    color: textColor,
                                                                },
                                                            ]}
                                                        >
                                                            {template.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ),
                                            )}
                                        </View>
                                    </>
                                )}

                                <Text
                                    style={[
                                        styles.inputLabel,
                                        { color: subtleTextColor },
                                    ]}
                                >
                                    Name
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? "#1E1E1E"
                                                : "#F2F2F7",
                                            color: textColor,
                                            borderColor: isDark
                                                ? "#2C2C2C"
                                                : "transparent",
                                            borderWidth: isDark ? 1 : 0,
                                        },
                                    ]}
                                    placeholder="e.g. Coffee, Laps, Days..."
                                    placeholderTextColor={
                                        isDark ? "#636366" : "#999999"
                                    }
                                    value={newCounterName}
                                    onChangeText={setNewCounterName}
                                    autoFocus={true}
                                />

                                <Text
                                    style={[
                                        styles.inputLabel,
                                        { color: subtleTextColor },
                                    ]}
                                >
                                    Target (Optional)
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? "#1E1E1E"
                                                : "#F2F2F7",
                                            color: textColor,
                                            borderColor: isDark
                                                ? "#2C2C2C"
                                                : "transparent",
                                            borderWidth: isDark ? 1 : 0,
                                        },
                                    ]}
                                    placeholder="e.g. 10"
                                    placeholderTextColor={
                                        isDark ? "#636366" : "#999999"
                                    }
                                    value={newCounterTarget}
                                    onChangeText={setNewCounterTarget}
                                    keyboardType="numeric"
                                />

                                <Text
                                    style={[
                                        styles.inputLabel,
                                        { color: subtleTextColor },
                                    ]}
                                >
                                    Color
                                </Text>
                                <ColorPickerWrapper
                                    selectedColor={selectedColor}
                                    onSelectColor={setSelectedColor}
                                />

                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        { backgroundColor: selectedColor },
                                    ]}
                                    onPress={saveCounter}
                                >
                                    <Text
                                        style={[
                                            styles.saveButtonText,
                                            {
                                                color: getContrastColor(
                                                    selectedColor,
                                                ),
                                            },
                                        ]}
                                    >
                                        Create Counter
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editModalVisible}
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalOverlay}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                    >
                        <View
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor: isDark
                                        ? "#1C1C1E"
                                        : "#FFF",
                                },
                            ]}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.modalHeader}>
                                    <Text
                                        style={[
                                            styles.modalTitle,
                                            { color: textColor },
                                        ]}
                                    >
                                        Edit Counter
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setEditModalVisible(false)
                                        }
                                    >
                                        <Ionicons
                                            name="close"
                                            size={24}
                                            color={subtleTextColor}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Text
                                    style={[
                                        styles.inputLabel,
                                        { color: subtleTextColor },
                                    ]}
                                >
                                    Name
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? "#1E1E1E"
                                                : "#F2F2F7",
                                            color: textColor,
                                            borderColor: isDark
                                                ? "#2C2C2C"
                                                : "transparent",
                                            borderWidth: isDark ? 1 : 0,
                                        },
                                    ]}
                                    placeholder="e.g. Coffee, Laps, Days..."
                                    placeholderTextColor={
                                        isDark ? "#636366" : "#999999"
                                    }
                                    value={newCounterName}
                                    onChangeText={setNewCounterName}
                                    autoFocus={true}
                                />

                                <Text
                                    style={[
                                        styles.inputLabel,
                                        { color: subtleTextColor },
                                    ]}
                                >
                                    Target (Optional)
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? "#1E1E1E"
                                                : "#F2F2F7",
                                            color: textColor,
                                            borderColor: isDark
                                                ? "#2C2C2C"
                                                : "transparent",
                                            borderWidth: isDark ? 1 : 0,
                                        },
                                    ]}
                                    placeholder="e.g. 10"
                                    placeholderTextColor={
                                        isDark ? "#636366" : "#999999"
                                    }
                                    value={newCounterTarget}
                                    onChangeText={setNewCounterTarget}
                                    keyboardType="numeric"
                                />

                                <Text
                                    style={[
                                        styles.inputLabel,
                                        { color: subtleTextColor },
                                    ]}
                                >
                                    Color
                                </Text>
                                <ColorPickerWrapper
                                    selectedColor={selectedColor}
                                    onSelectColor={setSelectedColor}
                                />

                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        { backgroundColor: selectedColor },
                                    ]}
                                    onPress={saveEditCounter}
                                >
                                    <Text
                                        style={[
                                            styles.saveButtonText,
                                            {
                                                color: getContrastColor(
                                                    selectedColor,
                                                ),
                                            },
                                        ]}
                                    >
                                        Save Changes
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showCustomIncrement}
                    onRequestClose={() => setShowCustomIncrement(false)}
                >
                    <View style={styles.customIncrementOverlay}>
                        <View
                            style={[
                                styles.customIncrementModal,
                                {
                                    backgroundColor: isDark
                                        ? "#1E1E1E"
                                        : "#FFFFFF",
                                    borderColor: isDark ? "#2C2C2C" : "#E5E5EA",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.customIncrementTitle,
                                    { color: textColor },
                                ]}
                            >
                                Add Custom Amount
                            </Text>
                            <TextInput
                                style={[
                                    styles.customIncrementInput,
                                    {
                                        backgroundColor: isDark
                                            ? "#2A2A2A"
                                            : "#F2F2F7",
                                        color: textColor,
                                        borderColor: isDark
                                            ? "#2C2C2C"
                                            : "transparent",
                                        borderWidth: isDark ? 1 : 0,
                                    },
                                ]}
                                placeholder="Enter number"
                                placeholderTextColor={
                                    isDark ? "#636366" : "#999999"
                                }
                                value={customIncrementValue}
                                onChangeText={setCustomIncrementValue}
                                keyboardType="numeric"
                                autoFocus
                            />
                            <View style={styles.customIncrementButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.customIncrementButton,
                                        {
                                            backgroundColor: isDark
                                                ? "#2A2A2A"
                                                : "#F2F2F7",
                                        },
                                    ]}
                                    onPress={() => {
                                        setShowCustomIncrement(false);
                                        setCustomIncrementValue("");
                                        setCurrentCounterId(null);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.customIncrementButtonText,
                                            { color: subtleTextColor },
                                        ]}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.customIncrementButton,
                                        {
                                            backgroundColor: isDark
                                                ? "#0A84FF"
                                                : "#007AFF",
                                        },
                                    ]}
                                    onPress={handleCustomIncrement}
                                >
                                    <Text
                                        style={
                                            styles.customIncrementButtonTextPrimary
                                        }
                                    >
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {showUndo && (
                    <View
                        style={[
                            styles.undoContainer,
                            {
                                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                                borderTopWidth: 1,
                                borderTopColor: borderColor,
                            },
                        ]}
                    >
                        <View style={styles.undoContent}>
                            <Ionicons
                                name="trash-outline"
                                size={20}
                                color={isDark ? "#FF453A" : "#FF3B30"}
                            />
                            <Text
                                style={[styles.undoText, { color: textColor }]}
                            >
                                Counter deleted
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.undoButton,
                                {
                                    backgroundColor: isDark
                                        ? "#0A84FF"
                                        : "#007AFF",
                                },
                            ]}
                            onPress={undoDelete}
                        >
                            <Text style={styles.undoButtonText}>UNDO</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 0,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    headerButtons: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    cancelButton: {
        paddingVertical: 6,
        paddingHorizontal: 0,
    },
    cancelButtonText: {
        fontSize: 17,
        fontWeight: "500",
    },
    compactButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    addButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 16,
    },
    undoButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 15,
    },
    listContent: {
        paddingBottom: 100,
        paddingTop: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 120,
        padding: 20,
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        letterSpacing: 0,
    },
    emptyStateEmoji: {
        fontSize: 72,
        marginBottom: 16,
        opacity: 0.9,
    },
    emptyStateSubtext: {
        fontSize: 15,
        marginTop: 8,
        fontWeight: "400",
        marginBottom: 24,
    },
    emptyStateButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 24,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    emptyStateButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.5,
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
        paddingBottom: 32,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        maxHeight: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 4,
        marginLeft: 0,
        opacity: 0.8,
    },
    input: {
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 18,
        borderWidth: 0,
        fontWeight: "400",
    },
    colorPickerContainer: {
        marginBottom: 20,
        height: 140,
    },
    saveButton: {
        marginTop: 8,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        fontSize: 17,
        fontWeight: "600",
        letterSpacing: 0,
    },
    templateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 20,
    },
    templateButtonText: {
        fontSize: 15,
        fontWeight: "500",
    },
    templateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    templateCloseText: {
        fontSize: 15,
        fontWeight: "500",
    },
    templateGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 20,
    },
    templateCard: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        padding: 8,
    },
    templateIcon: {
        fontSize: 32,
        marginBottom: 4,
    },
    templateName: {
        fontSize: 11,
        fontWeight: "500",
        textAlign: "center",
    },
    customIncrementOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    customIncrementModal: {
        width: "100%",
        maxWidth: 320,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    customIncrementTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
        textAlign: "center",
    },
    customIncrementInput: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
    },
    customIncrementButtons: {
        flexDirection: "row",
        gap: 12,
    },
    customIncrementButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    customIncrementButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
    customIncrementButtonTextPrimary: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    undoContainer: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        padding: 16,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    undoContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    undoText: {
        fontSize: 15,
        fontWeight: "600",
    },
    undoButton: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 10,
        borderWidth: 1.5,
    },

    headerButtonText: {
        fontSize: 16,
        fontWeight: "700",
        textTransform: "uppercase",
    },
});
