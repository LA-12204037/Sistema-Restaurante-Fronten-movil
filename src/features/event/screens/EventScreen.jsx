import React, { useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useEventStore } from "../../../shared/store/eventStore";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme";
import { LoadingSpinner, EmptyState, Card } from "../../../shared/components/Common";

const EventCard = ({ event }) => {
    const startDate = event.fechaInicio ? new Date(event.fechaInicio).toLocaleDateString("es-ES") : "N/A";
    
    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>{event.nombreEvento}</Text>
                <View style={[styles.statusBadge, event.isActive ? styles.available : styles.unavailable]}>
                    <Text style={[styles.statusText, { color: event.isActive ? COLORS.success : COLORS.error }]}>
                        {event.isActive ? "Activo" : "Inactivo"}
                    </Text>
                </View>
            </View>
            
            <Text style={styles.description} numberOfLines={3}>{event.descripcion}</Text>
            
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha: </Text>
                <Text style={styles.infoValue}>{startDate}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Horario: </Text>
                <Text style={styles.infoValue}>{event.horaInicio} - {event.horaFin}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado: </Text>
                <Text style={[styles.infoValue, { fontWeight: "bold", color: COLORS.primary }]}>{event.estado}</Text>
            </View>
        </Card>
    );
};

const EventScreen = () => {
    const { events, loading, error, getEvents } = useEventStore();

    useEffect(() => {
        getEvents();
    }, [getEvents]);

    const onRefresh = useCallback(() => getEvents(), [getEvents]);

    if (loading && !events.length) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <EventCard event={item} />}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[COLORS.primary]} />}
                ListEmptyComponent={<EmptyState message={error || "No hay eventos programados"} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    listContent: { padding: SPACING.md },
    card: { marginBottom: SPACING.md, padding: SPACING.md, borderRadius: 16, ...SHADOWS.sm },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: SPACING.sm },
    title: { fontSize: FONT_SIZE.lg, fontWeight: "bold", color: COLORS.text, flex: 1, marginRight: SPACING.sm },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    available: { backgroundColor: `${COLORS.success}20` },
    unavailable: { backgroundColor: `${COLORS.error}20` },
    statusText: { fontSize: FONT_SIZE.xs, fontWeight: "700" },
    description: { fontSize: FONT_SIZE.sm, color: COLORS.secondary, marginBottom: SPACING.md },
    infoRow: { flexDirection: "row", marginBottom: 2 },
    infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.secondary, width: 60 },
    infoValue: { fontSize: FONT_SIZE.sm, color: COLORS.text, flex: 1 }
});

export default EventScreen;
