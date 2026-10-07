/**
 * paginas/FormularioAvistamiento.tsx
 * ---------------------------------------
 * Crea un avistamiento nuevo. Si se llega desde el detalle de una
 * criatura (?criaturaId=...), ese campo se precarga.
 */

import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvistamientoFormulario, Criatura } from "../tipos";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: parametros.get("criaturaId") ?? "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) {
          setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento(form);
      navigate("/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="cargando">Cargando formulario...</p>;

  return (
    <div>
      <h1>Registrar avistamiento</h1>
      <p>Relaciona el testimonio con una criatura del archivo.</p>

      {error && <p className="aviso">Error: {error}</p>}

      <form className="formulario tarjeta" onSubmit={manejarEnvio}>
        <div>
          <label htmlFor="criatura">Criatura</label>
          <select
            id="criatura"
            value={form.criatura}
            onChange={(e) => setForm({ ...form, criatura: e.target.value })}
          >
            {criaturas.map((criatura) => (
              <option key={criatura._id} value={criatura._id}>
                {criatura.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="testigo">Testigo</label>
          <input
            id="testigo"
            type="text"
            value={form.testigo}
            onChange={(e) => setForm({ ...form, testigo: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            id="ubicacion"
            type="text"
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción (opcional)</label>
          <input
            id="descripcion"
            type="text"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <div className="fila-acciones">
          <button className="boton" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Registrar avistamiento"}
          </button>
        </div>
      </form>
    </div>
  );
}
