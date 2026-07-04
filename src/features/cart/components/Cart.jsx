import React, { useEffect, useState } from "react";
import { useCartStore } from "../../users/store/cartStore";
import { useMenuStore } from "../../users/store/menuStore";
import { showError, showSuccess } from "../../../shared/utils/toast";
import { Spinner } from "@material-tailwind/react";
import { useSaveCart } from "../../administration/hooks/useSaveCart";

export const Cart = () => {
  const { carts, loading, error, getCarts, addItemToCart, removeItemFromCart, updateItemQuantity, calculateCartTotal } = useCartStore();
  const { menuItems, getMenuItems } = useMenuStore();
  const { saveCart } = useSaveCart();

  const [selectedCart, setSelectedCart] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNewCartModal, setShowNewCartModal] = useState(false);
  const [newCartItems, setNewCartItems] = useState([]);
  const [newCartStatus, setNewCartStatus] = useState("activo");
  const [newSelectedMenuItem, setNewSelectedMenuItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);

  const newCartTotal = newCartItems.reduce(
    (total, item) => total + ((item.price || item.precio || 0) * (item.quantity || 0)),
    0,
  );

  const handleAddItemToNewCart = () => {
    if (!newSelectedMenuItem) { showError("Selecciona un platillo"); return; }
    const itemId = newSelectedMenuItem._id;
    setNewCartItems((current) => {
      const exists = current.find((item) => item._id === itemId);
      if (exists) return current.map((item) => item._id === itemId ? { ...item, quantity: item.quantity + newQuantity } : item);
      return [...current, { ...newSelectedMenuItem, quantity: newQuantity }];
    });
    setNewSelectedMenuItem(null);
    setNewQuantity(1);
  };

  const handleUpdateNewCartQuantity = (itemId, qty) => {
    if (qty <= 0) { setNewCartItems((c) => c.filter((i) => i._id !== itemId)); return; }
    setNewCartItems((c) => c.map((i) => i._id === itemId ? { ...i, quantity: qty } : i));
  };

  const handleRemoveItemFromNewCart = (itemId) => setNewCartItems((c) => c.filter((i) => i._id !== itemId));

  const resetNewCartState = () => {
    setShowNewCartModal(false);
    setNewCartItems([]);
    setNewCartStatus("activo");
    setNewSelectedMenuItem(null);
    setNewQuantity(1);
  };

  const handleCreateNewCart = async () => {
    if (newCartItems.length === 0) { showError("Agrega al menos un platillo"); return; }
    try {
      await saveCart({
        status: newCartStatus,
        items: newCartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          price:    Number(item.price || item.precio || 0),
          subtotal: Number(item.price || item.precio || 0) * item.quantity,
        })),
        total: newCartTotal,
      });
      showSuccess("Carrito creado correctamente");
      await getCarts();
      resetNewCartState();
    } catch {
      showError("Error al crear el carrito");
    }
  };

  useEffect(() => { getCarts(); getMenuItems(); }, [getCarts, getMenuItems]);
  useEffect(() => { if (error) showError(error); }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 min-h-[50vh]">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800";
      case "activo":     return "bg-yellow-100 text-yellow-800";
      case "cancelado":  return "bg-red-100 text-red-800";
      default:           return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddItemToCart = (cartId) => {
    if (!selectedMenuItem) { showError("Selecciona un platillo"); return; }
    addItemToCart(cartId, { ...selectedMenuItem, quantity, subtotal: (selectedMenuItem.price || selectedMenuItem.precio || 0) * quantity });
    showSuccess("Platillo agregado");
    setSelectedCart(null); setSelectedMenuItem(null); setQuantity(1);
  };

  const handleRemoveItem = (cartId, itemId) => { removeItemFromCart(cartId, itemId); showSuccess("Platillo removido"); };

  const handleUpdateQuantity = (cartId, itemId, newQty) => {
    if (newQty <= 0) { handleRemoveItem(cartId, itemId); return; }
    updateItemQuantity(cartId, itemId, newQty);
  };

  const handleSaveCart = async (cart) => {
    try {
      const total = calculateCartTotal(cart._id);
      await saveCart({
        orderId: cart.orderId,
        status: cart.status,
        items: (cart.items || []).map((item) => ({
          menuItem: item.menuItem?._id || item.menuItem || item._id,
          quantity: item.quantity,
          price:    Number(item.price || item.precio || 0),
          subtotal: Number(item.price || item.precio || 0) * item.quantity,
        })),
        total,
      }, cart._id);
      showSuccess("Carrito actualizado");
    } catch {
      showError("Error al guardar el carrito");
    }
  };

  return (
    <section className="space-y-6 p-4 max-w-7xl mx-auto box-border w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1506]">Carritos</h1>
          <p className="text-xs sm:text-sm text-[#2C1506]/80 mt-1">Gestión de carritos con múltiples platillos y cálculo automático.</p>
        </div>
        <button onClick={() => setShowNewCartModal(true)} className="w-full md:w-auto py-2 px-4 rounded-xl bg-[#C00000] text-white text-sm font-semibold hover:bg-[#A00000] transition">
          + Nuevo Carrito
        </button>
      </div>

      {/* GRID */}
      {carts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No hay carritos registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full box-border">
          {carts.map((cart) => {
            const total = calculateCartTotal(cart._id);
            return (
              <article key={cart._id} className="bg-[#FFF8F0]/90 rounded-3xl border border-[#C00000]/20 p-4 sm:p-6 shadow-sm md:hover:-translate-y-1 transition-transform duration-200 w-full box-border flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-[#2C1506]">Carrito #{String(cart._id).slice(-6)}</h2>
                      <p className="text-xs sm:text-sm text-[#2C1506]/80 mt-1">{(cart.items || []).length} artículos</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${getStatusBadge(cart.status)}`}>{cart.status}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {(cart.items || []).map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-white/80 p-3 border border-[#C00000]/10">
                        <div className="flex items-center justify-between text-[#2C1506] font-semibold gap-2 mb-2">
                          <span className="text-sm break-words max-w-[60%]">{item.saucerName || item.nombre || item.name}</span>
                          <span className="text-sm shrink-0">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#2C1506]/75">
                          <span>${((item.price || item.precio || 0) * item.quantity).toFixed(2)}</span>
                          <div className="flex gap-1">
                            <button onClick={() => handleUpdateQuantity(cart._id, item._id ?? idx, item.quantity - 1)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">-</button>
                            <button onClick={() => handleUpdateQuantity(cart._id, item._id ?? idx, item.quantity + 1)} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">+</button>
                            <button onClick={() => handleRemoveItem(cart._id, item._id ?? idx)} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setSelectedCart(cart._id)} className="w-full mb-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                    + Agregar Platillo
                  </button>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between text-[#2C1506] font-semibold border-t border-[#C00000]/10 pt-4">
                    <span>Total</span>
                    <span className="text-lg">${total.toFixed(2)}</span>
                  </div>
                  <button onClick={() => handleSaveCart(cart)} className="w-full py-2 text-sm bg-[#C00000] text-white rounded-lg hover:bg-[#A00000] transition">
                    Guardar Cambios
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* MODAL AGREGAR ITEM A CARRITO EXISTENTE */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-[#2C1506]">Agregar Platillo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Platillo</label>
                <select value={selectedMenuItem?._id || ""} onChange={(e) => setSelectedMenuItem(menuItems.find((m) => m._id === e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Seleccionar platillo</option>
                  {(menuItems || []).map((item) => (
                    <option key={item._id} value={item._id}>{item.saucerName || item.name} — ${Number(item.price || 0).toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Cantidad</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => { setSelectedCart(null); setSelectedMenuItem(null); setQuantity(1); }} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">Cancelar</button>
              <button onClick={() => handleAddItemToCart(selectedCart)} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR CARRITO */}
      {showNewCartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#2C1506]">Nuevo Carrito</h3>
                <p className="text-sm text-[#2C1506]/75 mt-1">Selecciona platillos y guarda el carrito.</p>
              </div>
              <button onClick={resetNewCartState} className="text-[#2C1506]/70 hover:text-[#2C1506]">✕</button>
            </div>

            {/* SELECTOR DE PLATILLO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2C1506] mb-2">Platillo</label>
                <select value={newSelectedMenuItem?._id || ""} onChange={(e) => setNewSelectedMenuItem(menuItems.find((m) => m._id === e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Seleccionar platillo</option>
                  {(menuItems || []).map((item) => (
                    <option key={item._id} value={item._id}>{item.saucerName || item.name} — ${Number(item.price || 0).toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C1506] mb-2">Cantidad</label>
                <input type="number" min="1" value={newQuantity} onChange={(e) => setNewQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="md:col-span-3">
                <button onClick={handleAddItemToNewCart} className="w-full py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition">
                  + Agregar al carrito
                </button>
              </div>
            </div>

            {/* ESTADO */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#2C1506] mb-2">Estado</label>
              <select value={newCartStatus} onChange={(e) => setNewCartStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="activo">Activo</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* LISTA DE ITEMS */}
            <div className="space-y-3 mb-4">
              {newCartItems.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-xl">Aún no hay platillos en el carrito.</div>
              ) : (
                newCartItems.map((item) => (
                  <div key={item._id} className="rounded-2xl bg-[#FFF8F0]/90 border border-[#C00000]/10 p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-[#2C1506] text-sm">{item.saucerName || item.name}</div>
                        <div className="text-xs text-[#2C1506]/75">Precio: ${Number(item.price || 0).toFixed(2)}</div>
                      </div>
                      <button onClick={() => handleRemoveItemFromNewCart(item._id)} className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs">Eliminar</button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#2C1506]/75">
                      <div className="flex gap-1 items-center">
                        <button onClick={() => handleUpdateNewCartQuantity(item._id, item.quantity - 1)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">-</button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => handleUpdateNewCartQuantity(item._id, item.quantity + 1)} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">+</button>
                      </div>
                      <span>Subtotal: ${((item.price || item.precio || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#C00000]/10 pt-4 mb-4 flex items-center justify-between text-[#2C1506] font-semibold">
              <span>Total</span>
              <span className="text-lg">${newCartTotal.toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={resetNewCartState} className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm">Cancelar</button>
              <button onClick={handleCreateNewCart} className="flex-1 px-4 py-3 rounded-2xl bg-[#C00000] text-white hover:bg-[#A00000] transition text-sm">Crear carrito</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};