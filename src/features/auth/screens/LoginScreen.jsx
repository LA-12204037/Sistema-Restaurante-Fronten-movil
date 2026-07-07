import {
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ImageBackground // 1. Importamos ImageBackground
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useAuth } from "../hooks/useAuth";

// Importamos tus nuevos assets
import logo from "../../../../assets/logo.png";
import fondo from "../../../../assets/loginfondo.png";

const LoginScreen = ({ navigation }) => {
    const { handleLogin, loading } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { emailOrUsername: "", password: "" }
    });

    const onSubmit = async (data) => {
        try {
            const response = await handleLogin(data);
            if (response?.requiresTwoFactor) {
                // Navigate to VerifyLogin screen passing the email real del usuario
                const userEmail = response.userDetails?.email || data.emailOrUsername;
                navigation.navigate("VerifyLogin", { email: userEmail });
            }
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Error al iniciar sesión");
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
                        
                        <Text style={styles.title}>Bienvenido</Text>
                        <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>

                        <Controller
                            control={control}
                            rules={{ required: "Email o usuario requerido" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Email o Usuario"
                                    placeholder="correo@ejemplo.com"
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="none"
                                    error={errors.emailOrUsername?.message}
                                />
                            )}
                            name="emailOrUsername"
                        />

                        <Controller
                            control={control}
                            rules={{ required: "Contraseña requerida" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Contraseña"
                                    placeholder="••••••••"
                                    secureTextEntry={true}
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="none"
                                    error={errors.password?.message}
                                />
                            )}
                            name="password"
                        />

                        <Button
                            title="Iniciar Sesión"
                            onPress={handleSubmit(onSubmit)}
                            loading={loading}
                            style={styles.button}
                        />

                        <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
                            ¿Olvidaste tu contraseña?
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
        backgroundColor: COLORS.card, // Color crema definido en tu theme
        padding: SPACING.xl,
        borderRadius: 20,
        ...SHADOWS.md, // Sombra definida en tu theme
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
        color: COLORS.error, // Rojo oscuro de tu paleta
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZE.sm,
        color: "#166534", // Un tono verde oscuro según tu imagen
        marginBottom: SPACING.lg,
    },
    button: {
        backgroundColor: COLORS.error, // Botón rojo según tu diseño
        marginTop: SPACING.md,
    },
    link: {
        marginTop: SPACING.md,
        color: "#166534",
        fontWeight: "600",
    }
});

export default LoginScreen;