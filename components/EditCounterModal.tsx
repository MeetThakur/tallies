import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PRESET_COLORS } from "../constants/colors";
import { CounterItem } from "../hooks/useCounters";
import { sanitizeCounterName, validateCounterName, validateTarget } from "../utils/validation";
import { ColorPickerWrapper } from "./ColorPickerWrapper";

interface EditCounterModalProps {
    visible: boolean;
    counter: CounterItem | null;
    onClose: () => void;
    onSave: (id: string, name: string, target: string, color: string, count: string) => void;
    isDark: boolean;
}

export function EditCounterModal({
    visible,
    counter,
    onClose,
    onSave,
    isDark,
}: EditCounterModalProps) {
    const [name, setName] = useState(counter?.name || "");
    const [target, setTarget] = useState(counter?.target?.toString() || "");
    const [currentCount, setCurrentCount] = useState(counter?.count?.toString() || "0");
    const [selectedColor, setSelectedColor] = useState<string>(
        counter?.color || PRESET_COLORS[0]
    );
    const [nameError, setNameError] = useState<string | null>(null);
    const [targetError, setTargetError] = useState<string | null>(null);
    const [countError, setCountError] = useState<string | null>(null);

    // Update state when counter changes
    React.useEffect(() => {
        if (counter) {
            setName(counter.name);
            setTarget(counter.target?.toString() || "");
            setCurrentCount(counter.count?.toString() || "0");
            setSelectedColor(counter.color || PRESET_COLORS[0]);
            setNameError(null);
            setTargetError(null);
            setCountError(null);
        }
    }, [counter]);

    const handleSave = () => {
        if (!counter) return;

        // Validate inputs
        const sanitizedName = sanitizeCounterName(name);
        const nameValidation = validateCounterName(sanitizedName);
        const targetValidation = target ? validateTarget(target) : null;

        // Validate count
        const countNum = parseInt(currentCount, 10);
        if (isNaN(countNum)) {
            setCountError("Count must be a valid number");
            return;
        }

        if (nameValidation) {
            setNameError(nameValidation);
            return;
        }

        if (targetValidation) {
            setTargetError(targetValidation);
            return;
        }

        onSave(counter.id, sanitizedName, target, selectedColor, currentCount);
        handleClose();
    };

    const handleClose = () => {
        setNameError(null);
        setTargetError(null);
        setCountError(null);
        onClose();
    };

    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#1C1C1E" : "#FFF";
    const subtleTextColor = isDark ? "#ABABAB" : "#666666";
    const borderColor = isDark ? "#2C2C2C" : "#E5E5EA";
    const inputBg = isDark ? "#1E1E1E" : "#F2F2F7";

    if (!counter) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: textColor }]}>
                                Edit Counter
                            </Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={24} color={subtleTextColor} />
                            </TouchableOpacity>
                        </View>

                        {/* Name Input */}
                        <Text style={[styles.inputLabel, { color: subtleTextColor }]}>Name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: inputBg,
                                    color: textColor,
                                    borderColor: nameError ? "#FF3B30" : borderColor,
                                },
                            ]}
                            placeholder="Enter counter name"
                            placeholderTextColor={subtleTextColor}
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                setNameError(null);
                            }}
                        />
                        {nameError && <Text style={styles.errorText}>{nameError}</Text>}

                        {/* Target Input */}
                        <Text style={[styles.inputLabel, { color: subtleTextColor }]}>
                            Target (Optional)
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: inputBg,
                                    color: textColor,
                                    borderColor: targetError ? "#FF3B30" : borderColor,
                                },
                            ]}
                            placeholder="Enter target number"
                            placeholderTextColor={subtleTextColor}
                            value={target}
                            onChangeText={(text) => {
                                setTarget(text);
                                setTargetError(null);
                            }}
                            keyboardType="numeric"
                        />
                        {targetError && <Text style={styles.errorText}>{targetError}</Text>}

                        {/* Color Picker */}
                        <Text style={[styles.inputLabel, { color: subtleTextColor }]}>Color</Text>
                        <ColorPickerWrapper
                            selectedColor={selectedColor}
                            onSelectColor={setSelectedColor}
                        />

                        {/* Current Count Input */}
                        <Text style={[styles.inputLabel, { color: subtleTextColor }]}>
                            Current Count
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: inputBg,
                                    color: textColor,
                                    borderColor: countError ? "#FF3B30" : borderColor,
                                },
                            ]}
                            placeholder="Enter current count"
                            placeholderTextColor={subtleTextColor}
                            value={currentCount}
                            onChangeText={(text) => {
                                setCurrentCount(text);
                                setCountError(null);
                            }}
                            keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                        />
                        {countError && <Text style={styles.errorText}>{countError}</Text>}

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "800",
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    infoBox: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "rgba(0, 122, 255, 0.1)",
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 32,
        fontWeight: "800",
    },
    saveButton: {
        padding: 18,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 24,
        marginBottom: 20,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
    },
});
