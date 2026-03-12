const API_URL = import.meta.env.VITE_API_URL + '/notes';

export const obtenerNotas = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener las notas");
  return res.json();
};

export const crearNota = async (titulo: string, contenido: string, token: string) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title: titulo, content: contenido })
  });
  if (!res.ok) throw new Error("Error al crear la nota");
  return res.json();
};

export const eliminarNota = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al eliminar la nota");
  return res.json();
};