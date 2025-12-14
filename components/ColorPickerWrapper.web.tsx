import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PRESET_COLORS } from "../constants/colors";
import { getContrastColor } from "../utils/colors";

interface ColorPickerWrapperProps {
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

// Helper functions for color conversion
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const ColorPickerWrapper: React.FC<ColorPickerWrapperProps> = ({
    selectedColor,
    onSelectColor,
}) => {
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [tempColor, setTempColor] = useState(selectedColor);
    const [hsl, setHsl] = useState(hexToHsl(selectedColor));
    const [hexInput, setHexInput] = useState(selectedColor.replace("#", ""));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const satLightRef = useRef<any>(null);
    const hueRef = useRef<any>(null);

    useEffect(() => {
        if (showCustomPicker) {
            const newHsl = hexToHsl(tempColor);
            setHsl(newHsl);
            setHexInput(tempColor.replace("#", ""));
        }
    }, [showCustomPicker, tempColor]);

    const handleHslChange = (newH?: number, newS?: number, newL?: number) => {
        const h = newH ?? hsl.h;
        const s = newS ?? hsl.s;
        const l = newL ?? hsl.l;
        setHsl({ h, s, l });
        const hex = hslToHex(h, s, l);
        setTempColor(hex);
        setHexInput(hex.replace("#", ""));
    };

    const handleHexInputChange = (text: string) => {
        const cleaned = text.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
        setHexInput(cleaned);
        if (cleaned.length === 6) {
            const hex = `#${cleaned}`;
            setTempColor(hex);
            setHsl(hexToHsl(hex));
        }
    };

    const handleSatLightClick = (e: any) => {
        if (!satLightRef.current) return;
        const rect = satLightRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        const s = (x / rect.width) * 100;
        const l = 100 - (y / rect.height) * 100;
        handleHslChange(undefined, s, l);
    };

    const handleHueClick = (e: any) => {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const h = (x / rect.width) * 360;
        handleHslChange(h, undefined, undefined);
    };

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
                        size={22}
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

                    {/* Saturation/Lightness Picker */}
                    <div
                        ref={satLightRef}
                        onClick={handleSatLightClick}
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: 12,
                            marginBottom: 16,
                            cursor: "crosshair",
                            position: "relative",
                            background: `linear-gradient(to bottom, transparent, black),
                                        linear-gradient(to right, white, hsl(${hsl.h}, 100%, 50%))`,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: `${hsl.s}%`,
                                top: `${100 - hsl.l}%`,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                border: "3px solid white",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        />
                    </div>

                    {/* Hue Slider */}
                    <div
                        ref={hueRef}
                        onClick={handleHueClick}
                        style={{
                            width: "100%",
                            height: 32,
                            borderRadius: 16,
                            marginBottom: 20,
                            cursor: "pointer",
                            position: "relative",
                            background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: `${(hsl.h / 360) * 100}%`,
                                top: "50%",
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                border: "4px solid white",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: `hsl(${hsl.h}, 100%, 50%)`,
                                pointerEvents: "none",
                            }}
                        />
                    </div>

                    {/* Color Preview & Hex Input */}
                    <View style={styles.colorInputContainer}>
                        <View
                            style={[
                                styles.colorPreview,
                                { backgroundColor: tempColor },
                            ]}
                        />
                        <View style={{ flex: 1 }}>
                            <View style={styles.hexInputRow}>
                                <Text
                                    style={[
                                        styles.hexLabel,
                                        { color: isDark ? "#AAA" : "#666" },
                                    ]}
                                >
                                    #
                                </Text>
                                <TextInput
                                    style={[
                                        styles.hexInput,
                                        {
                                            backgroundColor: isDark ? "#2A2A2A" : "#FFF",
                                            color: isDark ? "#FFF" : "#000",
                                            borderColor: isDark ? "#444" : "#DDD",
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
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        opacity: 0.6,
    },
    presetContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 16,
    },
    colorOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: "transparent",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    selectedColor: {
        borderWidth: 4,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
        transform: [{ scale: 1.1 }],
    },
    customColorButton: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderStyle: "dashed",
    },
    customPickerContainer: {
        padding: 24,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
    },
    colorInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.03)",
    },
    colorPreview: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    colorText: {
        fontSize: 20,
        fontWeight: "800",
        fontFamily: "monospace",
        letterSpacing: 1.5,
    },
    hexInputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    hexLabel: {
        fontSize: 24,
        fontWeight: "800",
    },
    hexInput: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        fontFamily: "monospace",
        borderWidth: 2,
        fontWeight: "700",
        letterSpacing: 1,
    },
    applyButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    applyButtonText: {
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
});
