/**
 * paginas/ListaAvistamientos.tsx
 * -----------------------------------
 * Lista TODOS los avistamientos. Como el backend usa populate("criatura"),
 * cada avistamiento.criatura ya es el objeto completo.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try {
      await eliminarAvistamiento(id);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    }
  }

  return (
    <div>
      <div className="barra-herramientas">
        <div>
          <h1>Avistamientos registrados</h1>
          <p>
            <Link to="/">Volver a criaturas</Link>
          </p>
        </div>
        <Link className="boton-enlace" to="/avistamientos/nuevo">
          Registrar avistamiento
        </Link>
      </div>

      {cargando && <p className="cargando">Cargando avistamientos...</p>}
      {!cargando && error && <p className="aviso">Error: {error}</p>}
      {!cargando && !error && avistamientos.length === 0 && (
        <p className="tarjeta vacio">Todavía no hay avistamientos registrados.</p>
      )}

      {!cargando && !error && avistamientos.length > 0 && (
        <div className="lista">
          {avistamientos.map((avistamiento) => (
            <article key={avistamiento._id} className="tarjeta">
              <div className="meta">
                <span className="pastilla">{avistamiento.fecha.slice(0, 10)}</span>
                <span className="pastilla">{avistamiento.testigo}</span>
              </div>
              <h2>
                <Link to={`/criaturas/${avistamiento.criatura._id}`}>{avistamiento.criatura.nombre}</Link>
              </h2>
              <p>{avistamiento.ubicacion}</p>
              <button type="button" className="boton peligro" onClick={() => manejarEliminar(avistamiento._id)}>
                Eliminar
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
