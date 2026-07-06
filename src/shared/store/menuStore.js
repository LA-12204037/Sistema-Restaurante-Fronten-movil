import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "./authStore";

export const useMenuStore = create((set, get) => ({
    menuItems: [],
    loading: false,
    error: null,

    getMenuItems: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.get(`${ENDPOINTS.PAPALUIGI}/menuItem`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Adapt for the response format of your Papa Luigi API
            set({ menuItems: response.data.menuItems || response.data || [], loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al obtener platillos", 
                loading: false 
            });
        }
    }
}));
