import { useState } from "react";

/**
 * Custom hook for managing selection mode and selected items
 */
export function useSelection<T extends { id: string }>(items: T[]) {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setSelectedIds([]);
        }
    };

    const toggleItem = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        } else {
            setSelectedIds((prev) => [...prev, id]);
        }
    };

    const selectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((item) => item.id));
        }
    };

    const clearSelection = () => {
        setSelectedIds([]);
        setIsSelectionMode(false);
    };

    const isSelected = (id: string) => selectedIds.includes(id);

    return {
        isSelectionMode,
        selectedIds,
        selectedCount: selectedIds.length,
        toggleSelectionMode,
        toggleItem,
        selectAll,
        clearSelection,
        isSelected,
    };
}
