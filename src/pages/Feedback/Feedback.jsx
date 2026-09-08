import Header from "../../components/layout/Header/Header.jsx";
import estilos from "./Feedback.module.css";

export default function Feedback() {
  return (
    <div className={estilos.pagina}>
      <Header rutaBreadcrumb={["Dashboard", "Feedback"]} titulo="Feedback" />
      <div className={estilos.tarjetaResumen}>
        <p>Aquí se mostrarán los comentarios y calificaciones de los eventos.</p>
      </div>
    </div>
  );
}
