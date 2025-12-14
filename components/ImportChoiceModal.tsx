import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ImportChoiceModalProps {
    visible: boolean;
    onClose: () => void;
    onMerge: () => void;
    onReplace: () => void;
    count: number;
    isDark: boolean;
}

export const ImportChoiceModal = ({
    visible,
    onClose,
    onMerge,
    onReplace,
    count,
    isDark,
}: ImportChoiceModalProps) => {
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
                            name="cloud-download"
                            size={32}
                            color={isDark ? "#32D74B" : "#34C759"}
                        />
                    </View>

                    <Text style={[styles.title, { color: textColor }]}>Import Data</Text>
                    <Text style={[styles.message, { color: subTextColor }]}>
                        Found {count} counters. How would you like to import them?
                    </Text>

                    <View style={styles.verticalActions}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                            ]}
                            onPress={onMerge}
                        >
                            <Ionicons name="git-merge-outline" size={20} color="#FFFFFF" />
                            <View style={styles.buttonContent}>
                                <Text style={styles.actionButtonText}>Merge</Text>
                                <Text style={styles.actionSubtext}>Keep existing, add new</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                { backgroundColor: isDark ? "#FF453A" : "#FF3B30" },
                            ]}
                            onPress={onReplace}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                            <View style={styles.buttonContent}>
                                <Text style={styles.actionButtonText}>Replace</Text>
                                <Text style={styles.actionSubtext}>Delete all, add new</Text>
                            </View>
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
        paddingVertical: 12, // slightly smaller to fit 2 lines
        paddingHorizontal: 20,
        borderRadius: 16,
        gap: 16,
    },
    buttonContent: {
        flex: 1,
        alignItems: "flex-start",
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    actionSubtext: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 12,
        fontWeight: "500",
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
