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
      <h1>Avistamientos registrados</h1>

      <p>
        <Link to="/">Volver a criaturas</Link>
        {" · "}
        <Link to="/avistamientos/nuevo">Registrar avistamiento nuevo</Link>
      </p>

      {cargando && <p>Cargando avistamientos...</p>}
      {!cargando && error && <p>Error: {error}</p>}
      {!cargando && !error && avistamientos.length === 0 && <p>Todavía no hay avistamientos registrados.</p>}

      {!cargando && !error && avistamientos.length > 0 && (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Criatura</th>
              <th>Testigo</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {avistamientos.map((avistamiento) => (
              <tr key={avistamiento._id}>
                <td>{avistamiento.fecha.slice(0, 10)}</td>
                <td>
                  <Link to={`/criaturas/${avistamiento.criatura._id}`}>{avistamiento.criatura.nombre}</Link>
                </td>
                <td>{avistamiento.testigo}</td>
                <td>{avistamiento.ubicacion}</td>
                <td>
                  <button type="button" onClick={() => manejarEliminar(avistamiento._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
