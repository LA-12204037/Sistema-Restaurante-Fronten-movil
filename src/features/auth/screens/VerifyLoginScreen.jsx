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

const VerifyLoginScreen = ({ navigation, route }) => {
    const email = route.params?.email || "";
    const { handleVerifyLogin, loading } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { code: "" }
    });

    const onSubmit = async (data) => {
        try {
            await handleVerifyLogin({ email, code: data.code });
            // The useAuth hook will automatically update the store and navigate
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Código inválido");
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
                        
                        <Text style={styles.title}>Verificación</Text>
                        <Text style={styles.subtitle}>Ingresa el código enviado a tu correo</Text>

                        <Controller
                            control={control}
                            rules={{ required: "Código requerido", minLength: { value: 6, message: "El código debe tener 6 dígitos" } }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Código de Verificación"
                                    placeholder="123456"
                                    keyboardType="numeric"
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.code?.message}
                                />
                            )}
                            name="code"
                        />

                        <Button
                            title="Verificar"
                            onPress={handleSubmit(onSubmit)}
                            loading={loading}
                            style={styles.button}
                        />

                        <Text style={styles.link} onPress={() => navigation.goBack()}>
                            Volver al Login
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
        textAlign: "center"
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

export default VerifyLoginScreen;
