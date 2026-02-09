import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PRESET_COLORS } from "../constants/colors";
import { CounterItem } from "../hooks/useCounters";
import {
    sanitizeCounterName,
    validateCounterName,
    validateTarget,
} from "../utils/validation";
import { ColorPickerWrapper } from "./ColorPickerWrapper";

interface EditCounterModalProps {
  visible: boolean;
  counter: CounterItem | null;
  onClose: () => void;
  onSave: (
    id: string,
    name: string,
    target: string,
    color: string,
    count: string,
  ) => void;
  isDark: boolean;
}

export function EditCounterModal({
  visible,
  counter,
  onClose,
  onSave,
  isDark,
}: EditCounterModalProps) {
  const [name, setName] = useState(counter?.name || "");
  const [target, setTarget] = useState(counter?.target?.toString() || "");
  const [currentCount, setCurrentCount] = useState(
    counter?.count?.toString() || "0",
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    counter?.color || PRESET_COLORS[0],
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);
  const [countError, setCountError] = useState<string | null>(null);

  // Update state when counter changes
  useEffect(() => {
    if (counter) {
      setName(counter.name);
      setTarget(counter.target?.toString() || "");
      setCurrentCount(counter.count?.toString() || "0");
      setSelectedColor(counter.color || PRESET_COLORS[0]);
      setNameError(null);
      setTargetError(null);
      setCountError(null);
    }
  }, [counter]);

  const handleSave = () => {
    if (!counter) return;

    // Validate inputs
    const sanitizedName = sanitizeCounterName(name);
    const nameValidation = validateCounterName(sanitizedName);
    const targetValidation = target ? validateTarget(target) : null;

    // Validate count
    const countNum = parseInt(currentCount, 10);
    if (isNaN(countNum)) {
      setCountError("Count must be a valid number");
      return;
    }

    if (nameValidation) {
      setNameError(nameValidation);
      return;
    }

    if (targetValidation) {
      setTargetError(targetValidation);
      return;
    }

    onSave(counter.id, sanitizedName, target, selectedColor, currentCount);
    handleClose();
  };

  const handleResetCount = () => {
    setCurrentCount("0");
  };

  const handleClose = () => {
    setNameError(null);
    setTargetError(null);
    setCountError(null);
    onClose();
  };

  const textColor = isDark ? "#FFFFFF" : "#000000";
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const subtleTextColor = isDark ? "#8E8E93" : "#8E8E93";
  const inputBg = isDark ? "#2C2C2E" : "#F2F2F7";
  const separatorColor = isDark ? "#38383A" : "#E5E5EA";
  const placeholderColor = isDark ? "#636366" : "#C7C7CC";

  if (!counter) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
          <View style={styles.dragIndicator} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.cancelText, { color: subtleTextColor }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              Edit Counter
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.saveText, { color: selectedColor }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              {/* Name Section */}
              <View
                style={[
                  styles.inputGroup,
                  { borderBottomColor: separatorColor },
                ]}
              >
                <Text style={[styles.label, { color: textColor }]}>Name</Text>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setNameError(null);
                  }}
                  placeholder="Counter Name"
                  placeholderTextColor={placeholderColor}
                />
              </View>
              {nameError && <Text style={styles.errorText}>{nameError}</Text>}

              {/* Count Section */}
              <View
                style={[
                  styles.inputGroup,
                  { borderBottomColor: separatorColor },
                ]}
              >
                <Text style={[styles.label, { color: textColor }]}>Count</Text>
                <View style={styles.rowInputContainer}>
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={currentCount}
                    onChangeText={(text) => {
                      setCurrentCount(text);
                      setCountError(null);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={placeholderColor}
                  />
                  <TouchableOpacity
                    onPress={handleResetCount}
                    style={styles.inlineResetButton}
                  >
                    <Ionicons
                      name="refresh-circle"
                      size={20}
                      color={subtleTextColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {countError && <Text style={styles.errorText}>{countError}</Text>}

              {/* Target Section */}
              <View
                style={[
                  styles.inputGroup,
                  { borderBottomColor: separatorColor },
                ]}
              >
                <Text style={[styles.label, { color: textColor }]}>Target</Text>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  value={target}
                  onChangeText={(text) => {
                    setTarget(text);
                    setTargetError(null);
                  }}
                  keyboardType="numeric"
                  placeholder="Optional"
                  placeholderTextColor={placeholderColor}
                />
              </View>
              {targetError && (
                <Text style={styles.errorText}>{targetError}</Text>
              )}

              {/* Color Picker Section */}
              <View style={styles.colorSection}>
                <Text
                  style={[styles.label, { color: textColor, marginBottom: 12 }]}
                >
                  Color
                </Text>
                <ColorPickerWrapper
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  dragIndicator: {
    width: 36,
    height: 5,
    backgroundColor: "#D1D1D6",
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  cancelText: {
    fontSize: 17,
    fontWeight: "400",
  },
  saveText: {
    fontSize: 17,
    fontWeight: "600",
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: 17,
    fontWeight: "400",
    width: 80,
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: "400",
    textAlign: "right",
  },
  rowInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  inlineResetButton: {
    marginLeft: 8,
    padding: 4,
  },
  colorSection: {
    marginTop: 24,
    paddingVertical: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
});
