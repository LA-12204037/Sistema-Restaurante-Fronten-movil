import React, { useEffect, useState } from "react";
import { useEventStore } from "../../users/store/eventStore";
import { useUIStore } from "../../auth/store/uiStore";
import { showError, showSuccess } from "../../../shared/utils/toast";
import { Spinner } from "@material-tailwind/react";
import { useSaveEvent } from "../../administration/hooks/useSaveEvent";

export const Events = () => {
  const { events, loading, error, getEvents, changeStatus } = useEventStore();
  const { openConfirm } = useUIStore();
  const { saveEvent } = useSaveEvent();

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    nombreEvento: "",
    descripcion: "",
    observaciones: "",
    isActive: true,
    fechaInicio: "",
    fechaFin: "",
    horaInicio: "",
    horaFin: "",
    estado: "Programado",
  });

  useEffect(() => { getEvents(); }, [getEvents]);
  useEffect(() => { if (error) showError(error); }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 min-h-[50vh]">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  const handleOpenModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        nombreEvento:  event.nombreEvento  || "",
        descripcion:   event.descripcion   || "",
        observaciones: event.observaciones || "",
        isActive:      event.isActive !== undefined ? event.isActive : true,
        fechaInicio:   event.fechaInicio?.split("T")[0] || event.fecha?.split("T")[0] || "",
        fechaFin:      event.fechaFin?.split("T")[0]    || "",
        horaInicio:    event.horaInicio || "",
        horaFin:       event.horaFin    || "",
        estado:        event.estado     || "Programado",
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        nombreEvento:  "",
        descripcion:   "",
        observaciones: "",
        isActive:      true,
        fechaInicio:   "",
        fechaFin:      "",
        horaInicio:    "",
        horaFin:       "",
        estado:        "Programado",
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nombreEvento || !formData.fechaInicio || !formData.fechaFin || !formData.descripcion) {
      showError("Completa los campos requeridos");
      return;
    }

    try {
      await saveEvent(formData, selectedEvent?._id || null);
      showSuccess(selectedEvent ? "Evento actualizado" : "Evento creado");
      setShowModal(false);
      await getEvents();
    } catch (error) {
      showError("Error al guardar el evento");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleToggleStatus = async (eventId, currentStatus) => {
    try {
      await changeStatus(eventId, !currentStatus);
      showSuccess("Estado del evento actualizado");
      await getEvents();
    } catch (error) {
      showError("Error al cambiar el estado");
    }
  };

  return (
    <section className="space-y-6 p-4 max-w-7xl mx-auto box-border w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1506]">Eventos</h1>
          <p className="text-xs sm:text-sm text-[#2C1506]/80 mt-1">
            Programación y gestión de eventos del restaurante.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
        >
          + Nuevo Evento
        </button>
      </div>

      {/* GRID DE EVENTOS */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No hay eventos registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full box-border">
          {events.map((event) => (
            <article
              key={event._id}
              className="bg-[#FFF8F0]/90 rounded-3xl border border-[#C00000]/20 p-4 sm:p-6 shadow-sm md:hover:-translate-y-1 transition-transform duration-200 w-full box-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="max-w-[75%]">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#2C1506] break-words">{event.nombreEvento}</h2>
                    <p className="text-xs sm:text-sm text-[#2C1506]/80 mt-1 break-words">{event.descripcion}</p>
                    {event.observaciones && event.observaciones !== "Sin observaciones" && (
                      <p className="text-xs text-[#2C1506]/60 mt-1 break-words italic">{event.observaciones}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold shrink-0 cursor-pointer hover:opacity-75 ${
                      event.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                    onClick={() => handleToggleStatus(event._id, event.isActive)}
                    title="Click para cambiar estado"
                  >
                    {event.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="grid gap-1.5 text-xs sm:text-sm text-[#2C1506]/80 mb-2 border-t border-[#C00000]/10 pt-3">
                  <div className="capitalize">
                    <span className="font-medium text-[#2C1506]">Inicio:</span>{" "}
                    {event.fechaInicio
                      ? new Date(event.fechaInicio).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                      : "N/A"}
                  </div>
                  <div className="capitalize">
                    <span className="font-medium text-[#2C1506]">Fin:</span>{" "}
                    {event.fechaFin
                      ? new Date(event.fechaFin).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium text-[#2C1506]">Horario:</span> {event.horaInicio} – {event.horaFin} hrs
                  </div>
                  <div>
                    <span className="font-medium text-[#2C1506]">Estado:</span>{" "}
                    <span className={`font-semibold ${
                      event.estado === "Programado"  ? "text-blue-600"  :
                      event.estado === "En curso"    ? "text-green-600" :
                      event.estado === "Finalizado"  ? "text-gray-500"  : "text-red-600"
                    }`}>{event.estado}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenModal(event)}
                className="w-full mt-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                ✏️ Editar
              </button>
            </article>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-[#2C1506]">
              {selectedEvent ? "Editar Evento" : "Nuevo Evento"}
            </h3>

            <div className="space-y-4">

              {/* NOMBRE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#2C1506]">Nombre del Evento *</label>
                <input
                  type="text"
                  value={formData.nombreEvento}
                  onChange={(e) => handleInputChange("nombreEvento", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Nombre del evento"
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#2C1506]">Descripción *</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows="3"
                  placeholder="Descripción del evento"
                />
              </div>

              {/* FECHAS */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#2C1506]">Fecha Inicio *</label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#2C1506]">Fecha Fin *</label>
                  <input
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => handleInputChange("fechaFin", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* HORAS */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#2C1506]">Hora Inicio *</label>
                  <input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => handleInputChange("horaInicio", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#2C1506]">Hora Fin *</label>
                  <input
                    type="time"
                    value={formData.horaFin}
                    onChange={(e) => handleInputChange("horaFin", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* ESTADO */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#2C1506]">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange("estado", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="Programado">Programado</option>
                  <option value="En curso">En curso</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              {/* OBSERVACIONES */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#2C1506]">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows="2"
                  placeholder="Notas adicionales (opcional)"
                />
              </div>

              {/* ACTIVO */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm text-[#2C1506]">Evento Activo</label>
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