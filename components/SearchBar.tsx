import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    isDark: boolean;
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = "Search counters...",
    isDark,
}: SearchBarProps) {
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const bgColor = isDark ? "#1E1E1E" : "#F2F2F7";
    const placeholderColor = isDark ? "#8E8E93" : "#8E8E93";
    const iconColor = isDark ? "#8E8E93" : "#8E8E93";

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Ionicons name="search" size={18} color={iconColor} style={styles.icon} />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {value.length > 0 && (
                <Ionicons
                    name="close-circle"
                    size={18}
                    color={iconColor}
                    style={styles.clearIcon}
                    onPress={() => onChangeText("")}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    clearIcon: {
        marginLeft: 8,
    },
});
