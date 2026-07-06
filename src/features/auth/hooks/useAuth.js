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
            // Enviamos requires2FA en true para la app móvil
            const response = await authClient.post("/login", { ...data, requires2FA: true });
            
            // Si requiere 2FA, no logueamos aún
            if (response.data.requiresTwoFactor) {
                return response.data;
            }

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

            // El backend requiere multipart/form-data por el [FromForm]
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });

            const response = await authClient.post("/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrar usuario");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyLogin = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authClient.post("/verify-login", data);
            
            // Asumiendo respuesta unificada:
            const { accessToken, refreshToken, userDetails } = response.data;

            await login(accessToken, userDetails, refreshToken);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Código inválido");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, handleRegister, handleVerifyLogin, loading, error, logout };
};