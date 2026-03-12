import { useState } from "react";

interface Props {
  onImagenSubida: (url: string) => void;
}

export default function BotonSubirImagen({ onImagenSubida }: Props) {
  const [subiendo, setSubiendo] = useState(false);

  const manejarSubida = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendo(true);

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", "lumireon_fotos"); 
    formData.append("cloud_name", "dcaympgto");

    try {
      const respuesta = await fetch(
        "https://api.cloudinary.com/v1_1/dcaympgto/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!respuesta.ok) throw new Error("Error al subir la imagen");

      const datos = await respuesta.json();
      
      onImagenSubida(datos.secure_url);
      
    } catch (error) {
      console.error(error);
      alert("Hubo un error al subir la imagen a Cloudinary.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="cursor-pointer inline-flex items-center justify-center rounded bg-gray-soft px-4 py-2 text-sm font-bold text-carbon transition-colors hover:bg-gray-mid">
        {subiendo ? "Subiendo a la nube..." : "Seleccionar imagen desde mi PC"}
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={manejarSubida} 
          disabled={subiendo}
        />
      </label>
    </div>
  );
}