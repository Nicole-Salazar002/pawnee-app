import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";

function IconoInicio() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function IconoOjo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconoMas() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  );
}

function IconoBuscar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function Tablero() {
  const navigate = useNavigate();
  const location = useLocation();
  const [parametros, setParametros] = useSearchParams();
  const [consulta, setConsulta] = useState(parametros.get("q") ?? "");
  const [recientes, setRecientes] = useState<Avistamiento[]>([]);

  useEffect(() => {
    setConsulta(parametros.get("q") ?? "");
  }, [parametros]);

  useEffect(() => {
    obtenerAvistamientos()
      .then((lista) => setRecientes(lista.slice(0, 4)))
      .catch(() => setRecientes([]));
  }, [location.pathname]);

  function manejarBusqueda(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const texto = consulta.trim();
    if (location.pathname === "/") {
      const siguientes = new URLSearchParams(parametros);
      if (texto) siguientes.set("q", texto);
      else siguientes.delete("q");
      setParametros(siguientes, { replace: true });
      return;
    }
    navigate(texto ? `/?q=${encodeURIComponent(texto)}` : "/");
  }

  function alEscribir(valor: string) {
    setConsulta(valor);
    if (location.pathname !== "/") return;
    const siguientes = new URLSearchParams(parametros);
    if (valor.trim()) siguientes.set("q", valor);
    else siguientes.delete("q");
    setParametros(siguientes, { replace: true });
  }

  return (
    <div className="tablero">
      <aside className="barra">
        <div className="marca">
          <span className="marca-signo">P</span>
          <div>
            <strong>PAWNEE</strong>
            <small>Parques y fenómenos</small>
          </div>
        </div>

        <p className="chip-seccion">Registro</p>

        <nav className="nav" aria-label="Secciones">
          <NavLink
            to="/"
            className={() => {
              const ruta = location.pathname;
              const activo = ruta === "/" || (/^\/criaturas\/[^/]+/.test(ruta) && !ruta.startsWith("/criaturas/nueva"));
              return activo ? "nav-item activo" : "nav-item";
            }}
          >
            <IconoInicio /> Criaturas
          </NavLink>
          <NavLink to="/avistamientos" end className={({ isActive }) => (isActive ? "nav-item activo" : "nav-item")}>
            <IconoOjo /> Avistamientos
          </NavLink>
          <NavLink to="/criaturas/nueva" className={({ isActive }) => (isActive ? "nav-item activo" : "nav-item")}>
            <IconoMas /> Nueva criatura
          </NavLink>
          <NavLink to="/avistamientos/nuevo" className={({ isActive }) => (isActive ? "nav-item activo" : "nav-item")}>
            <IconoMas /> Nuevo avistamiento
          </NavLink>
        </nav>

        <div className="barra-pie">
          <strong>Ayuda</strong>
          Aquí se registran las criaturas del departamento y cada avistamiento asociado.
        </div>
      </aside>

      <div className="zona">
        <header className="cabecera">
          <form className="buscador" onSubmit={manejarBusqueda}>
            <IconoBuscar />
            <input
              type="search"
              value={consulta}
              onChange={(evento) => alEscribir(evento.target.value)}
              placeholder="Buscar criatura"
              aria-label="Buscar criatura"
            />
          </form>
        </header>

        <div className="rejilla">
          <main className="principal">
            <Outlet />
          </main>
          <aside className="lateral" aria-label="Avistamientos recientes">
            <h2>Avistamientos recientes</h2>
            {recientes.length === 0 ? (
              <p className="vacio">Todavía no hay avistamientos para mostrar.</p>
            ) : (
              recientes.map((avistamiento) => (
                <Link
                  key={avistamiento._id}
                  className="resumen-item"
                  to={avistamiento.criatura?._id ? `/criaturas/${avistamiento.criatura._id}` : "/avistamientos"}
                >
                  <strong>{avistamiento.criatura?.nombre ?? "Criatura"}</strong>
                  <span>
                    {avistamiento.fecha.slice(0, 10)} · {avistamiento.testigo}
                  </span>
                </Link>
              ))
            )}
            <NavLink to="/avistamientos" end className="boton-enlace secundario">
              Ver todos
            </NavLink>
          </aside>
        </div>
      </div>
    </div>
  );
}
