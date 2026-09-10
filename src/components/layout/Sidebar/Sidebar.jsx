import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  CalendarDays,
  ClipboardCheck,
  QrCode,
  GraduationCap,
  FileEdit,
  Grid3x3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ENLACES_NAVEGACION } from "../../../constants/navegacion.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import estilos from "./Sidebar.module.css";

const mapaIconos = {
  LayoutGrid: LayoutGrid,
  CalendarDays: CalendarDays,
  ClipboardCheck: ClipboardCheck,
  QrCode: QrCode,
  GraduationCap: GraduationCap,
  FileEdit: FileEdit,
  Grid3x3: Grid3x3,
};

export default function Sidebar() {
  const { usuarioActual, logout, esAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enlacesAccesibles = ENLACES_NAVEGACION.filter((enlace) => {
    if (!enlace.roles) return true;
    return enlace.roles.some(
      (rol) => rol === usuarioActual?.rol || (rol === "Administrador" && esAdmin)
    );
  });

  return (
    <>
      <div className={estilos.barraMovil}>
        <button
          type="button"
          className={estilos.botonMenu}
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú de navegación"
        >
          <Menu className={estilos.iconoMenu} aria-hidden="true" />
        </button>
        <img
          src="/images/LogoItm.png"
          alt="Logo ITM Institución Universitaria"
          className={estilos.logoMovil}
        />
      </div>

      <div
        className={`${estilos.overlayMovil} ${
          menuAbierto ? estilos.overlayMovilVisible : ""
        }`}
        onClick={() => setMenuAbierto(false)}
        aria-hidden="true"
      />

      <aside
        className={`${estilos.barraLateral} ${
          menuAbierto ? estilos.barraLateralAbierta : ""
        }`}
      >
        <div className={estilos.encabezadoLogo}>
          <img
            src="/images/LogoItm.png"
            alt="Logo ITM Institución Universitaria"
            className={estilos.logo}
          />
          <button
            type="button"
            className={estilos.botonCerrarMenu}
            onClick={() => setMenuAbierto(false)}
            aria-label="Cerrar menú de navegación"
          >
            <X className={estilos.iconoCerrarMenu} aria-hidden="true" />
          </button>
        </div>

        <nav className={estilos.navegacion} aria-label="Navegación principal">
          <ul className={estilos.listaEnlaces}>
            {enlacesAccesibles.map((enlace) => {
              const IconoEnlace = mapaIconos[enlace.icono];
              return (
                <li key={enlace.ruta}>
                  <NavLink
                    to={enlace.ruta}
                    end={enlace.ruta === "/"}
                    onClick={() => setMenuAbierto(false)}
                    className={({ isActive }) =>
                      isActive
                        ? `${estilos.enlace} ${estilos.enlaceActivo}`
                        : estilos.enlace
                    }
                  >
                    {IconoEnlace && (
                      <IconoEnlace className={estilos.icono} aria-hidden="true" />
                    )}
                    <span>{enlace.etiqueta}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className={estilos.botonCerrarSesion}
          onClick={logout}
        >
          <LogOut className={estilos.icono} aria-hidden="true" />
          <span>Cerrar Sesión</span>
        </button>
      </aside>
    </>
  );
}