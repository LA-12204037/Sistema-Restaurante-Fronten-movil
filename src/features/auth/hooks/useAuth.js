import { useState } from "react";
import authClient from "../../../shared/api/authClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Obtenemos las funciones desde el store
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    const handleLogin = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            // Hacemos el post al endpoint de login
            const response = await authClient.post("/login", data);
            
            // Asumiendo que tu backend unifica la respuesta:
            const { accessToken, refreshToken, userDetails } = response.data;

            await login(accessToken, userDetails, refreshToken);
            return response.data;
        } catch (err) {
            // Unificamos el manejo de errores para mostrar en el UI
            setError(err.response?.data?.message || "Credenciales incorrectas");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data) => {
        try {
            setLoading(true);
            setError(null);

            // Si el backend espera JSON, no necesitamos FormData, a menos que envíes archivos.
            // Si es solo registro de usuario, esto es mucho más limpio:
            const response = await authClient.post("/register", data);

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrar usuario");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, handleRegister, loading, error, logout };
};