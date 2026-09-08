import { Clock, CalendarDays, MapPin } from "lucide-react";
import Button from "../../../components/common/Button/Button.jsx";
import { useEventosContext } from "../../../context/EventosContext.jsx";
import { formatearFecha, formatearHora } from "../../../utils/formato.js";
import estilos from "./Eventos.module.css";

export default function Eventos() {
  const { eventosPublicados } = useEventosContext();

  return (
    <section className={estilos.raiz}>
      <h1 className={estilos.title}>Eventos</h1>
      <p className={estilos.subtitle}>
        Consulta el calendario de observaciones, conferencias y talleres abiertos a
        la comunidad.
      </p>

      {eventosPublicados.length === 0 ? (
        <p className={estilos.sinEventos}>
          Próximamente se publicarán nuevas actividades del observatorio.
        </p>
      ) : (
        <div className={estilos.grid}>
          {eventosPublicados.map((evento) => (
            <article key={evento.id} className={estilos.card}>
              {evento.imagen && (
                <div className={estilos.cardImageWrap}>
                  <img
                    src={evento.imagen}
                    alt={evento.titulo}
                    className={estilos.cardImage}
                  />
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