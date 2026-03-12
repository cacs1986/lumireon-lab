import { useState, useEffect } from "react";
import { obtenerMateriales } from "../servicios/materialService";
import type { Material } from "../types/Material";

export const useMaterials = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        setLoading(true);
        const data = await obtenerMateriales();
        setMateriales(data);
      } catch (err) {
        setError("Error al conectar con la base de datos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  return { materiales, loading, error };
};