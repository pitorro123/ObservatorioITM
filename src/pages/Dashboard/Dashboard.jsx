import { CalendarClock, CalendarCheck, Users, UserCheck, CalendarDays } from "lucide-react";
import Header from "../../components/layout/Header/Header.jsx";
import { useEventosContext } from "../../context/EventosContext.jsx";
import estilos from "./Dashboard.module.css";

const iconos = {
  CalendarClock: CalendarClock,
  CalendarCheck: CalendarCheck,
  Users: Users,
  UserCheck: UserCheck,
  CalendarDays: CalendarDays,
};

export default function Dashboard() {
  const { resumenDashboard, eventosPublicados } = useEventosContext();

  const indicadores = [
    {
      id: 1,
      etiqueta: "Eventos activos",
      valor: resumenDashboard.eventosActivos,
      icono: "CalendarClock",
    },
    {
      id: 2,
      etiqueta: "Eventos finalizados",
      valor: resumenDashboard.eventosFinalizados,
      icono: "CalendarCheck",
    },
    {
      id: 3,
      etiqueta: "Inscritos totales",
      valor: resumenDashboard.totalInscritos,
      icono: "Users",
    },
    {
      id: 4,
      etiqueta: "Asistentes",
      valor: resumenDashboard.totalAsistentes,
      icono: "UserCheck",
    },
    {
      id: 5,
      etiqueta: "Próximos eventos",
      valor: resumenDashboard.proximosEventos,
      icono: "CalendarDays",
    },
  ];

  return (
    <div className={estilos.pagina}>
      <Header rutaBreadcrumb={["Dashboard"]} titulo="Dashboard" />

      <div className={estilos.tarjetaBienvenida}>
        <h2 className={estilos.tituloBienvenida}>
          Bienvenido al panel del Observatorio Astronómico ITM
        </h2>
        <p className={estilos.textoBienvenida}>
          Aquí puedes gestionar los eventos y consultar las estadísticas de
          participación de la comunidad.
        </p>
      </div>

      <div className={estilos.gridIndicadores}>
        {indicadores.map((indicador) => {
          const IconoIndicador = iconos[indicador.icono];
          return (
            <article key={indicador.id} className={estilos.tarjetaIndicador}>
              <span className={estilos.iconoWrap}>
                {IconoIndicador && (
                  <IconoIndicador className={estilos.icono} aria-hidden="true" />
                )}
              </span>
              <p className={estilos.etiquetaIndicador}>{indicador.etiqueta}</p>
              <p className={estilos.valorIndicador}>{indicador.valor}</p>
            </article>
          );
        })}
      </div>

      <div className={estilos.tarjetaLista}>
        <h3 className={estilos.tituloLista}>Próximos eventos publicados</h3>
        {eventosPublicados.length === 0 ? (
          <p className={estilos.sinEventos}>No hay eventos publicados próximamente.</p>
        ) : (
          <ul className={estilos.lista}>
            {eventosPublicados.slice(0, 5).map((evento) => (
              <li key={evento.id} className={estilos.itemLista}>
                <span className={estilos.bala} aria-hidden="true" />
                <span className={estilos.nombreEvento}>{evento.titulo}</span>
                <span className={estilos.fechaEvento}>{evento.fecha}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}