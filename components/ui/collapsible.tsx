import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function Collapsible({
    children,
    title,
}: PropsWithChildren & { title: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useColorScheme() ?? "light";
    const isDark = theme === "dark";
    const textColor = isDark ? "#FFF" : "#000";
    const iconColor = isDark ? "#FFF" : "#000";

    return (
        <ThemedView
            style={[
                styles.container,
                { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
            ]}
        >
            <TouchableOpacity
                style={styles.heading}
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}
            >
                <IconSymbol
                    name="chevron.right"
                    size={22}
                    weight="medium"
                    color={iconColor}
                    style={{
                        transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
                    }}
                />

                <ThemedText
                    type="defaultSemiBold"
                    style={[styles.titleText, { color: textColor }]}
                >
                    {title}
                </ThemedText>
            </TouchableOpacity>
            {isOpen && (
                <ThemedView style={styles.content}>{children}</ThemedView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderWidth: 3,
        borderColor: "#000",
        borderRadius: 20,
        padding: 18,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    heading: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    titleText: {
        fontSize: 19,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    content: {
        marginTop: 18,
        marginLeft: 38,
    },
});
