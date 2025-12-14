import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { CounterItem } from "../hooks/useCounters";

export const DataManager = {
    exportData: async (counters: CounterItem[]) => {
        try {
            console.log("Initiating export...");
            const data = JSON.stringify(counters, null, 2);
            const fileName = `tallies_backup_${new Date().toISOString().split("T")[0]}.json`;
            const directory = FileSystem.cacheDirectory;

            if (!directory) {
                console.error("FileSystem.cacheDirectory is null");
                Alert.alert("Export Error", "Could not access cache directory.");
                return;
            }

            const filePath = `${directory}${fileName}`;
            console.log(`Writing to file: ${filePath}`);

            await FileSystem.writeAsStringAsync(filePath, data, {
                encoding: "utf8"
            });
            console.log("File written successfully.");

            if (await Sharing.isAvailableAsync()) {
                console.log("Sharing is available, attempting to share...");
                await Sharing.shareAsync(filePath, {
                    mimeType: "application/json",
                    dialogTitle: "Export Tallies Data",
                    UTI: "public.json"
                });
            } else {
                console.warn("Sharing is NOT available");
                Alert.alert("Error", "Sharing is not available on this device");
            }
        } catch (error) {
            console.error("Export failed with error:", error);
            Alert.alert("Export Error", `Failed to export data: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    importData: async (onDataRead: (data: CounterItem[]) => void) => {
        try {
            console.log("Initiating import...");
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
            });

            console.warn("DocumentPicker result:", JSON.stringify(result, null, 2));

            if (result.canceled) {
                console.warn("Import canceled by user");
                return;
            }

            if (!result.assets || result.assets.length === 0) {
                console.warn("No assets found in import result");
                Alert.alert("Import Error", "No file selected.");
                return;
            }

            const file = result.assets[0];
            console.warn(`Reading file from URI: ${file.uri}`);

            // Small delay to allow picker UI to settle
            await new Promise(resolve => setTimeout(resolve, 500));

            let fileContent;
            try {
                fileContent = await FileSystem.readAsStringAsync(file.uri);
                console.warn(`File content read, length: ${fileContent.length}`);
            } catch (readError) {
                console.error("Failed to read file:", readError);
                Alert.alert("Import Error", "Failed to read the selected file.");
                return;
            }

            let parsedData;
            try {
                parsedData = JSON.parse(fileContent);
                console.warn("File parsed successfully. Is Array:", Array.isArray(parsedData));
            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
                Alert.alert("Import Error", "The file is not a valid JSON file.");
                return;
            }

            if (Array.isArray(parsedData) && parsedData.every((item: any) => item.id && item.name)) {
                console.log(`Valid data found via import. Count: ${parsedData.length}`);
                // Instead of asking here, we pass the data back to the UI
                onDataRead(parsedData);
            } else {
                console.warn("Invalid data structure in imported file");
                Alert.alert("Invalid File", "The selected file does not contain valid counter data.");
            }

        } catch (error) {
            console.error("Import failed with critical error:", error);
            Alert.alert("Import Error", `Failed to import data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
