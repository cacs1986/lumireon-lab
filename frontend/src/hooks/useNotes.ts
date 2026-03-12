import { useState, useEffect } from "react";
import { obtenerNotas } from "../servicios/noteService";
import type { Nota } from "../types/Note"; 
export const useNotes = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        setLoading(true);
        const data = await obtenerNotas();
        setNotas(data);
      } catch (err) {
        setError("Error al conectar con la base de datos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, []);

  return { notas, loading, error };
};