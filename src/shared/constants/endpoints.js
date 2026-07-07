export const ENDPOINTS = {
    // Configuración para el backend de Papaluigi (auth y admin comparten base)
    AUTH: process.env.EXPO_PUBLIC_AUTH_URL || "http://localhost:5277",
    
    // API principal de Papa Luigi
    PAPALUIGI: process.env.EXPO_PUBLIC_ADMIN_URL || process.env.EXPO_PUBLIC_USER_URL || "http://localhost:3001/papaluigi/v1",
    
    // Alias para compatibilidad con código existente
    USER: process.env.EXPO_PUBLIC_USER_URL || "http://localhost:3001/papaluigi/v1"
};