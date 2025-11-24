import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CounterProps {
    id: string;
    name: string;
    count: number;
    target?: number;
    color?: string;
    history: number[];
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onDelete: (id: string) => void;
    onReset: (id: string) => void;
}

const Counter: React.FC<CounterProps> = ({
    id, name, count, target, color = '#007AFF', history,
    onIncrement, onDecrement, onDelete, onReset
}) => {
    const [historyVisible, setHistoryVisible] = useState(false);

    const handleAction = (action: () => void) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        action();
    };

    const handleReset = () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        Alert.alert(
            "Reset Counter",
            "Are you sure you want to reset this counter to 0?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: () => onReset(id) }
            ]
        );
        // For web where Alert might not work as expected or for quick testing
        if (Platform.OS === 'web') {
            if (confirm("Reset counter to 0?")) {
                onReset(id);
            }
        }
    };

    const progress = target && target > 0 ? Math.min(count / target, 1) : 0;

    return (
        <View style={[styles.container, { borderLeftColor: color, borderLeftWidth: 6 }]}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.counterLabel} numberOfLines={1}>{name || `Counter ${id.slice(-4)}`}</Text>
                    {target && target > 0 && (
                        <Text style={styles.targetLabel}>Goal: {target}</Text>
                    )}
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => setHistoryVisible(true)} style={styles.iconButton}>
                        <Ionicons name="time-outline" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReset} style={styles.iconButton}>
                        <Ionicons name="refresh-outline" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(id)} style={styles.iconButton}>
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>

            {target && target > 0 && (
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
                </View>
            )}

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#E5E5EA' }]}
                    onPress={() => handleAction(() => onDecrement(id))}
                >
                    <Ionicons name="remove" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={[styles.countValue, { color: count >= (target || Infinity) ? color : '#000' }]}>
                    {count}
                </Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: color }]}
                    onPress={() => handleAction(() => onIncrement(id))}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={historyVisible}
                onRequestClose={() => setHistoryVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>History: {name}</Text>
                            <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                                <Ionicons name="close" size={24} color="#999" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.historyList}>
                            {history.length === 0 ? (
                                <Text style={styles.emptyHistory}>No history yet</Text>
                            ) : (
                                history.slice().reverse().map((timestamp, index) => (
                                    <View key={index} style={styles.historyItem}>
                                        <Text style={styles.historyTime}>
                                            {new Date(timestamp).toLocaleString()}
                                        </Text>
                                        <Text style={styles.historyAction}>+1</Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    titleContainer: {
        flex: 1,
    },
    counterLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    targetLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    iconButton: {
        padding: 4,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#F2F2F7',
        borderRadius: 3,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countValue: {
        fontSize: 42,
        fontWeight: '700',
        minWidth: 60,
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    historyList: {
        marginBottom: 20,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    historyTime: {
        color: '#333',
        fontSize: 16,
    },
    historyAction: {
        color: '#34C759',
        fontWeight: '600',
    },
    emptyHistory: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});

export default Counter;
