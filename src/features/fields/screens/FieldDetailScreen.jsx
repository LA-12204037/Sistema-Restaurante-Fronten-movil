import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import Button from "../../../shared/components/Button.jsx";
import { Card } from "../../../shared/components/Common.jsx";

const FieldDetailScreen = ({ route, navigation }) => {
    const { field } = route.params;

    const handleReservation = () => {
        Alert.alert("Reservar", `Procediendo con la reserva de ${field.name}`);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {field.image ? (
                <Image source={{ uri: field.image }} style={styles.headerImage} />
            ) : (
                <View style={[styles.headerImage, styles.placeholder]}>
                    <Text style={styles.placeholderText}>Imagen no disponible</Text>
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{field.name}</Text>
                    <Text style={styles.price}>Q{field.pricePerHour || 0}</Text>
                </View>

                <Card style={styles.descriptionCard}>
                    <Text style={styles.sectionTitle}>Detalles</Text>
                    <Text style={styles.description}>{field.location}</Text>
                </Card>

                <Card style={styles.descriptionCard}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>
                        {field.description || "Disfruta de nuestras instalaciones de primera clase para practicar tu deporte favorito."}
                    </Text>
                </Card>

                <View style={styles.footer}>
                    <Button
                        title={field.isAvailable ? "Reservar Ahora" : "No Disponible"}
                        onPress={handleReservation}
                        disabled={!field.isAvailable}
                        style={!field.isAvailable && { backgroundColor: COLORS.secondary }}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { paddingBottom: SPACING.xxl },
    headerImage: { width: "100%", height: 250 },
    placeholder: { backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" },
    placeholderText: { color: COLORS.secondary, fontWeight: "700" },
    content: { padding: SPACING.lg },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md },
    name: { fontSize: FONT_SIZE.xxl, fontWeight: "800", color: COLORS.text, flex: 1 },
    price: { fontSize: FONT_SIZE.lg, fontWeight: "700", color: COLORS.primary },
    sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: "700", color: COLORS.primary, marginBottom: SPACING.sm },
    descriptionCard: { marginBottom: SPACING.md },
    description: { fontSize: FONT_SIZE.md, color: COLORS.secondary, lineHeight: 22 },
    footer: { marginTop: SPACING.xl }
});

export default FieldDetailScreen;