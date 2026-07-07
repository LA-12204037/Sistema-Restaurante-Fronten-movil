import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, FlatList, Alert } from "react-native";
import { useReservationStore } from "../../../shared/store/reservationStore";
import { useEventStore } from "../../../shared/store/eventStore";
import { useTableStore } from "../../../shared/store/tableStore";
import { useAuthStore } from "../../../shared/store/authStore";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme";
import Button from "../../../shared/components/Button";

const CustomPicker = ({ label, items, selectedId, onSelect, placeholder, itemLabelKey = "nombre" }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const selectedItem = items.find(item => item._id === selectedId);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
                <Text style={[styles.pickerText, !selectedItem && styles.placeholderText]}>
                    {selectedItem ? selectedItem[itemLabelKey] : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona {label}</Text>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.modalItem}
                                    onPress={() => {
                                        onSelect(item._id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item[itemLabelKey]}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyText}>No hay opciones disponibles</Text>}
                        />
                        <Button title="Cerrar" onPress={() => setModalVisible(false)} style={styles.closeButton} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const CreateReservationScreen = ({ navigation }) => {
    const { createReservation, loading } = useReservationStore();
    const { events, getEvents } = useEventStore();
    const { tables, getTables } = useTableStore();
    const { user } = useAuthStore();

    const [form, setForm] = useState({
        eventoId: "",
        descripcion: "",
        usuario: user?.name || user?.email || "Cliente",
        mesaId: "",
        fecha: new Date().toISOString().split('T')[0],
        hora: "19:00",
        cantidadPersonas: "2"
    });

    useEffect(() => {
        getEvents();
        getTables();
    }, []);

    // Filtrar mesas disponibles
    const availableTables = tables.filter(t => t.estado === 'Disponible');
    const activeEvents = events.filter(e => e.isActive && e.estado !== 'Finalizado' && e.estado !== 'Cancelado');

    const handleSave = async () => {
        if (!form.eventoId || !form.mesaId || !form.descripcion || !form.fecha || !form.hora || !form.cantidadPersonas) {
            Alert.alert("Error", "Por favor completa todos los campos obligatorios");
            return;
        }

        try {
            // El backend requiere el numero de la mesa (mesa), aunque enviaremos mesaId y se puede resolver allá,
            // pero para evitar fallos enviamos el numero.
            const selectedTable = tables.find(t => t._id === form.mesaId);

            const payload = {
                eventoId: form.eventoId,
                descripcion: form.descripcion,
                usuario: form.usuario,
                mesaId: form.mesaId,
                mesa: selectedTable ? selectedTable.numeroMesa : 1,
                fecha: form.fecha,
                hora: form.hora,
                cantidadPersonas: parseInt(form.cantidadPersonas, 10)
            };

            await createReservation(payload);
            Alert.alert("Éxito", "Reservación creada correctamente", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo crear la reservación");
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Crear Reservación</Text>

            <CustomPicker
                label="Evento *"
                items={activeEvents}
                selectedId={form.eventoId}
                onSelect={(val) => setForm({ ...form, eventoId: val })}
                placeholder="Selecciona un evento"
                itemLabelKey="nombreEvento"
            />

            <CustomPicker
                label="Mesa Disponible *"
                items={availableTables.map(t => ({...t, displayLabel: `Mesa ${t.numeroMesa} (Cap: ${t.capacidad})` }))}
                selectedId={form.mesaId}
                onSelect={(val) => setForm({ ...form, mesaId: val })}
                placeholder="Selecciona una mesa"
                itemLabelKey="displayLabel"
            />

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción de la Reserva *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej. Cumpleaños de 15, Cena romántica..."
                    value={form.descripcion}
                    onChangeText={(val) => setForm({ ...form, descripcion: val })}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.sm }]}>
                    <Text style={styles.label}>Fecha (YYYY-MM-DD) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="2026-05-19"
                        value={form.fecha}
                        onChangeText={(val) => setForm({ ...form, fecha: val })}
                    />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING.sm }]}>
                    <Text style={styles.label}>Hora (HH:MM) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="19:00"
                        value={form.hora}
                        onChangeText={(val) => setForm({ ...form, hora: val })}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.sm }]}>
                    <Text style={styles.label}>Personas *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="2"
                        keyboardType="numeric"
                        value={form.cantidadPersonas}
                        onChangeText={(val) => setForm({ ...form, cantidadPersonas: val })}
                    />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING.sm }]}>
                    <Text style={styles.label}>A nombre de</Text>
                    <TextInput
                        style={styles.input}
                        value={form.usuario}
                        onChangeText={(val) => setForm({ ...form, usuario: val })}
                    />
                </View>
            </View>

            <Button 
                title="Guardar Reservación" 
                onPress={handleSave} 
                loading={loading}
                style={styles.saveButton} 
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg, paddingBottom: 100 },
    headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: "bold", color: COLORS.primary, marginBottom: SPACING.xl },
    inputContainer: { marginBottom: SPACING.lg },
    row: { flexDirection: "row", justifyContent: "space-between" },
    label: { fontSize: FONT_SIZE.sm, color: COLORS.text, marginBottom: SPACING.xs, fontWeight: "600" },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.md,
        fontSize: FONT_SIZE.md,
        color: COLORS.text
    },
    pickerButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.md,
    },
    pickerText: { fontSize: FONT_SIZE.md, color: COLORS.text },
    placeholderText: { color: COLORS.secondary },
    saveButton: { marginTop: SPACING.md, backgroundColor: COLORS.primary },
    modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg, maxHeight: "70%" },
    modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: "bold", color: COLORS.text, marginBottom: SPACING.md },
    modalItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    modalItemText: { fontSize: FONT_SIZE.md, color: COLORS.text },
    emptyText: { textAlign: "center", color: COLORS.secondary, padding: SPACING.xl },
    closeButton: { marginTop: SPACING.lg, backgroundColor: COLORS.secondary }
});

export default CreateReservationScreen;
