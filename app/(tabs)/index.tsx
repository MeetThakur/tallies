import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Counter from '../../components/Counter';

interface CounterItem {
    id: string;
    name: string;
    count: number;
    target?: number;
    color?: string;
    history: number[];
}

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#AF52DE'];

export default function HomeScreen() {
    const [counters, setCounters] = useState<CounterItem[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCounterName, setNewCounterName] = useState('');
    const [newCounterTarget, setNewCounterTarget] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    useEffect(() => {
        loadCounters();
    }, []);

    useEffect(() => {
        saveCounters();
    }, [counters]);

    const loadCounters = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@counters');
            if (jsonValue != null) {
                setCounters(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Failed to load counters", e);
        }
    };

    const saveCounters = async () => {
        try {
            await AsyncStorage.setItem('@counters', JSON.stringify(counters));
        } catch (e) {
            console.error("Failed to save counters", e);
        }
    };

    const openAddModal = () => {
        setNewCounterName('');
        setNewCounterTarget('');
        setSelectedColor(COLORS[0]);
        setModalVisible(true);
    };

    const saveCounter = () => {
        const newCounter: CounterItem = {
            id: Date.now().toString(),
            name: newCounterName.trim() || `Counter ${counters.length + 1}`,
            count: 0,
            target: newCounterTarget ? parseInt(newCounterTarget) : undefined,
            color: selectedColor,
            history: [],
        };
        setCounters([...counters, newCounter]);
        setModalVisible(false);
    };

    const updateCounter = (id: string, updates: Partial<CounterItem>) => {
        setCounters(
            counters.map((counter) =>
                counter.id === id ? { ...counter, ...updates } : counter
            )
        );
    };

    const incrementCounter = (id: string) => {
        setCounters(
            counters.map((counter) =>
                counter.id === id
                    ? {
                        ...counter,
                        count: counter.count + 1,
                        history: [...counter.history, Date.now()]
                    }
                    : counter
            )
        );
    };

    const decrementCounter = (id: string) => {
        setCounters(
            counters.map((counter) =>
                counter.id === id ? { ...counter, count: Math.max(0, counter.count - 1) } : counter
            )
        );
    };

    const resetCounter = (id: string) => {
        updateCounter(id, { count: 0, history: [] });
    };

    const deleteCounter = (id: string) => {
        setCounters(counters.filter((counter) => counter.id !== id));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>Counters</Text>
                <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {counters.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="list-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>No counters yet</Text>
                        <Text style={styles.emptyStateSubtext}>Tap "Add" to create one</Text>
                    </View>
                ) : (
                    counters.map((counter) => (
                        <Counter
                            key={counter.id}
                            id={counter.id}
                            name={counter.name}
                            count={counter.count}
                            target={counter.target}
                            color={counter.color}
                            history={counter.history}
                            onIncrement={incrementCounter}
                            onDecrement={decrementCounter}
                            onDelete={deleteCounter}
                            onReset={resetCounter}
                        />
                    ))
                )}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Counter</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#999" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Coffee, Laps, Days..."
                            value={newCounterName}
                            onChangeText={setNewCounterName}
                            autoFocus={true}
                        />

                        <Text style={styles.inputLabel}>Target (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 10"
                            value={newCounterTarget}
                            onChangeText={setNewCounterTarget}
                            keyboardType="numeric"
                        />

                        <Text style={styles.inputLabel}>Color</Text>
                        <View style={styles.colorContainer}>
                            {COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>

                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: selectedColor }]} onPress={saveCounter}>
                            <Text style={styles.saveButtonText}>Create Counter</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        paddingTop: StatusBar.currentHeight || 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 40,
        paddingTop: 10,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        opacity: 0.5,
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#888',
        marginTop: 10,
    },
    emptyStateSubtext: {
        fontSize: 16,
        color: '#aaa',
        marginTop: 5,
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
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F2F2F7',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    colorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#000',
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
