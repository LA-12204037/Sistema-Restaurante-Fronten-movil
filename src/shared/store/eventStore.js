import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "./authStore";

export const useEventStore = create((set, get) => ({
    events: [],
    loading: false,
    error: null,

    getEvents: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.get(`${ENDPOINTS.PAPALUIGI}/event`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ events: response.data.events || response.data || [], loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al obtener eventos", 
                loading: false 
            });
        }
    }
}));
