import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "./authStore";

export const useCartStore = create((set, get) => ({
    carts: [],
    loading: false,
    error: null,

    getCarts: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.get(`${ENDPOINTS.PAPALUIGI}/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ carts: response.data.carts || response.data || [], loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al obtener carritos", 
                loading: false 
            });
        }
    }
}));
