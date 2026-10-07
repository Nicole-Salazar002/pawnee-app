import { FormEvent, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";

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

  useEffect(() => {
    setConsulta(parametros.get("q") ?? "");
  }, [parametros]);

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
      <header className="barra-superior">
        <div className="marca">
          <span className="marca-signo">P</span>
          <div>
            <strong>Pawnee</strong>
            <small>Departamento</small>
          </div>
        </div>

        <nav className="nav" aria-label="Secciones">
          <NavLink
            to="/"
            className={() => {
              const ruta = location.pathname;
              const activo = ruta === "/" || (/^\/criaturas\/[^/]+/.test(ruta) && !ruta.startsWith("/criaturas/nueva"));
              return activo ? "nav-item activo" : "nav-item";
            }}
          >
            Criaturas
          </NavLink>
          <NavLink to="/avistamientos" end className={({ isActive }) => (isActive ? "nav-item activo" : "nav-item")}>
            Avistamientos
          </NavLink>
          <NavLink to="/criaturas/nueva" className={({ isActive }) => (isActive ? "nav-item activo" : "nav-item")}>
            Nueva criatura
          </NavLink>
          <NavLink to="/avistamientos/nuevo" className={({ isActive }) => (isActive ? "nav-item activo" : "nav-item")}>
            Nuevo avistamiento
          </NavLink>
        </nav>

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

      <main className="zona">
        <Outlet />
      </main>
    </div>
  );
}
