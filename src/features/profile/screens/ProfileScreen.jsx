import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import Input from "../../../shared/components/Input.jsx";
import Button from "../../../shared/components/Button.jsx";
import { Card } from "../../../shared/components/Common.jsx";
import { useAuthStore } from "../../../shared/store/authStore.js";
import avatarDefault from "../../../../assets/logo.png";

const ProfileScreen = () => {
    const { user, logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    const { control, handleSubmit } = useForm({
        defaultValues: {
            displayName: user?.name || "",
            phone: user?.phone || "",
        },
    });

    const handleLogout = () => {
        Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas salir?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Aceptar", onPress: () => logout() },
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header del Perfil */}
            <View style={styles.header}>
                <Image source={avatarDefault} style={styles.avatarImage} />
                <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
                <Text style={styles.userHandle}>@{user?.username || "usuario"}</Text>
            </View>

            {/* Tarjeta de Información */}
            <Card style={styles.profileCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    <Text style={styles.editBtn} onPress={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Guardar" : "Editar"}
                    </Text>
                </View>

                <Controller
                    control={control}
                    name="displayName"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Nombre completo" value={value} onChangeText={onChange} editable={isEditing} />
                    )}
                />
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Teléfono" value={value} onChangeText={onChange} editable={isEditing} keyboardType="numeric" />
                    )}
                />
            </Card>

            <Button title="Cerrar Sesión" variant="secondary" onPress={handleLogout} />
            <Text style={styles.version}>Papas Luigi v1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.md },
    header: { alignItems: "center", paddingVertical: SPACING.lg },
    avatarImage: {
        width: 100, height: 100, borderRadius: 50,
        borderWidth: 3, borderColor: COLORS.primary,
        marginBottom: SPACING.sm
    },
    userName: { fontSize: FONT_SIZE.xxl, fontWeight: "800", color: COLORS.text },
    userHandle: { fontSize: FONT_SIZE.md, color: COLORS.secondary, marginBottom: SPACING.md },
    profileCard: { ...SHADOWS.md, backgroundColor: COLORS.card, padding: SPACING.md, borderRadius: 16 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.sm },
    sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: "700", color: COLORS.text },
    editBtn: { color: COLORS.primary, fontWeight: "700" },
    version: { textAlign: "center", marginTop: SPACING.xl, color: COLORS.textLight, fontSize: FONT_SIZE.xs }
});

export default ProfileScreen;