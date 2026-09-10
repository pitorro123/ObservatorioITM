import Header from "../../components/layout/Header/Header.jsx";
import estilos from "./Feedback.module.css";

export default function Feedback() {
  return (
    <div className={estilos.pagina}>
      <div className={estilos.seccionSuperior}>
        <Header rutaBreadcrumb={["Dashboard", "Feedback"]} titulo="Feedback" />
      </div>

      <div className={estilos.contenedor}>
        <div className={estilos.tarjetaResumen}>
          <p>Aquí se mostrarán los comentarios y calificaciones de los eventos.</p>
        </div>
      </div>
    </div>
  );
}