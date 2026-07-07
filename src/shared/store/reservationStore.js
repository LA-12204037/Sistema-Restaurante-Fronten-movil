import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "./authStore";

export const useReservationStore = create((set, get) => ({
    reservations: [],
    loading: false,
    error: null,

    getReservations: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const user = useAuthStore.getState().user;
            const usuario = user?.name || user?.email || "Cliente";

            const response = await axios.get(`${ENDPOINTS.PAPALUIGI}/reservation?usuario=${encodeURIComponent(usuario)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ reservations: response.data.data || response.data || [], loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al obtener reservaciones", 
                loading: false 
            });
        }
    },

    createReservation: async (reservationData) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            await axios.post(`${ENDPOINTS.PAPALUIGI}/reservation`, reservationData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ loading: false });
            // Recargar las reservaciones después de crear
            get().getReservations();
            return true;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al crear la reservación", 
                loading: false 
            });
            throw error;
        }
    }
}));
