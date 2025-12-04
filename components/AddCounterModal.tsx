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
import { COUNTER_TEMPLATES } from "../constants/templates";
import { sanitizeCounterName, validateCounterName, validateTarget } from "../utils/validation";
import { ColorPickerWrapper } from "./ColorPickerWrapper";

interface AddCounterModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (name: string, target: string, color: string) => void;
    isDark: boolean;
}

export function AddCounterModal({ visible, onClose, onSave, isDark }: AddCounterModalProps) {
    const [name, setName] = useState("");
    const [target, setTarget] = useState("");
    const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    const [targetError, setTargetError] = useState<string | null>(null);

    const handleSave = () => {
        // Validate inputs
        const sanitizedName = sanitizeCounterName(name);
        const nameValidation = validateCounterName(sanitizedName);
        const targetValidation = target ? validateTarget(target) : null;

        if (nameValidation) {
            setNameError(nameValidation);
            return;
        }

        if (targetValidation) {
            setTargetError(targetValidation);
            return;
        }

        onSave(sanitizedName, target, selectedColor);
        handleClose();
    };

    const handleClose = () => {
        setName("");
        setTarget("");
        setSelectedColor(PRESET_COLORS[0]);
        setShowTemplates(false);
        setNameError(null);
        setTargetError(null);
        onClose();
    };

    const applyTemplate = (template: typeof COUNTER_TEMPLATES[0]) => {
        setName(template.name);
        setTarget(template.target.toString());
        setSelectedColor(template.color);
        setShowTemplates(false);
        setNameError(null);
        setTargetError(null);
    };

    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#1C1C1E" : "#FFF";
    const subtleTextColor = isDark ? "#ABABAB" : "#666666";
    const borderColor = isDark ? "#2C2C2C" : "#E5E5EA";
    const inputBg = isDark ? "#1E1E1E" : "#F2F2F7";

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
                                New Counter
                            </Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={24} color={subtleTextColor} />
                            </TouchableOpacity>
                        </View>

                        {/* Templates */}
                        {!showTemplates ? (
                            <TouchableOpacity
                                style={[
                                    styles.templateButton,
                                    {
                                        backgroundColor: isDark
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "rgba(0, 122, 255, 0.1)",
                                        borderColor: isDark ? "#3A3A3C" : "#007AFF",
                                    },
                                ]}
                                onPress={() => setShowTemplates(true)}
                            >
                                <Ionicons
                                    name="grid-outline"
                                    size={22}
                                    color={isDark ? "#0A84FF" : "#007AFF"}
                                />
                                <Text
                                    style={[
                                        styles.templateButtonText,
                                        { color: isDark ? "#0A84FF" : "#007AFF" },
                                    ]}
                                >
                                    Use Template
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <View style={styles.templateHeader}>
                                    <Text style={[styles.inputLabel, { color: subtleTextColor }]}>
                                        Choose a Template
                                    </Text>
                                    <TouchableOpacity onPress={() => setShowTemplates(false)}>
                                        <Text
                                            style={[
                                                styles.templateCloseText,
                                                { color: isDark ? "#0A84FF" : "#007AFF" },
                                            ]}
                                        >
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.templateGrid}>
                                    {COUNTER_TEMPLATES.map((template, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.templateCard,
                                                {
                                                    backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
                                                    borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
                                                },
                                            ]}
                                            onPress={() => applyTemplate(template)}
                                        >
                                            <Text style={styles.templateIcon}>{template.icon}</Text>
                                            <Text style={[styles.templateName, { color: textColor }]}>
                                                {template.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

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

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Create Counter</Text>
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
    templateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 20,
    },
    templateButtonText: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
    templateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    templateCloseText: {
        fontSize: 16,
        fontWeight: "600",
    },
    templateGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 20,
    },
    templateCard: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
    },
    templateIcon: {
        fontSize: 32,
        marginBottom: 4,
    },
    templateName: {
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
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
