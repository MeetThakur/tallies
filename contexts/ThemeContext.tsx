import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, Animated } from "react-native";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
    colorScheme: ColorScheme;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (theme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
    const [isLoading, setIsLoading] = useState(true);
    const [fadeAnim] = useState(new Animated.Value(1));

    const loadTheme = useCallback(async () => {
        try {
            const savedTheme = await AsyncStorage.getItem("@theme");
            if (savedTheme) {
                setColorScheme(savedTheme as ColorScheme);
            } else {
                const systemTheme = Appearance.getColorScheme();
                setColorScheme(systemTheme || "light");
            }
        } catch (e) {
            console.error("Error loading theme:", e);
            setColorScheme("light");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveTheme = useCallback(async (theme: ColorScheme) => {
        try {
            await AsyncStorage.setItem("@theme", theme);
        } catch (e) {
            console.error("Error saving theme:", e);
        }
    }, []);

    const setTheme = useCallback(
        (theme: ColorScheme) => {
            // Fade out, change theme, fade in for smooth transition
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();

            // Change theme slightly after animation starts for seamless feel
            setTimeout(() => {
                setColorScheme(theme);
                saveTheme(theme);
            }, 75);
        },
        [saveTheme, fadeAnim],
    );

    const toggleTheme = useCallback(() => {
        const newTheme = colorScheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    }, [colorScheme, setTheme]);

    useEffect(() => {
        loadTheme();
    }, [loadTheme]);

    // Listen to system appearance changes
    useEffect(() => {
        const subscription = Appearance.addChangeListener(async () => {
            const savedTheme = await AsyncStorage.getItem("@theme");
            if (!savedTheme) {
                const systemTheme = Appearance.getColorScheme();
                setColorScheme(systemTheme || "light");
            }
        });
        return () => subscription.remove();
    }, []);

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <ThemeContext.Provider
            value={{
                colorScheme,
                isDark: colorScheme === "dark",
                toggleTheme,
                setTheme,
            }}
        >
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                {children}
            </Animated.View>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
