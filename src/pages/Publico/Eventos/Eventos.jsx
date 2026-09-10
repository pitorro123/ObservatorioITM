import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, CalendarDays, MapPin, RotateCcw } from "lucide-react";
import Button from "../../../components/common/Button/Button.jsx";
import { useEventosContext } from "../../../context/EventosContext.jsx";
import { formatearFecha, formatearHora } from "../../../utils/formato.js";
import estilos from "./Eventos.module.css";

export default function Eventos() {
  const { eventosPublicados } = useEventosContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtro, setFiltro] = useState(searchParams.get("tipo") || "todos");
  const [fechaDesde, setFechaDesde] = useState(searchParams.get("desde") || "");
  const [fechaHasta, setFechaHasta] = useState(searchParams.get("hasta") || "");

  const actualizarParams = (nuevoTipo, nuevaDesde, nuevaHasta) => {
    const params = {};
    if (nuevoTipo && nuevoTipo !== "todos") params.tipo = nuevoTipo;
    if (nuevaDesde) params.desde = nuevaDesde;
    if (nuevaHasta) params.hasta = nuevaHasta;
    setSearchParams(params, { replace: true });
  };

  const cambiarFiltro = (clave) => {
    setFiltro(clave);
    actualizarParams(clave, fechaDesde, fechaHasta);
  };

  const cambiarFechaDesde = (valor) => {
    setFechaDesde(valor);
    actualizarParams(filtro, valor, fechaHasta);
  };

  const cambiarFechaHasta = (valor) => {
    setFechaHasta(valor);
    actualizarParams(filtro, fechaDesde, valor);
  };

  const hayFiltrosActivos = filtro !== "todos" || Boolean(fechaDesde) || Boolean(fechaHasta);

  const deshacerCambios = () => {
    setFiltro("todos");
    setFechaDesde("");
    setFechaHasta("");
    setSearchParams({}, { replace: true });
  };

  // Filtrado por fecha
  const eventosPorFecha = eventosPublicados.filter((e) => {
    if (fechaDesde && e.fecha < fechaDesde) return false;
    if (fechaHasta && e.fecha > fechaHasta) return false;
    return true;
  });

  const filtros = [
    { clave: "todos", etiqueta: "Todos", conteo: eventosPorFecha.length },
    {
      clave: "semillero",
      etiqueta: "Semillero",
      conteo: eventosPorFecha.filter((e) => e.tipo === "semillero").length,
    },
    {
      clave: "abierto",
      etiqueta: "Abiertos a la comunidad",
      conteo: eventosPorFecha.filter((e) => e.tipo === "abierto").length,
    },
  ];

  const eventosVisibles = eventosPorFecha.filter((e) => {
    if (filtro !== "todos" && e.tipo !== filtro) return false;
    return true;
  });

  return (
    <section className={estilos.raiz}>
      <h1 className={estilos.title}>Eventos</h1>
      <p className={estilos.subtitle}>
        Consulta el calendario de observaciones, conferencias y talleres abiertos a
        la comunidad.
      </p>

      {/* Controles de filtros */}
      <div className={estilos.panelFiltros}>
        <div className={estilos.filtrosCategorias} role="tablist" aria-label="Filtrar eventos">
          {filtros.map((f) => {
            const activo = filtro === f.clave;
            return (
              <button
                key={f.clave}
                type="button"
                role="tab"
                aria-selected={activo}
                className={activo ? `${estilos.filtro} ${estilos.filtroActivo}` : estilos.filtro}
                onClick={() => cambiarFiltro(f.clave)}
              >
                {f.etiqueta} ({f.conteo})
              </button>
            );
          })}
        </div>

        <div className={estilos.seccionFechas}>
          <div className={estilos.grupoFechas}>
            <div
              className={estilos.campoFecha}
              onClick={(e) => e.currentTarget.querySelector("input")?.showPicker?.()}
            >
              <label htmlFor="filtro-desde" className={estilos.labelFecha}>
                <CalendarDays className={estilos.iconoCampo} aria-hidden="true" />
                <span>Desde:</span>
              </label>
              <input
                id="filtro-desde"
                type="date"
                className={estilos.inputFecha}
                value={fechaDesde}
                max={fechaHasta || undefined}
                onChange={(e) => cambiarFechaDesde(e.target.value)}
              />
            </div>

            <div
              className={estilos.campoFecha}
              onClick={(e) => e.currentTarget.querySelector("input")?.showPicker?.()}
            >
              <label htmlFor="filtro-hasta" className={estilos.labelFecha}>
                <CalendarDays className={estilos.iconoCampo} aria-hidden="true" />
                <span>Hasta:</span>
              </label>
              <input
                id="filtro-hasta"
                type="date"
                className={estilos.inputFecha}
                value={fechaHasta}
                min={fechaDesde || undefined}
                onChange={(e) => cambiarFechaHasta(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className={`${estilos.btnDeshacer} ${hayFiltrosActivos ? estilos.btnDeshacerActivo : ""}`}
            onClick={deshacerCambios}
            disabled={!hayFiltrosActivos}
            title={hayFiltrosActivos ? "Deshacer todos los filtros" : "No hay filtros aplicados"}
          >
            <RotateCcw className={estilos.iconoDeshacer} aria-hidden="true" />
            <span>Deshacer cambios</span>
          </button>
        </div>
      </div>

      {eventosVisibles.length === 0 ? (
        <div className={estilos.sinEventos}>
          <p className={estilos.sinEventosTexto}>
            No se encontraron eventos con los filtros seleccionados.
          </p>
          {hayFiltrosActivos && (
            <button
              type="button"
              className={estilos.btnRestablecerVacio}
              onClick={deshacerCambios}
            >
              <RotateCcw className={estilos.iconoDeshacer} aria-hidden="true" />
              Restablecer filtros y ver todos
            </button>
          )}
        </div>
      ) : (
        <div className={estilos.grid}>
          {eventosVisibles.map((evento) => (
            <article key={evento.id} className={estilos.card}>
              {evento.imagen && (
                <div className={estilos.cardImageWrap}>
                  <img
                    src={evento.imagen}
                    alt={evento.titulo}
                    className={estilos.cardImage}
                  />
                  {evento.tipo === "semillero" && (
                    <span className={estilos.badgeSemillero}>Semillero</span>
                  )}
                </div>
              )}
              <div className={estilos.cardBody}>
                <h2 className={estilos.cardTitle}>{evento.titulo}</h2>
                <p className={estilos.cardDesc}>{evento.descripcion}</p>

                <ul className={estilos.cardMeta}>
                  <li className={estilos.metaItem}>
                    <Clock className={estilos.metaIcon} aria-hidden="true" />
                    {formatearHora(evento.hora)}
                  </li>
                  <li className={estilos.metaItem}>
                    <CalendarDays className={estilos.metaIcon} aria-hidden="true" />
                    {formatearFecha(evento.fecha)}
                  </li>
                  <li className={estilos.metaItem}>
                    <MapPin className={estilos.metaIcon} aria-hidden="true" />
                    {evento.lugar}
                  </li>
                </ul>

                <Button to={`/eventos/${evento.id}`} variant="primary" className={estilos.cardBtn}>
                  Ver detalle
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}