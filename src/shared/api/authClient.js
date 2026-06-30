import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/authStore";
import { ENDPOINTS } from "../constants/endpoints";

// 1. Instancia base
const authClient = axios.create({
    baseURL: ENDPOINTS.AUTH,
    headers: { "Content-Type": "application/json" },
});

// 2. Instancia específica para refresh (sin interceptores que puedan causar bucles)
const refreshClient = axios.create({
    baseURL: ENDPOINTS.AUTH,
    headers: { "Content-Type": "application/json" },
});

authClient.interceptors.request.use(async (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token));
    failedQueue = [];
};

authClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest?.url || "";
        const isAuthEndpoint = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/resend-verification"]
            .some(path => requestUrl.includes(path));

        if (isAuthEndpoint || requestUrl.includes("/refresh")) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return authClient(originalRequest);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            if (!refreshToken) throw new Error("No refresh token");

            // Usamos refreshClient para no disparar los interceptores de authClient
            const { data } = await refreshClient.post("/refresh", { refreshToken });
            
            useAuthStore.getState().setAccessToken(data.accessToken);
            await SecureStore.setItemAsync("refreshToken", data.refreshToken);
            
            processQueue(null, data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return authClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            await SecureStore.deleteItemAsync("refreshToken");
            useAuthStore.getState().logout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default authClient;