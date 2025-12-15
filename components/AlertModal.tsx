import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AlertModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    type?: "success" | "error" | "info";
    isDark: boolean;
}

export const AlertModal = ({
    visible,
    title,
    message,
    onClose,
    type = "info",
    isDark,
}: AlertModalProps) => {
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const subTextColor = isDark ? "#ABABAB" : "#666666";

    let iconName: keyof typeof Ionicons.glyphMap;
    let iconColor: string;
    let buttonColor: string;

    switch (type) {
        case "success":
            iconName = "checkmark-circle";
            iconColor = "#32D74B";
            buttonColor = isDark ? "#32D74B" : "#34C759";
            break;
        case "error":
            iconName = "alert-circle";
            iconColor = "#FF3B30";
            buttonColor = isDark ? "#FF453A" : "#FF3B30";
            break;
        default:
            iconName = "information-circle";
            iconColor = "#007AFF";
            buttonColor = isDark ? "#0A84FF" : "#007AFF";
            break;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
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
                        <Ionicons name={iconName} size={48} color={iconColor} />
                    </View>

                    <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                    <Text style={[styles.message, { color: subTextColor }]}>
                        {message}
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: buttonColor }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
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
        maxWidth: 300,
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
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
        fontWeight: "500",
    },
    button: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
