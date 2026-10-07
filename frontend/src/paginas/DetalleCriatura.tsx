/**
 * paginas/DetalleCriatura.tsx
 * -------------------------------
 * Muestra una criatura completa y la lista de sus avistamientos, usando
 * la ruta anidada del backend. También permite eliminar la criatura.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura } from "../tipos";

// El backend anida los avistamientos bajo /criaturas/:id/avistamientos
// SIN populate (ver criaturas.controller.ts de la Semana 6) — por eso aquí
// el campo `criatura` es un string, no un objeto.
interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!criatura) return <p>No se encontró la criatura.</p>;

  return (
    <div>
      <p>
        <Link to="/">Volver a la lista</Link>
      </p>

      <h1>{criatura.nombre}</h1>

      <ul>
        <li>Tipo: {criatura.tipo}</li>
        <li>Nivel de peligro: {criatura.nivelPeligro}</li>
        <li>Estado: {criatura.estado}</li>
        <li>Habilidades: {criatura.habilidades.join(", ") || "(ninguna registrada)"}</li>
      </ul>

      <p>
        <Link to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
        {" | "}
        <button type="button" onClick={manejarEliminar}>
          Eliminar
        </button>
      </p>

      <h2>Avistamientos registrados</h2>

      <p>
        <Link to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}>Registrar un avistamiento de esta criatura</Link>
      </p>

      {avistamientos.length === 0 ? (
        <p>Todavía no hay avistamientos registrados para esta criatura.</p>
      ) : (
        <ul>
          {avistamientos.map((avistamiento) => (
            <li key={avistamiento._id}>
              {avistamiento.fecha.slice(0, 10)} — {avistamiento.testigo} en {avistamiento.ubicacion}
              {avistamiento.descripcion ? ` (${avistamiento.descripcion})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
