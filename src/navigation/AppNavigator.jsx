import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../shared/constants/theme.js";
import AuthStack from "./AuthStack.jsx";
import MainTabs from "./MainTabs.jsx";
import { useAuthStore } from "../shared/store/authStore.js";

const AppNavigator = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isHydrated = useAuthStore((state) => state._hasHydrated);

    // Si aún no se ha cargado el estado (hidratación de persistencia)
    if (!isHydrated) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background, // Usamos el color de fondo definido en theme.js
    },
});

export default AppNavigator;