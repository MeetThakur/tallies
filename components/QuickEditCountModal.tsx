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

interface QuickEditCountModalProps {
    visible: boolean;
    currentCount: number;
    counterName: string;
    onClose: () => void;
    onSave: (newCount: number) => void;
    isDark: boolean;
}

export function QuickEditCountModal({
    visible,
    currentCount,
    counterName,
    onClose,
    onSave,
    isDark,
}: QuickEditCountModalProps) {
    const [value, setValue] = useState(currentCount.toString());
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (visible) {
            setValue(currentCount.toString());
            setError(null);
        }
    }, [visible, currentCount]);

    const handleSave = () => {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0) {
            setError("Count must be a positive number");
            return;
        }

        onSave(num);
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
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: bgColor }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: textColor }]}>
                            Edit Count
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={subtleTextColor} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.counterName, { color: subtleTextColor }]}>
                        {counterName}
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
                        placeholder="Enter count"
                        placeholderTextColor={subtleTextColor}
                        value={value}
                        onChangeText={(text) => {
                            setValue(text);
                            setError(null);
                        }}
                        keyboardType="numeric"
                        autoFocus
                        selectTextOnFocus
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, { color: subtleTextColor }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.saveButton,
                                { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                                Save
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
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
    },
    counterName: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 16,
    },
    input: {
        padding: 16,
        borderRadius: 12,
        fontSize: 24,
        borderWidth: 1,
        textAlign: "center",
        fontWeight: "700",
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
    saveButton: {
        // backgroundColor set dynamically
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
