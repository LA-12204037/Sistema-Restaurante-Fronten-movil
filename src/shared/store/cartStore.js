import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "./authStore";

export const useCartStore = create((set, get) => ({
    carts: [],
    loading: false,
    error: null,

    localCart: [],

    getCarts: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const user = useAuthStore.getState().user;
            const usuario = user?.name || user?.email || "Cliente";

            const response = await axios.get(`${ENDPOINTS.PAPALUIGI}/cart?usuario=${encodeURIComponent(usuario)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ carts: response.data.carts || response.data.data || response.data || [], loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al obtener carritos", 
                loading: false 
            });
        }
    },

    addToCart: (menuItem, quantity = 1) => {
        set((state) => {
            const existingItemIndex = state.localCart.findIndex(item => item.menuItem._id === menuItem._id);
            if (existingItemIndex >= 0) {
                const updatedCart = [...state.localCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return { localCart: updatedCart };
            }
            return { 
                localCart: [...state.localCart, { 
                    menuItem, 
                    quantity, 
                    price: menuItem.price 
                }] 
            };
        });
    },

    removeFromCart: (menuItemId) => {
        set((state) => ({
            localCart: state.localCart.filter(item => item.menuItem._id !== menuItemId)
        }));
    },

    clearCart: () => set({ localCart: [] }),

    checkoutCart: async () => {
        const { localCart } = get();
        if (localCart.length === 0) return;

        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const user = useAuthStore.getState().user;
            const usuario = user?.name || user?.email || "Cliente";
            
            // Adaptar los datos al formato que espera el backend
            const items = localCart.map(item => ({
                menuItem: item.menuItem._id,
                quantity: item.quantity,
                price: item.price
            }));

            await axios.post(`${ENDPOINTS.PAPALUIGI}/cart`, { items, usuario }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Limpiar el carrito local y refrescar los carritos del servidor
            set({ localCart: [], loading: false });
            get().getCarts();
            
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al finalizar la compra", 
                loading: false 
            });
            throw error;
        }
    }
}));
