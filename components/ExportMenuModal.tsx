import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ExportMenuModalProps {
    visible: boolean;
    onClose: () => void;
    onExport: () => void;
    onImport: () => void;
    onShare: () => void;
    isDark: boolean;
}

export function ExportMenuModal({
    visible,
    onClose,
    onExport,
    onImport,
    onShare,
    isDark,
}: ExportMenuModalProps) {
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#1E1E1E" : "#FFFFFF";
    const borderColor = isDark ? "#2C2C2C" : "#E5E5EA";

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={[styles.menu, { backgroundColor: bgColor }]}>
                    <Text
                        style={[
                            styles.menuTitle,
                            {
                                color: textColor,
                                borderBottomColor: borderColor,
                            },
                        ]}
                    >
                        Backup & Share
                    </Text>

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomColor: borderColor }]}
                        onPress={onExport}
                    >
                        <Ionicons
                            name="download-outline"
                            size={24}
                            color={isDark ? "#0A84FF" : "#007AFF"}
                        />
                        <View style={styles.menuItemText}>
                            <Text style={[styles.menuItemTitle, { color: textColor }]}>
                                Export Backup
                            </Text>
                            <Text style={[styles.menuItemSubtitle, { color: isDark ? "#ABABAB" : "#666666" }]}>
                                Save counters to JSON file
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomColor: borderColor }]}
                        onPress={onImport}
                    >
                        <Ionicons
                            name="cloud-upload-outline"
                            size={24}
                            color={isDark ? "#32D74B" : "#34C759"}
                        />
                        <View style={styles.menuItemText}>
                            <Text style={[styles.menuItemTitle, { color: textColor }]}>
                                Import Backup
                            </Text>
                            <Text style={[styles.menuItemSubtitle, { color: isDark ? "#ABABAB" : "#666666" }]}>
                                Restore from JSON file
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={onShare}
                    >
                        <Ionicons
                            name="share-outline"
                            size={24}
                            color={isDark ? "#FF9F0A" : "#FF9500"}
                        />
                        <View style={styles.menuItemText}>
                            <Text style={[styles.menuItemTitle, { color: textColor }]}>
                                Share Summary
                            </Text>
                            <Text style={[styles.menuItemSubtitle, { color: isDark ? "#ABABAB" : "#666666" }]}>
                                Share as text message
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.cancelButton,
                            {
                                backgroundColor: isDark ? "#2A2A2A" : "#F2F2F7",
                                borderColor: borderColor,
                            },
                        ]}
                        onPress={onClose}
                    >
                        <Text style={[styles.cancelButtonText, { color: textColor }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    menu: {
        width: "90%",
        maxWidth: 400,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: "800",
        padding: 16,
        textAlign: "center",
        borderBottomWidth: 1,
        letterSpacing: 0.5,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        gap: 16,
        borderBottomWidth: 1,
    },
    menuItemText: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: 13,
        fontWeight: "500",
    },
    cancelButton: {
        padding: 16,
        alignItems: "center",
        margin: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
