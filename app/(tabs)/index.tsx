import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Alert,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddCounterModal } from "../../components/AddCounterModal";
import { ConfirmModal } from "../../components/ConfirmModal";
import { CustomIncrementModal } from "../../components/CustomIncrementModal";
import { DataActionsModal } from "../../components/DataActionsModal";
import { EditCounterModal } from "../../components/EditCounterModal";
import { ImportChoiceModal } from "../../components/ImportChoiceModal";
import { SwipeableCounter } from "../../components/SwipeableCounter";
import { useTheme } from "../../contexts/ThemeContext";
import { CounterItem, useCounters } from "../../hooks/useCounters";
import { useSelection } from "../../hooks/useSelection";
import { useUndo } from "../../hooks/useUndo";
import { DataManager } from "../../utils/DataManager";

export default function HomeScreen() {
    // Custom hooks
    const { isDark, toggleTheme } = useTheme();
    const {
        counters,
        isLoading,
        addCounter,
        updateCounter,
        deleteCounter,
        reorderCounters,
        incrementCounter,
        decrementCounter,
        resetCounter,
        resetMultipleCounters,
        deleteMultipleCounters,
        importCounters,
        refreshCounters,
    } = useCounters();

    const { showUndo, markDeleted, undo } = useUndo<CounterItem>();
    const {
        isSelectionMode,
        selectedIds,
        selectedCount,
        toggleSelectionMode,
        toggleItem,
        selectAll,
        clearSelection,
        isSelected,
    } = useSelection(counters);

    // Insets for safe area
    const insets = useSafeAreaInsets();

    // Modal states
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingCounter, setEditingCounter] = useState<CounterItem | null>(null);
    const [customIncrementModalVisible, setCustomIncrementModalVisible] = useState(false);
    const [currentCounterId, setCurrentCounterId] = useState<string | null>(null);
    const [customModalMode, setCustomModalMode] = useState<"increment" | "decrement">("increment");

    // Data Management Modals
    const [dataActionsVisible, setDataActionsVisible] = useState(false);
    const [importChoiceVisible, setImportChoiceVisible] = useState(false);
    const [importedData, setImportedData] = useState<CounterItem[]>([]);

    const [refreshing, setRefreshing] = useState(false);

    // QoL features
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<string>("default");
    const [isCompact, setIsCompact] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [quickEditModalVisible, setQuickEditModalVisible] = useState(false);
    const [quickEditCounter, setQuickEditCounter] = useState<CounterItem | null>(null);


    // Confirmation Modal State
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
        isDestructive?: boolean;
        confirmText?: string;
    }>({
        title: "",
        message: "",
        onConfirm: () => { },
    });

    const showConfirm = (title: string, message: string, onConfirm: () => void, isDestructive = false, confirmText = "Confirm") => {
        setConfirmConfig({
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmModalVisible(false);
            },
            isDestructive,
            confirmText,
        });
        setConfirmModalVisible(true);
    };

    // Handlers
    const handleAddCounter = (name: string, target: string, color: string) => {
        addCounter({
            name,
            target: target ? parseInt(target) : undefined,
            color,
        });
    };

    const handleEditCounter = (id: string, name: string, target: string, color: string, count: string) => {
        updateCounter(id, {
            name,
            target: target ? parseInt(target) : undefined,
            color,
            count: parseInt(count, 10),
        });
    };

    const handleOpenEditModal = (counter: CounterItem) => {
        setEditingCounter(counter);
        setEditModalVisible(true);
    };

    const handleDeleteCounter = (id: string) => {
        const deleted = deleteCounter(id);
        if (deleted) {
            markDeleted(deleted);
        }
    };

    const handleUndoDelete = () => {
        const restored = undo();
        if (restored) {
            addCounter(restored);
        }
    };

    const handleCustomIncrement = (counterId: string) => {
        setCurrentCounterId(counterId);
        setCustomModalMode("increment");
        setCustomIncrementModalVisible(true);
    };

    const handleCustomDecrement = (counterId: string) => {
        setCurrentCounterId(counterId);
        setCustomModalMode("decrement");
        setCustomIncrementModalVisible(true);
    };

    const handleIncrementByAmount = (amount: number) => {
        if (currentCounterId) {
            if (customModalMode === "increment") {
                incrementCounter(currentCounterId, amount);
            } else {
                decrementCounter(currentCounterId, amount);
            }
            setCurrentCounterId(null);
        }
    };

    const handleLongPressCount = (counterId: string) => {
        const counter = counters.find(c => c.id === counterId);
        if (counter) {
            setQuickEditCounter(counter);
            setQuickEditModalVisible(true);
        }
    };

    const handleQuickEditCount = (newCount: number) => {
        if (quickEditCounter) {
            updateCounter(quickEditCounter.id, { count: newCount });
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshCounters();
        setTimeout(() => setRefreshing(false), 500);
    };

    const handleDeleteSelected = () => {
        showConfirm(
            "Delete Selected",
            `Are you sure you want to delete ${selectedCount} counters?`,
            () => {
                deleteMultipleCounters(selectedIds);
                clearSelection();
            },
            true,
            "Delete"
        );
    };

    const handleResetSelected = () => {
        showConfirm(
            "Reset Selected",
            `Are you sure you want to reset ${selectedCount} counters to 0?`,
            () => {
                resetMultipleCounters(selectedIds);
                clearSelection();
            },
            true,
            "Reset"
        );
    };

    const handleExport = async () => {
        setDataActionsVisible(false);
        // Small delay to allow modal to close smoothly
        setTimeout(async () => {
            await DataManager.exportData(counters);
        }, 300);
    };

    const handleImport = async () => {
        setDataActionsVisible(false);
        // Small delay
        setTimeout(async () => {
            await DataManager.importData((data) => {
                setImportedData(data);
                setImportChoiceVisible(true);
            });
        }, 300);
    };

    const finalizeImport = (mode: "merge" | "replace") => {
        setImportChoiceVisible(false);
        importCounters(importedData, mode);
        Alert.alert("Success", "Counters imported successfully");
    };

    // Filter and sort counters
    const filteredAndSortedCounters = useMemo(() => {
        let result = [...counters];

        // Filter by search query
        if (searchQuery.trim()) {
            result = result.filter(counter =>
                counter.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        switch (sortBy) {
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "count-high":
                result.sort((a, b) => b.count - a.count);
                break;
            case "count-low":
                result.sort((a, b) => a.count - b.count);
                break;
            case "date-new":
                result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
                break;
            case "date-old":
                result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                break;
            default:
                // Keep original order
                break;
        }

        return result;
    }, [counters, searchQuery, sortBy]);

    const renderItem = ({ item, drag, isActive }: RenderItemParams<CounterItem>) => {
        return (
            <ScaleDecorator>
                <SwipeableCounter
                    counter={item}
                    onIncrement={incrementCounter}
                    onDecrement={decrementCounter}
                    onDelete={handleDeleteCounter}
                    onReset={resetCounter}
                    onEdit={() => handleOpenEditModal(item)}
                    onLongPressIncrement={handleCustomIncrement}
                    onLongPressDecrement={handleCustomDecrement}
                    onLongPressCount={handleLongPressCount}
                    drag={drag}
                    isActive={isActive}
                    isSelectionMode={isSelectionMode}
                    isSelected={isSelected(item.id)}
                    onSelect={toggleItem}
                    isDark={isDark}
                    isCompact={isCompact}
                />
            </ScaleDecorator>
        );
    };

    // Theme colors
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#000000" : "#F2F2F7";
    const headerBg = isDark ? "#1E1E1E" : "#FFFFFF";
    const borderColor = isDark ? "#2C2C2C" : "#E5E5EA";
    const subtleTextColor = isDark ? "#98989D" : "#8E8E93";

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView
                style={[
                    styles.container,
                    {
                        backgroundColor: bgColor,
                        paddingTop: insets.top
                    }
                ]}
            >
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

                {/* Header */}
                <View
                    style={[
                        styles.header,
                        { backgroundColor: headerBg, borderBottomColor: borderColor },
                    ]}
                >
                    {isSelectionMode ? (
                        <>
                            <TouchableOpacity
                                onPress={toggleSelectionMode}
                                style={styles.cancelButton}
                            >
                                <Text style={[styles.cancelButtonText, { color: "#007AFF" }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style={[
                                    styles.title,
                                    { fontSize: 18, fontWeight: "700", color: textColor },
                                ]}
                            >
                                {selectedCount} Selected
                            </Text>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    onPress={selectAll}
                                    style={[
                                        styles.compactButton,
                                        { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
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
                                    onPress={handleResetSelected}
                                    style={[
                                        styles.compactButton,
                                        { backgroundColor: isDark ? "#FF9F0A" : "#FF9500" },
                                    ]}
                                    disabled={selectedCount === 0}
                                >
                                    <Ionicons name="reload-outline" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleDeleteSelected}
                                    style={[
                                        styles.compactButton,
                                        { backgroundColor: isDark ? "#FF453A" : "#FF3B30" },
                                    ]}
                                    disabled={selectedCount === 0}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.title, { color: textColor }]}>Tallies</Text>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.compactButton,
                                        {
                                            backgroundColor: isDark
                                                ? "rgba(255, 255, 255, 0.1)"
                                                : "transparent",
                                            borderWidth: isDark ? 0 : 1,
                                            borderColor: isDark ? "transparent" : borderColor,
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
                                            borderColor: isDark ? "transparent" : borderColor,
                                        },
                                    ]}
                                    onPress={toggleTheme}
                                >
                                    <Ionicons
                                        name={isDark ? "sunny" : "moon"}
                                        size={20}
                                        color={isDark ? "#FFF" : "#007AFF"}
                                    />
                                </TouchableOpacity>

                                {/* Export/Import Configuration Menu */}
                                <TouchableOpacity
                                    style={[
                                        styles.compactButton,
                                        {
                                            backgroundColor: isDark
                                                ? "rgba(255, 255, 255, 0.1)"
                                                : "transparent",
                                            borderWidth: isDark ? 0 : 1,
                                            borderColor: isDark ? "transparent" : borderColor,
                                        },
                                    ]}
                                    onPress={() => setDataActionsVisible(true)}
                                >
                                    <Ionicons
                                        name="settings-outline"
                                        size={20}
                                        color={isDark ? "#FFF" : "#007AFF"}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.addButton,
                                        { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                                    ]}
                                    onPress={() => setAddModalVisible(true)}
                                >
                                    <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                                    <Text style={styles.addButtonText}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>

                {/* Counter List */}
                <DraggableFlatList
                    data={counters}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onDragEnd={({ data }) => reorderCounters(data)}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
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
                                    { color: textColor },
                                ]}
                            >
                                No Counters Yet
                            </Text>
                            <Text style={[styles.emptyStateSubtext, { color: subtleTextColor }]}>
                                Tap the button below to create{"\n"}your first counter and start tracking
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.emptyStateButton,
                                    { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                                ]}
                                onPress={() => setAddModalVisible(true)}
                            >
                                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                                <Text style={styles.emptyStateButtonText}>Create Your First Counter</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />

                {/* Undo Button */}
                {showUndo && (
                    <View style={styles.undoContainer}>
                        <TouchableOpacity
                            style={[
                                styles.undoButton,
                                { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
                            ]}
                            onPress={handleUndoDelete}
                        >
                            <Ionicons
                                name="arrow-undo"
                                size={20}
                                color={isDark ? "#0A84FF" : "#007AFF"}
                            />
                            <Text
                                style={[
                                    styles.undoText,
                                    { color: isDark ? "#0A84FF" : "#007AFF" },
                                ]}
                            >
                                UNDO
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Modals */}
                <AddCounterModal
                    visible={addModalVisible}
                    onClose={() => setAddModalVisible(false)}
                    onSave={handleAddCounter}
                    isDark={isDark}
                />

                <EditCounterModal
                    visible={editModalVisible}
                    counter={editingCounter}
                    onClose={() => {
                        setEditModalVisible(false);
                        setEditingCounter(null);
                    }}
                    onSave={handleEditCounter}
                    isDark={isDark}
                />

                <CustomIncrementModal
                    visible={customIncrementModalVisible}
                    onClose={() => {
                        setCustomIncrementModalVisible(false);
                        setCurrentCounterId(null);
                    }}
                    onIncrement={handleIncrementByAmount}
                    isDark={isDark}
                    mode={customModalMode}
                />

                <ConfirmModal
                    visible={confirmModalVisible}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    onConfirm={confirmConfig.onConfirm}
                    onCancel={() => setConfirmModalVisible(false)}
                    isDestructive={confirmConfig.isDestructive}
                    confirmText={confirmConfig.confirmText}
                    isDark={isDark}
                />

                <DataActionsModal
                    visible={dataActionsVisible}
                    onClose={() => setDataActionsVisible(false)}
                    onExport={handleExport}
                    onImport={handleImport}
                    isDark={isDark}
                />

                <ImportChoiceModal
                    visible={importChoiceVisible}
                    onClose={() => setImportChoiceVisible(false)}
                    onMerge={() => finalizeImport("merge")}
                    onReplace={() => finalizeImport("replace")}
                    count={importedData.length}
                    isDark={isDark}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    headerButtons: {
        flexDirection: "row",
        gap: 8,
    },
    compactButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    cancelButton: {
        paddingVertical: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    listContent: {
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyStateEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyStateText: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    emptyStateSubtext: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    emptyStateButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    emptyStateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    undoContainer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    undoButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    undoText: {
        fontSize: 16,
        fontWeight: "800",
    },
});
