import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    const [hexInput, setHexInput] = useState(selectedColor.replace("#", ""));
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

    const handleHexInputChange = (text: string) => {
        // Remove any non-hex characters
        const cleaned = text.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
        setHexInput(cleaned);

        // If we have a valid 6-character hex, update the color
        if (cleaned.length === 6) {
            setTempColor(`#${cleaned}`);
        }
    };

    const handleColorPickerChange = (e: any) => {
        const newColor = e.target.value;
        setTempColor(newColor);
        setHexInput(newColor.replace("#", ""));
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: isDark ? "#AAA" : "#666" }]}>
                Preset Colors
            </Text>
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
                        setHexInput(selectedColor.replace("#", ""));
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
                        { backgroundColor: isDark ? "#2C2C2E" : "#F9F9F9" },
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
                        <View style={styles.hexInputWrapper}>
                            <Text
                                style={[
                                    styles.hashSymbol,
                                    { color: isDark ? "#AAA" : "#666" },
                                ]}
                            >
                                #
                            </Text>
                            <TextInput
                                style={[
                                    styles.hexInput,
                                    {
                                        backgroundColor: isDark
                                            ? "#3A3A3C"
                                            : "#FFF",
                                        color: isDark ? "#FFF" : "#000",
                                        borderColor: isDark ? "#555" : "#DDD",
                                    },
                                ]}
                                value={hexInput}
                                onChangeText={handleHexInputChange}
                                placeholder="000000"
                                placeholderTextColor={isDark ? "#666" : "#999"}
                                maxLength={6}
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    <View style={styles.colorWheelContainer}>
                        <input
                            type="color"
                            value={tempColor}
                            onChange={handleColorPickerChange}
                            style={{
                                width: "100%",
                                height: 60,
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                backgroundColor: "transparent",
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
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "900",
        marginBottom: 12,
        marginLeft: 0,
        textTransform: "uppercase",
    },
    presetContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 10,
    },
    colorOption: {
        width: 48,
        height: 48,
        borderRadius: 0,
        borderWidth: 4,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    selectedColor: {
        borderWidth: 5,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        transform: [{ scale: 1.05 }],
    },
    customColorButton: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "#000",
        borderStyle: "solid",
    },
    customPickerContainer: {
        padding: 20,
        borderRadius: 0,
        marginTop: 15,
        borderWidth: 4,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    colorInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    colorPreview: {
        width: 56,
        height: 56,
        borderRadius: 0,
        borderWidth: 4,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    hexInputWrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    hashSymbol: {
        fontSize: 24,
        fontWeight: "900",
    },
    hexInput: {
        flex: 1,
        padding: 12,
        borderRadius: 0,
        fontSize: 16,
        fontFamily: "monospace",
        borderWidth: 3,
        fontWeight: "700",
    },
    colorWheelContainer: {
        marginBottom: 20,
        borderRadius: 0,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#000",
    },
    applyButton: {
        padding: 16,
        borderRadius: 0,
        alignItems: "center",
        borderWidth: 4,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    applyButtonText: {
        fontSize: 18,
        fontWeight: "900",
        textTransform: "uppercase",
    },
});
