import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DataActionsModalProps {
    visible: boolean;
    onClose: () => void;
    onExport: () => void;
    onImport: () => void;
    isDark: boolean;
}

export const DataActionsModal = ({
    visible,
    onClose,
    onExport,
    onImport,
    isDark,
}: DataActionsModalProps) => {
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const subTextColor = isDark ? "#ABABAB" : "#666666";

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
                        <Ionicons
                            name="settings"
                            size={32}
                            color={isDark ? "#FFFFFF" : "#000000"}
                        />
                    </View>

                    <Text style={[styles.title, { color: textColor }]}>Data Options</Text>
                    <Text style={[styles.message, { color: subTextColor }]}>
                        Manage your counters data
                    </Text>

                    <View style={styles.verticalActions}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                            ]}
                            onPress={onExport}
                        >
                            <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.actionButtonText}>Export Data</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                { backgroundColor: isDark ? "#32D74B" : "#34C759" },
                            ]}
                            onPress={onImport}
                        >
                            <Ionicons name="cloud-download-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.actionButtonText}>Import Data</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                { backgroundColor: isDark ? "#2A2A2A" : "#F2F2F7" },
                            ]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: textColor }]}>
                                Cancel
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
    verticalActions: {
        width: "100%",
        gap: 12,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    cancelButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 4,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
