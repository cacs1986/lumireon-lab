const API_URL = import.meta.env.VITE_API_URL + '/materials';

export const obtenerMateriales = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener los materiales");
  return res.json();
};

export const crearMaterial = async (
  material: { title: string; description: string; type: string; url: string; tags: string[] },
  token: string
) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(material)
  });
  if (!res.ok) throw new Error("Error al crear el material");
  return res.json();
};

export const eliminarMaterial = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al eliminar el material");
  return res.json();
};