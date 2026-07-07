import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import Button from "../../../shared/components/Button";

import { useCartStore } from "../../../shared/store/cartStore";

const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `https://res.cloudinary.com/dog2q2ise/image/upload/${photo}`;
};

const MenuDetailScreen = ({ route, navigation }) => {
    const { menuItem } = route.params;
    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        addToCart(menuItem, 1);
        alert("¡Platillo añadido a tu carrito! Puedes seguir agregando más.");
    };

    return (
        <ScrollView style={styles.container}>
            {getPhotoUrl(menuItem.photo) ? (
                <Image source={{ uri: getPhotoUrl(menuItem.photo) }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>🍽️ Sin imagen</Text>
                </View>
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{menuItem.saucerName}</Text>
                <Text style={styles.category}>{menuItem.categoryType}</Text>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${Number(menuItem.price || 0).toFixed(2)}</Text>
                    <View style={[styles.statusBadge, menuItem.isActive ? styles.available : styles.unavailable]}>
                        <Text style={[styles.statusText, { color: menuItem.isActive ? COLORS.success : COLORS.error }]}>
                            {menuItem.isActive ? "Disponible" : "Agotado"}
                        </Text>
                    </View>
                </View>
                
                <Text style={styles.descriptionTitle}>Descripción</Text>
                <Text style={styles.description}>
                    {menuItem.description || "Este platillo no tiene una descripción detallada."}
                </Text>
            </View>
            <View style={styles.footer}>
                <Button title="Añadir al Carrito" onPress={handleAddToCart} style={styles.button} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    image: { width: "100%", height: 250 },
    placeholderImage: { backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" },
    placeholderText: { color: COLORS.secondary, fontWeight: "600", fontSize: 24 },
    content: { padding: SPACING.lg },
    title: { fontSize: FONT_SIZE.xl, fontWeight: "bold", color: COLORS.text, marginBottom: SPACING.xs },
    category: { fontSize: FONT_SIZE.md, color: COLORS.secondary, marginBottom: SPACING.md },
    priceContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.xl },
    price: { fontSize: FONT_SIZE.xl, fontWeight: "bold", color: COLORS.primary },
    descriptionTitle: { fontSize: FONT_SIZE.md, fontWeight: "bold", color: COLORS.text, marginBottom: SPACING.sm },
    description: { fontSize: FONT_SIZE.md, color: COLORS.secondary, lineHeight: 24 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    available: { backgroundColor: `${COLORS.success}20` },
    unavailable: { backgroundColor: `${COLORS.error}20` },
    statusText: { fontSize: FONT_SIZE.sm, fontWeight: "bold" },
    footer: { padding: SPACING.lg, paddingBottom: SPACING.xl },
    button: { backgroundColor: COLORS.primary }
});

export default MenuDetailScreen;
