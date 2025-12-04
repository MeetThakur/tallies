import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export interface HistoryEntry {
    timestamp: number;
    action: "increment" | "decrement";
}

export interface CounterItem {
    id: string;
    name: string;
    count: number;
    target?: number;
    color?: string;
    history: HistoryEntry[];
}

/**
 * Custom hook for managing counter data with AsyncStorage persistence
 */
export function useCounters() {
    const [counters, setCounters] = useState<CounterItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load counters from AsyncStorage on mount
    useEffect(() => {
        loadCounters();
    }, []);

    // Save counters to AsyncStorage whenever they change
    useEffect(() => {
        if (!isLoading) {
            saveCounters();
        }
    }, [counters, isLoading]);

    const loadCounters = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@counters");
            if (jsonValue != null) {
                setCounters(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Failed to load counters", e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveCounters = async () => {
        try {
            await AsyncStorage.setItem("@counters", JSON.stringify(counters));
        } catch (e) {
            console.error("Failed to save counters", e);
        }
    };

    const addCounter = (counter: Omit<CounterItem, "id" | "count" | "history">) => {
        const newCounter: CounterItem = {
            id: Date.now().toString(),
            count: 0,
            history: [],
            ...counter,
        };
        setCounters((prev) => [...prev, newCounter]);
        return newCounter;
    };

    const updateCounter = (id: string, updates: Partial<CounterItem>) => {
        setCounters((prev) =>
            prev.map((counter) =>
                counter.id === id ? { ...counter, ...updates } : counter
            )
        );
    };

    const deleteCounter = (id: string) => {
        const deletedCounter = counters.find((c) => c.id === id);
        setCounters((prev) => prev.filter((counter) => counter.id !== id));
        return deletedCounter;
    };

    const reorderCounters = (newOrder: CounterItem[]) => {
        setCounters(newOrder);
    };

    const incrementCounter = (id: string, amount: number = 1) => {
        setCounters((prev) =>
            prev.map((counter) =>
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
                    : counter
            )
        );
    };

    const decrementCounter = (id: string) => {
        setCounters((prev) =>
            prev.map((counter) =>
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
                    : counter
            )
        );
    };

    const resetCounter = (id: string) => {
        updateCounter(id, { count: 0, history: [] });
    };

    const resetMultipleCounters = (ids: string[]) => {
        setCounters((prev) =>
            prev.map((counter) =>
                ids.includes(counter.id)
                    ? { ...counter, count: 0, history: [] }
                    : counter
            )
        );
    };

    const deleteMultipleCounters = (ids: string[]) => {
        setCounters((prev) => prev.filter((counter) => !ids.includes(counter.id)));
    };

    const refreshCounters = async () => {
        await loadCounters();
    };

    return {
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
        refreshCounters,
    };
}
