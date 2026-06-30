export const ENDPOINTS = {
    // Configuración para el backend de Papaluigi (auth y admin comparten base)
    AUTH: import.meta.env.VITE_AUTH_URL || "http://localhost:5277",
    
    // Si necesitas separar la lógica de admin o usar la base de papaluigi:
    PAPALUIGI: import.meta.env.VITE_ADMIN_URL || "http://localhost:3001/papaluigi/v1",
    
    // Mantengo la referencia al endpoint de usuario anterior por si la necesitas
    USER: import.meta.env.EXPO_PUBLIC_USER_URL || "http://localhost:3003/kinalSportsUser/v1"
};