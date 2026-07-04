import React, { useEffect, useState } from "react";
import { useReservationStore } from "../../users/store/reservationStore";
import { useTableStore } from "../../users/store/mesaStore";
import { useEventStore } from "../../users/store/eventStore";
import { useOrderStore } from "../../users/store/orderStore";
import { useUIStore } from "../../auth/store/uiStore";
import { showError, showSuccess } from "../../../shared/utils/toast";
import { Spinner } from "@material-tailwind/react";
import { useSaveReservation } from "../../administration/hooks/useSaveReservation";

// Función para obtener el estilo de estado según tipo
const estadoStyle = (estado) => {
  switch (estado) {
    case "Activa":
      return "bg-green-100 text-green-700";
    case "Finalizada":
      return "bg-gray-100 text-gray-700";
    case "Cancelada":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const Reservations = () => {
  const { reservations, loading, error, getReservations } = useReservationStore();
  const { tables } = useTableStore();
  const { events } = useEventStore();
  const { orders } = useOrderStore();
  const { openConfirm } = useUIStore();
  const { saveReservation } = useSaveReservation();

  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [formData, setFormData] = useState({
    usuario: "",
    mesa: "",
    cantidadPersonas: "",
    estado: "Activa",
    descripcion: "",
    fecha: "",
    hora: "",
    evento: "",
    orden: "",
    ubicacion: "",
  });

  // Cargar datos
  useEffect(() => {
    getReservations();
  }, [getReservations]);

  // Mostrar errores
  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 min-h-[50vh]">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  const handleOpenModal = (reservation = null) => {
    if (reservation) {
      setSelectedReservation(reservation);
      setFormData({
        usuario: reservation.usuario || "",
        mesa: reservation.mesa || "",
        cantidadPersonas: reservation.cantidadPersonas || "",
        estado: reservation.estado || "Activa",
        descripcion: reservation.descripcion || "",
        fecha: reservation.fecha?.split("T")[0] || "",
        hora: reservation.hora || "",
        evento: reservation.evento || "",
        orden: reservation.orden || "",
        ubicacion: reservation.ubicacion || "",
      });
    } else {
      setSelectedReservation(null);
      setFormData({
        usuario: "",
        mesa: "",
        cantidadPersonas: "",
        estado: "Activa",
        descripcion: "",
        fecha: "",
        hora: "",
        evento: "",
        orden: "",
        ubicacion: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.usuario || !formData.mesa || !formData.cantidadPersonas) {
      showError("Completa los campos requeridos");
      return;
    }

    try {
      await saveReservation(formData, selectedReservation?._id || null);
      showSuccess(selectedReservation ? "Reservación actualizada" : "Reservación creada");
      setShowModal(false);
      await getReservations();
    } catch (error) {
      showError("Error al guardar la reservación");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const getOrderName = (orderId) => {
    const order = orders?.find((o) => o._id === orderId);
    return order?.nombrePedido || "Sin orden";
  };

  const getEventName = (eventId) => {
    const event = events?.find((e) => e._id === eventId);
    return event?.nombreEvento || "Sin evento";
  };

  const getTableNumber = (tableId) => {
    const table = tables?.find((t) => t._id === tableId);
    return table?.numeroMesa || tableId;
  };
  return (
    <section className="space-y-6 px-1 sm:px-0">
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col gap-3 text-center sm:text-left md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1506] m-0">
            Reservaciones
          </h1>
          <p className="text-xs sm:text-sm text-[#2C1506]/80 mt-1.5 mb-0">
            Gestión de reservaciones con mesas, eventos y órdenes.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Nueva Reservación
        </button>
      </div>

      {/* GRID CONFIGURADO PARA COLAPSAR EN MÓVILES */}
      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No hay reservaciones registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reservations.map((reservation) => (
            <article
              key={reservation._id}
              className="bg-[#FFF8F0]/90 rounded-3xl border border-[#C00000]/10 p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#2C1506] truncate m-0">
                      {reservation.usuario}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#2C1506]/80 mt-1 mb-0">
                      Mesa {getTableNumber(reservation.mesa)} · {reservation.cantidadPersonas} personas
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap flex-shrink-0 ${estadoStyle(reservation.estado)}`}>
                    {reservation.estado}
                  </span>
                </div>

                {/* INFORMACIÓN RELACIONAL */}
                {(reservation.evento || reservation.orden) && (
                  <div className="bg-white/50 rounded-lg p-2 mb-3 text-xs space-y-1">
                    {reservation.evento && (
                      <div>
                        <span className="font-medium text-[#2C1506]">Evento:</span>
                        <span className="text-[#2C1506]/75 ml-1">{getEventName(reservation.evento)}</span>
                      </div>
                    )}
                    {reservation.orden && (
                      <div>
                        <span className="font-medium text-[#2C1506]">Orden:</span>
                        <span className="text-[#2C1506]/75 ml-1">{getOrderName(reservation.orden)}</span>
                      </div>
                    )}
                    {reservation.ubicacion && (
                      <div>
                        <span className="font-medium text-[#2C1506]">Ubicación:</span>
                        <span className="text-[#2C1506]/75 ml-1">{reservation.ubicacion}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#2C1506]/75 mb-4 line-clamp-3">
                  {reservation.descripcion}
                </p>
              </div>

              {/* DETALLES DE FECHA Y HORA */}
              <div>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-[#2C1506]/80 pt-3 border-t border-[#2C1506]/10 mb-3">
                  <div>
                    <span className="font-medium">Fecha:</span>{" "}
                    {new Date(reservation.fecha).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-right sm:text-left">
                    <span className="font-medium">Hora:</span> {reservation.hora}
                  </div>
                </div>

                {/* BOTÓN EDITAR */}
                <button
                  onClick={() => handleOpenModal(reservation)}
                  className="w-full py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  ✏️ Editar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODAL CREAR/EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-[#2C1506]">
              {selectedReservation ? "Editar Reservación" : "Nueva Reservación"}
            </h3>

            <div className="space-y-4">
              {/* USUARIO */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Nombre *</label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => handleInputChange("usuario", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Nombre del cliente"
                />
              </div>

              {/* MESA */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Mesa *</label>
                <select
                  value={formData.mesa}
                  onChange={(e) => handleInputChange("mesa", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Seleccionar mesa</option>
                  {(tables || []).map((table) => (
                    <option key={table._id} value={table._id}>
                      Mesa {table.numeroMesa} - {table.estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* CANTIDAD DE PERSONAS */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Cantidad de Personas *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cantidadPersonas}
                  onChange={(e) => handleInputChange("cantidadPersonas", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="1"
                />
              </div>

              {/* EVENTO */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Evento</label>
                <select
                  value={formData.evento}
                  onChange={(e) => handleInputChange("evento", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Sin evento</option>
                  {(events || []).map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.nombreEvento}
                    </option>
                  ))}
                </select>
              </div>

              {/* ORDEN */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Orden</label>
                <select
                  value={formData.orden}
                  onChange={(e) => handleInputChange("orden", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Sin orden</option>
                  {(orders || []).map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.nombrePedido} - ${order.total}
                    </option>
                  ))}
                </select>
              </div>

              {/* UBICACIÓN */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Ubicación</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Descripción de ubicación"
                />
              </div>

              {/* FECHA */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* HORA */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Hora</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => handleInputChange("hora", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* ESTADO */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange("estado", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Activa">Activa</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2C1506]">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows="3"
                  placeholder="Notas adicionales"
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};