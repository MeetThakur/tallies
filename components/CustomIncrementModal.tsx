import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { validateIncrement } from "../utils/validation";

interface CustomIncrementModalProps {
    visible: boolean;
    onClose: () => void;
    onIncrement: (amount: number) => void;
    isDark: boolean;
}

export function CustomIncrementModal({
    visible,
    onClose,
    onIncrement,
    isDark,
}: CustomIncrementModalProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleIncrement = () => {
        const validation = validateIncrement(value);
        if (validation) {
            setError(validation);
            return;
        }

        const amount = parseInt(value, 10);
        onIncrement(amount);
        handleClose();
    };

    const handleClose = () => {
        setValue("");
        setError(null);
        onClose();
    };

    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#1C1C1E" : "#FFF";
    const subtleTextColor = isDark ? "#ABABAB" : "#666666";
    const borderColor = isDark ? "#2C2C2C" : "#E5E5EA";
    const inputBg = isDark ? "#1E1E1E" : "#F2F2F7";

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: bgColor }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: textColor }]}>
                            Custom Increment
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color={subtleTextColor} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, { color: subtleTextColor }]}>
                        Enter amount to increment
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: inputBg,
                                color: textColor,
                                borderColor: error ? "#FF3B30" : borderColor,
                            },
                        ]}
                        placeholder="e.g., 5, 10, 100"
                        placeholderTextColor={subtleTextColor}
                        value={value}
                        onChangeText={(text) => {
                            setValue(text);
                            setError(null);
                        }}
                        keyboardType="numeric"
                        autoFocus
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={[styles.buttonText, { color: subtleTextColor }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.incrementButton,
                                { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                            ]}
                            onPress={handleIncrement}
                        >
                            <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                                Increment
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 20,
    },
    content: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 16,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        padding: 16,
        borderRadius: 12,
        fontSize: 18,
        borderWidth: 1,
        textAlign: "center",
        fontWeight: "600",
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
    },
    buttons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#E5E5EA",
    },
    incrementButton: {
        // backgroundColor set dynamically
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
