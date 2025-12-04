import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { CounterItem } from "../hooks/useCounters";

// Simplified file paths that work across platforms
const getDocumentPath = (filename: string) => {
    if (Platform.OS === "web") {
        return filename;
    }
    // Use a simple path that works with expo-file-system
    return `${FileSystem.documentDirectory || ""}${filename}`;
};

/**
 * Export counters to JSON file
 */
export async function exportCounters(counters: CounterItem[]): Promise<void> {
    try {
        const jsonData = JSON.stringify(counters, null, 2);
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `tallies-backup-${timestamp}.json`;

        if (Platform.OS === "web") {
            // Web: Download file
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            // Mobile: Save and share
            const fileUri = getDocumentPath(fileName);
            await FileSystem.writeAsStringAsync(fileUri, jsonData);

            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: "application/json",
                    dialogTitle: "Export Tallies Backup",
                });
            } else {
                Alert.alert(
                    "Export Successful",
                    `File saved to: ${fileUri}`,
                    [{ text: "OK" }]
                );
            }
        }
    } catch (error) {
        console.error("Export error:", error);
        Alert.alert(
            "Export Failed",
            "Failed to export counters. Please try again.",
            [{ text: "OK" }]
        );
    }
}

/**
 * Import counters from JSON file
 */
export async function importCountersFromFile(): Promise<CounterItem[] | null> {
    try {
        let jsonString: string;

        if (Platform.OS === "web") {
            // Web: Use file input
            return new Promise((resolve) => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json,application/json";
                input.onchange = async (e: any) => {
                    const file = e.target?.files?.[0];
                    if (file) {
                        const text = await file.text();
                        const counters = await parseCountersJSON(text);
                        resolve(counters);
                    } else {
                        resolve(null);
                    }
                };
                input.click();
            });
        } else {
            // Mobile: Use document picker
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return null;
            }

            const fileUri = result.assets[0].uri;
            jsonString = await FileSystem.readAsStringAsync(fileUri);
            return await parseCountersJSON(jsonString);
        }
    } catch (error) {
        console.error("Import error:", error);
        Alert.alert(
            "Import Failed",
            "Failed to import counters. Please try again.",
            [{ text: "OK" }]
        );
        return null;
    }
}

/**
 * Parse and validate JSON counter data
 */
async function parseCountersJSON(jsonString: string): Promise<CounterItem[] | null> {
    try {
        const data = JSON.parse(jsonString);

        // Validate data structure
        if (!Array.isArray(data)) {
            throw new Error("Invalid data format: expected an array");
        }

        // Validate each counter item
        const validatedCounters: CounterItem[] = data.map((item, index) => {
            if (!item.id || typeof item.name !== "string") {
                throw new Error(`Invalid counter at index ${index}`);
            }

            return {
                id: item.id,
                name: item.name,
                count: typeof item.count === "number" ? item.count : 0,
                target: item.target,
                color: item.color || "#007AFF",
                history: Array.isArray(item.history) ? item.history : [],
            };
        });

        return validatedCounters;
    } catch (error) {
        console.error("Parse error:", error);
        Alert.alert(
            "Import Failed",
            "The file format is invalid or corrupted. Please select a valid Tallies backup file.",
            [{ text: "OK" }]
        );
        return null;
    }
}

/**
 * Share counter data as text
 */
export async function shareCounterSummary(counters: CounterItem[]): Promise<void> {
    try {
        const summary = counters
            .map((counter) => {
                const progress = counter.target
                    ? ` (${counter.count}/${counter.target})`
                    : `: ${counter.count}`;
                return `${counter.name}${progress}`;
            })
            .join("\n");

        const message = `My Tallies:\n\n${summary}\n\nTracked with Tallies app`;

        if (Platform.OS === "web") {
            // Web: Copy to clipboard
            await navigator.clipboard.writeText(message);
            Alert.alert("Copied!", "Counter summary copied to clipboard", [
                { text: "OK" },
            ]);
        } else {
            // Mobile: Share
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                const fileUri = getDocumentPath("tallies-summary.txt");
                await FileSystem.writeAsStringAsync(fileUri, message);
                await Sharing.shareAsync(fileUri, {
                    mimeType: "text/plain",
                    dialogTitle: "Share Tallies Summary",
                });
            }
        }
    } catch (error) {
        console.error("Share error:", error);
        Alert.alert("Share Failed", "Failed to share counter summary.", [
            { text: "OK" },
        ]);
    }
}
