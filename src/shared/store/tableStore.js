import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "./authStore";

export const useTableStore = create((set, get) => ({
    tables: [],
    loading: false,
    error: null,

    getTables: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.get(`${ENDPOINTS.PAPALUIGI}/table`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Adaptar para el formato del backend (podría estar en data.data)
            set({ tables: response.data.data || response.data || [], loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al obtener mesas", 
                loading: false 
            });
        }
    }
}));
