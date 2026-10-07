/**
 * paginas/FormularioCriatura.tsx
 * ----------------------------------
 * Un solo componente para CREAR y EDITAR, según la ruta.
 */

import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearCriatura, actualizarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { CriaturaFormulario, TIPOS_CRIATURA, ESTADOS_INVESTIGACION } from "../tipos";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
        setHabilidadesTexto(criatura.habilidades.join(", "));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const datosAEnviar: CriaturaFormulario = {
      ...form,
      habilidades: habilidadesTexto
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) {
        await actualizarCriatura(id, datosAEnviar);
      } else {
        await crearCriatura(datosAEnviar);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p>Cargando datos de la criatura...</p>;

  return (
    <div>
      <h1>{esEdicion ? "Editar criatura" : "Registrar criatura nueva"}</h1>

      {error && <p>Error: {error}</p>}

      <form onSubmit={manejarEnvio}>
        <p>
          <label htmlFor="nombre">Nombre: </label>
          <br />
          <input
            id="nombre"
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </p>

        <p>
          <label htmlFor="tipo">Tipo: </label>
          <br />
          <select
            id="tipo"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as CriaturaFormulario["tipo"] })}
          >
            {TIPOS_CRIATURA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </p>

        <p>
          <label htmlFor="habilidades">Habilidades (separadas por comas): </label>
          <br />
          <input
            id="habilidades"
            type="text"
            value={habilidadesTexto}
            onChange={(e) => setHabilidadesTexto(e.target.value)}
          />
        </p>

        <p>
          <label htmlFor="nivelPeligro">Nivel de peligro (1-10): </label>
          <br />
          <input
            id="nivelPeligro"
            type="number"
            min={1}
            max={10}
            value={form.nivelPeligro}
            onChange={(e) => setForm({ ...form, nivelPeligro: Number(e.target.value) })}
          />
        </p>

        <p>
          <label htmlFor="estado">Estado: </label>
          <br />
          <select
            id="estado"
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value as CriaturaFormulario["estado"] })}
          >
            {ESTADOS_INVESTIGACION.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </p>

        <p>
          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear criatura"}
          </button>
        </p>
      </form>
    </div>
  );
}
