/**
 * paginas/ListaCriaturas.tsx
 * ------------------------------
 * Página de solo lectura: lista todas las criaturas en una <table> de
 * HTML plano, sin ninguna clase de CSS. Maneja los 3 estados: loading,
 * error y empty.
 */

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { obtenerAvistamientos } from "../api/avistamientosApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";

const NOMBRES_TIPO: Record<TipoCriatura, string> = {
  mitica: "Mítica",
  elemental: "Elemental",
  mecanica: "Mecánica",
  espectral: "Espectral",
};

const NOMBRES_ESTADO: Record<Criatura["estado"], string> = {
  activa: "Activa",
  en_investigacion: "En investigación",
  descartada: "Descartada",
};

export function ListaCriaturas() {
  const [parametros] = useSearchParams();
  const consulta = (parametros.get("q") ?? "").trim().toLowerCase();
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [todas, setTodas] = useState<Criatura[]>([]);
  const [totalAvistamientos, setTotalAvistamientos] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const visibles = criaturas.filter((criatura) => {
    if (!consulta) return true;
    return (
      criatura.nombre.toLowerCase().includes(consulta) ||
      criatura.tipo.toLowerCase().includes(consulta) ||
      criatura.estado.toLowerCase().includes(consulta)
    );
  });

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  useEffect(() => {
    Promise.all([obtenerCriaturas(), obtenerAvistamientos()])
      .then(([lista, avistamientos]) => {
        setTodas(lista);
        setTotalAvistamientos(avistamientos.length);
      })
      .catch(() => {
        setTodas([]);
        setTotalAvistamientos(0);
      });
  }, []);

  const peligroMaximo = todas.reduce((maximo, criatura) => Math.max(maximo, criatura.nivelPeligro), 0);
  const conteoTipos = TIPOS_CRIATURA.map((tipo) => ({
    tipo,
    nombre: NOMBRES_TIPO[tipo],
    total: todas.filter((criatura) => criatura.tipo === tipo).length,
  }));
  const maximoBarras = Math.max(1, ...conteoTipos.map((item) => item.total));

  return (
    <div>
      <section className="hero">
        <h1>Departamento de Pawnee</h1>
        <p>Archivo de criaturas y avistamientos del Departamento de Parques y Fenómenos Inexplicables.</p>
        <div className="acciones">
          <Link className="boton-enlace" to="/criaturas/nueva">
            Registrar criatura
          </Link>
          <Link className="boton-enlace secundario" to="/avistamientos">
            Ver avistamientos
          </Link>
        </div>
      </section>

      <section className="metricas" aria-label="Resumen del archivo">
        <article className="metrica navy">
          <span>Criaturas</span>
          <strong>{todas.length}</strong>
        </article>
        <article className="metrica">
          <span>Tipos registrados</span>
          <strong>{conteoTipos.filter((item) => item.total > 0).length}</strong>
        </article>
        <article className="metrica">
          <span>Avistamientos</span>
          <strong>{totalAvistamientos}</strong>
        </article>
        <article className="metrica">
          <span>Nivel de peligro más alto</span>
          <strong>{peligroMaximo || "—"}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Criaturas por tipo</h2>
        <div className="barras">
          {conteoTipos.map((item) => (
            <div className="barra-tipo" key={item.tipo}>
              <span>{item.nombre}</span>
              <div className="pista" aria-hidden="true">
                <div className="relleno" style={{ width: `${(item.total / maximoBarras) * 100}%` }} />
              </div>
              <strong>{item.total}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="barra-herramientas">
        <h2>Criaturas</h2>
        <label className="campo-linea" htmlFor="filtro-tipo">
          Tipo
          <select
            id="filtro-tipo"
            value={filtroTipo}
            onChange={(evento) => setFiltroTipo(evento.target.value as TipoCriatura | "")}
          >
            <option value="">Todos</option>
            {TIPOS_CRIATURA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {NOMBRES_TIPO[tipo]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {cargando && <p className="cargando">Cargando criaturas...</p>}
      {!cargando && error && <p className="aviso">Ocurrió un error: {error}</p>}
      {!cargando && !error && visibles.length === 0 && (
        <p className="tarjeta vacio">Todavía no hay criaturas registradas con ese criterio.</p>
      )}

      {!cargando && !error && visibles.length > 0 && (
        <div className="cuadricula">
          {visibles.map((criatura) => (
            <article key={criatura._id} className="tarjeta ficha">
              <h2>{criatura.nombre}</h2>
              <div className="meta">
                <span className="pastilla">{NOMBRES_TIPO[criatura.tipo]}</span>
                <span className="pastilla">Peligro {criatura.nivelPeligro}</span>
                <span className="pastilla">{NOMBRES_ESTADO[criatura.estado]}</span>
              </div>
              <div className="fila-acciones">
                <Link className="boton-enlace" to={`/criaturas/${criatura._id}`}>
                  Ver
                </Link>
                <Link className="boton-enlace secundario" to={`/criaturas/${criatura._id}/editar`}>
                  Editar
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
