import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isDark: boolean;
}

export const ConfirmModal = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
    isDark,
}: ConfirmModalProps) => {
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const subTextColor = isDark ? "#ABABAB" : "#666666";

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.content,
                        {
                            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                            borderColor: isDark ? "#2C2C2C" : "#000000",
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Ionicons
                            name={isDestructive ? "warning" : "information-circle"}
                            size={32}
                            color={isDestructive ? "#FF3B30" : "#007AFF"}
                        />
                    </View>

                    <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                    <Text style={[styles.message, { color: subTextColor }]}>
                        {message}
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.cancelButton,
                                {
                                    backgroundColor: isDark ? "#2A2A2A" : "#F2F2F7",
                                },
                            ]}
                            onPress={onCancel}
                        >
                            <Text style={[styles.buttonText, { color: textColor }]}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                {
                                    backgroundColor: isDestructive ? "#FF3B30" : "#007AFF",
                                },
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    content: {
        width: "100%",
        maxWidth: 320,
        borderRadius: 24,
        padding: 24,
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 0,
        elevation: 8,
        alignItems: "center",
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 8,
        textAlign: "center",
        letterSpacing: 0.5,
    },
    message: {
        fontSize: 15,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
        fontWeight: "500",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        borderWidth: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
