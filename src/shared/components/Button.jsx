import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

const Button = ({
    title,
    onPress,
    loading,
    variant = "primary", // 'primary' | 'secondary'
    style,
    ...props
}) => {
    const handlePress = () => {
        // Feedback táctil suave para Android
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress();
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[`button_${variant}`],
                loading ? styles.buttonDisabled : null,
                style,
            ]}
            onPress={handlePress}
            disabled={loading}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={title}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === "secondary" ? COLORS.primary : COLORS.surface}
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        styles[`text_${variant}`],
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 48,
    },
    // Variantes dinámicas
    button_primary: {
        backgroundColor: COLORS.primary,
    },
    button_secondary: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    // Estilos de texto
    text: {
        fontSize: FONT_SIZE.md,
        fontWeight: "600",
    },
    text_primary: {
        color: COLORS.surface,
    },
    text_secondary: {
        color: COLORS.primary,
    },
});

export default Button;