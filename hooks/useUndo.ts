import { useEffect, useState } from "react";
import { TIMING } from "../constants/design";

/**
 * Custom hook for managing undo functionality for deleted items
 */
export function useUndo<T>() {
    const [deletedItem, setDeletedItem] = useState<T | null>(null);
    const [showUndo, setShowUndo] = useState(false);

    useEffect(() => {
        if (deletedItem) {
            setShowUndo(true);

            const timeout = setTimeout(() => {
                setShowUndo(false);
                setDeletedItem(null);
            }, TIMING.undoTimeout);

            return () => clearTimeout(timeout);
        }
    }, [deletedItem]);

    const markDeleted = (item: T) => {
        setDeletedItem(item);
    };

    const undo = (): T | null => {
        const item = deletedItem;
        setDeletedItem(null);
        setShowUndo(false);
        return item;
    };

    const clearUndo = () => {
        setDeletedItem(null);
        setShowUndo(false);
    };

    return {
        deletedItem,
        showUndo,
        markDeleted,
        undo,
        clearUndo,
    };
}
