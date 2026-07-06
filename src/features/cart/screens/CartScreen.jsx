import React, { useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useCartStore } from "../../../shared/store/cartStore";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme";
import { LoadingSpinner, EmptyState, Card } from "../../../shared/components/Common";

const CartCard = ({ cart }) => (
    <Card style={styles.card}>
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>Carrito #{String(cart._id).slice(-6)}</Text>
                <Text style={styles.subtitle}>{(cart.items || []).length} artículos</Text>
            </View>
            <View style={[styles.statusBadge, cart.status === 'activo' ? styles.statusActive : styles.statusDefault]}>
                <Text style={styles.statusText}>{cart.status}</Text>
            </View>
        </View>

        <View style={styles.itemsList}>
            {(cart.items || []).map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                        {item.quantity}x {item.saucerName || item.nombre || item.name || "Platillo"}
                    </Text>
                    <Text style={styles.itemPrice}>
                        ${((item.price || item.precio || 0) * item.quantity).toFixed(2)}
                    </Text>
                </View>
            ))}
        </View>

        <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${cart.total?.toFixed(2) || "0.00"}</Text>
        </View>
    </Card>
);

const CartScreen = () => {
    const { carts, loading, error, getCarts } = useCartStore();

    useEffect(() => {
        getCarts();
    }, [getCarts]);

    const onRefresh = useCallback(() => getCarts(), [getCarts]);

    if (loading && !carts.length) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <FlatList
                data={carts}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <CartCard cart={item} />}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[COLORS.primary]} />}
                ListEmptyComponent={<EmptyState message={error || "No hay carritos registrados"} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    listContent: { padding: SPACING.md },
    card: { marginBottom: SPACING.md, padding: SPACING.md, borderRadius: 16, ...SHADOWS.sm },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: SPACING.md },
    title: { fontSize: FONT_SIZE.md, fontWeight: "bold", color: COLORS.text },
    subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.secondary, marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusActive: { backgroundColor: `${COLORS.success}20` },
    statusDefault: { backgroundColor: `${COLORS.secondary}20` },
    statusText: { fontSize: FONT_SIZE.xs, fontWeight: "700" },
    itemsList: { marginBottom: SPACING.md, backgroundColor: COLORS.surface, padding: SPACING.sm, borderRadius: 8 },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.xs },
    itemName: { fontSize: FONT_SIZE.sm, color: COLORS.text, flex: 1, marginRight: SPACING.sm },
    itemPrice: { fontSize: FONT_SIZE.sm, fontWeight: "600", color: COLORS.text },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
    totalLabel: { fontSize: FONT_SIZE.md, fontWeight: "bold", color: COLORS.text },
    totalPrice: { fontSize: FONT_SIZE.lg, fontWeight: "bold", color: COLORS.primary }
});

export default CartScreen;
