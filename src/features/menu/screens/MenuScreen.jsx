import React, { useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from "react-native";
import { useMenuStore } from "../../../shared/store/menuStore";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme";
import { LoadingSpinner, EmptyState, Card } from "../../../shared/components/Common";

// Helper for Cloudinary URL similar to web component
const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `https://res.cloudinary.com/dog2q2ise/image/upload/${photo}`;
};

const MenuItemCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
        <Card style={styles.card}>
            {getPhotoUrl(item.photo) ? (
                <Image source={{ uri: getPhotoUrl(item.photo) }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>🍽️ Sin imagen</Text>
                </View>
            )}
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{item.saucerName}</Text>
                <Text style={styles.info}>{item.categoryType}</Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>${Number(item.price || 0).toFixed(2)}</Text>
                    <View style={[styles.statusBadge, item.isActive ? styles.available : styles.unavailable]}>
                        <Text style={[styles.statusText, { color: item.isActive ? COLORS.success : COLORS.error }]}>
                            {item.isActive ? "Disponible" : "Agotado"}
                        </Text>
                    </View>
                </View>
            </View>
        </Card>
    </TouchableOpacity>
);

const MenuScreen = ({ navigation }) => {
    const { menuItems, loading, error, getMenuItems } = useMenuStore();

    useEffect(() => {
        getMenuItems();
    }, [getMenuItems]);

    const onRefresh = useCallback(() => getMenuItems(), [getMenuItems]);

    if (loading && !menuItems.length) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <MenuItemCard item={item} onPress={() => navigation.navigate("MenuDetail", { menuItem: item })} />
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[COLORS.primary]} />}
                ListEmptyComponent={<EmptyState message={error || "No hay platillos disponibles"} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    listContent: { padding: SPACING.md },
    cardContainer: { marginBottom: SPACING.lg },
    card: { padding: 0, overflow: "hidden", borderRadius: 16, ...SHADOWS.md },
    image: { width: "100%", height: 160 },
    placeholderImage: { backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" },
    placeholderText: { color: COLORS.secondary, fontWeight: "600", fontSize: 24 },
    details: { padding: SPACING.md },
    name: { fontSize: FONT_SIZE.lg, fontWeight: "800", color: COLORS.text },
    info: { fontSize: FONT_SIZE.sm, color: COLORS.secondary, marginTop: 4 },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: SPACING.md },
    price: { fontSize: FONT_SIZE.md, fontWeight: "700", color: COLORS.primary },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    available: { backgroundColor: `${COLORS.success}20` },
    unavailable: { backgroundColor: `${COLORS.error}20` },
    statusText: { fontSize: FONT_SIZE.xs, fontWeight: "700" },
});

export default MenuScreen;
