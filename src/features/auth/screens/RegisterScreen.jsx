import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ImageBackground
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useAuth } from "../hooks/useAuth";

import logo from "../../../../assets/logo.png";
import fondo from "../../../../assets/loginfondo.png";

const RegisterScreen = ({ navigation }) => {
    const { handleRegister, loading } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            username: "",
            email: "",
            password: "",
            phone: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            await handleRegister(data);
            Alert.alert("Éxito", "Usuario registrado correctamente", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Error al registrar usuario");
        }
    };

    return (
        <ImageBackground source={fondo} style={styles.backgroundImage}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.card}>
                        <Image source={logo} style={styles.logo} resizeMode="contain" />
                        
                        <Text style={styles.title}>Registro</Text>
                        <Text style={styles.subtitle}>Crea una cuenta en Papa Luigi</Text>

                        <Controller
                            control={control}
                            rules={{ required: "Nombre requerido" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Nombre"
                                    placeholder="Juan"
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.name?.message}
                                />
                            )}
                            name="name"
                        />

                        <Controller
                            control={control}
                            rules={{ required: "Apellido requerido" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Apellido"
                                    placeholder="Pérez"
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.surname?.message}
                                />
                            )}
                            name="surname"
                        />

                        <Controller
                            control={control}
                            rules={{ required: "Usuario requerido" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Usuario"
                                    placeholder="juanp"
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="none"
                                    error={errors.username?.message}
                                />
                            )}
                            name="username"
                        />

                        <Controller
                            control={control}
                            rules={{ required: "Email requerido" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Email"
                                    placeholder="correo@ejemplo.com"
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="none"
                                    error={errors.email?.message}
                                />
                            )}
                            name="email"
                        />

                        <Controller
                            control={control}
                            rules={{ required: "Teléfono requerido" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Teléfono"
                                    placeholder="12345678"
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="phone-pad"
                                    error={errors.phone?.message}
                                />
                            )}
                            name="phone"
                        />

                        <Controller
                            control={control}
                            rules={{ required: "Contraseña requerida" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Contraseña"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="none"
                                    error={errors.password?.message}
                                />
                            )}
                            name="password"
                        />

                        <Button
                            title="Registrarse"
                            onPress={handleSubmit(onSubmit)}
                            loading={loading}
                            style={styles.button}
                        />

                        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                            ¿Ya tienes cuenta? Inicia Sesión
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.card,
        padding: SPACING.xl,
        borderRadius: 20,
        ...SHADOWS.md,
        alignItems: "center",
    },
    logo: {
        height: 80,
        width: 80,
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.error,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZE.sm,
        color: "#166534",
        marginBottom: SPACING.lg,
    },
    button: {
        backgroundColor: COLORS.error,
        marginTop: SPACING.md,
    },
    link: {
        marginTop: SPACING.md,
        color: "#166534",
        fontWeight: "600",
    }
});

export default RegisterScreen;