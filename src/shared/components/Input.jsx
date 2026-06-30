import { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

const Input = ({ label, error, style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused, 
                    error && styles.inputError,
                    style
                ]}
                placeholderTextColor={COLORS.textLight}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        width: "100%",
    },
    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.secondary,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1.5, // Ligeramente más grueso para mayor presencia
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },
    inputFocused: {
        borderColor: COLORS.primary, // Color café de Papas Luigi
        borderWidth: 2,
    },
    inputError: {
        borderColor: COLORS.error,
        borderWidth: 2,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONT_SIZE.xs,
        marginTop: SPACING.xs,
        fontWeight: "500",
    },
});

export default Input;