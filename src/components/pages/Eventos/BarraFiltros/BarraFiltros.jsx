import { Search, Calendar, ChevronDown } from "lucide-react";
import estilos from "./BarraFiltros.module.css";

const pestañas = [
  { clave: "publicado", etiqueta: "Publicado" },
  { clave: "borrador", etiqueta: "Borradores" },
  { clave: "cancelado", etiqueta: "Cancelado" },
];

/**
 * conteos: { publicado: number, borradores: number, cancelado: number }
 * pestañaActiva / onCambiarPestaña: control del filtro seleccionado
 * valorBusqueda / onCambiarBusqueda: control del input de búsqueda
 * filtroMesActivo / onCambiarFiltroMes: filtro de "Este mes"
 */
export default function BarraFiltros({
  conteos,
  pestañaActiva,
  onCambiarPestaña,
  valorBusqueda,
  onCambiarBusqueda,
  filtroMesActivo,
  onCambiarFiltroMes,
}) {
  return (
    <div className={estilos.barra}>
      <div className={estilos.grupoPestañas} role="tablist" aria-label="Estado del evento">
        {pestañas.map((pestaña) => {
          const activa = pestañaActiva === pestaña.clave;
          return (
            <button
              key={pestaña.clave}
              type="button"
              role="tab"
              aria-selected={activa}
              className={activa ? `${estilos.pildora} ${estilos.pildoraActiva}` : estilos.pildora}
              onClick={() => onCambiarPestaña(pestaña.clave)}
            >
              {pestaña.etiqueta}
              <span className={estilos.contador}>({conteos[pestaña.clave]})</span>
            </button>
          );
        })}
      </div>

      <div className={estilos.grupoAcciones}>
        <div className={estilos.campoBusqueda}>
          <input
            type="search"
            placeholder="Buscar evento"
            value={valorBusqueda}
            onChange={(evento) => onCambiarBusqueda(evento.target.value)}
            aria-label="Buscar evento"
            className={estilos.input}
          />
          <Search className={estilos.iconoBusqueda} aria-hidden="true" />
        </div>

        <button
          type="button"
          className={`${estilos.selectorFecha} ${
            filtroMesActivo ? estilos.selectorFechaActiva : ""
          }`}
          onClick={onCambiarFiltroMes}
          aria-pressed={filtroMesActivo}
        >
          <Calendar className={estilos.iconoSelector} aria-hidden="true" />
          <span>Este Mes</span>
          <ChevronDown className={estilos.iconoChevron} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}