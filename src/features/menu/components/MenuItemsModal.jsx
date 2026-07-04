import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMenuStore } from "../../users/store/menuStore.js";
import { Spinner } from "@material-tailwind/react";
import { useSaveMenu } from "../../administration/hooks/useSaveMenu";
import { showSuccess, showError } from "../../../shared/utils/toast.js";

const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `https://res.cloudinary.com/dog2q2ise/image/upload/${photo}`;
};

export const MenuItemsModal = ({ isOpen, onClose, menuItem }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { photo: null } });

  const { saveMenu } = useSaveMenu();
  const loading = useMenuStore((state) => state.loading);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (menuItem) {
        reset({
          saucerName:   menuItem.saucerName,
          categoryType: menuItem.categoryType,
          price:        menuItem.price,
          description:  menuItem.description,
          photo:        null, // ← siempre null al abrir, nunca {}
        });
        setPreview(getPhotoUrl(menuItem.photo));
      } else {
        reset({
          saucerName:   "",
          categoryType: "Desayuno",
          price:        "",
          description:  "",
          photo:        null,
        });
        setPreview(null);
      }
    }
  }, [isOpen, menuItem, reset]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "photo" && value.photo instanceof FileList && value.photo.length > 0) {
        setPreview(URL.createObjectURL(value.photo[0]));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    try {
      await saveMenu(data, menuItem?._id);
      showSuccess(menuItem ? "Platillo actualizado correctamente" : "Platillo creado correctamente");
      reset();
      setPreview(null);
      onClose();
    } catch {
      showError("Error al guardar platillo");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <style>{`
        @media (max-width: 640px) {
          .modal-form-body { max-height: calc(85vh - 120px) !important; }
          .modal-grid-inputs { grid-template-columns: 1fr !important; }
          .modal-buttons-footer { flex-direction: column-reverse !important; gap: 0.5rem !important; }
          .modal-buttons-footer button { width: 100% !important; justify-content: center; display: inline-flex; align-items: center; }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">

        {/* HEADER */}
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10 flex-shrink-0"
          style={{ background: "linear-gradient(90deg, var(--main-blue) 0%, #1956a3 100%)" }}
        >
          <h2 className="text-xl sm:text-2xl font-bold m-0">
            {menuItem ? "Editar Platillo" : "Nuevo Platillo"}
          </h2>
          <p className="text-xs sm:text-sm opacity-80 mt-1 mb-0">
            Completa la información del platillo
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 space-y-5 overflow-y-auto modal-form-body flex-grow"
        >
          {/* PREVIEW */}
          <div className="flex justify-center">
            <div className="w-28 h-28 rounded-2xl bg-gray-100 border flex items-center justify-center overflow-hidden flex-shrink-0">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <span className="text-gray-400 text-sm">Sin imagen</span>
              )}
            </div>
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 modal-grid-inputs">

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold mb-1">Nombre del platillo</label>
              <input
                type="text"
                {...register("saucerName", { required: "El nombre es obligatorio" })}
                className="input p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.saucerName && <p className="text-red-500 text-xs mt-1 mb-0">{errors.saucerName.message}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Categoría</label>
              <select
                {...register("categoryType", { required: "La categoría es obligatoria" })}
                className="input p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Platillo-Familiar">Platillo Familiar</option>
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Cena">Cena</option>
              </select>
              {errors.categoryType && <p className="text-red-500 text-xs mt-1 mb-0">{errors.categoryType.message}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Precio</label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "El precio es obligatorio",
                  min: { value: 0, message: "El precio no puede ser negativo" },
                })}
                className="input p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1 mb-0">{errors.price.message}</p>}
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold mb-1">Descripción</label>
              <textarea
                {...register("description", {
                  maxLength: { value: 500, message: "La descripción no puede exceder 500 caracteres" },
                })}
                className="input p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                rows="3"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 mb-0">{errors.description.message}</p>}
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold mb-1">Imagen</label>
              <input
                type="file"
                accept="image/*"
                {...register("photo")}
                className="input p-2 border rounded-lg outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {menuItem && (
            <p className="text-xs text-gray-400 mt-2 truncate mb-0">
              ID de diseño: {menuItem.idDiseno || menuItem._id}
            </p>
          )}

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4 border-t modal-buttons-footer flex-shrink-0">
            <button
              type="button"
              style={{ cursor: "pointer" }}
              onClick={() => { reset(); setPreview(null); onClose(); }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ cursor: "pointer" }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              {loading ? <Spinner className="h-4 w-4" /> : menuItem ? "Guardar cambios" : "Crear platillo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};