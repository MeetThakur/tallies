import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function StatisticsScreen() {
    const { isDark } = useTheme();
    const [counters, setCounters] = useState<CounterItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCounters = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@counters");
            if (jsonValue != null) {
                setCounters(JSON.parse(jsonValue));
            } else {
                setCounters([]);
            }
        } catch (e) {
            console.error("Failed to load counters", e);
            setCounters([]);
        }
    };

    useEffect(() => {
        loadCounters();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const countersInterval = setInterval(() => {
            loadCounters();
        }, 2000);

        return () => {
            clearInterval(countersInterval);
        };
    }, []);

    // Calculate statistics
    const totalCounters = counters.length;
    const totalCount = counters.reduce((sum, c) => sum + c.count, 0);
    const totalActions = counters.reduce((sum, c) => sum + c.history.length, 0);
    const completedGoals = counters.filter(
        (c) => c.target && c.count >= c.target,
    ).length;

    // Find most/least used counter
    const mostUsed =
        counters.length > 0
            ? counters.reduce((max, c) =>
                  c.history.length > max.history.length ? c : max,
              )
            : null;

    const highestCount =
        counters.length > 0
            ? counters.reduce((max, c) => (c.count > max.count ? c : max))
            : null;

    // Today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const todayActions = counters.reduce((sum, c) => {
        const todayHistory = c.history.filter(
            (h) => h.timestamp >= todayTimestamp,
        );
        return sum + todayHistory.length;
    }, 0);

    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#000000" : "#F2F2F7";
    const cardBg = isDark ? "#1E1E1E" : "#FFFFFF";
    const borderColor = isDark ? "#2C2C2C" : "#E5E5EA";
    const subtleTextColor = isDark ? "#ABABAB" : "#666666";

    if (isLoading) {
        return (
            <SafeAreaView
                style={[styles.container, { backgroundColor: bgColor }]}
            >
                <View
                    style={[
                        styles.header,
                        {
                            backgroundColor: cardBg,
                            borderBottomColor: borderColor,
                        },
                    ]}
                >
                    <Text style={[styles.title, { color: textColor }]}>
                        Statistics
                    </Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={[styles.emptyEmoji, { fontSize: 48 }]}>
                        📊
                    </Text>
                    <Text
                        style={[styles.emptyText, { color: subtleTextColor }]}
                    >
                        Loading...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: cardBg,
                        borderBottomColor: borderColor,
                    },
                ]}
            >
                <Text style={[styles.title, { color: textColor }]}>
                    Statistics
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                {counters.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📊</Text>
                        <Text
                            style={[
                                styles.emptyText,
                                { color: subtleTextColor },
                            ]}
                        >
                            No statistics yet
                        </Text>
                        <Text
                            style={[
                                styles.emptySubtext,
                                { color: subtleTextColor },
                            ]}
                        >
                            Create some counters to see your stats
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Overview Section */}
                        <View
                            style={[
                                styles.section,
                                {
                                    backgroundColor: cardBg,
                                    borderColor: borderColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    { color: textColor },
                                ]}
                            >
                                Overview
                            </Text>

                            <View style={styles.statsGrid}>
                                <View style={styles.statCard}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            {
                                                color: isDark
                                                    ? "#0A84FF"
                                                    : "#007AFF",
                                            },
                                        ]}
                                    >
                                        {totalCounters}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            { color: subtleTextColor },
                                        ]}
                                    >
                                        Total Counters
                                    </Text>
                                </View>

                                <View style={styles.statCard}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            {
                                                color: isDark
                                                    ? "#32D74B"
                                                    : "#34C759",
                                            },
                                        ]}
                                    >
                                        {totalCount}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            { color: subtleTextColor },
                                        ]}
                                    >
                                        Total Count
                                    </Text>
                                </View>

                                <View style={styles.statCard}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            {
                                                color: isDark
                                                    ? "#FF9F0A"
                                                    : "#FF9500",
                                            },
                                        ]}
                                    >
                                        {totalActions}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            { color: subtleTextColor },
                                        ]}
                                    >
                                        Total Actions
                                    </Text>
                                </View>

                                <View style={styles.statCard}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            {
                                                color: isDark
                                                    ? "#FF453A"
                                                    : "#FF3B30",
                                            },
                                        ]}
                                    >
                                        {completedGoals}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            { color: subtleTextColor },
                                        ]}
                                    >
                                        Goals Reached
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Today's Activity */}
                        <View
                            style={[
                                styles.section,
                                {
                                    backgroundColor: cardBg,
                                    borderColor: borderColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    { color: textColor },
                                ]}
                            >
                                Today&apos;s Activity
                            </Text>
                            <View style={styles.todayCard}>
                                <Ionicons
                                    name="calendar"
                                    size={36}
                                    color={isDark ? "#0A84FF" : "#007AFF"}
                                />
                                <View style={styles.todayContent}>
                                    <Text
                                        style={[
                                            styles.todayValue,
                                            { color: textColor },
                                        ]}
                                    >
                                        {todayActions} actions
                                    </Text>
                                    <Text
                                        style={[
                                            styles.todayLabel,
                                            { color: subtleTextColor },
                                        ]}
                                    >
                                        {new Date().toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Top Performers */}
                        {mostUsed && (
                            <View
                                style={[
                                    styles.section,
                                    {
                                        backgroundColor: cardBg,
                                        borderColor: borderColor,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.sectionTitle,
                                        { color: textColor },
                                    ]}
                                >
                                    Top Counters
                                </Text>

                                <View
                                    style={[
                                        styles.topCounter,
                                        { borderColor: borderColor },
                                    ]}
                                >
                                    <View style={styles.topCounterHeader}>
                                        <View
                                            style={[
                                                styles.colorDot,
                                                {
                                                    backgroundColor:
                                                        mostUsed.color ||
                                                        "#007AFF",
                                                },
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.topCounterName,
                                                { color: textColor },
                                            ]}
                                        >
                                            {mostUsed.name}
                                        </Text>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>
                                                Most Active
                                            </Text>
                                        </View>
                                    </View>
                                    <Text
                                        style={[
                                            styles.topCounterStats,
                                            { color: subtleTextColor },
                                        ]}
                                    >
                                        {mostUsed.history.length} actions •{" "}
                                        {mostUsed.count} count
                                    </Text>
                                </View>

                                {highestCount &&
                                    highestCount.id !== mostUsed.id && (
                                        <View
                                            style={[
                                                styles.topCounter,
                                                { borderColor: borderColor },
                                            ]}
                                        >
                                            <View
                                                style={styles.topCounterHeader}
                                            >
                                                <View
                                                    style={[
                                                        styles.colorDot,
                                                        {
                                                            backgroundColor:
                                                                highestCount.color ||
                                                                "#007AFF",
                                                        },
                                                    ]}
                                                />
                                                <Text
                                                    style={[
                                                        styles.topCounterName,
                                                        { color: textColor },
                                                    ]}
                                                >
                                                    {highestCount.name}
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.badge,
                                                        {
                                                            backgroundColor:
                                                                isDark
                                                                    ? "#32D74B"
                                                                    : "#34C759",
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.badgeText}
                                                    >
                                                        Highest Count
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text
                                                style={[
                                                    styles.topCounterStats,
                                                    { color: subtleTextColor },
                                                ]}
                                            >
                                                {highestCount.history.length}{" "}
                                                actions • {highestCount.count}{" "}
                                                count
                                            </Text>
                                        </View>
                                    )}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
        padding: 20,
    },
    emptyEmoji: {
        fontSize: 72,
        marginBottom: 16,
        opacity: 0.9,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    emptySubtext: {
        fontSize: 15,
        fontWeight: "500",
        opacity: 0.8,
    },
    section: {
        padding: 18,
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "700",
        marginBottom: 18,
        letterSpacing: 0.4,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    statCard: {
        flex: 1,
        minWidth: "45%",
        alignItems: "center",
        padding: 16,
    },
    statValue: {
        fontSize: 36,
        fontWeight: "800",
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.2,
        opacity: 0.85,
    },
    todayCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 16,
    },
    todayContent: {
        flex: 1,
    },
    todayValue: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    todayLabel: {
        fontSize: 14,
        fontWeight: "500",
    },
    topCounter: {
        padding: 14,
        borderBottomWidth: 1,
        marginBottom: 10,
        borderRadius: 8,
    },
    topCounterHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    topCounterName: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
    },
    badge: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    topCounterStats: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 28,
        opacity: 0.9,
    },
});
