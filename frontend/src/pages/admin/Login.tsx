import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }) 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      // ¡Éxito! Guardamos la pulsera (token) en el navegador
      localStorage.setItem("lumireon_token", data.token);
      
      // Y nos vamos al panel
      navigate("/admin/dashboard");
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al iniciar sesión");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-soft shadow-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-carbon">Acceso Restringido</h1>
          <p className="text-sm text-gray-dark mt-2">Panel de administración de LumireonLab</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-orange-subtle text-orange text-sm font-bold rounded text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          
          <div>
            <label className="block text-sm font-bold text-carbon mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-colors"
              placeholder="carla@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-carbon mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-carbon text-white border-none py-2.5 rounded hover:bg-orange transition-colors font-bold mt-4"
          >
            Ingresar
          </button>

        </form>
      </div>
    </div>
  );
}