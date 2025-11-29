import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor:
                    colorScheme === "dark" ? "#0A84FF" : "#007AFF",
                tabBarInactiveTintColor:
                    colorScheme === "dark" ? "#8E8E93" : "#8E8E93",
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor:
                        colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor:
                        colorScheme === "dark" ? "#2C2C2C" : "#E5E5EA",
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Tallies",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="list" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    href: null,
                    title: "Statistics",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="bar-chart" size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
