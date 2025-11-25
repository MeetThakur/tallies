import { Image } from "expo-image";
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    Appearance,
    useColorScheme,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function TabTwoScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const toggleColorScheme = () => {
        const newScheme = isDark ? "light" : "dark";
        Appearance.setColorScheme(newScheme);
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#FFD700", dark: "#353636" }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#000"
                    name="chevron.left.forwardslash.chevron.right"
                    style={styles.headerImage}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText
                    type="title"
                    style={{
                        fontWeight: "900",
                        fontSize: 32,
                        textTransform: "uppercase",
                    }}
                >
                    Explore
                </ThemedText>
                <TouchableOpacity
                    style={[
                        styles.themeButton,
                        {
                            backgroundColor: isDark ? "#FFD700" : "#FF69B4",
                        },
                    ]}
                    onPress={toggleColorScheme}
                >
                    <Ionicons
                        name={isDark ? "sunny" : "moon"}
                        size={20}
                        color="#000"
                    />
                </TouchableOpacity>
            </ThemedView>
            <ThemedText style={styles.bodyText}>
                Tallies is a bold counter app with neobrutal design, custom
                color pickers, and theme switching!
            </ThemedText>
            <Collapsible title="Theme Switcher">
                <ThemedText style={styles.bodyText}>
                    Toggle between light and dark mode using the{" "}
                    <ThemedText type="defaultSemiBold">
                        {isDark ? "☀️ sun" : "🌙 moon"}
                    </ThemedText>{" "}
                    button in the header. The app uses a neobrutal design style
                    with thick borders, bold shadows, and high contrast!
                </ThemedText>
            </Collapsible>
            <Collapsible title="File-based routing">
                <ThemedText style={styles.bodyText}>
                    This app has two screens:{" "}
                    <ThemedText type="defaultSemiBold">
                        app/(tabs)/index.tsx
                    </ThemedText>{" "}
                    and{" "}
                    <ThemedText type="defaultSemiBold">
                        app/(tabs)/explore.tsx
                    </ThemedText>
                </ThemedText>
                <ThemedText style={styles.bodyText}>
                    The layout file in{" "}
                    <ThemedText type="defaultSemiBold">
                        app/(tabs)/_layout.tsx
                    </ThemedText>{" "}
                    sets up the tab navigator.
                </ThemedText>
                <ExternalLink href="https://docs.expo.dev/router/introduction">
                    <ThemedText type="link" style={styles.linkText}>
                        Learn more
                    </ThemedText>
                </ExternalLink>
            </Collapsible>
            <Collapsible title="Android, iOS, and web support">
                <ThemedText style={styles.bodyText}>
                    You can open this project on Android, iOS, and the web. To
                    open the web version, press{" "}
                    <ThemedText type="defaultSemiBold">w</ThemedText> in the
                    terminal running this project.
                </ThemedText>
            </Collapsible>
            <Collapsible title="Images">
                <ThemedText style={styles.bodyText}>
                    For static images, you can use the{" "}
                    <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
                    <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes
                    to provide files for different screen densities
                </ThemedText>
                <Image
                    source={require("@/assets/images/react-logo.png")}
                    style={{
                        width: 100,
                        height: 100,
                        alignSelf: "center",
                        borderWidth: 4,
                        borderColor: "#000",
                    }}
                />
                <ExternalLink href="https://reactnative.dev/docs/images">
                    <ThemedText type="link" style={styles.linkText}>
                        Learn more
                    </ThemedText>
                </ExternalLink>
            </Collapsible>
            <Collapsible title="Neobrutal Design">
                <ThemedText style={styles.bodyText}>
                    This app features a neobrutal design aesthetic with:
                </ThemedText>
                <ThemedText style={styles.bodyText}>
                    • Thick 4-5px black borders{"\n"}• Hard drop shadows (no
                    blur){"\n"}• Bold 900-weight typography{"\n"}• Square
                    corners everywhere{"\n"}• High contrast colors{"\n"}•
                    Uppercase text for emphasis
                </ThemedText>
                <ThemedText style={styles.bodyText}>
                    The design is bold, playful, and highly accessible!
                </ThemedText>
            </Collapsible>
            <Collapsible title="Animations">
                <ThemedText style={styles.bodyText}>
                    This template includes an example of an animated component.
                    The{" "}
                    <ThemedText type="defaultSemiBold">
                        components/HelloWave.tsx
                    </ThemedText>{" "}
                    component uses the powerful{" "}
                    <ThemedText
                        type="defaultSemiBold"
                        style={{ fontFamily: Fonts.mono }}
                    >
                        react-native-reanimated
                    </ThemedText>{" "}
                    library to create a waving hand animation.
                </ThemedText>
                {Platform.select({
                    ios: (
                        <ThemedText style={styles.bodyText}>
                            The{" "}
                            <ThemedText type="defaultSemiBold">
                                components/ParallaxScrollView.tsx
                            </ThemedText>{" "}
                            component provides a parallax effect for the header
                            image.
                        </ThemedText>
                    ),
                })}
            </Collapsible>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#000",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 16,
        alignItems: "center",
        justifyContent: "space-between",
    },
    themeButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 0,
        borderWidth: 3,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    bodyText: {
        fontWeight: "600",
        fontSize: 15,
        lineHeight: 24,
    },
    linkText: {
        fontWeight: "900",
        fontSize: 16,
        textTransform: "uppercase",
    },
});
