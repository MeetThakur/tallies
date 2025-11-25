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

const EXTENDED_PALETTE = [
    // Reds
    "#FF0000",
    "#FF3333",
    "#FF6666",
    "#CC0000",
    "#990000",
    // Oranges
    "#FF6600",
    "#FF9933",
    "#FFCC00",
    "#CC7700",
    "#994400",
    // Yellows
    "#FFFF00",
    "#FFFF66",
    "#FFFFCC",
    "#CCCC00",
    "#999900",
    // Greens
    "#00FF00",
    "#33FF33",
    "#66FF66",
    "#00CC00",
    "#009900",
    "#00FFCC",
    "#33FFCC",
    "#00CCAA",
    "#009988",
    "#006655",
    // Blues
    "#0000FF",
    "#3333FF",
    "#6666FF",
    "#0000CC",
    "#000099",
    "#00CCFF",
    "#33AAFF",
    "#0099CC",
    "#006699",
    "#003366",
    // Purples
    "#9933FF",
    "#CC66FF",
    "#7700CC",
    "#550099",
    "#330066",
    // Pinks
    "#FF00FF",
    "#FF66FF",
    "#FF99CC",
    "#CC0099",
    "#990066",
    // Browns
    "#996633",
    "#CC9966",
    "#663300",
    "#997755",
    "#664422",
    // Grays
    "#FFFFFF",
    "#CCCCCC",
    "#999999",
    "#666666",
    "#333333",
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

    const handleApply = () => {
        onSelectColor(tempColor);
        setShowCustomPicker(false);
    };

    const handlePresetSelect = (color: string) => {
        onSelectColor(color);
        setShowCustomPicker(false);
    };

    const openCustomPicker = () => {
        setTempColor(selectedColor);
        setHexInput(selectedColor.replace("#", ""));
        setShowCustomPicker(!showCustomPicker);
    };

    const handleHexInputChange = (text: string) => {
        const cleaned = text.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
        setHexInput(cleaned);

        if (cleaned.length === 6) {
            setTempColor(`#${cleaned}`);
        }
    };

    const handlePaletteColorSelect = (color: string) => {
        setTempColor(color);
        setHexInput(color.replace("#", ""));
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
                            {
                                backgroundColor: color,
                                borderColor: isDark ? "#2C2C2C" : "transparent",
                            },
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
                    onPress={openCustomPicker}
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
                            { color: isDark ? "#ABABAB" : "#666" },
                        ]}
                    >
                        Custom Color
                    </Text>

                    <View style={styles.previewContainer}>
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
                                    { color: isDark ? "#ABABAB" : "#666" },
                                ]}
                            >
                                #
                            </Text>
                            <TextInput
                                style={[
                                    styles.hexInput,
                                    {
                                        backgroundColor: isDark
                                            ? "#2A2A2A"
                                            : "#FFF",
                                        color: isDark ? "#FFF" : "#000",
                                        borderColor: isDark
                                            ? "#2C2C2C"
                                            : "#DDD",
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

                    <Text
                        style={[
                            styles.paletteLabel,
                            { color: isDark ? "#ABABAB" : "#666" },
                        ]}
                    >
                        Color Palette
                    </Text>
                    <View style={styles.extendedPalette}>
                        {EXTENDED_PALETTE.map((color, index) => (
                            <TouchableOpacity
                                key={`${color}-${index}`}
                                style={[
                                    styles.paletteColor,
                                    { backgroundColor: color },
                                    tempColor.toUpperCase() ===
                                        color.toUpperCase() &&
                                        styles.selectedPaletteColor,
                                ]}
                                onPress={() => handlePaletteColorSelect(color)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.applyButton,
                            { backgroundColor: tempColor },
                        ]}
                        onPress={handleApply}
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
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        transform: [{ scale: 1.05 }],
    },
    customColorButton: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dashed",
    },
    customPickerContainer: {
        padding: 20,
        borderRadius: 16,
        marginTop: 16,
        borderWidth: 1,
    },
    previewContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    colorPreview: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    paletteLabel: {
        fontSize: 14,
        fontWeight: "900",
        marginBottom: 12,
        textTransform: "uppercase",
    },
    extendedPalette: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },
    paletteColor: {
        width: 40,
        height: 40,
        borderRadius: 0,
        borderWidth: 3,
        borderColor: "#000",
    },
    selectedPaletteColor: {
        borderWidth: 4,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        transform: [{ scale: 1.1 }],
    },
    applyButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 0,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0,
    },
});
