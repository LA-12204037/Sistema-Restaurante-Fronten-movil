import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';

export const LoadingSpinner = () => (
    <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
);

export const EmptyState = ({ message = "No hay datos disponibles" }) => (
    <View style={styles.center}>
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

export const Card = ({ children, style, onPress, ...props }) => {
    if (onPress) {
        return (
            <Pressable 
                style={[styles.card, style]} 
                onPress={onPress}
                android_ripple={{ color: COLORS.border }} 
                {...props}
            >
                {children}
            </Pressable>
        );
    }
    
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: 12,
        marginVertical: SPACING.sm,
        ...SHADOWS.md, 
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.secondary,
        textAlign: "center",
    },
});