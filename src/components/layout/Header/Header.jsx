import { Settings, User } from "lucide-react";
import estilos from "./Header.module.css";
import { useAuth } from "../../../context/AuthContext.jsx";

/**
 * Header compartido del panel.
 * rutaBreadcrumb: array de strings, ej. ["Dashboard", "Eventos"]
 * titulo: título grande de la página actual, ej. "Eventos"
 */
export default function Header({ rutaBreadcrumb = [], titulo = "" }) {
  const { usuarioActual } = useAuth();

  return (
    <header className={estilos.encabezado}>
      <div className={estilos.bloqueTitulo}>
        <nav aria-label="Ruta de navegación" className={estilos.breadcrumb}>
          {rutaBreadcrumb.map((paso, indice) => (
            <span key={paso} className={estilos.pasoBreadcrumb}>
              <span
                className={
                  indice === rutaBreadcrumb.length - 1
                    ? estilos.pasoActual
                    : estilos.pasoEnlace
                }
              >
                {paso}
              </span>
              {indice < rutaBreadcrumb.length - 1 && (
                <span className={estilos.separador}>/</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className={estilos.titulo}>{titulo}</h1>
      </div>

      <div className={estilos.bloqueAcciones}>
        <button
          type="button"
          className={estilos.botonIcono}
          aria-label="Abrir configuración"
        >
          <Settings className={estilos.icono} aria-hidden="true" />
        </button>

        <div className={estilos.perfilUsuario}>
          <span className={estilos.avatarContenedor}>
            <User className={estilos.iconoAvatar} aria-hidden="true" />
          </span>
          <span className={estilos.datosUsuario}>
            <span className={estilos.nombreUsuario}>
              {usuarioActual?.nombre || "Invitado"}
            </span>
            <span className={estilos.rolUsuario}>
              {usuarioActual?.rol || "Sin sesión"}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}