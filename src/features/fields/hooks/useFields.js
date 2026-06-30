import { useState, useEffect, useCallback } from "react";
import userClient from "../../../shared/api/userClient.js";

// Optimizamos el mapeo para que sea más robusto ante datos faltantes
const mapFieldToViewModel = (field) => ({
    id: field.fieldId || field.id, // Normalizamos el ID
    name: field.fieldName || "Cancha sin nombre",
    image: field.photo || null, 
    // Mantenemos tu formato de descripción, asegurando legibilidad
    location: `${field.fieldType || "Estándar"} • Cap: ${field.capacity || "N/A"}`,
    isAvailable: Boolean(field.isActive),
});

export const useFields = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getFields = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Ajustamos la ruta según tu estructura de backend
            const response = await userClient.get("/fields");
            
            // Normalizamos la respuesta esperando la estructura { data: [...] }
            const rawFields = response.data?.data || response.data || [];
            
            setFields(rawFields.map(mapFieldToViewModel));
        } catch (err) {
            console.error("Error en useFields:", err);
            setError(err.response?.data?.message || "No se pudieron cargar las canchas");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getFields();
    }, [getFields]);

    return { fields, loading, error, getFields };
};