import React, { useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { useReservationStore } from "../../../shared/store/reservationStore";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme";
import { LoadingSpinner, EmptyState, Card } from "../../../shared/components/Common";

const ReservationCard = ({ reservation }) => {
    const date = reservation.fecha ? new Date(reservation.fecha).toLocaleDateString("es-ES") : "N/A";
    
    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>{reservation.descripcion}</Text>
                <View style={[styles.statusBadge, reservation.estado === 'Activa' ? styles.statusActive : styles.statusDefault]}>
                    <Text style={styles.statusText}>{reservation.estado}</Text>
                </View>
            </View>
            
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha: </Text>
                <Text style={styles.infoValue}>{date} a las {reservation.hora}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mesa: </Text>
                <Text style={styles.infoValue}>{reservation.mesa}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Personas: </Text>
                <Text style={styles.infoValue}>{reservation.cantidadPersonas}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Evento: </Text>
                <Text style={styles.infoValue}>{reservation.eventoId?.nombreEvento || "Ninguno"}</Text>
            </View>
        </Card>
    );
};

const ReservationScreen = ({ navigation }) => {
    const { reservations, loading, error, getReservations } = useReservationStore();

    useEffect(() => {
        getReservations();
    }, [getReservations]);

    const onRefresh = useCallback(() => getReservations(), [getReservations]);

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <ReservationCard reservation={item} />}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[COLORS.primary]} />}
                ListEmptyComponent={!loading && <EmptyState message={error || "No tienes reservaciones aún"} />}
            />
            
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => navigation.navigate("CreateReservation")}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>+ Nueva Reserva</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    listContent: { padding: SPACING.md, paddingBottom: 100 },
    card: { marginBottom: SPACING.md, padding: SPACING.md, borderRadius: 16, ...SHADOWS.sm },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.sm },
    title: { fontSize: FONT_SIZE.lg, fontWeight: "bold", color: COLORS.text, flex: 1, marginRight: SPACING.sm },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusActive: { backgroundColor: `${COLORS.success}20` },
    statusDefault: { backgroundColor: `${COLORS.secondary}20` },
    statusText: { fontSize: FONT_SIZE.xs, fontWeight: "700" },
    infoRow: { flexDirection: "row", marginBottom: 4 },
    infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.secondary, width: 80 },
    infoValue: { fontSize: FONT_SIZE.sm, color: COLORS.text, flex: 1, fontWeight: "500" },
    fab: {
        position: "absolute",
        bottom: SPACING.xl,
        right: SPACING.lg,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        ...SHADOWS.md,
        elevation: 5
    },
    fabText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: FONT_SIZE.md
    }
});

export default ReservationScreen;
