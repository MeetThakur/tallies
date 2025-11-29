import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Helper function to get contrasting text color
const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000" : "#FFF";
};

interface ColorPickerWrapperProps {
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

const PRESET_COLORS = [
    "#007AFF",
    "#34C759",
    "#FF9500",
    "#FF3B30",
    "#5856D6",
    "#AF52DE",
    "#FF2D55",
    "#5AC8FA",
    "#4CD964",
    "#FFCC00",
    "#8E8E93",
    "#000000",
];

export const ColorPickerWrapper: React.FC<ColorPickerWrapperProps> = ({
    selectedColor,
    onSelectColor,
}) => {
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [tempColor, setTempColor] = useState(selectedColor);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const handleCustomColorSubmit = () => {
        onSelectColor(tempColor);
        setShowCustomPicker(false);
    };

    const handlePresetSelect = (color: string) => {
        onSelectColor(color);
        setShowCustomPicker(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.presetContainer}>
                {PRESET_COLORS.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor === color && styles.selectedColor,
                        ]}
                        onPress={() => handlePresetSelect(color)}
                    />
                ))}
                <TouchableOpacity
                    style={[
                        styles.colorOption,
                        styles.customColorButton,
                        {
                            backgroundColor: isDark ? "#333" : "#F2F2F7",
                            borderColor: isDark ? "#555" : "#CCC",
                        },
                    ]}
                    onPress={() => {
                        setTempColor(selectedColor);
                        setShowCustomPicker(!showCustomPicker);
                    }}
                >
                    <Ionicons
                        name="color-palette"
                        size={20}
                        color={isDark ? "#AAA" : "#666"}
                    />
                </TouchableOpacity>
            </View>

            {showCustomPicker && (
                <View
                    style={[
                        styles.customPickerContainer,
                        {
                            backgroundColor: isDark ? "#1E1E1E" : "#F9F9F9",
                            borderColor: isDark ? "#2C2C2C" : "rgba(0,0,0,0.1)",
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.label,
                            { color: isDark ? "#AAA" : "#666" },
                        ]}
                    >
                        Custom Color
                    </Text>

                    <View style={styles.colorInputContainer}>
                        <View
                            style={[
                                styles.colorPreview,
                                { backgroundColor: tempColor },
                            ]}
                        />
                        <Text
                            style={[
                                styles.colorText,
                                { color: isDark ? "#FFF" : "#000" },
                            ]}
                        >
                            {tempColor.toUpperCase()}
                        </Text>
                    </View>

                    <View style={styles.hexInputRow}>
                        <Text
                            style={[
                                styles.hexLabel,
                                { color: isDark ? "#AAA" : "#666" },
                            ]}
                        >
                            #
                        </Text>
                        <input
                            type="color"
                            value={tempColor}
                            onChange={(e) => setTempColor(e.target.value)}
                            style={{
                                width: "100%",
                                height: 40,
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                backgroundColor: isDark ? "#2A2A2A" : "#FFF",
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.applyButton,
                            { backgroundColor: tempColor },
                        ]}
                        onPress={handleCustomColorSubmit}
                    >
                        <Text
                            style={[
                                styles.applyButtonText,
                                { color: getContrastColor(tempColor) },
                            ]}
                        >
                            Apply Custom Color
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 12,
        marginLeft: 0,
        opacity: 0.7,
    },
    presetContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 16,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    selectedColor: {
        borderWidth: 3.5,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        transform: [{ scale: 1.08 }],
    },
    customColorButton: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dashed",
    },
    customPickerContainer: {
        padding: 20,
        borderRadius: 14,
        marginTop: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    colorInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    colorPreview: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    colorText: {
        fontSize: 17,
        fontWeight: "700",
        fontFamily: "monospace",
        letterSpacing: 1,
    },
    hexInputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    },
    hexLabel: {
        fontSize: 20,
        fontWeight: "600",
    },
    applyButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});
